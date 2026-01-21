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
        <div className="bg-black text-white">
            <section className="relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-linear-to-b from-white/5 via-black to-black" />
                <div className="relative mx-auto max-w-7xl px-6 py-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
                            <IconPlugConnected className="h-4 w-4" />
                            Integrations
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Connect the payment provider you already use</h1>
                        <p className="mt-4 text-white/60 text-lg leading-relaxed">
                            Illumi connects your preferred South African payment gateway via PayGate so clients can pay online and you can get paid in ZAR.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/features/paygate"
                                className="inline-flex items-center justify-center rounded-xl bg-white text-black hover:bg-neutral-200 h-11 px-6 text-sm font-semibold"
                            >
                                Learn about PayGate
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/5 h-11 px-6 text-sm font-semibold"
                            >
                                View Pro plan
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 max-w-4xl">
                        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                <div className="p-6 md:p-7">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <IconShieldCheck className="h-4 w-4 text-white/60" />
                                        Secure payment links
                                    </div>
                                    <div className="mt-2 text-sm text-white/60 leading-relaxed">
                                        Provider dependent, configurable in PayGate.
                                    </div>
                                </div>
                                <div className="border-t border-white/10 md:border-t-0 md:border-l p-6 md:p-7">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <IconCurrencyDollar className="h-4 w-4 text-white/60" />
                                        ZAR-first invoicing
                                    </div>
                                    <div className="mt-2 text-sm text-white/60 leading-relaxed">
                                        Built for South African SMMEs and contractors.
                                    </div>
                                </div>
                                <div className="border-t border-white/10 md:border-t-0 md:border-l p-6 md:p-7">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <IconPlugConnected className="h-4 w-4 text-white/60" />
                                        Multiple provider options
                                    </div>
                                    <div className="mt-2 text-sm text-white/60 leading-relaxed">
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
                                className="group block rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-semibold text-white">{p.name}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
                                        View
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-white/60 leading-relaxed">{p.blurb}</div>
                                <div className="mt-6 inline-flex items-center text-sm text-white/70 group-hover:text-white transition-colors">
                                    View integration <IconArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 border-t border-white/10 pt-8 text-white/50 text-sm">
                        Provider availability and payment methods can vary. Configure your provider in Settings &gt; PayGate.
                    </div>
                </div>
            </section>
        </div>
    )
}
