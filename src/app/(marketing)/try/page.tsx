"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    IconPlus,
    IconTrash,
    IconFileInvoice,
    IconArrowRight,
    IconDownload,
    IconEye,
    IconCheck,
} from "@tabler/icons-react"

interface LineItem {
    id: string
    description: string
    quantity: number
    rate: number
}

function generateId() {
    return Math.random().toString(36).substring(2, 9)
}

export default function TryInvoicePage() {
    const [businessName, setBusinessName] = useState("")
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [invoiceNumber, setInvoiceNumber] = useState("INV-001")
    const [invoiceDate, setInvoiceDate] = useState(
        new Date().toISOString().split("T")[0]
    )
    const [dueDate, setDueDate] = useState(() => {
        const d = new Date()
        d.setDate(d.getDate() + 14)
        return d.toISOString().split("T")[0]
    })
    const [includeVat, setIncludeVat] = useState(false)
    const [vatRate, setVatRate] = useState(15)
    const [items, setItems] = useState<LineItem[]>([
        { id: generateId(), description: "", quantity: 1, rate: 0 },
    ])
    const [showPreview, setShowPreview] = useState(false)
    const [showSignupPrompt, setShowSignupPrompt] = useState(false)

    const addItem = () => {
        setItems([...items, { id: generateId(), description: "", quantity: 1, rate: 0 }])
    }

    const removeItem = (id: string) => {
        if (items.length === 1) return
        setItems(items.filter((i) => i.id !== id))
    }

    const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
        setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
    }

    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0)
    const vatAmount = includeVat ? subtotal * (vatRate / 100) : 0
    const total = subtotal + vatAmount

    const formatCurrency = (amount: number) =>
        `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    const handleSaveOrSend = () => {
        setShowSignupPrompt(true)
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Top bar */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconFileInvoice className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground text-sm">Create Invoice</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">• No account needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-xs"
                        >
                            <IconEye className="w-3.5 h-3.5 mr-1" />
                            {showPreview ? "Edit" : "Preview"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSaveOrSend}
                            className="text-xs bg-primary text-primary-foreground"
                        >
                            Save & Send
                            <IconArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Signup prompt modal */}
            {showSignupPrompt && (
                <div className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <IconCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Your invoice looks great!</h2>
                        <p className="text-muted-foreground mb-6">
                            Create a free account to save this invoice, send it to your client, and get paid online.
                        </p>
                        <div className="space-y-3">
                            <Link href="/login" className="block">
                                <Button className="w-full h-12 bg-primary text-primary-foreground text-sm font-medium">
                                    Create Free Account & Send Invoice
                                </Button>
                            </Link>
                            <button
                                onClick={() => setShowSignupPrompt(false)}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Keep editing
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                            Free forever • No credit card • Takes 10 seconds with Google
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {!showPreview ? (
                    /* ─── EDITOR VIEW ─── */
                    <div className="space-y-8">
                        {/* Business & Client Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 bg-card border border-border rounded-xl p-6">
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">From (Your Business)</h3>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Business Name</Label>
                                    <Input
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="Your Business Name"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 bg-card border border-border rounded-xl p-6">
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Bill To</h3>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Client Name</Label>
                                    <Input
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Client or Company Name"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Client Email</Label>
                                    <Input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="client@example.com"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card border border-border rounded-xl p-6">
                            <div>
                                <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                                <Input
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Invoice Date</Label>
                                <Input
                                    type="date"
                                    value={invoiceDate}
                                    onChange={(e) => setInvoiceDate(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Due Date</Label>
                                <Input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Line Items</h3>
                            <div className="space-y-3">
                                {/* Header */}
                                <div className="hidden sm:grid grid-cols-12 gap-3 text-xs text-muted-foreground font-medium px-1">
                                    <div className="col-span-5">Description</div>
                                    <div className="col-span-2">Qty</div>
                                    <div className="col-span-2">Rate (R)</div>
                                    <div className="col-span-2 text-right">Amount</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                        <div className="sm:col-span-5">
                                            <Input
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                                placeholder="Description of service or product"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                                                placeholder="Qty"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                value={item.rate || ""}
                                                onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="sm:col-span-2 text-right text-sm font-medium text-foreground">
                                            {formatCurrency(item.quantity * item.rate)}
                                        </div>
                                        <div className="sm:col-span-1 flex justify-end">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                disabled={items.length === 1}
                                            >
                                                <IconTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addItem}
                                className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                <IconPlus className="w-4 h-4" />
                                Add Line Item
                            </button>
                        </div>

                        {/* VAT Toggle + Totals */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-foreground font-medium">Include VAT (15%)</label>
                                </div>
                                <button
                                    onClick={() => setIncludeVat(!includeVat)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        includeVat ? "bg-primary" : "bg-muted"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            includeVat ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-border">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="text-foreground">{formatCurrency(subtotal)}</span>
                                </div>
                                {includeVat && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">VAT ({vatRate}%)</span>
                                        <span className="text-foreground">{formatCurrency(vatAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-foreground">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center py-4">
                            <Button
                                size="lg"
                                onClick={() => setShowPreview(true)}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <IconEye className="w-4 h-4 mr-2" />
                                Preview Invoice
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleSaveOrSend}
                                className="w-full sm:w-auto bg-primary text-primary-foreground"
                            >
                                Save & Send Invoice
                                <IconArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* ─── PREVIEW VIEW ─── */
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
                            {/* Invoice Header */}
                            <div className="p-8 pb-0">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">
                                            {businessName || "Your Business Name"}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">INVOICE</div>
                                        <div className="text-sm text-muted-foreground mt-1">{invoiceNumber}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bill To</div>
                                        <div className="text-sm font-medium text-foreground">{clientName || "Client Name"}</div>
                                        <div className="text-sm text-muted-foreground">{clientEmail || "client@example.com"}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground">Invoice Date: {invoiceDate}</div>
                                        <div className="text-xs text-muted-foreground">Due Date: {dueDate}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <div className="px-8">
                                <div className="border border-border rounded-xl overflow-hidden">
                                    <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        <div className="col-span-5">Description</div>
                                        <div className="col-span-2 text-center">Qty</div>
                                        <div className="col-span-2 text-right">Rate</div>
                                        <div className="col-span-3 text-right">Amount</div>
                                    </div>
                                    {items.filter(i => i.description || i.rate > 0).map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-t border-border text-sm">
                                            <div className="col-span-5 text-foreground">{item.description || "—"}</div>
                                            <div className="col-span-2 text-center text-muted-foreground">{item.quantity}</div>
                                            <div className="col-span-2 text-right text-muted-foreground">{formatCurrency(item.rate)}</div>
                                            <div className="col-span-3 text-right text-foreground font-medium">{formatCurrency(item.quantity * item.rate)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="p-8">
                                <div className="ml-auto max-w-xs space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="text-foreground">{formatCurrency(subtotal)}</span>
                                    </div>
                                    {includeVat && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">VAT ({vatRate}%)</span>
                                            <span className="text-foreground">{formatCurrency(vatAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-border">
                                        <span className="text-foreground">Total</span>
                                        <span className="text-primary">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview CTA */}
                        <div className="text-center mt-8 space-y-4">
                            <p className="text-muted-foreground text-sm">
                                Like what you see? Save this invoice and send it to your client.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setShowPreview(false)}
                                >
                                    ← Back to Editor
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={handleSaveOrSend}
                                    className="bg-primary text-primary-foreground"
                                >
                                    Save & Send Invoice
                                    <IconArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom trust strip */}
                <div className="mt-12 pt-8 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground mb-4">
                        Trusted by 2,500+ South African businesses
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                        <span>✓ Free forever</span>
                        <span>✓ ZAR currency</span>
                        <span>✓ VAT-compliant</span>
                        <span>✓ PayFast & Yoco payments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
