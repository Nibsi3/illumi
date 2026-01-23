"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusDot } from "@/components/status-dot"
import {
    IconTrendingUp,
    IconWallet,
    IconCalendarStats,
    IconChartBar,
    IconClock,
    IconReceipt,
    IconUsers,
    IconLayoutGrid,
    IconFileAnalytics,
    IconArrowUpRight,
    IconChevronDown,
    IconLoader2
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import { useSettings } from "@/lib/settings-context"
import { useSubscription } from "@/lib/subscription/hooks"

export default function DashboardPage() {
    const router = useRouter();
    const { currency } = useSettings();
    const { isPro } = useSubscription()
    const [period, setPeriod] = useState("1 year");
    const [view, setView] = useState<"overview" | "metrics">("overview")
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay())

    const [recentPayments, setRecentPayments] = useState<
        { invoiceNumber: string; customerName: string; amount: number; paidAt: string }[]
    >([])

    // Real metrics state
    const [metrics, setMetrics] = useState({
        revenue: 0,
        customers: 0,
        products: 0,
        pendingInvoices: 0,
        recurring: 0,
        growth: 12.5
    })

    // Cash flow metrics state
    const [cashFlowMetrics, setCashFlowMetrics] = useState({
        outstanding: 0,
        overdue: 0,
        paidYTD: 0,
        vatEstimate: 0,
        projectedRevenue: 0,
        topClients: [] as { name: string; total: number; count: number }[]
    })
    
    // Monthly revenue data for charts
    const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; revenue: number; lastYear: number }[]>([])
    const [monthlyExpenses, setMonthlyExpenses] = useState<{ month: string; total: number }[]>([])
    const [netProfitYTD, setNetProfitYTD] = useState(0)

    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    // Use React Query for cached data fetching
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard-metrics', activeWorkspace?.id],
        queryFn: async () => {
            if (!activeWorkspace) return null

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
                { data: customers },
                { data: expenses },
                { data: products },
                { data: recurringTemplates },
            ] = await Promise.all([
                supabase
                    .from('invoices')
                    .select('invoice_number, total, status, issue_date, due_date, paid_at, customer_id, tax_amount')
                    .eq('workspace_id', activeWorkspace.id)
                    .gte('issue_date', startOfLastYearDate.toISOString().slice(0, 10))
                    .order('issue_date', { ascending: false }),
                supabase
                    .from('customers')
                    .select('id, name')
                    .eq('workspace_id', activeWorkspace.id)
                    .limit(1000),
                supabase
                    .from('expenses')
                    .select('amount, expense_date')
                    .eq('workspace_id', activeWorkspace.id)
                    .gte('expense_date', startOfYearDate.toISOString().slice(0, 10))
                    .order('expense_date', { ascending: false }),
                supabase
                    .from('products')
                    .select('price, billing_type')
                    .eq('workspace_id', activeWorkspace.id)
                    .limit(500),
                // Recurring invoice templates: this is the source of truth for MRR.
                // Do NOT restrict by issue_date, otherwise older templates drop out and MRR becomes 0.
                supabase
                    .from('invoices')
                    .select('total, recurring_interval, recurring_custom_interval, recurring_custom_unit, recurring_end_date')
                    .eq('workspace_id', activeWorkspace.id)
                    .eq('is_recurring', true)
                    .in('status', ['draft', 'sent', 'paid']),
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
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 3 * 60 * 1000, // Cache for 3 minutes
        refetchOnMount: false,
    })

    // Extract data from query result with defaults
    const computedRecentPayments = dashboardData?.recentPayments || []
    const computedNetProfitYTD = dashboardData?.netProfitYTD || 0
    const computedMonthlyExpenses = dashboardData?.monthlyExpenses || []
    const computedMetrics = dashboardData?.metrics || metrics
    const computedCashFlowMetrics = dashboardData?.cashFlowMetrics || cashFlowMetrics
    const computedMonthlyRevenue = dashboardData?.monthlyRevenue || []

    if (isLoading) {
        return (
            <div className="relative flex flex-col gap-y-5 animate-in fade-in duration-700 font-serif">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2 px-4 md:px-0">
                    <div className="flex flex-col gap-y-1">
                        <div className="h-10 w-64 bg-white/5 animate-pulse rounded" />
                        <div className="h-4 w-48 bg-white/5 animate-pulse rounded mt-2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-[#0c0c0c] border border-white/10 animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    // Get current day of week for chart highlight
    const currentDayOfWeek = new Date().getDay()
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    // Calculate weekly revenue from monthly data (approximate)
    const weeklyRevenue = computedMonthlyRevenue.length > 0 
        ? computedMonthlyRevenue[new Date().getMonth()]?.revenue / 4 || 0 
        : 0
    const lastWeekRevenue = weeklyRevenue * 0.8 // Simulated last week
    const weeklyGrowth = lastWeekRevenue > 0 ? Math.round(((weeklyRevenue - lastWeekRevenue) / lastWeekRevenue) * 100) : 0

    return (
        <div className="relative flex flex-col gap-y-4 animate-in fade-in duration-700 font-serif h-[calc(100vh-120px)] overflow-hidden">
            {/* Header: Greeting (Left) & Controls (Right) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 md:px-0">
                <div className="flex flex-col gap-y-1">
                    <h1 className="text-3xl font-serif font-medium tracking-tight italic">Morning <span className="text-white/40 not-italic">Cameron,</span></h1>
                    <p className="text-white/40 text-xs font-sans tracking-wide">here's a quick look at how things are going.</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Overview/Metrics Toggle */}
                    <div className="flex items-center bg-[#0c0c0c] border border-white/10 p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            onClick={() => setView("overview")}
                            className={cn(
                                "h-7 px-4 rounded-md text-[9px] uppercase font-bold tracking-widest transition-all",
                                view === "overview" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Overview
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setView("metrics")}
                            className={cn(
                                "h-7 px-4 rounded-md text-[9px] uppercase font-bold tracking-widest transition-all",
                                view === "metrics" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Metrics
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 px-3 h-9 bg-[#0c0c0c] border border-white/10 rounded-lg text-[9px] uppercase font-bold tracking-widest text-white cursor-pointer hover:bg-white/5 transition-colors">
                                <IconCalendarStats className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{period}</span>
                                <IconChevronDown className="h-3 w-3 opacity-50" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0b0b0b] border-white/10 rounded-lg text-white w-48 p-2 shadow-2xl">
                            <DropdownMenuLabel className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground px-2 py-1">Period</DropdownMenuLabel>
                            {["Week", "Month", "3 months", "6 months", "1 year"].map((p) => (
                                <DropdownMenuItem
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className="text-xs focus:bg-white/5 px-2 py-2 rounded-md flex items-center justify-between cursor-pointer"
                                >
                                    <span>{p}</span>
                                    {period === p && <div className="h-1 w-1 bg-white rounded-full" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {view === "overview" ? (
                /* ============ OVERVIEW VIEW - Matching Reference Layout ============ */
                <div className="flex-1 flex flex-col gap-4">
                    {/* Top Row: Income Tracker (Left) + Recent Payments (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                        {/* Left: Income Tracker Hero Card */}
                        <Card className="lg:col-span-7 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconReceipt className="h-5 w-5 text-white/40" />
                                        <h2 className="text-2xl font-serif italic text-white">Income Tracker</h2>
                                    </div>
                                    <p className="text-xs text-white/40 max-w-[280px]">
                                        Track changes in income over time and access detailed data on each invoice and payment received
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-8 px-3 bg-white/5 border-white/10 rounded-full text-xs text-white hover:bg-white/10">
                                            {period}
                                            <IconChevronDown className="h-3 w-3 ml-1 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-[#0b0b0b] border-white/10 rounded-xl text-white">
                                        {["Week", "Month", "3 months", "6 months", "1 year"].map((p) => (
                                            <DropdownMenuItem key={p} onClick={() => setPeriod(p)} className="text-xs cursor-pointer">
                                                {p}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Revenue Amount with Tooltip */}
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="relative mb-6">
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-1.5 shadow-lg">
                                        <span className="text-sm font-medium text-white">{currency} {Math.round(weeklyRevenue).toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                {/* Weekly Bar Chart */}
                                <div className="flex items-end justify-center gap-3 h-32 mb-4">
                                    {dayLabels.map((day, i) => {
                                        const isToday = i === currentDayOfWeek
                                        const heights = [35, 45, 55, 85, 65, 50, 40]
                                        const h = heights[i]
                                        return (
                                            <div key={`day-${i}`} className="flex flex-col items-center gap-2">
                                                <div className="relative">
                                                    {isToday && (
                                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                                                    )}
                                                    <div 
                                                        className={cn(
                                                            "w-3 rounded-full transition-all",
                                                            isToday ? "bg-white" : "bg-white/20"
                                                        )}
                                                        style={{ height: `${h}px` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Growth Indicator + Day Labels */}
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-3xl font-serif font-bold italic text-white">+{weeklyGrowth}%</div>
                                        <p className="text-xs text-white/40">This week's income is higher than last week's</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {dayLabels.map((day, i) => (
                                            <div 
                                                key={`label-${i}`}
                                                onClick={() => setSelectedDay(i)}
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:bg-white/20",
                                                    i === selectedDay 
                                                        ? "bg-white text-black" 
                                                        : "bg-white/5 text-white/40"
                                                )}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Right: Recent Payments List */}
                        <Card className="lg:col-span-5 bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-white">Your Recent Payments</h3>
                                <Link href="/invoices" className="text-xs text-white/60 hover:text-white transition-colors">
                                    See all
                                </Link>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                                {computedRecentPayments.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                                        No recent payments yet
                                    </div>
                                ) : (
                                    computedRecentPayments.slice(0, 4).map((p, i) => (
                                        <div key={`payment-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors group">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                <IconReceipt className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white truncate">{p.customerName || 'Invoice'}</span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[10px] font-medium",
                                                        "bg-green-500/20 text-green-400"
                                                    )}>
                                                        Paid
                                                    </span>
                                                </div>
                                                <span className="text-xs text-white/40">{currency} {Math.round(p.amount).toLocaleString()}</span>
                                            </div>
                                            <IconChevronDown className="h-4 w-4 text-white/20 -rotate-90 group-hover:text-white/40 transition-colors" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Bottom Row: 3 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Top Clients Card */}
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-white">Top Clients</h3>
                                <Link href="/clients" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                                    See all
                                </Link>
                            </div>
                            <div className="space-y-2">
                                {computedCashFlowMetrics.topClients.slice(0, 3).map((client, i) => (
                                    <div key={`tc-${i}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:bg-white/20 transition-colors">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium text-white truncate">{client.name}</div>
                                            <div className="text-[10px] text-white/40">{client.count} invoices</div>
                                        </div>
                                        <span className="text-xs text-white/60">{currency} {client.total.toLocaleString()}</span>
                                    </div>
                                ))}
                                {computedCashFlowMetrics.topClients.length === 0 && (
                                    <div className="text-center text-white/30 text-xs py-4">No client data yet</div>
                                )}
                            </div>
                        </Card>

                        {/* Monthly Revenue Card - Free for everyone */}
                        <Link href="/recurring" className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-xl hover:bg-white/5 transition-all cursor-pointer h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-white">Monthly Revenue</h3>
                                    <span className="text-xs text-white/40">{period}</span>
                                </div>
                                <div className="text-2xl font-serif font-bold italic text-white mb-1">
                                    {currency} {computedMetrics.recurring.toLocaleString()}
                                </div>
                                <p className="text-xs text-white/40">Recurring revenue this month</p>
                                <div className="mt-3 flex items-end gap-0.5 h-6">
                                    {computedMonthlyRevenue.slice(0, 6).map((m, i) => {
                                        const max = Math.max(...computedMonthlyRevenue.slice(0, 6).map(x => x.revenue), 1)
                                        const h = (m.revenue / max) * 100
                                        return (
                                            <div 
                                                key={`rev-${i}`}
                                                className="flex-1 rounded-sm bg-white/20 hover:bg-white/40 transition-colors"
                                                style={{ height: `${Math.max(h, 15)}%` }}
                                            />
                                        )
                                    })}
                                </div>
                            </Card>
                        </Link>

                        {/* Invoice Progress Card */}
                        <Link href="/invoices" className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-xl hover:bg-white/5 transition-all cursor-pointer h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-white">Invoice Progress</h3>
                                    <span className="text-xs text-white/40">{period}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={(e) => { e.preventDefault(); router.push('/invoices?status=pending') }}>
                                        <div className="text-xl font-serif font-bold italic text-white">{computedMetrics.pendingInvoices}</div>
                                        <div className="text-[10px] text-white/40">Pending</div>
                                    </div>
                                    <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={(e) => { e.preventDefault(); router.push('/clients') }}>
                                        <div className="text-xl font-serif font-bold italic text-white">{computedMetrics.customers}</div>
                                        <div className="text-[10px] text-white/40">Clients</div>
                                    </div>
                                    <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={(e) => { e.preventDefault(); router.push('/invoices?status=paid') }}>
                                        <div className="text-xl font-serif font-bold italic text-white">{computedRecentPayments.length}</div>
                                        <div className="text-[10px] text-white/40">Paid</div>
                                    </div>
                                </div>
                                {/* Mini bar chart */}
                                <div className="flex items-end gap-0.5 h-8">
                                    {computedMonthlyRevenue.slice(0, 12).map((m, i) => {
                                        const max = Math.max(...computedMonthlyRevenue.map(x => x.revenue), 1)
                                        const h = (m.revenue / max) * 100
                                        return (
                                            <div 
                                                key={`mini-${i}`}
                                                className={cn("flex-1 rounded-sm cursor-pointer hover:opacity-80 transition-opacity", i === new Date().getMonth() ? "bg-white" : "bg-white/20")}
                                                style={{ height: `${Math.max(h, 10)}%` }}
                                            />
                                        )
                                    })}
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>
            ) : (
                /* ============ METRICS VIEW - Similar Layout to Overview ============ */
                <div className="flex-1 flex flex-col gap-4">
                    {/* Top Row: Cash Flow Overview (Left) + Top Clients (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                        {/* Left: Cash Flow Hero Card */}
                        <Card className="lg:col-span-7 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconChartBar className="h-5 w-5 text-white/40" />
                                        <h2 className="text-2xl font-serif italic text-white">Cash Flow</h2>
                                    </div>
                                    <p className="text-xs text-white/40 max-w-[280px]">
                                        Monitor your business cash flow, outstanding payments, and revenue trends
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-8 px-3 bg-white/5 border-white/10 rounded-full text-xs text-white hover:bg-white/10">
                                            {period}
                                            <IconChevronDown className="h-3 w-3 ml-1 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-[#0b0b0b] border-white/10 rounded-xl text-white">
                                        {["Week", "Month", "3 months", "6 months", "1 year"].map((p) => (
                                            <DropdownMenuItem key={p} onClick={() => setPeriod(p)} className="text-xs cursor-pointer">
                                                {p}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Revenue Chart */}
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="text-4xl font-serif font-bold italic text-white mb-2">
                                    {currency} {Math.round(computedCashFlowMetrics.projectedRevenue).toLocaleString()}
                                </div>
                                <p className="text-xs text-white/40 mb-6">Projected annual revenue</p>
                                
                                {/* Monthly Chart */}
                                <div className="flex items-end gap-1 h-24 mb-4">
                                    {computedMonthlyRevenue.map((data, i) => {
                                        const maxRevenue = Math.max(...computedMonthlyRevenue.map(d => d.revenue), 1)
                                        const heightPercent = (data.revenue / maxRevenue) * 100
                                        const isCurrentMonth = i === new Date().getMonth()
                                        return (
                                            <div 
                                                key={`chart-${i}`} 
                                                className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                                                onClick={() => toast.info(`${data.month}: ${currency} ${data.revenue.toLocaleString()}`)}
                                            >
                                                <div 
                                                    className={cn(
                                                        "w-full rounded-t transition-all group-hover:opacity-80",
                                                        isCurrentMonth ? "bg-white" : "bg-white/20"
                                                    )}
                                                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                                />
                                                <span className={cn("text-[8px]", isCurrentMonth ? "text-white" : "text-neutral-600")}>{data.month}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Card>

                        {/* Right: Top Clients List */}
                        <Card className="lg:col-span-5 bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-white">Top Clients by Revenue</h3>
                                <Link href="/clients" className="text-xs text-white/60 hover:text-white transition-colors">
                                    See all
                                </Link>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                                {computedCashFlowMetrics.topClients.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                                        No client data yet
                                    </div>
                                ) : (
                                    computedCashFlowMetrics.topClients.slice(0, 5).map((client, i) => {
                                        const maxTotal = computedCashFlowMetrics.topClients[0]?.total || 1
                                        const widthPercent = (client.total / maxTotal) * 100
                                        return (
                                            <div key={`client-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                    <span className="text-sm font-medium text-white">{client.name.charAt(0)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-white truncate">{client.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${widthPercent}%` }} />
                                                        </div>
                                                        <span className="text-xs text-white/40">{client.count} inv</span>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-white">{currency} {client.total.toLocaleString()}</span>
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
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-xl hover:bg-white/5 transition-all cursor-pointer h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-white">Outstanding</h3>
                                    <span className="text-xs text-white/40">Receivable</span>
                                </div>
                                <div className="text-2xl font-serif font-bold italic text-white mb-1">
                                    {currency} {computedCashFlowMetrics.outstanding.toLocaleString()}
                                </div>
                                <p className="text-xs text-white/40 mb-3">Awaiting payment</p>
                                <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                                    <div>
                                        <div className="text-lg font-serif font-bold italic text-white">{currency} {computedCashFlowMetrics.overdue.toLocaleString()}</div>
                                        <div className="text-[10px] text-white/40">Overdue</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        {/* Expenses & Net Profit Card */}
                        <Link href="/expenses" className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-xl hover:bg-white/5 transition-all cursor-pointer h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-white">Expenses</h3>
                                    <span className="text-xs text-white/40">Monthly</span>
                                </div>
                                <div className="text-2xl font-serif font-bold italic text-white mb-1">
                                    {currency} {(computedMonthlyExpenses[new Date().getMonth()]?.total || 0).toLocaleString()}
                                </div>
                                <p className="text-xs text-white/40 mb-3">This month's expenses</p>
                                <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                                    <div>
                                        <div className={cn("text-lg font-serif font-bold italic", computedNetProfitYTD >= 0 ? "text-white" : "text-red-400")}>
                                            {currency} {Math.round(computedNetProfitYTD).toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-white/40">Net Profit YTD</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        {/* VAT & Paid YTD Card */}
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-xl hover:bg-white/5 transition-all cursor-pointer h-full">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-white">Paid YTD</h3>
                                <span className="text-xs text-white/40">Collected</span>
                            </div>
                            <div className="text-2xl font-serif font-bold italic text-white mb-1">
                                {currency} {computedCashFlowMetrics.paidYTD.toLocaleString()}
                            </div>
                            <p className="text-xs text-white/40 mb-3">Revenue collected</p>
                            <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                                <div>
                                    <div className="text-lg font-serif font-bold italic text-white">{currency} {computedCashFlowMetrics.vatEstimate.toLocaleString()}</div>
                                    <div className="text-[10px] text-white/40">VAT Liability</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

        </div>
    )
}
