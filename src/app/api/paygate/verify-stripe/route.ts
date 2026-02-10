import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from 'stripe'
import { createNotification } from "@/lib/notifications"

function getServiceClient() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )
}

function isUuid(value: unknown): value is string {
    return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

async function resolveWorkspaceIdFromInvoiceId(invoiceId: unknown): Promise<string | null> {
    if (!isUuid(invoiceId)) return null
    const client = getServiceClient()

    const { data, error } = await client
        .from('invoices')
        .select('workspace_id')
        .eq('id', invoiceId)
        .single()

    if (error || !data?.workspace_id) return null
    return data.workspace_id
}

async function getWorkspaceSettings(workspaceId: string) {
    const client = getServiceClient()
    const { data } = await client
        .from('workspace_paygate_settings')
        .select('id, workspace_id, active_provider, connected_providers, test_mode, created_at, updated_at')
        .eq('workspace_id', workspaceId)
        .single()

    return data
}

async function getWorkspaceKeys(workspaceId: string, provider: string, mode: 'test' | 'live') {
    const client = getServiceClient()

    const { data: keys, error } = await client
        .from('workspace_paygate_keys')
        .select('key_name, key_value')
        .eq('workspace_id', workspaceId)
        .eq('provider', provider)
        .eq('mode', mode)

    if (error || !keys) return null

    const result: Record<string, string> = {}
    for (const row of keys) {
        result[row.key_name] = row.key_value
    }
    return result
}

export async function POST(req: Request) {
    try {
        const { invoiceId, sessionId, workspaceId } = await req.json()

        if (!invoiceId || !sessionId) {
            return NextResponse.json({ success: false, error: 'Missing invoiceId or sessionId' }, { status: 400 })
        }

        const resolvedWorkspaceId =
            (isUuid(workspaceId) ? workspaceId : null) || (await resolveWorkspaceIdFromInvoiceId(invoiceId))

        if (!resolvedWorkspaceId) {
            return NextResponse.json({ success: false, error: 'Unable to resolve workspace' }, { status: 400 })
        }

        const settings = await getWorkspaceSettings(resolvedWorkspaceId)
        const testMode = settings?.test_mode ?? true
        const mode: 'test' | 'live' = testMode ? 'test' : 'live'

        let stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()
        const keys = await getWorkspaceKeys(resolvedWorkspaceId, 'stripe', mode)
        if (keys?.secret_key) {
            stripeSecretKey = keys.secret_key.trim()
        }

        if (!stripeSecretKey) {
            return NextResponse.json({ success: false, error: 'Stripe secret key not configured' }, { status: 500 })
        }

        const stripe = new Stripe(stripeSecretKey)
        const session = await stripe.checkout.sessions.retrieve(String(sessionId))

        const isPaid = session.payment_status === 'paid'
        if (!isPaid) {
            return NextResponse.json({ success: false, error: 'Payment not completed yet' }, { status: 402 })
        }

        const supabase = getServiceClient()

        const { data: invoice } = await supabase
            .from('invoices')
            .select('id, invoice_number, total, currency, user_id, status, workspace_id, customers(name)')
            .eq('id', invoiceId)
            .single()

        const now = new Date().toISOString()

        const { error: invoiceError } = await supabase
            .from('invoices')
            .update({
                status: 'paid',
                paid_at: now,
                updated_at: now,
            })
            .eq('id', invoiceId)

        if (invoiceError) {
            return NextResponse.json({ success: false, error: invoiceError.message }, { status: 500 })
        }

        const { error: paymentError } = await supabase
            .from('payments')
            .insert([
                {
                    invoice_id: invoiceId,
                    amount: invoice?.total || 0,
                    currency: invoice?.currency || 'ZAR',
                    provider: 'stripe',
                    provider_transaction_id: session.payment_intent || session.id,
                    status: 'completed',
                    paid_at: now,
                    metadata: session,
                },
            ])

        if (paymentError) {
            // ignore
        }

        if (invoice?.user_id) {
            await createNotification({
                userId: invoice.user_id,
                type: 'payment_received',
                title: `Payment received for ${invoice.invoice_number}`,
                message: `${(invoice.customers as any)?.name || 'Customer'} paid via stripe`,
                invoiceId: invoice.id,
                amount: invoice.total,
            })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message || 'Stripe verification failed' }, { status: 500 })
    }
}
