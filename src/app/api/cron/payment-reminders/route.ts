import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createNotification } from "@/lib/notifications"

// Cron job endpoint for sending payment reminders
// Should be called daily by a cron service (e.g., Vercel Cron, GitHub Actions)
export async function GET(req: Request) {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    let remindersSent = 0
    let finalNoticesSent = 0

    try {
        // Fetch unpaid invoices that are sent but not yet paid
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('id, invoice_number, total, currency, user_id, status, issue_date, due_date, from_email, send_copy_to_self, reminder_sent_at, final_notice_sent_at, workspace_id, customers(name, email), invoice_items(description, quantity, unit_price, total)')
            .in('status', ['sent', 'viewed'])
            .not('due_date', 'is', null)

        if (error) throw error

        for (const invoice of invoices || []) {
            const customer = invoice.customers as any
            if (!customer?.email) continue

            const issueDate = new Date(invoice.issue_date)
            const dueDate = new Date(invoice.due_date)

            // Calculate midpoint for first reminder
            const midpointTime = issueDate.getTime() + (dueDate.getTime() - issueDate.getTime()) / 2
            const midpointDate = new Date(midpointTime)
            midpointDate.setHours(0, 0, 0, 0)
            const midpointStr = midpointDate.toISOString().split('T')[0]

            const amount = new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: invoice.currency
            }).format(invoice.total)

            const paymentLink = `${process.env.NEXT_PUBLIC_URL}/pay/${invoice.id}`

            // Check if we should send first reminder (midpoint)
            if (todayStr === midpointStr && !invoice.reminder_sent_at) {
                console.log(`[Cron] Sending first reminder for invoice ${invoice.invoice_number}`)

                // Send payment reminder email
                await fetch(`${process.env.NEXT_PUBLIC_URL}/api/email/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(cronSecret ? { authorization: `Bearer ${cronSecret}` } : {}),
                    },
                    body: JSON.stringify({
                        type: 'payment_reminder',
                        to: customer.email,
                        bcc: invoice.send_copy_to_self ? (invoice.from_email || undefined) : undefined,
                        invoiceNumber: invoice.invoice_number,
                        customerName: customer.name,
                        amount: amount,
                        dueDate: dueDate.toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }),
                        paymentLink: paymentLink,
                        items: invoice.invoice_items,
                        currency: invoice.currency
                    })
                })

                // Update invoice with reminder timestamp
                await supabase
                    .from('invoices')
                    .update({ reminder_sent_at: new Date().toISOString() })
                    .eq('id', invoice.id)

                // Create notification for user
                await createNotification({
                    userId: invoice.user_id,
                    type: 'payment_reminder',
                    title: `Payment reminder sent for ${invoice.invoice_number}`,
                    message: `Reminder sent to ${customer.name}`,
                    invoiceId: invoice.id,
                    amount: invoice.total
                })

                remindersSent++
            }

            // Check if we should send final notice (due date)
            if (todayStr === invoice.due_date && !invoice.final_notice_sent_at) {
                console.log(`[Cron] Sending final notice for invoice ${invoice.invoice_number}`)

                // Send final notice email
                await fetch(`${process.env.NEXT_PUBLIC_URL}/api/email/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(cronSecret ? { authorization: `Bearer ${cronSecret}` } : {}),
                    },
                    body: JSON.stringify({
                        type: 'final_notice',
                        to: customer.email,
                        bcc: invoice.send_copy_to_self ? (invoice.from_email || undefined) : undefined,
                        invoiceNumber: invoice.invoice_number,
                        customerName: customer.name,
                        amount: amount,
                        dueDate: 'Today',
                        paymentLink: paymentLink,
                        items: invoice.invoice_items,
                        currency: invoice.currency
                    })
                })

                // Update invoice with final notice timestamp
                await supabase
                    .from('invoices')
                    .update({ final_notice_sent_at: new Date().toISOString() })
                    .eq('id', invoice.id)

                // Create notification for user
                await createNotification({
                    userId: invoice.user_id,
                    type: 'final_notice',
                    title: `Final notice sent for ${invoice.invoice_number}`,
                    message: `Final payment notice sent to ${customer.name}`,
                    invoiceId: invoice.id,
                    amount: invoice.total
                })

                finalNoticesSent++
            }

            // Mark as overdue if past due date
            if (new Date(invoice.due_date) < today && invoice.status !== 'paid') {
                await supabase
                    .from('invoices')
                    .update({ status: 'overdue' })
                    .eq('id', invoice.id)

                // Create overdue notification (only once)
                if (invoice.status !== 'overdue') {
                    await createNotification({
                        userId: invoice.user_id,
                        type: 'invoice_overdue',
                        title: `Invoice ${invoice.invoice_number} is overdue`,
                        message: `Payment from ${customer.name} is past due`,
                        invoiceId: invoice.id,
                        amount: invoice.total
                    })
                }
            }
        }

        return NextResponse.json({
            success: true,
            remindersSent,
            finalNoticesSent,
            processedAt: new Date().toISOString()
        })
    } catch (error) {
        console.error('[Cron] Payment reminders error:', error)
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
    }
}
