import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
    IconDownload,
    IconMail,
    IconBrandWhatsapp,
    IconPalette,
    IconCurrencyDollar,
    IconUsers,
    IconReceipt,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Invoice Generator | Create Professional Invoices Online | Illumi",
    description: "Create free professional invoices online in minutes. No signup required to preview. Customizable templates, automatic calculations, and instant PDF download. Perfect for South African freelancers and small businesses.",
    keywords: [
        "free invoice generator",
        "invoice generator South Africa",
        "create invoice online free",
        "invoice maker",
        "professional invoice template",
        "invoice creator",
        "free invoicing tool",
        "small business invoice generator",
        "freelancer invoice generator",
        "PDF invoice generator",
    ],
    openGraph: {
        title: "Free Invoice Generator | Illumi",
        description: "Create professional invoices in minutes. Customizable templates, automatic calculations, and instant PDF download.",
        type: "website",
    },
    alternates: {
        canonical: "/invoice-generator",
    },
}

const features = [
    {
        icon: IconPalette,
        title: "Professional Templates",
        description: "Choose from beautiful, customizable invoice templates that make your business look professional.",
    },
    {
        icon: IconCurrencyDollar,
        title: "Automatic Calculations",
        description: "VAT, discounts, and totals calculated automatically. No more spreadsheet errors.",
    },
    {
        icon: IconDownload,
        title: "Instant PDF Download",
        description: "Download your invoice as a professional PDF ready to send to clients.",
    },
    {
        icon: IconMail,
        title: "Email Directly",
        description: "Send invoices directly to clients via email with tracking to see when they're viewed.",
    },
    {
        icon: IconBrandWhatsapp,
        title: "Share via WhatsApp",
        description: "Share invoice links via WhatsApp for quick client communication.",
    },
    {
        icon: IconUsers,
        title: "Client Management",
        description: "Save client details for faster invoicing. Never re-enter the same information twice.",
    },
]

const benefits = [
    "100% free to use",
    "No credit card required",
    "Unlimited invoices",
    "South African Rand (ZAR) support",
    "VAT compliant invoices",
    "Professional PDF export",
    "Email delivery with tracking",
    "Mobile-friendly",
    "Cloud storage included",
    "PayFast & Yoco integration",
]

const steps = [
    {
        number: "01",
        title: "Add Your Details",
        description: "Enter your business name, logo, and contact information. This is saved for future invoices.",
    },
    {
        number: "02",
        title: "Add Client & Items",
        description: "Select or add a client, then add line items with descriptions, quantities, and prices.",
    },
    {
        number: "03",
        title: "Send & Get Paid",
        description: "Preview your invoice, then send via email or download as PDF. Accept online payments instantly.",
    },
]

export default function InvoiceGeneratorPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-background/60" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                                <IconFileInvoice className="h-4 w-4" />
                                2 Months Pro Free
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                Free Invoice Generator for South Africa
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Create professional, VAT-compliant invoices in minutes. No design skills needed. 
                                Perfect for freelancers, contractors, and small businesses across South Africa.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/invoices/new">
                                    <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                                        Create Free Invoice
                                        <IconArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                No credit card required. Start invoicing in 60 seconds.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="text-xs text-muted-foreground">INVOICE</div>
                                        <div className="text-2xl font-bold">#INV-001</div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                                        Paid
                                    </div>
                                </div>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Web Design Services</span>
                                        <span>R 8,500.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Logo Design</span>
                                        <span>R 3,500.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Hosting Setup</span>
                                        <span>R 1,200.00</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>R 13,200.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">VAT (15%)</span>
                                        <span>R 1,980.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>R 15,180.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Create an Invoice in 3 Simple Steps
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our invoice generator is designed to be fast and easy. No learning curve required.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="relative">
                                <div className="text-6xl font-bold text-muted-foreground/20 mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Invoice Like a Pro
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Professional features that help you get paid faster.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-colors"
                            >
                                <div className="p-3 rounded-xl bg-accent w-fit mb-4">
                                    <feature.icon className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Why Choose Illumi's Invoice Generator?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Built specifically for South African businesses. Compliant with SARS requirements, 
                                supports ZAR, and integrates with local payment providers.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <div className="p-1 rounded-full bg-primary/10">
                                            <IconCheck className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <IconReceipt className="h-12 w-12 text-primary mb-6" />
                            <h3 className="text-2xl font-semibold mb-4">
                                SARS Compliant Invoices
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Every invoice includes all required fields for SARS compliance: 
                                VAT number, tax invoice label, itemized descriptions, and proper VAT calculations.
                            </p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <IconCheck className="h-4 w-4 text-primary" />
                                    <span>Automatic VAT calculation</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="h-4 w-4 text-primary" />
                                    <span>Tax invoice labeling</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="h-4 w-4 text-primary" />
                                    <span>Sequential invoice numbering</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="h-4 w-4 text-primary" />
                                    <span>Required business details</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Create Your First Invoice?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of South African freelancers and small businesses using Illumi 
                        to create professional invoices and get paid faster.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Free Invoice Now
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-4">
                        2 months of Pro features free. No credit card required.
                    </p>
                </div>
            </section>
        </>
    )
}
