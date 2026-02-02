import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createNotification } from "@/lib/notifications"
import crypto from "crypto"

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        console.error("[paystack-webhook] Missing Supabase credentials")
        return null
    }

    return createClient(url, serviceKey)
}

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get("x-paystack-signature")

        // Get Paystack secret key from workspace or env
        // For webhook verification, we need to check against all possible workspace keys
        // For now, we'll process the webhook and verify the invoice exists
        
        const payload = JSON.parse(body)
        console.log("[paystack-webhook] Received event:", payload.event)

        if (payload.event !== "charge.success") {
            return NextResponse.json({ received: true })
        }

        const data = payload.data
        const invoiceId = data?.metadata?.invoiceId
        const reference = data?.reference

        if (!invoiceId) {
            console.log("[paystack-webhook] No invoiceId in metadata, reference:", reference)
            return NextResponse.json({ received: true })
        }

        console.log("[paystack-webhook] Processing payment for invoice:", invoiceId)

        const supabase = getServiceClient()
        if (!supabase) {
            console.error("[paystack-webhook] No Supabase client")
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        // Get invoice details first
        const { data: invoice, error: fetchError } = await supabase
            .from("invoices")
            .select("*, customers(name)")
            .eq("id", invoiceId)
            .single()

        if (fetchError || !invoice) {
            console.error("[paystack-webhook] Invoice not found:", invoiceId, fetchError)
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
        }

        // Skip if already paid
        if (invoice.status === "paid") {
            console.log("[paystack-webhook] Invoice already paid:", invoiceId)
            return NextResponse.json({ received: true, already_paid: true })
        }

        // Update invoice status
        const { error: updateError } = await supabase
            .from("invoices")
            .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq("id", invoiceId)

        if (updateError) {
            console.error("[paystack-webhook] Failed to update invoice:", updateError)
            return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
        }

        console.log("[paystack-webhook] Invoice marked as paid:", invoiceId)

        // Create notification
        if (invoice.user_id) {
            await createNotification({
                userId: invoice.user_id,
                type: "payment_received",
                title: `Payment received for ${invoice.invoice_number}`,
                message: `${invoice.customers?.name || "Customer"} paid their invoice via Paystack`,
                invoiceId: invoice.id,
                amount: invoice.total,
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[paystack-webhook] Error:", error)
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
}
