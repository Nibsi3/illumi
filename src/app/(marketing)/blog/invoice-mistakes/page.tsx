import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconAlertTriangle, IconArrowRight, IconCheck, IconClock } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "7 Invoice Mistakes That Quietly Kill Your Cash Flow | Illumi",
    description:
        "These common invoicing mistakes delay payments and cost you money. Fix them in under 10 minutes and start getting paid faster.",
    keywords: [
        "invoice mistakes",
        "why clients pay late",
        "invoice payment delays",
        "invoicing best practices",
        "cash flow",
        "South Africa invoicing",
    ],
    alternates: {
        canonical: "/blog/invoice-mistakes",
    },
}

const mistakes = [
    {
        title: "No due date (or a hidden due date)",
        fix: "Put the due date next to the total AND in the email/WhatsApp message.",
        impact: "Clients genuinely forget. No due date = no urgency = delayed payment.",
    },
    {
        title: "Vague line items",
        fix: "Use specific descriptions: what, when, quantity, and rate.",
        impact: "'Services rendered' tells finance nothing. They'll query it, delaying approval.",
    },
    {
        title: "No payment instructions",
        fix: "Include banking details or a payment link. Don't make finance ask you.",
        impact: "Every email back-and-forth adds 3-5 days to your payment timeline.",
    },
    {
        title: "Inconsistent invoice numbers",
        fix: "Use sequential numbering so your client can approve and track invoices easily.",
        impact: "Duplicate or random numbers cause reconciliation headaches and disputes.",
    },
    {
        title: "No follow-up system",
        fix: "Set reminders before and after the due date. Automation beats awkwardness.",
        impact: "Invoices without follow-up get paid 2-3 weeks later on average.",
    },
    {
        title: "Unclear VAT handling",
        fix: "If VAT registered, show VAT clearly. If not, don't accidentally add VAT.",
        impact: "VAT errors can trigger SARS queries and damage client trust.",
    },
    {
        title: "Too many choices on the invoice",
        fix: "One clear 'Amount Due' and one clear 'How to Pay.' Reduce decision fatigue.",
        impact: "Confusion leads to inaction. Make paying the obvious next step.",
    },
]

const quickFixes = [
    {
        time: "30 seconds",
        action: "Add your banking details to your invoice template",
    },
    {
        time: "1 minute",
        action: "Set up automatic invoice numbering in Illumi",
    },
    {
        time: "2 minutes",
        action: "Create a payment reminder schedule (before, on, after due date)",
    },
    {
        time: "5 minutes",
        action: "Review your last 5 invoices for these 7 mistakes",
    },
]

export default function InvoiceMistakesPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            4 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Invoicing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        7 Invoice Mistakes That Quietly Kill Your Cash Flow
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        If invoices are going out but money isn’t coming in, it’s usually one of these.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconAlertTriangle className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">The goal: make paying effortless</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Great invoices reduce friction: clear terms, clear totals, clear payment instructions, and predictable follow-up.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        {mistakes.map((m) => (
                            <div key={m.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="font-semibold text-lg">{m.title}</div>
                                <p className="text-sm text-muted-foreground mt-2">{m.impact}</p>
                                <div className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <p className="text-sm text-foreground leading-relaxed"><strong>Fix:</strong> {m.fix}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-10">
                        <h3 className="text-xl font-semibold mb-4">Fix these in under 10 minutes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickFixes.map((qf) => (
                                <div key={qf.action} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                                    <div className="text-xs font-bold text-primary whitespace-nowrap">{qf.time}</div>
                                    <p className="text-sm text-muted-foreground">{qf.action}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/invoice-generator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Fix Your Invoice Template
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/getting-paid-faster">
                            <Button variant="outline">Read: Get Paid Faster</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Stop losing money to invoice mistakes</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi's invoice templates are designed to eliminate these mistakes automatically. 
                        Professional invoices, automatic numbering, and built-in reminders — all free.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Better Invoices Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
