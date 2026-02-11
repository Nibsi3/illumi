import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconFileInvoice } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "What Is Invoice Management? A Complete Guide | Illumi",
    description: "Learn what invoice management is and why it matters for your business. Discover best practices for organising, tracking, and managing invoices effectively.",
    keywords: [
        "what is invoice management",
        "invoice management definition",
        "invoice management process",
        "how to manage invoices",
        "invoice management best practices",
        "invoice management system",
    ],
    alternates: {
        canonical: "/blog/what-is-invoice-management",
    },
}

const managementSteps = [
    {
        step: "1",
        title: "Invoice Creation",
        description: "Generate accurate invoices with all required details: client information, line items, amounts, payment terms, and tax calculations.",
    },
    {
        step: "2",
        title: "Invoice Delivery",
        description: "Send invoices to clients via email, post, or online portal. Track delivery to ensure clients receive them.",
    },
    {
        step: "3",
        title: "Payment Tracking",
        description: "Monitor invoice status — sent, viewed, paid, or overdue. Know exactly where each invoice stands.",
    },
    {
        step: "4",
        title: "Follow-Up",
        description: "Send reminders for unpaid invoices. Escalate as needed for overdue accounts.",
    },
    {
        step: "5",
        title: "Recording & Reporting",
        description: "Record payments, reconcile accounts, and generate reports for accounting and tax purposes.",
    },
]

const benefits = [
    "Faster payment collection",
    "Improved cash flow visibility",
    "Reduced administrative time",
    "Fewer errors and disputes",
    "Better client relationships",
    "Easier tax compliance",
    "Professional business image",
    "Accurate financial records",
]

const commonMistakes = [
    {
        mistake: "No centralised system",
        solution: "Use invoice software to keep all invoices in one place",
    },
    {
        mistake: "Inconsistent follow-up",
        solution: "Set up automatic payment reminders",
    },
    {
        mistake: "Poor record keeping",
        solution: "Store invoices digitally with proper backup",
    },
    {
        mistake: "Manual data entry",
        solution: "Use templates and automation to reduce errors",
    },
    {
        mistake: "No payment tracking",
        solution: "Monitor invoice status in real-time",
    },
]

export default function WhatIsInvoiceManagementPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            7 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Education</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        What Is Invoice Management?
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Invoice management is the backbone of healthy business finances. Here's everything you 
                        need to know about managing invoices effectively.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <div className="flex items-start gap-3">
                            <IconFileInvoice className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Definition</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    <strong>Invoice management</strong> is the process of creating, sending, tracking, 
                                    and organising invoices throughout their lifecycle — from initial creation to 
                                    final payment and record-keeping.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            Every business that sells products or services needs to invoice clients and collect 
                            payment. Invoice management encompasses all the activities involved in this process, 
                            ensuring invoices are accurate, delivered on time, and paid promptly.
                        </p>
                        <p>
                            Good invoice management directly impacts your cash flow. When invoices are managed 
                            poorly — sent late, lost, or not followed up — payments are delayed and your business 
                            suffers. Effective invoice management means faster payments, fewer disputes, and 
                            better financial visibility.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">The Invoice Management Process</h2>
                    <div className="space-y-4 mb-12">
                        {managementSteps.map((item) => (
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

                    <h2 className="text-2xl font-bold mb-6">Benefits of Good Invoice Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                                <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Common Invoice Management Mistakes</h2>
                    <div className="space-y-4 mb-12">
                        {commonMistakes.map((item) => (
                            <div key={item.mistake} className="rounded-xl border border-border bg-card p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Mistake</div>
                                        <div className="text-muted-foreground">{item.mistake}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Solution</div>
                                        <div className="text-muted-foreground">{item.solution}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">Manual vs Software-Based Invoice Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold mb-3 text-red-600 dark:text-red-400">Manual (Spreadsheets)</h3>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li>• Time-consuming data entry</li>
                                    <li>• Prone to human error</li>
                                    <li>• No automatic reminders</li>
                                    <li>• Difficult to track status</li>
                                    <li>• No online payment option</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-3 text-green-600 dark:text-green-400">Invoice Software</h3>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li>• Quick invoice creation</li>
                                    <li>• Automatic calculations</li>
                                    <li>• Automated reminders</li>
                                    <li>• Real-time status tracking</li>
                                    <li>• Online payment integration</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Getting Started with Invoice Management</h2>
                        <p className="text-muted-foreground mb-6">
                            The easiest way to improve your invoice management is to use dedicated software. 
                            Illumi provides everything you need: invoice creation, email delivery, payment 
                            tracking, automatic reminders, and online payment acceptance.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/invoices/new">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/invoice-management-system">
                                <Button variant="outline">
                                    Learn About Our System
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/how-to-manage-invoices" className="text-primary hover:underline">
                                    How to Manage Invoices for Small Businesses
                                </Link>
                            </li>
                            <li>
                                <Link href="/invoice-management-system" className="text-primary hover:underline">
                                    Invoice Management System for SA Businesses
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/invoice-tracking" className="text-primary hover:underline">
                                    Invoice Tracking Features
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Simplify Your Invoice Management</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Stop struggling with spreadsheets. Illumi makes invoice management simple, 
                        automatic, and effective.
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
                        "headline": "What Is Invoice Management?",
                        "description": "Learn what invoice management is and why it matters for your business.",
                        "author": {
                            "@type": "Organization",
                            "name": "Illumi",
                        },
                        "datePublished": "2026-01-20",
                    }),
                }}
            />
        </>
    )
}
