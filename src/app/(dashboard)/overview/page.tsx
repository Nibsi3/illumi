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
    IconPlus,
    IconSparkles,
    IconChevronDown,
    IconX,
    IconSend,
    IconMessage2
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
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
    const router = useRouter();
    const [view, setView] = useState<"overview" | "metrics">("overview");
    const [period, setPeriod] = useState("1 year");
    const [query, setQuery] = useState("");
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

    // Real metrics state
    const [metrics, setMetrics] = useState({
        revenue: 0,
        customers: 0,
        products: 0,
        pendingInvoices: 0,
        recurring: 0,
        growth: 12.5 // Placeholder until historical data is available
    })

    const supabase = createClient()

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // Fetch Invoices
                const { data: invoices } = await supabase
                    .from('invoices')
                    .select('amount, status')
                    .eq('user_id', user.id)

                const totalRevenue = invoices
                    ?.filter(i => i.status === 'paid' || i.status === 'Paid')
                    .reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

                const pendingCount = invoices
                    ?.filter(i => i.status === 'pending' || i.status === 'Pending' || i.status === 'draft' || i.status === 'Draft')
                    .length || 0

                // Fetch Customers Count
                const { count: customerCount } = await supabase
                    .from('customers')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                // Fetch Products
                const { data: products } = await supabase
                    .from('products')
                    .select('price, billing_type')
                    .eq('user_id', user.id)

                const productCount = products?.length || 0
                const recurring = products
                    ?.filter(p => p.billing_type === 'recurring')
                    .reduce((acc, curr) => acc + (curr.price || 0), 0) || 0

                setMetrics({
                    revenue: totalRevenue,
                    customers: customerCount || 0,
                    products: productCount,
                    pendingInvoices: pendingCount,
                    recurring: recurring,
                    growth: 12.5 // Static for now
                })
            } catch (error) {
                console.error("Error fetching metrics:", error)
            }
        }
        fetchMetrics()
    }, [supabase])

    const handleChatSubmit = async (e?: React.FormEvent, customQuery?: string) => {
        if (e) e.preventDefault();
        const activeQuery = customQuery || query;
        if (!activeQuery.trim() || isLoadingChat) return;

        setIsLoadingChat(true);
        if (!isChatOpen) setIsChatOpen(true);

        const userMessage = { role: "user", content: activeQuery };
        setMessages(prev => [...prev, userMessage]);
        setQuery("");

        try {
            const response = await fetch("/api/assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                })
            });

            if (!response.ok) throw new Error("Failed to call assistant");

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            toast.error("Assistant Error", {
                description: "Failed to process your request."
            });
        } finally {
            setIsLoadingChat(false);
        }
    }

    return (
        <div className="flex flex-col gap-y-6 animate-in fade-in duration-700 min-h-full font-serif -mt-6">
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
                /* Compact Overview Grid - Full Width */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {/* Grid items use #0c0c0c */}
                    <Link href="/invoices" className="block transform transition-transform hover:scale-[1.02]">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors group h-[220px] shadow-2xl">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconReceipt className="h-4 w-4" />
                                    Invoices
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-muted-foreground">Net revenue - {period}</div>
                                    <div className="text-3xl font-serif font-bold tracking-tight italic">ZAR {metrics.revenue.toLocaleString()}</div>
                                    <div className="text-[9px] uppercase font-bold text-emerald-500/80 mt-1 flex items-center gap-1.5">
                                        <IconTrendingUp className="h-3 w-3" />
                                        +{metrics.growth}% vs last year
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/clients" className="block transform transition-transform hover:scale-[1.02]">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors group h-[220px] shadow-2xl">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconUsers className="h-4 w-4" />
                                    Customers
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-muted-foreground">Total active customers</div>
                                    <div className="text-3xl font-serif font-bold tracking-tight italic">{metrics.customers}</div>
                                    <div className="text-[10px] text-neutral-500 font-medium">Keep growing!</div>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/recurring" className="block transform transition-transform hover:scale-[1.02]">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors group h-[220px] shadow-2xl">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconClock className="h-4 w-4" />
                                    Recurring
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-muted-foreground">Monthly Recurring Revenue</div>
                                    <div className="text-3xl font-serif font-bold tracking-tight italic">ZAR {metrics.recurring.toLocaleString()}</div>
                                    <div className="text-[10px] text-neutral-500 font-medium tracking-tight">Based on active subscriptions</div>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/inbox" className="block transform transition-transform hover:scale-[1.02]">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors group h-[220px] shadow-2xl">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconWallet className="h-4 w-4" />
                                    Pending
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-muted-foreground">Pending / Draft Invoices</div>
                                    <div className="text-3xl font-serif font-bold tracking-tight italic">{metrics.pendingInvoices}</div>
                                    {metrics.pendingInvoices > 0 && <StatusDot variant="warning" className="mt-1">Requires action</StatusDot>}
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/products" className="block transform transition-transform hover:scale-[1.02]">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors group h-[220px] shadow-2xl">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconLayoutGrid className="h-4 w-4" />
                                    Products
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-muted-foreground">Managed services & items</div>
                                    <div className="text-3xl font-serif font-bold tracking-tight italic">{metrics.products}</div>
                                    <div className="text-[10px] text-neutral-500 font-medium">Available for invoicing</div>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/overview" onClick={(e) => { e.preventDefault(); setView("metrics"); }} className="block transform transition-transform hover:scale-[1.02]">
                        <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.01] transition-colors group h-[220px] shadow-2xl">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconTrendingUp className="h-4 w-4" />
                                    Revenue Summaries
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-muted-foreground">Estimated gross - {period}</div>
                                    <div className="text-3xl font-serif font-bold tracking-tight italic">ZAR {metrics.revenue.toLocaleString()}</div>
                                    <div className="text-[9px] uppercase font-bold text-muted-foreground/30">Tax: ZAR {(metrics.revenue * 0.15).toLocaleString()}</div>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.01] transition-colors group h-[220px] shadow-2xl col-span-1 md:col-span-2">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <IconFileAnalytics className="h-4 w-4" />
                                    Account Performance
                                </div>
                                <div className="text-[9px] text-white/20">Updated just now</div>
                            </div>
                            <div className="flex items-end gap-x-2 h-32 pt-4">
                                {[40, 70, 45, 90, 65, 80, 50, 60, 100, 85].map((h, i) => (
                                    <div key={i} className="flex-1 bg-white/5 hover:bg-white/20 transition-all rounded-sm cursor-pointer" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                /* Metrics View - Full Width */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 w-full">
                    {[
                        "Net Revenue", "Monthly Burn Rate", "Monthly Expenses",
                        "Profit & Loss", "Revenue Forecast", "Runway", "Expense Breakdown"
                    ].map((title) => (
                        <Card key={title} className="bg-[#0c0c0c] border border-white/5 rounded-none p-8 min-h-[350px]">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{title === "Runway" ? "Runway" : "Revenue"}</span>
                                    <h3 className="text-3xl font-serif font-bold italic">ZAR {title === "Net Revenue" ? metrics.revenue.toLocaleString() : "0"}</h3>
                                    {title === "Net Revenue" && (
                                        <div className="flex gap-4 mt-2">
                                            <div className="flex items-center gap-2"><div className="h-1 w-1 bg-white rounded-full" /><span className="text-[10px] text-muted-foreground">This Year</span></div>
                                            <div className="flex items-center gap-2"><div className="h-1 w-1 bg-white/20 rounded-full" /><span className="text-[10px] text-muted-foreground">Last Year</span></div>
                                            <div className="flex items-center gap-2"><div className="h-1 w-1 bg-primary rounded-full" /><span className="text-[10px] text-muted-foreground">Average</span></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-h-[200px] flex items-end justify-between border-b border-white/5 pb-2">
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"].map((m, i) => (
                                        <div key={`${m}-${i}`} className="flex flex-col items-center gap-2">
                                            <div className="w-[1px] h-32 border-l border-dashed border-white/5" />
                                            <span className="text-[8px] text-muted-foreground">{m}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* AI Assistant Chat Input - Fixed at Bottom (Pic 3) */}
            <div className="fixed bottom-12 left-[calc(50%+36px)] -translate-x-1/2 w-full max-w-5xl px-6 z-40">
                <div
                    onClick={() => setIsChatOpen(true)}
                    className="sticky bottom-0 -mx-4 md:-mx-10 -mb-6 md:-mb-10 bg-[#080808]/95 backdrop-blur-3xl border-t border-white/10 p-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,1)] flex items-center gap-4 group hover:border-white/20 focus-within:border-white/20 focus-within:translate-y-[-4px] transition-all min-h-[80px] cursor-text z-40 mt-auto"
                >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 ml-4">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin invisible group-hover:visible" />
                        <IconMessage2 className="h-5 w-5 text-white absolute group-hover:invisible" />
                    </div>
                    <div className="flex-1 text-sm text-white/20 font-sans tracking-tight">
                        Ask anything...
                    </div>
                    <div className="flex items-center gap-2 pr-2 mr-4">
                        <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-white hover:bg-white/5 rounded-none">
                            <IconPlus className="h-5 w-5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-white hover:bg-white/5 rounded-none">
                            <IconFileAnalytics className="h-5 w-5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-10 w-10 bg-white text-black hover:bg-neutral-200 rounded-none transition-all ml-2">
                            <IconArrowUpRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Full-Page AI Chat Overlay */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center"
                    >
                        {/* Header */}
                        <div className="w-full max-w-5xl flex items-center justify-between p-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                    <IconSparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-serif italic text-white">Illumi Assistant</h2>
                                    <p className="text-xs text-white/40 font-sans">Powered by advanced AI for your business</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsChatOpen(false)}
                                className="h-12 w-12 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                            >
                                <IconX className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 w-full max-w-3xl overflow-y-auto no-scrollbar px-6 py-12 space-y-8">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                                        <IconSparkles className="h-10 w-10 text-white/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-serif italic text-white/80">How can I help you today?</h3>
                                        <p className="text-white/40 max-w-md mx-auto">Ask about invoices, customers, financial analysis, or anything else in your business.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-8">
                                        {[
                                            "What's my revenue this month?",
                                            "Show me unpaid invoices",
                                            "Who are my top customers?",
                                            "Connect my Stripe account"
                                        ].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => handleChatSubmit(undefined, suggestion)}
                                                className="p-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-xs text-white/60 hover:text-white transition-all text-left"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex flex-col max-w-[80%] space-y-2",
                                            m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-6 rounded-3xl text-sm leading-relaxed",
                                            m.role === 'user'
                                                ? "bg-white text-black font-medium rounded-tr-none"
                                                : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                                        )}>
                                            {m.content}
                                        </div>
                                        <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                                            {m.role === 'user' ? 'You' : 'Assistant'}
                                        </span>
                                    </motion.div>
                                ))
                            )}
                            {isLoadingChat && (
                                <div className="flex flex-col items-start space-y-2 mr-auto">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-white/40 rounded-tl-none animate-pulse">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Overlay Input Area */}
                        <div className="w-full max-w-4xl p-8 pb-12">
                            <form onSubmit={handleChatSubmit} className="bg-white/5 border border-white/10 p-2 pr-4 focus-within:border-white/20 transition-all rounded-2xl flex items-center gap-4">
                                <div className="p-4 text-white/20">
                                    <IconSparkles className="h-6 w-6" />
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Type your message..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    disabled={isLoadingChat}
                                    className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-white/10 disabled:opacity-50 font-sans py-4"
                                />
                                <Button type="submit" disabled={isLoadingChat || !query.trim()} className="h-12 w-12 bg-white text-black hover:bg-neutral-200 rounded-xl transition-all shadow-2xl">
                                    <IconSend className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
