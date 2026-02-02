import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconReceipt2,
    IconCreditCard,
    IconRefresh,
    IconFileInvoice,
    IconReportMoney,
    IconClock,
    IconShieldCheck,
    IconDeviceLaptop,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Billing & Invoicing Software South Africa | Illumi",
    description: "Complete billing and invoicing software for South African businesses. Create invoices, accept online payments, track expenses, and manage your finances. Free forever.",
    keywords: [
        "billing invoicing software",
        "billing software south africa",
        "invoicing and billing",
        "billing system south africa",
        "invoice billing software",
        "small business billing",
        "billing solution south africa",
        "invoicing billing platform",
    ],
    alternates: {
        canonical: "/billing-invoicing-software",
    },
    openGraph: {
        title: "Billing & Invoicing Software South Africa | Illumi",
        description: "Complete billing and invoicing solution. Create invoices, accept payments, and manage finances.",
        type: "website",
        locale: "en_ZA",
    },
}

const features = [
    {
        icon: IconFileInvoice,
        title: "Professional Invoicing",
        description: "Create branded, VAT-compliant invoices in minutes. Send via email with a link for clients to pay online.",
    },
    {
        icon: IconCreditCard,
        title: "Online Payment Collection",
        description: "Accept credit cards, debit cards, EFT, and SnapScan via PayFast and Yoco. Get paid faster with one-click payments.",
    },
    {
        icon: IconRefresh,
        title: "Recurring Billing",
        description: "Set up automatic recurring invoices for retainer clients. Invoices are created and sent on your schedule.",
    },
    {
        icon: IconReportMoney,
        title: "Expense Tracking",
        description: "Track business expenses alongside invoices. Snap receipts, categorise expenses, and see your true profit.",
    },
    {
        icon: IconClock,
        title: "Payment Reminders",
        description: "Automatic reminders for overdue invoices. Customise timing and messaging to match your style.",
    },
    {
        icon: IconShieldCheck,
        title: "SARS Compliant",
        description: "Generate tax invoices that meet all SARS requirements. Perfect for VAT-registered businesses.",
    },
]

const billingCapabilities = [
    "Create professional invoices",
    "Accept online payments",
    "Track payment status",
    "Automatic reminders",
    "Recurring billing",
    "Expense tracking",
    "VAT calculations",
    "Multi-currency support",
    "Client management",
    "Financial reporting",
    "Quote to invoice conversion",
    "Payment history",
]

const useCases = [
    {
        title: "Freelancers",
        description: "Bill clients for projects, track hours, and get paid online. Perfect for designers, developers, and consultants.",
    },
    {
        title: "Small Businesses",
        description: "Manage customer billing, track expenses, and monitor cash flow. Scale as your business grows.",
    },
    {
        title: "Service Providers",
        description: "Set up recurring billing for ongoing services. Automate invoicing for retainer clients.",
    },
    {
        title: "Agencies",
        description: "Bill multiple clients, manage projects, and track profitability across your portfolio.",
    },
]

const faqs = [
    {
        question: "What's the difference between billing and invoicing software?",
        answer: "Invoicing software focuses on creating and sending invoices, while billing software includes broader financial management like payment collection, expense tracking, and recurring billing. Illumi combines both — you get complete invoicing plus payment collection, expense tracking, and financial insights in one platform.",
    },
    {
        question: "Can I accept online payments through Illumi?",
        answer: "Yes. Illumi integrates with PayFast and Yoco, South Africa's leading payment gateways. Your clients can pay invoices instantly via credit card, debit card, EFT, or SnapScan. Payments are automatically marked as received.",
    },
    {
        question: "Does Illumi support recurring billing?",
        answer: "Yes. With Illumi Pro, you can set up recurring invoices that are automatically created and sent on your schedule — weekly, monthly, quarterly, or custom intervals. Perfect for subscription services and retainer clients.",
    },
    {
        question: "Can I track expenses alongside invoices?",
        answer: "Absolutely. Illumi includes expense tracking so you can see your complete financial picture. Snap receipts, categorise expenses, and understand your true profit after costs.",
    },
    {
        question: "Is Illumi suitable for VAT-registered businesses?",
        answer: "Yes. Illumi generates SARS-compliant tax invoices with all required fields. VAT is calculated automatically at 15%, and your VAT number is displayed on every invoice.",
    },
    {
        question: "How much does billing and invoicing software cost?",
        answer: "Illumi offers a free forever plan with unlimited invoices, clients, and basic features. Premium features like recurring billing and advanced reporting are available from R99/month. No hidden fees.",
    },
]

const testimonials = [
    {
        quote: "I needed one tool for invoicing and expense tracking. Illumi does both brilliantly. The PayFast integration means I get paid the same day I send an invoice.",
        author: "Kagiso M.",
        role: "Web Developer, Johannesburg",
    },
    {
        quote: "The recurring billing feature has saved me hours every month. I set it up once and my retainer clients are billed automatically.",
        author: "Anita v.R.",
        role: "Marketing Consultant, Cape Town",
    },
    {
        quote: "Finally, billing software that understands South African business. VAT invoices, ZAR currency, local payment methods — it just works.",
        author: "Sipho N.",
        role: "Electrical Contractor, Durban",
    },
]

export default function BillingInvoicingSoftwarePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconReceipt2 className="h-4 w-4" />
                            Billing & Invoicing
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Billing & Invoicing Software for South African Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Create professional invoices, accept online payments, and track expenses — all in one platform. 
                            Built for South African freelancers and small businesses who want to get paid faster.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/login">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Start Free Today
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Free forever • No credit card required • Unlimited invoices
                        </p>
                    </div>
                </div>
            </section>

            {/* What Is Billing & Invoicing Software */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is Billing & Invoicing Software?</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                Billing and invoicing software is a complete financial management tool that helps businesses 
                                create invoices, collect payments, track expenses, and manage their cash flow. It goes beyond 
                                simple invoice generation to provide a full picture of your business finances.
                            </p>
                            <p className="mb-4">
                                With billing software, you can set up recurring invoices for regular clients, accept online 
                                payments directly from invoices, send automatic payment reminders, and track all your business 
                                expenses in one place.
                            </p>
                            <p>
                                For South African businesses, having billing software that supports ZAR, integrates with local 
                                payment gateways like PayFast and Yoco, and generates SARS-compliant tax invoices is essential 
                                for efficient operations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Billing & Invoicing Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to bill clients and manage your business finances.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capabilities List */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">One Platform for All Your Billing Needs</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Stop juggling multiple tools. Illumi combines invoicing, payments, and expense tracking 
                                in one simple platform.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {billingCapabilities.map((capability) => (
                                    <div key={capability} className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                        <span>{capability}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-6 bg-card">
                            <div className="flex items-center gap-3 mb-6">
                                <IconDeviceLaptop className="h-8 w-8 text-primary" />
                                <span className="font-bold text-lg">Financial Dashboard</span>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-muted/50">
                                        <div className="text-xs text-muted-foreground mb-1">Revenue (This Month)</div>
                                        <div className="text-2xl font-bold">R 68,500</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50">
                                        <div className="text-xs text-muted-foreground mb-1">Expenses</div>
                                        <div className="text-2xl font-bold">R 12,300</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <div className="text-xs text-primary mb-1">Net Profit</div>
                                    <div className="text-3xl font-bold text-primary">R 56,200</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-2">
                                    <div className="text-center p-3 rounded-lg bg-muted/30">
                                        <div className="text-lg font-bold">24</div>
                                        <div className="text-xs text-muted-foreground">Invoices Sent</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/30">
                                        <div className="text-lg font-bold text-green-600">21</div>
                                        <div className="text-xs text-muted-foreground">Paid</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/30">
                                        <div className="text-lg font-bold text-amber-600">3</div>
                                        <div className="text-xs text-muted-foreground">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Uses Billing & Invoicing Software?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Illumi is built for South African businesses of all sizes.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {useCases.map((useCase) => (
                            <div key={useCase.title} className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                                <p className="text-muted-foreground text-sm">{useCase.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Integration */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 border border-border rounded-2xl p-8 bg-card">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold mb-2">Accept Payments Via</h3>
                                <p className="text-sm text-muted-foreground">Integrated with South Africa's leading payment gateways</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-xl bg-muted/50 text-center">
                                    <div className="font-bold mb-1">PayFast</div>
                                    <div className="text-xs text-muted-foreground">Cards, EFT, SnapScan</div>
                                </div>
                                <div className="p-6 rounded-xl bg-muted/50 text-center">
                                    <div className="font-bold mb-1">Yoco</div>
                                    <div className="text-xs text-muted-foreground">Card Payments</div>
                                </div>
                            </div>
                            <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span className="text-sm">Payments automatically marked as received</span>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Paid Faster with Online Payments</h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                Every invoice you send includes a "Pay Now" button. Clients click and pay instantly 
                                via credit card, debit card, EFT, or SnapScan.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                No more waiting for bank transfers or chasing clients for payment. With online payments, 
                                you can get paid the same day you send an invoice.
                            </p>
                            <p className="text-muted-foreground">
                                Payments are automatically recorded in Illumi, so your books are always up to date.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by SA Businesses</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="border border-border rounded-2xl p-6 bg-card">
                                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                                <div>
                                    <div className="font-bold">{testimonial.author}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Start free and upgrade when you need more. No hidden fees.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="border border-border rounded-2xl p-8 bg-card">
                            <div className="text-sm font-medium text-muted-foreground mb-2">Free</div>
                            <div className="text-4xl font-bold mb-4">R0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Unlimited invoices</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Online payments</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Expense tracking</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>VAT invoicing</span>
                                </li>
                            </ul>
                            <Link href="/login">
                                <Button variant="outline" className="w-full">Start Free</Button>
                            </Link>
                        </div>
                        <div className="border-2 border-primary rounded-2xl p-8 bg-card relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                Most Popular
                            </div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Pro</div>
                            <div className="text-4xl font-bold mb-4">R99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Everything in Free</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Recurring billing</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Automatic reminders</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Advanced reporting</span>
                                </li>
                            </ul>
                            <Link href="/login">
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start Free Trial
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Common questions about billing and invoicing software
                        </p>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-border rounded-xl p-6 bg-card">
                                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Simplify Your Billing?
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Join thousands of South African businesses using Illumi for billing and invoicing. 
                        Start free today — no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                Create Free Account
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invoice-software-south-africa">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Illumi Billing & Invoicing Software",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "ZAR",
                        },
                        "description": "Complete billing and invoicing software for South African businesses. Create invoices, accept payments, and track expenses.",
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map((faq) => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer,
                            },
                        })),
                    }),
                }}
            />
        </>
    )
}
