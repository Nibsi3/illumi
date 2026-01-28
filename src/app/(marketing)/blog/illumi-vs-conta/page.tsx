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
    title: "Illumi vs Conta: Which Invoicing Software is Best for South Africa? | Illumi",
    description:
        "Compare Illumi and Conta for South African freelancers and small businesses. Discover why Illumi's unlimited free plan, local payment gateways, and expense tracking make it the superior choice.",
    keywords: [
        "Illumi vs Conta",
        "Conta alternative South Africa",
        "best invoicing software South Africa",
        "Conta comparison",
        "free invoicing software South Africa",
        "PayFast invoicing",
        "expense tracking software",
    ],
}

const comparisonData = [
    {
        feature: "Unlimited clients on Free",
        illumi: "Yes",
        competitor: "No (client cap)",
        illumiWins: true,
    },
    {
        feature: "Online payments",
        illumi: "Included (SA gateways)",
        competitor: "Not available",
        illumiWins: true,
    },
    {
        feature: "Expense tracking on Free",
        illumi: "Included",
        competitor: "Not included",
        illumiWins: true,
    },
    {
        feature: "Net profit calculation",
        illumi: "Built-in",
        competitor: "Not available",
        illumiWins: true,
    },
    {
        feature: "Payment automation",
        illumi: "Yes (Pro)",
        competitor: "Limited",
        illumiWins: true,
    },
    {
        feature: "Local payment gateways",
        illumi: "PayFast, Yoco, Ozow",
        competitor: "Not supported",
        illumiWins: true,
    },
]

const keyDifferences = [
    {
        title: "Online Payment Integration",
        description: "Conta doesn't offer online payment options for invoices. With Illumi, your clients can pay instantly via PayFast, Yoco, or Ozow — reducing payment times from weeks to hours.",
    },
    {
        title: "Expense Tracking Included Free",
        description: "Illumi includes full expense tracking on the free plan, allowing you to log business expenses and calculate net profit. Conta reserves this for paid tiers.",
    },
    {
        title: "No Client Limits",
        description: "Conta caps the number of clients you can manage on their free plan. Illumi gives you unlimited clients and unlimited invoices — no artificial restrictions.",
    },
    {
        title: "Net Profit Visibility",
        description: "Illumi automatically calculates your net profit by subtracting expenses from income. This gives you instant visibility into your actual business performance.",
    },
]

export default function IllumiVsContaPost() {
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
                        <span className="px-2 py-1 rounded bg-muted">Comparison</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Illumi vs Conta: Which Invoicing Software is Best for South Africa?
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Conta is a Scandinavian invoicing platform that's gained some traction globally. But how does it 
                        stack up against Illumi for South African freelancers and small businesses? Let's compare.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none mb-10">
                        <p className="text-muted-foreground leading-relaxed">
                            Conta has built a reputation as a simple, user-friendly invoicing tool. It's popular in Nordic 
                            countries and has expanded to serve businesses worldwide. However, when you're running a business 
                            in South Africa, you need software that understands your local context — and that's where Conta 
                            falls short.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The most critical limitation is <strong className="text-foreground">the lack of South African payment gateway support</strong>. 
                            Conta doesn't integrate with PayFast, Yoco, or Ozow, which means your clients can't pay invoices 
                            online using the payment methods they're familiar with. This alone can add days or weeks to your 
                            payment cycle.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Beyond payments, there are several other areas where Illumi provides a better experience for 
                            South African businesses. Let's look at the full comparison.
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
                                        <th className="text-left px-6 py-4 font-semibold">Conta</th>
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
                            The comparison reveals a clear pattern: Illumi offers more value for South African businesses, 
                            particularly when it comes to getting paid and tracking your finances. Let's dive deeper into 
                            the key differences.
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
                    <div className="prose prose-lg max-w-none mb-10">
                        <h2 className="text-2xl font-bold mb-4">Why Illumi is the Better Choice for South African Freelancers & Small Businesses</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For South African businesses, the ability to accept online payments is crucial. Late payments are 
                            one of the biggest challenges facing freelancers and SMBs, and offering a "Pay Now" button on your 
                            invoices can dramatically reduce payment times. Conta simply doesn't offer this capability for the 
                            South African market.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Expense tracking is another area where Illumi shines. Understanding your true profitability requires 
                            tracking both income and expenses. Illumi includes this on the free plan, giving you a complete 
                            picture of your business finances without paying extra.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The client cap on Conta's free plan is also problematic. As your business grows, you'll quickly 
                            hit that limit and be forced to upgrade. Illumi's free plan has no such restrictions — you can 
                            manage as many clients as you need, forever.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Finally, Illumi's net profit calculation feature gives you instant insight into how your business 
                            is actually performing. It's not just about how much you invoice — it's about how much you keep 
                            after expenses. This visibility is invaluable for making informed business decisions.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-10">
                        <h3 className="text-xl font-bold mb-4">The Bottom Line</h3>
                        <p className="text-muted-foreground mb-6">
                            Conta is a decent invoicing tool for businesses in its home market, but it lacks the features 
                            South African businesses need most: local payment gateways, expense tracking, and unlimited 
                            clients. Illumi delivers all of this and more, purpose-built for the South African market.
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
                    <h2 className="text-3xl font-bold mb-4">Ready to switch to Illumi?</h2>
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
