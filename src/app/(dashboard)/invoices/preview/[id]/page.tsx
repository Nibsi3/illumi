"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, Printer, Share2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSettings } from "@/lib/settings-context"
import { useSubscription } from "@/lib/subscription/hooks"

interface InvoiceItem {
    id: string
    description: string
    quantity: number
    unit_price: number
    total: number
}

interface Invoice {
    id: string
    invoice_number: string
    status: string
    issue_date: string
    due_date: string
    subtotal: number
    tax_rate: number
    tax_amount: number
    total: number
    notes: string
    terms: string
    currency: string
    logo_url?: string | null
    company_website?: string | null
    bank_name?: string | null
    account_name?: string | null
    account_number?: string | null
    branch_code?: string | null
    hide_illumi_branding?: boolean | null
    invoice_mode?: "light" | "dark" | null
    customer: {
        name: string
        email: string
        address: string
    } | null
    items: InvoiceItem[]
}

export default function InvoicePreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const supabase = createClient()
    const { currency } = useSettings()
    const { isPro } = useSubscription()
    const illumiLogoSrc = '/midday-logo.png'
    
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchInvoice() {
            try {
                const { data: invoiceData, error: invoiceError } = await supabase
                    .from('invoices')
                    .select(`
                        *,
                        customer:customers(name, email, address)
                    `)
                    .eq('id', id)
                    .single()

                if (invoiceError) throw invoiceError

                const { data: itemsData } = await supabase
                    .from('invoice_items')
                    .select('*')
                    .eq('invoice_id', id)
                    .order('sort_order')

                setInvoice({
                    ...invoiceData,
                    items: itemsData || []
                })
            } catch (error) {
                console.error('Error fetching invoice:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInvoice()
    }, [id, supabase])

    if (loading) {
        return (
            <div className="min-h-screen bg-card text-foreground flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!invoice) {
        return (
            <div className="min-h-screen bg-card text-foreground flex items-center justify-center">
                <p>Invoice not found</p>
            </div>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', { 
            style: 'currency', 
            currency: invoice.currency || currency || 'ZAR' 
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-card text-foreground font-sans pb-20">
            {/* Action Header */}
            <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview</span>
                        <span className="text-sm font-medium">{invoice.invoice_number}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Button variant="outline" className="h-10 border-border bg-muted hover:bg-accent px-3 sm:px-4">
                        <Share2 className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button variant="outline" className="h-10 border-border bg-muted hover:bg-accent px-3 sm:px-4" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-3 sm:px-6">
                        <Download className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                </div>
            </header>

            {/* Invoice Paper Layout */}
            <main className="max-w-5xl mx-auto mt-12 px-6">
                {(() => {
                    const logoBg = (invoice.invoice_mode || 'dark') as 'light' | 'dark'
                    const logoContainerClass = logoBg === 'light' ? 'bg-card border-border' : 'bg-card border-border'
                    const logoTextClass = logoBg === 'light' ? 'text-foreground' : 'text-foreground'
                    return (
                <div className="bg-primary text-primary-foreground rounded-lg shadow-2xl p-6 sm:p-10 md:p-20 min-h-[1120px] mx-auto overflow-hidden printable-area">
                    {/* Header: Logo & Title */}
                    <div className="flex justify-between items-start mb-20">
                        <div className={"w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden border " + logoContainerClass}>
                            {invoice.logo_url ? (
                                <img src={invoice.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <div className={"invoice-font-title font-black text-2xl " + logoTextClass}>E.</div>
                            )}
                        </div>
                        <div className="text-right">
                            <h1 className="text-5xl invoice-font-title font-bold mb-2">Invoice</h1>
                            <p className="text-muted-foreground invoice-font-id text-sm tracking-widest">#{invoice.invoice_number}</p>
                        </div>
                    </div>

                    {/* From / To */}
                    <div className="grid grid-cols-2 gap-20 mb-16 pb-16 border-b border-neutral-100">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">From</span>
                            <div className="space-y-1 invoice-font-from">
                                <p className="text-lg font-bold">My Professional Co.</p>
                                {invoice.company_website && (
                                    <a
                                        href={invoice.company_website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-muted-foreground leading-relaxed underline underline-offset-4"
                                    >
                                        {invoice.company_website}
                                    </a>
                                )}
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    123 Business Avenue<br />
                                    Innovation District<br />
                                    Cape Town, 8001<br />
                                    South Africa
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 text-right">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">To</span>
                            <div className="space-y-1 invoice-font-client">
                                <p className="text-lg font-bold">{invoice.customer?.name || 'Customer'}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {invoice.customer?.email}<br />
                                    {invoice.customer?.address || ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="flex gap-16 mb-16">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue Date</span>
                            <p className="invoice-font-date font-semibold text-sm">{formatDate(invoice.issue_date)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Due Date</span>
                            <p className="invoice-font-date font-semibold text-sm text-red-500">{invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}</p>
                        </div>
                    </div>

                    {/* Line Items */}
                    <table className="w-full mb-16">
                        <thead className="border-b-2 border-foreground text-[10px] font-bold uppercase tracking-widest">
                            <tr>
                                <th className="py-4 text-left">Description</th>
                                <th className="py-4 text-right">Price</th>
                                <th className="py-4 text-right">Qty</th>
                                <th className="py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {invoice.items.map((item) => (
                                <tr key={item.id} className="text-sm">
                                    <td className="py-6 font-medium invoice-font-item">{item.description}</td>
                                    <td className="py-6 text-right invoice-font-amount">{formatCurrency(item.unit_price)}</td>
                                    <td className="py-6 text-right">{item.quantity}</td>
                                    <td className="py-6 text-right font-bold invoice-font-amount">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                            {invoice.items.length === 0 && (
                                <tr className="text-sm">
                                    <td colSpan={4} className="py-6 text-center text-muted-foreground">No items</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Footer: Notes & Totals */}
                    <div className="flex justify-between items-start pt-12 border-t-2 border-foreground">
                        <div className="w-1/2 flex flex-col gap-8">
                            {invoice.notes && (
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Note</span>
                                <p className="text-xs text-muted-foreground leading-relaxed invoice-font-notes">
                                    {invoice.notes}
                                </p>
                            </div>
                            )}

                            {!(Boolean(isPro) && Boolean(invoice.hide_illumi_branding)) && Boolean(isPro) && (
                                <div>
                                    <img src={illumiLogoSrc} alt="Illumi" className="h-5 w-5 object-contain opacity-40" />
                                </div>
                            )}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payment Details</span>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
                                    {invoice.bank_name ? <>BANK: {invoice.bank_name}<br /></> : null}
                                    {invoice.account_name ? <>ACCOUNT: {invoice.account_name}<br /></> : null}
                                    {invoice.account_number ? <>NUMBER: {invoice.account_number}<br /></> : null}
                                    {invoice.branch_code ? <>CODE: {invoice.branch_code}</> : null}
                                </p>
                            </div>
                        </div>

                        <div className="w-1/3 flex flex-col gap-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="invoice-font-amount">{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            {(invoice.tax_rate > 0 || invoice.tax_amount > 0) && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax ({invoice.tax_rate || 0}%)</span>
                                    <span className="invoice-font-amount">{formatCurrency(invoice.tax_amount || 0)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-4xl invoice-font-amount font-bold mt-6 pt-6 border-t border-neutral-100">
                                <span className="text-muted-foreground text-2xl">Total</span>
                                <span>{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    {!(Boolean(isPro) && Boolean(invoice.hide_illumi_branding)) && !Boolean(isPro) && (
                        <div className="flex justify-center pt-10">
                            <a
                                href="https://illumi.co.za"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 opacity-40 hover:opacity-60"
                            >
                                <img src={illumiLogoSrc} alt="Illumi" className="h-5 w-5 object-contain" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] underline underline-offset-4">
                                    Made with Illumi Invoice
                                </span>
                            </a>
                        </div>
                    )}

                </div>
                    )
                })()}
            </main>

            <style jsx global>{`
                @media print {
                    header { display: none !important; }
                    body { background: white !important; }
                    .printable-area { 
                        box-shadow: none !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    )
}
