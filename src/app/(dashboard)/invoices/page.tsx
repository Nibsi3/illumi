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
    const { currency, activePaymentProvider, fromEmail, companyName, companyWebsite, sendInvoiceCopyToSelf } = useSettings()
    const { isPro } = useSubscription()

    // Cached invoice fetching with React Query
    const { data: rawInvoices = [], isLoading, refetch } = useQuery({
        queryKey: [...queryKeys.invoices(activeWorkspace?.id || ""), currency],
        queryFn: async () => {
            if (!activeWorkspace) return []
            const { data, error } = await supabase
                .from('invoices')
                .select('*, customers(name)')
                .eq('workspace_id', activeWorkspace.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!activeWorkspace?.id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })

    // Transform raw data for display
    const invoices = useMemo(() => {
        return rawInvoices.map((inv: any) => {
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            const rawStatus = (inv.status || '').toLowerCase()
            const dueDate = inv.due_date ? new Date(inv.due_date + "T00:00:00") : null
            const isOverdue = rawStatus !== 'paid' && rawStatus !== 'scheduled' && dueDate && dueDate < now

            return {
                ...inv,
                raw_status: rawStatus,
                displayId: inv.invoice_number,
                customer: inv.customers?.name || 'Unknown',
                amount: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currency || inv.currency || 'ZAR' }).format(inv.total),
                dueDate: inv.due_date,
                issueDate: inv.issue_date,
                status: isOverdue ? 'Overdue' : rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : ''
            }
        })
    }, [rawInvoices, currency])

    // State needed for UI (restored)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [filterClient, setFilterClient] = useState<string | null>(null)
    const [filterInvoiceType, setFilterInvoiceType] = useState<'all' | 'invoices' | 'recurring' | 'scheduled'>('all')

    // Mark as Paid dialog state
    const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false)
    const [markPaidInvoice, setMarkPaidInvoice] = useState<any>(null)
    const [markPaidDate, setMarkPaidDate] = useState<Date>(new Date())
    const [markPaidAmount, setMarkPaidAmount] = useState<string>("")
    const [expandedFolders, setExpandedFolders] = useState<string[]>([])
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "id", "status", "dueDate", "customer", "amount", "issueDate"
    ])

    // Sorting state
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<string | null>(null)

    // Compute unique clients with invoice counts
    const clientFolders = useMemo(() => {
        const clientMap = new Map<string, number>()
        invoices.forEach((inv: any) => {
            clientMap.set(inv.customer, (clientMap.get(inv.customer) || 0) + 1)
        })
        return Array.from(clientMap.entries()).map(([name, count]) => ({
            name,
            count
        }))
    }, [invoices])

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

    const handleWhatsAppShare = (invoiceNumber: string, total: any) => {
        const url = `${window.location.origin}/pay/${invoiceNumber}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`
        const text = `Invoice #${invoiceNumber} from Emini Invoicing. Total: ${total}. View and pay here: ${url}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    const handleEmailShare = async (invoice: any) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const paymentLink = `${window.location.origin}/pay/${invoice.displayId}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`

            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'invoice',
                    to: invoice.customers?.email || invoice.customer_email || 'customer@example.com',
                    companyName: companyName,
                    supportEmail: fromEmail,
                    companyWebsite: companyWebsite,
                    allowCustomBranding: Boolean(isPro),
                    customerName: invoice.customer,
                    invoiceNumber: invoice.displayId,
                    amount: invoice.amount,
                    currency: invoice.currency || 'ZAR',
                    dueDate: invoice.dueDate,
                    paymentLink,
                })
            })

            const data = await response.json()
            if (data.success) {
                toast.success("Email sent successfully")
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
                .select('*, invoice_items(*)')
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
                .select()
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

    // Filter by both status and client
    const filteredInvoices = invoices.filter((inv: any) => {
        let statusMatch = !filterStatus
        if (filterStatus === 'unpaid') {
            const statusForMatch = (inv.raw_status || inv.status || '').toLowerCase()
            statusMatch = ['sent', 'viewed', 'draft', 'scheduled'].includes(statusForMatch)
        } else if (filterStatus === 'overdue') {
            statusMatch = inv.status.toLowerCase() === 'overdue'
        } else if (filterStatus) {
            statusMatch = inv.status.toLowerCase() === filterStatus.toLowerCase()
        }

        const clientMatch = !filterClient || inv.customer === filterClient

        const isScheduled = (inv.raw_status || inv.status || '').toLowerCase() === 'scheduled'
        const isRecurringParent = Boolean(inv.is_recurring)
        const typeMatch =
            filterInvoiceType === 'all'
                ? true
                : filterInvoiceType === 'scheduled'
                    ? isScheduled
                    : filterInvoiceType === 'recurring'
                        ? isRecurringParent
                        : !isScheduled && !isRecurringParent

        return statusMatch && clientMatch && typeMatch
    })

    // Sort filtered invoices
    const sortedInvoices = [...filteredInvoices].sort((a, b) => {
        if (!sortColumn || !sortDirection) return 0

        switch (sortColumn) {
            case 'id':
                // Sort by invoice number
                const numA = a.displayId?.replace(/\D/g, '') || '0'
                const numB = b.displayId?.replace(/\D/g, '') || '0'
                return sortDirection === 'asc' 
                    ? parseInt(numA) - parseInt(numB)
                    : parseInt(numB) - parseInt(numA)

            case 'status':
                // Sort by status: Paid first or Overdue first
                if (sortDirection === 'Paid') {
                    if (a.status === 'Paid' && b.status !== 'Paid') return -1
                    if (a.status !== 'Paid' && b.status === 'Paid') return 1
                } else if (sortDirection === 'Overdue') {
                    if (a.status === 'Overdue' && b.status !== 'Overdue') return -1
                    if (a.status !== 'Overdue' && b.status === 'Overdue') return 1
                }
                return 0

            case 'dueDate':
                const dueDateA = a.dueDate ? new Date(a.dueDate).getTime() : 0
                const dueDateB = b.dueDate ? new Date(b.dueDate).getTime() : 0
                return sortDirection === 'closest'
                    ? dueDateA - dueDateB
                    : dueDateB - dueDateA

            case 'customer':
                const nameA = (a.customer || '').toLowerCase()
                const nameB = (b.customer || '').toLowerCase()
                return sortDirection === 'A-Z'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA)

            case 'amount':
                const amountA = a.total || 0
                const amountB = b.total || 0
                return sortDirection === 'highest'
                    ? amountB - amountA
                    : amountA - amountB

            case 'issueDate':
                const issueDateA = a.issueDate ? new Date(a.issueDate).getTime() : 0
                const issueDateB = b.issueDate ? new Date(b.issueDate).getTime() : 0
                return sortDirection === 'closest'
                    ? issueDateA - issueDateB
                    : issueDateB - issueDateA

            default:
                return 0
        }
    })

    // Group invoices by company for the folder view
    const invoicesByCompany = filteredInvoices.reduce((acc: any, inv: any) => {
        if (!acc[inv.customer]) acc[inv.customer] = []
        acc[inv.customer].push(inv)
        return acc
    }, {})

    return (
        <>
        <div className="flex gap-6 pb-32">
            {/* Client Folder Sidebar */}
            <div className="w-64 shrink-0">
                <div className="sticky top-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white tracking-tight">Clients</h2>
                        <span className="text-xs text-neutral-500">{clientFolders.length} folders</span>
                    </div>
                    <div className="space-y-1">
                        {/* All Invoices */}
                        <button
                            onClick={() => setFilterClient(null)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                                !filterClient
                                    ? "bg-white/10 text-white"
                                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <FolderOpen className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-sm font-medium truncate">All Invoices</span>
                            <span className="text-xs text-neutral-500">{invoices.length}</span>
                        </button>

                        {/* Client Folders */}
                        {clientFolders.map((folder) => (
                            <button
                                key={folder.name}
                                onClick={() => setFilterClient(filterClient === folder.name ? null : folder.name)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                                    filterClient === folder.name
                                        ? "bg-white/10 text-white"
                                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Folder className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
                                <span className="text-xs text-neutral-500">{folder.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-y-10">

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif text-white tracking-tight italic">Invoices</h1>
                        <p className="text-neutral-500 mt-1">Manage and track your business invoices and payments.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-11 bg-white text-black hover:bg-neutral-200 transition-colors font-medium rounded-none">
                                    Create
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#0d0d0d] border-white/10 rounded-none">
                                <Link href="/invoices/new">
                                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-none cursor-pointer">
                                        Invoice
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/invoices/scheduled/new">
                                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-none cursor-pointer">
                                        Schedule Invoice
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/invoices/recurring/new">
                                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-none cursor-pointer">
                                        Recurring Invoice
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                "bg-transparent border-white/5 shadow-none overflow-hidden cursor-pointer transition-all hover:bg-white/5 rounded-none",
                                filterStatus === card.status && "bg-white/5 border-white/20"
                            )}
                        >
                            <CardContent className="p-6">
                                <h3 className="text-3xl font-serif text-white mb-4 italic">{card.value}</h3>
                                <p className="text-sm font-medium text-white">{card.label}</p>
                                <p className="text-xs text-neutral-500">{card.count}</p>
                            </CardContent>
                        </Card>
                    ))}

                    <Card className="bg-transparent border-white/5 shadow-none overflow-hidden relative rounded-none">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-serif text-white mb-4 italic">{Object.keys(invoicesByCompany).length}</h3>
                                    <p className="text-sm font-medium text-white">Active Clients</p>
                                    <p className="text-xs text-neutral-500">Tracking payment history</p>
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

                {/* Filter & Actions Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-sm group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
                            <Input
                                placeholder="Search or filter"
                                className="pl-10 h-11 bg-transparent border-white/5 focus-visible:ring-offset-0 focus-visible:ring-white/10 rounded-none transition-all"
                            />
                        </div>

                        <div className="flex items-center border border-white/5 p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilterInvoiceType('all')}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    filterInvoiceType === 'all' ? "bg-white text-black" : "text-neutral-500 hover:text-white"
                                )}
                            >
                                Invoices
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilterInvoiceType('recurring')}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    filterInvoiceType === 'recurring' ? "bg-white text-black" : "text-neutral-500 hover:text-white"
                                )}
                            >
                                Recurring Invoices
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilterInvoiceType('scheduled')}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    filterInvoiceType === 'scheduled' ? "bg-white text-black" : "text-neutral-500 hover:text-white"
                                )}
                            >
                                Scheduled Invoices
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-11 border-white/5 bg-transparent hover:bg-white/5 transition-colors rounded-none">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#0d0d0d] border-white/10 rounded-none">
                                {columnsList.map(col => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={visibleColumns.includes(col.id)}
                                        onCheckedChange={(checked) => {
                                            setVisibleColumns(prev =>
                                                checked ? [...prev, col.id] : prev.filter(c => c !== col.id)
                                            )
                                        }}
                                        className="focus:bg-white/5 focus:text-white rounded-none"
                                    >
                                        {col.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="border border-white/10 bg-black overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-[13px]">
                                <thead>
                                    <tr className="bg-white/2 border-b border-white/10">
                                        <th className="px-5 py-3 w-10 border-r border-white/10 text-neutral-500 italic lowercase font-serif bg-white/10 text-xs">
                                            <div
                                                onClick={toggleSelectAll}
                                                className="w-4 h-4 rounded-sm border border-white/40 bg-white/5 flex items-center justify-center cursor-pointer hover:border-white/60 hover:bg-white/10 transition-colors"
                                            >
                                                {selectedIds.length === invoices.length && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                        </th>
                                        {columnsList.filter(c => visibleColumns.includes(c.id)).map(col => (
                                            <th 
                                                key={col.id} 
                                                className={cn(
                                                    "px-5 py-3 font-medium uppercase text-[10px] tracking-widest border-r border-white/10 select-none",
                                                    col.sortable ? "cursor-pointer hover:bg-white/5 hover:text-white transition-colors" : "",
                                                    sortColumn === col.id ? "text-white bg-white/5" : "text-[#878787]"
                                                )}
                                                onClick={() => col.sortable && handleColumnSort(col.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {col.label}
                                                    {sortColumn === col.id && sortDirection && (
                                                        <span className="text-[8px] text-white/60 normal-case font-normal">
                                                            ({sortDirection})
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] text-center w-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedInvoices.map((invoice: any) => (
                                        <tr key={invoice.id} className="hover:bg-white/2 transition-colors border-b border-white/10 group last:border-0">
                                            <td className="px-5 py-4 border-r border-white/10">
                                                <div
                                                    onClick={() => toggleSelect(invoice.id)}
                                                    className={cn(
                                                        "w-4 h-4 rounded-sm border border-white/40 bg-white/5 transition-all flex items-center justify-center cursor-pointer group-hover:border-white/60 group-hover:bg-white/10",
                                                        selectedIds.includes(invoice.id) && "bg-white border-white"
                                                    )}
                                                >
                                                    {selectedIds.includes(invoice.id) && <Check className="h-3 w-3 text-black" />}
                                                </div>
                                            </td>
                                            {visibleColumns.includes("id") && (
                                                <td className="px-5 py-4 border-r border-white/10 font-bold text-[#fafafa] tracking-tight">#{invoice.displayId}</td>
                                            )}
                                            {visibleColumns.includes("status") && (
                                                <td className="px-5 py-4 border-r border-white/10">
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
                                                <td className="px-5 py-4 border-r border-white/10 text-[#878787]">{invoice.dueDate}</td>
                                            )}
                                            {visibleColumns.includes("customer") && (
                                                <td className="px-5 py-4 border-r border-white/10 text-[#fafafa] font-medium">{invoice.customer}</td>
                                            )}
                                            {visibleColumns.includes("amount") && (
                                                <td className="px-5 py-4 border-r border-white/10 text-white font-bold">{invoice.amount}</td>
                                            )}
                                            {visibleColumns.includes("issueDate") && (
                                                <td className="px-5 py-4 border-r border-white/10 text-neutral-400">{invoice.issueDate}</td>
                                            )}
                                            <td className="px-5 py-4 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-black border-white/10 rounded-xl shadow-2xl p-1">
                                                        <Link href={`/invoices/edit/${invoice.id}`}>
                                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Edit Invoice</DropdownMenuItem>
                                                        </Link>
                                                        <Link href={`/pay/${invoice.displayId}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`} target="_blank">
                                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">View Details</DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleDuplicateInvoice(invoice.id)}
                                                        >
                                                            Duplicate Invoice
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs"
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
                                                        <DropdownMenuSeparator className="bg-white/10 mx-1" />
                                                        <DropdownMenuItem
                                                            className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => openMarkPaidDialog(invoice)}
                                                        >
                                                            Mark as Paid
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/10 mx-1" />
                                                        <DropdownMenuItem
                                                            className="focus:bg-green-500/10 focus:text-green-500 rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleWhatsAppShare(invoice.displayId, invoice.amount)}
                                                        >
                                                            Share via WhatsApp
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleEmailShare(invoice)}
                                                        >
                                                            Send via Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs"
                                                            onClick={() => handleCopyLink(invoice.displayId)}
                                                        >
                                                            Copy link
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/10 mx-1" />
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
                    </div>
                </div>
                {/* Selection Toolbar */}
                {selectedIds.length > 0 && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 animate-in slide-in-from-bottom-5">
                        <div className="flex items-center gap-6 px-6 py-4 bg-black border border-white/10 shadow-2xl rounded-none min-w-[400px]">
                            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                                <span className="text-sm font-bold text-white tracking-tight">{selectedIds.length} selected</span>
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="text-xs text-neutral-500 hover:text-white transition-colors"
                                >
                                    Deselect all
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" className="h-9 text-xs font-bold text-white hover:bg-white/5 rounded-none gap-2">
                                    <Download className="h-3.5 w-3.5" />
                                    Download ZIP
                                </Button>
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="ml-auto p-1 text-neutral-500 hover:text-white transition-colors"
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
                <DialogContent className="bg-[#09090b] border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Mark Invoice as Paid</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Invoice</Label>
                            <p className="text-sm text-white">{markPaidInvoice?.displayId} - {markPaidInvoice?.customer}</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Payment Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 h-11"
                                    >
                                        <CalendarDays className="mr-2 h-4 w-4 text-neutral-400" />
                                        {format(markPaidDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-[#09090b] border-white/10" align="start">
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
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Amount Received</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">R</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={markPaidAmount}
                                    onChange={(e) => setMarkPaidAmount(e.target.value)}
                                    className="pl-7 bg-white/5 border-white/10 h-11 text-white"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-[10px] text-neutral-500">Original amount: {markPaidInvoice?.amount}</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setMarkPaidDialogOpen(false)}
                            className="text-neutral-400 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleMarkAsPaid}
                            className="bg-white text-black hover:bg-neutral-200"
                        >
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </> 
    )
}
