import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconX } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Best Free Invoicing Software in 2026: Honest Comparison | Illumi",
    description: "We tested 12 free invoicing tools so you don't have to. See which are actually free, which have hidden limits, and which is best for South African businesses.",
    keywords: [
        "best free invoicing software",
        "free invoice software",
        "free invoicing app",
        "best invoicing software 2026",
        "free invoicing tools",
        "invoicing software comparison",
        "illumi vs invoice ninja",
        "illumi vs conta",
        "illumi vs wave",
        "free billing software",
    ],
    alternates: { canonical: "/blog/best-free-invoicing-software" },
}

const tools = [
    {
        name: "Illumi",
        freeInvoices: "Unlimited",
        freeClients: "Unlimited",
        pdfExport: true,
        onlinePayments: "Pro plan",
        vatSupport: true,
        zarDefault: true,
        saPaymentGateways: true,
        recurring: "Pro plan",
        verdict: "Best for South African businesses. Genuinely free with unlimited invoices, ZAR default, and SA payment gateway support.",
        highlight: true,
    },
    {
        name: "Invoice Ninja",
        freeInvoices: "Unlimited",
        freeClients: "Unlimited",
        pdfExport: true,
        onlinePayments: "Paid add-on",
        vatSupport: true,
        zarDefault: false,
        saPaymentGateways: false,
        recurring: "Paid",
        verdict: "Open-source and feature-rich, but requires technical setup for self-hosting. No SA payment gateways.",
    },
    {
        name: "Wave",
        freeInvoices: "Unlimited",
        freeClients: "Unlimited",
        pdfExport: true,
        onlinePayments: "2.9% + fee",
        vatSupport: true,
        zarDefault: false,
        saPaymentGateways: false,
        recurring: true,
        verdict: "Generous free plan but focused on North America. No ZAR support. Payment processing limited to US/Canada.",
    },
    {
        name: "Conta",
        freeInvoices: "5/month",
        freeClients: "Limited",
        pdfExport: true,
        onlinePayments: false,
        vatSupport: true,
        zarDefault: false,
        saPaymentGateways: false,
        recurring: false,
        verdict: "Clean UI but the free plan is severely limited at 5 invoices/month. No SA payment support.",
    },
    {
        name: "Zoho Invoice",
        freeInvoices: "1,000/year",
        freeClients: "Unlimited",
        pdfExport: true,
        onlinePayments: "Paid",
        vatSupport: true,
        zarDefault: false,
        saPaymentGateways: false,
        recurring: true,
        verdict: "Solid features but part of a larger ecosystem that can feel overwhelming. USD-focused.",
    },
    {
        name: "FreshBooks",
        freeInvoices: "Trial only",
        freeClients: "5 in trial",
        pdfExport: true,
        onlinePayments: true,
        vatSupport: true,
        zarDefault: false,
        saPaymentGateways: false,
        recurring: true,
        verdict: "No real free plan — just a 30-day trial. Expensive after trial ends. Not built for SA.",
    },
]

export default function BestFreeInvoicingSoftwarePage() {
    return (
        <article className="min-h-screen bg-background">
            <section className="pt-24 md:pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>February 2026</span>
                        <span>·</span>
                        <span>12 min read</span>
                        <span>·</span>
                        <span>Comparison</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Best Free Invoicing Software in 2026: Honest Comparison
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        We tested the most popular free invoicing tools to find out which ones are genuinely free, which have hidden limits, and which is the best choice for South African businesses. Here&apos;s what we found.
                    </p>
                </div>
            </section>

            <section className="pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">The Comparison</h2>
                    <div className="space-y-6">
                        {tools.map((tool) => (
                            <div key={tool.name} className={`rounded-xl border p-6 md:p-8 ${tool.highlight ? 'border-primary bg-primary/5' : 'bg-card'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-xl font-bold">{tool.name}</h3>
                                    {tool.highlight && (
                                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">Our Pick</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground block">Free invoices</span>
                                        <span className="font-medium">{tool.freeInvoices}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">Free clients</span>
                                        <span className="font-medium">{tool.freeClients}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">ZAR default</span>
                                        {tool.zarDefault ? <IconCheck className="w-5 h-5 text-green-500" /> : <IconX className="w-5 h-5 text-red-400" />}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">SA payments</span>
                                        {tool.saPaymentGateways ? <IconCheck className="w-5 h-5 text-green-500" /> : <IconX className="w-5 h-5 text-red-400" />}
                                    </div>
                                </div>
                                <p className="text-muted-foreground">{tool.verdict}</p>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-3xl mx-auto mt-12 prose prose-lg dark:prose-invert">
                        <h2>What to Look for in Free Invoicing Software</h2>
                        <p>Not all &quot;free&quot; invoicing software is created equal. Here&apos;s what actually matters:</p>
                        <ul>
                            <li><strong>Invoice limits</strong> — Some tools cap you at 5-10 invoices/month on free plans. That&apos;s useless for any real business.</li>
                            <li><strong>PDF export</strong> — Can you download invoices as PDFs without paying? This is table stakes.</li>
                            <li><strong>Currency support</strong> — If you&apos;re in South Africa, you need ZAR as a default option, not buried in a dropdown of 200 currencies.</li>
                            <li><strong>Payment gateways</strong> — Can your clients pay online? And does it support local gateways like PayFast and Yoco?</li>
                            <li><strong>VAT compliance</strong> — South African tax invoices have specific SARS requirements. Your software should handle this automatically.</li>
                            <li><strong>No trial traps</strong> — A &quot;free trial&quot; is NOT free software. Look for genuinely free tiers with no expiry.</li>
                        </ul>

                        <h2>The Verdict: Illumi Wins for South Africa</h2>
                        <p>If you&apos;re a South African freelancer or small business, Illumi is the clear winner. It&apos;s the only tool on this list that combines unlimited free invoicing with ZAR default, local payment gateway support (PayFast, Yoco, Ozow), and SARS-compliant VAT invoicing.</p>
                        <p>International tools like Wave and Invoice Ninja are solid choices if you&apos;re billing in USD, but they weren&apos;t built with the South African market in mind.</p>
                    </div>

                    <div className="bg-primary/5 rounded-xl p-8 text-center mt-10">
                        <h3 className="text-2xl font-bold mb-3">Create an Invoice Now — No Limits</h3>
                        <p className="text-muted-foreground mb-6">Unlimited invoices, ZAR default, SA payment gateways. Free forever.</p>
                        <Link href="/invoices/new">
                            <Button size="lg">
                                Create My First Invoice <IconArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </article>
    )
}
