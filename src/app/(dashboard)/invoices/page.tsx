"use client"

import { StatusDot } from "@/components/status-dot"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, MoreHorizontal, ChevronDown, Check, Download, X, FolderOpen, Folder, ChevronRight } from "lucide-react"
import { IconFolder } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
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
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useWorkspace } from "@/lib/workspace-context"
import { useSettings } from "@/lib/settings-context"
import { useSubscription } from "@/lib/subscription/hooks"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/hooks/use-cached-data"

// Kept for type reference only, not using mock data

const ITEMS_PER_PAGE = 20

const columnsList = [
    { label: "Invoice no.", id: "id", sortable: true },
    { label: "Status", id: "status", sortable: true, sortOptions: ["Paid", "Overdue"] },
    { label: "Due date", id: "dueDate", sortable: true, sortOptions: ["closest", "furthest"] },
    { label: "Customer", id: "customer", sortable: true, sortOptions: ["A-Z", "Z-A"] },
    { label: "Amount", id: "amount", sortable: true, sortOptions: ["highest", "lowest"] },
    { label: "Issue date", id: "issueDate", sortable: true, sortOptions: ["closest", "furthest"] },
]

export default function InvoicesPage() {
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()
    const { currency, activePaymentProvider, fromEmail, companyName, companyWebsite, sendInvoiceCopyToSelf, hideIllumiBranding } = useSettings()
    const { isPro } = useSubscription()

    const moneyFormatter = useMemo(() => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || 'ZAR' })
    }, [currency])

    const { data: customers = [] } = useQuery({
        queryKey: queryKeys.customers(activeWorkspace?.id || ""),
        queryFn: async () => {
            if (!activeWorkspace?.id) return []
            const { data, error } = await supabase
                .from('customers')
                .select('id, name, email')
                .eq('workspace_id', activeWorkspace.id)

            if (error) throw error
            return data || []
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 5 * 60 * 1000,
    })

    const customerMap = useMemo(() => {
        const map = new Map<string, { name?: string | null, email?: string | null }>()
        for (const c of customers as any[]) {
            if (c?.id) map.set(c.id, { name: c.name, email: c.email })
        }
        return map
    }, [customers])

    // Filtering state (customerId-based so we can paginate server-side)
    const [filterCustomerId, setFilterCustomerId] = useState<string | null>(null)

    // State needed for UI (used by the server-side query key)
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [filterInvoiceType, setFilterInvoiceType] = useState<'all' | 'invoices' | 'recurring' | 'scheduled'>('all')

    // Sorting state (used by the server-side query key)
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<string | null>(null)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)

    // Cached invoice fetching with React Query (server-side pagination)
    const {
        data: invoicePageData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [
            ...queryKeys.invoices(activeWorkspace?.id || ""),
            currency,
            currentPage,
            filterCustomerId || "all",
            filterStatus || "all",
            filterInvoiceType,
            sortColumn || "default",
            sortDirection || "default",
        ],
        queryFn: async () => {
            if (!activeWorkspace?.id) return { rows: [], totalCount: 0 }

            const from = (currentPage - 1) * ITEMS_PER_PAGE
            const to = from + ITEMS_PER_PAGE - 1

            let dataQuery = supabase
                .from('invoices')
                .select('id, invoice_number, status, total, currency, due_date, issue_date, created_at, scheduled_date, is_recurring, parent_invoice_id, recurring_interval, customer_id, workspace_id, from_email, send_copy_to_self', { count: 'exact', head: false })
                .eq('workspace_id', activeWorkspace.id)

            if (filterCustomerId) {
                dataQuery = dataQuery.eq('customer_id', filterCustomerId)
            }

            // Apply status filters server-side so pagination/counts match.
            // Note: "overdue" is derived from due_date + status.
            if (filterStatus === 'unpaid') {
                dataQuery = dataQuery.in('status', ['sent', 'viewed', 'draft', 'scheduled'])
            } else if (filterStatus === 'overdue') {
                const today = new Date()
                const y = today.getFullYear()
                const m = String(today.getMonth() + 1).padStart(2, '0')
                const d = String(today.getDate()).padStart(2, '0')
                const todayStr = `${y}-${m}-${d}`
                dataQuery = dataQuery
                    .lt('due_date', todayStr)
                    .neq('status', 'paid')
                    .neq('status', 'scheduled')
            } else if (filterStatus) {
                dataQuery = dataQuery.eq('status', filterStatus.toLowerCase())
            }

            // Apply invoice type filters server-side so pagination/counts match.
            if (filterInvoiceType === 'scheduled') {
                // Some environments/legacy rows may persist scheduled_date while status changes.
                // For the Scheduled tab, treat "has scheduled_date" as the source of truth,
                // but exclude already-sent/paid invoices.
                dataQuery = dataQuery
                    .or('status.eq.scheduled,scheduled_date.not.is.null')
                    .neq('status', 'sent')
                    .neq('status', 'paid')
            } else if (filterInvoiceType === 'recurring') {
                dataQuery = dataQuery
                    .eq('is_recurring', true)
                    .is('parent_invoice_id', null)
            } else if (filterInvoiceType === 'invoices') {
                dataQuery = dataQuery
                    .neq('status', 'scheduled')
                    .is('scheduled_date', null)
                    .is('parent_invoice_id', null)
                    .is('recurring_interval', null)
                    .or('is_recurring.is.false,is_recurring.is.null')
            }

            // Apply basic sorting server-side.
            // Some UI sorts (like Paid/Overdue priority) are client-only; we keep server sorting simple.
            let orderColumn: string = 'created_at'
            let ascending = false
            let secondaryOrderColumn: string | null = null
            let secondaryAscending = false
            let nullsFirst: boolean | undefined = undefined

            // Default ordering per tab (when no explicit sort is selected)
            if (!sortColumn || !sortDirection) {
                if (filterInvoiceType === 'scheduled') {
                    orderColumn = 'scheduled_date'
                    ascending = true
                    nullsFirst = false
                    secondaryOrderColumn = 'created_at'
                    secondaryAscending = false
                } else if (filterInvoiceType === 'recurring') {
                    orderColumn = 'issue_date'
                    ascending = false
                    nullsFirst = false
                    secondaryOrderColumn = 'created_at'
                    secondaryAscending = false
                } else {
                    orderColumn = 'created_at'
                    ascending = false
                }
            } else {
                if (sortColumn === 'id') {
                    orderColumn = 'invoice_number'
                    ascending = sortDirection === 'asc'
                } else if (sortColumn === 'amount') {
                    orderColumn = 'total'
                    ascending = sortDirection === 'lowest'
                } else if (sortColumn === 'dueDate') {
                    orderColumn = 'due_date'
                    ascending = sortDirection === 'closest'
                    nullsFirst = false
                } else if (sortColumn === 'issueDate') {
                    orderColumn = 'issue_date'
                    ascending = sortDirection === 'closest'
                    nullsFirst = false
                } else if (sortColumn === 'status') {
                    orderColumn = 'status'
                    ascending = true
                }
            }

            // Apply ordering. Add a stable secondary ordering when helpful.
            let orderedQuery = dataQuery.order(orderColumn, { ascending, nullsFirst })
            if (secondaryOrderColumn) {
                orderedQuery = orderedQuery.order(secondaryOrderColumn, { ascending: secondaryAscending })
            }

            const res = await orderedQuery.range(from, to)

            if (res.error) throw res.error

            return {
                rows: res.data || [],
                totalCount: res.count || 0,
            }
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 2 * 60 * 1000,
        placeholderData: (prev) => prev,
    })

    const rawInvoices = (invoicePageData?.rows || []) as any[]
    const totalInvoiceCount = invoicePageData?.totalCount || 0

    // Transform raw data for display
    const invoices = useMemo(() => {
        return rawInvoices.map((inv: any) => {
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            const rawStatus = (inv.status || '').toLowerCase()
            const dueDate = inv.due_date ? new Date(inv.due_date + "T00:00:00") : null
            // Consider an invoice overdue only starting the day AFTER the due_date.
            const dueDateEnd = dueDate ? new Date(dueDate) : null
            if (dueDateEnd) dueDateEnd.setHours(23, 59, 59, 999)
            const isOverdue = rawStatus !== 'paid' && rawStatus !== 'scheduled' && dueDateEnd && dueDateEnd < new Date()

            return {
                ...inv,
                raw_status: rawStatus,
                displayId: inv.invoice_number,
                customer: customerMap.get(inv.customer_id)?.name || 'Unknown',
                customer_email: inv.customer_email || customerMap.get(inv.customer_id)?.email,
                amount: moneyFormatter.format(inv.total),
                dueDate: inv.due_date,
                issueDate: inv.issue_date,
                status: isOverdue ? 'Overdue' : rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : ''
            }
        })
    }, [rawInvoices, customerMap, moneyFormatter])

    // State needed for UI (restored)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Mark as Paid dialog state
    const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false)
    const [markPaidInvoice, setMarkPaidInvoice] = useState<any>(null)
    const [markPaidDate, setMarkPaidDate] = useState<Date>(new Date())
    const [markPaidAmount, setMarkPaidAmount] = useState<string>("")
    const [expandedFolders, setExpandedFolders] = useState<string[]>([])
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "id", "status", "dueDate", "customer", "amount", "issueDate"
    ])

    // Compute unique clients with invoice counts
    const clientFolders = useMemo(() => {
        return (customers as any[])
            .map((c) => ({
                id: c.id,
                name: c.name || 'Unknown',
                count: undefined as number | undefined,
            }))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }, [customers])

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === invoices.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(invoices.map((i: any) => i.id))
        }
    }

    // Delete invoice function
    const handleDeleteInvoice = async (invoiceId: string) => {
        try {
            const { error } = await supabase
                .from('invoices')
                .delete()
                .eq('id', invoiceId)

            if (error) throw error

            toast.success("Invoice deleted")

            // Refresh the cached list
            refetch()
            setSelectedIds(prev => prev.filter(id => id !== invoiceId))
        } catch (error: any) {
            console.error('Delete failed:', error)
            toast.error("Failed to delete invoice", {
                description: error.message
            })
        }
    }

    // Open Mark as Paid dialog
    const openMarkPaidDialog = (invoice: any) => {
        setMarkPaidInvoice(invoice)
        setMarkPaidDate(new Date())
        // Extract numeric amount from formatted string or use raw total
        const rawAmount = invoice.total || parseFloat(invoice.amount?.replace(/[^0-9.-]+/g, "")) || 0
        setMarkPaidAmount(rawAmount.toString())
        setMarkPaidDialogOpen(true)
    }

    // Mark as paid function with date and amount
    const handleMarkAsPaid = async () => {
        if (!markPaidInvoice) return
        try {
            const paidAmount = parseFloat(markPaidAmount)
            if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
                toast.error("Please enter a valid amount")
                return
            }

            const { error } = await supabase
                .from('invoices')
                .update({
                    status: 'paid',
                    paid_at: markPaidDate.toISOString(),
                    paid_amount: paidAmount
                })
                .eq('id', markPaidInvoice.id)

            if (error) throw error

            toast.success("Invoice marked as paid", {
                description: `Paid on ${format(markPaidDate, 'dd/MM/yyyy')}`
            })

            // Refresh the cached list
            refetch()
            setMarkPaidDialogOpen(false)
            setMarkPaidInvoice(null)
        } catch (error: any) {
            console.error('Update failed:', error)
            toast.error("Failed to update status")
        }
    }

    const handleCopyLink = (invoiceNumber: string) => {
        const url = `${window.location.origin}/pay/${invoiceNumber}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
    }

    const handleEmailShare = async (invoice: any) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const { data: invoiceWithItems, error: invoiceFetchError } = await supabase
                .from('invoices')
                .select('invoice_items(description, quantity, unit_price)')
                .eq('id', invoice.id)
                .maybeSingle()

            if (invoiceFetchError) throw invoiceFetchError

            const paymentLink = `${window.location.origin}/pay/${invoice.displayId}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`

            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'invoice',
                    to: invoice.customer_email || 'customer@example.com',
                    bcc: sendInvoiceCopyToSelf ? ((invoice.from_email as string) || fromEmail || undefined) : undefined,
                    companyName: companyName,
                    supportEmail: ((invoice.from_email as string) || fromEmail || undefined),
                    companyWebsite: companyWebsite,
                    allowCustomBranding: Boolean(isPro),
                    hideIllumiBranding: Boolean(isPro && (invoice.hide_illumi_branding ?? hideIllumiBranding)),
                    customerName: invoice.customer,
                    invoiceNumber: invoice.displayId,
                    amount: invoice.amount,
                    currency: invoice.currency || 'ZAR',
                    dueDate: invoice.dueDate,
                    paymentLink,
                    items: (invoiceWithItems?.invoice_items || []).map((it: any) => ({
                        description: it.description,
                        quantity: it.quantity,
                        unit_price: it.unit_price,
                    })),
                })
            })

            const data = await response.json()
            if (data.success) {
                toast.success("Email sent successfully")
                if (data.copy) {
                    const requested = Array.isArray(data.copy.requested)
                        ? data.copy.requested.join(', ')
                        : ''
                    const attempted = Array.isArray(data.copy.attempted)
                        ? data.copy.attempted.join(', ')
                        : ''

                    if (data.copy.sent === false) {
                        toast.warning("Email sent, but copy failed", {
                            description: `${data.copy.error || 'Copy could not be delivered'}${attempted ? ` (attempted: ${attempted})` : requested ? ` (requested: ${requested})` : ''}`,
                        })
                    } else {
                        toast.success("Copy sent", {
                            description: attempted || requested || "Copy delivered",
                        })
                    }
                }
            } else {
                throw new Error(data.error || "Failed to send email")
            }
        } catch (err: any) {
            console.error("Email share error:", err)
            toast.error("Failed to send email", { description: err.message })
        }
    }

    const toggleFolder = (clientName: string) => {
        setExpandedFolders(prev =>
            prev.includes(clientName)
                ? prev.filter(f => f !== clientName)
                : [...prev, clientName]
        )
    }

    // Duplicate invoice function
    const handleDuplicateInvoice = async (invoiceId: string) => {
        try {
            // Fetch the original invoice with items
            const { data: original, error: fetchError } = await supabase
                .from('invoices')
                .select('user_id, workspace_id, customer_id, due_date, currency, subtotal, tax_rate, tax_amount, total, notes, template, invoice_mode, logo_url, payment_provider, invoice_items(description, quantity, unit_price, total, sort_order)')
                .eq('id', invoiceId)
                .single()

            if (fetchError || !original) throw fetchError || new Error("Invoice not found")

            // Generate new invoice number
            const timestamp = Date.now().toString().slice(-6)
            const newInvoiceNumber = `INV-${timestamp}`

            // Create new invoice (copy all fields except id, created_at, updated_at, status)
            const { data: newInvoice, error: insertError } = await supabase
                .from('invoices')
                .insert({
                    user_id: original.user_id,
                    workspace_id: original.workspace_id,
                    customer_id: original.customer_id,
                    invoice_number: newInvoiceNumber,
                    status: 'draft',
                    issue_date: new Date().toISOString().split('T')[0],
                    due_date: original.due_date,
                    currency: original.currency,
                    subtotal: original.subtotal,
                    tax_rate: original.tax_rate,
                    tax_amount: original.tax_amount,
                    total: original.total,
                    notes: original.notes,
                    template: original.template,
                    invoice_mode: original.invoice_mode,
                    logo_url: original.logo_url,
                    payment_provider: original.payment_provider,
                })
                .select('id')
                .single()

            if (insertError || !newInvoice) throw insertError || new Error("Failed to create invoice")

            // Copy invoice items
            if (original.invoice_items && original.invoice_items.length > 0) {
                const itemsToInsert = original.invoice_items.map((item: any) => ({
                    invoice_id: newInvoice.id,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total: item.total,
                    sort_order: item.sort_order,
                }))

                const { error: itemsError } = await supabase
                    .from('invoice_items')
                    .insert(itemsToInsert)

                if (itemsError) throw itemsError
            }

            toast.success("Invoice duplicated", {
                description: `Created new draft invoice ${newInvoiceNumber}`
            })

            // Refresh the cached list
            refetch()
        } catch (error: any) {
            console.error('Duplicate failed:', error)
            toast.error("Failed to duplicate invoice", {
                description: error.message
            })
        }
    }

    // Handle column header click for sorting
    const handleColumnSort = (columnId: string) => {
        const column = columnsList.find(c => c.id === columnId)
        if (!column?.sortable) return

        if (sortColumn === columnId) {
            // Cycle through sort options or toggle direction
            if (column.sortOptions && column.sortOptions.length > 0) {
                const currentIndex = column.sortOptions.indexOf(sortDirection || '')
                const nextIndex = (currentIndex + 1) % (column.sortOptions.length + 1)
                if (nextIndex === column.sortOptions.length) {
                    setSortColumn(null)
                    setSortDirection(null)
                } else {
                    setSortDirection(column.sortOptions[nextIndex])
                }
            } else {
                // For invoice number, just toggle asc/desc
                if (sortDirection === 'asc') {
                    setSortDirection('desc')
                } else if (sortDirection === 'desc') {
                    setSortColumn(null)
                    setSortDirection(null)
                } else {
                    setSortDirection('asc')
                }
            }
        } else {
            setSortColumn(columnId)
            if (column.sortOptions && column.sortOptions.length > 0) {
                setSortDirection(column.sortOptions[0])
            } else {
                setSortDirection('asc')
            }
        }
    }

    // With server-side pagination, filters and basic sorting are applied in the Supabase query.
    // Do not apply a second client-side filter/sort pass, otherwise pages can appear empty and
    // page sizes become inconsistent.
    const filteredInvoices = invoices
    const sortedInvoices = invoices

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(totalInvoiceCount / ITEMS_PER_PAGE))
    const paginatedInvoices = sortedInvoices

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [filterStatus, filterCustomerId, filterInvoiceType, sortColumn, sortDirection])

    // Group invoices by company for the folder view
    const invoicesByCompany = sortedInvoices.reduce((acc: any, inv: any) => {
        const company = inv.customer || 'Unknown'
        if (!acc[company]) acc[company] = []
        acc[company].push(inv)
        return acc
    }, {})

    return (
        <>
        <div className="flex flex-col md:flex-row gap-6 pb-24 md:pb-32">
            {/* Mobile client folders scroller */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-foreground tracking-tight">Clients</h2>
                    <span className="text-xs text-muted-foreground">{clientFolders.length} folders</span>
                </div>
                <div className="w-full max-w-full overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 w-max">
                        <button
                            onClick={() => setFilterCustomerId(null)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all whitespace-nowrap",
                                !filterCustomerId
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <FolderOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm font-medium">All</span>
                            <span className="text-xs text-muted-foreground">{totalInvoiceCount}</span>
                        </button>
                        {clientFolders.map((folder) => (
                            <button
                                key={folder.id}
                                onClick={() => setFilterCustomerId(filterCustomerId === folder.id ? null : folder.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all whitespace-nowrap",
                                    filterCustomerId === folder.id
                                        ? "bg-accent text-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Folder className="h-4 w-4 shrink-0" />
                                <span className="text-sm font-medium">{folder.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client Folder Sidebar */}
            <div className="hidden md:block w-64 shrink-0">
                <div className="sticky top-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-foreground tracking-tight">Clients</h2>
                        <span className="text-xs text-muted-foreground">{clientFolders.length} folders</span>
                    </div>
                    <div className="space-y-1">
                        {/* All Invoices */}
                        <button
                            onClick={() => setFilterCustomerId(null)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                                !filterCustomerId
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <FolderOpen className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-sm font-medium truncate">All Invoices</span>
                            <span className="text-xs text-muted-foreground">{totalInvoiceCount}</span>
                        </button>

                        {/* Client Folders */}
                        {clientFolders.map((folder) => (
                            <button
                                key={folder.id}
                                onClick={() => setFilterCustomerId(filterCustomerId === folder.id ? null : folder.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                                    filterCustomerId === folder.id
                                        ? "bg-accent text-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Folder className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
                                {typeof folder.count === 'number' && (
                                    <span className="text-xs text-muted-foreground">{folder.count}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-y-6 md:gap-y-10">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-serif text-foreground tracking-tight italic">Invoices</h1>
                        <p className="hidden sm:block text-muted-foreground mt-1">Manage and track your business invoices and payments.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-11 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-none">
                                    Create
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-none">
                                <Link href="/invoices/new">
                                    <DropdownMenuItem className="focus:bg-muted focus:text-foreground rounded-none cursor-pointer">
                                        Invoice
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/invoices/scheduled/new">
                                    <DropdownMenuItem className="focus:bg-muted focus:text-foreground rounded-none cursor-pointer">
                                        Schedule Invoice
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/invoices/recurring/new">
                                    <DropdownMenuItem className="focus:bg-muted focus:text-foreground rounded-none cursor-pointer">
                                        Recurring Invoice
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="md:grid md:grid-cols-4 gap-4">
                    <div className="md:hidden grid grid-cols-2 gap-3">
                        {[
                            {
                                label: "Open",
                                value: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || 'ZAR' }).format(
                                    invoices.filter(i => ['sent', 'viewed', 'draft'].includes(i.status.toLowerCase())).reduce((acc, curr) => acc + (curr.total || 0), 0)
                                ),
                                count: `${invoices.filter(i => ['sent', 'viewed', 'draft'].includes(i.status.toLowerCase())).length} invoices`,
                                status: "unpaid"
                            },
                            {
                                label: "Overdue",
                                value: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || 'ZAR' }).format(
                                    invoices.filter(i => i.status.toLowerCase() === 'overdue').reduce((acc, curr) => acc + (curr.total || 0), 0)
                                ),
                                count: invoices.filter(i => i.status.toLowerCase() === 'overdue').length > 0
                                    ? `${invoices.filter(i => i.status.toLowerCase() === 'overdue').length} invoices`
                                    : "No invoices",
                                status: "overdue"
                            },
                            {
                                label: "Paid",
                                value: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || 'ZAR' }).format(
                                    invoices.filter(i => i.status.toLowerCase() === 'paid').reduce((acc, curr) => acc + (curr.total || 0), 0)
                                ),
                                count: invoices.filter(i => i.status.toLowerCase() === 'paid').length > 0
                                    ? `${invoices.filter(i => i.status.toLowerCase() === 'paid').length} invoices`
                                    : "No invoices",
                                status: "paid"
                            },
                        ].map((card) => (
                            <Card
                                key={card.label}
                                onClick={() => setFilterStatus(filterStatus === card.status ? null : card.status)}
                                className={cn(
                                    "bg-transparent border-border shadow-none overflow-hidden cursor-pointer transition-all hover:bg-muted rounded-none",
                                    filterStatus === card.status && "bg-muted border-border"
                                )}
                            >
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-serif text-foreground mb-2 italic">{card.value}</h3>
                                    <p className="text-xs font-medium text-foreground">{card.label}</p>
                                    <p className="text-[10px] text-muted-foreground">{card.count}</p>
                                </CardContent>
                            </Card>
                        ))}

                        <Card className="bg-transparent border-border shadow-none overflow-hidden relative rounded-none">
                            <CardContent className="p-4">
                                <div>
                                    <h3 className="text-lg font-serif text-foreground mb-2 italic">{Object.keys(invoicesByCompany).length}</h3>
                                    <p className="text-xs font-medium text-foreground">Clients</p>
                                    <p className="text-[10px] text-muted-foreground">Active</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="hidden md:contents">
                        {[
                            {
                                label: "Open",
                                value: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || 'ZAR' }).format(
                                    invoices.filter(i => ['sent', 'viewed', 'draft'].includes(i.status.toLowerCase())).reduce((acc, curr) => acc + (curr.total || 0), 0)
                                ),
                                count: `${invoices.filter(i => ['sent', 'viewed', 'draft'].includes(i.status.toLowerCase())).length} invoices`,
                                status: "unpaid"
                            },
                            {
                                label: "Overdue",
                                value: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || 'ZAR' }).format(
                                    invoices.filter(i => i.status.toLowerCase() === 'overdue').reduce((acc, curr) => acc + (curr.total || 0), 0)
                                ),
                                count: invoices.filter(i => i.status.toLowerCase() === 'overdue').length > 0
                                    ? `${invoices.filter(i => i.status.toLowerCase() === 'overdue').length} invoices`
                                    : "No invoices",
                                status: "overdue"
                            },
                            {
                                label: "Paid",
                                value: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || 'ZAR' }).format(
                                    invoices.filter(i => i.status.toLowerCase() === 'paid').reduce((acc, curr) => acc + (curr.total || 0), 0)
                                ),
                                count: invoices.filter(i => i.status.toLowerCase() === 'paid').length > 0
                                    ? `${invoices.filter(i => i.status.toLowerCase() === 'paid').length} invoices`
                                    : "No invoices",
                                status: "paid"
                            },
                        ].map((card) => (
                            <Card
                                key={card.label}
                                onClick={() => setFilterStatus(filterStatus === card.status ? null : card.status)}
                                className={cn(
                                    "bg-transparent border-border shadow-none overflow-hidden cursor-pointer transition-all hover:bg-muted rounded-none",
                                    filterStatus === card.status && "bg-muted border-border"
                                )}
                            >
                                <CardContent className="p-6">
                                    <h3 className="text-3xl font-serif text-foreground mb-4 italic">{card.value}</h3>
                                    <p className="text-sm font-medium text-foreground">{card.label}</p>
                                    <p className="text-xs text-muted-foreground">{card.count}</p>
                                </CardContent>
                            </Card>
                        ))}

                        <Card className="bg-transparent border-border shadow-none overflow-hidden relative rounded-none">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-3xl font-serif text-foreground mb-4 italic">{Object.keys(invoicesByCompany).length}</h3>
                                        <p className="text-sm font-medium text-foreground">Active Clients</p>
                                        <p className="text-xs text-muted-foreground">Tracking payment history</p>
                                    </div>
                                    <div className="flex items-end gap-[2px] h-12 opacity-30 pt-2">
                                        {[2, 4, 3, 6, 8, 10, 7, 5, 9, 6].map((h, i) => (
                                            <div key={i} className="w-[3px] bg-white rounded-none" style={{ height: `${h * 4}px` }} />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Filter & Actions Bar */}
                <div className="md:static md:bg-transparent md:border-0 sticky top-16 z-20 bg-background/95 backdrop-blur border-y border-border py-3 md:py-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                        <div className="relative w-full sm:max-w-sm group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <Input
                                placeholder="Search or filter"
                                className="pl-10 h-11 bg-transparent border-border focus-visible:ring-offset-0 focus-visible:ring-white/10 rounded-none transition-all"
                            />
                        </div>

                        <div className="flex flex-wrap items-center border border-border p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setFilterInvoiceType('all')
                                    setFilterStatus(null)
                                }}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    filterInvoiceType === 'all' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                All
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setFilterInvoiceType('invoices')
                                    setFilterStatus(null)
                                }}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    filterInvoiceType === 'invoices' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Invoices
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setFilterInvoiceType('recurring')
                                    setFilterStatus(null)
                                }}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    filterInvoiceType === 'recurring' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Recurring Invoices
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setFilterInvoiceType('scheduled')
                                    setFilterStatus(null)
                                }}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    filterInvoiceType === 'scheduled' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Scheduled Invoices
                            </Button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-11 border-border bg-transparent hover:bg-muted transition-colors rounded-none">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-none">
                                {columnsList.map(col => (
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
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="border border-border bg-background overflow-hidden shadow-2xl">
                        {/* Mobile list */}
                        <div className="md:hidden divide-y divide-border">
                            {paginatedInvoices.map((invoice: any) => (
                                <div key={invoice.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-foreground truncate">#{invoice.displayId}</div>
                                            <div className="mt-1 text-xs text-muted-foreground truncate">{invoice.customer}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-sm font-bold text-foreground">{invoice.amount}</div>
                                            <StatusDot
                                                variant={
                                                    invoice.status === 'Paid' ? 'success' :
                                                        invoice.status === 'Overdue' ? 'error' :
                                                            invoice.status === 'Draft' ? 'neutral' :
                                                                'warning'
                                                }
                                            >
                                                {invoice.status}
                                            </StatusDot>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-3">
                                            {invoice.dueDate ? <span>Due: {invoice.dueDate}</span> : <span />}
                                            {invoice.issueDate ? <span>Issued: {invoice.issueDate}</span> : null}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <Link
                                            href={`/invoices/edit/${invoice.id}`}
                                            className="flex-1 h-10 inline-flex items-center justify-center rounded-lg border border-border bg-muted text-xs font-bold text-foreground hover:bg-accent transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            href={`/pay/${invoice.displayId}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`}
                                            target="_blank"
                                            className="flex-1 h-10 inline-flex items-center justify-center rounded-lg border border-border bg-muted text-xs font-bold text-foreground hover:bg-accent transition-colors"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse text-left text-[13px]">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-border">
                                        <th className="px-5 py-3 w-10 border-r border-border text-muted-foreground italic lowercase font-serif bg-accent text-xs">
                                            <div
                                                onClick={toggleSelectAll}
                                                className="w-4 h-4 rounded-sm border border-border bg-muted flex items-center justify-center cursor-pointer hover:border-border/60 hover:bg-accent transition-colors"
                                            >
                                                {selectedIds.length === invoices.length && <Check className="h-3 w-3 text-foreground" />}
                                            </div>
                                        </th>
                                        {columnsList.filter(c => visibleColumns.includes(c.id)).map(col => (
                                            <th 
                                                key={col.id} 
                                                className={cn(
                                                    "px-5 py-3 font-medium uppercase text-[10px] tracking-widest border-r border-border select-none",
                                                    col.sortable ? "cursor-pointer hover:bg-muted hover:text-foreground transition-colors" : "",
                                                    sortColumn === col.id ? "text-foreground bg-muted" : "text-muted-foreground"
                                                )}
                                                onClick={() => col.sortable && handleColumnSort(col.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {col.label}
                                                    {sortColumn === col.id && sortDirection && (
                                                        <span className="text-[8px] text-muted-foreground normal-case font-normal">
                                                            ({sortDirection})
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground text-center w-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedInvoices.map((invoice: any) => (
                                        <tr key={invoice.id} className="hover:bg-muted/50 transition-colors border-b border-border group last:border-0">
                                            <td className="px-5 py-4 border-r border-border">
                                                <div
                                                    onClick={() => toggleSelect(invoice.id)}
                                                    className={cn(
                                                        "w-4 h-4 rounded-sm border border-border bg-muted transition-all flex items-center justify-center cursor-pointer group-hover:border-border/60 group-hover:bg-accent",
                                                        selectedIds.includes(invoice.id) && "bg-white border-border"
                                                    )}
                                                >
                                                    {selectedIds.includes(invoice.id) && <Check className="h-3 w-3 text-black" />}
                                                </div>
                                            </td>
                                            {visibleColumns.includes("id") && (
                                                <td className="px-5 py-4 border-r border-border font-bold text-foreground tracking-tight">#{invoice.displayId}</td>
                                            )}
                                            {visibleColumns.includes("status") && (
                                                <td className="px-5 py-4 border-r border-border">
                                                    <StatusDot
                                                        variant={
                                                            invoice.status === 'Paid' ? 'success' :
                                                                invoice.status === 'Overdue' ? 'error' :
                                                                    invoice.status === 'Draft' ? 'neutral' :
                                                                        'warning'
                                                        }
                                                    >
                                                        {invoice.status}
                                                    </StatusDot>
                                                </td>
                                            )}
                                            {visibleColumns.includes("dueDate") && (
                                                <td className="hidden sm:table-cell px-5 py-4 border-r border-border text-muted-foreground">{invoice.dueDate}</td>
                                            )}
                                            {visibleColumns.includes("customer") && (
                                                <td className="px-5 py-4 border-r border-border text-foreground font-medium">{invoice.customer}</td>
                                            )}
                                            {visibleColumns.includes("amount") && (
                                                <td className="px-5 py-4 border-r border-border text-foreground font-bold">{invoice.amount}</td>
                                            )}
                                            {visibleColumns.includes("issueDate") && (
                                                <td className="hidden sm:table-cell px-5 py-4 border-r border-border text-muted-foreground">{invoice.issueDate}</td>
                                            )}
                                            <td className="px-5 py-4 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-background border-border rounded-xl shadow-2xl p-1">
                                                        <Link href={`/invoices/edit/${invoice.id}`}>
                                                            <DropdownMenuItem className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs">Edit Invoice</DropdownMenuItem>
                                                        </Link>
                                                        <Link href={`/pay/${invoice.displayId}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`} target="_blank">
                                                            <DropdownMenuItem className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs">View Details</DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleDuplicateInvoice(invoice.id)}
                                                        >
                                                            Duplicate Invoice
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={async () => {
                                                                toast.info("Preparing PDF...", { duration: 1000 })
                                                                const qs = new URLSearchParams()
                                                                if (activePaymentProvider) qs.set('provider', activePaymentProvider)
                                                                qs.set('print', 'true')
                                                                window.open(`/pay/${invoice.displayId}?${qs.toString()}`, '_blank')
                                                            }}
                                                        >
                                                            Download PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-accent mx-1" />
                                                        <DropdownMenuItem
                                                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => openMarkPaidDialog(invoice)}
                                                        >
                                                            Mark as Paid
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-accent mx-1" />
                                                        <DropdownMenuItem
                                                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleEmailShare(invoice)}
                                                        >
                                                            Send via Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleCopyLink(invoice.displayId)}
                                                        >
                                                            Copy link
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-accent mx-1" />
                                                        <DropdownMenuItem
                                                            className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleDeleteInvoice(invoice.id)}
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
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-border">
                                <div className="text-xs text-muted-foreground">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalInvoiceCount)} of {totalInvoiceCount} invoices
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum: number
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={cn(
                                                        "w-8 h-8 text-xs rounded-lg transition-colors",
                                                        currentPage === pageNum
                                                            ? "bg-primary text-primary-foreground font-bold"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Selection Toolbar */}
                {selectedIds.length > 0 && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 animate-in slide-in-from-bottom-5">
                        <div className="flex items-center gap-6 px-6 py-4 bg-background border border-border shadow-2xl rounded-none min-w-[400px]">
                            <div className="flex items-center gap-3 border-r border-border pr-6">
                                <span className="text-sm font-bold text-foreground tracking-tight">{selectedIds.length} selected</span>
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Deselect all
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" className="h-9 text-xs font-bold text-foreground hover:bg-muted rounded-none gap-2">
                                    <Download className="h-3.5 w-3.5" />
                                    Download ZIP
                                </Button>
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="ml-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mark as Paid Dialog */}
            <Dialog open={markPaidDialogOpen} onOpenChange={setMarkPaidDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Mark Invoice as Paid</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invoice</Label>
                            <p className="text-sm text-foreground">{markPaidInvoice?.displayId} - {markPaidInvoice?.customer}</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payment Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal bg-muted border-border hover:bg-accent h-11"
                                    >
                                        <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {format(markPaidDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={markPaidDate}
                                        onSelect={(date) => date && setMarkPaidDate(date)}
                                        className="rounded-md"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount Received</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={markPaidAmount}
                                    onChange={(e) => setMarkPaidAmount(e.target.value)}
                                    className="pl-7 bg-muted border-border h-11 text-foreground"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Original amount: {markPaidInvoice?.amount}</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setMarkPaidDialogOpen(false)}
                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleMarkAsPaid}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </> 
    )
}

