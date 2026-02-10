"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Download, CreditCard, ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Invoice = {
    id: string
    invoice_number: string
    issue_date: string
    due_date: string | null
    currency: string
    subtotal: number
    tax_amount: number
    total: number
    notes: string | null
    status: string
    payment_provider?: string | null
    bank_name?: string | null
    account_name?: string | null
    account_number?: string | null
    branch_code?: string | null
    customer?: {
        name: string
        email: string
    }
}

type InvoiceItem = {
    id: string
    description: string
    quantity: number
    unit_price: number
    discount_rate?: number | null
    total: number
}

export default function PublicInvoicePage() {
    const params = useParams()
    const invoiceId = params.id as string
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [items, setItems] = useState<InvoiceItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                // Use the public API route to fetch invoice data securely
                const res = await fetch(`/api/invoices/public?id=${encodeURIComponent(invoiceId)}`)
                const json = await res.json()

                if (!res.ok || !json.success) {
                    throw new Error(json.error || "Invoice not found")
                }

                const invoiceData = json.invoice
                setInvoice({
                    ...invoiceData,
                    customer: invoiceData.customers
                })
                setItems(invoiceData.invoice_items || [])

                // Mark as viewed if status is 'sent' (via separate API call)
                if (invoiceData.status === 'sent') {
                    fetch('/api/invoices/mark-viewed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ invoiceId: invoiceData.id })
                    }).catch(() => {})
                }
            } catch (err: any) {
                setError(err.message || "Failed to load invoice")
            } finally {
                setIsLoading(false)
            }
        }

        if (invoiceId) {
            fetchInvoice()
        }
    }, [invoiceId])

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
    }

    const formatCurrency = (amount: number, currency: string = 'ZAR') => {
        return `${currency} ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/5">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-muted/5 p-6">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Invoice Not Found</h1>
                <p className="text-muted-foreground">{error || "This invoice does not exist or has been removed."}</p>
            </div>
        )
    }

    const isBankingMode = !invoice.payment_provider

    const senderName = (invoice as any)?.workspace?.name || 'Business'
    const senderLogo = (invoice as any)?.logo_url || (invoice as any)?.workspace?.logo_url || null

    return (
        <div className="min-h-screen bg-muted/5 font-sans pb-20">
            <div className="bg-background border-b py-4">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {senderLogo ? (
                            <img src={senderLogo} alt={senderName} className="w-8 h-8 object-contain" />
                        ) : (
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        )}
                        <span className="font-serif text-lg font-bold tracking-tight">{senderName}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 shrink-0">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Secure Invoice Delivery
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 sm:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
                        <div className="h-2 w-full bg-primary" />
                        <CardContent className="p-6 sm:p-12">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <h2 className="text-4xl font-serif font-bold tracking-tight uppercase">Invoice</h2>
                                    <p className="text-muted-foreground mt-2">{invoice.invoice_number}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Date</div>
                                    <div className="text-lg font-medium">{formatDate(invoice.issue_date)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
                                <div>
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Billed To</div>
                                    <div className="text-lg font-bold">{invoice.customer?.name || 'Customer'}</div>
                                    <div className="text-muted-foreground">{invoice.customer?.email || ''}</div>
                                </div>
                                <div className="sm:text-right">
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Total Due</div>
                                    <div className="text-4xl font-serif font-bold text-primary">
                                        {formatCurrency(invoice.total, invoice.currency)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <div className="col-span-7">Description</div>
                                    <div className="col-span-1 text-right">Qty</div>
                                    <div className="col-span-2 text-right">Disc %</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>
                                {items.map((item, i) => (
                                    <div key={item.id || i} className="rounded-2xl border border-border/60 bg-background/40 p-4 sm:p-0 sm:border-0 sm:bg-transparent">
                                        <div className="sm:grid sm:grid-cols-12 sm:gap-4 text-sm items-center">
                                            <div className="sm:col-span-7 font-medium wrap-break-word">{item.description}</div>
                                            <div className="mt-2 sm:mt-0 sm:col-span-1 sm:text-right text-muted-foreground">Qty: {item.quantity}</div>
                                            <div className="mt-1 sm:mt-0 sm:col-span-2 sm:text-right text-muted-foreground">
                                                Disc: {(Number(item.discount_rate) || 0).toLocaleString('en-ZA', { maximumFractionDigits: 2 })}%
                                            </div>
                                            <div className="mt-2 sm:mt-0 sm:col-span-2 sm:text-right font-mono">
                                                {formatCurrency(Number(item.total) || (item.unit_price * item.quantity), invoice.currency)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t flex justify-end">
                                <div className="w-full max-w-[240px] space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                                    </div>
                                    {invoice.tax_amount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax</span>
                                            <span className="font-medium">{formatCurrency(invoice.tax_amount, invoice.currency)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Due</span>
                                        <span className="text-primary">{formatCurrency(invoice.total, invoice.currency)}</span>
                                    </div>
                                </div>
                            </div>

                            {invoice.notes && (
                                <div className="mt-16 pt-8 border-t">
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">Notes</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{invoice.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardHeader className="bg-primary text-primary-foreground p-6">
                            <CardTitle className="text-xl font-serif">Secure Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-2xl">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    invoice.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                )}>
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-bold capitalize">{invoice.status === 'paid' ? 'Paid' : 'Outstanding'}</div>
                                    <div className="text-muted-foreground text-xs">
                                        {invoice.status === 'paid' ? 'Thank you for your payment' : 'Awaiting payment'}
                                    </div>
                                </div>
                            </div>

                            {invoice.status !== 'paid' && (
                                <div className="space-y-3">
                                    {isBankingMode ? (
                                        <div className="space-y-3">
                                            {(invoice.bank_name || invoice.account_name || invoice.account_number || invoice.branch_code) ? (
                                                <div className="p-4 bg-muted/20 rounded-2xl">
                                                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Payment Details</div>
                                                    <div className="text-sm text-muted-foreground leading-relaxed font-medium">
                                                        {invoice.bank_name ? <>Bank: {invoice.bank_name}<br /></> : null}
                                                        {invoice.account_name ? <>Account: {invoice.account_name}<br /></> : null}
                                                        {invoice.account_number ? <>Number: {invoice.account_number}<br /></> : null}
                                                        {invoice.branch_code ? <>Code: {invoice.branch_code}</> : null}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    No banking details were provided for this invoice.
                                                </div>
                                            )}
                                            <div className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                                                Manual payment required
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full h-12 rounded-full font-bold text-base bg-blue-600 hover:bg-blue-700"
                                            onClick={() => {
                                                window.location.href = `/pay/${invoice.id}${invoice.payment_provider ? `?provider=${invoice.payment_provider}` : ''}`
                                            }}
                                        >
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Pay Now
                                        </Button>
                                    )}
                                </div>
                            )}

                            <Button variant="outline" className="w-full h-12 rounded-full font-semibold">
                                <Download className="mr-2 h-5 w-5" />
                                Download PDF
                            </Button>

                            <div className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                                Protected by Illumi Secure Pay
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none bg-muted/10 rounded-3xl p-6">
                        <h4 className="font-bold text-sm mb-4">Need help?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            If you have any questions regarding this invoice, please contact the sender directly.
                        </p>
                        <Button variant="ghost" className="w-full justify-start px-0 text-primary font-bold hover:bg-transparent">
                            Contact Support
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
