"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, Printer, Share2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSettings } from "@/lib/settings-context"

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
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!invoice) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
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
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
            {/* Action Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-black/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="text-neutral-500 hover:text-white transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Preview</span>
                        <span className="text-sm font-medium">{invoice.invoice_number}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-white/10 bg-white/5 hover:bg-white/10">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button variant="outline" className="h-10 border-white/10 bg-white/5 hover:bg-white/10" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button className="h-10 bg-white text-black hover:bg-neutral-200 font-semibold px-6">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </header>

            {/* Invoice Paper Layout */}
            <main className="max-w-5xl mx-auto mt-12 px-6">
                {(() => {
                    const logoBg = (invoice.invoice_mode || 'dark') as 'light' | 'dark'
                    const logoContainerClass = logoBg === 'light' ? 'bg-[#0c0c0c] border-white/10' : 'bg-[#0c0c0c] border-white/10'
                    const logoTextClass = logoBg === 'light' ? 'text-white' : 'text-white'
                    return (
                <div className="bg-white text-black rounded-lg shadow-2xl p-20 min-h-[1120px] mx-auto overflow-hidden printable-area">
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
                            <p className="text-neutral-400 invoice-font-id text-sm tracking-widest">#{invoice.invoice_number}</p>
                        </div>
                    </div>

                    {/* From / To */}
                    <div className="grid grid-cols-2 gap-20 mb-16 pb-16 border-b border-neutral-100">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">From</span>
                            <div className="space-y-1 invoice-font-from">
                                <p className="text-lg font-bold">My Professional Co.</p>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    123 Business Avenue<br />
                                    Innovation District<br />
                                    Cape Town, 8001<br />
                                    South Africa
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 text-right">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">To</span>
                            <div className="space-y-1 invoice-font-client">
                                <p className="text-lg font-bold">{invoice.customer?.name || 'Customer'}</p>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    {invoice.customer?.email}<br />
                                    {invoice.customer?.address || ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="flex gap-16 mb-16">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Issue Date</span>
                            <p className="invoice-font-date font-semibold text-sm">{formatDate(invoice.issue_date)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Due Date</span>
                            <p className="invoice-font-date font-semibold text-sm text-red-500">{invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}</p>
                        </div>
                    </div>

                    {/* Line Items */}
                    <table className="w-full mb-16">
                        <thead className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest">
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
                                    <td colSpan={4} className="py-6 text-center text-neutral-400">No items</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Footer: Notes & Totals */}
                    <div className="flex justify-between items-start pt-12 border-t-2 border-black">
                        <div className="w-1/2 flex flex-col gap-8">
                            {invoice.notes && (
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Note</span>
                                <p className="text-xs text-neutral-500 leading-relaxed invoice-font-notes">
                                    {invoice.notes}
                                </p>
                            </div>
                            )}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Payment Details</span>
                                <p className="text-[11px] text-neutral-500 leading-relaxed font-mono">
                                    BANK: FNB<br />
                                    ACCOUNT: Professional Branding<br />
                                    NUMBER: 123456789<br />
                                    CODE: 250655
                                </p>
                            </div>
                        </div>

                        <div className="w-1/3 flex flex-col gap-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Subtotal</span>
                                <span className="invoice-font-amount">{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Tax ({invoice.tax_rate || 0}%)</span>
                                <span className="invoice-font-amount">{formatCurrency(invoice.tax_amount || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-4xl invoice-font-amount font-bold mt-6 pt-6 border-t border-neutral-100">
                                <span className="text-neutral-400 text-2xl">Total</span>
                                <span>{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-40 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-300">www.illumi.co.za</p>
                    </div>
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
