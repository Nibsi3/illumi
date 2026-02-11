import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconReceiptTax } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "VAT Invoices Explained (South Africa) | Complete Guide | Illumi",
    description: "Everything you need to know about VAT invoices in South Africa. Learn what a tax invoice must include, when to issue one, and how to stay SARS compliant.",
    keywords: [
        "VAT invoice south africa",
        "tax invoice explained",
        "SARS tax invoice",
        "VAT invoice requirements",
        "what is a VAT invoice",
        "tax invoice south africa",
        "15% VAT invoice",
    ],
    alternates: {
        canonical: "/blog/vat-invoices-explained",
    },
}

const invoiceRequirements = [
    { field: "The words 'Tax Invoice'", description: "Must be prominently displayed", required: true },
    { field: "Seller's name and address", description: "Your registered business details", required: true },
    { field: "Seller's VAT number", description: "Your SARS VAT registration number", required: true },
    { field: "Buyer's name and address", description: "Required for invoices over R5,000", required: true },
    { field: "Buyer's VAT number", description: "If buyer is VAT registered (invoices over R5,000)", required: false },
    { field: "Invoice number", description: "Sequential, unique number", required: true },
    { field: "Date of issue", description: "When the invoice was created", required: true },
    { field: "Description of goods/services", description: "Clear description of what was supplied", required: true },
    { field: "Quantity and unit price", description: "For each line item", required: true },
    { field: "Total excluding VAT", description: "Subtotal before tax", required: true },
    { field: "VAT amount", description: "At 15% (or applicable rate)", required: true },
    { field: "Total including VAT", description: "Final amount payable", required: true },
]

const vatTypes = [
    {
        type: "Standard Rate (15%)",
        description: "Most goods and services in South Africa",
        examples: "Professional services, retail goods, digital products",
    },
    {
        type: "Zero Rate (0%)",
        description: "Taxable but at 0% — input VAT can still be claimed",
        examples: "Exports, certain basic foodstuffs, petrol/diesel",
    },
    {
        type: "Exempt",
        description: "Not subject to VAT — no input VAT can be claimed",
        examples: "Financial services, residential rent, public transport",
    },
]

const commonQuestions = [
    {
        question: "When must I register for VAT?",
        answer: "You must register when your taxable turnover exceeds R1 million in any 12-month period. Voluntary registration is available from R50,000 turnover.",
    },
    {
        question: "What's the difference between a tax invoice and a regular invoice?",
        answer: "A tax invoice is issued by a VAT-registered vendor and includes specific information required by SARS. It allows the recipient to claim input VAT. A regular invoice doesn't include VAT details.",
    },
    {
        question: "Can I issue a tax invoice before I'm VAT registered?",
        answer: "No. You can only issue tax invoices once you have a valid VAT registration number from SARS. Issuing tax invoices without registration is illegal.",
    },
    {
        question: "How long must I keep tax invoices?",
        answer: "SARS requires you to keep all tax invoices (issued and received) for 5 years. Electronic storage is acceptable.",
    },
    {
        question: "What if I make a mistake on a tax invoice?",
        answer: "Issue a credit note to correct the error, then issue a new tax invoice if needed. Never alter an issued invoice — always use credit notes.",
    },
    {
        question: "Do I need to show VAT separately on the invoice?",
        answer: "Yes. The VAT amount must be shown as a separate line item. You can show prices as VAT-inclusive or VAT-exclusive, but the VAT amount must be clear.",
    },
]

