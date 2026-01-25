import Link from "next/link"
import { Metadata } from "next"
import { IconArrowRight, IconPlugConnected, IconShieldCheck, IconCurrencyDollar } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Integrations | Illumi (South Africa)",
    description: "Connect your preferred South African payment gateway for online invoice payments. PayFast, Yoco, Ozow, PayStack, Peach Payments and more.",
    keywords: [
        "invoicing app integrations South Africa",
        "PayFast invoicing integration",
        "Yoco invoice payments",
        "Ozow EFT payments online",
        "South African payment gateway for invoices",
        "ZAR invoicing software",
    ],
}

const INTEGRATIONS = [
    {
        slug: "payfast",
        name: "PayFast",
        blurb: "Accept card, Instant EFT and more on your invoices.",
    },
    {
        slug: "yoco",
        name: "Yoco",
        blurb: "Let clients pay your invoices online using Yoco.",
    },
    {
        slug: "ozow",
        name: "Ozow",
        blurb: "Offer fast bank-to-bank EFT payments from your invoices.",
    },
    {
        slug: "paystack",
        name: "PayStack",
        blurb: "Modern payments infrastructure for African businesses.",
    },
    {
        slug: "peach-payments",
        name: "Peach Payments",
        blurb: "Enterprise-ready card payments for higher-volume businesses.",
    },
    {
        slug: "snapscan",
        name: "SnapScan",
        blurb: "Enable QR-based payments where supported by your provider.",
    },
]

export default function IntegrationsIndexPage() {
    return (
        <div className="bg-background text-foreground grainy-gradient">
            <section className="relative overflow-hidden border-b border-border py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-white dark:bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 justify-center">
                            <span className="px-3 py-1 bg-accent text-muted-foreground">Payment Provider Integrations</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Connect the payment provider you already use
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
                            Illumi connects your preferred South African payment gateway via PayGate so clients can pay online and you can get paid in ZAR.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/features/paygate"
                                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-white/90 px-8 h-12 text-sm font-semibold"
                            >
                                Learn about PayGate
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center px-8 h-12 border border-border text-foreground hover:bg-muted text-sm font-semibold"
                            >
                                View Pro plan
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 max-w-4xl mx-auto">
                        <div className="rounded-3xl border border-border bg-card overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                <div className="p-6 md:p-7 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <IconShieldCheck className="h-4 w-4 text-muted-foreground" />
                                        Secure payment links
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        Provider dependent, configurable in PayGate.
                                    </div>
                                </div>
                                <div className="border-t border-border md:border-t-0 md:border-l p-6 md:p-7 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                                        ZAR-first invoicing
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        Built for South African SMMEs and contractors.
                                    </div>
                                </div>
                                <div className="border-t border-border md:border-t-0 md:border-l p-6 md:p-7 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <IconPlugConnected className="h-4 w-4 text-muted-foreground" />
                                        Multiple provider options
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        Use PayFast, Yoco, Ozow, PayStack and more.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {INTEGRATIONS.map((p) => (
                            <Link
                                key={p.slug}
                                href={`/integrations/${p.slug}`}
                                className="group block rounded-2xl border border-border bg-card p-6 hover:border-border transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-semibold text-foreground">{p.name}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-muted-foreground transition-colors">
                                        View
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.blurb}</div>
                                <div className="mt-6 inline-flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                    View integration <IconArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 border-t border-border pt-8 text-muted-foreground text-sm">
                        Provider availability and payment methods can vary. Configure your provider in Settings &gt; PayGate.
                    </div>
                </div>
            </section>
        </div>
    )
}
