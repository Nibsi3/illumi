import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "What is an Invoice? Complete Guide for South African Businesses | Illumi",
    description: "Learn what an invoice is, why it's important, and how to create one. Complete guide covering invoice types, legal requirements, and best practices for South African businesses.",
    keywords: [
        "what is an invoice",
        "invoice definition",
        "invoice explained",
        "how to invoice",
        "invoice guide South Africa",
        "tax invoice requirements",
        "invoice vs receipt",
        "types of invoices",
    ],
    alternates: {
        canonical: "/what-is-an-invoice",
    },
}

const invoiceElements = [
    { element: "Invoice Number", description: "Unique sequential identifier for tracking" },
    { element: "Invoice Date", description: "Date the invoice was issued" },
    { element: "Due Date", description: "When payment is expected" },
    { element: "Your Business Details", description: "Name, address, contact, VAT number" },
    { element: "Client Details", description: "Customer name and billing address" },
    { element: "Line Items", description: "Description, quantity, and price of goods/services" },
    { element: "Subtotal", description: "Sum of all line items before tax" },
    { element: "VAT Amount", description: "15% VAT calculated on subtotal" },
    { element: "Total Amount Due", description: "Final amount including VAT" },
    { element: "Payment Terms", description: "How and when to pay" },
    { element: "Bank Details", description: "Account information for EFT payments" },
]

const invoiceTypes = [
    {
        type: "Standard Invoice",
        description: "The most common type. Issued after goods are delivered or services rendered.",
    },
    {
        type: "Pro Forma Invoice",
        description: "A preliminary invoice sent before work begins. Acts as a quote or estimate.",
    },
    {
        type: "Tax Invoice",
        description: "Required for VAT-registered businesses. Must include VAT number and breakdown.",
    },
    {
        type: "Credit Note",
        description: "Issued to reduce the amount owed, typically for returns or corrections.",
    },
    {
        type: "Recurring Invoice",
        description: "Automatically generated at regular intervals for ongoing services.",
    },
    {
        type: "Final Invoice",
        description: "Issued at project completion, often following progress invoices.",
    },
]

export default function WhatIsAnInvoicePage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconFileInvoice className="h-4 w-4" />
                            Guide
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            What is an Invoice?
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            An invoice is a commercial document that itemizes a transaction between a buyer and seller. 
                            It serves as a formal request for payment and a record of the sale.
                        </p>
                    </div>
                </div>
            </section>

            {/* Definition */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">Invoice Definition</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            An <strong className="text-foreground">invoice</strong> is a document sent by a seller to a buyer that lists the products or services provided, 
                            their quantities, prices, and the total amount due. It serves as:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span><strong>A payment request</strong> - Tells the customer how much they owe</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span><strong>A legal record</strong> - Documents the transaction for both parties</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span><strong>A tax document</strong> - Required for VAT claims and SARS compliance</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span><strong>An accounting record</strong> - Tracks income and accounts receivable</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* What to Include */}
            <section className="py-16 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">What to Include on an Invoice</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {invoiceElements.map((item) => (
                            <div key={item.element} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-semibold">{item.element}</div>
                                    <div className="text-sm text-muted-foreground">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Types */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Types of Invoices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {invoiceTypes.map((item) => (
                            <div key={item.type} className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-semibold mb-2">{item.type}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SA Requirements */}
            <section className="py-16 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">South African Tax Invoice Requirements</h2>
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <p className="text-muted-foreground mb-6">
                            If you're VAT registered in South Africa, your invoices must meet SARS requirements:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span>Display "Tax Invoice" prominently</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span>Include your VAT registration number</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span>Show VAT amount separately (15%)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span>Include customer's name and address</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span>Use sequential invoice numbers</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Create Your First Invoice?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi makes invoicing simple. Create professional, SARS-compliant invoices in minutes.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Free Invoice
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
