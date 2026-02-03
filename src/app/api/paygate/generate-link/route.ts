import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from 'stripe'

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
        const { invoiceId, amount, currency, provider, invoiceNumber, workspaceId, email } = await req.json()
        
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

        // Stripe Implementation
        if (provider === 'stripe') {
            let stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()

            if (resolvedWorkspaceId) {
                const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'stripe', mode)
                if (keys?.secret_key) {
                    stripeSecretKey = keys.secret_key.trim()
                }
            }

            if (!stripeSecretKey) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Stripe secret key not configured. Add Stripe keys in Settings > PayGate or set STRIPE_SECRET_KEY on the server.',
                        provider: 'stripe',
                    },
                    { status: 500 }
                )
            }

            const amountCents = Math.round(Number(amount) * 100)
            if (!Number.isFinite(amountCents) || amountCents <= 0) {
                return NextResponse.json(
                    { success: false, error: 'Invalid amount', provider: 'stripe' },
                    { status: 400 }
                )
            }

            const customerEmail = (typeof email === 'string' && email.trim()) ? email.trim() : undefined
            const successUrl = `${domain}/pay/${invoiceId}?status=success&provider=stripe&session_id={CHECKOUT_SESSION_ID}`
            const cancelUrl = `${domain}/pay/${invoiceId}?status=cancelled&provider=stripe`

            const stripe = new Stripe(stripeSecretKey)
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                customer_email: customerEmail,
                success_url: successUrl,
                cancel_url: cancelUrl,
                line_items: [
                    {
                        quantity: 1,
                        price_data: {
                            currency: (currency || 'ZAR').toLowerCase(),
                            unit_amount: amountCents,
                            product_data: {
                                name: `Invoice ${invoiceNumber || invoiceId}`,
                            },
                        },
                    },
                ],
                metadata: {
                    invoiceId: String(invoiceId),
                    invoiceNumber: String(invoiceNumber || ''),
                    provider: 'stripe',
                },
            })

            if (!session.url) {
                return NextResponse.json(
                    { success: false, error: 'Stripe session missing url', provider: 'stripe' },
                    { status: 502 }
                )
            }

            return NextResponse.json({
                success: true,
                link: session.url,
                provider: 'stripe',
                reference: session.id,
            })
        }


        // PayFast Implementation
        if (provider === 'payfast') {
            console.log('[PayFast] testMode:', testMode, 'mode:', mode, 'settingsFound:', settingsFound)
            
            const baseUrl = testMode 
                ? "https://sandbox.payfast.co.za/eng/process"
                : "https://www.payfast.co.za/eng/process"

            // Try to get keys from Supabase first, fallback to env vars
            let merchantId = (process.env.PAYFAST_MERCHANT_ID || '').trim()
            let merchantKey = (process.env.PAYFAST_MERCHANT_KEY || '').trim()
            
            if (resolvedWorkspaceId) {
                const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'payfast', mode)
                console.log('[PayFast] Keys from DB for mode', mode, ':', keys ? Object.keys(keys) : 'none')
                if (keys) {
                    merchantId = keys.merchant_id || merchantId
                    merchantKey = keys.merchant_key || keys.secret_key || merchantKey
                }
            }
            
            console.log('[PayFast] Using merchantId:', merchantId?.substring(0, 4) + '...', 'baseUrl:', baseUrl)

            if (!merchantId || !merchantKey) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "PayFast credentials not configured. Add PayFast keys in Settings > PayGate or set PAYFAST_MERCHANT_ID/PAYFAST_MERCHANT_KEY on the server.",
                    },
                    { status: 500 }
                )
            }

            // PayFast requires amount in format "100.00" (2 decimal places)
            const amountNum = Number(amount)
            if (!Number.isFinite(amountNum) || amountNum <= 0) {
                return NextResponse.json(
                    { success: false, error: 'Invalid amount', provider: 'payfast' },
                    { status: 400 }
                )
            }
            const formattedAmount = amountNum.toFixed(2)

            const params = new URLSearchParams({
                merchant_id: merchantId,
                merchant_key: merchantKey,
                return_url: `${domain}/pay/${invoiceId}?status=success`,
                cancel_url: `${domain}/pay/${invoiceId}?status=cancelled`,
                notify_url: `${domain}/api/payfast/notify`,
                amount: formattedAmount,
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
            let paystackSecretKey = (process.env.PAYSTACK_SECRET_KEY || '').trim()

            if (resolvedWorkspaceId) {
                const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'paystack', mode)
                if (keys?.secret_key) {
                    paystackSecretKey = keys.secret_key.trim()
                }
            }

            if (!paystackSecretKey) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Paystack secret key not configured. Add Paystack keys in Settings > PayGate or set PAYSTACK_SECRET_KEY on the server.",
                        provider: 'paystack',
                    },
                    { status: 500 }
                )
            }

            const amountKobo = Math.round(Number(amount) * 100)
            if (!Number.isFinite(amountKobo) || amountKobo <= 0) {
                return NextResponse.json(
                    { success: false, error: 'Invalid amount', provider: 'paystack' },
                    { status: 400 }
                )
            }

            const customerEmail = (typeof email === 'string' && email.trim()) ? email.trim() : 'customer@example.com'
            const reference = String(invoiceNumber || invoiceId)
            const callback_url = `${domain}/pay/${invoiceId}?status=success&provider=paystack`

            const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: customerEmail,
                    amount: amountKobo,
                    currency: currency || 'ZAR',
                    reference,
                    callback_url,
                    metadata: {
                        invoiceId,
                        invoiceNumber: invoiceNumber || null,
                    },
                }),
            })

            const initJson = await initRes.json().catch(() => null)
            if (!initRes.ok) {
                const message = (initJson && (initJson.message || initJson.error)) || `Paystack initialize failed (${initRes.status})`
                return NextResponse.json(
                    { success: false, error: message, provider: 'paystack' },
                    { status: 502 }
                )
            }

            const authorizationUrl = initJson?.data?.authorization_url
            if (!authorizationUrl) {
                return NextResponse.json(
                    { success: false, error: 'Paystack response missing authorization_url', provider: 'paystack' },
                    { status: 502 }
                )
            }

            return NextResponse.json({
                success: true,
                link: authorizationUrl,
                provider: 'paystack',
                reference,
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

        // Netcash Implementation
        if (provider === 'netcash') {
            let netcashServiceKey = ''
            let netcashApiKey = ''

            if (resolvedWorkspaceId) {
                const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'netcash', mode)
                if (keys) {
                    netcashServiceKey = (keys.service_key || '').trim()
                    netcashApiKey = (keys.api_key || '').trim()
                }
            }

            if (!netcashServiceKey || !netcashApiKey) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Netcash credentials not configured. Add Netcash keys in Settings > PayGate.',
                        provider: 'netcash',
                    },
                    { status: 500 }
                )
            }

            const amountCents = Math.round(Number(amount) * 100)
            if (!Number.isFinite(amountCents) || amountCents <= 0) {
                return NextResponse.json(
                    { success: false, error: 'Invalid amount', provider: 'netcash' },
                    { status: 400 }
                )
            }

            const successUrl = `${domain}/pay/${invoiceId}?status=success&provider=netcash`
            const cancelUrl = `${domain}/pay/${invoiceId}?status=cancelled&provider=netcash`

            // Netcash Pay Now API
            const netcashRes = await fetch('https://paynow.netcash.co.za/site/paynow.aspx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    m1: netcashServiceKey,
                    m2: netcashApiKey,
                    p2: invoiceNumber || invoiceId,
                    p3: `Invoice ${invoiceNumber || invoiceId}`,
                    p4: String(amount),
                    Budget: 'N',
                    m4: invoiceId,
                    m5: successUrl,
                    m6: cancelUrl,
                    m9: email || '',
                }).toString(),
            })

            // Netcash returns a redirect URL or payment key
            const netcashText = await netcashRes.text().catch(() => '')
            
            // For now, construct the payment URL directly
            const paymentUrl = `https://paynow.netcash.co.za/site/paynow.aspx?m1=${encodeURIComponent(netcashServiceKey)}&m2=${encodeURIComponent(netcashApiKey)}&p2=${encodeURIComponent(invoiceNumber || invoiceId)}&p3=${encodeURIComponent(`Invoice ${invoiceNumber || invoiceId}`)}&p4=${amount}&Budget=N&m4=${encodeURIComponent(invoiceId)}&m5=${encodeURIComponent(successUrl)}&m6=${encodeURIComponent(cancelUrl)}&m9=${encodeURIComponent(email || '')}`

            return NextResponse.json({
                success: true,
                link: paymentUrl,
                provider: 'netcash',
                reference: invoiceNumber || invoiceId,
            })
        }

        // Stitch Implementation
        if (provider === 'stitch') {
            let stitchClientId = ''
            let stitchClientSecret = ''

            if (resolvedWorkspaceId) {
                const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'stitch', mode)
                if (keys) {
                    stitchClientId = (keys.client_id || '').trim()
                    stitchClientSecret = (keys.client_secret || '').trim()
                }
            }

            if (!stitchClientId || !stitchClientSecret) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Stitch credentials not configured. Add Stitch keys in Settings > PayGate.',
                        provider: 'stitch',
                    },
                    { status: 500 }
                )
            }

            // Step 1: Get access token using client credentials
            const tokenRes = await fetch('https://secure.stitch.money/connect/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: stitchClientId,
                    client_secret: stitchClientSecret,
                    scope: 'client_paymentrequest',
                }).toString(),
            })

            const tokenData = await tokenRes.json().catch(() => null)
            if (!tokenRes.ok || !tokenData?.access_token) {
                const message = tokenData?.error_description || tokenData?.error || `Stitch auth failed (${tokenRes.status})`
                return NextResponse.json(
                    { success: false, error: message, provider: 'stitch' },
                    { status: 502 }
                )
            }

            const accessToken = tokenData.access_token

            // Step 2: Create payment request via GraphQL
            const amountCents = Math.round(Number(amount) * 100)
            if (!Number.isFinite(amountCents) || amountCents <= 0) {
                return NextResponse.json(
                    { success: false, error: 'Invalid amount', provider: 'stitch' },
                    { status: 400 }
                )
            }

            const successUrl = `${domain}/pay/${invoiceId}?status=success&provider=stitch`
            const cancelUrl = `${domain}/pay/${invoiceId}?status=cancelled&provider=stitch`

            const graphqlQuery = `
                mutation CreatePaymentRequest($input: PaymentRequestInput!) {
                    clientPaymentInitiationRequestCreate(input: $input) {
                        paymentInitiationRequest {
                            id
                            url
                        }
                    }
                }
            `

            const graphqlVariables = {
                input: {
                    amount: {
                        quantity: amountCents,
                        currency: (currency || 'ZAR').toUpperCase(),
                    },
                    payerReference: invoiceNumber || invoiceId,
                    beneficiaryReference: invoiceNumber || invoiceId,
                    externalReference: invoiceId,
                    merchant: {
                        name: 'Invoice Payment',
                    },
                    paymentMethods: ['card', 'instantEft'],
                },
            }

            const gqlRes = await fetch('https://api.stitch.money/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    query: graphqlQuery,
                    variables: graphqlVariables,
                }),
            })

            const gqlData = await gqlRes.json().catch(() => null)
            const paymentRequest = gqlData?.data?.clientPaymentInitiationRequestCreate?.paymentInitiationRequest

            if (!paymentRequest?.url) {
                const errorMessage = gqlData?.errors?.[0]?.message || 'Stitch payment request creation failed'
                return NextResponse.json(
                    { success: false, error: errorMessage, provider: 'stitch' },
                    { status: 502 }
                )
            }

            return NextResponse.json({
                success: true,
                link: paymentRequest.url,
                provider: 'stitch',
                reference: paymentRequest.id,
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
