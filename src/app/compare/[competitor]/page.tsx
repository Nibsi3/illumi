"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import {
    IconCheck,
    IconX,
    IconMinus,
    IconArrowRight,
    IconCoin,
    IconPlugConnected,
    IconBook,
    IconPhone,
    IconChevronDown,
} from "@tabler/icons-react"
import { useState } from "react"

const navItems = [
    { name: "Pricing", link: "/pricing", icon: <IconCoin className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "Integrations", link: "/integrations", icon: <IconPlugConnected className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "Story", link: "/story", icon: <IconBook className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "Contact", link: "/contact", icon: <IconPhone className="h-4 w-4 text-neutral-500 dark:text-white" /> },
]

type FeatureStatus = "yes" | "no" | "partial"

interface ComparisonFeature {
    feature: string
    illumi: FeatureStatus
    competitor: FeatureStatus
}

interface FAQ {
    question: string
    answer: string
}

interface CompetitorData {
    name: string
    slug: string
    tagline: string
    description: string
    illumiDescription: string
    features: ComparisonFeature[]
    keyDifferences: { title: string; description: string }[]
    whyIllumiBetter: string[]
    whoShouldChooseCompetitor: string[]
    faqs: FAQ[]
}

const competitors: Record<string, CompetitorData> = {
    xero: {
        name: "Xero",
        slug: "xero",
        tagline: "Best Invoice Software for South Africa?",
        description: "Xero is a global cloud accounting platform popular with accountants and medium-sized businesses. It offers comprehensive accounting features but is designed primarily for international markets, with pricing in foreign currencies and limited South African-specific functionality.",
        illumiDescription: "Illumi is a South African invoicing platform built specifically for local SMEs. It handles VAT invoicing, ZAR pricing, and integrates with local payment gateways like PayGate — all without the complexity of full accounting software.",
        features: [
            { feature: "Built for South Africa", illumi: "yes", competitor: "no" },
            { feature: "VAT Invoices (SA Compliant)", illumi: "yes", competitor: "partial" },
            { feature: "Pricing in ZAR", illumi: "yes", competitor: "no" },
            { feature: "Ease of Use", illumi: "yes", competitor: "partial" },
            { feature: "Best for Small Business", illumi: "yes", competitor: "no" },
            { feature: "Local Payment Gateway", illumi: "yes", competitor: "partial" },
            { feature: "Free Plan Available", illumi: "yes", competitor: "no" },
            { feature: "Full Accounting Suite", illumi: "no", competitor: "yes" },
        ],
        keyDifferences: [
            { title: "Local Compliance", description: "Illumi is built with SA VAT rules and SARS requirements in mind. Xero requires manual configuration for South African tax compliance." },
            { title: "Pricing Transparency", description: "Illumi prices in Rands with a generous free tier. Xero charges in USD/GBP, making costs unpredictable for SA businesses." },
            { title: "Complexity vs Simplicity", description: "Xero is a full accounting suite — powerful but complex. Illumi focuses on invoicing done right, without the learning curve." },
            { title: "Support Relevance", description: "Illumi offers local support during SA business hours. Xero's global support may not understand local business needs." },
        ],
        whyIllumiBetter: [
            "Purpose-built for South African VAT and invoicing requirements",
            "Pricing in ZAR — no exchange rate surprises",
            "Simple, focused interface — create invoices in under 60 seconds",
            "PayGate integration for instant online payments",
            "Free tier that actually lets you run your business",
            "Local support that understands SA business challenges",
        ],
        whoShouldChooseCompetitor: [
            "Businesses needing full double-entry accounting",
            "Companies with international operations requiring multi-currency accounting",
            "Enterprises with dedicated accounting teams",
            "Businesses already integrated with Xero's ecosystem",
        ],
        faqs: [
            { question: "Is Illumi better than Xero for invoicing?", answer: "For South African small businesses focused on invoicing, yes. Illumi is simpler, cheaper, and built specifically for SA VAT compliance. Xero is better if you need full accounting features." },
            { question: "Is Xero good for South African businesses?", answer: "Xero can work for SA businesses, but it's designed for global markets. You'll pay in foreign currency and need to configure SA-specific settings manually." },
            { question: "What is the best invoicing software in South Africa?", answer: "For SMEs focused on professional invoicing with local payment options, Illumi is purpose-built for South Africa. For full accounting needs, consider Xero or Sage." },
        ],
    },
    sage: {
        name: "Sage",
        slug: "sage",
        tagline: "Best Invoice Software for South Africa?",
        description: "Sage is a well-established accounting software provider with a strong presence in South Africa. Their products range from basic invoicing to enterprise accounting, but can be complex and expensive for small businesses.",
        illumiDescription: "Illumi is a modern, cloud-first invoicing platform designed for South African SMEs who want professional invoices without the complexity of traditional accounting software.",
        features: [
            { feature: "Built for South Africa", illumi: "yes", competitor: "yes" },
            { feature: "VAT Invoices (SA Compliant)", illumi: "yes", competitor: "yes" },
            { feature: "Pricing in ZAR", illumi: "yes", competitor: "yes" },
            { feature: "Ease of Use", illumi: "yes", competitor: "partial" },
            { feature: "Best for Small Business", illumi: "yes", competitor: "partial" },
            { feature: "Modern Cloud Interface", illumi: "yes", competitor: "partial" },
            { feature: "Free Plan Available", illumi: "yes", competitor: "no" },
            { feature: "Full Accounting Suite", illumi: "no", competitor: "yes" },
        ],
        keyDifferences: [
            { title: "Modern vs Traditional", description: "Illumi is built cloud-first with a modern interface. Sage has legacy roots that can feel dated in comparison." },
            { title: "Simplicity Focus", description: "Illumi does invoicing exceptionally well. Sage tries to do everything, which adds complexity." },
            { title: "Pricing Model", description: "Illumi offers a free tier and transparent Pro pricing. Sage's pricing can be confusing with multiple product tiers." },
            { title: "Setup Time", description: "Start invoicing with Illumi in minutes. Sage often requires more setup and configuration." },
        ],
        whyIllumiBetter: [
            "Modern, intuitive interface — no training needed",
            "Free tier perfect for freelancers and small businesses",
            "Focused on invoicing — not bloated with features you don't need",
            "Faster setup — create your first invoice in under 60 seconds",
            "PayGate integration for seamless online payments",
            "No legacy software baggage",
        ],
        whoShouldChooseCompetitor: [
            "Businesses needing full accounting and payroll",
            "Companies with existing Sage integrations",
            "Enterprises requiring audit trails and compliance reporting",
            "Businesses with dedicated bookkeepers familiar with Sage",
        ],
        faqs: [
            { question: "Is Illumi better than Sage for invoicing?", answer: "For pure invoicing, Illumi offers a simpler, more modern experience. Sage is better if you need full accounting, payroll, and enterprise features." },
            { question: "Is Sage good for small businesses in South Africa?", answer: "Sage has SA-specific products, but they can be complex and expensive for very small businesses. Illumi is often a better fit for SMEs focused on invoicing." },
            { question: "What is the difference between Illumi and Sage?", answer: "Illumi focuses on beautiful, simple invoicing. Sage is a full accounting suite. Choose based on whether you need just invoicing or complete accounting." },
        ],
    },
    "zoho-invoice": {
        name: "Zoho Invoice",
        slug: "zoho-invoice",
        tagline: "Best Invoice Software for South Africa?",
        description: "Zoho Invoice is part of the Zoho suite of business applications. It's a capable invoicing tool with good features, but is designed for global markets and may require configuration for South African businesses.",
        illumiDescription: "Illumi is a South African invoicing platform that understands local business needs — from VAT compliance to PayGate integration — without requiring you to adapt a global tool to local requirements.",
        features: [
            { feature: "Built for South Africa", illumi: "yes", competitor: "no" },
            { feature: "VAT Invoices (SA Compliant)", illumi: "yes", competitor: "partial" },
            { feature: "Pricing in ZAR", illumi: "yes", competitor: "no" },
            { feature: "Ease of Use", illumi: "yes", competitor: "yes" },
            { feature: "Best for Small Business", illumi: "yes", competitor: "yes" },
            { feature: "Local Payment Gateway", illumi: "yes", competitor: "no" },
            { feature: "Free Plan Available", illumi: "yes", competitor: "yes" },
            { feature: "Part of Larger Suite", illumi: "no", competitor: "yes" },
        ],
        keyDifferences: [
            { title: "Local vs Global", description: "Illumi is built for SA from the ground up. Zoho Invoice is a global product you adapt to local needs." },
            { title: "Payment Integration", description: "Illumi integrates with PayGate for local payments. Zoho relies on international payment processors." },
            { title: "Currency & Pricing", description: "Illumi prices and operates in ZAR. Zoho charges in USD, adding exchange rate uncertainty." },
            { title: "Ecosystem Lock-in", description: "Zoho works best with other Zoho products. Illumi is standalone and focused." },
        ],
        whyIllumiBetter: [
            "Native South African VAT and compliance",
            "PayGate integration for local online payments",
            "No USD pricing — everything in Rands",
            "No ecosystem lock-in — use Illumi standalone",
            "Designed specifically for SA SME workflows",
            "Local support during SA business hours",
        ],
        whoShouldChooseCompetitor: [
            "Businesses already using the Zoho ecosystem",
            "Companies needing CRM + invoicing integration",
            "Businesses with international clients (multi-currency)",
            "Teams wanting project management + invoicing combined",
        ],
        faqs: [
            { question: "Is Illumi better than Zoho Invoice for South African businesses?", answer: "For SA-focused businesses, yes. Illumi offers local payment integration, ZAR pricing, and native VAT compliance that Zoho requires configuration for." },
            { question: "Is Zoho Invoice free?", answer: "Zoho Invoice has a free tier, but with limitations. Illumi also offers a generous free tier designed for SA small businesses." },
            { question: "Can I use Zoho Invoice in South Africa?", answer: "Yes, but you'll pay in USD and need to configure SA-specific settings. Illumi is built for SA from day one." },
        ],
    },
    quickbooks: {
        name: "QuickBooks",
        slug: "quickbooks",
        tagline: "Best Invoice Software for South Africa?",
        description: "QuickBooks by Intuit is one of the world's most popular accounting platforms. It offers comprehensive features but is primarily designed for US and UK markets, with limited South African localisation.",
        illumiDescription: "Illumi is a proudly South African invoicing solution that speaks your language — literally. From VAT at 15% to PayGate payments, everything is designed for how SA businesses actually work.",
        features: [
            { feature: "Built for South Africa", illumi: "yes", competitor: "no" },
            { feature: "VAT Invoices (SA Compliant)", illumi: "yes", competitor: "partial" },
            { feature: "Pricing in ZAR", illumi: "yes", competitor: "no" },
            { feature: "Ease of Use", illumi: "yes", competitor: "partial" },
            { feature: "Best for Small Business", illumi: "yes", competitor: "partial" },
            { feature: "Local Payment Gateway", illumi: "yes", competitor: "no" },
            { feature: "Free Plan Available", illumi: "yes", competitor: "no" },
            { feature: "Full Accounting Suite", illumi: "no", competitor: "yes" },
        ],
        keyDifferences: [
            { title: "Market Focus", description: "QuickBooks is built for US/UK markets. Illumi is built for South Africa specifically." },
            { title: "Complexity", description: "QuickBooks is powerful but has a learning curve. Illumi gets you invoicing in minutes." },
            { title: "Cost", description: "QuickBooks charges in USD with no free tier. Illumi offers free invoicing with optional Pro features." },
            { title: "Local Payments", description: "Illumi integrates with PayGate. QuickBooks relies on international payment processors." },
        ],
        whyIllumiBetter: [
            "Built specifically for South African businesses",
            "No USD pricing — transparent ZAR costs",
            "PayGate integration for instant local payments",
            "Free tier that actually works for real businesses",
            "Simple interface — no accounting degree required",
            "Local support that understands load shedding and EFT delays",
        ],
        whoShouldChooseCompetitor: [
            "Businesses with US/UK operations or clients",
            "Companies needing full accounting with inventory",
            "Enterprises with dedicated accounting staff",
            "Businesses already invested in the Intuit ecosystem",
        ],
        faqs: [
            { question: "Is Illumi better than QuickBooks for South African businesses?", answer: "For invoicing-focused SA businesses, yes. Illumi is simpler, cheaper, and built for local needs. QuickBooks is better for full accounting with international operations." },
            { question: "Does QuickBooks work in South Africa?", answer: "QuickBooks can be used in SA, but it's not optimised for the local market. Expect USD pricing and limited local payment options." },
            { question: "What is the best alternative to QuickBooks in South Africa?", answer: "For invoicing, Illumi is purpose-built for SA. For full accounting, consider Sage or Xero with local configuration." },
        ],
    },
}

