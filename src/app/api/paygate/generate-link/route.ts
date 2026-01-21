import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const API_BUILD_MARKER = 'generate-link@2026-01-20T09:47Z'

// Service role client for reading secrets (bypasses RLS)
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) {
        console.log('[getServiceClient] Missing NEXT_PUBLIC_SUPABASE_URL')
        return null
    }
    const serviceKey = (
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SERVICE_ROLE_KEY
    )
    if (!serviceKey) {
        console.log('[getServiceClient] No service role key found')
        return null
    }
    return createClient(url, serviceKey)
}

function isUuid(value: unknown): value is string {
    return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

async function resolveWorkspaceIdFromInvoiceId(invoiceId: unknown): Promise<string | null> {
    if (!isUuid(invoiceId)) return null
    const client = getServiceClient()
    if (!client) return null

    const { data, error } = await client
        .from('invoices')
        .select('workspace_id')
        .eq('id', invoiceId)
        .single()

    if (error || !data?.workspace_id) return null
    return data.workspace_id
}

export async function GET() {
    // Don't expose runtime environment diagnostics publicly.
    return NextResponse.json({ success: false, marker: API_BUILD_MARKER }, { status: 404 })
}

// Helper to get workspace keys from Supabase
async function getWorkspaceKeys(workspaceId: string, provider: string, mode: 'test' | 'live') {
    const client = getServiceClient()
    if (!client) {
        console.log('[getWorkspaceKeys] No service client - missing service role key env var')
        console.log('[getWorkspaceKeys] Available env vars:', {
            hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            hasSupabaseServiceRoleSecret: !!process.env.SUPABASE_SERVICE_ROLE_SECRET,
            hasSupabaseServiceRole: !!process.env.SUPABASE_SERVICE_ROLE,
            hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
            hasServiceRoleKey: !!process.env.SERVICE_ROLE_KEY,
        })
        return null
    }

    const { data: keys, error } = await client
        .from('workspace_paygate_keys')
        .select('key_name, key_value')
        .eq('workspace_id', workspaceId)
        .eq('provider', provider)
        .eq('mode', mode)

    if (error) {
        console.log('[getWorkspaceKeys] Query error:', error.message)
        return null
    }

    if (!keys || keys.length === 0) {
        console.log('[getWorkspaceKeys] No keys found for:', { workspaceId, provider, mode })
        return null
    }

    const result: Record<string, string> = {}
    for (const row of keys) {
        result[row.key_name] = row.key_value
    }
    console.log('[getWorkspaceKeys] Found keys:', Object.keys(result))
    return result
}

// Helper to get workspace settings from Supabase
async function getWorkspaceSettings(workspaceId: string) {
    const client = getServiceClient()
    if (!client) return null

    const { data } = await client
        .from('workspace_paygate_settings')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single()

    return data
}

// PayGate link generator
export async function POST(req: Request) {
    try {
        const { invoiceId, amount, currency, provider, invoiceNumber, workspaceId } = await req.json()
        
        const resolvedWorkspaceId =
            (isUuid(workspaceId) ? workspaceId : null) || (await resolveWorkspaceIdFromInvoiceId(invoiceId))

        const hasServiceClient = !!getServiceClient()
        console.log('[PayGate] Request:', { invoiceId, provider, workspaceId: resolvedWorkspaceId, amount })

        // Determine the base URL for callbacks
        const host = req.headers.get('host')
        const protocol = req.headers.get('x-forwarded-proto') || 'http'
        const domain = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`

        // Get workspace settings to determine test/live mode
        let testMode = true
        let settingsFound = false
        if (resolvedWorkspaceId) {
            const settings = await getWorkspaceSettings(resolvedWorkspaceId)
            if (settings) {
                testMode = settings.test_mode ?? true
                settingsFound = true
            }
        }
        const mode = testMode ? 'test' : 'live'

        // PayFast Implementation
        if (provider === 'payfast') {
            const baseUrl = testMode 
                ? "https://sandbox.payfast.co.za/eng/process"
                : "https://www.payfast.co.za/eng/process"

            // Try to get keys from Supabase first, fallback to env vars
            let merchantId = (process.env.PAYFAST_MERCHANT_ID || '').trim()
            let merchantKey = (process.env.PAYFAST_MERCHANT_KEY || '').trim()
            
            if (resolvedWorkspaceId) {
                const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'payfast', mode)
                if (keys) {
                    merchantId = keys.merchant_id || merchantId
                    merchantKey = keys.secret_key || merchantKey
                }
            }

            if (!merchantId || !merchantKey) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "PayFast credentials not configured. Add PayFast keys in Settings > PayGate or set PAYFAST_MERCHANT_ID/PAYFAST_MERCHANT_KEY on the server.",
                    },
                    { status: 500 }
                )
            }

            const params = new URLSearchParams({
                merchant_id: merchantId,
                merchant_key: merchantKey,
                return_url: `${domain}/pay/${invoiceId}?status=success`,
                cancel_url: `${domain}/pay/${invoiceId}?status=cancelled`,
                notify_url: `${domain}/api/webhooks/paygate`,
                amount: amount.toString(),
                item_name: `Invoice ${invoiceNumber || invoiceId}`,
                m_payment_id: invoiceId
            })

            return NextResponse.json({
                success: true,
                link: `${baseUrl}?${params.toString()}`,
                provider: 'payfast'
            })
        }

        // Yoco Implementation - Checkout API
        if (provider === 'yoco') {
            // Try to get key from Supabase first, then env var
            let yocoSecretKey = ''
            let dbKeyFound = false
            
            // 1. Try workspace-specific keys from DB
            if (resolvedWorkspaceId) {
                const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'yoco', mode)
                if (keys?.secret_key) {
                    yocoSecretKey = keys.secret_key.trim()
                    dbKeyFound = true
                    console.log('[Yoco] Using DB key for workspace:', resolvedWorkspaceId)
                }
            }
            
            // 2. Fallback to env var
            const envYocoKeyPresent = !!(process.env.YOCO_SECRET_KEY || '').trim()
            if (!yocoSecretKey) {
                yocoSecretKey = (process.env.YOCO_SECRET_KEY || '').trim()
                if (yocoSecretKey) {
                    console.log('[Yoco] Using env var YOCO_SECRET_KEY')
                }
            }
            
            // 3. Final check
            if (!yocoSecretKey) {
                console.log('[Yoco] No key found. workspaceId:', resolvedWorkspaceId, 'mode:', mode)
                const res = NextResponse.json(
                    {
                        success: false,
                        error: "Yoco secret key not configured. Go to Settings > PayGate and add your Yoco API keys.",
                        provider: 'yoco',
                        debug: {
                            invoiceId: isUuid(invoiceId) ? invoiceId : null,
                            providedWorkspaceId: isUuid(workspaceId) ? workspaceId : null,
                            resolvedWorkspaceId,
                            hasServiceClient,
                            settingsFound,
                            testMode,
                            mode,
                            envYocoKeyPresent,
                            dbLookupAttempted: !!resolvedWorkspaceId,
                            dbKeyFound,
                        },
                    },
                    { status: 400 }
                )
                res.headers.set('Cache-Control', 'no-store')
                return res
            }

            if (!yocoSecretKey.startsWith('sk_test_') && !yocoSecretKey.startsWith('sk_live_')) {
                return NextResponse.json(
                    { success: false, error: "Invalid Yoco secret key format (expected sk_test_... or sk_live_...)", provider: 'yoco' },
                    { status: 400 }
                )
            }

            const amountCents = Math.round(Number(amount) * 100)
            if (!Number.isFinite(amountCents) || amountCents <= 0) {
                return NextResponse.json(
                    { success: false, error: "Invalid amount" },
                    { status: 400 }
                )
            }

            if (amountCents < 200) {
                return NextResponse.json(
                    { success: false, error: "Amount must be at least R2.00 for Yoco" },
                    { status: 400 }
                )
            }

            const successUrl = `${domain}/pay/${invoiceId}?status=success&provider=yoco`
            const cancelUrl = `${domain}/pay/${invoiceId}?status=cancelled&provider=yoco`
            const failureUrl = `${domain}/pay/${invoiceId}?status=failed&provider=yoco`

            const yocoRes = await fetch('https://payments.yoco.com/api/checkouts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${yocoSecretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountCents,
                    currency: currency || 'ZAR',
                    successUrl,
                    cancelUrl,
                    failureUrl,
                    externalId: invoiceNumber || invoiceId,
                    metadata: {
                        invoiceId,
                        invoiceNumber: invoiceNumber || null,
                    },
                }),
            })

            const yocoData = await yocoRes.json().catch(() => null)
            if (!yocoRes.ok) {
                const message = (yocoData && (yocoData.message || yocoData.error)) || `Yoco checkout failed (${yocoRes.status})`
                return NextResponse.json(
                    { success: false, error: message, provider: 'yoco' },
                    { status: 502 }
                )
            }

            if (!yocoData?.redirectUrl) {
                return NextResponse.json(
                    { success: false, error: "Yoco response missing redirectUrl", provider: 'yoco' },
                    { status: 502 }
                )
            }

            return NextResponse.json({
                success: true,
                link: yocoData.redirectUrl,
                provider: 'yoco'
            })
        }

        // PayStack Implementation
        if (provider === 'paystack') {
            const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || ''
            
            // PayStack hosted checkout
            return NextResponse.json({
                success: true,
                link: `https://checkout.paystack.com/initialize?amount=${Math.round(amount * 100)}&email=customer@example.com&reference=${invoiceNumber || invoiceId}&callback_url=${encodeURIComponent(`${domain}/pay/${invoiceId}?status=success`)}`,
                provider: 'paystack'
            })
        }

        // Ozow Implementation
        if (provider === 'ozow') {
            return NextResponse.json({
                success: true,
                link: `https://pay.ozow.com/?amount=${amount}&reference=${invoiceNumber || invoiceId}&cancelUrl=${encodeURIComponent(`${domain}/pay/${invoiceId}?status=cancelled`)}&successUrl=${encodeURIComponent(`${domain}/pay/${invoiceId}?status=success`)}`,
                provider: 'ozow'
            })
        }

        // Peach Payments Implementation
        if (provider === 'peach') {
            return NextResponse.json({
                success: true,
                link: `https://checkout.peachpayments.com/?amount=${amount}&currency=${currency}&reference=${invoiceNumber || invoiceId}`,
                provider: 'peach'
            })
        }

        // Generic fallback for unknown providers
        const paymentLink = `https://pay.illumi.co.za/${provider}/${invoiceId}?amt=${amount}&cur=${currency}`

        return NextResponse.json({
            success: true,
            link: paymentLink,
            provider,
            reference: `INV-${invoiceId}-${Date.now()}`
        })
    } catch (error) {
        console.error('[Generate Link Error]:', error)
        return NextResponse.json({ success: false, error: "Failed to generate link" }, { status: 500 })
    }
}
