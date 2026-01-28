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
    title: "Illumi vs Wave: Which is Better for South African Businesses? | Illumi",
    description:
        "Compare Illumi and Wave for South African freelancers and small businesses. See why Illumi's local payment gateways, ZAR-first design, and SA focus make it the better choice.",
    keywords: [
        "Illumi vs Wave",
        "Wave alternative South Africa",
        "best invoicing software South Africa",
        "Wave comparison",
        "free invoicing software South Africa",
        "PayFast invoicing",
        "Wave not available South Africa",
    ],
    alternates: {
        canonical: "/blog/illumi-vs-wave",
    },
    openGraph: {
        title: "Illumi vs Wave: Which is Better for South African Businesses?",
        description: "Compare Illumi and Wave for SA freelancers. See why local payment gateways and ZAR-first design make Illumi the practical choice.",
        type: "article",
    },
}

const comparisonData = [
    {
        feature: "South African support",
        illumi: "Yes",
        competitor: "No",
        illumiWins: true,
    },
    {
        feature: "SA payment gateways",
        illumi: "Yes",
        competitor: "No",
        illumiWins: true,
    },
    {
        feature: "VAT & ZAR-first setup",
        illumi: "Yes",
        competitor: "US/CA-focused",
        illumiWins: true,
    },
    {
        feature: "Dedicated invoicing UX",
        illumi: "Yes",
        competitor: "Accounting-first",
        illumiWins: true,
    },
    {
        feature: "Local business positioning",
        illumi: "Yes",
        competitor: "North America-focused",
        illumiWins: true,
    },
    {
        feature: "Profit tracking clarity",
        illumi: "Built-in",
        competitor: "Less transparent",
        illumiWins: true,
    },
]

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Illumi vs Wave: Which is Better for South African Businesses?",
    "description": "Compare Illumi and Wave for South African freelancers and small businesses. See why Illumi's local payment gateways, ZAR-first design, and SA focus make it the better choice.",
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
        "@id": "https://illumi.co.za/blog/illumi-vs-wave"
    }
}

const keyDifferences = [
    {
        title: "Not Available in South Africa",
        description: "Wave's payment processing features are only available in the US and Canada. South African businesses can't accept online payments through Wave at all.",
    },
    {
        title: "ZAR & VAT Support",
        description: "Wave is designed for North American businesses with USD/CAD as primary currencies. Illumi is built for South Africa with ZAR as default and proper VAT handling.",
    },
    {
        title: "Local Payment Gateways",
        description: "Illumi integrates with PayFast, Yoco, and Ozow — the payment providers your South African clients actually use. Wave doesn't support any SA payment methods.",
    },
    {
        title: "Focused Invoicing Experience",
        description: "Wave has evolved into a full accounting platform. Illumi stays focused on invoicing and expense tracking — simpler and faster for businesses that just need to get paid.",
    },
]

const regionalComparison = [
    {
        feature: "Primary Market",
        illumi: "South Africa",
        wave: "United States & Canada",
    },
    {
        feature: "Default Currency",
        illumi: "ZAR (South African Rand)",
        wave: "USD / CAD",
    },
    {
        feature: "Tax System",
        illumi: "South African VAT (15%)",
        wave: "US/Canadian sales tax",
    },
    {
        feature: "Payment Processing",
        illumi: "PayFast, Yoco, Ozow",
        wave: "Wave Payments (US/CA only)",
    },
    {
        feature: "Bank Connections",
        illumi: "Not required",
        wave: "US/CA banks only",
    },
]

export default function IllumiVsWavePost() {
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
                        Illumi vs Wave: Which is Better for South African Businesses?
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Wave is often recommended as a free invoicing solution, but there's a catch for South African 
                        businesses: most of Wave's best features simply don't work here.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none mb-10">
                        <p className="text-muted-foreground leading-relaxed">
                            Wave has built a strong reputation as a free accounting and invoicing platform, particularly 
                            popular among freelancers and small businesses in North America. It's genuinely free for basic 
                            invoicing and accounting, which makes it an attractive option at first glance.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            However, there's a critical limitation that many South African business owners discover too late: 
                            <strong className="text-foreground"> Wave's payment processing is only available in the United States and Canada</strong>. 
                            This means you can create invoices with Wave, but your clients can't pay them online. The "Pay Now" 
                            button that makes Wave so convenient for North American businesses simply doesn't work for you.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Beyond payments, Wave is designed around US and Canadian tax systems, currencies, and banking 
                            integrations. While you can technically use it for basic invoicing, you'll be fighting against 
                            a platform that wasn't built for your market. Let's look at how Illumi compares.
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
                                        <th className="text-left px-6 py-4 font-semibold">Wave</th>
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
                            The comparison reveals a fundamental mismatch: Wave is built for North American businesses, 
                            while Illumi is built specifically for South African businesses. This isn't about which platform 
                            is "better" — it's about which platform is right for your market.
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
                    <h2 className="text-2xl font-bold mb-6">Regional Comparison</h2>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-10">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-6 py-4 font-semibold">Aspect</th>
                                        <th className="text-left px-6 py-4 font-semibold text-primary">Illumi</th>
                                        <th className="text-left px-6 py-4 font-semibold">Wave</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {regionalComparison.map((row, index) => (
                                        <tr key={row.feature} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                            <td className="px-6 py-4 font-medium">{row.feature}</td>
                                            <td className="px-6 py-4 text-foreground">{row.illumi}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{row.wave}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none mb-10">
                        <h2 className="text-2xl font-bold mb-4">Why Illumi is the Better Choice for South African Freelancers & Small Businesses</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The most compelling reason to choose Illumi over Wave is simple: <strong className="text-foreground">Illumi 
                            actually works for South African businesses</strong>. Wave's payment processing — the feature that 
                            makes it so valuable for US and Canadian businesses — is completely unavailable in South Africa.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            With Illumi, your clients can pay invoices instantly using PayFast, Yoco, or Ozow. They click 
                            "Pay Now," complete the payment in seconds, and you get notified immediately. This can reduce 
                            your average payment time from weeks to hours.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Illumi is also designed around South African business needs. ZAR is the default currency, VAT 
                            is calculated at 15% (or your custom rate), and the entire experience is built for how South 
                            African freelancers and SMBs actually work. No fighting with currency conversions or tax systems 
                            designed for another country.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Wave has evolved into a full accounting platform, which adds complexity that many small businesses 
                            don't need. Illumi stays focused on invoicing and expense tracking — the core functions that 
                            help you get paid and understand your profitability.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-10">
                        <h3 className="text-xl font-bold mb-4">The Bottom Line</h3>
                        <p className="text-muted-foreground mb-6">
                            Wave is an excellent free platform for businesses in the United States and Canada. But for 
                            South African freelancers and SMBs, its core value proposition — free payment processing — 
                            simply doesn't apply. Illumi offers what Wave can't: local payment gateways, ZAR-first design, 
                            and a platform built specifically for the South African market.
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
                    <h2 className="text-3xl font-bold mb-4">Ready to use invoicing software built for South Africa?</h2>
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
