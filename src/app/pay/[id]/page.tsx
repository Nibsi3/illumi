"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Loader2, CreditCard, Receipt, Calendar, User, ArrowRight, DollarSign, Download, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"

export default function PayInvoicePage() {
    const params = useParams()
    const invoiceId = params.id as string
    const [invoice, setInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSimulating, setIsSimulating] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

                let query = supabase
                    .from('invoices')
                    .select('*, customers(*), invoice_items(*)');

                if (isUUID(invoiceId)) {
                    query = query.eq('id', invoiceId);
                } else {
                    query = query.eq('invoice_number', invoiceId);
                }

                const { data, error } = await query.single();

                if (error) throw error
                if (!data) throw new Error("Invoice not found")

                setInvoice(data)
            } catch (err: any) {
                console.error("Error fetching invoice:", err)
                setError(err.message || "Failed to load invoice")
            } finally {
                setLoading(false)
            }
        }

        if (invoiceId) {
            fetchInvoice()
        }
    }, [invoiceId, supabase])

    useEffect(() => {
        const isPrint = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('print') === 'true';
        if (!loading && invoice && isPrint) {
            const timer = setTimeout(() => {
                window.print();
            }, 1500); // 1.5s delay to ensure full render
            return () => clearTimeout(timer);
        }
    }, [loading, invoice])

    useEffect(() => {
        if (typeof window !== 'undefined' && invoice) {
            const params = new URLSearchParams(window.location.search)
            const status = params.get('status')
            const provider = params.get('provider')
            const sessionId = params.get('session_id')
            if (status === 'success') {
                toast.success("Payment Received", {
                    description: "Your payment is being processed. Thank you!"
                })

                // Stripe requires verifying the Checkout Session before marking an invoice paid.
                if (provider === 'stripe' && sessionId) {
                    fetch('/api/paygate/verify-stripe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            invoiceId: invoice.id,
                            sessionId,
                            workspaceId: invoice.workspace_id,
                        })
                    }).then(async (res) => {
                        const json = await res.json().catch(() => null)
                        if (!res.ok || !json?.success) {
                            throw new Error(json?.error || 'Stripe verification failed')
                        }
                        window.location.href = window.location.pathname
                    }).catch(err => {
                        console.error("Stripe verification failed:", err)
                        toast.error("Payment verification failed", {
                            description: err?.message || 'Please contact the sender.'
                        })
                    })
                    return
                }

                // Fallback: Update invoice status directly in case webhook didn't fire
                // This handles cases where PayFast can't reach our webhook (e.g., localhost)
                fetch('/api/invoices/mark-paid', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ invoiceId: invoice.id })
                }).then(() => {
                    // Refresh the page data after updating
                    window.location.href = window.location.pathname
                }).catch(err => {
                    console.error("Failed to update invoice status:", err)
                })
            } else if (status === 'cancelled') {
                toast.warning("Payment Cancelled", {
                    description: "The payment process was cancelled."
                })
            }
        }
    }, [invoice])

    const handlePayment = async () => {
        setIsSimulating(true)
        try {
            // Validate amount before sending to API
            const amount = Number(invoice.total)
            if (!Number.isFinite(amount) || amount <= 0) {
                toast.error("Invalid invoice amount", {
                    description: "This invoice has no valid total. Please contact the sender."
                })
                setIsSimulating(false)
                return
            }

            // Get provider from URL params, invoice's payment_provider field, or default to payfast
            const urlProvider = new URLSearchParams(window.location.search).get('provider')
            const invoiceProvider = invoice.payment_provider
            const provider = urlProvider || invoiceProvider || 'payfast'

            const customerEmail = invoice?.customers?.email || invoice?.customer_email
            
            const response = await fetch('/api/paygate/generate-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId: invoice.id,
                    amount: amount,
                    currency: invoice.currency || 'ZAR',
                    provider,
                    invoiceNumber: invoice.invoice_number,
                    workspaceId: invoice.workspace_id,
                    email: customerEmail
                })
            })

            const data = await response.json()
            if (data.success && data.link) {
                toast.success("Redirecting to payment gateway...", {
                    description: "You will be redirected shortly."
                })
                window.location.href = data.link
            } else {
                const providerLabel = data.provider || provider
                throw new Error(`[${providerLabel}] ${data.error || "Failed to generate payment link"}`)
            }
        } catch (err: any) {
            console.error("Payment error:", err)
            toast.error("Payment failed", {
                description: err?.message || "Failed to generate payment link"
            })
            setIsSimulating(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-white animate-spin opacity-50" />
                    <p className="text-neutral-500 text-sm tracking-widest uppercase font-bold text-[10px]">Verifying Invoice...</p>
                </div>
            </div>
        )
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[#121212] border-white/10 text-white rounded-none">
                    <CardHeader className="text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <CardTitle className="font-serif italic text-2xl">Missing Invoice</CardTitle>
                        <CardDescription className="text-neutral-500 mt-2">
                            {error || "We couldn't find the invoice you're looking for. It may have been deleted or the link is expired."}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-none font-bold text-[10px] uppercase tracking-widest" onClick={() => window.location.reload()}>
                            Retry Connection
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    const isPaid = invoice.status === 'paid' || invoice.status === 'Paid'
    const template = invoice.template || "Classic"
    const mode = invoice.invoice_mode || "dark"
    const logoBg = (mode || "dark") as "light" | "dark"

    const urlProvider = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('provider') : null
    const invoiceProvider = invoice.payment_provider
    const selectedProvider = urlProvider || invoiceProvider || 'payfast'

    const formatDate = (dateString: string) => {
        if (!dateString) return "--/--/----"
        try {
            return format(parseISO(dateString), "MMMM do, yyyy")
        } catch (e) {
            return dateString
        }
    }

    return (
        <div className="min-h-screen bg-[#060606] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-white selection:text-black">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
                    <div>
                        <h1 className="text-5xl font-serif text-white italic tracking-tight mb-3">Invoice Payment</h1>
                        <div className="flex items-center gap-3 text-neutral-500 group cursor-default">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <span className="font-mono tracking-wider text-sm">{invoice.invoice_number}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-lg text-xs gap-2"
                                onClick={() => window.print()}
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-lg text-xs gap-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href)
                                    toast.success("Link copied to clipboard")
                                }}
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                Share
                            </Button>
                        </div>
                        {isPaid ? (
                            <div className="bg-[#0f2a1e] border border-emerald-500/20 rounded-full px-4 py-1.5 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Invoice Settled
                            </div>
                        ) : (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                                <AlertCircle className="h-3 w-3" />
                                Payment Due
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Invoice Preview Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className={cn(
                            "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border transition-all duration-500 relative group overflow-hidden",
                            mode === "light" ? "bg-white text-black border-neutral-200" : "bg-[#0c0c0c] text-white border-white/5",
                            template === "Classic" && "p-12 md:p-20",
                            template === "Minimal" && "p-12 md:p-24",
                            template === "Modern" && "p-0"
                        )}>
                            {template === "Modern" && (
                                <div className="h-2 bg-linear-to-r from-violet-600 via-fuchsia-500 to-amber-400 w-full mb-12" />
                            )}

                            <div className={cn(template === "Modern" && "p-12 md:p-20")}>
                                {/* Header: Logo & Title */}
                                <div className="flex justify-between items-start mb-24">
                                    <div className={cn(
                                        "w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden border shadow-sm",
                                        logoBg === "light" ? "bg-white border-neutral-100" : "bg-[#0c0c0c] border-white/10"
                                    )}>
                                        {invoice.logo_url ? (
                                            <img src={invoice.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="invoice-font-title font-black text-3xl text-black">E.</div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-6xl invoice-font-title font-bold mb-3 tracking-tighter">Invoice</h1>
                                        <p className={cn(
                                            "invoice-font-id text-xs tracking-[0.3em] uppercase opacity-40",
                                            mode === "light" ? "text-neutral-600" : "text-white/40"
                                        )}>{invoice.invoice_number}</p>
                                    </div>
                                </div>

                                {/* From / To Section */}
                                <div className={cn(
                                    "grid grid-cols-2 gap-20 mb-12 pb-12 border-b",
                                    mode === "light" ? "border-neutral-100" : "border-white/5"
                                )}>
                                    <div className="flex flex-col gap-4">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-[0.2em]",
                                            mode === "light" ? "text-neutral-600" : "text-white/50"
                                        )}>From</span>
                                        <div className="space-y-1 invoice-font-from">
                                            <p className="text-lg font-bold">Illumi Professional</p>
                                            {invoice.from_email && <p className="text-xs font-medium opacity-60">{invoice.from_email}</p>}
                                            <p className={cn(
                                                "text-xs leading-relaxed",
                                                mode === "light" ? "text-neutral-500" : "text-white/40"
                                            )}>
                                                123 Business Avenue<br />
                                                Cape Town, 8001
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 text-right">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-[0.2em]",
                                            mode === "light" ? "text-neutral-600" : "text-white/50"
                                        )}>To</span>
                                        <div className="space-y-1 invoice-font-client">
                                            <p className="text-lg font-bold opacity-90">{invoice.customers?.name || "Valued Customer"}</p>
                                            {invoice.customers?.email && <p className="text-xs font-medium opacity-60">{invoice.customers?.email}</p>}
                                            <p className={cn(
                                                "text-xs leading-relaxed whitespace-pre-wrap",
                                                mode === "light" ? "text-neutral-500" : "text-white/40"
                                            )}>
                                                {invoice.customers?.address || "Customer Address Details"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates Section */}
                                <div className="flex gap-16 mb-12">
                                    <div className="flex flex-col gap-1">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest",
                                            mode === "light" ? "text-neutral-600" : "text-white/50"
                                        )}>Issue Date</span>
                                        <p className="invoice-font-date font-semibold text-sm">
                                            {formatDate(invoice.issue_date)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest",
                                            mode === "light" ? "text-neutral-600" : "text-white/50"
                                        )}>Due Date</span>
                                        <p className="invoice-font-date font-semibold text-sm">
                                            {formatDate(invoice.due_date)}
                                        </p>
                                    </div>
                                </div>

                                {/* Table */}
                                <table className="w-full mb-12">
                                    <thead className={cn(
                                        "border-b-2 text-[10px] font-bold uppercase tracking-widest",
                                        mode === "light" ? "border-black" : "border-white"
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
                                        mode === "light" ? "divide-neutral-100" : "divide-white/5"
                                    )}>
                                        {invoice.invoice_items?.map((item: any, i: number) => (
                                            <tr key={i} className="text-sm">
                                                <td className="py-6 font-medium invoice-font-item">{item.description}</td>
                                                <td className="py-6 text-right invoice-font-amount">{item.unit_price.toLocaleString('en-ZA', { style: 'currency', currency: invoice.currency })}</td>
                                                <td className="py-6 text-right invoice-font-amount">{item.quantity}</td>
                                                <td className="py-6 text-right font-bold invoice-font-amount pr-6">{(item.unit_price * item.quantity).toLocaleString('en-ZA', { style: 'currency', currency: invoice.currency })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Footer Summary */}
                                <div className={cn(
                                    "grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t",
                                    mode === "light" ? "border-black/10" : "border-white/5"
                                )}>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-[0.2em]",
                                                mode === "light" ? "text-neutral-600" : "text-white/50"
                                            )}>Note</span>
                                            <p className={cn(
                                                "text-sm invoice-font-notes leading-relaxed opacity-60",
                                                mode === "light" ? "text-black/60" : "text-white/60"
                                            )}>
                                                {invoice.notes?.trim() || ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm opacity-60">
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Subtotal</span>
                                            <span className="invoice-font-amount">{(invoice.total / (1 + (invoice.vat_rate || 0) / 100)).toLocaleString('en-ZA', { style: 'currency', currency: invoice.currency })}</span>
                                        </div>
                                        {invoice.vat_amount > 0 && (
                                            <div className="flex justify-between items-center text-sm opacity-60">
                                                <span className="text-[10px] uppercase font-bold tracking-widest">VAT ({invoice.vat_rate}%)</span>
                                                <span className="invoice-font-amount">{invoice.vat_amount.toLocaleString('en-ZA', { style: 'currency', currency: invoice.currency })}</span>
                                            </div>
                                        )}
                                        <div className={cn(
                                            "pt-10 border-t flex justify-between items-end",
                                            mode === "light" ? "border-black/5" : "border-white/10"
                                        )}>
                                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-20 mb-2">Total Due</span>
                                            <span className="text-6xl invoice-font-amount font-bold tracking-tighter">
                                                {invoice.total.toLocaleString('en-ZA', { style: 'currency', currency: invoice.currency })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Sidebar */}
                    <div className="lg:col-span-4 space-y-8 sticky top-8">
                        <Card className="bg-[#121212] border-white/5 rounded-none overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 border-b border-white/5">
                                <CardTitle className="font-serif italic text-3xl text-white">Payment Method</CardTitle>
                                <CardDescription className="text-neutral-500 mt-2 font-medium">Select your preferred payment option below to settle this invoice.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Amount to Pay</span>
                                        <span className="text-2xl font-serif italic text-white">{invoice.total.toLocaleString('en-ZA', { style: 'currency', currency: invoice.currency })}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">PayGate</span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-white/70">{selectedProvider}</span>
                                    </div>
                                    <div className="flex justify-center py-6 border-y border-white/5">
                                        <Receipt className="h-12 w-12 text-white/5" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-0">
                                {isPaid ? (
                                    <div className="w-full h-24 bg-[#00e676] flex items-center justify-center text-black font-serif italic text-2xl tracking-tight transition-all">
                                        Invoice Settled
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full h-24 bg-[#000000] text-white hover:bg-neutral-800 rounded-none text-xl font-serif italic transition-all group border-none"
                                        disabled={isSimulating}
                                        onClick={handlePayment}
                                    >
                                        {isSimulating ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <span>Pay Now</span>
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>

                        {!isPaid && (
                            <div className="p-8 bg-[#111111] border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all shrink-0">
                                        <CreditCard className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white mb-2">Secure Gateway</p>
                                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                                            Your transaction is processed via encrypted 256-bit SSL security. We do not store your credit card details.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Aesthetic Footer */}
                <div className="text-center pt-24 border-t border-white/5 opacity-40">
                    <a
                        href="https://illumi.co.za"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all duration-500 group"
                    >
                        POWERED BY <span className="font-bold group-hover:text-white transition-colors">ILLUMI</span>
                    </a>
                </div>
            </div>
        </div>
    )
}
