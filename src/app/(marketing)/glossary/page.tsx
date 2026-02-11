import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconBook,
    IconArrowRight,
    IconSearch,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Glossary | Invoice Terms & Definitions | Illumi",
    description: "Complete glossary of invoicing terms and definitions. Learn about VAT, payment terms, invoice types, and accounting terminology for South African businesses.",
    keywords: [
        "invoicing glossary",
        "invoice terms",
        "invoicing definitions",
        "VAT terminology",
        "accounting terms South Africa",
        "business invoice glossary",
        "payment terms glossary",
        "invoice terminology",
        "billing terms explained",
    ],
    openGraph: {
        title: "Invoicing Glossary | Illumi",
        description: "Complete glossary of invoicing terms and definitions for South African businesses.",
        type: "website",
    },
    alternates: {
        canonical: "/glossary",
    },
}

const glossaryTerms = [
    {
        term: "Accounts Payable (AP)",
        definition: "Money owed by a business to its suppliers or vendors for goods and services received but not yet paid for. Appears as a liability on the balance sheet.",
    },
    {
        term: "Accounts Receivable (AR)",
        definition: "Money owed to a business by its customers for goods or services delivered but not yet paid for. Appears as an asset on the balance sheet.",
    },
    {
        term: "Credit Note",
        definition: "A document issued by a seller to a buyer reducing the amount owed. Used for returns, overcharges, or corrections to an invoice.",
    },
    {
        term: "Debit Note",
        definition: "A document issued by a buyer to a seller indicating a request for a credit note or adjustment to an invoice amount.",
    },
    {
        term: "Due Date",
        definition: "The date by which payment for an invoice must be received. Typically calculated from the invoice date based on payment terms.",
    },
    {
        term: "EFT (Electronic Funds Transfer)",
        definition: "A method of transferring money electronically between bank accounts. Common payment method in South Africa.",
    },
    {
        term: "Gross Amount",
        definition: "The total amount before any deductions such as discounts, taxes, or withholdings are applied.",
    },
    {
        term: "Input VAT",
        definition: "VAT paid by a business on purchases and expenses. Can be claimed back from SARS if the business is VAT registered.",
    },
    {
        term: "Invoice",
        definition: "A commercial document issued by a seller to a buyer, indicating products, quantities, and agreed prices for goods or services provided.",
    },
    {
        term: "Invoice Date",
        definition: "The date when an invoice is issued. Used as the starting point for calculating payment due dates.",
    },
    {
        term: "Invoice Number",
        definition: "A unique identifier assigned to each invoice for tracking and reference purposes. Should be sequential.",
    },
    {
        term: "Line Item",
        definition: "An individual entry on an invoice representing a specific product or service, including description, quantity, and price.",
    },
    {
        term: "Net Amount",
        definition: "The amount after deductions. Can refer to the amount before VAT (net of VAT) or after discounts (net of discounts).",
    },
    {
        term: "Net 30 / Net 60",
        definition: "Payment terms indicating the invoice is due within 30 or 60 days of the invoice date. 'Net' means the full amount is due.",
    },
    {
        term: "Output VAT",
        definition: "VAT charged by a business on sales to customers. Must be paid to SARS after deducting input VAT.",
    },
    {
        term: "Overdue Invoice",
        definition: "An invoice that has not been paid by its due date. May incur late payment fees or interest.",
    },
    {
        term: "Payment Terms",
        definition: "The conditions under which a sale is made, specifying when payment is due and any applicable discounts for early payment.",
    },
    {
        term: "Pro Forma Invoice",
        definition: "A preliminary invoice sent before goods are delivered or services rendered. Not a demand for payment but an estimate or quote.",
    },
    {
        term: "Purchase Order (PO)",
        definition: "A document issued by a buyer to a seller indicating types, quantities, and agreed prices for products or services.",
    },
    {
        term: "Receipt",
        definition: "A document acknowledging that payment has been received. Issued after payment, unlike an invoice which is issued before.",
    },
    {
        term: "Recurring Invoice",
        definition: "An invoice that is automatically generated and sent at regular intervals for ongoing services or subscriptions.",
    },
    {
        term: "Remittance Advice",
        definition: "A document sent by a payer to a payee to inform them that their invoice has been paid.",
    },
    {
        term: "SARS",
        definition: "South African Revenue Service. The government agency responsible for collecting taxes including VAT.",
    },
    {
        term: "Statement of Account",
        definition: "A summary document showing all transactions between a business and a customer over a period, including invoices and payments.",
    },
    {
        term: "Subtotal",
        definition: "The sum of all line items before taxes, discounts, or other adjustments are applied.",
    },
    {
        term: "Tax Invoice",
        definition: "An invoice that includes VAT and meets SARS requirements. Required for VAT-registered businesses in South Africa.",
    },
    {
        term: "VAT (Value Added Tax)",
        definition: "A consumption tax levied on goods and services in South Africa. The standard rate is 15%.",
    },
    {
        term: "VAT Number",
        definition: "A unique number assigned by SARS to VAT-registered businesses. Must appear on all tax invoices.",
    },
    {
        term: "Withholding Tax",
        definition: "Tax deducted at source by the payer before payment is made. Common for certain services and payments to non-residents.",
    },
    {
        term: "Write-Off",
        definition: "The removal of an uncollectible debt from accounts receivable. Used when an invoice is deemed unlikely to be paid.",
    },
]

const groupedTerms = glossaryTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) {
        acc[letter] = []
    }
    acc[letter].push(term)
    return acc
}, {} as Record<string, typeof glossaryTerms>)

const alphabet = Object.keys(groupedTerms).sort()

export default function GlossaryPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconBook className="h-4 w-4" />
                            Reference Guide
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Glossary
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            A comprehensive guide to invoicing terms and definitions. 
                            Understand VAT, payment terms, and accounting terminology used in South African business.
                        </p>
                    </div>
                </div>
            </section>

            {/* Alphabet Navigation */}
            <section className="py-6 px-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        {alphabet.map((letter) => (
                            <a
                                key={letter}
                                href={`#letter-${letter}`}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-sm font-medium transition-colors"
                            >
                                {letter}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Glossary Terms */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {alphabet.map((letter) => (
                        <div key={letter} id={`letter-${letter}`} className="mb-12">
                            <h2 className="text-4xl font-bold text-primary mb-6 pb-2 border-b border-border">
                                {letter}
                            </h2>
                            <div className="space-y-6">
                                {groupedTerms[letter].map((item) => (
                                    <div key={item.term} className="group">
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {item.term}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {item.definition}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Resources */}
            <section className="py-16 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        Related Resources
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/what-is-an-invoice"
                            className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                        >
                            <h3 className="font-semibold mb-2">What is an Invoice?</h3>
                            <p className="text-sm text-muted-foreground">
                                Complete guide to understanding invoices and how to create them.
                            </p>
                        </Link>
                        <Link
                            href="/resources/vat-calculator"
                            className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                        >
                            <h3 className="font-semibold mb-2">VAT Calculator</h3>
                            <p className="text-sm text-muted-foreground">
                                Calculate VAT for your invoices with our free tool.
                            </p>
                        </Link>
                        <Link
                            href="/invoice-generator"
                            className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                        >
                            <h3 className="font-semibold mb-2">Invoice Generator</h3>
                            <p className="text-sm text-muted-foreground">
                                Create professional invoices for free with Illumi.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Put Your Knowledge into Practice
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Now that you understand invoicing terminology, create professional invoices 
                        with Illumi. Free for South African freelancers and small businesses.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
