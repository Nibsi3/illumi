import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconCoin,
    IconScale,
    IconTarget,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "How to Price Your Services as a South African Freelancer | Illumi",
    description:
        "A practical guide to pricing freelance services in South Africa. Learn cost-plus, value-based, and market-rate strategies to charge what you're worth in ZAR.",
    keywords: [
        "pricing freelance services South Africa",
        "how to set freelance rates",
        "freelancer pricing strategy",
        "charge what you're worth",
        "freelance rates ZAR",
        "South African freelancer pricing",
        "value based pricing",
    ],
    alternates: {
        canonical: "/blog/how-to-price-your-services",
    },
}

const strategies = [
    {
        title: "Cost-plus pricing",
        detail:
            "Calculate every expense — software, data, transport, tax — then add a profit margin. This is the floor: never charge less than this number.",
    },
    {
        title: "Market-rate pricing",
        detail:
            "Research what other freelancers in your field charge in South Africa. Sites like Offerzen, PayScale, and local Facebook groups give real data. Position yourself relative to the market.",
    },
    {
        title: "Value-based pricing",
        detail:
            "Price based on the value you deliver, not the hours you spend. A logo that helps a client win R500k in contracts is worth more than 4 hours of design time.",
    },
    {
        title: "Tiered packages",
        detail:
            "Offer 3 packages (Basic, Standard, Premium). Most clients pick the middle option. This anchors your price and gives clients control without haggling.",
    },
    {
        title: "Project-based pricing",
        detail:
            "Quote a fixed price for the full scope of work. Clients love certainty, and you're rewarded for working efficiently rather than padding hours.",
    },
    {
        title: "Retainer agreements",
        detail:
            "Offer a monthly retainer for ongoing work. You get predictable income; they get priority access. Win-win for both sides.",
    },
]

const mistakes = [
    "Pricing based on what you'd personally pay (your client's budget is not yours)",
    "Not accounting for tax — SARS takes 25-45% depending on your bracket",
    "Forgetting non-billable hours: admin, quoting, revisions, meetings",
    "Dropping your rate to win a client who will undervalue your work forever",
    "Not raising prices annually — inflation in SA erodes your real income",
    "Quoting before understanding the full scope of work",
]

const formulas = [
    {
        label: "Minimum hourly rate",
        formula: "(Monthly expenses + Tax + Profit) ÷ Billable hours per month",
        example: "(R25,000 + R8,000 + R7,000) ÷ 120 = R333/hr",
    },
    {
        label: "Day rate",
        formula: "Hourly rate × 8 hours × 1.2 (buffer for admin)",
        example: "R333 × 8 × 1.2 = R3,200/day",
    },
    {
        label: "Project rate",
        formula: "Estimated hours × Hourly rate × 1.3 (scope creep buffer)",
        example: "40 hours × R333 × 1.3 = R17,316",
    },
]

export default function HowToPriceServicesPost() {
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
                            7 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        How to Price Your Services as a South African Freelancer
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Undercharging is the #1 freelancer mistake in SA. Here&apos;s how to calculate your real costs,
                        pick a pricing strategy, and confidently quote clients in ZAR.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-bold mb-4">Why most SA freelancers undercharge</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Load shedding costs, data costs, and the &quot;but I work from home&quot; mindset lead many South African
                            freelancers to set rates far below their true cost of doing business. If you don&apos;t account for
                            tax, non-billable hours, and annual inflation, you&apos;re working for less than you think.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconCoin className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Know your floor</div>
                            <div className="text-sm text-muted-foreground">Calculate the minimum you need to survive, then never go below it.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconScale className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Price for value</div>
                            <div className="text-sm text-muted-foreground">Clients pay for outcomes, not hours. Frame your pricing around results.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconTarget className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Review annually</div>
                            <div className="text-sm text-muted-foreground">SA inflation runs 5-7% a year. If you don&apos;t raise rates, you take a pay cut.</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">6 pricing strategies that work</h2>
                    <div className="space-y-4">
                        {strategies.map((s) => (
                            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="text-lg font-semibold mb-2">{s.title}</div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Quick pricing formulas</h2>
                    <div className="space-y-4">
                        {formulas.map((f) => (
                            <div key={f.label} className="rounded-2xl border border-border bg-card p-6">
                                <div className="text-sm font-medium text-primary uppercase mb-1">{f.label}</div>
                                <div className="font-semibold mb-1 font-mono text-sm">{f.formula}</div>
                                <div className="text-sm text-muted-foreground">Example: {f.example}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mt-12 mb-6">6 pricing mistakes to avoid</h2>
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <ul className="space-y-3">
                            {mistakes.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-destructive mt-0.5" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/hourly-rate-calculator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Calculate Your Hourly Rate
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/freelancer-rates">
                            <Button variant="outline">Freelancer Rate Guide</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Price confidently. Invoice professionally.</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi helps South African freelancers create professional invoices that match their pricing strategy — free forever.
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
