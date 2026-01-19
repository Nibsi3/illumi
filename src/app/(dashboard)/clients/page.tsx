"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, MoreHorizontal, ChevronDown, Building2, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
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
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                if (!activeWorkspace) return

                const { data, error } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('workspace_id', activeWorkspace.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setCustomers(data || [])
            } catch (error: any) {
                toast.error("Failed to load customers", { description: error.message })
            } finally {
                setIsLoading(false)
            }
        }
        fetchCustomers()
    }, [supabase, activeWorkspace])

    const handleDeleteCustomer = async (customerId: string) => {
        try {
            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', customerId)

            if (error) throw error

            setCustomers(prev => prev.filter(c => c.id !== customerId))
            toast.success("Customer deleted")
        } catch (error: any) {
            toast.error("Failed to delete customer", { description: error.message })
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
                <h1 className="text-4xl font-serif text-white tracking-tight italic">Customers</h1>
                <p className="text-neutral-500 mt-1">Manage your customers and the invoices you send to them.</p>
            </div>

            {/* Filter & Actions Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 max-w-md">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
                        <Input
                            placeholder="Search or filter"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-transparent border-white/5 focus-visible:ring-offset-0 focus-visible:ring-white/10 rounded-none transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-50 pointer-events-none">
                            <ChevronDown className="h-4 w-4" />
                        </div>
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
                        <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 rounded-none">
                            {customerColumns.map(col => (
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

                    <Link href="/clients/new">
                        <Button className="h-11 bg-white text-black hover:bg-neutral-200 transition-colors font-semibold rounded-none">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Customer
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-white/40" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && customers.length === 0 && (
                <div className="border border-white/10 bg-black p-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Building2 className="h-8 w-8 text-white/40" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No customers yet</h3>
                    <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                        Start by adding your first customer. You'll be able to send invoices and track payments.
                    </p>
                    <Link href="/clients/new">
                        <Button className="bg-white text-black hover:bg-neutral-200 font-semibold">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Customer
                        </Button>
                    </Link>
                </div>
            )}

            {/* Customers Table */}
            {!isLoading && customers.length > 0 && (
                <div className="border border-white/10 bg-black overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-[13px]">
                            <thead>
                                <tr className="bg-white/2 border-b border-white/10">
                                    <th className="px-5 py-3 w-10 border-r border-white/10">
                                        <div className="w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
                                            {/* Select All Checkbox */}
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Name</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Email</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Status</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Country</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Industry</th>
                                    <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] text-center w-20">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-white/2 transition-colors border-b border-white/10 group last:border-0">
                                        <td className="px-5 py-4 border-r border-white/10">
                                            <div className="w-4 h-4 rounded-sm border border-white/20 transition-all flex items-center justify-center cursor-pointer group-hover:border-white/40" />
                                        </td>
                                        <td className="px-5 py-4 border-r border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-[#878787]">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-[#fafafa] tracking-tight">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-r border-white/10 text-[#878787]">
                                            {customer.email}
                                        </td>
                                        <td className="px-5 py-4 border-r border-white/10">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                                customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-neutral-400 border-white/10'
                                            )}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 border-r border-white/10 text-[#878787]">
                                            {customer.country || 'South Africa'}
                                        </td>
                                        <td className="px-5 py-4 border-r border-white/10 text-[#878787]">
                                            {customer.industry || '-'}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-black border-white/10 rounded-xl shadow-2xl p-1">
                                                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Edit Customer</DropdownMenuItem>
                                                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">View History</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10 mx-1" />
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
        </div>
    )
}

