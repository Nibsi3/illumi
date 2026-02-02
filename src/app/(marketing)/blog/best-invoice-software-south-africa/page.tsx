import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconStar } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Best Invoice Software in South Africa (2026) | Illumi",
    description: "Compare the best invoice software for South African businesses in 2026. We review features, pricing, and local payment support to help you choose the right invoicing solution.",
    keywords: [
        "best invoice software south africa",
        "invoice software comparison",
        "invoicing software south africa 2026",
        "top invoice apps south africa",
        "invoice software for small business",
        "best billing software south africa",
    ],
    alternates: {
        canonical: "/blog/best-invoice-software-south-africa",
    },
}

const softwareOptions = [
    {
        name: "Illumi",
        rating: 5,
        price: "Free / R99 Pro",
        localPayments: true,
        vatSupport: true,
        zarCurrency: true,
        pros: ["Free forever plan", "PayFast & Yoco integration", "Built for SA", "Unlimited invoices"],
        cons: ["Newer platform"],
        bestFor: "South African freelancers and small businesses",
    },
    {
        name: "Wave",
        rating: 3,
        price: "Free",
        localPayments: false,
        vatSupport: true,
        zarCurrency: true,
        pros: ["Completely free", "Good accounting features"],
        cons: ["No SA payment gateways", "US-focused"],
        bestFor: "Businesses that don't need online payments",
    },
    {
        name: "Zoho Invoice",
        rating: 4,
        price: "Free / $9+",
        localPayments: false,
        vatSupport: true,
        zarCurrency: true,
        pros: ["Feature-rich", "Part of Zoho ecosystem"],
        cons: ["No PayFast/Yoco", "Complex for beginners", "USD pricing"],
        bestFor: "Businesses already using Zoho products",
    },
    {
        name: "FreshBooks",
        rating: 4,
        price: "$17+/month",
        localPayments: false,
        vatSupport: true,
        zarCurrency: true,
        pros: ["Polished interface", "Good time tracking"],
        cons: ["Expensive", "No SA payment gateways", "USD pricing"],
        bestFor: "Agencies with bigger budgets",
    },
    {
        name: "QuickBooks Online",
        rating: 4,
        price: "R299+/month",
        localPayments: false,
        vatSupport: true,
        zarCurrency: true,
        pros: ["Full accounting", "Well-known brand"],
        cons: ["Overkill for invoicing only", "Expensive", "Steep learning curve"],
        bestFor: "Businesses needing full accounting",
    },
]

const comparisonCriteria = [
    { criterion: "Local Payment Gateways (PayFast, Yoco)", important: "Essential for SA businesses to accept online payments" },
    { criterion: "ZAR Currency Support", important: "Invoice in Rand without conversion issues" },
    { criterion: "VAT Compliance", important: "SARS-compliant tax invoices with 15% VAT" },
    { criterion: "Free Plan", important: "Start without financial commitment" },
    { criterion: "Ease of Use", important: "Get started quickly without training" },
    { criterion: "Mobile Access", important: "Invoice on the go from any device" },
]

export default function BestInvoiceSoftwareSouthAfricaPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            10 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Comparison</span>
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary">Updated 2026</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Best Invoice Software in South Africa (2026)
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        We compared the top invoicing solutions for South African businesses. Here's what actually 
                        works — and what doesn't — when you need local payment support and VAT compliance.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            Choosing invoice software in South Africa isn't as simple as picking the most popular 
                            global option. Many international tools lack support for local payment gateways like 
                            PayFast and Yoco, making it impossible for your clients to pay online.
                        </p>
                        <p>
                            We evaluated each option based on what matters most to SA businesses: local payment 
                            integration, VAT compliance, ZAR currency support, and value for money.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">What to Look For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {comparisonCriteria.map((item) => (
                            <div key={item.criterion} className="p-4 rounded-xl border border-border bg-card">
                                <div className="font-medium mb-1">{item.criterion}</div>
                                <div className="text-sm text-muted-foreground">{item.important}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">The Best Invoice Software for SA (2026)</h2>
                    <div className="space-y-6">
                        {softwareOptions.map((software, index) => (
                            <div key={software.name} className={`rounded-2xl border ${index === 0 ? 'border-primary border-2' : 'border-border'} bg-card p-6`}>
                                {index === 0 && (
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
                                        Best for SA Businesses
                                    </div>
                                )}
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{software.name}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <IconStar 
                                                    key={i} 
                                                    className={`h-4 w-4 ${i < software.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">{software.price}</div>
                                        <div className="text-sm text-muted-foreground">per month</div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${software.localPayments ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {software.localPayments ? '✓ PayFast/Yoco' : '✗ No SA Payments'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${software.vatSupport ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {software.vatSupport ? '✓ VAT Support' : '✗ No VAT'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${software.zarCurrency ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {software.zarCurrency ? '✓ ZAR Currency' : '✗ No ZAR'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Pros</div>
                                        <ul className="space-y-1">
                                            {software.pros.map((pro) => (
                                                <li key={pro} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <IconCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Cons</div>
                                        <ul className="space-y-1">
                                            {software.cons.map((con) => (
                                                <li key={con} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span className="text-red-600 dark:text-red-400">✗</span>
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <span className="font-medium">Best for:</span>{" "}
                                    <span className="text-muted-foreground">{software.bestFor}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-12">
                        <h2 className="text-2xl font-bold mb-4">Our Recommendation</h2>
                        <p className="text-muted-foreground mb-6">
                            For South African businesses, <strong>Illumi</strong> is the clear winner. It's the only 
                            option that combines a generous free plan with native PayFast and Yoco integration. 
                            You can accept online payments from day one without paying for expensive international 
                            alternatives that don't support local payment methods.
                        </p>
                        <p className="text-muted-foreground mb-6">
                            If you need full accounting (not just invoicing), QuickBooks Online is worth considering 
                            despite the higher price. But for most freelancers and small businesses, dedicated 
                            invoice software like Illumi is simpler and more cost-effective.
                        </p>
                        <Link href="/login">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Try Illumi Free
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/illumi-vs-wave" className="text-primary hover:underline">
                                    Illumi vs Wave: Which is Better for SA?
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/illumi-vs-zoho-invoice" className="text-primary hover:underline">
                                    Illumi vs Zoho Invoice Comparison
                                </Link>
                            </li>
                            <li>
                                <Link href="/invoice-software-south-africa" className="text-primary hover:underline">
                                    Invoice Software for South African Businesses
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Invoicing?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of South African businesses using Illumi. Free forever, with local 
                        payment support built in.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Free Account
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Best Invoice Software in South Africa (2026)",
                        "description": "Compare the best invoice software for South African businesses in 2026.",
                        "author": {
                            "@type": "Organization",
                            "name": "Illumi",
                        },
                        "datePublished": "2026-01-15",
                        "dateModified": "2026-02-01",
                    }),
                }}
            />
        </>
    )
}
