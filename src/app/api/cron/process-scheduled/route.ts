import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Cron job endpoint for processing scheduled invoices
// Should be called regularly (e.g., hourly or daily)
export async function GET(req: Request) {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    let invoicesSent = 0
    let emailsSent = 0

    try {
        // Fetch scheduled invoices that are due to be sent
        const { data: scheduledInvoices, error } = await supabase
            .from('invoices')
            .select('id, invoice_number, total, currency, user_id, status, issue_date, due_date, workspace_id, scheduled_date, from_email, send_copy_to_self, customers(name, email), invoice_items(description, quantity, unit_price, total, sort_order)')
            .eq('status', 'scheduled')
            // Prefer scheduled_date (timestamp). Fallback to issue_date for legacy rows.
            .or(`scheduled_date.lte.${now.toISOString()},and(scheduled_date.is.null,issue_date.lte.${todayStr})`)

        if (error) throw error


        for (const invoice of scheduledInvoices || []) {
            const scheduledAt = invoice.scheduled_date
                ? new Date(invoice.scheduled_date)
                : new Date(invoice.issue_date + 'T00:00:00')

            // Check if it's time to send
            if (now >= scheduledAt) {

                // Update invoice status to 'sent'
                const { error: updateError } = await supabase
                    .from('invoices')
                    .update({ 
                        status: 'sent',
                        sent_at: now.toISOString()
                    })
                    .eq('id', invoice.id)

                if (updateError) {
                    continue
                }

                invoicesSent++

                // Send email if customer has email
                const customer = invoice.customers as any
                if (customer?.email) {
                    const amount = new Intl.NumberFormat('en-ZA', {
                        style: 'currency',
                        currency: invoice.currency || 'ZAR'
                    }).format(invoice.total)

                    const paymentLink = `${process.env.NEXT_PUBLIC_URL}/pay/${invoice.id}`
                    const dueDate = invoice.due_date 
                        ? new Date(invoice.due_date).toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : 'Upon receipt'

                    try {
                        let companyName: string | undefined
                        try {
                            const { data: ws } = await supabase
                                .from('workspaces')
                                .select('name')
                                .eq('id', invoice.workspace_id)
                                .maybeSingle()
                            companyName = ws?.name
                        } catch {
                            companyName = undefined
                        }

                        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/email/send`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                ...(cronSecret ? { authorization: `Bearer ${cronSecret}` } : {}),
                            },
                            body: JSON.stringify({
                                type: 'invoice',
                                to: customer.email,
                                bcc: invoice.send_copy_to_self ? (invoice.from_email || undefined) : undefined,
                                companyName,
                                fromEmail: 'invoice@illumi.co.za',
                                supportEmail: invoice.from_email || 'invoice@illumi.co.za',
                                customerName: customer.name,
                                invoiceNumber: invoice.invoice_number,
                                amount: amount,
                                currency: invoice.currency || 'ZAR',
                                dueDate: dueDate,
                                paymentLink: paymentLink,
                            })
                        })
                        emailsSent++
                    } catch (emailError) {
                        // Email failed - mark invoice as draft instead of sent
                        await supabase
                            .from('invoices')
                            .update({ status: 'draft' })
                            .eq('id', invoice.id)
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            invoicesSent,
            emailsSent,
            processedAt: now.toISOString()
        })
    } catch (error) {
        console.error('[Scheduled Cron] Error:', error)
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
    }
}
