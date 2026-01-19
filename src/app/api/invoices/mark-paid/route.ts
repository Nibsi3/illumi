import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createNotification } from "@/lib/notifications"

// Fallback endpoint to mark invoice as paid when returning from payment gateway
// This handles cases where PayFast's ITN webhook can't reach us (e.g., localhost testing)
export async function POST(req: Request) {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )

    try {
        const { invoiceId } = await req.json()

        if (!invoiceId) {
            return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 })
        }

        console.log(`[Mark Paid] Marking invoice ${invoiceId} as paid`)

        // Get invoice details first
        const { data: invoice } = await supabase
            .from('invoices')
            .select('*, customers(name)')
            .eq('id', invoiceId)
            .single()

        // Update invoice status
        const { error: invoiceError } = await supabase
            .from('invoices')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', invoiceId)

        if (invoiceError) {
            console.error('[Mark Paid] Error updating invoice:', invoiceError)
            return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
        }

        // Create notification for user
        if (invoice) {
            await createNotification({
                userId: invoice.user_id,
                type: 'payment_received',
                title: `Payment received for ${invoice.invoice_number}`,
                message: `${invoice.customers?.name || 'Customer'} paid their invoice`,
                invoiceId: invoice.id,
                amount: invoice.total
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[Mark Paid] Error:', error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