function FeatureIcon({ status }: { status: FeatureStatus }) {
    if (status === "yes") {
        return (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20">
                <IconCheck className="w-5 h-5 text-emerald-500" />
            </div>
        )
    }
    if (status === "no") {
        return (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                <IconX className="w-5 h-5 text-red-500" />
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20">
            <IconMinus className="w-5 h-5 text-amber-500" />
        </div>
    )
}

function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={onClick}
                className="w-full py-5 flex items-center justify-between text-left hover:text-primary transition-colors"
            >
                <span className="font-medium text-foreground pr-4">{question}</span>
                <IconChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                <p className="text-muted-foreground">{answer}</p>
            </div>
        </div>
    )
}

export default function ComparisonPage() {
    const params = useParams()
    const competitorSlug = params.competitor as string
    const data = competitors[competitorSlug]
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    if (!data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Comparison not found</h1>
                    <Link href="/" className="text-primary hover:underline">Return home</Link>
                </div>
            </div>
        )
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="min-h-screen bg-background">
                <FloatingNav
                    brand={{
                        href: '/',
                        content: (
                            <Image
                                src="/logo.png"
                                alt="Illumi"
                                width={24}
                                height={24}
                                className="h-6 w-6 object-contain"
                            />
                        ),
                    }}
                    navItems={navItems}
                />

                {/* Hero Section */}
                <section className="pt-32 pb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <span>Comparison</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Illumi vs {data.name}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Which Invoice Software Is Best for South African Businesses?
                        </p>
                    </div>
                </section>

                {/* Quick Comparison Table */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Quick Comparison</h2>
                        <div className="rounded-2xl border border-border overflow-hidden bg-card">
                            <div className="grid grid-cols-3 bg-muted/50 border-b border-border">
                                <div className="p-4 font-semibold text-foreground">Feature</div>
                                <div className="p-4 font-semibold text-foreground text-center border-l border-border">
                                    <span className="text-primary">Illumi</span>
                                </div>
                                <div className="p-4 font-semibold text-foreground text-center border-l border-border">{data.name}</div>
                            </div>
                            {data.features.map((feature, idx) => (
                                <div key={idx} className={`grid grid-cols-3 ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                                    <div className="p-4 text-foreground font-medium">{feature.feature}</div>
                                    <div className="p-4 flex justify-center border-l border-border">
                                        <FeatureIcon status={feature.illumi} />
                                    </div>
                                    <div className="p-4 flex justify-center border-l border-border">
                                        <FeatureIcon status={feature.competitor} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What Is Illumi */}
                <section className="py-16 px-4 bg-muted/30">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-6">What Is Illumi?</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {data.illumiDescription}
                        </p>
                    </div>
                </section>

                {/* What Is Competitor */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-6">What Is {data.name}?</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {data.description}
                        </p>
                    </div>
                </section>

                {/* Key Differences */}
                <section className="py-16 px-4 bg-muted/30">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
                            Illumi vs {data.name}: Key Differences
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {data.keyDifferences.map((diff, idx) => (
                                <div key={idx} className="p-6 rounded-xl bg-card border border-border">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">{diff.title}</h3>
                                    <p className="text-muted-foreground">{diff.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Illumi Is Better */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
                            Why Illumi Is Better for South African Businesses
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.whyIllumiBetter.map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <IconCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-foreground">{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Who Should Choose Competitor */}
                <section className="py-16 px-4 bg-muted/30">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
                            Who Should Choose {data.name}?
                        </h2>
                        <p className="text-muted-foreground text-center mb-8">
                            We believe in being honest. {data.name} might be a better fit if:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.whoShouldChooseCompetitor.map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                                    <IconArrowRight className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-6">
                            {data.faqs.map((faq, idx) => (
                                <FAQItem
                                    key={idx}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openFaq === idx}
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/50">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Ready to Try Illumi?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join thousands of South African businesses creating professional invoices with Illumi. Start free today — no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login">
                                <HoverBorderGradient
                                    containerClassName="rounded-full"
                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold"
                                >
                                    Try Illumi Free
                                    <IconArrowRight className="w-4 h-4" />
                                </HoverBorderGradient>
                            </Link>
                            <Link
                                href="/pricing"
                                className="px-8 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 border-t border-border">
                    <div className="max-w-4xl mx-auto text-center text-muted-foreground text-sm">
                        <p>© {new Date().getFullYear()} Illumi. All rights reserved.</p>
                        <div className="flex justify-center gap-6 mt-4">
                            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
