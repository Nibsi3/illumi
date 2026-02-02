import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconBuilding } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "How SARS VAT Invoicing Works | Complete Guide | Illumi",
    description: "Understand how SARS VAT invoicing works in South Africa. Learn about registration, tax invoice requirements, VAT returns, and staying compliant with SARS regulations.",
    keywords: [
        "SARS VAT invoicing",
        "SARS tax invoice",
        "VAT compliance south africa",
        "SARS invoice requirements",
        "VAT registration SARS",
        "south africa VAT rules",
    ],
    alternates: {
        canonical: "/blog/sars-vat-invoicing",
    },
}

const vatProcess = [
    {
        step: "1",
        title: "VAT Registration",
        description: "Register with SARS when turnover exceeds R1 million (mandatory) or R50,000 (voluntary). You'll receive a VAT registration number.",
    },
    {
        step: "2",
        title: "Charge VAT on Sales",
        description: "Add 15% VAT to your taxable supplies. This is 'output VAT' that you collect on behalf of SARS.",
    },
    {
        step: "3",
        title: "Issue Tax Invoices",
        description: "Provide SARS-compliant tax invoices to customers. These allow them to claim input VAT.",
    },
    {
        step: "4",
        title: "Claim Input VAT",
        description: "Deduct VAT paid on business purchases from VAT collected. Keep tax invoices as proof.",
    },
    {
        step: "5",
        title: "Submit VAT Returns",
        description: "File VAT201 returns (usually bi-monthly) via eFiling. Pay the difference between output and input VAT.",
    },
]

const invoiceRequirements = [
    "The words 'Tax Invoice' prominently displayed",
    "Your business name, address, and VAT number",
    "Customer's name and address (for invoices over R5,000)",
    "Customer's VAT number (for invoices over R5,000)",
    "Unique, sequential invoice number",
    "Date of issue",
    "Description of goods or services",
    "Quantity and price of each item",
    "Total excluding VAT",
    "VAT amount (at 15%)",
    "Total including VAT",
]

const commonMistakes = [
    {
        mistake: "Issuing tax invoices before registration",
        consequence: "Illegal. You cannot charge VAT without a valid registration.",
    },
    {
        mistake: "Missing required fields on invoices",
        consequence: "Customers cannot claim input VAT. May trigger SARS queries.",
    },
    {
        mistake: "Late VAT return submissions",
        consequence: "Penalties and interest charges from SARS.",
    },
    {
        mistake: "Not keeping invoices for 5 years",
        consequence: "Cannot prove claims during SARS audit.",
    },
    {
        mistake: "Claiming input VAT without valid tax invoices",
        consequence: "Claims disallowed. Potential penalties.",
    },
]

const importantDates = [
    { event: "VAT return due", timing: "25th of month following VAT period" },
    { event: "Payment due", timing: "Last business day of month following VAT period" },
    { event: "Record retention", timing: "5 years from date of transaction" },
    { event: "Registration deadline", timing: "21 days after exceeding R1m threshold" },
]

export default function SarsVatInvoicingPost() {
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
                        How SARS VAT Invoicing Works
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        A practical guide to VAT invoicing in South Africa. Understand the SARS requirements, 
                        avoid common mistakes, and stay compliant.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <div className="flex items-start gap-3">
                            <IconBuilding className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">What Is VAT?</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Value Added Tax (VAT) is a consumption tax charged on most goods and services 
                                    in South Africa at 15%. As a VAT vendor, you collect VAT from customers and 
                                    pay it to SARS, minus the VAT you've paid on business purchases.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            Understanding how SARS VAT invoicing works is essential for any South African 
                            business. Get it right, and VAT is straightforward. Get it wrong, and you face 
                            penalties, audits, and unhappy customers who can't claim their input VAT.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">The VAT Process</h2>
                    <div className="space-y-4 mb-12">
                        {vatProcess.map((item) => (
                            <div key={item.step} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Tax Invoice Requirements</h2>
                    <div className="rounded-2xl border border-border bg-card p-6 mb-12">
                        <p className="text-muted-foreground mb-6">
                            SARS requires specific information on tax invoices. Missing any of these can 
                            invalidate the invoice for VAT purposes:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {invoiceRequirements.map((req) => (
                                <div key={req} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                    <span className="text-sm">{req}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Important Dates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {importantDates.map((item) => (
                            <div key={item.event} className="rounded-xl border border-border bg-card p-4">
                                <div className="font-medium mb-1">{item.event}</div>
                                <div className="text-sm text-muted-foreground">{item.timing}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Common Mistakes to Avoid</h2>
                    <div className="space-y-4 mb-12">
                        {commonMistakes.map((item) => (
                            <div key={item.mistake} className="rounded-xl border border-border bg-card p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Mistake</div>
                                        <div className="text-muted-foreground">{item.mistake}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Consequence</div>
                                        <div className="text-muted-foreground">{item.consequence}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">VAT Calculation Quick Reference</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold mb-3">Adding VAT</h3>
                                <div className="p-4 rounded-xl bg-muted/50 font-mono text-sm">
                                    <div>Price excl. VAT: R 1,000.00</div>
                                    <div>VAT (15%): R 150.00</div>
                                    <div className="font-bold mt-2">Total: R 1,150.00</div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Formula: Total = Price × 1.15
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-3">Extracting VAT</h3>
                                <div className="p-4 rounded-xl bg-muted/50 font-mono text-sm">
                                    <div>Price incl. VAT: R 1,150.00</div>
                                    <div>VAT portion: R 150.00</div>
                                    <div className="font-bold mt-2">Excl. VAT: R 1,000.00</div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Formula: VAT = Total × 15/115
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">Tips for Staying Compliant</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">Use invoicing software that generates SARS-compliant tax invoices automatically</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">Set calendar reminders for VAT return deadlines</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">Keep digital copies of all tax invoices (issued and received)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">Reconcile VAT monthly, not just at return time</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">Consider a separate bank account for VAT funds</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Simplify SARS Compliance</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi generates SARS-compliant tax invoices automatically. Just enter your VAT 
                            number once, and every invoice includes all required fields with correct calculations.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
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
                                <Link href="/blog/vat-invoices-explained" className="text-primary hover:underline">
                                    VAT Invoices Explained
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
                    <h2 className="text-3xl font-bold mb-4">VAT Invoicing Made Easy</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Stop worrying about SARS compliance. Illumi handles it automatically.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Free Today
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
