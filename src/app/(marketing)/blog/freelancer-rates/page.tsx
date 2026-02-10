import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCalculator,
    IconCheck,
    IconClock,
    IconCurrencyDollar,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Freelancer Rates in South Africa: The ‘R/hr’ Formula Clients Can’t Argue With | Illumi",
    description:
        "Stop undercharging. Use this practical South African freelancer rate formula (with examples) and send invoices that get paid faster.",
    keywords: [
        "freelancer rates South Africa",
        "hourly rate calculator",
        "how to price freelance work",
        "freelancer invoicing",
        "raise your rates",
        "South African freelancers",
    ],
    alternates: {
        canonical: "/blog/freelancer-rates",
    },
}

const steps = [
    {
        title: "Start with your target monthly income",
        text: "Decide what you want to take home (and what your business needs to earn).",
    },
    {
        title: "Add expenses + taxes",
        text: "Software, internet, equipment, accounting, marketing, plus a buffer for tax/provisional tax.",
    },
    {
        title: "Divide by billable hours (not hours worked)",
        text: "Most freelancers only bill 40–60% of their time. Admin and sales still count.",
    },
    {
        title: "Add a risk + demand multiplier",
        text: "Rush work, complex projects, or high-demand skills justify higher rates.",
    },
]

const quickWins = [
    "Quote fixed project pricing with clear scope",
    "Invoice deposits before starting",
    "Use milestones so clients approve smaller invoices faster",
    "Put the due date next to the total",
    "Automate reminders instead of feeling awkward",
]

export default function FreelancerRatesPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            7 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Freelancer Rates in South Africa: The “R/hr” Formula Clients Can’t Argue With
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        If your rate makes you nervous to say out loud, it’s probably too low. Here’s a simple, defensible way to price your work.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <div className="flex items-start gap-3">
                                <IconCurrencyDollar className="h-6 w-6 text-primary mt-0.5" />
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">The mistake most freelancers make</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        They price based on what the client wants to pay, not what their business needs to earn. That’s how you end up working more for less.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <div className="flex items-start gap-3">
                                <IconCalculator className="h-6 w-6 text-primary mt-0.5" />
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Use a rate formula</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        When your price has a clear rationale, it’s easier to defend and easier for the client to approve.
                                    </p>
                                </div>
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
                        <h3 className="text-xl font-semibold mb-4">Quick wins that instantly increase your effective rate</h3>
                        <ul className="space-y-3">
                            {quickWins.map((w) => (
                                <li key={w} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <span className="text-muted-foreground">{w}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/hourly-rate-calculator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Use the Hourly Rate Calculator
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invoicing-software/freelancers">
                            <Button variant="outline">Invoicing for Freelancers</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
