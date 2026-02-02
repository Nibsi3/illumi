import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconChartBar } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Tracking for SMEs | Complete Guide | Illumi",
    description: "Learn how to track invoices effectively for your SME. Monitor payment status, identify overdue invoices, and improve cash flow with proper invoice tracking.",
    keywords: [
        "invoice tracking SME",
        "track invoices small business",
        "invoice tracking system",
        "payment tracking SME",
        "invoice monitoring",
        "track overdue invoices",
    ],
    alternates: {
        canonical: "/blog/invoice-tracking-smes",
    },
}

const trackingMethods = [
    {
        method: "Spreadsheet Tracking",
        pros: ["Free", "Familiar", "Customisable"],
        cons: ["Manual updates", "Error-prone", "No automation", "Hard to scale"],
        bestFor: "Very small businesses with few invoices",
    },
    {
        method: "Invoice Software",
        pros: ["Automatic tracking", "Real-time status", "Payment integration", "Reminders"],
        cons: ["May have cost", "Learning curve"],
        bestFor: "Growing SMEs who invoice regularly",
    },
    {
        method: "Accounting Software",
        pros: ["Full financial picture", "Bank reconciliation", "Tax reporting"],
        cons: ["Complex", "Expensive", "Overkill for invoicing only"],
        bestFor: "Larger SMEs needing full accounting",
    },
]

const keyMetrics = [
    {
        metric: "Days Sales Outstanding (DSO)",
        description: "Average days to collect payment after invoicing",
        target: "Under 30 days",
    },
    {
        metric: "Overdue Invoice Rate",
        description: "Percentage of invoices past due date",
        target: "Under 10%",
    },
    {
        metric: "Collection Rate",
        description: "Percentage of invoiced amount actually collected",
        target: "Over 95%",
    },
    {
        metric: "Average Payment Time",
        description: "How long clients typically take to pay",
        target: "Within payment terms",
    },
]

const trackingTips = [
    "Check invoice status daily",
    "Flag overdue invoices immediately",
    "Know your total outstanding at all times",
    "Identify slow-paying clients",
    "Track payment patterns over time",
    "Set up automatic status updates",
    "Use filters to focus on problem invoices",
    "Review aged receivables weekly",
]

export default function InvoiceTrackingSMEsPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            6 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Cash Flow</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Invoice Tracking for SMEs
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Effective invoice tracking is essential for healthy cash flow. Here's how SMEs can 
                        monitor payments and stay on top of receivables.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <div className="flex items-start gap-3">
                            <IconChartBar className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Why Invoice Tracking Matters</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Without proper tracking, invoices slip through the cracks. You don't know who 
                                    owes what, overdue invoices pile up, and cash flow suffers. Good tracking gives 
                                    you visibility and control.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            For South African SMEs, invoice tracking is often the difference between healthy 
                            cash flow and constant stress. When you know exactly which invoices are outstanding, 
                            who's paying late, and what's coming in, you can make better business decisions.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Tracking Methods Compared</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {trackingMethods.map((method) => (
                            <div key={method.method} className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-bold mb-4">{method.method}</h3>
                                <div className="mb-4">
                                    <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Pros</div>
                                    <ul className="space-y-1">
                                        {method.pros.map((pro) => (
                                            <li key={pro} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <IconCheck className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Cons</div>
                                    <ul className="space-y-1">
                                        {method.cons.map((con) => (
                                            <li key={con} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="text-red-600 dark:text-red-400 text-xs">✗</span>
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-medium">Best for:</span> {method.bestFor}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Key Metrics to Track</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {keyMetrics.map((item) => (
                            <div key={item.metric} className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-bold mb-2">{item.metric}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-primary">Target:</span>
                                    <span className="text-xs text-muted-foreground">{item.target}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Invoice Tracking Best Practices</h2>
                    <div className="rounded-2xl border border-border bg-card p-6 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {trackingTips.map((tip) => (
                                <div key={tip} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                    <span className="text-sm">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">What to Look for in Tracking Software</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-2">Essential Features</div>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Real-time status updates</li>
                                    <li>• Filter by status/client/date</li>
                                    <li>• Overdue invoice alerts</li>
                                    <li>• Payment history per client</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-2">Nice to Have</div>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• View notifications (when client opens)</li>
                                    <li>• Automatic payment matching</li>
                                    <li>• Reporting and analytics</li>
                                    <li>• Mobile access</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Track Invoices Effortlessly</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi gives you complete visibility into your invoices. See status at a glance, 
                            filter by any criteria, and get alerts for overdue payments. All included free.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/features/invoice-tracking">
                                <Button variant="outline">
                                    See Tracking Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/features/invoice-tracking" className="text-primary hover:underline">
                                    Invoice Tracking Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/reduce-late-payments" className="text-primary hover:underline">
                                    How to Reduce Late Payments
                                </Link>
                            </li>
                            <li>
                                <Link href="/invoice-management-system" className="text-primary hover:underline">
                                    Invoice Management System
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Know Where Your Money Is</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Stop guessing. Start tracking. Illumi shows you exactly where every invoice stands.
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
