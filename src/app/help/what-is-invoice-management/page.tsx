import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconFileInvoice,
    IconUsers,
    IconChartBar,
    IconClock,
    IconCheck,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "What is Invoice Management? | Complete Guide for SA Businesses | Illumi",
    description: "Learn what invoice management is and why it matters for South African businesses. Understand the invoice lifecycle, best practices, and how to streamline your billing process.",
    keywords: [
        "what is invoice management",
        "invoice management explained",
        "invoice management south africa",
        "invoice lifecycle",
        "billing management",
        "invoice process",
        "invoice best practices",
    ],
    alternates: {
        canonical: "/help/what-is-invoice-management",
    },
    openGraph: {
        title: "What is Invoice Management? | Illumi",
        description: "Learn what invoice management is and why it matters for your business.",
        type: "article",
        locale: "en_ZA",
    },
}

const invoiceLifecycle = [
    {
        step: "1",
        title: "Create",
        description: "Generate a professional invoice with client details, line items, and payment terms.",
    },
    {
        step: "2",
        title: "Send",
        description: "Deliver the invoice to your client via email, link, or PDF download.",
    },
    {
        step: "3",
        title: "Track",
        description: "Monitor when the invoice is viewed, when it's due, and if it becomes overdue.",
    },
    {
        step: "4",
        title: "Collect",
        description: "Receive payment and mark the invoice as paid. Send reminders if needed.",
    },
    {
        step: "5",
        title: "Report",
        description: "Generate reports for tax submissions, accountants, and business planning.",
    },
]

const benefits = [
    {
        icon: IconClock,
        title: "Save Time",
        description: "Automate repetitive tasks like creating recurring invoices and sending payment reminders.",
    },
    {
        icon: IconChartBar,
        title: "Improve Cash Flow",
        description: "Track outstanding payments and reduce the time between invoicing and payment.",
    },
    {
        icon: IconUsers,
        title: "Better Client Relationships",
        description: "Professional invoices and organized records build trust with your clients.",
    },
    {
        icon: IconFileInvoice,
        title: "Stay Compliant",
        description: "Ensure your invoices meet SARS requirements for VAT and record-keeping.",
    },
]

const bestPractices = [
    "Invoice promptly — send invoices as soon as work is complete",
    "Use clear payment terms — specify due dates and accepted payment methods",
    "Include all required information — VAT number, business details, line items",
    "Follow up on overdue invoices — don't let payments slip through the cracks",
    "Keep organized records — store all invoices for at least 5 years for SARS",
    "Use professional templates — first impressions matter",
]

export default function WhatIsInvoiceManagementPage() {
    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
                        <span>/</span>
                        <span>What is Invoice Management?</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        What is Invoice Management?
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Invoice management is the process of creating, sending, tracking, and organizing invoices for your business. It's how you get paid for your work and keep your finances in order.
                    </p>
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                            For South African businesses, good invoice management means more than just sending bills. It means staying compliant with SARS requirements, tracking VAT correctly, and maintaining records that can withstand an audit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Invoice Lifecycle */}
            <section className="py-16 bg-muted/30">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-foreground mb-8">
                        The Invoice Lifecycle
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Every invoice goes through these stages. Good invoice management means handling each stage efficiently.
                    </p>
                    <div className="space-y-4">
                        {invoiceLifecycle.map((stage, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                    {stage.step}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{stage.title}</h3>
                                    <p className="text-muted-foreground">{stage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-foreground mb-8">
                        Why Invoice Management Matters
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
                                <benefit.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Best Practices */}
            <section className="py-16 bg-muted/30">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-foreground mb-8">
                        Invoice Management Best Practices
                    </h2>
                    <div className="space-y-3">
                        {bestPractices.map((practice, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                                <IconCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-foreground">{practice}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SA Specific */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-foreground mb-8">
                        Invoice Management for South African Businesses
                    </h2>
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                            South African businesses have specific requirements for invoicing. If you're registered for VAT, your invoices must include:
                        </p>
                        <ul>
                            <li>Your VAT registration number</li>
                            <li>The words "Tax Invoice"</li>
                            <li>VAT amount shown separately (currently 15%)</li>
                            <li>Your business name and address</li>
                            <li>The customer's name and address</li>
                            <li>A unique invoice number</li>
                            <li>Date of issue</li>
                        </ul>
                        <p>
                            SARS requires you to keep invoice records for at least 5 years. Using invoice management software like Illumi ensures your invoices are compliant and your records are safely stored.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-muted/30">
                <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Ready to Streamline Your Invoicing?
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Illumi makes invoice management simple for South African businesses. Create, send, and track invoices in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Try Illumi Free
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted"
                        >
                            <Link href="/features/invoicing">See Features</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Related Articles
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/help/how-vat-invoices-work-south-africa" className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold text-foreground mb-1">How VAT Invoices Work in South Africa</h3>
                            <p className="text-sm text-muted-foreground">Learn about SARS requirements for VAT invoices.</p>
                        </Link>
                        <Link href="/features/automated-invoicing" className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold text-foreground mb-1">Automated Invoicing</h3>
                            <p className="text-sm text-muted-foreground">Save hours with recurring invoices and reminders.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
