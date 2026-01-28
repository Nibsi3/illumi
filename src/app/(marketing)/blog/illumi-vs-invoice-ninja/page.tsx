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
    title: "Illumi vs Invoice Ninja: Which is Better for South African Businesses? | Illumi",
    description:
        "Compare Illumi and Invoice Ninja for South African freelancers and small businesses. See why Illumi's local payment integrations, ZAR-first design, and unlimited free plan make it the better choice.",
    keywords: [
        "Illumi vs Invoice Ninja",
        "Invoice Ninja alternative South Africa",
        "best invoicing software South Africa",
        "Invoice Ninja comparison",
        "free invoicing software South Africa",
        "PayFast invoicing",
        "Yoco invoicing",
    ],
    alternates: {
        canonical: "/blog/illumi-vs-invoice-ninja",
    },
    openGraph: {
        title: "Illumi vs Invoice Ninja: Which is Better for South African Businesses?",
        description: "Compare Illumi and Invoice Ninja for SA freelancers. See why local payment gateways and unlimited free plans make Illumi the better choice.",
        type: "article",
    },
}

const comparisonData = [
    {
        feature: "Free plan usable for real businesses",
        illumi: "Unlimited clients & invoices",
        competitor: "Limited to 5 clients",
        illumiWins: true,
    },
    {
        feature: "Local South African payments",
        illumi: "PayFast, Yoco, Ozow",
        competitor: "Not supported",
        illumiWins: true,
    },
    {
        feature: "ZAR-first setup",
        illumi: "Native",
        competitor: "Currency conversion required",
        illumiWins: true,
    },
    {
        feature: "No annual lock-in",
        illumi: "Monthly pricing",
        competitor: "Best pricing requires annual",
        illumiWins: true,
    },
    {
        feature: "Simpler, focused UX",
        illumi: "Built for SA freelancers & SMBs",
        competitor: "Feature-heavy",
        illumiWins: true,
    },
    {
        feature: "Net profit calculation",
        illumi: "Built-in",
        competitor: "Not standard",
        illumiWins: true,
    },
]

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Illumi vs Invoice Ninja: Which is Better for South African Businesses?",
    "description": "Compare Illumi and Invoice Ninja for South African freelancers and small businesses. See why Illumi's local payment integrations, ZAR-first design, and unlimited free plan make it the better choice.",
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
        "@id": "https://illumi.co.za/blog/illumi-vs-invoice-ninja"
    }
}

const keyDifferences = [
    {
        title: "Local Payment Gateways",
        description: "Invoice Ninja doesn't support South African payment providers like PayFast, Yoco, or Ozow. This means your clients can't pay invoices online using local payment methods. Illumi integrates natively with all major SA payment gateways.",
    },
    {
        title: "Truly Unlimited Free Plan",
        description: "Invoice Ninja's free plan limits you to just 5 clients — not practical for any real business. Illumi's free plan includes unlimited clients, unlimited invoices, and full expense tracking.",
    },
    {
        title: "ZAR-First Design",
        description: "Invoice Ninja is built for a global audience, which means you'll need to configure currency settings and deal with conversion complexities. Illumi is built specifically for South African businesses with ZAR as the default.",
    },
    {
        title: "Simple Monthly Pricing",
        description: "Invoice Ninja pushes annual billing for the best rates. Illumi offers straightforward monthly pricing at R200/month with no lock-in contracts.",
    },
]

export default function IllumiVsInvoiceNinjaPost() {
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
                            6 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Comparison</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Illumi vs Invoice Ninja: Which is Better for South African Businesses?
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Invoice Ninja is a popular open-source invoicing platform, but is it the right choice for South African 
                        freelancers and small businesses? We compare both platforms to help you decide.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none mb-10">
                        <p className="text-muted-foreground leading-relaxed">
                            When searching for invoicing software, Invoice Ninja often appears as a top recommendation. It's open-source, 
                            feature-rich, and has been around for years. However, for South African businesses, there are critical 
                            limitations that can significantly impact your day-to-day operations and cash flow.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The most significant issue? <strong className="text-foreground">Invoice Ninja doesn't support South African payment gateways.</strong> This 
                            means no PayFast, no Yoco, no Ozow — the payment providers your clients actually use. Without these 
                            integrations, you're stuck with manual bank transfers and the payment delays that come with them.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Let's break down the key differences between Illumi and Invoice Ninja to help you make an informed decision.
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
                                        <th className="text-left px-6 py-4 font-semibold">Invoice Ninja</th>
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
                            As the comparison shows, Illumi is purpose-built for the South African market. While Invoice Ninja 
                            offers a comprehensive feature set, many of those features are irrelevant if you can't accept 
                            payments from your local clients efficiently.
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
                            The decision ultimately comes down to what matters most for your business. If you're based in South Africa 
                            and want to get paid faster, Illumi's native integration with PayFast, Yoco, and Ozow is a game-changer. 
                            Your clients can pay invoices instantly with a "Pay Now" button — no more waiting for manual EFT transfers.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Invoice Ninja's 5-client limit on the free plan is also a significant barrier. Most freelancers and small 
                            businesses work with more than 5 clients, which means you'd need to upgrade almost immediately. Illumi's 
                            free plan has no such restrictions — unlimited clients, unlimited invoices, forever.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Finally, Illumi's focused approach means less complexity. Invoice Ninja is packed with features designed 
                            for a global audience, many of which you'll never use. Illumi gives you exactly what you need to create 
                            professional invoices in ZAR, track expenses, and get paid online — nothing more, nothing less.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-10">
                        <h3 className="text-xl font-bold mb-4">The Bottom Line</h3>
                        <p className="text-muted-foreground mb-6">
                            Invoice Ninja is a solid platform for businesses in regions with supported payment gateways. But for 
                            South African freelancers and SMBs, Illumi offers a more practical solution with local payment 
                            integrations, ZAR-first design, and a genuinely unlimited free plan.
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
