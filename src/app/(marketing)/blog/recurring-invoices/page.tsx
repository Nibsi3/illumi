import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconRepeat,
    IconCalendarEvent,
    IconCurrencyDollar,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Recurring Invoices: The 'Set It and Forget It' Secret to Predictable Income | Illumi",
    description:
        "Stop manually creating the same invoice every month. Learn how recurring invoices can save you hours and guarantee predictable cash flow for your South African business.",
    keywords: [
        "recurring invoices",
        "automatic invoicing",
        "subscription billing",
        "retainer invoicing",
        "monthly invoices",
        "predictable income",
        "South Africa invoicing",
    ],
    alternates: {
        canonical: "/blog/recurring-invoices",
    },
}

const benefits = [
    {
        title: "Never forget to invoice again",
        description: "Invoices go out automatically on your schedule — even when you're on holiday.",
    },
    {
        title: "Predictable cash flow",
        description: "Know exactly what's coming in each month. Plan your business with confidence.",
    },
    {
        title: "Save 2+ hours per month",
        description: "Stop recreating the same invoice. Set it once, let it run forever.",
    },
    {
        title: "Professional client experience",
        description: "Clients receive consistent, on-time invoices. No more 'sorry, forgot to send that.'",
    },
]

const useCases = [
    {
        type: "Monthly retainers",
        example: "R15,000/month marketing retainer — invoiced on the 1st, due on the 7th",
    },
    {
        type: "Subscription services",
        example: "R500/month software support — invoiced automatically, paid via card",
    },
    {
        type: "Ongoing maintenance",
        example: "R2,500/month website maintenance — same invoice, same client, zero effort",
    },
    {
        type: "Rent or lease payments",
        example: "R8,000/month equipment rental — tenant receives invoice like clockwork",
    },
]

const setupSteps = [
    "Create your first invoice as normal",
    "Toggle 'Make this recurring' in Illumi",
    "Set frequency (weekly, monthly, quarterly, yearly)",
    "Choose start date and optional end date",
    "Illumi handles the rest — forever",
]

export default function RecurringInvoicesPost() {
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
                            5 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Automation</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Recurring Invoices: The "Set It and Forget It" Secret to Predictable Income
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        If you're manually creating the same invoice every month, you're wasting hours and risking missed payments. 
                        Here's how to automate it.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconRepeat className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">The problem with manual invoicing</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Every month you remember (hopefully), open your template, update the date, send the email... 
                                    It's tedious, error-prone, and the first thing to slip when you're busy. 
                                    Recurring invoices eliminate this entirely.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {benefits.map((b) => (
                            <div key={b.title} className="rounded-2xl border border-border bg-card p-6">
                                <IconCheck className="h-6 w-6 text-primary mb-3" />
                                <div className="font-semibold mb-1">{b.title}</div>
                                <div className="text-sm text-muted-foreground">{b.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Perfect for these situations</h2>
                    <div className="space-y-4">
                        {useCases.map((uc) => (
                            <div key={uc.type} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-start gap-3">
                                    <IconCalendarEvent className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="font-semibold">{uc.type}</div>
                                        <p className="text-sm text-muted-foreground mt-1">{uc.example}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Set up recurring invoices in 2 minutes</h2>
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="space-y-4">
                            {setupSteps.map((step, i) => (
                                <div key={step} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <p className="text-muted-foreground pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <div className="flex items-start gap-3">
                            <IconCurrencyDollar className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Pro tip: Combine with online payments</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    When you pair recurring invoices with online payment links, clients can pay instantly. 
                                    Some Illumi users report getting paid within hours of the automatic invoice going out.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/invoices/new">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Set Up Recurring Invoices
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/features/invoicing">
                            <Button variant="outline">See All Invoicing Features</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Stop chasing the same invoice every month</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi's recurring invoices are free to use. Set them up once and enjoy predictable, 
                        automatic income — without lifting a finger.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Try Illumi Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
