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
        tasks: { description: string; price: number; qty: number; discount?: number }[]
        currency: string
        taxRate: number
        dateFormat: string
        invoiceMode: "light" | "dark"
        isPro?: boolean
        hideIllumiBranding?: boolean
        companyWebsite?: string
        paymentProvider?: string | null
        bankName?: string
        accountName?: string
        accountNumber?: string
        branchCode?: string
        fromName?: string
        fromAddress?: string
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

    const isBankingMode = !data.paymentProvider

    const isLight = data.invoiceMode === "light"
    const illumiLogoSrc = isLight ? '/midday-logo.png' : '/logo.png'

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

    const calculateLineTotal = (task: { price: number; qty: number; discount?: number }) => {
        const discount = Math.min(100, Math.max(0, Number(task.discount) || 0))
        return task.price * task.qty * (1 - discount / 100)
    }

    const calculateSubtotal = () => {
        return data.tasks.reduce((acc, task) => acc + calculateLineTotal(task), 0)
    }

    const subtotal = calculateSubtotal()
    const tax = subtotal * (data.taxRate / 100)
    const total = subtotal + tax

    return (
        <div className="fixed inset-0 z-100 flex flex-col bg-background/90 backdrop-blur-xl animate-in fade-in duration-300">
            {/* Header */}
            <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-background/80 sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Preview</span>
                        <span className="text-sm font-medium text-foreground tracking-tight">{data.invoiceNumber || "INV-0000"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {!isBankingMode && (
                        <Button
                            variant="outline"
                            className="h-9 border-border bg-muted hover:bg-accent text-foreground text-xs font-bold uppercase tracking-tighter px-3 sm:px-4"
                            onClick={() => {
                                const provider = data.paymentProvider || activePaymentProvider
                                const url = `${window.location.origin}/pay/${data.invoiceNumber}${provider ? `?provider=${provider}` : ''}`
                                navigator.clipboard.writeText(url)
                                toast.success("Link copied to clipboard")
                            }}
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="h-9 border-border bg-muted hover:bg-accent text-foreground text-xs font-bold uppercase tracking-tighter px-3 sm:px-4"
                        onClick={() => window.print()}
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button
                        className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-black uppercase tracking-tighter px-3 sm:px-6"
                        onClick={() => window.print()}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-12 scrollbar-hide">
                <div className={cn(
                    "mx-auto shadow-2xl min-h-[1000px] printable-area transition-all duration-500",
                    isLight
                        ? "bg-white! text-black! border border-neutral-200!"
                        : "bg-neutral-950! text-neutral-100! border border-transparent [&_.text-muted-foreground]:text-neutral-400! [&_.text-foreground]:text-neutral-100!",
                    data.template === "Classic" && "p-16 max-w-4xl",
                    data.template === "Minimal" && "p-20 max-w-3xl",
                    data.template === "Modern" && "max-w-4xl p-0 overflow-hidden"
                )}>
                    {data.template === "Modern" && (
                        <div className="h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 w-full mb-12" />
                    )}

                    <div className={cn(data.template === "Modern" && "p-12")}>
                        <div className="flex justify-between items-start mb-24">
                            <div className="w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden border bg-neutral-950 border-neutral-800">
                                {data.logo ? (
                                    <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <img src="/logo.png" alt="Illumi" className="w-full h-full object-contain p-2" />
                                )}
                            </div>
                            <div className="text-right">
                                <h1 className="text-6xl invoice-font-title font-bold mb-3 tracking-tighter">Invoice</h1>
                                <p className={cn(
                                    "invoice-font-id text-xs tracking-[0.3em] uppercase opacity-40",
                                    isLight ? "text-neutral-500" : "text-neutral-400"
                                )}>{data.invoiceNumber}</p>
                            </div>
                        </div>

                        {/* From / To */}
                        <div className={cn(
                            "grid grid-cols-2 gap-20 mb-12 pb-12 border-b",
                            isLight ? "border-neutral-200" : "border-neutral-700"
                        )}>
                            <div className="flex flex-col gap-4">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-[0.2em]",
                                    isLight ? "text-neutral-500" : "text-neutral-400"
                                )}>From</span>
                                <div className="space-y-1 invoice-font-from">
                                    <p className="text-lg font-bold">{data.fromName || ""}</p>
                                    {data.fromEmail && <p className="text-xs font-medium opacity-60">{data.fromEmail}</p>}
                                    <p className={cn(
                                        "text-xs leading-relaxed whitespace-pre-wrap",
                                        isLight ? "text-neutral-500" : "text-neutral-400"
                                    )}>
                                        {data.fromAddress || ""}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 text-right">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-[0.2em]",
                                    isLight ? "text-neutral-500" : "text-neutral-400"
                                )}>To</span>
                                <div className="space-y-1 invoice-font-client">
                                    <p className="text-lg font-bold opacity-90">{data.clientName || "Valued Customer"}</p>
                                    {data.clientEmail && <p className="text-xs font-medium opacity-60">{data.clientEmail}</p>}
                                    {data.clientPhone && <p className="text-xs font-medium opacity-60 mb-2">{data.clientPhone}</p>}
                                    <p className={cn(
                                        "text-xs leading-relaxed whitespace-pre-wrap",
                                        isLight ? "text-neutral-500" : "text-neutral-400"
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
                                    isLight ? "text-neutral-500" : "text-neutral-400"
                                )}>Issue Date</span>
                                <p className="invoice-font-date font-semibold text-sm">
                                    {formatDate(data.issueDate)}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    isLight ? "text-neutral-500" : "text-neutral-400"
                                )}>Due Date</span>
                                <p className="invoice-font-date font-semibold text-sm">
                                    {formatDate(data.dueDate)}
                                </p>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full mb-12">
                            <thead className={cn(
                                "border-b-2 text-[10px] font-bold uppercase tracking-widest",
                                isLight ? "border-neutral-300" : "border-neutral-600"
                            )}>
                                <tr>
                                    <th className="py-4 text-left">Description</th>
                                    <th className="py-4 text-right">Price</th>
                                    <th className="py-4 text-right">Qty</th>
                                    <th className="py-4 text-right">Disc</th>
                                    <th className="py-4 text-right pr-6">Total</th>
                                </tr>
                            </thead>
                            <tbody className={cn(
                                "divide-y",
                                isLight ? "divide-black/10" : "divide-border"
                            )}>
                                {data.tasks.map((task, i) => (
                                    <tr key={i} className="text-sm">
                                        <td className="py-6 font-medium invoice-font-item">{task.description || "No description"}</td>
                                        <td className="py-6 text-right invoice-font-amount">{task.price.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</td>
                                        <td className="py-6 text-right invoice-font-amount">{task.qty}</td>
                                        <td className="py-6 text-right invoice-font-amount">{(Number(task.discount) || 0).toLocaleString('en-ZA', { maximumFractionDigits: 2 })}%</td>
                                        <td className="py-6 text-right font-bold invoice-font-amount pr-6">{calculateLineTotal(task).toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Footer Section */}
                        <div className={cn(
                            "grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t",
                            isLight ? "border-neutral-200" : "border-neutral-700"
                        )}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-[0.2em]",
                                        isLight ? "text-neutral-500" : "text-neutral-400"
                                    )}>Note</span>
                                    <p className={cn(
                                        "text-sm invoice-font-notes leading-relaxed opacity-60",
                                        isLight ? "text-neutral-600" : "text-neutral-400"
                                    )}>
                                        {data.note?.trim() || ""}
                                    </p>
                                </div>

                                {isBankingMode && (data.bankName || data.accountName || data.accountNumber || data.branchCode) && (
                                    <div className="space-y-2">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-[0.2em]",
                                            isLight ? "text-neutral-500" : "text-neutral-400"
                                        )}>Payment Details</span>
                                        <p className={cn(
                                            "text-sm invoice-font-notes leading-relaxed opacity-60",
                                            isLight ? "text-neutral-600" : "text-neutral-400"
                                        )}>
                                            {data.bankName ? <>BANK: {data.bankName}<br /></> : null}
                                            {data.accountName ? <>ACCOUNT: {data.accountName}<br /></> : null}
                                            {data.accountNumber ? <>NUMBER: {data.accountNumber}<br /></> : null}
                                            {data.branchCode ? <>CODE: {data.branchCode}</> : null}
                                        </p>
                                    </div>
                                )}

                                {!data.hideIllumiBranding && data.isPro && (
                                    <div className="pt-6">
                                        <img
                                            src={illumiLogoSrc}
                                            alt="Illumi"
                                            className={cn(
                                                "h-5 w-5 object-contain",
                                                isLight ? "opacity-40" : "opacity-60"
                                            )}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className={cn("text-[10px] uppercase font-bold tracking-widest", isLight ? "text-neutral-500" : "text-neutral-400")}>Subtotal</span>
                                    <span className="invoice-font-amount">{subtotal.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className={cn("text-[10px] uppercase font-bold tracking-widest", isLight ? "text-neutral-500" : "text-neutral-400")}>Tax ({data.taxRate}%)</span>
                                    <span className={cn("invoice-font-amount", isLight ? "text-neutral-600" : "text-neutral-400")}>{tax.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}</span>
                                </div>
                                <div className={cn(
                                    "pt-10 border-t flex justify-between items-end",
                                    isLight ? "border-neutral-200" : "border-neutral-700"
                                )}>
                                    <span className={cn("text-[10px] uppercase font-bold tracking-[0.3em] mb-2", isLight ? "text-neutral-500" : "text-neutral-400")}>Total Due</span>
                                    <span className="text-5xl invoice-font-amount font-bold tracking-tighter">
                                        {total.toLocaleString('en-ZA', { style: 'currency', currency: data.currency })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center pt-10 gap-2">
                            {!data.hideIllumiBranding && !data.isPro && (
                                <a
                                    href="https://illumi.co.za"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        "inline-flex items-center gap-2",
                                        isLight ? "opacity-40 hover:opacity-60" : "opacity-60 hover:opacity-80"
                                    )}
                                >
                                    <img
                                        src={illumiLogoSrc}
                                        alt="Illumi"
                                        className="h-5 w-5 object-contain"
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] underline underline-offset-4">
                                        Made with Illumi Invoice
                                    </span>
                                </a>
                            )}
                            {data.companyWebsite && (
                                <a
                                    href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        "text-[10px] font-bold uppercase tracking-[0.2em] underline underline-offset-4",
                                        isLight ? "opacity-40 hover:opacity-60" : "opacity-60 hover:opacity-80"
                                    )}
                                >
                                    {data.companyWebsite}
                                </a>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    header { display: none !important; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    body * { visibility: hidden; }
                    .printable-area, .printable-area * { visibility: visible; }
                    .printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        box-shadow: none !important;
                        margin: 0 !important;
                    }
                    @page { size: A4; margin: 12mm; }
                }
            `}</style>
        </div>
    )
}

