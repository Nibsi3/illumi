"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Loader2, Users, FileText, DollarSign, Crown, ChevronDown, ChevronUp } from "lucide-react"

const ADMIN_EMAILS = [
    "cameronfalck03@gmail.com",
    "sweedienibs@gmail.com",
    "anchenfalck@gmail.com",
    "anchenhohls@gmail.com",
]

interface InvoiceStats {
    total: number
    paid: number
    pending: number
    overdue: number
    draft: number
    cancelled: number
    totalAmount: number
    paidAmount: number
    pendingAmount: number
}

interface RecentInvoice {
    invoiceNumber: string
    status: string
    total: number
    currency: string
    issueDate: string
    dueDate: string
    paidAt: string | null
    customerName: string
    customerEmail: string
}

interface UserAccount {
    workspaceId: string
    workspaceName: string
    ownerEmail: string
    ownerId: string
    tier: string
    createdAt: string
    invoiceStats: InvoiceStats
    recentInvoices: RecentInvoice[]
}

interface Summary {
    totalUsers: number
    proUsers: number
    freeUsers: number
    totalInvoices: number
    paidInvoices: number
    pendingInvoices: number
    overdueInvoices: number
    totalRevenue: number
    paidRevenue: number
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount)
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        sent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        overdue: "bg-red-500/10 text-red-500 border-red-500/20",
        draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        cancelled: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    }
    return (
        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", colors[status] || colors.draft)}>
            {status}
        </span>
    )
}

