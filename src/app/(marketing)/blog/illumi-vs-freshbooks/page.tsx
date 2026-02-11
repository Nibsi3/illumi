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
    title: "Illumi vs FreshBooks: Which is Better for South African Businesses? | Illumi",
    description:
        "Compare Illumi and FreshBooks for South African freelancers and small businesses. See why Illumi's free plan, local payment gateways, and lower pricing make it the better choice.",
    keywords: [
        "Illumi vs FreshBooks",
        "FreshBooks alternative South Africa",
        "best invoicing software South Africa",
        "FreshBooks comparison",
        "free invoicing software South Africa",
        "PayFast invoicing",
        "affordable invoicing software",
    ],
    alternates: {
        canonical: "/blog/illumi-vs-freshbooks",
    },
    openGraph: {
        title: "Illumi vs FreshBooks: Which is Better for South African Businesses?",
        description: "Compare Illumi and FreshBooks for SA freelancers. See why free plans and local payment gateways make Illumi better.",
        type: "article",
    },
}

const comparisonData = [
    {
        feature: "Free plan",
        illumi: "Yes",
        competitor: "No",
        illumiWins: true,
    },
    {
        feature: "Lower cost",
        illumi: "R200/month",
        competitor: "Significantly higher",
        illumiWins: true,
    },
    {
        feature: "SA payment gateways",
        illumi: "Yes",
        competitor: "No",
        illumiWins: true,
    },
    {
        feature: "No annual commitment",
        illumi: "Yes",
        competitor: "Encourages annual",
        illumiWins: true,
    },
    {
        feature: "Lightweight invoicing focus",
        illumi: "Yes",
        competitor: "Accounting-heavy",
        illumiWins: true,
    },
    {
        feature: "Built for SA SMBs",
        illumi: "Yes",
        competitor: "US/Global focus",
        illumiWins: true,
    },
]

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Illumi vs FreshBooks: Which is Better for South African Businesses?",
    "description": "Compare Illumi and FreshBooks for South African freelancers and small businesses. See why Illumi's free plan, local payment gateways, and lower pricing make it the better choice.",
    "author": {
        "@type": "Organization",
        "name": "Illumi",
        "url": "https://illumi.co.za"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Illumi",
        "logo": {
            "@type": "ImageObject",
            "url": "https://illumi.co.za/logo.png"
        }
    },
    "datePublished": "2026-01-28",
    "dateModified": "2026-01-28",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://illumi.co.za/blog/illumi-vs-freshbooks"
    }
}

const keyDifferences = [
    {
        title: "Free Plan Available",
        description: "FreshBooks doesn't offer a free plan — only a 30-day trial. Illumi's free plan includes unlimited invoices and clients forever, with no credit card required.",
    },
    {
        title: "Dramatically Lower Pricing",
        description: "FreshBooks starts at $19/month USD (approximately R350+) for their Lite plan. Illumi Pro is just R200/month — nearly half the cost with more relevant features for SA businesses.",
    },
    {
        title: "Local Payment Gateways",
        description: "FreshBooks supports Stripe and PayPal, but not South African providers like PayFast, Yoco, or Ozow. Your local clients can't pay conveniently online.",
    },
    {
        title: "Invoicing-First, Not Accounting-Heavy",
        description: "FreshBooks has evolved into a full accounting platform with features most freelancers never use. Illumi stays focused on invoicing and expense tracking — simple and effective.",
    },
]

const pricingComparison = [
    {
        plan: "Free / Starter",
        illumi: "R0/month — Unlimited invoices, unlimited clients, expense tracking",
        freshbooks: "No free plan — 30-day trial only",
    },
    {
        plan: "Paid Plan",
        illumi: "R200/month — Online payments, recurring invoices, client portal",
        freshbooks: "~R350+/month — Lite plan with limited clients",
    },
    {
        plan: "Annual Commitment",
        illumi: "Not required — Cancel anytime",
        freshbooks: "Encouraged for best pricing",
    },
]