export default function VatInvoicesExplainedPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            8 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Tax & Compliance</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        VAT Invoices Explained (South Africa)
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        A complete guide to VAT invoices in South Africa. What they are, what they must include, 
                        and how to create SARS-compliant tax invoices.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <div className="flex items-start gap-3">
                            <IconReceiptTax className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">What Is a VAT Invoice?</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    A VAT invoice (also called a tax invoice) is a document issued by a VAT-registered 
                                    business that records a taxable transaction. It includes specific information 
                                    required by SARS and allows the recipient to claim input VAT on their purchases.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            In South Africa, Value Added Tax (VAT) is charged at 15% on most goods and services. 
                            If you're a VAT-registered vendor, you must issue tax invoices for all taxable supplies 
                            and keep records for at least 5 years.
                        </p>
                        <p>
                            Getting your tax invoices right is crucial. Incorrect invoices can lead to SARS audits, 
                            penalties, and your clients being unable to claim their input VAT.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">What Must a Tax Invoice Include?</h2>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-12">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border font-medium text-sm">
                            <div className="col-span-4">Field</div>
                            <div className="col-span-6">Description</div>
                            <div className="col-span-2 text-center">Required</div>
                        </div>
                        {invoiceRequirements.map((req) => (
                            <div key={req.field} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-b-0">
                                <div className="col-span-4 font-medium">{req.field}</div>
                                <div className="col-span-6 text-muted-foreground text-sm">{req.description}</div>
                                <div className="col-span-2 text-center">
                                    {req.required ? (
                                        <IconCheck className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Conditional</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Types of VAT in South Africa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        {vatTypes.map((vat) => (
                            <div key={vat.type} className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-bold mb-2">{vat.type}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{vat.description}</p>
                                <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Examples:</span> {vat.examples}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-4">Full vs Abridged Tax Invoices</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold mb-3">Full Tax Invoice</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Required for supplies over R5,000. Must include all fields listed above, 
                                    including buyer's name, address, and VAT number.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-3">Abridged Tax Invoice</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Allowed for supplies of R5,000 or less. Can omit buyer's details but must 
                                    still include all seller information and VAT calculations.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">VAT Calculation Example</h2>
                    <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold mb-4">Adding VAT (VAT-exclusive price)</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                        <span>Price (excl. VAT)</span>
                                        <span className="font-medium">R 1,000.00</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                        <span>VAT (15%)</span>
                                        <span className="font-medium text-primary">R 150.00</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-lg bg-primary/10 font-bold">
                                        <span>Total (incl. VAT)</span>
                                        <span>R 1,150.00</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Formula: VAT = Price × 0.15
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-4">Extracting VAT (VAT-inclusive price)</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                        <span>Price (incl. VAT)</span>
                                        <span className="font-medium">R 1,150.00</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                        <span>VAT portion</span>
                                        <span className="font-medium text-primary">R 150.00</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-lg bg-primary/10 font-bold">
                                        <span>Price (excl. VAT)</span>
                                        <span>R 1,000.00</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Formula: VAT = Price × 15/115
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4 mb-12">
                        {commonQuestions.map((item) => (
                            <div key={item.question} className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-bold mb-2">{item.question}</h3>
                                <p className="text-muted-foreground">{item.answer}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Create SARS-Compliant VAT Invoices</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi automatically includes all required fields on your tax invoices. Just enter 
                            your VAT number once, and every invoice you create will be fully compliant.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/invoices/new">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Create VAT Invoice Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/features/vat-invoices">
                                <Button variant="outline">
                                    VAT Invoice Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/vat-setup-guide" className="text-primary hover:underline">
                                    VAT Setup Guide for SA Businesses
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/sars-vat-invoicing" className="text-primary hover:underline">
                                    How SARS VAT Invoicing Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources/vat-calculator" className="text-primary hover:underline">
                                    VAT Calculator Tool
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">VAT Invoicing Made Simple</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Stop worrying about compliance. Illumi handles VAT calculations and formatting 
                        automatically.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Free Today
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "VAT Invoices Explained (South Africa)",
                        "description": "Complete guide to VAT invoices in South Africa.",
                        "author": { "@type": "Organization", "name": "Illumi" },
                        "datePublished": "2026-01-25",
                    }),
                }}
            />
        </>
    )
}
