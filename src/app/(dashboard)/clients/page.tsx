"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, MoreHorizontal, ChevronDown, Building2, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/hooks/use-cached-data"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useWorkspace } from "@/lib/workspace-context"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const customerColumns = [
    { label: "Name", id: "name" },
    { label: "Contact", id: "contact" },
    { label: "Email", id: "email" },
    { label: "Invoices", id: "invoices" },
    { label: "Projects", id: "projects" },
    { label: "Industry", id: "industry" },
    { label: "Country", id: "country" },
    { label: "Finance Email", id: "financeEmail" },
    { label: "Language", id: "language" },
    { label: "Revenue", id: "revenue" },
    { label: "Outstanding", id: "outstanding" },
    { label: "Last Invoice", id: "lastInvoice" },
    { label: "Website", id: "website" },
    { label: "Tags", id: "tags" },
]

type Customer = {
    id: string
    name: string
    email: string
    billing_email?: string
    phone?: string
    address?: string
    status: string
    industry?: string
    country: string
    created_at: string
}

export default function ClientsPage() {
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "name", "email", "status", "totalInvoiced", "lastActivity", "tags"
    ])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null)
    const [historyInvoices, setHistoryInvoices] = useState<any[]>([])
    const [isHistoryLoading, setIsHistoryLoading] = useState(false)
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    // Cached customer fetching with React Query
    const { data: customers = [], isLoading, refetch } = useQuery({
        queryKey: queryKeys.customers(activeWorkspace?.id || ""),
        queryFn: async () => {
            if (!activeWorkspace) return []
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('workspace_id', activeWorkspace.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })

    const toggleCustomerStatus = async (customer: Customer) => {
        try {
            const nextStatus = customer.status === 'active' ? 'inactive' : 'active'
            const { error } = await supabase
                .from('customers')
                .update({ status: nextStatus })
                .eq('id', customer.id)

            if (error) throw error
            refetch()
        } catch (error: any) {
            toast.error("Failed to update client", { description: error.message })
        }
    }

    const openHistory = async (customer: Customer) => {
        if (!activeWorkspace) return
        setHistoryCustomer(customer)
        setIsHistoryLoading(true)
        setHistoryInvoices([])
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('invoice_number, status, total, issue_date, due_date, paid_at')
                .eq('workspace_id', activeWorkspace.id)
                .eq('customer_id', customer.id)
                .order('issue_date', { ascending: false })
                .limit(25)

            if (error) throw error
            setHistoryInvoices(data || [])
        } catch (error: any) {
            toast.error("Failed to load history", { description: error.message })
        } finally {
            setIsHistoryLoading(false)
        }
    }

    const handleDeleteCustomer = async (customerId: string) => {
        try {
            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', customerId)

            if (error) throw error

            refetch()
            toast.success("Client deleted")
        } catch (error: any) {
            toast.error("Failed to delete client", { description: error.message })
        }
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-y-10 font-sans pb-20">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl sm:text-4xl font-serif text-foreground tracking-tight italic">Clients</h1>
                <p className="hidden sm:block text-muted-foreground mt-1">Manage your clients and the invoices you send to them.</p>
            </div>

            {/* Filter & Actions Bar */}
            <div className="md:static md:bg-transparent md:border-0 sticky top-16 z-20 bg-background/95 backdrop-blur border-y border-border py-3 -mx-4 px-4 md:py-0 md:mx-0 md:px-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 sm:max-w-md">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <Input
                            placeholder="Search or filter"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-transparent border-border focus-visible:ring-offset-0 focus-visible:ring-white/10 rounded-none transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-50 pointer-events-none">
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="hidden md:inline-flex h-11 border-border bg-transparent hover:bg-muted transition-colors rounded-none">
                                <Filter className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-background border-border rounded-none">
                            {customerColumns.map(col => (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    checked={visibleColumns.includes(col.id)}
                                    onCheckedChange={(checked) => {
                                        setVisibleColumns(prev =>
                                            checked ? [...prev, col.id] : prev.filter(c => c !== col.id)
                                        )
                                    }}
                                    className="focus:bg-muted focus:text-foreground rounded-none"
                                >
                                    {col.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/clients/new">
                        <Button className="h-11 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold rounded-none">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Client
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && customers.length === 0 && (
                <div className="border border-border bg-background p-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No clients yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start by adding your first client. You'll be able to send invoices and track payments.
                    </p>
                    <Link href="/clients/new">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Client
                        </Button>
                    </Link>
                </div>
            )}

            {/* Customers Table */}
            {!isLoading && customers.length > 0 && (
                <div className="border border-border bg-background overflow-hidden shadow-2xl">
                    {/* Mobile list */}
                    <div className="md:hidden divide-y divide-border">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-black text-muted-foreground shrink-0">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-foreground truncate">{customer.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{customer.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0",
                                        customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                                    )}>
                                        {customer.status}
                                    </span>
                                </div>

                                <div className="mt-3 text-xs text-muted-foreground">
                                    <div className="flex items-center justify-between">
                                        <span>{customer.country || 'South Africa'}</span>
                                        <span className="truncate max-w-[55%] text-right">{customer.industry || '-'}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10 flex-1 border-border bg-muted hover:bg-accent rounded-lg"
                                        onClick={() => openHistory(customer)}
                                    >
                                        History
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10 flex-1 border-border bg-muted hover:bg-accent rounded-lg"
                                        onClick={() => toggleCustomerStatus(customer)}
                                    >
                                        {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse text-left text-[13px]">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-5 py-3 w-10 border-r border-border">
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-sm border border-border flex items-center justify-center cursor-pointer hover:border-border transition-colors",
                                                selectedIds.length > 0 && selectedIds.length === filteredCustomers.length && "bg-primary text-primary-foreground"
                                            )}
                                            onClick={() => {
                                                if (selectedIds.length === filteredCustomers.length) {
                                                    setSelectedIds([])
                                                } else {
                                                    setSelectedIds(filteredCustomers.map(c => c.id))
                                                }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            {selectedIds.length > 0 && selectedIds.length === filteredCustomers.length && <Check className="h-3 w-3" />}
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Name</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Email</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Status</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Country</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Industry</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground text-center w-20">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-muted/50 transition-colors border-b border-border group last:border-0">
                                        <td className="px-5 py-4 border-r border-border">
                                            <div
                                                className={cn(
                                                    "w-4 h-4 rounded-sm border border-border transition-all flex items-center justify-center cursor-pointer group-hover:border-border",
                                                    selectedIds.includes(customer.id) && "bg-primary text-primary-foreground"
                                                )}
                                                onClick={() => {
                                                    setSelectedIds(prev => prev.includes(customer.id) ? prev.filter(id => id !== customer.id) : [...prev, customer.id])
                                                }}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                {selectedIds.includes(customer.id) && <Check className="h-3 w-3" />}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-r border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-black text-muted-foreground">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-foreground tracking-tight">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-r border-border text-muted-foreground">
                                            {customer.email}
                                        </td>
                                        <td className="px-5 py-4 border-r border-border">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                                customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                                            )}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 border-r border-border text-muted-foreground">
                                            {customer.country || 'South Africa'}
                                        </td>
                                        <td className="px-5 py-4 border-r border-border text-muted-foreground">
                                            {customer.industry || '-'}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-background border-border rounded-xl shadow-2xl p-1">
                                                    <DropdownMenuItem
                                                        className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                        onClick={() => openHistory(customer)}
                                                    >
                                                        View History
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                        onClick={() => toggleCustomerStatus(customer)}
                                                    >
                                                        {customer.status === 'active' ? 'Mark Inactive' : 'Mark Active'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-accent mx-1" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteCustomer(customer.id)}
                                                        className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Dialog open={Boolean(historyCustomer)} onOpenChange={(open) => { if (!open) setHistoryCustomer(null) }}>
                <DialogContent className="bg-card border-border max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">History — {historyCustomer?.name}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-2">
                        {isHistoryLoading ? (
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                            </div>
                        ) : historyInvoices.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No invoices found for this customer.</div>
                        ) : (
                            <div className="border border-border rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3">Invoice</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                                <th className="px-4 py-3">Issued</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {historyInvoices.map((inv: any) => (
                                                <tr key={inv.invoice_number} className="hover:bg-muted">
                                                    <td className="px-4 py-3 text-foreground">{inv.invoice_number || '-'}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{inv.status}</td>
                                                    <td className="px-4 py-3 text-right text-foreground">{Number(inv.total || 0).toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{inv.issue_date || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}


