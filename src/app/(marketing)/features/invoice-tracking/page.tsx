import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconEye,
    IconClock,
    IconChartBar,
    IconBell,
    IconFilter,
    IconSearch,
    IconFileAnalytics,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Tracking South Africa | Track Payments in Real-Time | Illumi",
    description: "Track invoice status and payments in real-time. See when clients view invoices, monitor overdue payments, and get instant notifications. Free invoice tracking for SA businesses.",
    keywords: [
        "invoice tracking",
        "track invoices south africa",
        "payment tracking software",
        "invoice status tracking",
        "track overdue invoices",
        "invoice payment tracking",
        "monitor invoice payments",
        "invoice tracking system",
    ],
    alternates: {
        canonical: "/features/invoice-tracking",
    },
    openGraph: {
        title: "Invoice Tracking South Africa | Illumi",
        description: "Track invoice status and payments in real-time. Know exactly where your money is.",
        type: "website",
        locale: "en_ZA",
    },
}

const trackingFeatures = [
    {
        icon: IconEye,
        title: "View Notifications",
        description: "Know the moment a client opens your invoice. See exactly when they viewed it and how many times.",
    },
    {
        icon: IconClock,
        title: "Real-Time Status",
        description: "Invoice status updates automatically — draft, sent, viewed, paid, or overdue. Always know where you stand.",
    },
    {
        icon: IconChartBar,
        title: "Payment Dashboard",
        description: "See all your invoices at a glance. Filter by status, client, date range, or amount.",
    },
    {
        icon: IconBell,
        title: "Instant Alerts",
        description: "Get notified when invoices are viewed, when payments arrive, and when invoices become overdue.",
    },
    {
        icon: IconFilter,
        title: "Smart Filtering",
        description: "Filter invoices by paid, pending, overdue, or any custom criteria. Find what you need instantly.",
    },
    {
        icon: IconSearch,
        title: "Quick Search",
        description: "Search by invoice number, client name, amount, or date. Find any invoice in seconds.",
    },
]

const statusTypes = [
    { status: "Draft", description: "Invoice created but not yet sent", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    { status: "Sent", description: "Invoice emailed to client", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    { status: "Viewed", description: "Client has opened the invoice", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    { status: "Paid", description: "Payment received", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    { status: "Overdue", description: "Past due date, unpaid", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
]

const benefits = [
    "Never wonder if a client received your invoice",
    "Know exactly when to follow up",
    "Identify slow-paying clients",
    "Spot overdue invoices immediately",
    "Track payment patterns over time",
    "Forecast cash flow accurately",
]

const faqs = [
    {
        question: "How does invoice view tracking work?",
        answer: "When you send an invoice via Illumi, clients receive a link to view it online. When they click that link, Illumi records the view and notifies you. You can see exactly when they viewed it and how many times.",
    },
    {
        question: "Can I see all my overdue invoices in one place?",
        answer: "Yes. The dashboard has a dedicated 'Overdue' filter that shows all invoices past their due date. You can see the total overdue amount, days overdue for each invoice, and send reminders with one click.",
    },
    {
        question: "Do I get notified when a payment is received?",
        answer: "Absolutely. When a client pays via PayFast or Yoco, the invoice is automatically marked as paid and you receive a notification. No manual updates needed.",
    },
    {
        question: "Can I track invoices by client?",
        answer: "Yes. Invoices are automatically organised by client. Click any client to see all their invoices, payment history, and outstanding balance.",
    },
    {
        question: "How far back can I see invoice history?",
        answer: "Your complete invoice history is stored forever. Search, filter, and export invoices from any time period for accounting or tax purposes.",
    },
    {
        question: "Is invoice tracking included in the free plan?",
        answer: "Yes. Full invoice tracking including status updates, view notifications, and the payment dashboard is included in the free plan.",
    },
]

export default function InvoiceTrackingPage() {
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
                            <IconFileAnalytics className="h-4 w-4" />
                            Tracking Feature
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoice Tracking That Keeps You in Control
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Know exactly where every invoice stands. Track when clients view invoices, monitor payment 
                            status in real-time, and never lose track of money owed to you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Start Tracking Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/features/invoicing">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    See All Features
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            2 months Pro free • Full tracking included • No credit card
                        </p>
                    </div>
                </div>
            </section>

            {/* What Is Invoice Tracking */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is Invoice Tracking?</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                Invoice tracking is the process of monitoring your invoices from creation to payment. 
                                It answers the questions every business owner asks: Did the client receive my invoice? 
                                Have they seen it? When will they pay?
                            </p>
                            <p className="mb-4">
                                With Illumi's invoice tracking, you get real-time visibility into every invoice. See when 
                                clients view your invoices, track payment status automatically, and get alerts when 
                                invoices become overdue.
                            </p>
                            <p>
                                For South African businesses, good invoice tracking means better cash flow management, 
                                fewer awkward payment conversations, and more time focusing on your actual work.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tracking Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to stay on top of your invoices.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trackingFeatures.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Status Types */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Invoice Status at a Glance</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Every invoice has a clear status so you always know where it stands. Status updates 
                                automatically as invoices move through their lifecycle.
                            </p>
                            <div className="space-y-4">
                                {statusTypes.map((type) => (
                                    <div key={type.status} className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${type.color}`}>
                                            {type.status}
                                        </span>
                                        <span className="text-muted-foreground">{type.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-6 bg-card">
                            <div className="text-sm font-medium text-muted-foreground mb-4">Invoice Dashboard</div>
                            <div className="space-y-3">
                                {[
                                    { client: "Acme Corp", invoice: "INV-001", amount: "R 8,500", status: "Paid", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
                                    { client: "TechStart", invoice: "INV-002", amount: "R 4,200", status: "Viewed", statusColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
                                    { client: "Design Co", invoice: "INV-003", amount: "R 12,000", status: "Sent", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
                                    { client: "Local Shop", invoice: "INV-004", amount: "R 2,500", status: "Overdue", statusColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
                                ].map((inv, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                        <div>
                                            <div className="font-medium text-sm">{inv.client}</div>
                                            <div className="text-xs text-muted-foreground">{inv.invoice}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{inv.amount}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inv.statusColor}`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 border border-border rounded-2xl p-8 bg-card">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-primary mb-2">87%</div>
                                <div className="text-muted-foreground">of invoices viewed within 24 hours</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/50 text-center">
                                    <div className="text-2xl font-bold">2.3 days</div>
                                    <div className="text-xs text-muted-foreground">Avg. time to payment</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50 text-center">
                                    <div className="text-2xl font-bold">94%</div>
                                    <div className="text-xs text-muted-foreground">On-time payment rate</div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Track Your Invoices?</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Invoice tracking gives you the information you need to get paid faster and manage 
                                cash flow effectively.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
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
                        Start Tracking Your Invoices Today
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Know exactly where every invoice stands. Sign up free and start tracking in minutes.
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
                        "name": "Illumi Invoice Tracking",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "featureList": ["Real-time status tracking", "View notifications", "Payment alerts", "Smart filtering"],
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "ZAR",
                        },
                        "description": "Invoice tracking software for South African businesses. Track invoice status and payments in real-time.",
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
