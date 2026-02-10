import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
    IconSparkles,
    IconCurrencyDollar,
    IconMail,
    IconBrandWhatsapp,
    IconReceipt,
    IconUsers,
    IconChartPie,
    IconRepeat,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Invoice Maker | Make Invoices Online in Minutes | Illumi",
    description: "Make professional invoices online for free with Illumi's invoice maker. Beautiful templates, automatic calculations, PDF export, and online payments. The easiest way to make an invoice.",
    keywords: [
        "invoice maker",
        "free invoice maker",
        "invoice maker online",
        "make an invoice",
        "make invoice online free",
        "invoice maker app",
        "simple invoice maker",
        "best invoice maker",
        "easy invoice maker",
        "invoice maker software",
        "make a receipt",
        "bill maker",
        "invoice builder",
    ],
    openGraph: {
        title: "Free Invoice Maker Online | Illumi",
        description: "Make professional invoices in minutes. Free templates, automatic calculations, online payments.",
        type: "website",
    },
    alternates: {
        canonical: "/invoice-maker",
    },
}

const capabilities = [
    { icon: IconSparkles, title: "Professional Templates", desc: "Choose from beautiful, customisable invoice designs that match your brand." },
    { icon: IconCurrencyDollar, title: "Auto Calculations", desc: "VAT, discounts, and totals calculated instantly. No formulas needed." },
    { icon: IconMail, title: "One-Click Email", desc: "Send invoices directly to clients via email with automatic reminders." },
    { icon: IconBrandWhatsapp, title: "WhatsApp Sharing", desc: "Share payment links via WhatsApp for instant client access." },
    { icon: IconReceipt, title: "PDF Export", desc: "Download polished PDF invoices for your records or to send manually." },
    { icon: IconUsers, title: "Client Management", desc: "Save client details and auto-fill them on future invoices." },
    { icon: IconChartPie, title: "Revenue Dashboard", desc: "Track income, outstanding payments, and business growth at a glance." },
    { icon: IconRepeat, title: "Recurring Invoices", desc: "Automate billing for retainer clients. Set it and forget it." },
]

const useCases = [
    {
        title: "Freelancers & Consultants",
        description: "Bill clients for projects, hourly work, or retainers. Track time, create milestones, and get paid online.",
        keywords: "freelance invoice maker, consultant invoice maker",
    },
    {
        title: "Small Business Owners",
        description: "Manage customer invoicing, track expenses, and monitor cash flow — all from one dashboard.",
        keywords: "small business invoice maker, business invoice maker",
    },
    {
        title: "Contractors & Tradespeople",
        description: "Create quotes, convert them to invoices, and bill for materials and labour in one professional document.",
        keywords: "contractor invoice maker, construction invoice maker",
    },
    {
        title: "Creative Professionals",
        description: "Photographers, designers, and artists can create branded invoices that reflect their creative style.",
        keywords: "photographer invoice maker, designer invoice maker",
    },
]

export default function InvoiceMakerPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <IconFileInvoice className="w-4 h-4" />
                            Make Professional Invoices in Minutes
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            The Easiest Invoice Maker Online
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Make beautiful, professional invoices in minutes — not hours. Illumi&apos;s free invoice maker handles the formatting, calculations, and delivery so you can focus on your work.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    Make Your First Invoice
                                    <IconArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/invoice-template">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    Browse Templates
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">Free forever. No credit card needed.</p>
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Make & Manage Invoices
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            From creation to payment — Illumi covers the entire invoicing workflow.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {capabilities.map((c) => (
                            <div key={c.title} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
                                <c.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                                <p className="text-sm text-muted-foreground">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            An Invoice Maker Built for Your Industry
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            No matter what you do, Illumi makes invoicing simple and professional.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {useCases.map((uc) => (
                            <div key={uc.title} className="bg-card rounded-xl border p-8 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold mb-3">{uc.title}</h3>
                                <p className="text-muted-foreground mb-4">{uc.description}</p>
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        Create My First Invoice <IconArrowRight className="ml-1 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                        <h2>What Makes a Great Invoice Maker?</h2>
                        <p>The best invoice maker combines speed, professionalism, and automation. It should let you create an invoice in under a minute, look polished enough to impress clients, and handle the boring stuff (calculations, numbering, reminders) automatically.</p>

                        <h3>Invoice Maker vs Invoice Generator vs Invoice Template</h3>
                        <p>These terms are often used interchangeably, but there are subtle differences:</p>
                        <ul>
                            <li><strong>Invoice maker</strong> — A tool that lets you build invoices from scratch with a guided interface</li>
                            <li><strong>Invoice generator</strong> — A tool that automatically generates invoices from saved data and templates</li>
                            <li><strong>Invoice template</strong> — A pre-designed layout that you fill in with your details</li>
                        </ul>
                        <p>Illumi combines all three: choose a template, fill in your details once, and generate professional invoices automatically from that point forward.</p>

                        <h3>Why South African Businesses Choose Illumi</h3>
                        <p>Unlike international invoice makers like Invoice Ninja, FreshBooks, or Conta, Illumi is built specifically for South Africa. We support ZAR as the default currency, integrate with local payment gateways like PayFast and Yoco, and ensure all invoices meet SARS requirements for VAT compliance.</p>

                        <p>Our free plan is genuinely free — unlimited invoices, clients, and PDF exports. No trials, no hidden fees, no credit card required. <Link href="/login" className="text-primary font-semibold">Start making professional invoices today</Link>.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Make Your First Invoice in Under 60 Seconds
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of businesses making professional invoices with Illumi. Free forever.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Start Making Invoices — Free
                            <IconArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
