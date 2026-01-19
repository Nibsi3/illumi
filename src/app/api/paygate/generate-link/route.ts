import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Service role client for reading secrets (bypasses RLS)
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY
    )
    if (!serviceKey) {
        return null
    }
    return createClient(url, serviceKey)
}

// Helper to get workspace keys from Supabase
async function getWorkspaceKeys(workspaceId: string, provider: string, mode: 'test' | 'live') {
    const client = getServiceClient()
    if (!client) return null

    const { data: keys } = await client
        .from('workspace_paygate_keys')
        .select('key_name, key_value')
        .eq('workspace_id', workspaceId)
        .eq('provider', provider)
        .eq('mode', mode)

    if (!keys || keys.length === 0) return null

    const result: Record<string, string> = {}
    for (const row of keys) {
        result[row.key_name] = row.key_value
    }
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

        // Determine the base URL for callbacks
        const host = req.headers.get('host')
        const protocol = req.headers.get('x-forwarded-proto') || 'http'
        const domain = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`

        // Get workspace settings to determine test/live mode
        let testMode = true
        if (workspaceId) {
            const settings = await getWorkspaceSettings(workspaceId)
            if (settings) {
                testMode = settings.test_mode ?? true
            }
        }
        const mode = testMode ? 'test' : 'live'

        // PayFast Implementation
        if (provider === 'payfast') {
            const baseUrl = testMode 
                ? "https://sandbox.payfast.co.za/eng/process"
                : "https://www.payfast.co.za/eng/process"

            // Try to get keys from Supabase first, fallback to env vars
            let merchantId = process.env.PAYFAST_MERCHANT_ID || "10000100"
            let merchantKey = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a"
            
            if (workspaceId) {
                const keys = await getWorkspaceKeys(workspaceId, 'payfast', mode)
                if (keys) {
                    merchantId = keys.merchant_id || merchantId
                    merchantKey = keys.secret_key || merchantKey
                }
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
            // Try to get key from Supabase first, fallback to env var
            let yocoSecretKey = (process.env.YOCO_SECRET_KEY || '').trim()
            
            if (workspaceId) {
                const keys = await getWorkspaceKeys(workspaceId, 'yoco', mode)
                if (keys?.secret_key) {
                    yocoSecretKey = keys.secret_key.trim()
                }
            }
            
            if (!yocoSecretKey) {
                return NextResponse.json(
                    { success: false, error: "Yoco secret key not configured. Go to Settings > PayGate and add your Yoco API keys.", provider: 'yoco' },
                    { status: 400 }
                )
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
