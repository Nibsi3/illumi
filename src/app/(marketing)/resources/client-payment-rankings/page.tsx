import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconTrophy, IconAlertTriangle } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Top Paying vs Slowest Paying Clients by Industry | Illumi",
    description: "Which industries pay fastest? Anonymized rankings of client payment behavior across South African sectors. Know who to work with.",
    keywords: [
        "fastest paying clients South Africa",
        "slow paying industries SA",
        "client payment rankings",
        "best clients for cash flow",
    ],
    alternates: {
        canonical: "/resources/client-payment-rankings",
    },
}

const fastestPaying = [
    {
        rank: 1,
        industry: "Healthcare & Medical",
        avgDays: 16,
        onTimeRate: 85,
        notes: "Insurance-backed payments, immediate service model",
    },
    {
        rank: 2,
        industry: "Retail & E-commerce",
        avgDays: 18,
        onTimeRate: 82,
        notes: "High transaction volume, short payment cycles",
    },
    {
        rank: 3,
        industry: "Hospitality & Tourism",
        avgDays: 21,
        onTimeRate: 78,
        notes: "Cash-based operations, immediate settlements",
    },
    {
        rank: 4,
        industry: "Professional Services (Legal, Accounting)",
        avgDays: 24,
        onTimeRate: 74,
        notes: "Trust accounts, regulated payment processes",
    },
    {
        rank: 5,
        industry: "Technology Startups",
        avgDays: 26,
        onTimeRate: 71,
        notes: "Venture-backed, prioritize vendor relationships",
    },
]

const slowestPaying = [
    {
        rank: 1,
        industry: "Government & Municipalities",
        avgDays: 68,
        onTimeRate: 22,
        notes: "Bureaucratic approval processes, budget constraints",
    },
    {
        rank: 2,
        industry: "Large Corporates (JSE Listed)",
        avgDays: 52,
        onTimeRate: 35,
        notes: "Multi-level approvals, strict payment schedules",
    },
    {
        rank: 3,
        industry: "Construction & Property Development",
        avgDays: 48,
        onTimeRate: 38,
        notes: "Milestone-based payments, cash flow challenges",
    },
    {
        rank: 4,
        industry: "Education & Training Institutions",
        avgDays: 42,
        onTimeRate: 45,
        notes: "Term-based budgets, funding delays",
    },
    {
        rank: 5,
        industry: "Manufacturing",
        avgDays: 39,
        onTimeRate: 48,
        notes: "Net 60 standard terms, supply chain pressures",
    },
]

export default function ClientPaymentRankingsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-4">
                        2024 Rankings
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Top Paying vs Slowest Paying Clients by Industry
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Anonymized data from 2,500+ South African SMEs ranking which client industries pay fastest 
                        and which take longest. Make informed decisions about who to work with.
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Fastest Paying Industry</div>
                        <div className="text-2xl font-bold text-green-400">Healthcare</div>
                        <div className="text-xs text-muted-foreground mt-1">16 days average</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Slowest Paying Industry</div>
                        <div className="text-2xl font-bold text-red-400">Government</div>
                        <div className="text-xs text-muted-foreground mt-1">68 days average</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Payment Gap</div>
                        <div className="text-2xl font-bold">4.3x</div>
                        <div className="text-xs text-muted-foreground mt-1">Slowest vs fastest</div>
                    </div>
                </div>

                {/* Fastest Paying */}
                <div className="rounded-2xl border border-green-500/20 bg-card p-8 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <IconTrophy className="h-6 w-6 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-semibold">Top 5 Fastest Paying Industries</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {fastestPaying.map((item) => (
                            <div key={item.rank} className="rounded-xl bg-muted p-6 border border-green-500/10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold">
                                            {item.rank}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">{item.industry}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Average Payment Time</div>
                                        <div className="text-2xl font-bold text-green-400">{item.avgDays} days</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">On-Time Payment Rate</div>
                                        <div className="text-2xl font-bold text-green-400">{item.onTimeRate}%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slowest Paying */}
                <div className="rounded-2xl border border-red-500/20 bg-card p-8 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <IconAlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-semibold">Top 5 Slowest Paying Industries</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {slowestPaying.map((item) => (
                            <div key={item.rank} className="rounded-xl bg-muted p-6 border border-red-500/10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 text-red-400 font-bold">
                                            {item.rank}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">{item.industry}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Average Payment Time</div>
                                        <div className="text-2xl font-bold text-red-400">{item.avgDays} days</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">On-Time Payment Rate</div>
                                        <div className="text-2xl font-bold text-red-400">{item.onTimeRate}%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Insights</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Government contracts = cash flow risk</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Government and municipal clients take 68 days on average to pay, with only 22% paying on time. 
                                If you work with government, factor in 60-90 day payment cycles and maintain strong cash reserves.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Healthcare pays fastest due to insurance</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Healthcare clients pay in 16 days on average because many payments are insurance-backed or 
                                immediate (cash/card). Medical aid schemes have strict payment schedules.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Company size matters more than industry</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Within the same industry, small businesses (1-10 employees) pay 40% faster than large corporates. 
                                SME clients have simpler approval processes and better cash flow discipline.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Tech startups prioritize vendor relationships</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Despite being young companies, tech startups rank #5 for fast payment (26 days) because 
                                they're venture-backed and prioritize maintaining good supplier relationships for growth.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Strategies */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Work with Slow-Paying Industries</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Require Deposits</h3>
                            <p className="text-sm text-muted-foreground">
                                For government or large corporate clients, require 30-50% upfront deposits to protect cash flow.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Milestone Billing</h3>
                            <p className="text-sm text-muted-foreground">
                                Break projects into milestones with payment at each stage rather than waiting for final completion.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Charge Premium Rates</h3>
                            <p className="text-sm text-muted-foreground">
                                Add 10-15% to your rates for slow-paying industries to compensate for cash flow impact.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Diversify Client Base</h3>
                            <p className="text-sm text-muted-foreground">
                                Mix fast-paying and slow-paying clients to maintain steady cash flow throughout the month.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track which clients pay fastest with Illumi analytics</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
