import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { addDays, addWeeks, addMonths, addYears, setDay, lastDayOfMonth, getDay } from "date-fns"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Helper function to calculate monthly recurring date based on week of month
// e.g., "fourth Thursday" or "last Friday"
function calculateMonthlyWeekDate(baseDate: Date, monthsToAdd: number, weekOfMonth: string | null, dayOfWeek: number | null): Date {
    if (!weekOfMonth || dayOfWeek === null || dayOfWeek === undefined) {
        return addMonths(baseDate, monthsToAdd)
    }

    const targetMonth = addMonths(baseDate, monthsToAdd)
    const year = targetMonth.getFullYear()
    const month = targetMonth.getMonth()

    if (weekOfMonth === 'last') {
        // Find last occurrence of dayOfWeek in the month
        const lastDay = lastDayOfMonth(new Date(year, month, 1))
        let date = new Date(lastDay)
        while (getDay(date) !== dayOfWeek) {
            date = addDays(date, -1)
        }
        return date
    }

    // Find first occurrence of dayOfWeek in the month
    const firstDay = new Date(year, month, 1)
    let firstOccurrence = new Date(firstDay)
    while (getDay(firstOccurrence) !== dayOfWeek) {
        firstOccurrence = addDays(firstOccurrence, 1)
    }

    // Add weeks based on weekOfMonth
    const weekMap: { [key: string]: number } = {
        'first': 0,
        'second': 1,
        'third': 2,
        'fourth': 3
    }
    const weeksToAdd = weekMap[weekOfMonth] || 0
    return addWeeks(firstOccurrence, weeksToAdd)
}

