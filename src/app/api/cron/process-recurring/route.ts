import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { addDays, addWeeks, addMonths, addYears, addMinutes } from "date-fns"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
        return NextResponse.json(
            {
                error: "Missing Supabase credentials",
                diagnostics: {
                    has_NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
                    has_SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
                    has_SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
                    has_SUPABASE_SERVICE_KEY: Boolean(process.env.SUPABASE_SERVICE_KEY),
                    node_env: process.env.NODE_ENV || null,
                },
            },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                },
            }
        )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const now = new Date()
    let invoicesCreated = 0
    let emailsSent = 0

    const url = new URL(req.url)
    const catchUp = url.searchParams.get('catchUp') === '1'

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
            // End-on-date support (safe even if recurring_end_type column does not exist)
            if (invoice.recurring_end_date) {
                const endDate = new Date(`${invoice.recurring_end_date}T00:00:00`)
                if (now > endDate) {
                    console.log(`[Recurring Cron] Invoice ${invoice.invoice_number} recurring period ended`)
                    continue
                }
            }

            // Calculate next invoice date based on interval.
            // We can't rely on last_recurring_at being present in every DB schema, so we derive it
            // by looking up the most recent child invoice (parent_invoice_id).
            // IMPORTANT: For minute/daily testing, many invoices will share the same issue_date.
            // Ordering by issue_date alone would return an arbitrary invoice, so we use created_at.
            const createdAt = new Date(invoice.created_at)
            const issueDateBase = invoice.issue_date
                ? new Date(`${invoice.issue_date}T00:00:00`)
                : createdAt

            const { count: childCount, error: childCountError } = await supabase
                .from('invoices')
                .select('id', { count: 'exact', head: true })
                .eq('parent_invoice_id', invoice.id)

            if (childCountError) {
                console.warn('[Recurring Cron] Failed to fetch child invoice count:', childCountError)
            }

            const occurrences = childCount || 0

            // Derive the last scheduled time based on how many child invoices already exist.
            // This enables catch-up even if the cron endpoint is called late.
            let baseDate: Date
            switch (invoice.recurring_interval) {
                case 'minute':
                    baseDate = addMinutes(createdAt, occurrences)
                    break
                case 'daily':
                    baseDate = addDays(issueDateBase, occurrences)
                    break
                case 'weekly':
                    baseDate = addWeeks(issueDateBase, occurrences)
                    break
                case 'monthly':
                    baseDate = addMonths(issueDateBase, occurrences)
                    break
                case 'quarterly':
                    baseDate = addMonths(issueDateBase, occurrences * 3)
                    break
                case 'yearly':
                    baseDate = addYears(issueDateBase, occurrences)
                    break
                default:
                    baseDate = addMonths(issueDateBase, occurrences)
            }

            const computeNextDate = (from: Date): Date => {
                switch (invoice.recurring_interval) {
                    case 'minute':
                        return addMinutes(from, 1)
                    case 'daily':
                        return addDays(from, 1)
                    case 'weekly':
                        return addWeeks(from, 1)
                    case 'monthly':
                        return addMonths(from, 1)
                    case 'quarterly':
                        return addMonths(from, 3)
                    case 'yearly':
                        return addYears(from, 1)
                    default:
                        return addMonths(from, 1)
                }
            }

            // By default, create at most 1 invoice per parent per cron run to avoid bursts
            // when someone refreshes the endpoint manually.
            // Use ?catchUp=1 to allow generating multiple missed occurrences (capped).
            const maxPerRun = catchUp ? 10 : 1
            let createdThisParent = 0
            let nextInvoiceDate = computeNextDate(baseDate)

            while (now >= nextInvoiceDate && createdThisParent < maxPerRun) {
                console.log(`[Recurring Cron] Creating new invoice from recurring ${invoice.invoice_number} (next=${nextInvoiceDate.toISOString()})`)

                // Generate new invoice number
                const timestamp = Date.now().toString().slice(-6)
                const newInvoiceNumber = `INV-${timestamp}-${createdThisParent + 1}`

                // Calculate new due date (same offset from issue date as original)
                const originalIssueDaysRaw = invoice.due_date && invoice.issue_date
                    ? Math.round((new Date(invoice.due_date).getTime() - new Date(invoice.issue_date).getTime()) / (1000 * 60 * 60 * 24))
                    : 30
                const originalIssueDays = Math.max(0, originalIssueDaysRaw)
                // Issue date should be when we generate the invoice (today)
                const generatedIssueDate = new Date(now)
                generatedIssueDate.setHours(0, 0, 0, 0)
                const newDueDate = addDays(generatedIssueDate, originalIssueDays)

                // Create new invoice
                const { data: newInvoice, error: insertError } = await supabase
                    .from('invoices')
                    .insert({
                        user_id: invoice.user_id,
                        workspace_id: invoice.workspace_id,
                        customer_id: invoice.customer_id,
                        invoice_number: newInvoiceNumber,
                        status: 'sent',
                        issue_date: generatedIssueDate.toISOString().split('T')[0],
                        due_date: newDueDate.toISOString().split('T')[0],
                        currency: invoice.currency,
                        subtotal: invoice.subtotal,
                        tax_rate: invoice.tax_rate,
                        tax_amount: invoice.tax_amount,
                        total: invoice.total,
                        notes: invoice.notes,
                        is_recurring: false, // New invoice is not recurring itself
                        parent_invoice_id: invoice.id, // Track parent
                    })
                    .select()
                    .single()

                if (insertError) {
                    console.error(`[Recurring Cron] Failed to create invoice:`, insertError)
                    break
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

                // Best-effort: update parent invoice timestamps if the column exists
                await supabase
                    .from('invoices')
                    .update({ sent_at: invoice.sent_at || now.toISOString() })
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
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'invoice',
                                to: invoice.customers.email,
                                companyName,
                                supportEmail: invoice.from_email,
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

                invoicesCreated++
                createdThisParent++
                baseDate = nextInvoiceDate
                nextInvoiceDate = computeNextDate(baseDate)
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
