import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconX,
    IconClock,
    IconScale,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Illumi vs QuickBooks Online: Which is Better for South African Businesses? | Illumi",
    description:
        "Compare Illumi and QuickBooks Online for South African freelancers and small businesses. See why Illumi's free plan, simpler interface, and local payment gateways make it the better choice.",
    keywords: [
        "Illumi vs QuickBooks",
        "QuickBooks alternative South Africa",
        "best invoicing software South Africa",
        "QuickBooks Online comparison",
        "free invoicing software South Africa",
        "simple invoicing software",
        "QuickBooks too complicated",
    ],
}

const comparisonData = [
    {
        feature: "Free plan",
        illumi: "Yes",
        competitor: "No",
        illumiWins: true,
    },
    {
        feature: "Simple invoicing-first product",
        illumi: "Yes",
        competitor: "Full accounting suite",
        illumiWins: true,
    },
    {
        feature: "Lower monthly cost",
        illumi: "R200/month",
        competitor: "Higher",
        illumiWins: true,
    },
    {
        feature: "Local SA payment gateways",
        illumi: "Yes",
        competitor: "No",
        illumiWins: true,
    },
    {
        feature: "Faster setup",
        illumi: "Minutes",
        competitor: "Longer onboarding",
        illumiWins: true,
    },
    {
        feature: "No accounting complexity",
        illumi: "Yes",
        competitor: "Accounting required",
        illumiWins: true,
    },
]

const keyDifferences = [
    {
        title: "Invoicing vs Full Accounting",
        description: "QuickBooks Online is a comprehensive accounting platform with invoicing as one feature. Illumi is purpose-built for invoicing — simpler, faster, and easier to use.",
    },
    {
        title: "Free Plan Available",
        description: "QuickBooks doesn't offer a free plan. Illumi's free plan includes unlimited invoices, unlimited clients, and expense tracking — forever, no credit card required.",
    },
    {
        title: "Local Payment Gateways",
        description: "QuickBooks doesn't support South African payment providers like PayFast, Yoco, or Ozow. Your local clients can't pay invoices online conveniently.",
    },
    {
        title: "Setup in Minutes, Not Hours",
        description: "QuickBooks requires significant setup: chart of accounts, bank connections, tax settings. Illumi gets you invoicing in under 5 minutes.",
    },
]

const complexityComparison = [
    {
        aspect: "Learning Curve",
        illumi: "Minimal — intuitive interface",
        quickbooks: "Steep — accounting knowledge helpful",
    },
    {
        aspect: "Setup Time",
        illumi: "Under 5 minutes",
        quickbooks: "Hours to days",
    },
    {
        aspect: "Features You'll Use",
        illumi: "All of them",
        quickbooks: "Maybe 20%",
    },
    {
        aspect: "Support Needed",
        illumi: "Rarely",
        quickbooks: "Often",
    },
]

