import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconFileInvoice,
    IconCurrencyDollar,
    IconShieldCheck,
    IconDeviceMobile,
    IconCloud,
    IconUsers,
    IconReceipt,
    IconChartBar,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Software for South African Businesses | Illumi",
    description: "Professional invoice software built for South African businesses. Create VAT-compliant invoices in ZAR, accept online payments via PayFast & Yoco, and get paid faster. Free forever.",
    keywords: [
        "invoice software south africa",
        "invoicing software south africa",
        "invoice software ZAR",
        "VAT invoice software",
        "billing software south africa",
        "SARS compliant invoicing",
        "small business invoice software",
        "free invoice software south africa",
    ],
    alternates: {
        canonical: "/invoice-software-south-africa",
    },
    openGraph: {
        title: "Invoice Software for South African Businesses | Illumi",
        description: "Create professional VAT-compliant invoices in ZAR. Built for South African freelancers and small businesses.",
        type: "website",
        locale: "en_ZA",
    },
}

const features = [
    {
        icon: IconReceipt,
        title: "VAT-Compliant Invoices",
        description: "Generate SARS-compliant tax invoices with automatic VAT calculations at 15%. Perfect for registered VAT vendors.",
    },
    {
        icon: IconCurrencyDollar,
        title: "ZAR Currency & Local Payments",
        description: "Invoice in South African Rand with PayFast and Yoco integration. Your clients pay with cards, EFT, or SnapScan.",
    },
    {
        icon: IconCloud,
        title: "Cloud-Based Access",
        description: "Access your invoices from anywhere. No software to install — works on any device with a browser.",
    },
    {
        icon: IconDeviceMobile,
        title: "Mobile-Friendly",
        description: "Create and send invoices from your phone. Perfect for on-site work or when you're away from your desk.",
    },
    {
        icon: IconUsers,
        title: "Client Management",
        description: "Store client details, track payment history, and see outstanding balances at a glance.",
    },
    {
        icon: IconChartBar,
        title: "Financial Insights",
        description: "Track revenue, monitor overdue invoices, and understand your cash flow with simple dashboards.",
    },
]

const benefits = [
    "Unlimited invoices on free plan",
    "Professional invoice templates",
    "Automatic payment reminders",
    "Expense tracking included",
    "Multi-currency support",
    "Recurring invoice automation",
    "Client portal access",
    "PDF and email delivery",
    "Bank-grade security",
    "No credit card required",
]

const testimonials = [
    {
        quote: "Finally, invoice software that understands South African business. The VAT calculations and PayFast integration saved me hours every month.",
        author: "Thabo M.",
        role: "Freelance Developer, Johannesburg",
    },
    {
        quote: "I switched from Excel spreadsheets to Illumi and my clients started paying faster. The professional invoices make a real difference.",
        author: "Sarah v.d. Berg",
        role: "Interior Designer, Cape Town",
    },
    {
        quote: "As a small business owner, I needed something simple that works with our local payment methods. Illumi ticks all the boxes.",
        author: "Nomvula K.",
        role: "Catering Business Owner, Durban",
    },
]

const faqs = [
    {
        question: "Is Illumi invoice software free to use?",
        answer: "Yes, Illumi offers a free forever plan with unlimited invoices, clients, and basic features. Premium features like recurring invoices and advanced reporting are available on paid plans starting from R99/month.",
    },
    {
        question: "Does Illumi support VAT invoicing for SARS?",
        answer: "Absolutely. Illumi generates SARS-compliant tax invoices with all required fields including your VAT number, the 15% VAT calculation, and proper invoice numbering. Perfect for registered VAT vendors.",
    },
    {
        question: "Can my clients pay invoices online?",
        answer: "Yes. Illumi integrates with PayFast and Yoco, allowing your clients to pay via credit card, debit card, EFT, or SnapScan directly from the invoice. Payments are automatically marked as received.",
    },
    {
        question: "Is my data secure?",
        answer: "Your data is protected with bank-grade encryption and stored on secure servers. We use industry-standard security practices to keep your business information safe.",
    },
    {
        question: "Can I use Illumi on my phone?",
        answer: "Yes. Illumi is fully responsive and works on any device. Create invoices, check payment status, and manage clients from your smartphone or tablet.",
    },
    {
        question: "How is Illumi different from international invoice software?",
        answer: "Illumi is built specifically for South African businesses. We support ZAR currency, local payment gateways (PayFast, Yoco), SARS-compliant VAT invoicing, and understand local business practices.",
    },
]

