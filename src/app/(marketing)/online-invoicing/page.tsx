import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconWorld,
    IconMail,
    IconCreditCard,
    IconBell,
    IconDevices,
    IconLock,
    IconCloudUpload,
    IconChartLine,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Online Invoicing South Africa | Create & Send Invoices Online | Illumi",
    description: "Create and send professional invoices online from anywhere. Accept payments via PayFast & Yoco, track invoice status in real-time, and get paid faster. Free for South African businesses.",
    keywords: [
        "online invoicing south africa",
        "online invoice generator",
        "send invoices online",
        "cloud invoicing software",
        "web-based invoicing",
        "online billing south africa",
        "digital invoicing",
        "invoice online free",
    ],
    alternates: {
        canonical: "/online-invoicing",
    },
    openGraph: {
        title: "Online Invoicing South Africa | Illumi",
        description: "Create and send professional invoices online. Accept payments and track status in real-time.",
        type: "website",
        locale: "en_ZA",
    },
}

const benefits = [
    {
        icon: IconWorld,
        title: "Invoice From Anywhere",
        description: "Create and send invoices from your laptop, tablet, or phone. No software to install — just log in and invoice.",
    },
    {
        icon: IconMail,
        title: "Email Delivery",
        description: "Send invoices directly to your clients via email. They receive a professional invoice with a link to pay online.",
    },
    {
        icon: IconCreditCard,
        title: "Online Payments",
        description: "Clients pay instantly via credit card, debit card, EFT, or SnapScan using PayFast and Yoco integration.",
    },
    {
        icon: IconBell,
        title: "Real-Time Notifications",
        description: "Get notified when clients view your invoice and when payments are received. No more wondering if they saw it.",
    },
    {
        icon: IconDevices,
        title: "Works on All Devices",
        description: "Fully responsive design means you can manage invoices on desktop, tablet, or mobile with the same great experience.",
    },
    {
        icon: IconLock,
        title: "Secure & Private",
        description: "Bank-grade encryption protects your data. Your invoices and client information are always secure.",
    },
]

const comparisonPoints = [
    {
        traditional: "Email Word/PDF attachments",
        online: "Send via email with payment link",
    },
    {
        traditional: "Wait for bank transfer",
        online: "Accept instant card payments",
    },
    {
        traditional: "Manually track who paid",
        online: "Automatic payment tracking",
    },
    {
        traditional: "Chase clients for payment",
        online: "Automated payment reminders",
    },
    {
        traditional: "Store files on your computer",
        online: "Access from any device",
    },
    {
        traditional: "Risk losing data",
        online: "Automatic cloud backup",
    },
]

const steps = [
    {
        number: "1",
        title: "Create Your Invoice",
        description: "Add your client, line items, and payment terms. VAT is calculated automatically if you're registered.",
    },
    {
        number: "2",
        title: "Send to Your Client",
        description: "Email the invoice directly or share a link. Your client receives a professional invoice they can view online.",
    },
    {
        number: "3",
        title: "Get Paid Online",
        description: "Clients click 'Pay Now' and pay via card or EFT. Payment is marked automatically — no manual updates needed.",
    },
]

const faqs = [
    {
        question: "What is online invoicing?",
        answer: "Online invoicing is the process of creating, sending, and managing invoices through a web-based platform instead of using desktop software or paper. With online invoicing, you can access your invoices from any device, send them via email, accept online payments, and track payment status in real-time.",
    },
    {
        question: "Is online invoicing secure?",
        answer: "Yes. Illumi uses bank-grade encryption (SSL/TLS) to protect all data in transit and at rest. Your invoices, client information, and payment details are stored securely on protected servers with regular backups.",
    },
    {
        question: "Can clients pay invoices online?",
        answer: "Absolutely. When you send an invoice through Illumi, clients receive a 'Pay Now' button that allows them to pay instantly via credit card, debit card, EFT, or SnapScan using our PayFast and Yoco integrations.",
    },
    {
        question: "Do I need to install any software?",
        answer: "No. Illumi is completely web-based. You just need a web browser and internet connection. It works on Windows, Mac, Linux, iOS, and Android devices.",
    },
    {
        question: "Can I access my invoices offline?",
        answer: "You need an internet connection to create and send invoices. However, you can download PDF copies of your invoices for offline access or printing.",
    },
    {
        question: "How is online invoicing different from traditional invoicing?",
        answer: "Traditional invoicing involves creating invoices in Word or Excel, emailing PDFs, and manually tracking payments. Online invoicing automates this entire process — invoices are sent with payment links, payments are tracked automatically, and reminders are sent for overdue invoices.",
    },
]

