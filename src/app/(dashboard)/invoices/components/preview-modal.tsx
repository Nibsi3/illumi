"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Printer, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/lib/settings-context"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"

interface PreviewModalProps {
    isOpen: boolean
    onClose: () => void
    data: {
        template: string
        logo: string | null
        tasks: { description: string; price: number; qty: number }[]
        currency: string
        taxRate: number
        dateFormat: string
        invoiceMode: "light" | "dark"
        clientName: string
        clientEmail: string
        clientPhone: string
        clientAddress: string
        invoiceNumber: string
        fromEmail: string
        issueDate: string
        dueDate: string
        note?: string
    }
}

export function PreviewModal({ isOpen, onClose, data }: PreviewModalProps) {
    if (!isOpen) return null
    const { activePaymentProvider } = useSettings()

    const formatDate = (dateString: string) => {
        if (!dateString) return "--/--/----"
        try {
            // dateString is expected to be YYYY-MM-DD
            const date = parseISO(dateString)
            const fmt = data.dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')
            return format(date, fmt)
        } catch (e) {
            return dateString
        }
    }

    const calculateSubtotal = () => {
        return data.tasks.reduce((acc, task) => acc + (task.price * task.qty), 0)
    }

    const subtotal = calculateSubtotal()
    const tax = subtotal * (data.taxRate / 100)
    const total = subtotal + tax

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/50 sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Live Preview</span>
                        <span className="text-sm font-medium text-white tracking-tight">{data.invoiceNumber || "INV-0000"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-tighter"
                        onClick={() => {
                            const url = `${window.location.origin}/pay/${data.invoiceNumber}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`
                            navigator.clipboard.writeText(url)
                            toast.success("Link copied to clipboard")
                        }}
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button
                        variant="outline"
                        className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-tighter"
                        onClick={() => window.print()}
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button
                        className="h-9 bg-white text-black hover:bg-neutral-200 text-xs font-black uppercase tracking-tighter px-6"
                        onClick={() => window.print()}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </header >

            {/* Scrollable Content */}
            < div className="flex-1 overflow-y-auto p-12 scrollbar-hide" >
                <div className={cn(
                    "mx-auto shadow-2xl min-h-[1000px] printable-area transition-all duration-500",
                    data.invoiceMode === "light" ? "bg-white text-black border border-neutral-200" : "bg-[#0a0a0a] text-white border border-white/5",
                    data.template === "Classic" && "p-16 max-w-4xl",
                    data.template === "Minimal" && "p-20 max-w-3xl",
                    data.template === "Modern" && "max-w-4xl p-0 overflow-hidden"
                )}>
                    {data.template === "Modern" && (
                        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full mb-12" />
                    )}

                    <div className={cn(data.template === "Modern" && "p-12")}>
                        <div className="flex justify-between items-start mb-24">
                            <div className={cn(
                                "w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden border",
                                data.invoiceMode === "light" ? "bg-black border-black/5" : "bg-white border-white/10"
                            )}>
                                {data.logo ? (
                                    <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className={cn(
                                        "font-serif font-black text-3xl italic",
                                        data.invoiceMode === "light" ? "text-white" : "text-black"
                                    )}>E.</div>
                                )}
                            </div>
                            <div className="text-right">
                                <h1 className="text-6xl font-serif italic mb-3 tracking-tighter">Invoice</h1>
                                <p className={cn(
                                    "font-mono text-xs tracking-[0.3em] uppercase opacity-40",
                                    data.invoiceMode === "light" ? "text-neutral-400" : "text-white/40"
                                )}>{data.invoiceNumber}</p>
                            </div>
                        </div>

                        {/* From / To */}
                        <div className={cn(
                            "grid grid-cols-2 gap-20 mb-12 pb-12 border-b",
                            data.invoiceMode === "light" ? "border-neutral-100" : "border-white/5"
                        )}>
                            <div className="flex flex-col gap-4">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-[0.2em]",
                                    data.invoiceMode === "light" ? "text-neutral-400" : "text-white/20"
                                )}>From</span>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold">Illumi Professional</p>
                                    {data.fromEmail && <p className="text-xs font-medium opacity-60">{data.fromEmail}</p>}
                                    <p className={cn(
                                        "text-xs leading-relaxed",
                                        data.invoiceMode === "light" ? "text-neutral-500" : "text-white/40"
                                    )}>
                                        123 Business Avenue<br />
                                        Cape Town, 8001
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 text-right">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-[0.2em]",
                                    data.invoiceMode === "light" ? "text-neutral-400" : "text-white/20"
                                )}>To</span>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold italic font-serif opacity-90">{data.clientName || "Valued Customer"}</p>
                                    {data.clientEmail && <p className="text-xs font-medium opacity-60 italic">{data.clientEmail}</p>}
                                    {data.clientPhone && <p className="text-xs font-medium opacity-60 mb-2">{data.clientPhone}</p>}
                                    <p className={cn(
                                        "text-xs leading-relaxed whitespace-pre-wrap",
                                        data.invoiceMode === "light" ? "text-neutral-500" : "text-white/40"
                                    )}>
                                        {data.clientAddress || "Customer Address Details"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metas */}
                        <div className="flex gap-16 mb-12">
                            <div className="flex flex-col gap-1">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    data.invoiceMode === "light" ? "text-neutral-400" : "text-white/20"
                                )}>Issue Date</span>
                                <p className="font-semibold text-sm italic font-serif">
                                    {formatDate(data.issueDate)}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    data.invoiceMode === "light" ? "text-neutral-400" : "text-white/20"
                                )}>Due Date</span>
                                <p className="font-semibold text-sm italic font-serif">
                                    {formatDate(data.dueDate)}
                                </p>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full mb-12">
                            <thead className={cn(
                                "border-b-2 text-[10px] font-bold uppercase tracking-widest",
                                data.invoiceMode === "light" ? "border-black" : "border-white"
                            )}>
                                <tr>
                                    <th className="py-4 text-left">Description</th>
                                    <th className="py-4 text-right">Price</th>
                                    <th className="py-4 text-right">Qty</th>
                                    <th className="py-4 text-right pr-6">Total</th>
                                </tr>
                            </thead>
                            <tbody className={cn(
                                "divide-y",
                                data.invoiceMode === "light" ? "divide-neutral-100" : "divide-white/5"
                            )}>
                                {data.tasks.map((task, i) => (
                                    <tr key={i} className="text-sm">
                                        <td className="py-6 font-medium">{task.description || "No description"}</td>
                                        <td className="py-6 text-right font-mono">{task.price.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</td>
                                        <td className="py-6 text-right font-mono">{task.qty}</td>
                                        <td className="py-6 text-right font-bold font-mono pr-6">{(task.price * task.qty).toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Footer Section */}
                        <div className={cn(
                            "grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t",
                            data.invoiceMode === "light" ? "border-black/10" : "border-white/5"
                        )}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-[0.2em]",
                                        data.invoiceMode === "light" ? "text-neutral-400" : "text-white/20"
                                    )}>Note</span>
                                    <p className={cn(
                                        "text-sm italic font-serif leading-relaxed opacity-60",
                                        data.invoiceMode === "light" ? "text-black/60" : "text-white/60"
                                    )}>
                                        {data.note?.trim() || ""}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Subtotal</span>
                                    <span className="font-mono">{subtotal.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Tax ({data.taxRate}%)</span>
                                    <span className="font-mono text-neutral-400">{tax.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</span>
                                </div>
                                <div className={cn(
                                    "pt-10 border-t flex justify-between items-end",
                                    data.invoiceMode === "light" ? "border-black/5" : "border-white/10"
                                )}>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20 mb-2">Total Due</span>
                                    <span className="text-5xl font-serif italic font-bold tracking-tighter">
                                        {total.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <style jsx global>{`
                @media print {
                    header { display: none !important; }
                    .printable-area { 
                        box-shadow: none !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        width: 100% !important;
                    }
                }
            `}</style>
        </div >
    )
}