export default function IllumiVsFreshBooksPost() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
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
                        Illumi vs FreshBooks: Which is Better for South African Businesses?
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        FreshBooks is one of the most well-known invoicing platforms globally. But with its US-centric design 
                        and premium pricing, is it the right choice for South African freelancers and SMBs?
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none mb-10">
                        <p className="text-muted-foreground leading-relaxed">
                            FreshBooks has been around since 2003 and has built a strong reputation in the North American market. 
                            It's evolved from a simple invoicing tool into a comprehensive accounting platform used by millions 
                            of businesses worldwide. However, this evolution has come with increased complexity and pricing 
                            that may not make sense for South African businesses.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The first thing you'll notice is <strong className="text-foreground">FreshBooks doesn't have a free plan</strong>. 
                            You get a 30-day trial, and then you're paying. For freelancers just starting out or small businesses 
                            watching their expenses, this is a significant barrier. Illumi offers a genuinely free plan with 
                            unlimited invoices and clients — forever.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Then there's the payment gateway issue. FreshBooks integrates with Stripe and PayPal, but not with 
                            South African providers like PayFast, Yoco, or Ozow. For your local clients, this means no convenient 
                            online payment option — they're stuck with manual bank transfers.
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
                                        <th className="text-left px-6 py-4 font-semibold">FreshBooks</th>
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
                            The comparison highlights a fundamental difference in approach. FreshBooks is built for the US market 
                            with global expansion as an afterthought. Illumi is built specifically for South African businesses, 
                            with local payment gateways, ZAR as the default currency, and pricing that makes sense for our market.
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
                    <h2 className="text-2xl font-bold mb-6">Pricing Comparison</h2>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-10">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-6 py-4 font-semibold">Plan Type</th>
                                        <th className="text-left px-6 py-4 font-semibold text-primary">Illumi</th>
                                        <th className="text-left px-6 py-4 font-semibold">FreshBooks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricingComparison.map((row, index) => (
                                        <tr key={row.plan} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                            <td className="px-6 py-4 font-medium">{row.plan}</td>
                                            <td className="px-6 py-4 text-foreground">{row.illumi}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{row.freshbooks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none mb-10">
                        <h2 className="text-2xl font-bold mb-4">Why Illumi is the Better Choice for South African Freelancers & Small Businesses</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The pricing difference alone is compelling. FreshBooks' Lite plan costs approximately R350+ per month 
                            (at current exchange rates), and that's their most basic paid tier. Illumi Pro is R200/month — and 
                            you can use Illumi's free plan indefinitely if you don't need online payments.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            But it's not just about price. FreshBooks has evolved into a full accounting platform with features 
                            like double-entry accounting, bank reconciliation, and financial reporting. If you're a freelancer 
                            or small business owner who just needs to send invoices and get paid, this complexity is unnecessary 
                            and can slow you down.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The payment gateway issue is critical for South African businesses. Without PayFast, Yoco, or Ozow 
                            integration, your clients can't pay invoices online using local payment methods. This adds friction 
                            to the payment process and can significantly delay when you get paid.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            FreshBooks also encourages annual billing for the best rates, locking you into a 12-month commitment. 
                            Illumi offers simple monthly pricing with no lock-in — cancel anytime if it's not working for you.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-10">
                        <h3 className="text-xl font-bold mb-4">The Bottom Line</h3>
                        <p className="text-muted-foreground mb-6">
                            FreshBooks is a powerful platform for businesses in North America who need full accounting capabilities. 
                            But for South African freelancers and SMBs who need simple, affordable invoicing with local payment 
                            options, Illumi is the clear winner. Lower cost, local payment gateways, and a genuinely free plan 
                            make it the practical choice.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/invoices/new">
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
                        Feature availability may vary by region and plan. Pricing converted at approximate exchange rates.
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
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create My First Invoice
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