export default function InvoiceSoftwareSouthAfricaPage() {
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
                            <IconFileInvoice className="h-4 w-4" />
                            Built for South African Businesses
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoice Software Built for South African Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Create professional, VAT-compliant invoices in ZAR. Accept online payments via PayFast and Yoco. 
                            Track expenses, manage clients, and get paid faster — all in one platform designed for SA entrepreneurs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices/new">
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

            {/* What Is Invoice Software Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is Invoice Software?</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                Invoice software is a digital tool that helps businesses create, send, and manage invoices electronically. 
                                Instead of manually creating invoices in Word or Excel, invoice software automates the process — saving 
                                you time and reducing errors.
                            </p>
                            <p className="mb-4">
                                Modern invoice software like Illumi goes beyond basic invoicing. It tracks payments, sends automatic 
                                reminders for overdue invoices, stores client information, and integrates with payment gateways so 
                                your clients can pay online instantly.
                            </p>
                            <p>
                                For South African businesses, having invoice software that supports ZAR currency, VAT calculations, 
                                and local payment methods like PayFast and Yoco is essential. Generic international tools often 
                                lack these critical features.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why SA Businesses Choose Illumi */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why South African Businesses Choose Illumi</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Unlike international invoice software, Illumi is purpose-built for the South African market. 
                            Every feature is designed with local businesses in mind.
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

            {/* Features of Illumi */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Features of Illumi Invoice Software</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Everything you need to invoice professionally and get paid on time. No complicated setup, 
                                no hidden fees, no unnecessary features you'll never use.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-8 bg-card">
                            <div className="text-sm font-medium text-muted-foreground mb-4">Invoice Preview</div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-lg">INV-2026-001</div>
                                        <div className="text-sm text-muted-foreground">Acme Consulting (Pty) Ltd</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">R 12,500.00</div>
                                        <div className="text-sm text-muted-foreground">incl. VAT</div>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Website Development</span>
                                        <span>R 10,869.57</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>VAT (15%)</span>
                                        <span>R 1,630.43</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                        VAT Compliant
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-accent text-muted-foreground text-xs font-medium">
                                        Pay Online
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VAT Compliant Section */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="border border-border rounded-2xl p-8 bg-card">
                                <div className="flex items-center gap-3 mb-6">
                                    <IconShieldCheck className="h-8 w-8 text-primary" />
                                    <span className="font-bold text-lg">SARS Compliant</span>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary" />
                                        <span>Seller and buyer details</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary" />
                                        <span>VAT registration number</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary" />
                                        <span>Sequential invoice numbering</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary" />
                                        <span>Date of issue</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary" />
                                        <span>Description of goods/services</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary" />
                                        <span>VAT amount at 15%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary" />
                                        <span>Total including VAT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">VAT-Compliant Invoicing in South Africa</h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                If you're a registered VAT vendor, your invoices must meet SARS requirements. Illumi automatically 
                                includes all mandatory fields on your tax invoices.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Simply enter your VAT number in settings, and every invoice you create will be fully compliant. 
                                VAT is calculated automatically at 15%, and both the VAT amount and total are clearly displayed.
                            </p>
                            <p className="text-muted-foreground">
                                Not VAT registered? No problem. You can create standard invoices without VAT until you reach 
                                the R1 million threshold.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing for Small Businesses</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Start free and upgrade when you need more. No hidden fees, no surprises.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="border border-border rounded-2xl p-8 bg-card">
                            <div className="text-sm font-medium text-muted-foreground mb-2">Free</div>
                            <div className="text-4xl font-bold mb-4">R0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                            <p className="text-muted-foreground mb-6">Perfect for freelancers and new businesses</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Unlimited invoices</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Unlimited clients</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>VAT invoicing</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Online payments</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Expense tracking</span>
                                </li>
                            </ul>
                            <Link href="/invoices/new">
                                <Button variant="outline" className="w-full">Create an Invoice — Free</Button>
                            </Link>
                        </div>
                        <div className="border-2 border-primary rounded-2xl p-8 bg-card relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                Most Popular
                            </div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Pro</div>
                            <div className="text-4xl font-bold mb-4">R99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                            <p className="text-muted-foreground mb-6">For growing businesses that need more</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Everything in Free</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Recurring invoices</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Automatic reminders</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Advanced reporting</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary" />
                                    <span>Priority support</span>
                                </li>
                            </ul>
                            <Link href="/invoices/new">
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start Free Trial
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by South African Businesses</h2>
                        <p className="text-lg text-muted-foreground">
                            Join thousands of freelancers and small businesses across South Africa
                        </p>
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

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to know about Illumi invoice software
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
                        Ready to Simplify Your Invoicing?
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Join thousands of South African businesses using Illumi to create professional invoices, 
                        track payments, and get paid faster. Start free today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/invoices/new">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                Create Free Account
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/features/invoicing">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                See All Features
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
                        "name": "Illumi",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "ZAR",
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "150",
                        },
                        "description": "Professional invoice software for South African businesses. Create VAT-compliant invoices, accept online payments, and manage clients.",
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