export default function IllumiVsQuickBooksPost() {
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
                        <span className="px-2 py-1 rounded bg-muted">Comparison</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Illumi vs QuickBooks Online: Which is Better for South African Businesses?
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        QuickBooks is the world's most popular accounting software. But if you're a South African freelancer 
                        or small business owner who just needs to send invoices and get paid, is it overkill?
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none mb-10">
                        <p className="text-muted-foreground leading-relaxed">
                            QuickBooks Online is the industry standard for small business accounting. It's powerful, feature-rich, 
                            and used by millions of businesses worldwide. But here's the thing: <strong className="text-foreground">most 
                            freelancers and small business owners don't need full accounting software</strong>. They need to create 
                            invoices, track expenses, and get paid.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            QuickBooks is designed for businesses that need double-entry accounting, bank reconciliation, 
                            financial statements, and tax preparation. If that's you, QuickBooks might be the right choice. 
                            But if you're a consultant, freelancer, or small service business, you're paying for complexity 
                            you'll never use.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            There's also the South African market consideration. QuickBooks doesn't integrate with local payment 
                            providers like PayFast, Yoco, or Ozow. For your SA clients, this means no convenient "Pay Now" 
                            button — just manual bank transfers and the delays that come with them.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-10">
                        <div className="bg-muted/50 px-6 py-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <IconScale className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-bold">Feature Comparison</h2>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-6 py-4 font-semibold">Feature</th>
                                        <th className="text-left px-6 py-4 font-semibold text-primary">Illumi</th>
                                        <th className="text-left px-6 py-4 font-semibold">QuickBooks Online</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, index) => (
                                        <tr key={row.feature} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                            <td className="px-6 py-4 font-medium">{row.feature}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <IconCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                                                    <span className="text-foreground">{row.illumi}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <IconX className="h-5 w-5 text-red-500 shrink-0" />
                                                    <span className="text-muted-foreground">{row.competitor}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none mb-10">
                        <p className="text-muted-foreground leading-relaxed">
                            This isn't about which platform is "better" in absolute terms — it's about which is better for 
                            your specific needs. If you need full accounting, QuickBooks delivers. If you need simple, 
                            effective invoicing with local payment options, Illumi is the smarter choice.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8">Key Differences Explained</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {keyDifferences.map((diff) => (
                            <div key={diff.title} className="rounded-2xl border border-border bg-card p-6">
                                <h3 className="font-semibold text-lg mb-2">{diff.title}</h3>
                                <p className="text-sm text-muted-foreground">{diff.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Complexity Comparison</h2>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-10">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-6 py-4 font-semibold">Aspect</th>
                                        <th className="text-left px-6 py-4 font-semibold text-primary">Illumi</th>
                                        <th className="text-left px-6 py-4 font-semibold">QuickBooks Online</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complexityComparison.map((row, index) => (
                                        <tr key={row.aspect} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                            <td className="px-6 py-4 font-medium">{row.aspect}</td>
                                            <td className="px-6 py-4 text-foreground">{row.illumi}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{row.quickbooks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none mb-10">
                        <h2 className="text-2xl font-bold mb-4">Why Illumi is the Better Choice for South African Freelancers & Small Businesses</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The fundamental question is: do you need accounting software, or do you need invoicing software? 
                            For most freelancers, consultants, and small service businesses, the answer is invoicing. You need 
                            to create professional invoices, send them to clients, and get paid. That's it.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            QuickBooks is designed for businesses that need to track inventory, manage payroll, reconcile bank 
                            accounts, and prepare financial statements. These are powerful features, but they come with a 
                            learning curve and ongoing complexity. If you're not using them, you're paying for software that 
                            makes your life harder, not easier.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Illumi takes the opposite approach. We focus on doing a few things exceptionally well: creating 
                            professional invoices in ZAR, tracking expenses, calculating net profit, and helping you get paid 
                            faster with local payment gateways. No chart of accounts to set up, no bank reconciliation to 
                            learn, no accounting jargon to decipher.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The payment gateway issue is particularly important for South African businesses. QuickBooks 
                            integrates with international payment processors, but not with PayFast, Yoco, or Ozow. Your local 
                            clients can't pay conveniently online, which means slower payments and more cash flow stress.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-10">
                        <h3 className="text-xl font-bold mb-4">The Bottom Line</h3>
                        <p className="text-muted-foreground mb-6">
                            QuickBooks Online is excellent accounting software for businesses that need full accounting 
                            capabilities. But for South African freelancers and SMBs who need simple, effective invoicing 
                            with local payment options, it's overkill. Illumi gives you everything you need to invoice 
                            professionally and get paid faster — without the complexity or cost.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button variant="outline">View Pricing</Button>
                            </Link>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Comparisons focus on features most relevant to South African freelancers and small businesses. 
                        Feature availability may vary by region and plan.
                    </p>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to simplify your invoicing?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join 2,500+ South African businesses using Illumi to create professional invoices and get paid faster. 
                        Start free today — no credit card required.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Get Started for Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
