"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, MoreHorizontal, ChevronDown, Building2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

import { allClients } from "@/lib/data"

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

export default function ClientsPage() {
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "name", "email", "status", "totalInvoiced", "lastActivity", "tags"
    ])

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

            {/* Clients Table (Redesigned with 1px Grid) */}
            <div className="border border-white/10 bg-black overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[13px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/10">
                                <th className="px-5 py-3 w-10 border-r border-white/10">
                                    <div className="w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
                                        {/* Select All Checkbox */}
                                    </div>
                                </th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Name</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Email</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Status</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Total Invoiced</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Last Activity</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] text-center w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allClients.map((client) => (
                                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/10 group last:border-0">
                                    <td className="px-5 py-4 border-r border-white/10">
                                        <div className="w-4 h-4 rounded-sm border border-white/20 transition-all flex items-center justify-center cursor-pointer group-hover:border-white/40" />
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-[#878787]">
                                                {client.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-[#fafafa] tracking-tight">{client.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10 text-[#878787]">
                                        {client.email}
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                            client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-neutral-400 border-white/10'
                                        )}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10 text-white font-bold">
                                        {client.totalInvoiced}
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10 text-[#878787]">
                                        {client.lastActivity}
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
        </div>
    )
}
