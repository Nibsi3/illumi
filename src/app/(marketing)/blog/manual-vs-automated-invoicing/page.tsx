import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconX } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Manual vs Automated Invoicing: Which Is Better? | Illumi",
    description: "Compare manual and automated invoicing methods. Learn the pros, cons, and when to switch from spreadsheets to invoice software for your South African business.",
    keywords: [
        "manual vs automated invoicing",
        "invoice automation",
        "spreadsheet invoicing",
        "automated billing",
        "invoicing software benefits",
        "excel invoicing vs software",
    ],
    alternates: {
        canonical: "/blog/manual-vs-automated-invoicing",
    },
}

const comparisonPoints = [
    {
        aspect: "Invoice Creation Time",
        manual: "15-30 minutes per invoice",
        automated: "2-5 minutes per invoice",
        winner: "automated",
    },
    {
        aspect: "Error Rate",
        manual: "High (manual calculations)",
        automated: "Low (automatic calculations)",
        winner: "automated",
    },
    {
        aspect: "Payment Tracking",
        manual: "Manual spreadsheet updates",
        automated: "Real-time automatic tracking",
        winner: "automated",
    },
    {
        aspect: "Payment Reminders",
        manual: "Must remember to send",
        automated: "Automatic scheduling",
        winner: "automated",
    },
    {
        aspect: "Online Payments",
        manual: "Not possible",
        automated: "One-click payment links",
        winner: "automated",
    },
    {
        aspect: "Recurring Invoices",
        manual: "Create each one manually",
        automated: "Set once, send automatically",
        winner: "automated",
    },
    {
        aspect: "Setup Cost",
        manual: "Free (Excel/Sheets)",
        automated: "Free to R99/month",
        winner: "tie",
    },
    {
        aspect: "Learning Curve",
        manual: "Familiar tools",
        automated: "Quick to learn",
        winner: "tie",
    },
]

const manualPros = [
    "No new software to learn",
    "Complete control over format",
    "Works offline",
    "No subscription costs",
]

const manualCons = [
    "Time-consuming data entry",
    "Prone to calculation errors",
    "No automatic reminders",
    "Difficult to track payments",
    "No online payment option",
    "Hard to scale",
]

const automatedPros = [
    "Fast invoice creation",
    "Automatic calculations",
    "Payment tracking built-in",
    "Automatic reminders",
    "Online payment acceptance",
    "Professional templates",
    "Scales with your business",
    "Accessible from any device",
]

const automatedCons = [
    "Requires internet connection",
    "May have subscription cost",
    "Initial setup time",
]

const switchSigns = [
    "You're spending more than 2 hours per week on invoicing",
    "You've made calculation errors on invoices",
    "Clients frequently pay late",
    "You forget to follow up on overdue invoices",
    "You want to accept online payments",
    "You have recurring clients with regular billing",
    "You're losing track of who owes what",
    "Tax time is stressful due to poor records",
]

export default function ManualVsAutomatedInvoicingPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            6 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Comparison</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Manual vs Automated Invoicing
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Still using Excel for invoices? Here's an honest comparison of manual and automated 
                        invoicing — and when it makes sense to switch.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            Many South African businesses start with manual invoicing — creating invoices in 
                            Word or Excel, emailing PDFs, and tracking payments in a spreadsheet. It works 
                            when you have a few clients and simple needs.
                        </p>
                        <p>
                            But as your business grows, manual invoicing becomes a bottleneck. You spend more 
                            time on admin, make more errors, and chase more late payments. That's when 
                            automated invoicing starts to make sense.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Head-to-Head Comparison</h2>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-12">
                        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 border-b border-border font-medium text-sm">
                            <div>Aspect</div>
                            <div className="text-center">Manual</div>
                            <div className="text-center">Automated</div>
                            <div className="text-center">Winner</div>
                        </div>
                        {comparisonPoints.map((point) => (
                            <div key={point.aspect} className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-b-0 text-sm">
                                <div className="font-medium">{point.aspect}</div>
                                <div className="text-center text-muted-foreground">{point.manual}</div>
                                <div className="text-center text-muted-foreground">{point.automated}</div>
                                <div className="text-center">
                                    {point.winner === "automated" && (
                                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                                            Automated
                                        </span>
                                    )}
                                    {point.winner === "manual" && (
                                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium">
                                            Manual
                                        </span>
                                    )}
                                    {point.winner === "tie" && (
                                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium">
                                            Tie
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <h3 className="text-xl font-bold mb-4">Manual Invoicing</h3>
                            <div className="mb-6">
                                <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">Pros</div>
                                <ul className="space-y-2">
                                    {manualPros.map((pro) => (
                                        <li key={pro} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <IconCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">Cons</div>
                                <ul className="space-y-2">
                                    {manualCons.map((con) => (
                                        <li key={con} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <IconX className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-primary bg-card p-6">
                            <h3 className="text-xl font-bold mb-4">Automated Invoicing</h3>
                            <div className="mb-6">
                                <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">Pros</div>
                                <ul className="space-y-2">
                                    {automatedPros.map((pro) => (
                                        <li key={pro} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <IconCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">Cons</div>
                                <ul className="space-y-2">
                                    {automatedCons.map((con) => (
                                        <li key={con} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <IconX className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Signs It's Time to Switch</h2>
                    <div className="rounded-2xl border border-border bg-card p-6 mb-12">
                        <p className="text-muted-foreground mb-6">
                            If any of these sound familiar, automated invoicing will save you time and money:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {switchSigns.map((sign) => (
                                <div key={sign} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                    <span className="text-sm">{sign}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
                        <p className="text-muted-foreground mb-4">
                            Manual invoicing works for very small operations with simple needs. But for most 
                            businesses, the time savings and reduced errors from automated invoicing pay for 
                            themselves quickly.
                        </p>
                        <p className="text-muted-foreground">
                            With free options like Illumi available, there's little reason to stick with 
                            spreadsheets once you're invoicing regularly. The switch typically takes less 
                            than an hour, and you'll wonder why you didn't do it sooner.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Ready to Automate?</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi makes the switch easy. Import your clients, create your first invoice in 
                            minutes, and start getting paid faster. 2 months of Pro features free.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/invoices/new">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/features/automated-invoicing">
                                <Button variant="outline">
                                    See Automation Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/online-invoicing-vs-excel" className="text-primary hover:underline">
                                    Online Invoicing vs Excel
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/automated-invoicing" className="text-primary hover:underline">
                                    Automated Invoicing Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/best-invoice-software-south-africa" className="text-primary hover:underline">
                                    Best Invoice Software in SA (2026)
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Make the Switch Today</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of SA businesses who've upgraded from spreadsheets to Illumi.
                    </p>
                    <Link href="/invoices/new">
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
