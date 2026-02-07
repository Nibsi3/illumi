"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    IconCalendarStats,
    IconReceipt,
    IconFileAnalytics,
    IconChevronDown,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import React, { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import { useSettings } from "@/lib/settings-context"
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export default function DashboardPage() {
    const router = useRouter();
    const { currency } = useSettings();
    const [view, setView] = useState<"overview" | "metrics">("overview");
    const [period, setPeriod] = useState<"Day" | "Week" | "Month" | "Year">("Week");
    const [hoveredBucketIndex, setHoveredBucketIndex] = useState<number | null>(null)
    const [user, setUser] = useState<any>(null)

    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    useEffect(() => {
        const getUser = async () => {
            const { data: sessionData } = await supabase.auth.getSession()
            setUser(sessionData?.session?.user || null)
        }
        getUser()
    }, [supabase])

    const userFirstName = user?.user_metadata?.full_name?.split(" ")[0]
        || user?.user_metadata?.name?.split(" ")[0]
        || user?.email?.split("@")[0]
        || ""

    const greetingPrefix = (() => {
        const h = new Date().getHours()
        if (h < 12) return "Morning"
        if (h < 18) return "Afternoon"
        return "Evening"
    })()

    const defaultMetrics = useMemo(() => ({
        revenue: 0,
        customers: 0,
        products: 0,
        pendingInvoices: 0,
        recurring: 0,
        growth: 0,
    }), [])

    const defaultCashFlowMetrics = useMemo(() => ({
        outstanding: 0,
        overdue: 0,
        paidYTD: 0,
        vatEstimate: 0,
        projectedRevenue: 0,
        topClients: [] as { name: string; total: number; count: number }[],
    }), [])

    // Use React Query for cached data fetching
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard-metrics', activeWorkspace?.id],
        queryFn: async () => {
            if (!activeWorkspace) return null

            let perfEnabled = false
            try {
                perfEnabled = localStorage.getItem('illumi_perf') === '1'
            } catch {
                perfEnabled = false
            }

            if (perfEnabled) console.time('dashboard:loadDashboardData')

            try {

            const toMonthlyAmount = (amount: number, interval: string | null, customInterval?: number | null, customUnit?: string | null) => {
                const cleanAmount = Number(amount) || 0
                if (!interval) return 0

                // Approximate monthly multipliers
                const weeksPerMonth = 52 / 12
                const daysPerMonth = 365.25 / 12

                switch (interval) {
                    case 'daily':
                        return cleanAmount * daysPerMonth
                    case 'weekly':
                        return cleanAmount * weeksPerMonth
                    case 'bi-weekly':
                        return cleanAmount * (weeksPerMonth / 2)
                    case 'monthly':
                    case 'monthly-week':
                    case 'monthly-last':
                        return cleanAmount
                    case 'quarterly':
                        return cleanAmount / 3
                    case 'semi-annually':
                        return cleanAmount / 6
                    case 'yearly':
                        return cleanAmount / 12
                    case 'custom': {
                        const i = Number(customInterval) || 1
                        const u = customUnit || 'days'
                        if (u === 'days') return cleanAmount * (daysPerMonth / i)
                        if (u === 'weeks') return cleanAmount * (weeksPerMonth / i)
                        if (u === 'months') return cleanAmount * (1 / i)
                        return cleanAmount
                    }
                    default:
                        return cleanAmount
                }
            }

            const now = new Date()
            const currentYear = now.getFullYear()
            const currentMonth = now.getMonth()
            const startOfYearDate = new Date(currentYear, 0, 1)
            const startOfLastYearDate = new Date(currentYear - 1, 0, 1)

            const [
                { data: invoices },
                { data: invoicesAll },
                { data: customers },
                { data: expenses },
                { data: products },
                { data: recurringTemplates },
            ] = await Promise.all([
                (async () => {
                    if (perfEnabled) console.time('dashboard:q:invoices_last_year')
                    const res = await supabase
                        .from('invoices')
                        .select('invoice_number, total, status, issue_date, due_date, paid_at, customer_id, tax_amount')
                        .eq('workspace_id', activeWorkspace.id)
                        .gte('issue_date', startOfLastYearDate.toISOString().slice(0, 10))
                        .order('issue_date', { ascending: false })
                    if (perfEnabled) console.timeEnd('dashboard:q:invoices_last_year')
                    return res
                })(),
                // Lightweight full invoice dataset for counts/progress (not restricted by issue_date)
                (async () => {
                    if (perfEnabled) console.time('dashboard:q:invoices_all_light')
                    const res = await supabase
                        .from('invoices')
                        .select('total, status, issue_date, paid_at, customer_id')
                        .eq('workspace_id', activeWorkspace.id)
                        .order('created_at', { ascending: false })
                        .limit(5000)
                    if (perfEnabled) console.timeEnd('dashboard:q:invoices_all_light')
                    return res
                })(),
                (async () => {
                    if (perfEnabled) console.time('dashboard:q:customers')
                    const res = await supabase
                        .from('customers')
                        .select('id, name')
                        .eq('workspace_id', activeWorkspace.id)
                        .limit(1000)
                    if (perfEnabled) console.timeEnd('dashboard:q:customers')
                    return res
                })(),
                (async () => {
                    if (perfEnabled) console.time('dashboard:q:expenses_ytd')
                    const res = await supabase
                        .from('expenses')
                        .select('amount, expense_date')
                        .eq('workspace_id', activeWorkspace.id)
                        .gte('expense_date', startOfYearDate.toISOString().slice(0, 10))
                    if (perfEnabled) console.timeEnd('dashboard:q:expenses_ytd')
                    return res
                })(),
                (async () => {
                    if (perfEnabled) console.time('dashboard:q:products')
                    const res = await supabase
                        .from('products')
                        .select('id')
                        .eq('workspace_id', activeWorkspace.id)
                    if (perfEnabled) console.timeEnd('dashboard:q:products')
                    return res
                })(),
                (async () => {
                    if (perfEnabled) console.time('dashboard:q:recurring_templates')
                    const res = await supabase
                        .from('invoices')
                        .select('total, recurring_interval, recurring_custom_interval, recurring_custom_unit, recurring_end_date')
                        .eq('workspace_id', activeWorkspace.id)
                        .eq('is_recurring', true)
                        .in('status', ['draft', 'sent', 'paid'])
                    if (perfEnabled) console.timeEnd('dashboard:q:recurring_templates')
                    return res
                })(),
            ])

            const customerMap = new Map(customers?.map(c => [c.id, c.name]) || [])

                // Basic metrics
                const paidInvoices = invoices?.filter(i => i.status.toLowerCase() === 'paid') || []
                const totalRevenue = paidInvoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)

                const recent = paidInvoices
                    .filter(i => Boolean(i.paid_at || i.issue_date))
                    .map(i => ({
                        invoiceNumber: i.invoice_number || '',
                        customerName: customerMap.get(i.customer_id) || 'Unknown',
                        amount: Number(i.total) || 0,
                        paidAt: (i.paid_at || i.issue_date) as string,
                    }))
                    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
                    .slice(0, 3)

                const expensesYTD = (expenses || []).reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0)

                const expensesByMonth = new Map<number, number>()
                ;(expenses || []).forEach((e: any) => {
                    const d = e?.expense_date ? new Date(e.expense_date) : null
                    if (!d || Number.isNaN(d.getTime())) return
                    const m = d.getMonth()
                    expensesByMonth.set(m, (expensesByMonth.get(m) || 0) + (Number(e.amount) || 0))
                })

                const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

                const pendingCount = invoices
                    ?.filter(i => ['pending', 'draft', 'sent'].includes(i.status.toLowerCase()))
                    .length || 0

                // Cash Flow Metrics Calculations
                // 1. Outstanding (unpaid invoices total)
                const outstandingInvoices = invoices?.filter(i => 
                    ['sent', 'pending', 'viewed'].includes(i.status.toLowerCase())
                ) || []
                const outstanding = outstandingInvoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)

                // 2. Overdue (past due date and unpaid)
                const overdueInvoices = invoices?.filter(i => {
                    if (i.status.toLowerCase() === 'paid') return false
                    if (!i.due_date) return false
                    const dueDate = new Date(i.due_date)
                    return dueDate < now
                }) || []
                const overdue = overdueInvoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)

                // 3. Paid YTD (paid invoices this year)
                const paidYTDInvoices = paidInvoices.filter(i => {
                    if (!i.paid_at && !i.issue_date) return false
                    const paidDate = new Date(i.paid_at || i.issue_date)
                    return paidDate.getFullYear() === currentYear
                })
                const paidYTD = paidYTDInvoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)

                // 4. DSO (Days Sales Outstanding) = (Accounts Receivable / Total Credit Sales) × Number of Days
                const totalCreditSales = invoices?.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) || 1
                const dso = totalCreditSales > 0 ? Math.round((outstanding / totalCreditSales) * 365) : 0

                // 5. VAT Estimate (15% of paid revenue YTD)
                const vatEstimate = paidYTDInvoices.reduce((acc, curr) => acc + (Number(curr.tax_amount) || 0), 0)

                // 6. MoM Growth (compare this month to last month)
                const thisMonthPaid = paidInvoices.filter(i => {
                    const date = new Date(i.paid_at || i.issue_date)
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
                }).reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)

                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
                const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
                const lastMonthPaid = paidInvoices.filter(i => {
                    const date = new Date(i.paid_at || i.issue_date)
                    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
                }).reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)

                const momGrowth = lastMonthPaid > 0 
                    ? Math.round(((thisMonthPaid - lastMonthPaid) / lastMonthPaid) * 100) 
                    : (thisMonthPaid > 0 ? 100 : 0)

                // 7. Projected Revenue (average monthly * remaining months)
                const monthsElapsed = currentMonth + 1
                const avgMonthlyRevenue = paidYTD / monthsElapsed
                const remainingMonths = 12 - monthsElapsed
                const projectedRevenue = paidYTD + (avgMonthlyRevenue * remainingMonths)

                // 8. Top Clients (by total paid amount)
                const clientTotals = new Map<string, { total: number; count: number }>()
                paidInvoices.forEach(inv => {
                    if (!inv.customer_id) return
                    const existing = clientTotals.get(inv.customer_id) || { total: 0, count: 0 }
                    clientTotals.set(inv.customer_id, {
                        total: existing.total + (Number(inv.total) || 0),
                        count: existing.count + 1
                    })
                })

                const topClients = Array.from(clientTotals.entries())
                    .map(([id, data]) => ({
                        name: customerMap.get(id) || 'Unknown',
                        total: data.total,
                        count: data.count
                    }))
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5)

                const productCount = products?.length || 0

                const activeRecurringTemplates = (recurringTemplates || []).filter((t: any) => {
                    if (!t) return false
                    if (t.recurring_end_date) {
                        const endDate = new Date(`${t.recurring_end_date}T00:00:00`)
                        // consider active through end-of-day
                        endDate.setHours(23, 59, 59, 999)
                        if (endDate < now) return false
                    }
                    return true
                })

                const recurring = activeRecurringTemplates.reduce((acc: number, t: any) => {
                    return (
                        acc +
                        toMonthlyAmount(
                            Number(t.total) || 0,
                            t.recurring_interval,
                            t.recurring_custom_interval,
                            t.recurring_custom_unit
                        )
                    )
                }, 0)

                // Calculate monthly revenue for charts using actual invoice dates
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                const lastYear = currentYear - 1
                
                const monthlyData = months.map((month, index) => {
                    // Filter paid invoices for this month in current year
                    const thisYearInvoices = invoices?.filter(inv => {
                        if (inv.status.toLowerCase() !== 'paid') return false
                        if (!inv.issue_date) return false
                        const invoiceDate = new Date(inv.issue_date)
                        return invoiceDate.getFullYear() === currentYear && invoiceDate.getMonth() === index
                    }) || []
                    
                    // Filter paid invoices for this month in last year
                    const lastYearInvoices = invoices?.filter(inv => {
                        if (inv.status.toLowerCase() !== 'paid') return false
                        if (!inv.issue_date) return false
                        const invoiceDate = new Date(inv.issue_date)
                        return invoiceDate.getFullYear() === lastYear && invoiceDate.getMonth() === index
                    }) || []
                    
                    const monthRevenue = thisYearInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0)
                    const lastYearRevenue = lastYearInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0)
                    
                    return {
                        month,
                        revenue: Math.round(monthRevenue),
                        lastYear: Math.round(lastYearRevenue)
                    }
                })
            // Return computed data
            return {
                recentPayments: recent,
                paymentEvents: paidInvoices
                    .filter((i: any) => Boolean(i.paid_at || i.issue_date))
                    .map((i: any) => ({
                        amount: Number(i.total) || 0,
                        paidAt: (i.paid_at || i.issue_date) as string,
                    })),
                invoicesRaw: (invoicesAll || invoices || []).map((i: any) => ({
                    status: (i.status || '').toLowerCase(),
                    issue_date: i.issue_date as string | null,
                    due_date: i.due_date as string | null,
                    paid_at: (i.paid_at || null) as string | null,
                    total: Number(i.total) || 0,
                    customer_id: i.customer_id as string | null,
                })),
                netProfitYTD: totalRevenue - expensesYTD,
                monthlyExpenses: Array.from({ length: 12 }).map((_, i) => ({
                    month: monthLabels[i],
                    total: Math.round(expensesByMonth.get(i) || 0),
                })),
                metrics: {
                    revenue: totalRevenue,
                    customers: customers?.length || 0,
                    products: productCount,
                    pendingInvoices: pendingCount,
                    recurring: recurring,
                    growth: momGrowth
                },
                cashFlowMetrics: {
                    outstanding,
                    overdue,
                    paidYTD,
                    vatEstimate: Math.round(vatEstimate),
                    projectedRevenue: Math.round(projectedRevenue),
                    topClients: topClients
                },
                monthlyRevenue: monthlyData
            }
            } finally {
                if (perfEnabled) console.timeEnd('dashboard:loadDashboardData')
            }
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 3 * 60 * 1000, // Cache for 3 minutes
        refetchOnMount: false,
    })

    // Extract data from query result with defaults
    const computedRecentPayments = dashboardData?.recentPayments || []
    const computedPaymentEvents = dashboardData?.paymentEvents || []
    const computedInvoicesRaw = dashboardData?.invoicesRaw || []
    const computedNetProfitYTD = dashboardData?.netProfitYTD || 0
    const computedMonthlyExpenses = dashboardData?.monthlyExpenses || []
    const computedMetrics = dashboardData?.metrics || defaultMetrics
    const computedCashFlowMetrics = dashboardData?.cashFlowMetrics || defaultCashFlowMetrics
    const computedMonthlyRevenue = dashboardData?.monthlyRevenue || []

    const invoiceProgress = useMemo(() => {
        const allInvoices = (computedInvoicesRaw as any[])

        // Global counts (should match what you see on the Invoices/Clients screens)
        const paidInvoicesAll = allInvoices.filter((inv) => (inv.status || '').toLowerCase() === 'paid')
        const pendingInvoicesAll = allInvoices.filter((inv) => {
            const s = (inv.status || '').toLowerCase()
            return ['pending', 'draft', 'sent', 'viewed'].includes(s)
        })

        const clientIdsAll = new Set<string>()
        for (const inv of allInvoices) {
            if (inv.customer_id) clientIdsAll.add(inv.customer_id)
        }

        return {
            pendingCount: pendingInvoicesAll.length,
            paidCount: paidInvoicesAll.length,
            clientsCount: clientIdsAll.size,
        }
    }, [computedInvoicesRaw])

    const incomeTrackerBuckets = useMemo(() => {
        const now = new Date()
        const normalizeDayKey = (d: Date) => {
            const x = new Date(d)
            x.setHours(0, 0, 0, 0)
            return x.toISOString().slice(0, 10)
        }

        const normalizeMonthKey = (d: Date) => {
            const x = new Date(d)
            x.setDate(1)
            x.setHours(0, 0, 0, 0)
            return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`
        }

        const normalizeYearKey = (d: Date) => {
            const x = new Date(d)
            x.setMonth(0, 1)
            x.setHours(0, 0, 0, 0)
            return String(x.getFullYear())
        }

        const startOfWeekMonday = (d: Date) => {
            const x = new Date(d)
            const day = x.getDay() // 0=Sun
            const diff = (day === 0 ? -6 : 1) - day
            x.setDate(x.getDate() + diff)
            x.setHours(0, 0, 0, 0)
            return x
        }

        const normalizeWeekKey = (d: Date) => {
            const s = startOfWeekMonday(d)
            return normalizeDayKey(s)
        }

        const events = (computedPaymentEvents as any[])
            .map((e) => ({
                amount: Number(e.amount) || 0,
                date: e.paidAt ? new Date(e.paidAt) : null,
            }))
            .filter((e) => e.date && !Number.isNaN(e.date.getTime())) as { amount: number; date: Date }[]

        if (period === 'Day') {
            const days = Array.from({ length: 7 }).map((_, i) => {
                const d = new Date(now)
                d.setDate(now.getDate() - (6 - i))
                d.setHours(0, 0, 0, 0)
                return d
            })

            const byDay = new Map<string, number>()
            for (const e of events) {
                byDay.set(normalizeDayKey(e.date), (byDay.get(normalizeDayKey(e.date)) || 0) + e.amount)
            }

            return days.map((d) => {
                const k = normalizeDayKey(d)
                return {
                    label: d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }),
                    pill: d.toLocaleDateString('en-ZA', { day: '2-digit' }),
                    value: Math.round(byDay.get(k) || 0),
                }
            })
        }

        if (period === 'Week') {
            const weekStarts = Array.from({ length: 8 }).map((_, i) => {
                const d = new Date(now)
                d.setDate(now.getDate() - (7 * (7 - i)))
                return startOfWeekMonday(d)
            })

            const byWeek = new Map<string, number>()
            for (const e of events) {
                const k = normalizeWeekKey(e.date)
                byWeek.set(k, (byWeek.get(k) || 0) + e.amount)
            }

            return weekStarts.map((w, i) => {
                const k = normalizeDayKey(w)
                return {
                    label: w.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }),
                    pill: `W${i + 1}`,
                    value: Math.round(byWeek.get(k) || 0),
                }
            })
        }

        if (period === 'Month') {
            const monthStarts = Array.from({ length: 12 }).map((_, i) => {
                const d = new Date(now)
                d.setMonth(now.getMonth() - (11 - i), 1)
                d.setHours(0, 0, 0, 0)
                return d
            })

            const byMonth = new Map<string, number>()
            for (const e of events) {
                const k = normalizeMonthKey(e.date)
                byMonth.set(k, (byMonth.get(k) || 0) + e.amount)
            }

            return monthStarts.map((m) => {
                const k = normalizeMonthKey(m)
                const label = m.toLocaleDateString('en-ZA', { month: 'short' })
                return {
                    label,
                    pill: label,
                    value: Math.round(byMonth.get(k) || 0),
                }
            })
        }

        const yearStarts = Array.from({ length: 5 }).map((_, i) => {
            const d = new Date(now)
            d.setFullYear(now.getFullYear() - (4 - i), 0, 1)
            d.setHours(0, 0, 0, 0)
            return d
        })

        const byYear = new Map<string, number>()
        for (const e of events) {
            const k = normalizeYearKey(e.date)
            byYear.set(k, (byYear.get(k) || 0) + e.amount)
        }

        return yearStarts.map((y) => {
            const k = normalizeYearKey(y)
            return {
                label: k,
                pill: k,
                value: Math.round(byYear.get(k) || 0),
            }
        })
    }, [computedMonthlyRevenue, computedPaymentEvents, period])

    const clampedHoveredBucketIndex = hoveredBucketIndex === null
        ? null
        : Math.min(
              Math.max(hoveredBucketIndex, 0),
              Math.max(incomeTrackerBuckets.length - 1, 0)
          )

    const effectiveBucketIndex = clampedHoveredBucketIndex ?? (incomeTrackerBuckets.length - 1)

    const selectedBucketValue = incomeTrackerBuckets[effectiveBucketIndex]?.value || 0
    const previousBucketValue = incomeTrackerBuckets[Math.max(effectiveBucketIndex - 1, 0)]?.value || 0
    const incomeTrackerChangePct = previousBucketValue > 0
        ? Math.round(((selectedBucketValue - previousBucketValue) / previousBucketValue) * 100)
        : 0

    if (isLoading) {
        return (
            <div className="relative flex flex-col gap-y-5 animate-in fade-in duration-700 font-serif">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2 px-4 md:px-0">
                    <div className="flex flex-col gap-y-1">
                        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-card border border-border animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex flex-col gap-y-3 animate-in fade-in duration-700 font-serif min-h-[calc(100vh-120px)]">
            {/* Header: Greeting (Left) & Controls (Right) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-1 px-4 md:px-0">
                <div className="flex flex-col gap-y-1">
                    <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight italic">{greetingPrefix} <span className="text-muted-foreground not-italic">{userFirstName ? `${userFirstName},` : ""}</span></h1>
                    <p className="text-muted-foreground text-xs font-sans tracking-wide">here's a quick look at how things are going.</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {/* Overview/Metrics Toggle */}
                    <div className="flex items-center bg-card border border-border p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            onClick={() => setView("overview")}
                            className={cn(
                                "h-8 px-4 rounded-md text-[10px] uppercase font-bold tracking-widest transition-all",
                                view === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Overview
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setView("metrics")}
                            className={cn(
                                "h-8 px-4 rounded-md text-[10px] uppercase font-bold tracking-widest transition-all",
                                view === "metrics" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Metrics
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 px-3 h-9 bg-card border border-border rounded-lg text-[9px] uppercase font-bold tracking-widest text-foreground cursor-pointer hover:bg-accent transition-colors">
                                <IconCalendarStats className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{period}</span>
                                <IconChevronDown className="h-3 w-3 opacity-50" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-popover border-border rounded-lg text-popover-foreground w-48 p-2 shadow-2xl">
                            <DropdownMenuLabel className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground px-2 py-1">Period</DropdownMenuLabel>
                            {(["Day", "Week", "Month", "Year"] as const).map((p) => (
                                <DropdownMenuItem
                                    key={p}
                                    onClick={() => {
                                        setPeriod(p)
                                        setHoveredBucketIndex(null)
                                    }}
                                    className="text-xs focus:bg-accent px-2 py-2 rounded-none flex items-center justify-between cursor-pointer"
                                >
                                    <span>{p}</span>
                                    {period === p && <div className="h-1 w-1 bg-foreground rounded-full" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {view === "overview" ? (
                <div className="flex-1 flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                        <Card className="lg:col-span-7 bg-card border border-border rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconReceipt className="h-5 w-5 text-muted-foreground" />
                                        <h2 className="text-2xl sm:text-3xl font-serif italic text-foreground">Revenue</h2>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground max-w-[320px]">
                                        Track changes in income over time and access detailed data on each invoice and payments received
                                    </p>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">{period}</div>
                            </div>

                            <div className="relative flex items-center justify-center h-7 mb-4">
                                <div className="absolute bg-secondary border border-border rounded-lg px-3 py-1.5 shadow-lg">
                                    <span className="text-sm sm:text-base font-medium text-foreground">{currency} {Math.round(selectedBucketValue).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="h-44 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={incomeTrackerBuckets.map((b, i) => ({ ...b, index: i }))}
                                        margin={{ top: 8, right: 12, bottom: 0, left: 4 }}
                                        onMouseMove={(e: any) => {
                                            const idx = e?.activePayload?.[0]?.payload?.index
                                            if (typeof idx === 'number') setHoveredBucketIndex(idx)
                                        }}
                                        onMouseLeave={() => setHoveredBucketIndex(null)}
                                    >
                                        <CartesianGrid stroke="var(--border)" strokeOpacity={0.5} vertical={true} horizontal={true} />
                                        <XAxis
                                            dataKey="label"
                                            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                                            axisLine={{ stroke: 'var(--border)' }}
                                            tickLine={{ stroke: 'var(--border)' }}
                                        />
                                        <YAxis
                                            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                                            axisLine={{ stroke: 'var(--border)' }}
                                            tickLine={{ stroke: 'var(--border)' }}
                                            width={44}
                                        />
                                        <Tooltip
                                            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                                            content={({ active, payload, label }: any) => {
                                                if (!active || !payload?.length) return null
                                                const v = payload[0]?.value || 0
                                                return (
                                                    <div className="bg-background/90 backdrop-blur border border-border rounded-xl px-3 py-2 shadow-2xl">
                                                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                                                        <div className="text-base font-semibold text-foreground leading-tight">{currency} {Math.round(v).toLocaleString()}</div>
                                                        <div className="text-[10px] text-muted-foreground">Hover to explore</div>
                                                    </div>
                                                )
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'transparent' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-serif font-bold italic text-foreground">{incomeTrackerChangePct >= 0 ? '+' : ''}{incomeTrackerChangePct}%</div>
                                    <p className="text-xs text-muted-foreground">Compared to previous {period === 'Year' ? 'month' : period === 'Month' ? 'week' : 'day'}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="lg:col-span-5 bg-card border border-border rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm sm:text-base font-medium text-foreground">Recent Payments</h3>
                                <Link href="/invoices" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    See all
                                </Link>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                                {computedRecentPayments.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No recent payments yet</div>
                                ) : (
                                    computedRecentPayments.slice(0, 4).map((p, i) => (
                                        <button
                                            key={`payment-${i}`}
                                            type="button"
                                            onClick={() => router.push('/invoices')}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-accent transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                                <IconReceipt className="h-5 w-5 text-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-foreground truncate">{p.customerName || 'Invoice'}</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-success/20 text-success">Paid</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{currency} {Math.round(p.amount).toLocaleString()}</span>
                                            </div>
                                            <IconChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
                                        </button>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-card border border-border rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm sm:text-base font-medium text-foreground">Top Clients</h3>
                                <button type="button" onClick={() => router.push('/clients')} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">See all</button>
                            </div>
                            <div className="space-y-2">
                                {computedCashFlowMetrics.topClients.slice(0, 3).map((client, i) => (
                                    <button
                                        key={`tc-${i}`}
                                        type="button"
                                        onClick={() => router.push('/clients')}
                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                                            {client.name?.charAt(0) || 'C'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs sm:text-sm font-medium text-foreground truncate">{client.name}</div>
                                            <div className="text-[10px] text-muted-foreground">{client.count} invoices</div>
                                        </div>
                                        <span className="text-xs sm:text-sm text-muted-foreground">{currency} {client.total.toLocaleString()}</span>
                                    </button>
                                ))}
                                {computedCashFlowMetrics.topClients.length === 0 && (
                                    <div className="text-center text-muted-foreground text-xs py-4">No client data yet</div>
                                )}
                            </div>
                        </Card>

                        <Card
                            className="bg-card border border-border rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => router.push('/recurring')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm sm:text-base font-medium text-foreground">Monthly Revenue</h3>
                                <span className="text-[10px] text-muted-foreground">MRR</span>
                            </div>
                            <div className="text-2xl sm:text-3xl font-serif font-bold italic text-foreground mb-1">
                                {currency} {computedMetrics.recurring.toLocaleString()}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Recurring revenue (monthly equivalent)</p>
                        </Card>

                        <Card className="bg-card border border-border rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm sm:text-base font-medium text-foreground">Invoice Progress</h3>
                                <button type="button" onClick={() => router.push('/invoices')} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">View</button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                                <button type="button" onClick={() => router.push('/invoices?status=pending')} className="text-center hover:bg-accent rounded-lg py-2 transition-colors">
                                    <div className="text-xl sm:text-2xl font-serif font-bold italic text-foreground">{invoiceProgress.pendingCount}</div>
                                    <div className="text-[10px] text-muted-foreground">Pending</div>
                                </button>
                                <button type="button" onClick={() => router.push('/clients')} className="text-center hover:bg-accent rounded-lg py-2 transition-colors">
                                    <div className="text-xl sm:text-2xl font-serif font-bold italic text-foreground">{invoiceProgress.clientsCount}</div>
                                    <div className="text-[10px] text-muted-foreground">Clients</div>
                                </button>
                                <button type="button" onClick={() => router.push('/invoices')} className="text-center hover:bg-accent rounded-lg py-2 transition-colors">
                                    <div className="text-xl sm:text-2xl font-serif font-bold italic text-foreground">{invoiceProgress.paidCount}</div>
                                    <div className="text-[10px] text-muted-foreground">Paid</div>
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                        <Card
                            className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 shadow-2xl hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => router.push('/overview')}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconFileAnalytics className="h-5 w-5 text-muted-foreground" />
                                        <h2 className="text-2xl font-serif italic text-foreground">Cash Flow</h2>
                                    </div>
                                    <p className="text-xs text-muted-foreground max-w-[320px]">
                                        Snapshot of receivables, expenses, and profitability. Click any card to drill in.
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground">{period}</div>
                            </div>

                            <div className="flex items-baseline justify-between gap-6 mb-6">
                                <div>
                                    <div className="text-xs text-muted-foreground">Projected Annual Revenue</div>
                                    <div className="text-3xl font-serif font-bold italic text-foreground">
                                        {currency} {Math.round(computedCashFlowMetrics.projectedRevenue).toLocaleString()}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="h-8 px-4 bg-muted border-border rounded-full text-xs text-foreground hover:bg-accent"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push('/invoices')
                                    }}
                                >
                                    View invoices
                                </Button>
                            </div>

                            <div className="h-28">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={incomeTrackerBuckets.map((b, i) => ({ ...b, index: i }))}
                                        margin={{ top: 6, right: 8, bottom: 0, left: 0 }}
                                        onMouseMove={(e: any) => {
                                            const idx = e?.activePayload?.[0]?.payload?.index
                                            if (typeof idx === 'number') setHoveredBucketIndex(idx)
                                        }}
                                        onMouseLeave={() => setHoveredBucketIndex(null)}
                                    >
                                        <CartesianGrid stroke="var(--border)" strokeOpacity={0.5} vertical={true} horizontal={true} />
                                        <XAxis
                                            dataKey="label"
                                            tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }}
                                            axisLine={{ stroke: 'var(--border)' }}
                                            tickLine={{ stroke: 'var(--border)' }}
                                        />
                                        <YAxis
                                            tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }}
                                            axisLine={{ stroke: 'var(--border)' }}
                                            tickLine={{ stroke: 'var(--border)' }}
                                            width={36}
                                        />
                                        <Tooltip
                                            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                                            content={({ active, payload, label }: any) => {
                                                if (!active || !payload?.length) return null
                                                const v = payload[0]?.value || 0
                                                return (
                                                    <div className="bg-background/90 backdrop-blur border border-border rounded-xl px-3 py-2 shadow-2xl">
                                                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                                                        <div className="text-sm font-semibold text-foreground leading-tight">{currency} {Math.round(v).toLocaleString()}</div>
                                                    </div>
                                                )
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'transparent' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-foreground">Top Clients by Revenue</h3>
                                <Link href="/clients" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    See all
                                </Link>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                                {computedCashFlowMetrics.topClients.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                                        No client data yet
                                    </div>
                                ) : (
                                    computedCashFlowMetrics.topClients.slice(0, 5).map((client, i) => {
                                        const maxTotal = computedCashFlowMetrics.topClients[0]?.total || 1
                                        const widthPercent = (client.total / maxTotal) * 100
                                        return (
                                            <div key={`client-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-accent transition-colors cursor-pointer group">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                                                    <span className="text-sm font-medium text-foreground">{client.name.charAt(0)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-foreground truncate">{client.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${widthPercent}%` }} />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{client.count} inv</span>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{currency} {client.total.toLocaleString()}</span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </Card>
                    </div>
                    {/* Bottom Row: 3 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Outstanding & Overdue Card */}
                        <Link href="/invoices?status=pending" className="block">
                            <Card className="bg-card border border-border rounded-3xl p-5 shadow-xl hover:bg-accent/50 transition-all cursor-pointer h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-foreground">Outstanding</h3>
                                    <span className="text-xs text-muted-foreground">Receivable</span>
                                </div>
                                <div className="text-2xl font-serif font-bold italic text-foreground mb-1">
                                    {currency} {computedCashFlowMetrics.outstanding.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">Awaiting payment</p>
                                <div className="flex items-center gap-4 pt-3 border-t border-border">
                                    <div>
                                        <div className="text-lg font-serif font-bold italic text-foreground">{currency} {computedCashFlowMetrics.overdue.toLocaleString()}</div>
                                        <div className="text-[10px] text-muted-foreground">Overdue</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        {/* Expenses & Net Profit Card */}
                        <Link href="/expenses" className="block">
                            <Card className="bg-card border border-border rounded-3xl p-5 shadow-xl hover:bg-accent/50 transition-all cursor-pointer h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-foreground">Expenses</h3>
                                    <span className="text-xs text-muted-foreground">Monthly</span>
                                </div>
                                <div className="text-2xl font-serif font-bold italic text-foreground mb-1">
                                    {currency} {(computedMonthlyExpenses[new Date().getMonth()]?.total || 0).toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">This month's expenses</p>
                                <div className="flex items-center gap-4 pt-3 border-t border-border">
                                    <div>
                                        <div className={cn("text-lg font-serif font-bold italic", computedNetProfitYTD >= 0 ? "text-foreground" : "text-destructive")}>
                                            {currency} {Math.round(computedNetProfitYTD).toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">Net Profit YTD</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        {/* VAT & Paid YTD Card */}
                        <Card className="bg-card border border-border rounded-3xl p-5 shadow-xl hover:bg-accent/50 transition-all cursor-pointer h-full">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-foreground">Paid YTD</h3>
                                <span className="text-xs text-muted-foreground">Collected</span>
                            </div>
                            <div className="text-2xl font-serif font-bold italic text-foreground mb-1">
                                {currency} {computedCashFlowMetrics.paidYTD.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">Revenue collected</p>
                            <div className="flex items-center gap-4 pt-3 border-t border-border">
                                <div>
                                    <div className="text-lg font-serif font-bold italic text-foreground">{currency} {computedCashFlowMetrics.vatEstimate.toLocaleString()}</div>
                                    <div className="text-[10px] text-muted-foreground">VAT Liability</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

        </div>
    )
}

