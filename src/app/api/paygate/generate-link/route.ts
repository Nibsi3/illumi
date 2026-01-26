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
                            currency: (currency || 'USD').toLowerCase(),
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


        // Generic fallback for unknown providers (Stripe is handled above)
        const paymentLink = `https://pay.illumiinvoice.com/${provider}/${invoiceId}?amt=${amount}&cur=${currency}`

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
