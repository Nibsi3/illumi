"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    Download,
    FileText,
    Building2,
    Calendar,
    ChevronDown,
    Loader2,
    FolderOpen,
    File,
    Image as ImageIcon,
    FileSpreadsheet,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/hooks/use-cached-data"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Customer = {
    id: string
    name: string
    email: string
}

type Invoice = {
    id: string
    invoice_number: string
    status: string
    total: number
    issue_date: string
    due_date: string
    paid_at: string | null
    customer_id: string
    customer?: Customer
}

type VaultFolder = {
    id: string
    name: string
    invoiceCount: number
    totalValue: number
    lastActivity: string
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " bytes"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " kb"
    return (bytes / (1024 * 1024)).toFixed(2) + " mb"
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

const getFileIcon = (type: string) => {
    switch (type) {
        case "pdf":
            return <FileText className="h-4 w-4 text-red-500" />
        case "image":
            return <ImageIcon className="h-4 w-4 text-blue-500" />
        case "spreadsheet":
            return <FileSpreadsheet className="h-4 w-4 text-green-500" />
        default:
            return <File className="h-4 w-4 text-muted-foreground" />
    }
}

export default function VaultPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedClient, setSelectedClient] = useState<string | null>(null)
    const [dateFilter, setDateFilter] = useState<string>("all")
    const [isExporting, setIsExporting] = useState(false)
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [exportPeriod, setExportPeriod] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    })

    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    // Fetch customers
    const { data: customers = [], isLoading: customersLoading } = useQuery({
        queryKey: queryKeys.customers(activeWorkspace?.id || ""),
        queryFn: async () => {
            if (!activeWorkspace) return []
            const { data, error } = await supabase
                .from("customers")
                .select("id, name, email")
                .eq("workspace_id", activeWorkspace.id)
                .order("name", { ascending: true })
            if (error) throw error
            return data || []
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 2 * 60 * 1000,
    })

    // Fetch invoices with customer data
    const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
        queryKey: [...queryKeys.invoices(activeWorkspace?.id || ""), "vault"],
        queryFn: async () => {
            if (!activeWorkspace) return []
            const { data, error } = await supabase
                .from("invoices")
                .select(`
                    id,
                    invoice_number,
                    status,
                    total,
                    issue_date,
                    due_date,
                    paid_at,
                    customer_id,
                    customers (id, name, email)
                `)
                .eq("workspace_id", activeWorkspace.id)
                .order("issue_date", { ascending: false })
            if (error) throw error
            return (data || []).map((inv: any) => ({
                ...inv,
                customer: inv.customers,
            }))
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 2 * 60 * 1000,
    })

    // Group invoices by client (folders)
    const folders = useMemo(() => {
        const folderMap = new Map<string, VaultFolder>()

        invoices.forEach((invoice: Invoice) => {
            const customerId = invoice.customer_id || "uncategorized"
            const customerName = invoice.customer?.name || "Uncategorized"

            if (!folderMap.has(customerId)) {
                folderMap.set(customerId, {
                    id: customerId,
                    name: customerName,
                    invoiceCount: 0,
                    totalValue: 0,
                    lastActivity: invoice.issue_date,
                })
            }

            const folder = folderMap.get(customerId)!
            folder.invoiceCount++
            folder.totalValue += invoice.total || 0
            if (new Date(invoice.issue_date) > new Date(folder.lastActivity)) {
                folder.lastActivity = invoice.issue_date
            }
        })

        return Array.from(folderMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    }, [invoices])

    // Filter invoices based on search, client, and date
    const filteredInvoices = useMemo(() => {
        let result = invoices

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (inv: Invoice) =>
                    inv.invoice_number?.toLowerCase().includes(query) ||
                    inv.customer?.name?.toLowerCase().includes(query)
            )
        }

        if (selectedClient) {
            result = result.filter((inv: Invoice) => inv.customer_id === selectedClient)
        }

        if (dateFilter !== "all") {
            const now = new Date()
            let startDate: Date

            switch (dateFilter) {
                case "7days":
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    break
                case "30days":
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    break
                case "90days":
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                    break
                case "year":
                    startDate = new Date(now.getFullYear(), 0, 1)
                    break
                default:
                    startDate = new Date(0)
            }

            result = result.filter((inv: Invoice) => new Date(inv.issue_date) >= startDate)
        }

        return result
    }, [invoices, searchQuery, selectedClient, dateFilter])

    // Export functionality
    const handleExport = async () => {
        if (!activeWorkspace) return

        setIsExporting(true)
        try {
            let query = supabase
                .from("invoices")
                .select(`
                    invoice_number,
                    status,
                    total,
                    issue_date,
                    due_date,
                    paid_at,
                    customers (name, email)
                `)
                .eq("workspace_id", activeWorkspace.id)

            if (exportPeriod.start) {
                query = query.gte("issue_date", exportPeriod.start)
            }
            if (exportPeriod.end) {
                query = query.lte("issue_date", exportPeriod.end)
            }

            const { data, error } = await query.order("issue_date", { ascending: false })

            if (error) throw error

            // Generate CSV
            const headers = ["Invoice Number", "Client", "Status", "Total (ZAR)", "Issue Date", "Due Date", "Paid Date"]
            const rows = (data || []).map((inv: any) => [
                inv.invoice_number,
                inv.customers?.name || "N/A",
                inv.status,
                inv.total,
                inv.issue_date,
                inv.due_date || "",
                inv.paid_at || "",
            ])

            const csvContent = [
                headers.join(","),
                ...rows.map((row: any[]) => row.map((cell) => `"${cell}"`).join(",")),
            ].join("\n")

            // Download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = `illumi-invoices-export-${new Date().toISOString().split("T")[0]}.csv`
            link.click()

            toast.success("Export complete", { description: `${data?.length || 0} invoices exported` })
            setExportDialogOpen(false)
        } catch (error: any) {
            toast.error("Export failed", { description: error.message })
        } finally {
            setIsExporting(false)
        }
    }

    const isLoading = customersLoading || invoicesLoading

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col gap-4 p-6 border-b border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Vault</h1>
                        <p className="text-sm text-muted-foreground">
                            Store and organise invoices per client
                        </p>
                    </div>
                    <Button onClick={() => setExportDialogOpen(true)} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Client Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Building2 className="h-4 w-4" />
                                {selectedClient
                                    ? customers.find((c: Customer) => c.id === selectedClient)?.name || "Client"
                                    : "All Clients"}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem onClick={() => setSelectedClient(null)}>
                                All Clients
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {customers.map((customer: Customer) => (
                                <DropdownMenuItem
                                    key={customer.id}
                                    onClick={() => setSelectedClient(customer.id)}
                                >
                                    {customer.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Date Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                {dateFilter === "all"
                                    ? "All Time"
                                    : dateFilter === "7days"
                                    ? "Last 7 Days"
                                    : dateFilter === "30days"
                                    ? "Last 30 Days"
                                    : dateFilter === "90days"
                                    ? "Last 90 Days"
                                    : "This Year"}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === "all"}
                                onCheckedChange={() => setDateFilter("all")}
                            >
                                All Time
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === "7days"}
                                onCheckedChange={() => setDateFilter("7days")}
                            >
                                Last 7 Days
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === "30days"}
                                onCheckedChange={() => setDateFilter("30days")}
                            >
                                Last 30 Days
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === "90days"}
                                onCheckedChange={() => setDateFilter("90days")}
                            >
                                Last 90 Days
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === "year"}
                                onCheckedChange={() => setDateFilter("year")}
                            >
                                This Year
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : selectedClient ? (
                    /* Invoice List View (when client is selected) */
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedClient(null)}
                                className="gap-2"
                            >
                                ← Back to folders
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <span className="font-medium">
                                {customers.find((c: Customer) => c.id === selectedClient)?.name}
                            </span>
                            <span className="text-muted-foreground">
                                ({filteredInvoices.length} invoices)
                            </span>
                        </div>

                        <div className="grid gap-3">
                            {filteredInvoices.map((invoice: Invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="shrink-0">
                                        <FileText className="h-8 w-8 text-red-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">
                                            Invoice {invoice.invoice_number}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(invoice.issue_date)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">{formatCurrency(invoice.total)}</div>
                                        <div
                                            className={cn(
                                                "text-xs px-2 py-0.5 rounded-full inline-block",
                                                invoice.status === "paid"
                                                    ? "bg-green-500/10 text-green-600"
                                                    : invoice.status === "overdue"
                                                    ? "bg-red-500/10 text-red-600"
                                                    : "bg-yellow-500/10 text-yellow-600"
                                            )}
                                        >
                                            {invoice.status}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatFileSize(89170)}
                                    </div>
                                </div>
                            ))}

                            {filteredInvoices.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    No invoices found for this client
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Folder View (client folders) */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {folders.map((folder) => (
                            <button
                                key={folder.id}
                                onClick={() => setSelectedClient(folder.id)}
                                className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FolderOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{folder.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {folder.invoiceCount} invoice{folder.invoiceCount !== 1 ? "s" : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Total</span>
                                    <span className="font-medium">{formatCurrency(folder.totalValue)}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Last activity: {formatDate(folder.lastActivity)}
                                </div>
                            </button>
                        ))}

                        {folders.length === 0 && (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No invoices yet</p>
                                <p className="text-sm">Create your first invoice to see it here</p>
                                <p className="text-sm mt-3">
                                    <Link href="/features/invoicing" className="text-primary hover:underline" target="_blank">Learn how invoicing works →</Link>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Export Dialog */}
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Export Invoices</DialogTitle>
                        <DialogDescription>
                            Take the hassle out of tax season. Select your invoicing period and hit export
                            to generate professional reports for your accountant.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Date</label>
                                <Input
                                    type="date"
                                    value={exportPeriod.start}
                                    onChange={(e) =>
                                        setExportPeriod((prev) => ({ ...prev, start: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Date</label>
                                <Input
                                    type="date"
                                    value={exportPeriod.end}
                                    onChange={(e) =>
                                        setExportPeriod((prev) => ({ ...prev, end: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Leave dates empty to export all invoices
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleExport} disabled={isExporting} className="gap-2">
                            {isExporting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Export CSV
                                </>
                            )}
                        </Button>
                    </div>

                    {isExporting && (
                        <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground text-center">
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            Exporting transactions — Please do not close browser until completed
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
