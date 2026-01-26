import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconMessageCircle } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Late-Paying Clients: The Follow-Up System That Works (Without Sounding Desperate) | Illumi",
    description:
        "A professional follow-up system for overdue invoices in South Africa. Message templates, timing, and escalation steps that protect relationships and get you paid.",
    keywords: [
        "late paying clients",
        "overdue invoice follow up",
        "how to chase payment",
        "payment reminders",
        "South Africa invoices",
        "get paid faster",
    ],
}

const steps = [
    {
        title: "Before due date: friendly reminder",
        text: "Send a short reminder 2–3 days before. Most payments happen because someone remembered.",
    },
    {
        title: "Due date: simple nudge",
        text: "Keep it factual: invoice number, amount, due date, payment link/banking details.",
    },
    {
        title: "3–5 days overdue: ask for a payment date",
        text: "Don’t ask ‘when will you pay?’ Ask ‘what date can we expect payment?’",
    },
    {
        title: "7–14 days overdue: escalation",
        text: "Pause work, with a calm message. You can resume once payment is received.",
    },
]

const templates = [
    "Hi <Name>, just a quick reminder that invoice <#> for R<amount> is due on <date>. Here are payment details: <...>. Thank you!",
    "Hi <Name>, invoice <#> is now overdue. Could you please confirm the date payment will be made?",
    "Hi <Name>, we’ve paused work until invoice <#> is settled. Once payment reflects, we’ll resume immediately.",
]

export default function LatePayingClientsPost() {
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
                        Late-Paying Clients: The Follow-Up System That Works (Without Sounding Desperate)
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        You don’t need to be aggressive — you need a system. Here’s a simple escalation ladder that keeps you professional and gets invoices paid.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconMessageCircle className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Golden rule</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    The invoice isn’t personal. Your follow-up shouldn’t be either. Keep it factual, consistent, and polite.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        {steps.map((s) => (
                            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="font-semibold">{s.title}</div>
                                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{s.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-10">
                        <h3 className="text-xl font-semibold mb-4">Message templates (copy/paste)</h3>
                        <ul className="space-y-3">
                            {templates.map((t) => (
                                <li key={t} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <span className="text-muted-foreground">{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/blog/getting-paid-faster">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                More Cash Flow Tactics
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invoice-generator">
                            <Button variant="outline">Improve Your Invoice</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
