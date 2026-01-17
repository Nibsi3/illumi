"use client"

import { StatusDot } from "@/components/status-dot"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Filter, MoreHorizontal, ChevronDown, Check, Download, X, FolderOpen, Folder, ChevronRight } from "lucide-react"
import { IconFolder } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { allInvoices } from "@/lib/mock-data"


const columnsList = [
    { label: "Invoice no.", id: "id" },
    { label: "Status", id: "status" },
    { label: "Due date", id: "dueDate" },
    { label: "Customer", id: "customer" },
    { label: "Amount", id: "amount" },
    { label: "VAT Rate", id: "vatRate" },
    { label: "VAT Amount", id: "vatAmount" },
    { label: "Tax Rate", id: "taxRate" },
    { label: "Tax Amount", id: "taxAmount" },
    { label: "Excl. VAT", id: "exclVat" },
    { label: "Excl. Tax", id: "exclTax" },
    { label: "Internal Note", id: "internalNote" },
    { label: "Issue date", id: "issueDate" },
    { label: "Type", id: "type" },
    { label: "Sent at", id: "sentAt" },
]

export default function InvoicesPage() {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [filterClient, setFilterClient] = useState<string | null>(null)
    const [expandedFolders, setExpandedFolders] = useState<string[]>([])
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "id", "status", "dueDate", "customer", "amount", "issueDate", "type"
    ])

    // Compute unique clients with invoice counts
    const clientFolders = useMemo(() => {
        const clientMap = new Map<string, number>()
        allInvoices.forEach((inv: any) => {
            clientMap.set(inv.customer, (clientMap.get(inv.customer) || 0) + 1)
        })
        return Array.from(clientMap.entries()).map(([name, count]) => ({
            name,
            count
        }))
    }, [])

    const [viewMode, setViewMode] = useState<'list' | 'company'>('list')

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === allInvoices.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(allInvoices.map((i: any) => i.id))
        }
    }

    const toggleFolder = (clientName: string) => {
        setExpandedFolders(prev =>
            prev.includes(clientName)
                ? prev.filter(f => f !== clientName)
                : [...prev, clientName]
        )
    }

    // Filter by both status and client
    const filteredInvoices = allInvoices.filter((inv: any) => {
        const statusMatch = !filterStatus || inv.status.toLowerCase() === filterStatus.toLowerCase()
        const clientMatch = !filterClient || inv.customer === filterClient
        return statusMatch && clientMatch
    })

    // Group invoices by company for the folder view
    const invoicesByCompany = filteredInvoices.reduce((acc: any, inv: any) => {
        if (!acc[inv.customer]) acc[inv.customer] = []
        acc[inv.customer].push(inv)
        return acc
    }, {})

    return (
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
                            <span className="text-xs text-neutral-500">{allInvoices.length}</span>
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
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create
                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#0d0d0d] border-white/10 rounded-none text-white p-1">
                                <Link href="/invoices/new">
                                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-none cursor-pointer px-3 py-2.5 text-xs font-medium">
                                        New Invoice
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/recurring/new">
                                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-none cursor-pointer px-3 py-2.5 text-xs font-medium">
                                        New Recurring
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Open", value: "ZAR 0", count: "2 invoices", status: "unpaid" },
                        { label: "Overdue", value: "ZAR 0", count: "No invoices", status: "overdue" },
                        { label: "Paid", value: "ZAR 0", count: "No invoices", status: "paid" },
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
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    viewMode === 'list' ? "bg-white text-black" : "text-neutral-500 hover:text-white"
                                )}
                            >
                                List View
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('company')}
                                className={cn(
                                    "h-9 px-4 rounded-none text-xs transition-all",
                                    viewMode === 'company' ? "bg-white text-black" : "text-neutral-500 hover:text-white"
                                )}
                            >
                                Company View
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
                {viewMode === 'list' ? (
                    <div className="border border-white/10 bg-black overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-[13px]">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/10">
                                        <th className="px-5 py-3 w-10 border-r border-white/10 text-neutral-500 italic lowercase font-serif bg-white/[0.1] text-xs">
                                            <div
                                                onClick={toggleSelectAll}
                                                className="w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors"
                                            >
                                                {selectedIds.length === allInvoices.length && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                        </th>
                                        {columnsList.filter(c => visibleColumns.includes(c.id)).map(col => (
                                            <th key={col.id} className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] text-center w-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.map((invoice: any) => (
                                        <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/10 group last:border-0">
                                            <td className="px-5 py-4 border-r border-white/10">
                                                <div
                                                    onClick={() => toggleSelect(invoice.id)}
                                                    className={cn(
                                                        "w-4 h-4 rounded-sm border border-white/20 transition-all flex items-center justify-center cursor-pointer group-hover:border-white/40",
                                                        selectedIds.includes(invoice.id) && "bg-white border-white"
                                                    )}
                                                >
                                                    {selectedIds.includes(invoice.id) && <Check className="h-3 w-3 text-black" />}
                                                </div>
                                            </td>
                                            {visibleColumns.includes("id") && (
                                                <td className="px-5 py-4 border-r border-white/10 font-bold text-[#fafafa] tracking-tight">#{invoice.id}</td>
                                            )}
                                            {visibleColumns.includes("status") && (
                                                <td className="px-5 py-4 border-r border-white/10">
                                                    <StatusDot
                                                        variant={
                                                            invoice.status === 'Paid' ? 'success' :
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
                                            {visibleColumns.includes("type") && (
                                                <td className="px-5 py-4 border-r border-white/10 text-neutral-400">{invoice.type}</td>
                                            )}
                                            <td className="px-5 py-4 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-black border-white/10 rounded-xl shadow-2xl p-1">
                                                        <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Edit Invoice</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">View Details</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Download PDF</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/10 mx-1" />
                                                        <DropdownMenuItem className="focus:bg-green-500/10 focus:text-green-500 rounded-lg cursor-pointer px-3 py-2 text-xs">Share via WhatsApp</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Send via Email</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Copy link</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/10 mx-1" />
                                                        <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer px-3 py-2 text-xs">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Object.entries(invoicesByCompany).map(([company, invoices]: [string, any]) => (
                            <Card key={company} className="bg-transparent border-white/5 hover:border-white/20 transition-all rounded-none group cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                                            <IconFolder className="h-6 w-6 text-neutral-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-white truncate">{company}</h4>
                                            <p className="text-[10px] text-neutral-500">{invoices.length} {invoices.length === 1 ? 'item' : 'items'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 opacity-50">
                                        {invoices.slice(0, 2).map((inv: any) => (
                                            <div key={inv.id} className="text-[10px] flex justify-between">
                                                <span className="text-white">#{inv.id}</span>
                                                <span className="text-white font-medium">{inv.amount}</span>
                                            </div>
                                        ))}
                                        {invoices.length > 2 && (
                                            <div className="text-[9px] text-neutral-600">+{invoices.length - 2} more</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Selection Toolbar */}
                {selectedIds.length > 0 && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
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
        </div>
    )
}