const testimonials = [
    {
        quote: "I used to spend hours creating invoices in Excel and chasing payments. Now I send an invoice in 2 minutes and clients pay online the same day.",
        author: "Pieter J.",
        role: "IT Consultant, Pretoria",
    },
    {
        quote: "The ability to invoice from my phone while on-site with clients has been a game-changer. I get paid before I even leave.",
        author: "Lindiwe M.",
        role: "Event Planner, Johannesburg",
    },
]

export default function OnlineInvoicingPage() {
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
                            <IconCloudUpload className="h-4 w-4" />
                            Cloud-Based Invoicing
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Online Invoicing for South African Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Create professional invoices online, send them via email, and accept payments instantly. 
                            No software to install — invoice from any device, anywhere in South Africa.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Start Invoicing Online
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/invoice-generator">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Try Invoice Generator
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            2 months Pro free • No credit card required • Works on all devices
                        </p>
                    </div>
                </div>
            </section>

            {/* What Is Online Invoicing */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is Online Invoicing?</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                Online invoicing is the modern way to bill your clients. Instead of creating invoices in Word or Excel 
                                and emailing PDF attachments, you use a web-based platform to create, send, and track invoices — all 
                                from your browser.
                            </p>
                            <p className="mb-4">
                                With online invoicing, your clients receive a professional invoice via email with a link to view it 
                                online. They can pay instantly using their credit card, debit card, or EFT. You get notified when 
                                they view the invoice and when payment is received.
                            </p>
                            <p>
                                For South African businesses, online invoicing means faster payments, less admin, and a more 
                                professional image. No more chasing clients for payment or wondering if they received your invoice.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Online Invoicing?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Save time, get paid faster, and look more professional with cloud-based invoicing.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="p-6 rounded-2xl bg-card border border-border">
                                <benefit.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How Online Invoicing Works</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            From creation to payment in three simple steps.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Traditional vs Online Invoicing</h2>
                        <p className="text-lg text-muted-foreground">
                            See why South African businesses are switching to online invoicing.
                        </p>
                    </div>
                    <div className="border border-border rounded-2xl overflow-hidden bg-card">
                        <div className="grid grid-cols-2 bg-muted/50 border-b border-border">
                            <div className="p-4 font-bold text-center">Traditional Invoicing</div>
                            <div className="p-4 font-bold text-center border-l border-border">Online Invoicing</div>
                        </div>
                        {comparisonPoints.map((point, i) => (
                            <div key={i} className="grid grid-cols-2 border-b border-border last:border-b-0">
                                <div className="p-4 text-muted-foreground text-center">{point.traditional}</div>
                                <div className="p-4 text-center border-l border-border flex items-center justify-center gap-2">
                                    <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                    <span>{point.online}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What SA Businesses Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

            {/* Features List */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything You Need for Online Invoicing</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Illumi gives you all the tools to invoice professionally and get paid on time.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Professional invoice templates",
                                    "Email delivery with tracking",
                                    "Online payment acceptance",
                                    "Automatic payment reminders",
                                    "VAT-compliant invoices",
                                    "Client portal access",
                                    "Expense tracking",
                                    "Financial reporting",
                                    "Multi-currency support",
                                    "Recurring invoices",
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-8 bg-card">
                            <div className="flex items-center gap-3 mb-6">
                                <IconChartLine className="h-8 w-8 text-primary" />
                                <span className="font-bold text-lg">Invoice Dashboard</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                                    <span className="text-sm">Total Invoiced (This Month)</span>
                                    <span className="font-bold">R 45,000</span>
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                                    <span className="text-sm">Paid</span>
                                    <span className="font-bold text-green-600">R 38,000</span>
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                                    <span className="text-sm">Pending</span>
                                    <span className="font-bold text-amber-600">R 5,000</span>
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                                    <span className="text-sm">Overdue</span>
                                    <span className="font-bold text-red-600">R 2,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Common questions about online invoicing
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
                        Start Invoicing Online Today
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Join thousands of South African businesses using Illumi for online invoicing. 
                        Create your first invoice in under 2 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/invoices/new">
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
                        "name": "Illumi Online Invoicing",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "ZAR",
                        },
                        "description": "Online invoicing software for South African businesses. Create and send invoices online, accept payments, and track status in real-time.",
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
