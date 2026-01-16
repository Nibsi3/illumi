"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Mail,
    Trash2,
    Archive,
    ChevronRight,
    SearchIcon,
    ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface InboxItem {
    id: string
    title: string
    amount: string
    currency: string
    date: string
    status: "Paid" | "Pending" | "Overdue"
    type: "invoice" | "receipt"
    details?: any
}

const mockItems: InboxItem[] = [
    {
        id: "1",
        title: "Truehost Cloud",
        amount: "45.00",
        currency: "ZAR",
        date: "Jan 15",
        status: "Paid",
        type: "invoice"
    },
    {
        id: "2",
        title: "The Standard Bank of South Africa Limited",
        amount: "800.00",
        currency: "ZAR",
        date: "Jan 15",
        status: "Pending",
        type: "invoice"
    }
]

export default function InboxPage() {
    const [selectedId, setSelectedId] = useState<string | null>(mockItems[0].id)
    const [searchQuery, setSearchQuery] = useState("")

    const selectedItem = mockItems.find(item => item.id === selectedId)

    return (
        <div className="flex h-[calc(100vh-64px)] -m-12 overflow-hidden bg-black font-serif">
            {/* Left Side: Inbox List */}
            <div className="w-[450px] border-r border-white/5 flex flex-col bg-[#050505]">
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-white/5 space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search or filter"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Filter className="h-4 w-4 text-neutral-500 cursor-pointer hover:text-white" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
                            <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white rounded-md">Inbox</button>
                            <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white">Archived</button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white bg-white/5 border border-white/5">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {mockItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className={cn(
                                "p-6 border-b border-white/5 cursor-pointer transition-all relative group",
                                selectedId === item.id ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm font-bold text-white pr-8 truncate">{item.title}</h3>
                                <span className="text-[10px] text-neutral-500 font-medium whitespace-nowrap">{item.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-neutral-400 font-mono">{item.currency} {item.amount}</p>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                                    item.status === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                )}>
                                    {item.status}
                                </span>
                            </div>
                            {selectedId === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Detail View */}
            <div className="flex-1 flex flex-col bg-black relative">
                {selectedItem ? (
                    <>
                        {/* Detail Header */}
                        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 text-neutral-500">
                                <Mail className="h-4 w-4 cursor-pointer hover:text-white" />
                                <div className="h-4 w-px bg-white/10" />
                                <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-white" />
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="flex-1 overflow-y-auto p-12 flex justify-center scrollbar-hide">
                            <div className="w-full max-w-4xl bg-white text-black min-h-[1000px] shadow-2xl relative p-16 font-serif">
                                {/* Diagonal PAID Badge */}
                                {selectedItem.status === "Paid" && (
                                    <div className="absolute -top-4 -right-12 w-64 h-24 bg-emerald-500 text-white flex items-center justify-center rotate-[32deg] shadow-lg overflow-hidden">
                                        <span className="text-5xl font-black uppercase tracking-[0.2em] transform -translate-y-2 opacity-50 select-none">PAID</span>
                                    </div>
                                )}

                                {/* Invoice Header */}
                                <div className="flex justify-between items-start mb-20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-black rounded flex items-center justify-center p-2">
                                            <img src="/logo.png" alt="Company Logo" className="w-full h-full object-contain invert" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold uppercase tracking-tight">{selectedItem.title}</h2>
                                            <p className="text-sm text-neutral-500 mt-1">{selectedItem.currency} {selectedItem.amount}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-neutral-500 space-y-1">
                                        <p>Jan 15, 2026</p>
                                    </div>
                                </div>

                                {/* Main Document Rendering (Placeholder/Mock) */}
                                <div className="space-y-12">
                                    <div className="flex justify-between border-b pb-8">
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Invoiced To</h4>
                                            <p className="text-sm font-bold">Cameron Falck</p>
                                            <p className="text-xs text-neutral-500 mt-1">cameronfalck03@gmail.com</p>
                                        </div>
                                        <div className="text-right">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Invoice #65289</h4>
                                            <p className="text-xs text-neutral-500">Date: January 15th, 2026</p>
                                            <p className="text-xs text-neutral-500">Due: January 16th, 2026</p>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-4 font-bold uppercase tracking-widest text-neutral-400">Description</th>
                                                <th className="py-4 font-bold uppercase tracking-widest text-neutral-400 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-6 pr-12">
                                                    <p className="font-bold">Domain Registration - illumi.co.za - 1 Year(s)</p>
                                                </td>
                                                <td className="py-6 text-right font-bold">R 45.00</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="py-4 text-right pr-12 text-neutral-400 font-bold">Sub Total</td>
                                                <td className="py-4 text-right font-bold">R 45.00</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 text-right pr-12 text-neutral-400 font-bold">Credit</td>
                                                <td className="py-4 text-right font-bold">R 0.00</td>
                                            </tr>
                                            <tr className="text-lg">
                                                <td className="py-4 text-right pr-12 font-black uppercase">Total</td>
                                                <td className="py-4 text-right font-black underline decoration-2">R 45.00</td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                    {/* Transactions Footer Area */}
                                    <div className="pt-12 border-t mt-20">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Transactions</h4>
                                        <div className="bg-neutral-50 p-4 rounded-lg flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                            <span>Jan 15, 2026</span>
                                            <span>Stripe / Mastercard</span>
                                            <span className="text-black underline">sn_23uP...CP6R</span>
                                            <span className="text-black">45.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search in Doc Footer */}
                        <div className="h-12 border-t border-white/5 bg-[#050505] flex items-center px-6 gap-3 group">
                            <Search className="h-3 w-3 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Select a transaction"
                                className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-white outline-none w-full"
                            />
                            <Filter className="h-3 w-3 text-neutral-500 cursor-pointer hover:text-white" />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Mail className="h-8 w-8 text-neutral-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2 italic">Select an item</h2>
                        <p className="text-neutral-500 text-sm max-w-xs">Pick a document from the left to view its details and management options.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
