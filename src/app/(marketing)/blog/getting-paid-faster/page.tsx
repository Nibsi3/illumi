import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconCreditCardPay,
    IconFileInvoice,
    IconMessageCircle,
    IconReceiptTax,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Get Paid Faster in South Africa: 11 Tactics That Actually Work | Illumi",
    description:
        "Stop waiting 30+ days to get paid. Practical, South Africa-friendly invoicing tactics to reduce late payments, improve cash flow, and get paid faster.",
    keywords: [
        "get paid faster",
        "late payments South Africa",
        "invoice payment terms",
        "how to get clients to pay",
        "payment reminders",
        "cash flow tips",
        "small business invoicing South Africa",
    ],
    alternates: {
        canonical: "/blog/getting-paid-faster",
    },
}

const tactics = [
    {
        title: "Put the due date in 3 places",
        detail:
            "Add the due date near the invoice total, in your email/WhatsApp message, and in the payment terms block. The fewer excuses, the faster you get paid.",
    },
    {
        title: "Use smaller milestones (even for services)",
        detail:
            "Split work into milestones and invoice per milestone. Clients approve smaller invoices faster than a big surprise at the end.",
    },
    {
        title: "Add a deposit line item",
        detail:
            "For projects, invoice a deposit upfront. It filters out non-serious clients and improves cash flow immediately.",
    },
    {
        title: "Offer card / instant EFT options",
        detail:
            "When payment is easy, it happens faster. Give clients a link or clear banking details so they don't “wait for finance.”",
    },
    {
        title: "Automate reminders (politely)",
        detail:
            "Send reminders before the due date, on the due date, and a short follow-up after. Consistency beats confrontation.",
    },
    {
        title: "Invoice the same day you finish",
        detail:
            "The longer you wait to invoice, the longer you wait to get paid. Send invoices within 24 hours of completing work — while the value is still fresh in the client's mind.",
    },
    {
        title: "Use professional invoice software",
        detail:
            "Handwritten invoices or messy spreadsheets signal 'pay me whenever.' Professional invoices with clear branding signal 'I run a real business.'",
    },
    {
        title: "Add late payment terms upfront",
        detail:
            "State your late payment policy on the invoice (e.g., 'Interest of 2% per month on overdue amounts'). Most clients will pay on time to avoid it.",
    },
    {
        title: "Send invoices on Monday mornings",
        detail:
            "Research shows invoices sent early in the week get paid faster. Avoid Friday afternoons — they get buried over the weekend.",
    },
    {
        title: "Follow up with a phone call after 7 days",
        detail:
            "Email is easy to ignore. A polite phone call after a week shows you're serious and often uncovers issues blocking payment.",
    },
    {
        title: "Offer early payment discounts",
        detail:
            "A 2% discount for payment within 7 days can accelerate cash flow significantly. Many clients will take the discount.",
    },
]

const checklist = [
    "Invoice number + due date clearly visible",
    "Short, specific line items (no vague “services rendered”)",
    "VAT clearly shown (if you’re registered)",
    "Banking details or payment link included",
    "Payment terms (e.g. Due on receipt / Net 7 / Net 14)",
    "A friendly note + what happens next",
    "Your business name and contact details",
    "Client's correct business name and reference number",
    "Purchase order number (if the client requires one)",
    "Clear description of deliverables with dates",
]

const realWorldExamples = [
    {
        scenario: "Freelance designer waiting 60+ days",
        problem: "Sent invoice with 'Net 30' to a new client with no deposit.",
        solution: "Now invoices 50% deposit upfront, balance due on delivery. Average payment time dropped to 5 days.",
    },
    {
        scenario: "Contractor losing R50k in outstanding invoices",
        problem: "No follow-up system. Invoices sent and forgotten.",
        solution: "Set up automated reminders at -3, 0, +3, +7 days. Recovered 80% of outstanding within 2 weeks.",
    },
    {
        scenario: "Consultant with 'slow-paying' corporate client",
        problem: "Net 30 terms but finance department needed PO number.",
        solution: "Added PO field to invoice template. Payments now arrive within terms.",
    },
]

export default function GettingPaidFasterPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-4xl mx-auto relative">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            8 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Cash Flow</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Get Paid Faster in South Africa: 11 Tactics That Actually Work
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        If you’re tired of “we’ll pay you next week”, this is your playbook. These tactics are designed for SA freelancers,
                        contractors, and small businesses.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-bold mb-4">The real reason clients pay late</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Most late payments aren’t malicious — they’re friction. Confusing invoices, missing terms, unclear banking details,
                            and no follow-up process turn “I’ll pay now” into “I’ll pay later.”
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconFileInvoice className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Clarity</div>
                            <div className="text-sm text-muted-foreground">Clear totals, due dates, and line items reduce back-and-forth.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconCreditCardPay className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Convenience</div>
                            <div className="text-sm text-muted-foreground">If paying takes 3 steps, many clients won’t do step 1 today.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconMessageCircle className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Consistency</div>
                            <div className="text-sm text-muted-foreground">A predictable reminder process prevents invoices “slipping.”</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Top tactics</h2>
                    <div className="space-y-4">
                        {tactics.map((t) => (
                            <div key={t.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="text-lg font-semibold mb-2">{t.title}</div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{t.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Invoice checklist (copy/paste)</h2>
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <ul className="space-y-3">
                            {checklist.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <div className="flex items-start gap-3">
                            <IconReceiptTax className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Don’t forget VAT</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    If you’re VAT registered, your invoice needs the right VAT details. If you’re not VAT registered yet,
                                    keep your invoices clean and consistent so you can transition easily later.
                                </p>
                                <div className="mt-4">
                                    <Link href="/sales-tax-calculator" className="text-sm text-primary hover:underline">
                                        Use the Sales Tax Calculator →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/invoice-generator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Create a Better Invoice Now
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invoicing-software/freelancers">
                            <Button variant="outline">Invoicing for Freelancers</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Real-world examples from SA businesses</h2>
                    <div className="space-y-6">
                        {realWorldExamples.map((ex) => (
                            <div key={ex.scenario} className="rounded-2xl border border-border bg-card p-6">
                                <div className="text-lg font-semibold mb-3">{ex.scenario}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs font-medium text-destructive uppercase mb-1">Problem</div>
                                        <p className="text-sm text-muted-foreground">{ex.problem}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-primary uppercase mb-1">Solution</div>
                                        <p className="text-sm text-muted-foreground">{ex.solution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to get paid faster?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi helps South African freelancers and small businesses create professional invoices, 
                        automate reminders, and accept online payments — all for free.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
