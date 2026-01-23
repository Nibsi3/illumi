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
import React, { useState, useMemo } from "react"
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

export default function DashboardPage() {
    const router = useRouter();
    const { currency } = useSettings();
    const [view, setView] = useState<"overview" | "metrics">("overview");
    const [period, setPeriod] = useState<"Week" | "Month" | "Year">("Week");
    const [selectedBucketIndex, setSelectedBucketIndex] = useState(0)

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

    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    // Use React Query for cached data fetching
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard-metrics', activeWorkspace?.id],
        queryFn: async () => {
            if (!activeWorkspace) return null

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
                const recurring = products
                    ?.filter(p => p.billing_type === 'recurring')
                    .reduce((acc, curr) => acc + (curr.price || 0), 0) || 0

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
    const computedMetrics = dashboardData?.metrics || defaultMetrics
    const computedCashFlowMetrics = dashboardData?.cashFlowMetrics || defaultCashFlowMetrics
    const computedMonthlyRevenue = dashboardData?.monthlyRevenue || []

    const incomeTrackerBuckets = useMemo(() => {
        const currentMonthIndex = new Date().getMonth()
        const currentMonthRevenue = computedMonthlyRevenue[currentMonthIndex]?.revenue || 0

        if (period === 'Week') {
            const weights = [0.9, 0.8, 0.95, 1.3, 1.05, 0.85, 0.75]
            const denom = weights.reduce((a, b) => a + b, 0) || 1
            const base = currentMonthRevenue / denom
            const values = weights.map(w => Math.round(base * w))
            const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            return labels.map((label, i) => ({ label, value: values[i] || 0 }))
        }

        if (period === 'Month') {
            const values = [0.24, 0.26, 0.25, 0.25].map(w => Math.round(currentMonthRevenue * w))
            const labels = ['W1', 'W2', 'W3', 'W4']
            return labels.map((label, i) => ({ label, value: values[i] || 0 }))
        }

        const months = (computedMonthlyRevenue.length ? computedMonthlyRevenue : []).slice(0, 12)
        const fallback = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        return Array.from({ length: 12 }).map((_, i) => ({
            label: months[i]?.month || fallback[i],
            value: months[i]?.revenue || 0,
        }))
    }, [computedMonthlyRevenue, period])

    const clampedSelectedBucketIndex = Math.min(
        Math.max(selectedBucketIndex, 0),
        Math.max(incomeTrackerBuckets.length - 1, 0)
    )

    const selectedBucketValue = incomeTrackerBuckets[clampedSelectedBucketIndex]?.value || 0
    const previousBucketValue = incomeTrackerBuckets[Math.max(clampedSelectedBucketIndex - 1, 0)]?.value || 0
    const incomeTrackerChangePct = previousBucketValue > 0
        ? Math.round(((selectedBucketValue - previousBucketValue) / previousBucketValue) * 100)
        : 0

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

    return (
        <div className="relative flex flex-col gap-y-3 animate-in fade-in duration-700 font-serif h-[calc(100vh-120px)] overflow-hidden">
            {/* Header: Greeting (Left) & Controls (Right) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-1 px-4 md:px-0">
                <div className="flex flex-col gap-y-1">
                    <h1 className="text-3xl font-serif font-medium tracking-tight italic">Morning <span className="text-white/40 not-italic">Cameron,</span></h1>
                    <p className="text-white/40 text-xs font-sans tracking-wide">here's a quick look at how things are going.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#0c0c0c] border border-white/10 p-1">
                        <Button
                            variant="ghost"
                            onClick={() => setView("overview")}
                            className={cn(
                                "h-7 px-4 rounded-none text-[8px] uppercase font-bold tracking-widest transition-all",
                                view === "overview" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Overview
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setView("metrics")}
                            className={cn(
                                "h-7 px-4 rounded-none text-[8px] uppercase font-bold tracking-widest transition-all",
                                view === "metrics" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Metrics
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 px-3 h-9 bg-[#0c0c0c] border border-white/10 rounded-none text-[9px] uppercase font-bold tracking-widest text-white cursor-pointer hover:bg-white/5 transition-colors">
                                <IconCalendarStats className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{period}</span>
                                <IconChevronDown className="h-3 w-3 opacity-50" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0b0b0b] border-white/10 rounded-none text-white w-48 p-2 shadow-2xl">
                            <DropdownMenuLabel className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground px-2 py-1">Period</DropdownMenuLabel>
                            {(["Week", "Month", "Year"] as const).map((p) => (
                                <DropdownMenuItem
                                    key={p}
                                    onClick={() => {
                                        setPeriod(p)
                                        setSelectedBucketIndex(0)
                                    }}
                                    className="text-xs focus:bg-white/5 px-2 py-2 rounded-none flex items-center justify-between cursor-pointer"
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
                <div className="flex-1 flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                        <Card className="lg:col-span-7 bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 shadow-2xl hover:bg-white/2 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconReceipt className="h-5 w-5 text-white/60" />
                                        <h2 className="text-2xl font-serif italic text-white">Income Tracker</h2>
                                    </div>
                                    <p className="text-xs text-white/40 max-w-[320px]">
                                        Track changes in income over time and access detailed data on each invoice and payments received
                                    </p>
                                </div>
                                <div className="text-xs text-white/40">{period}</div>
                            </div>

                            <div className="relative flex items-center justify-center h-7 mb-4">
                                <div className="absolute bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 shadow-lg">
                                    <span className="text-sm font-medium text-white">{currency} {Math.round(selectedBucketValue).toLocaleString()}</span>
                                </div>
                            </div>

                            {(() => {
                                const w = 560
                                const h = 160
                                const padX = 18
                                const padY = 18
                                const values = incomeTrackerBuckets.map(b => b.value)
                                const min = Math.min(...values, 0)
                                const max = Math.max(...values, 1)
                                const range = Math.max(max - min, 1)
                                const xStep = incomeTrackerBuckets.length > 1
                                    ? (w - padX * 2) / (incomeTrackerBuckets.length - 1)
                                    : 0

                                const points = incomeTrackerBuckets.map((b, i) => {
                                    const x = padX + i * xStep
                                    const y = padY + (1 - ((b.value - min) / range)) * (h - padY * 2)
                                    return { x, y, label: b.label, value: b.value, index: i }
                                })

                                const d = points
                                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
                                    .join(' ')

                                return (
                                    <div className="relative h-40 mb-4 px-2">
                                        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" aria-hidden="true">
                                            <path
                                                d={d}
                                                fill="none"
                                                stroke="rgba(255,255,255,0.65)"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                            />
                                            {points.map((p) => {
                                                const isSelected = p.index === clampedSelectedBucketIndex
                                                return (
                                                    <circle
                                                        key={`it-pt-${p.label}-${p.index}`}
                                                        cx={p.x}
                                                        cy={p.y}
                                                        r={isSelected ? 4.5 : 3.5}
                                                        fill={isSelected ? '#ffffff' : 'rgba(255,255,255,0.25)'}
                                                    />
                                                )
                                            })}
                                        </svg>

                                        <div
                                            className="absolute inset-0 grid"
                                            style={{ gridTemplateColumns: `repeat(${incomeTrackerBuckets.length}, minmax(0, 1fr))` }}
                                        >
                                            {incomeTrackerBuckets.map((b, i) => (
                                                <button
                                                    key={`it-hit-${b.label}-${i}`}
                                                    type="button"
                                                    onClick={() => setSelectedBucketIndex(i)}
                                                    className="h-full w-full"
                                                    title={`${b.label}: ${currency} ${b.value.toLocaleString()}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })()}

                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-serif font-bold italic text-white">{incomeTrackerChangePct >= 0 ? '+' : ''}{incomeTrackerChangePct}%</div>
                                    <p className="text-xs text-white/40">Compared to previous {period === 'Year' ? 'month' : period === 'Month' ? 'week' : 'day'}</p>
                                </div>
                                <div className="flex gap-3">
                                    {incomeTrackerBuckets.map((b, i) => {
                                        const isSelected = i === clampedSelectedBucketIndex
                                        return (
                                            <button
                                                key={`it-pill-${b.label}-${i}`}
                                                type="button"
                                                onClick={() => setSelectedBucketIndex(i)}
                                                className={cn(
                                                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                                                    isSelected ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/15"
                                                )}
                                            >
                                                {b.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </Card>

                        <Card className="lg:col-span-5 bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-white">Your Recent Payments</h3>
                                <Link href="/invoices" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                                    See all
                                </Link>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                                {computedRecentPayments.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-white/30 text-sm">No recent payments yet</div>
                                ) : (
                                    computedRecentPayments.slice(0, 4).map((p, i) => (
                                        <button
                                            key={`payment-${i}`}
                                            type="button"
                                            onClick={() => router.push('/invoices')}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                <IconReceipt className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white truncate">{p.customerName || 'Invoice'}</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white">Paid</span>
                                                </div>
                                                <span className="text-xs text-white/40">{currency} {Math.round(p.amount).toLocaleString()}</span>
                                            </div>
                                            <IconChevronDown className="h-4 w-4 text-white/20 -rotate-90" />
                                        </button>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-2xl hover:bg-white/2 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-white">Top Clients</h3>
                                <button type="button" onClick={() => router.push('/clients')} className="text-xs text-white/40 hover:text-white/60 transition-colors">See all</button>
                            </div>
                            <div className="space-y-2">
                                {computedCashFlowMetrics.topClients.slice(0, 3).map((client, i) => (
                                    <button
                                        key={`tc-${i}`}
                                        type="button"
                                        onClick={() => router.push('/clients')}
                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                                            {client.name?.charAt(0) || 'C'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium text-white truncate">{client.name}</div>
                                            <div className="text-[10px] text-white/40">{client.count} invoices</div>
                                        </div>
                                        <span className="text-xs text-white/60">{currency} {client.total.toLocaleString()}</span>
                                    </button>
                                ))}
                                {computedCashFlowMetrics.topClients.length === 0 && (
                                    <div className="text-center text-white/30 text-xs py-4">No client data yet</div>
                                )}
                            </div>
                        </Card>

                        <Card
                            className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-2xl hover:bg-white/2 transition-colors cursor-pointer"
                            onClick={() => router.push('/recurring')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-white">Monthly Revenue</h3>
                                <span className="text-[10px] text-white/40">MRR</span>
                            </div>
                            <div className="text-2xl font-serif font-bold italic text-white mb-1">
                                {currency} {computedMetrics.recurring.toLocaleString()}
                            </div>
                            <p className="text-xs text-white/40">Recurring revenue (monthly equivalent)</p>
                        </Card>

                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-white">Invoice Progress</h3>
                                <button type="button" onClick={() => router.push('/invoices')} className="text-xs text-white/40 hover:text-white/60 transition-colors">{period}</button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                                <button type="button" onClick={() => router.push('/invoices?status=pending')} className="text-center hover:bg-white/5 rounded-lg py-2 transition-colors">
                                    <div className="text-xl font-serif font-bold italic text-white">{computedMetrics.pendingInvoices}</div>
                                    <div className="text-[10px] text-white/40">Pending</div>
                                </button>
                                <button type="button" onClick={() => router.push('/clients')} className="text-center hover:bg-white/5 rounded-lg py-2 transition-colors">
                                    <div className="text-xl font-serif font-bold italic text-white">{computedMetrics.customers}</div>
                                    <div className="text-[10px] text-white/40">Clients</div>
                                </button>
                                <button type="button" onClick={() => router.push('/invoices')} className="text-center hover:bg-white/5 rounded-lg py-2 transition-colors">
                                    <div className="text-xl font-serif font-bold italic text-white">{computedRecentPayments.length}</div>
                                    <div className="text-[10px] text-white/40">Paid</div>
                                </button>
                            </div>
                            <div className="flex items-end gap-0.5 h-8">
                                {computedMonthlyRevenue.slice(0, 12).map((m, i) => {
                                    const max = Math.max(...computedMonthlyRevenue.map(x => x.revenue), 1)
                                    const h = (m.revenue / max) * 100
                                    const isCurrent = i === new Date().getMonth()
                                    return (
                                        <button
                                            key={`mini-${i}`}
                                            type="button"
                                            onClick={() => toast(`${m.month}: ${currency} ${m.revenue.toLocaleString()}`)}
                                            className={cn("flex-1 rounded-sm transition-colors", isCurrent ? "bg-white" : "bg-white/20 hover:bg-white/30")}
                                            style={{ height: `${Math.max(h, 10)}%` }}
                                        />
                                    )
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                        <Card
                            className="lg:col-span-7 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 shadow-2xl hover:bg-white/2 transition-colors cursor-pointer"
                            onClick={() => router.push('/overview')}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconFileAnalytics className="h-5 w-5 text-white/60" />
                                        <h2 className="text-2xl font-serif italic text-white">Cash Flow</h2>
                                    </div>
                                    <p className="text-xs text-white/40 max-w-[320px]">
                                        Snapshot of receivables, expenses, and profitability. Click any card to drill in.
                                    </p>
                                </div>
                                <div className="text-xs text-white/40">{period}</div>
                            </div>

                            <div className="flex items-baseline justify-between gap-6 mb-6">
                                <div>
                                    <div className="text-xs text-white/40">Projected Annual Revenue</div>
                                    <div className="text-3xl font-serif font-bold italic text-white">
                                        {currency} {Math.round(computedCashFlowMetrics.projectedRevenue).toLocaleString()}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="h-8 px-4 bg-white/5 border-white/10 rounded-full text-xs text-white hover:bg-white/10"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push('/invoices')
                                    }}
                                >
                                    View invoices
                                </Button>
                            </div>

                            <div className="flex items-end gap-1 h-24">
                                {computedMonthlyRevenue.slice(0, 12).map((m, i) => {
                                    const max = Math.max(...computedMonthlyRevenue.map(x => x.revenue), 1)
                                    const h = (m.revenue / max) * 100
                                    const isCurrent = i === new Date().getMonth()
                                    return (
                                        <button
                                            key={`cf-bar-${i}`}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toast(`${m.month}: ${currency} ${m.revenue.toLocaleString()}`)
                                            }}
                                            className={cn(
                                                "flex-1 rounded-sm transition-colors",
                                                isCurrent ? "bg-white" : "bg-white/20 hover:bg-white/30"
                                            )}
                                            style={{ height: `${Math.max(h, 8)}%` }}
                                            title={`${m.month}: ${currency} ${m.revenue.toLocaleString()}`}
                                        />
                                    )
                                })}
                            </div>
                        </Card>

                        <Card className="lg:col-span-5 bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-white">Top Clients by Revenue</h3>
                                <button type="button" onClick={() => router.push('/clients')} className="text-xs text-white/40 hover:text-white/60 transition-colors">See all</button>
                            </div>
                            <div className="flex-1 space-y-3 overflow-hidden">
                                {computedCashFlowMetrics.topClients.length > 0 ? (
                                    computedCashFlowMetrics.topClients.slice(0, 5).map((client, i) => {
                                        const maxTotal = computedCashFlowMetrics.topClients[0]?.total || 1
                                        const widthPercent = (client.total / maxTotal) * 100
                                        return (
                                            <button
                                                key={`client-${i}`}
                                                type="button"
                                                onClick={() => router.push('/clients')}
                                                className="w-full text-left rounded-lg hover:bg-white/5 transition-colors p-2"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-xs text-white truncate max-w-[60%]">{client.name}</span>
                                                    <span className="text-xs text-white/60">{currency} {client.total.toLocaleString()}</span>
                                                </div>
                                                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-white rounded-full" style={{ width: `${widthPercent}%` }} />
                                                </div>
                                            </button>
                                        )
                                    })
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-white/30 text-sm">No client data yet</div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card
                            className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-2xl hover:bg-white/2 transition-colors cursor-pointer"
                            onClick={() => router.push('/invoices')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-white">Receivables</h3>
                                <span className="text-[10px] text-white/40">Outstanding / Overdue</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-[10px] text-white/40">Outstanding</div>
                                    <div className="text-xl font-serif font-bold italic text-white">{currency} {computedCashFlowMetrics.outstanding.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40">Overdue</div>
                                    <div className="text-xl font-serif font-bold italic text-white">{currency} {computedCashFlowMetrics.overdue.toLocaleString()}</div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-2xl hover:bg-white/2 transition-colors cursor-pointer"
                            onClick={() => router.push('/expenses')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-white">Costs & Profit</h3>
                                <span className="text-[10px] text-white/40">Expenses / Net Profit</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-[10px] text-white/40">Expenses (this month)</div>
                                    <div className="text-xl font-serif font-bold italic text-white">
                                        {currency} {(computedMonthlyExpenses[new Date().getMonth()]?.total || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40">Net Profit (YTD)</div>
                                    <div className="text-xl font-serif font-bold italic text-white">
                                        {currency} {Math.round(computedNetProfitYTD).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-5 shadow-2xl hover:bg-white/2 transition-colors cursor-pointer"
                            onClick={() => router.push('/overview')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-white">Tax & Collections</h3>
                                <span className="text-[10px] text-white/40">Paid YTD / VAT</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-[10px] text-white/40">Paid (YTD)</div>
                                    <div className="text-xl font-serif font-bold italic text-white">{currency} {computedCashFlowMetrics.paidYTD.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40">VAT Estimate (YTD)</div>
                                    <div className="text-xl font-serif font-bold italic text-white">{currency} {computedCashFlowMetrics.vatEstimate.toLocaleString()}</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

        </div>
    )
}
