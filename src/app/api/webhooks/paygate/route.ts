import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createNotification } from "@/lib/notifications"
import Stripe from 'stripe'

// PayGate webhook handler
export async function POST(req: Request) {
    // Create service role client inside function to avoid build-time errors
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )

    try {
        const stripeSig = req.headers.get('stripe-signature')
        if (stripeSig) {
            const stripeSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim()
            if (!stripeSecret) {
                return NextResponse.json({ success: false, error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 })
            }

            const body = await req.text()
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
            const event = stripe.webhooks.constructEvent(body, stripeSig, stripeSecret)

            if (event.type === 'checkout.session.completed') {
                const session: any = event.data.object
                const invoiceId = session?.metadata?.invoiceId
                if (!invoiceId) {
                    return new Response('OK', { status: 200 })
                }

                const now = new Date().toISOString()

                const { data: invoice } = await supabase
                    .from('invoices')
                    .select('id, invoice_number, total, currency, user_id, status, workspace_id, customers(name)')
                    .eq('id', invoiceId)
                    .single()

                await supabase
                    .from('invoices')
                    .update({
                        status: 'paid',
                        paid_at: now,
                        updated_at: now,
                    })
                    .eq('id', invoiceId)

                await supabase
                    .from('payments')
                    .insert([
                        {
                            invoice_id: invoiceId,
                            amount: invoice?.total || 0,
                            currency: invoice?.currency || 'ZAR',
                            provider: 'stripe',
                            provider_transaction_id: session?.payment_intent || session?.id,
                            status: 'completed',
                            paid_at: now,
                            metadata: session,
                        },
                    ])

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
            }

            return new Response('OK', { status: 200 })
        }

        // PayFast sends application/x-www-form-urlencoded
        const contentType = req.headers.get("content-type") || ""
        let payload: any = {}

        if (contentType.includes("form")) {
            const formData = await req.formData()
            formData.forEach((value, key) => {
                payload[key] = value
            })
        } else {
            payload = await req.json()
        }

        console.log("[PayGate Webhook] Payload:", payload)

        // Map PayFast fields or use generic ones
        const invoiceId = payload.m_payment_id || payload.invoiceId
        const rawStatus = (payload.payment_status || payload.status || "").toUpperCase()
        const transactionId = payload.pf_payment_id || payload.transactionId
        const amount = payload.amount_gross || payload.amount
        const provider = payload.payment_status ? 'payfast' : (payload.provider || 'generic')

        if (!invoiceId) {
            console.error('[PayGate Webhook] No invoiceId found in payload')
            return NextResponse.json({ error: "Missing invoice reference" }, { status: 400 })
        }

        console.log(`[PayGate Webhook] Processing ${invoiceId} | Status: ${rawStatus}`)

        // Get invoice details for notification
        const { data: invoice } = await supabase
            .from('invoices')
            .select('id, invoice_number, total, currency, user_id, status, workspace_id, customers(name)')
            .eq('id', invoiceId)
            .single()

        const isPaid = rawStatus === 'COMPLETE' || rawStatus === 'PAID' || rawStatus === 'SUCCESS'
        const isFailed = rawStatus === 'FAILED' || rawStatus === 'CANCELLED'

        const invoiceStatus = isPaid ? 'paid' : (isFailed ? 'overdue' : 'sent')

        // Update invoice status in database
        const { error: invoiceError } = await supabase
            .from('invoices')
            .update({
                status: invoiceStatus,
                paid_at: isPaid ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', invoiceId)

        if (invoiceError) {
            console.error('[PayGate Webhook] Invoice update error:', invoiceError)
        }

        // Create payment record
        const paymentStatus = isPaid ? 'completed' : (isFailed ? 'failed' : 'pending')

        const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
                invoice_id: invoiceId,
                amount: parseFloat(amount) || 0,
                currency: 'ZAR',
                provider: provider,
                provider_transaction_id: transactionId,
                status: paymentStatus,
                paid_at: isPaid ? new Date().toISOString() : null,
                metadata: payload
            }])

        if (paymentError) {
            console.error('[PayGate Webhook] Payment record error:', paymentError)
        }

        // Create notification for user on successful payment
        if (isPaid && invoice) {
            await createNotification({
                userId: invoice.user_id,
                type: 'payment_received',
                title: `Payment received for ${invoice.invoice_number}`,
                message: `${(invoice.customers as any)?.name || 'Customer'} paid via ${provider}`,
                invoiceId: invoice.id,
                amount: parseFloat(amount) || invoice.total
            })
        }

        // PayFast requirement: respond with 200 OK
        return new Response("OK", { status: 200 })
    } catch (error) {
        console.error('[PayGate Webhook] Error:', error)
        return NextResponse.json({ success: false, error: "Webhook Error" }, { status: 400 })
    }
}
