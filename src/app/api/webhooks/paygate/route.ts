import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a service role client for webhook processing (bypasses RLS)
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
)

// PayGate webhook handler
export async function POST(req: Request) {
    try {
        const payload = await req.json()
        const { invoiceId, status, transactionId, amount, provider } = payload

        console.log(`[PayGate Webhook] Received update for ${invoiceId}: ${status}`)

        // Map provider status to our status
        const invoiceStatus = status === 'completed' || status === 'paid' ? 'paid' :
            status === 'failed' ? 'overdue' : 'sent'

        // Update invoice status in database
        const { error: invoiceError } = await supabase
            .from('invoices')
            .update({
                status: invoiceStatus,
                paid_at: invoiceStatus === 'paid' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', invoiceId)

        if (invoiceError) {
            console.error('[PayGate Webhook] Invoice update error:', invoiceError)
        }

        // Create payment record
        const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
                invoice_id: invoiceId,
                amount: amount || 0,
                currency: 'ZAR',
                provider: provider || 'payfast',
                provider_transaction_id: transactionId,
                status: status === 'completed' || status === 'paid' ? 'completed' : status,
                paid_at: status === 'completed' || status === 'paid' ? new Date().toISOString() : null,
                metadata: payload
            }])

        if (paymentError) {
            console.error('[PayGate Webhook] Payment record error:', paymentError)
        }

        return NextResponse.json({
            received: true,
            processedAt: new Date().toISOString(),
            status: "success",
            invoiceUpdated: !invoiceError,
            paymentRecorded: !paymentError
        })
    } catch (error) {
        console.error('[PayGate Webhook] Error:', error)
        return NextResponse.json({ success: false, error: "Webhook Error" }, { status: 400 })
    }
}