// Cron job endpoint for processing recurring invoices
// Should be called daily for production
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


        for (const invoice of recurringInvoices || []) {
            // End-on-date support (safe even if recurring_end_type column does not exist)
            if (invoice.recurring_end_date) {
                const endDate = new Date(`${invoice.recurring_end_date}T00:00:00`)
                if (now > endDate) {
                    continue
                }
            }

            // Calculate next invoice date based on interval.
            // We can't rely on last_recurring_at being present in every DB schema, so we derive it
            // by looking up the most recent child invoice (parent_invoice_id).
            const createdAt = new Date(invoice.created_at)
            const issueDateBase = invoice.issue_date
                ? new Date(`${invoice.issue_date}T00:00:00`)
                : createdAt

            const { count: childCount, error: childCountError } = await supabase
                .from('invoices')
                .select('id', { count: 'exact', head: true })
                .eq('parent_invoice_id', invoice.id)

            if (childCountError) {
                continue
            }

            const occurrences = childCount || 0

            // End-after-X support: if the series already produced the requested number of child invoices,
            // stop generating new ones.
            if (
                invoice.recurring_end_type === 'after' &&
                invoice.recurring_end_count !== null &&
                invoice.recurring_end_count !== undefined &&
                Number.isFinite(Number(invoice.recurring_end_count)) &&
                occurrences >= Number(invoice.recurring_end_count)
            ) {
                continue
            }

            // Derive the last scheduled time based on how many child invoices already exist.
            // This enables catch-up even if the cron endpoint is called late.
            let baseDate: Date
            switch (invoice.recurring_interval) {
                case 'daily':
                    baseDate = addDays(issueDateBase, occurrences)
                    break
                case 'weekly':
                    // Weekly on specific day of week
                    if (invoice.recurring_day_of_week !== null && invoice.recurring_day_of_week !== undefined) {
                        baseDate = setDay(addWeeks(issueDateBase, occurrences), invoice.recurring_day_of_week)
                    } else {
                        baseDate = addWeeks(issueDateBase, occurrences)
                    }
                    break
                case 'bi-weekly':
                    // Bi-weekly on specific day of week
                    if (invoice.recurring_day_of_week !== null && invoice.recurring_day_of_week !== undefined) {
                        baseDate = setDay(addWeeks(issueDateBase, occurrences * 2), invoice.recurring_day_of_week)
                    } else {
                        baseDate = addWeeks(issueDateBase, occurrences * 2)
                    }
                    break
                case 'monthly':
                    // Monthly on specific day of month
                    if (invoice.recurring_day_of_month) {
                        let monthDate = addMonths(issueDateBase, occurrences)
                        monthDate.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(monthDate).getDate()))
                        baseDate = monthDate
                    } else {
                        baseDate = addMonths(issueDateBase, occurrences)
                    }
                    break
                case 'monthly-week':
                    // Monthly on specific week and day (e.g., "fourth Thursday")
                    baseDate = calculateMonthlyWeekDate(issueDateBase, occurrences, invoice.recurring_week_of_month, invoice.recurring_day_of_week)
                    break
                case 'monthly-last':
                    // Monthly on last day of month
                    baseDate = lastDayOfMonth(addMonths(issueDateBase, occurrences))
                    break
                case 'quarterly':
                    // Quarterly on specific day of month
                    if (invoice.recurring_day_of_month) {
                        let quarterDate = addMonths(issueDateBase, occurrences * 3)
                        quarterDate.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(quarterDate).getDate()))
                        baseDate = quarterDate
                    } else {
                        baseDate = addMonths(issueDateBase, occurrences * 3)
                    }
                    break
                case 'semi-annually':
                    // Semi-annually on specific day of month
                    if (invoice.recurring_day_of_month) {
                        let semiDate = addMonths(issueDateBase, occurrences * 6)
                        semiDate.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(semiDate).getDate()))
                        baseDate = semiDate
                    } else {
                        baseDate = addMonths(issueDateBase, occurrences * 6)
                    }
                    break
                case 'yearly':
                    // Yearly on specific day of month
                    if (invoice.recurring_day_of_month) {
                        let yearDate = addYears(issueDateBase, occurrences)
                        yearDate.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(yearDate).getDate()))
                        baseDate = yearDate
                    } else {
                        baseDate = addYears(issueDateBase, occurrences)
                    }
                    break
                case 'custom':
                    // Custom interval (e.g., every 3 days, every 2 weeks, every 4 months)
                    const interval = invoice.recurring_custom_interval || 1
                    const unit = invoice.recurring_custom_unit || 'days'
                    if (unit === 'days') {
                        baseDate = addDays(issueDateBase, occurrences * interval)
                    } else if (unit === 'weeks') {
                        baseDate = addWeeks(issueDateBase, occurrences * interval)
                    } else if (unit === 'months') {
                        baseDate = addMonths(issueDateBase, occurrences * interval)
                    } else {
                        baseDate = addMonths(issueDateBase, occurrences)
                    }
                    break
                default:
                    baseDate = addMonths(issueDateBase, occurrences)
            }

            const computeNextDate = (from: Date): Date => {
                switch (invoice.recurring_interval) {
                    case 'daily':
                        return addDays(from, 1)
                    case 'weekly':
                        if (invoice.recurring_day_of_week !== null && invoice.recurring_day_of_week !== undefined) {
                            return setDay(addWeeks(from, 1), invoice.recurring_day_of_week)
                        }
                        return addWeeks(from, 1)
                    case 'bi-weekly':
                        if (invoice.recurring_day_of_week !== null && invoice.recurring_day_of_week !== undefined) {
                            return setDay(addWeeks(from, 2), invoice.recurring_day_of_week)
                        }
                        return addWeeks(from, 2)
                    case 'monthly':
                        if (invoice.recurring_day_of_month) {
                            let nextMonth = addMonths(from, 1)
                            nextMonth.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(nextMonth).getDate()))
                            return nextMonth
                        }
                        return addMonths(from, 1)
                    case 'monthly-week':
                        return calculateMonthlyWeekDate(from, 1, invoice.recurring_week_of_month, invoice.recurring_day_of_week)
                    case 'monthly-last':
                        return lastDayOfMonth(addMonths(from, 1))
                    case 'quarterly':
                        if (invoice.recurring_day_of_month) {
                            let nextQuarter = addMonths(from, 3)
                            nextQuarter.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(nextQuarter).getDate()))
                            return nextQuarter
                        }
                        return addMonths(from, 3)
                    case 'semi-annually':
                        if (invoice.recurring_day_of_month) {
                            let nextSemi = addMonths(from, 6)
                            nextSemi.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(nextSemi).getDate()))
                            return nextSemi
                        }
                        return addMonths(from, 6)
                    case 'yearly':
                        if (invoice.recurring_day_of_month) {
                            let nextYear = addYears(from, 1)
                            nextYear.setDate(Math.min(invoice.recurring_day_of_month, lastDayOfMonth(nextYear).getDate()))
                            return nextYear
                        }
                        return addYears(from, 1)
                    case 'custom':
                        const interval = invoice.recurring_custom_interval || 1
                        const unit = invoice.recurring_custom_unit || 'days'
                        if (unit === 'days') {
                            return addDays(from, interval)
                        } else if (unit === 'weeks') {
                            return addWeeks(from, interval)
                        } else if (unit === 'months') {
                            return addMonths(from, interval)
                        }
                        return addMonths(from, 1)
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

            const endCount =
                invoice.recurring_end_type === 'after' &&
                invoice.recurring_end_count !== null &&
                invoice.recurring_end_count !== undefined &&
                Number.isFinite(Number(invoice.recurring_end_count))
                    ? Number(invoice.recurring_end_count)
                    : null

            while (
                now >= nextInvoiceDate &&
                createdThisParent < maxPerRun &&
                (endCount === null || occurrences + createdThisParent < endCount)
            ) {

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
                        from_email: invoice.from_email || null,
                        send_copy_to_self: Boolean(invoice.send_copy_to_self),
                        is_recurring: false, // New invoice is not recurring itself
                        parent_invoice_id: invoice.id, // Track parent
                    })
                    .select()
                    .single()

                if (insertError) {
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
                                bcc: invoice.send_copy_to_self ? (invoice.from_email || undefined) : undefined,
                                companyName,
                                fromEmail: 'invoice@illumi.co.za',
                                supportEmail: invoice.from_email || 'invoice@illumi.co.za',
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
                    } catch (emailError) {
                        // Email failed - mark invoice as draft instead of sent
                        await supabase
                            .from('invoices')
                            .update({ status: 'draft' })
                            .eq('id', newInvoice.id)
                    }
                }
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