function UserRow({ user }: { user: UserAccount }) {
    const [expanded, setExpanded] = useState(false)
    const stats = user.invoiceStats

    return (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
            >
                <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{user.ownerEmail}</span>
                            {user.tier === "pro" ? (
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-violet-500/10 text-violet-400 border-violet-500/20 flex items-center gap-1">
                                    <Crown className="h-3 w-3" /> Pro
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                                    Free
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                            {user.workspaceName} &middot; Joined {new Date(user.createdAt).toLocaleDateString("en-ZA")}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                        <span><strong className="text-foreground">{stats.total}</strong> invoices</span>
                        <span className="text-emerald-500"><strong>{stats.paid}</strong> paid</span>
                        <span className="text-amber-500"><strong>{stats.pending}</strong> pending</span>
                        {stats.overdue > 0 && <span className="text-red-500"><strong>{stats.overdue}</strong> overdue</span>}
                    </div>
                    <div className="text-xs font-medium text-foreground hidden md:block">
                        {formatCurrency(stats.totalAmount)}
                    </div>
                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-border">
                    {/* Stats bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-5 bg-muted/30">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</div>
                            <div className="text-lg font-bold">{stats.total}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Paid</div>
                            <div className="text-lg font-bold text-emerald-500">{stats.paid}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Pending</div>
                            <div className="text-lg font-bold text-amber-500">{stats.pending}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-red-500">Overdue</div>
                            <div className="text-lg font-bold text-red-500">{stats.overdue}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Amount</div>
                            <div className="text-lg font-bold">{formatCurrency(stats.totalAmount)}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Paid Amount</div>
                            <div className="text-lg font-bold text-emerald-500">{formatCurrency(stats.paidAmount)}</div>
                        </div>
                    </div>

                    {/* Recent invoices table */}
                    {user.recentInvoices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <th className="text-left p-3 pl-5">Invoice #</th>
                                        <th className="text-left p-3">Status</th>
                                        <th className="text-left p-3">Customer</th>
                                        <th className="text-right p-3">Amount</th>
                                        <th className="text-left p-3">Issue Date</th>
                                        <th className="text-left p-3 pr-5">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.recentInvoices.map((inv, idx) => (
                                        <tr key={idx} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                                            <td className="p-3 pl-5 font-mono font-medium">{inv.invoiceNumber || "—"}</td>
                                            <td className="p-3"><StatusBadge status={inv.status} /></td>
                                            <td className="p-3">
                                                <div className="font-medium">{inv.customerName}</div>
                                                {inv.customerEmail && <div className="text-muted-foreground">{inv.customerEmail}</div>}
                                            </td>
                                            <td className="p-3 text-right font-medium">{formatCurrency(inv.total)}</td>
                                            <td className="p-3 text-muted-foreground">{inv.issueDate ? new Date(inv.issueDate).toLocaleDateString("en-ZA") : "—"}</td>
                                            <td className="p-3 pr-5 text-muted-foreground">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-ZA") : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-5 text-center text-sm text-muted-foreground">No invoices yet</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function AdminPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [summary, setSummary] = useState<Summary | null>(null)
    const [users, setUsers] = useState<UserAccount[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filterTier, setFilterTier] = useState<"all" | "pro" | "free">("all")
    const [sortBy, setSortBy] = useState<"recent" | "invoices" | "revenue">("recent")

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user || !ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
                router.push("/overview")
                return
            }
            setIsAuthorized(true)
        }
        checkAuth()
    }, [supabase, router])

    useEffect(() => {
        if (!isAuthorized) return
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats", { credentials: "include" })
                const json = await res.json()
                if (json.success) {
                    setSummary(json.summary)
                    setUsers(json.users || [])
                }
            } catch (err) {
                console.error("Failed to load admin stats:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [isAuthorized])

    if (!isAuthorized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const filteredUsers = users
        .filter(u => {
            if (filterTier === "pro" && u.tier !== "pro") return false
            if (filterTier === "free" && u.tier !== "free") return false
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                return (
                    u.ownerEmail.toLowerCase().includes(q) ||
                    u.workspaceName.toLowerCase().includes(q)
                )
            }
            return true
        })
        .sort((a, b) => {
            if (sortBy === "invoices") return b.invoiceStats.total - a.invoiceStats.total
            if (sortBy === "revenue") return b.invoiceStats.totalAmount - a.invoiceStats.totalAmount
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

    return (
        <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-1">Admin Dashboard</h1>
                <p className="text-muted-foreground text-sm">Platform statistics across all user accounts (excluding admin).</p>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Users className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Total Users</span>
                        </div>
                        <div className="text-3xl font-bold">{summary.totalUsers}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="text-violet-400"><strong>{summary.proUsers}</strong> pro</span>
                            <span><strong>{summary.freeUsers}</strong> free</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Total Invoices</span>
                        </div>
                        <div className="text-3xl font-bold">{summary.totalInvoices}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="text-emerald-500"><strong>{summary.paidInvoices}</strong> paid</span>
                            <span className="text-amber-500"><strong>{summary.pendingInvoices}</strong> pending</span>
                            {summary.overdueInvoices > 0 && <span className="text-red-500"><strong>{summary.overdueInvoices}</strong> overdue</span>}
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</span>
                        </div>
                        <div className="text-3xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
                        <div className="text-xs text-muted-foreground mt-2">
                            <span className="text-emerald-500"><strong>{formatCurrency(summary.paidRevenue)}</strong> collected</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Crown className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Conversion</span>
                        </div>
                        <div className="text-3xl font-bold">
                            {summary.totalUsers > 0 ? Math.round((summary.proUsers / summary.totalUsers) * 100) : 0}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Free → Pro conversion rate
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search by email or workspace..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-10 px-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground w-full sm:w-80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                    {(["all", "pro", "free"] as const).map(tier => (
                        <button
                            key={tier}
                            type="button"
                            onClick={() => setFilterTier(tier)}
                            className={cn(
                                "h-9 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border",
                                filterTier === tier
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-muted-foreground border-border hover:bg-accent"
                            )}
                        >
                            {tier}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    {([
                        { key: "recent", label: "Recent" },
                        { key: "invoices", label: "Most Invoices" },
                        { key: "revenue", label: "Highest Revenue" },
                    ] as const).map(opt => (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => setSortBy(opt.key)}
                            className={cn(
                                "h-9 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border",
                                sortBy === opt.key
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-muted-foreground border-border hover:bg-accent"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* User count */}
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </div>

            {/* User list */}
            <div className="space-y-3">
                {filteredUsers.map(user => (
                    <UserRow key={user.workspaceId} user={user} />
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        No users found matching your filters.
                    </div>
                )}
            </div>
        </div>
    )
}
