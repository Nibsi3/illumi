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
import React, { useState, useEffect } from "react"
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
    const [view, setView] = useState<"overview" | "metrics">("overview");
    const [period, setPeriod] = useState("1 year");

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

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user || !activeWorkspace) return

                const now = new Date()
                const currentYear = now.getFullYear()
                const currentMonth = now.getMonth()
                const startOfYear = new Date(currentYear, 0, 1).toISOString()
                const startOfYearDate = new Date(currentYear, 0, 1)

                // Fetch Invoices with full details for comprehensive metrics
                const { data: invoices } = await supabase
                    .from('invoices')
                    .select('invoice_number, total, status, issue_date, due_date, paid_at, customer_id, tax_amount')
                    .eq('workspace_id', activeWorkspace.id)

                // Fetch customers for top clients calculation
                const { data: customers } = await supabase
                    .from('customers')
                    .select('id, name')
                    .eq('workspace_id', activeWorkspace.id)

                const { data: expenses } = await supabase
                    .from('expenses')
                    .select('amount, expense_date')
                    .eq('workspace_id', activeWorkspace.id)
                    .gte('expense_date', startOfYearDate.toISOString().slice(0, 10))

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
                setRecentPayments(recent)

                const expensesYTD = (expenses || []).reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0)
                setNetProfitYTD(totalRevenue - expensesYTD)

                const expensesByMonth = new Map<number, number>()
                ;(expenses || []).forEach((e: any) => {
                    const d = e?.expense_date ? new Date(e.expense_date) : null
                    if (!d || Number.isNaN(d.getTime())) return
                    const m = d.getMonth()
                    expensesByMonth.set(m, (expensesByMonth.get(m) || 0) + (Number(e.amount) || 0))
                })

                const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                setMonthlyExpenses(
                    Array.from({ length: 12 }).map((_, i) => ({
                        month: monthLabels[i],
                        total: Math.round(expensesByMonth.get(i) || 0),
                    }))
                )

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

                // Fetch Products
                const { data: products } = await supabase
                    .from('products')
                    .select('price, billing_type')
                    .eq('workspace_id', activeWorkspace.id)

                const productCount = products?.length || 0
                const recurring = products
                    ?.filter(p => p.billing_type === 'recurring')
                    .reduce((acc, curr) => acc + (curr.price || 0), 0) || 0

                // Update metrics state
                setMetrics({
                    revenue: totalRevenue,
                    customers: customers?.length || 0,
                    products: productCount,
                    pendingInvoices: pendingCount,
                    recurring: recurring,
                    growth: momGrowth
                })

                setCashFlowMetrics({
                    outstanding,
                    overdue,
                    paidYTD,
                    vatEstimate: Math.round(vatEstimate),
                    projectedRevenue: Math.round(projectedRevenue),
                    topClients: topClients
                })

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
                setMonthlyRevenue(monthlyData)
            } catch (error) {
                console.error("Error fetching metrics:", error)
            }
        }
        fetchMetrics()
    }, [supabase, activeWorkspace])

    return (
        <div className="relative flex flex-col gap-y-5 animate-in fade-in duration-700 font-serif">
            {/* Header: Greeting (Left) & Controls (Right) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2 px-4 md:px-0">
                <div className="flex flex-col gap-y-1">
                    <h1 className="text-4xl font-serif font-medium tracking-tight italic">Morning <span className="text-white/40 not-italic">Cameron,</span></h1>
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
                            {["3 months", "6 months", "1 year", "2 years", "5 years", "Fiscal year", "Custom"].map((p) => (
                                <DropdownMenuItem
                                    key={p}
                                    onClick={() => setPeriod(p)}
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
                    <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isPro ? (
                            <Link href="/recurring" className="block">
                                <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/2 transition-colors group min-h-[190px] shadow-2xl">
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                            <IconClock className="h-4 w-4" />
                                            Recurring
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[11px] text-muted-foreground">Monthly Recurring Revenue</div>
                                            <div className="text-4xl font-serif font-bold tracking-tight italic">{currency} {metrics.recurring.toLocaleString()}</div>
                                            <div className="text-[10px] text-neutral-500 font-medium tracking-tight">Based on active subscriptions</div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ) : (
                            <div className="block">
                                <Card
                                    className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 group min-h-[190px] shadow-2xl opacity-70 cursor-not-allowed"
                                    onClick={() => router.push('/settings/billing')}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                                <IconClock className="h-4 w-4" />
                                                Recurring
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">Pro</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[11px] text-muted-foreground">Monthly Recurring Revenue</div>
                                            <div className="text-4xl font-serif font-bold tracking-tight italic">{currency} 0</div>
                                            <div className="text-[10px] text-neutral-500 font-medium tracking-tight">Upgrade to enable recurring invoices</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        <Link href="/inbox" className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/2 transition-colors group min-h-[190px] shadow-2xl">
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <IconWallet className="h-4 w-4" />
                                        Pending
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[11px] text-muted-foreground">Pending / Draft Invoices</div>
                                        <div className="text-4xl font-serif font-bold tracking-tight italic">{metrics.pendingInvoices}</div>
                                        {metrics.pendingInvoices > 0 && <StatusDot variant="warning" className="mt-1">Requires action</StatusDot>}
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link href="/invoices" className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/2 transition-colors group min-h-[190px] shadow-2xl">
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <IconReceipt className="h-4 w-4" />
                                        Invoices
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[11px] text-muted-foreground">Net revenue - {period}</div>
                                        <div className="text-4xl font-serif font-bold tracking-tight italic">{currency} {metrics.revenue.toLocaleString()}</div>
                                        <div className="text-[9px] uppercase font-bold text-white/40 mt-1 flex items-center gap-1.5">
                                            <IconTrendingUp className="h-3 w-3" />
                                            +{metrics.growth}% vs last month
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link href="/clients" className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/2 transition-colors group min-h-[190px] shadow-2xl">
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <IconUsers className="h-4 w-4" />
                                        Clients
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[11px] text-muted-foreground">Total active clients</div>
                                        <div className="text-4xl font-serif font-bold tracking-tight italic">{metrics.customers}</div>
                                        <div className="text-[10px] text-neutral-500 font-medium">Keep growing!</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link href="/products" className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/2 transition-colors group min-h-[190px] shadow-2xl">
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <IconLayoutGrid className="h-4 w-4" />
                                        Products
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[11px] text-muted-foreground">Managed services & items</div>
                                        <div className="text-4xl font-serif font-bold tracking-tight italic">{metrics.products}</div>
                                        <div className="text-[10px] text-neutral-500 font-medium">Available for invoicing</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link href="/overview" onClick={(e) => { e.preventDefault(); setView("metrics"); }} className="block">
                            <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/2 transition-colors group min-h-[190px] shadow-2xl">
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <IconTrendingUp className="h-4 w-4" />
                                        Revenue Summaries
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[11px] text-muted-foreground">Estimated gross - {period}</div>
                                        <div className="text-4xl font-serif font-bold tracking-tight italic">{currency} {metrics.revenue.toLocaleString()}</div>
                                        <div className="text-[9px] uppercase font-bold text-muted-foreground/30">Tax: {currency} {(metrics.revenue * 0.15).toLocaleString()}</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>

                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 shadow-2xl min-h-[386px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconChartBar className="h-4 w-4" />
                                    Recent Payments
                                </div>
                                <Link href="/invoices" className="text-[9px] uppercase tracking-widest font-bold text-white/30 hover:text-white/60 transition-colors">
                                    View all
                                </Link>
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                                {recentPayments.length === 0 ? (
                                    <div className="text-xs text-white/30">No recent payments yet.</div>
                                ) : (
                                    recentPayments.map((p) => (
                                        <div key={`${p.invoiceNumber}-${p.paidAt}`} className="rounded-xl border border-white/5 bg-black/40 px-6 py-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="text-[11px] text-white/80 font-semibold truncate">Payment received for {p.invoiceNumber || "invoice"}</div>
                                                    <div className="text-[10px] text-white/30 truncate">{p.customerName}</div>
                                                    <div className="mt-2 text-[10px] text-white/20">{new Date(p.paidAt).toLocaleString()}</div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-[11px] uppercase tracking-widest font-bold text-white/30">Payment received</div>
                                                    <div className="mt-2 text-lg font-serif font-bold italic text-white">{currency} {Math.round(p.amount).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>

                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 shadow-2xl min-h-[190px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconFileAnalytics className="h-4 w-4" />
                                    Account Performance
                                </div>
                                <div className="text-[9px] text-white/20">Updated just now</div>
                            </div>
                            <div className="mt-6 flex items-end gap-x-2 h-32">
                                {monthlyRevenue.map((m, i, arr) => {
                                    const max = Math.max(...arr.map(x => x.revenue), 1)
                                    const h = (m.revenue / max) * 100
                                    return (
                                        <div
                                            key={`ap-${m.month}-${i}`}
                                            className="flex-1 bg-white/5 hover:bg-white/20 transition-all rounded-sm cursor-pointer"
                                            style={{ height: `${Math.max(h, 6)}%` }}
                                            title={`${m.month}: ${currency} ${m.revenue.toLocaleString()}`}
                                        />
                                    )
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                /* Metrics View - Comprehensive Cash Flow Dashboard */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    {/* Cash Flow Trio */}
                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Outstanding</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">RECEIVABLE</div>
                            </div>
                            <h3 className="text-3xl font-serif font-bold italic text-white">{currency} {cashFlowMetrics.outstanding.toLocaleString()}</h3>
                            <p className="text-[10px] text-neutral-500">Invoices awaiting payment</p>
                        </div>
                    </Card>

                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Overdue</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">URGENT</div>
                            </div>
                            <h3 className="text-3xl font-serif font-bold italic text-white">{currency} {cashFlowMetrics.overdue.toLocaleString()}</h3>
                            <p className="text-[10px] text-neutral-500">Past due date invoices</p>
                        </div>
                    </Card>

                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Paid YTD</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">COLLECTED</div>
                            </div>
                            <h3 className="text-3xl font-serif font-bold italic text-white">{currency} {cashFlowMetrics.paidYTD.toLocaleString()}</h3>
                            <p className="text-[10px] text-neutral-500">Revenue collected this year</p>
                        </div>
                    </Card>

                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Expenses</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">MONTHLY</div>
                            </div>
                            <h3 className="text-3xl font-serif font-bold italic text-white">
                                {currency} {(monthlyExpenses[new Date().getMonth()]?.total || 0).toLocaleString()}
                            </h3>
                            <p className="text-[10px] text-neutral-500">Total expenses this month</p>
                            <div className="flex items-end gap-1 h-16 mt-1">
                                {monthlyExpenses.slice(Math.max(new Date().getMonth() - 5, 0), new Date().getMonth() + 1).map((m, i, arr) => {
                                    const max = Math.max(...arr.map(x => x.total), 1)
                                    const h = (m.total / max) * 100
                                    return (
                                        <div key={`exp-${m.month}-${i}`} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className="w-full rounded-t bg-white/10 hover:bg-white/20 transition-all"
                                                style={{ height: `${Math.max(h, 6)}%` }}
                                                title={`${m.month}: ${currency} ${m.total.toLocaleString()}`}
                                            />
                                            <span className="text-[7px] text-neutral-600">{m.month}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Net Profit</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">
                                    {netProfitYTD >= 0 ? "PROFIT" : "LOSS"}
                                </div>
                            </div>
                            <h3 className="text-3xl font-serif font-bold italic text-white">{currency} {Math.round(netProfitYTD).toLocaleString()}</h3>
                            <p className="text-[10px] text-neutral-500">Revenue minus expenses (YTD)</p>
                        </div>
                    </Card>

                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">VAT Liability</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">TAX</div>
                            </div>
                            <h3 className="text-3xl font-serif font-bold italic text-white">{currency} {cashFlowMetrics.vatEstimate.toLocaleString()}</h3>
                            <p className="text-[10px] text-neutral-500">Estimated VAT collected YTD</p>
                        </div>
                    </Card>

                    {/* Projected Revenue - Full Width */}
                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all md:col-span-2 lg:col-span-2">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Projected Annual Revenue</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">FORECAST</div>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <h3 className="text-4xl font-serif font-bold italic text-white">{currency} {Math.round(cashFlowMetrics.projectedRevenue).toLocaleString()}</h3>
                                <span className="text-sm text-neutral-500">based on YTD performance</span>
                            </div>
                            <div className="flex items-end gap-1 h-24 mt-4">
                                {monthlyRevenue.map((data, i) => {
                                    const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue), 1)
                                    const heightPercent = (data.revenue / maxRevenue) * 100
                                    const currentMonth = new Date().getMonth()
                                    const isFuture = i > currentMonth
                                    return (
                                        <div key={`proj-${data.month}-${i}`} className="flex-1 flex flex-col items-center gap-1">
                                            <div 
                                                className={cn("w-full rounded-t transition-all", isFuture ? "bg-white/10 border border-dashed border-white/20" : "bg-white hover:bg-white/80")}
                                                style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                                title={`${data.month}: ${currency} ${data.revenue.toLocaleString()}`}
                                            />
                                            <span className="text-[7px] text-neutral-600">{data.month}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Card>

                    {/* Top Clients */}
                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all lg:col-span-1">
                        <div className="flex flex-col gap-4 h-full">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Top Clients</span>
                                <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-medium text-white">BY REVENUE</div>
                            </div>
                            <div className="flex-1 space-y-3">
                                {cashFlowMetrics.topClients.length > 0 ? (
                                    cashFlowMetrics.topClients.map((client, i) => {
                                        const maxTotal = cashFlowMetrics.topClients[0]?.total || 1
                                        const widthPercent = (client.total / maxTotal) * 100
                                        return (
                                            <div key={`client-${i}`} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white truncate max-w-[60%]">{client.name}</span>
                                                    <span className="text-xs text-neutral-400">{currency} {client.total.toLocaleString()}</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-white rounded-full transition-all" style={{ width: `${widthPercent}%` }} />
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-neutral-600 text-xs">
                                        No client data yet
                                    </div>
                                )}
                            </div>
                            {cashFlowMetrics.topClients.length > 0 && (
                                <p className="text-[10px] text-neutral-500">{cashFlowMetrics.topClients.reduce((acc, c) => acc + c.count, 0)} invoices from top {cashFlowMetrics.topClients.length} clients</p>
                            )}
                        </div>
                    </Card>
                </div>
            )}

        </div>
    )
}
