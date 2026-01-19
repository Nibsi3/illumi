import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { addDays, addWeeks, addMonths, addYears, addMinutes } from "date-fns"

// Cron job endpoint for processing recurring invoices
// Should be called regularly (e.g., every minute for testing, daily for production)
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
    let invoicesCreated = 0
    let emailsSent = 0

    try {
        // Fetch recurring invoices that are active
        const { data: recurringInvoices, error } = await supabase
            .from('invoices')
            .select('*, customers(name, email), invoice_items(*)')
            .eq('is_recurring', true)
            .in('status', ['sent', 'paid']) // Only process active recurring invoices

        if (error) throw error

        console.log(`[Recurring Cron] Found ${recurringInvoices?.length || 0} recurring invoices`)

        for (const invoice of recurringInvoices || []) {
            // Check if recurring has ended
            if (invoice.recurring_end_type === 'on' && invoice.recurring_end_date) {
                const endDate = new Date(invoice.recurring_end_date)
                if (now > endDate) {
                    console.log(`[Recurring Cron] Invoice ${invoice.invoice_number} recurring period ended`)
                    continue
                }
            }

            // For 'after' type with minutes (testing), check if we should stop
            if (invoice.recurring_end_type === 'after' && invoice.recurring_interval === 'minute') {
                const createdAt = new Date(invoice.created_at)
                const minutesElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60)
                if (invoice.recurring_count && minutesElapsed > invoice.recurring_count) {
                    console.log(`[Recurring Cron] Invoice ${invoice.invoice_number} minute-based recurring ended after ${invoice.recurring_count} minutes`)
                    continue
                }
            }

            // Calculate next invoice date based on interval
            const lastInvoiceDate = invoice.last_recurring_at ? new Date(invoice.last_recurring_at) : new Date(invoice.created_at)
            let nextInvoiceDate: Date

            switch (invoice.recurring_interval) {
                case 'minute':
                    nextInvoiceDate = addMinutes(lastInvoiceDate, 1)
                    break
                case 'daily':
                    nextInvoiceDate = addDays(lastInvoiceDate, 1)
                    break
                case 'weekly':
                    nextInvoiceDate = addWeeks(lastInvoiceDate, 1)
                    break
                case 'monthly':
                    nextInvoiceDate = addMonths(lastInvoiceDate, 1)
                    break
                case 'yearly':
                    nextInvoiceDate = addYears(lastInvoiceDate, 1)
                    break
                default:
                    nextInvoiceDate = addMonths(lastInvoiceDate, 1)
            }

            // Check if it's time to create a new invoice
            if (now >= nextInvoiceDate) {
                console.log(`[Recurring Cron] Creating new invoice from recurring ${invoice.invoice_number}`)

                // Generate new invoice number
                const timestamp = Date.now().toString().slice(-6)
                const newInvoiceNumber = `INV-${timestamp}`

                // Calculate new due date (same offset from issue date as original)
                const originalIssueDays = invoice.due_date && invoice.issue_date
                    ? Math.round((new Date(invoice.due_date).getTime() - new Date(invoice.issue_date).getTime()) / (1000 * 60 * 60 * 24))
                    : 30
                const newDueDate = addDays(now, originalIssueDays)

                // Create new invoice
                const { data: newInvoice, error: insertError } = await supabase
                    .from('invoices')
                    .insert({
                        user_id: invoice.user_id,
                        workspace_id: invoice.workspace_id,
                        customer_id: invoice.customer_id,
                        invoice_number: newInvoiceNumber,
                        status: 'sent',
                        issue_date: now.toISOString().split('T')[0],
                        due_date: newDueDate.toISOString().split('T')[0],
                        currency: invoice.currency,
                        subtotal: invoice.subtotal,
                        tax_rate: invoice.tax_rate,
                        tax_amount: invoice.tax_amount,
                        total: invoice.total,
                        notes: invoice.notes,
                        template: invoice.template,
                        invoice_mode: invoice.invoice_mode,
                        logo_url: invoice.logo_url,
                        payment_provider: invoice.payment_provider,
                        is_recurring: false, // New invoice is not recurring itself
                        parent_recurring_id: invoice.id, // Track parent
                    })
                    .select()
                    .single()

                if (insertError) {
                    console.error(`[Recurring Cron] Failed to create invoice:`, insertError)
                    continue
                }

                // Copy invoice items
                if (invoice.invoice_items && invoice.invoice_items.length > 0) {
                    const itemsToInsert = invoice.invoice_items.map((item: any) => ({
                        invoice_id: newInvoice.id,
                        description: item.description,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        total: item.total,
                        sort_order: item.sort_order,
                    }))

                    await supabase.from('invoice_items').insert(itemsToInsert)
                }

                // Update parent invoice with last recurring timestamp
                await supabase
                    .from('invoices')
                    .update({ last_recurring_at: now.toISOString() })
                    .eq('id', invoice.id)

                invoicesCreated++

                // Send email if customer has email
                if (invoice.customers?.email) {
                    const amount = new Intl.NumberFormat('en-ZA', {
                        style: 'currency',
                        currency: invoice.currency || 'ZAR'
                    }).format(invoice.total)

                    const paymentLink = `${process.env.NEXT_PUBLIC_URL}/pay/${newInvoice.id}`

                    try {
                        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/email/send`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'invoice',
                                to: invoice.customers.email,
                                customerName: invoice.customers.name,
                                invoiceNumber: newInvoiceNumber,
                                amount: amount,
                                currency: invoice.currency || 'ZAR',
                                dueDate: newDueDate.toLocaleDateString('en-ZA', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }),
                                paymentLink: paymentLink,
                            })
                        })
                        emailsSent++
                        console.log(`[Recurring Cron] Email sent for ${newInvoiceNumber} to ${invoice.customers.email}`)
                    } catch (emailError) {
                        console.error(`[Recurring Cron] Failed to send email:`, emailError)
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            invoicesCreated,
            emailsSent,
            processedAt: now.toISOString()
        })
    } catch (error) {
        console.error('[Recurring Cron] Error:', error)
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
    }
}
