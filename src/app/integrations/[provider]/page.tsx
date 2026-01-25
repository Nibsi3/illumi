import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { IconArrowRight, IconCheck, IconPlugConnected, IconShieldCheck } from "@tabler/icons-react"

type Provider = {
    slug: string
    name: string
    short: string
    keywords: string[]
    headline: string
    description: string
    bullets: string[]
    faq: { q: string; a: string }[]
}

const PROVIDERS: Record<string, Provider> = {
    payfast: {
        slug: "payfast",
        name: "PayFast",
        short: "PayFast",
        keywords: [
            "invoicing app with PayFast integration",
            "PayFast invoice payments South Africa",
            "tax invoice PayFast South Africa",
            "VAT invoice generator South Africa",
            "ZAR invoicing software",
        ],
        headline: "PayFast integration for online invoice payments",
        description:
            "Connect PayFast through Illumi PayGate to accept online payments on tax invoices in ZAR. Built for South African SMMEs, freelancers and contractors.",
        bullets: [
            "Add a Pay Now button to invoices",
            "Accept card and Instant EFT (provider dependent)",
            "Auto-update invoice status when paid",
            "Keep payment records for bookkeeping and reporting",
        ],
        faq: [
            {
                q: "Is Illumi an official PayFast product?",
                a: "No. Illumi integrates with PayFast via PayGate so you can accept online payments on invoices.",
            },
            {
                q: "Does PayFast replace email invoices?",
                a: "No. Illumi sends invoices by email. The payment button/link is included so clients can pay online.",
            },
        ],
    },
    yoco: {
        slug: "yoco",
        name: "Yoco",
        short: "Yoco",
        keywords: [
            "online billing with Yoco",
            "Yoco invoice payments South Africa",
            "accept card payments on invoices SA",
            "SMME invoicing software South Africa",
            "ZAR invoicing software",
        ],
        headline: "Yoco integration for invoice payments",
        description:
            "Connect Yoco through Illumi PayGate to accept online payments on tax invoices. Ideal for South African SMMEs that want simple card payments in ZAR.",
        bullets: [
            "Accept card payments on invoices (provider dependent)",
            "Professional client pay portal experience",
            "Automatic payment status updates",
            "Track payments and outstanding amounts",
        ],
        faq: [
            {
                q: "Can clients pay from their phone?",
                a: "Yes. The invoice link opens the client portal where they can view and pay (when PayGate is enabled).",
            },
        ],
    },
    ozow: {
        slug: "ozow",
        name: "Ozow",
        short: "Ozow",
        keywords: [
            "online billing with Ozow",
            "accept EFT payments online South Africa",
            "Ozow invoice payments",
            "ZAR currency invoicing software",
            "tax invoice template South Africa",
        ],
        headline: "Ozow integration for Instant EFT invoice payments",
        description:
            "Connect Ozow through Illumi PayGate to accept bank-to-bank EFT payments from your invoices. Get paid faster while keeping clear records in ZAR.",
        bullets: [
            "Offer Instant EFT (provider dependent)",
            "Reduce payment friction for South African clients",
            "Auto-update invoice status when paid",
            "Maintain a clean audit trail for bookkeeping",
        ],
        faq: [
            {
                q: "Is Ozow required to use Illumi?",
                a: "No. Illumi supports multiple providers via PayGate. Choose the one you already use.",
            },
        ],
    },
    paystack: {
        slug: "paystack",
        name: "PayStack",
        short: "PayStack",
        keywords: [
            "PayStack invoice payments",
            "online invoicing with PayStack",
            "payment gateway integration for invoices",
            "ZAR invoicing software",
        ],
        headline: "PayStack integration for invoice payments",
        description:
            "Connect PayStack through Illumi PayGate to accept online payments from your invoices. Built for African businesses that invoice in ZAR and need a simple pay experience.",
        bullets: [
            "Online payments from invoice links",
            "Automatic payment updates",
            "Centralised payment records",
        ],
        faq: [],
    },
    "peach-payments": {
        slug: "peach-payments",
        name: "Peach Payments",
        short: "Peach Payments",
        keywords: [
            "Peach Payments invoice payments",
            "online invoicing with Peach Payments",
            "enterprise payment gateway South Africa",
            "SMME invoicing software South Africa",
        ],
        headline: "Peach Payments integration for invoices",
        description:
            "Connect Peach Payments through Illumi PayGate to accept online payments on tax invoices. Great for growing South African businesses that need a reliable payment flow.",
        bullets: [
            "Online invoice payments",
            "Automatic invoice status updates",
            "Payment records for bookkeeping and reporting",
        ],
        faq: [],
    },
    snapscan: {
        slug: "snapscan",
        name: "SnapScan",
        short: "SnapScan",
        keywords: [
            "online billing with SnapScan",
            "SnapScan payments on invoices",
            "QR payments South Africa",
            "accept payments online South Africa",
        ],
        headline: "SnapScan support for invoice payments",
        description:
            "Illumi supports SnapScan where available through your connected payment provider. Offer a quick scan-and-pay experience for South African clients.",
        bullets: [
            "Fast scan-to-pay experience (provider dependent)",
            "Invoice link + client portal",
            "Automatic payment tracking",
        ],
        faq: [],
    },
}

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }): Promise<Metadata> {
    const { provider } = await params
    const p = PROVIDERS[provider]
    if (!p) return {}

    return {
        title: `${p.name} Integration | Illumi (South Africa)`,
        description: p.description,
        keywords: p.keywords,
    }
}

export default async function IntegrationProviderPage({ params }: { params: Promise<{ provider: string }> }) {
    const { provider } = await params
    const p = PROVIDERS[provider]

    if (!p) notFound()

    const faqSchema = p.faq.length
        ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": p.faq.map((f) => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": { "@type": "Answer", "text": f.a },
              })),
          }
        : null

    return (
        <div className="bg-background text-foreground">
            {faqSchema && (
                <Script
                    id={`faq-${p.slug}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            <section className="relative overflow-hidden border-b border-border">
                <div className="absolute inset-0 bg-linear-to-b from-white/5 via-white dark:via-black to-white dark:to-black" />
                <div className="relative mx-auto max-w-6xl px-6 py-16">
                    <div className="mb-6">
                        <Link href="/integrations" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Back to integrations <IconArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
                            <IconPlugConnected className="h-4 w-4" />
                            {p.name} integration
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{p.headline}</h1>
                        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{p.description}</p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-neutral-200 h-11 px-6 text-sm font-semibold"
                            >
                                Connect {p.short}
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/features/paygate"
                                className="inline-flex items-center justify-center border border-border text-foreground hover:text-foreground hover:bg-muted h-11 px-6 text-sm font-semibold"
                            >
                                How PayGate works
                            </Link>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {p.bullets.map((b) => (
                            <div key={b} className="rounded-2xl border border-border bg-card p-5">
                                <div className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="text-sm text-muted-foreground leading-relaxed">{b}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="rounded-3xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold text-foreground">Why this integration matters</h2>
                            <p className="mt-3 text-muted-foreground leading-relaxed">
                                Many South African businesses already have a preferred payment gateway. With Illumi, you keep using what you know — and simply add a pay link to invoices.
                            </p>
                            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                                <IconShieldCheck className="h-4 w-4" />
                                Payments are handled by your connected provider.
                            </div>
                        </div>

                        <div className="rounded-3xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold text-foreground">How it works</h2>
                            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold">1</div>
                                    <div>Connect {p.short} in Settings &gt; PayGate.</div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold">2</div>
                                    <div>Send invoices by email (or share a link).</div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold">3</div>
                                    <div>Clients pay online and invoice status updates automatically (provider dependent).</div>
                                </li>
                            </ol>
                        </div>
                    </div>

                    {p.faq.length > 0 && (
                        <section className="mt-12">
                            <h2 className="text-xl font-semibold text-foreground">FAQ</h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {p.faq.map((f) => (
                                    <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
                                        <div className="text-foreground font-medium">{f.q}</div>
                                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="mt-12 rounded-3xl border border-border bg-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="text-lg font-semibold text-foreground">Ready to connect {p.short}?</div>
                            <div className="mt-1 text-sm text-muted-foreground">Enable PayGate, send invoices by email, and get paid online.</div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-neutral-200 h-11 px-6 text-sm font-semibold"
                            >
                                Get started
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center border border-border text-foreground hover:text-foreground hover:bg-muted h-11 px-6 text-sm font-semibold"
                            >
                                View pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
