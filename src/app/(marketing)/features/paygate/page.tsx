import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconCreditCard,
    IconShieldCheck,
    IconBolt,
    IconRefresh,
    IconBell,
} from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "PayFast Integration for Invoices | Illumi",
    description: "Accept payments via PayFast on your invoices. Automatic payment tracking, client payment portal, and instant notifications for South African businesses.",
    keywords: ["PayFast invoice integration", "accept payments South Africa", "invoice payment gateway", "PayFast merchant", "online invoice payments ZAR"],
}

const paymentProviders = [
    { name: "PayFast", status: "Primary", logo: "PF" },
    { name: "PayStack", status: "Available", logo: "PS" },
    { name: "Yoco", status: "Available", logo: "Y" },
    { name: "Ozow", status: "Coming Soon", logo: "OZ" },
]

const features = [
    {
        icon: IconCreditCard,
        title: "Pay Now Button",
        description: "Every invoice includes a 'Pay Now' button. Clients pay instantly via PayFast with card, EFT, or SnapScan.",
    },
    {
        icon: IconRefresh,
        title: "Auto-Update Status",
        description: "When clients pay, your invoice status automatically updates to 'Paid'. No manual tracking needed.",
    },
    {
        icon: IconBell,
        title: "Payment Notifications",
        description: "Get instant notifications when clients pay. Know the moment money hits your account.",
    },
    {
        icon: IconShieldCheck,
        title: "Secure Payments",
        description: "PayFast handles all payment security. PCI-DSS compliant with fraud protection built in.",
    },
]

const benefits = [
    "Accept card payments (Visa, Mastercard, Amex)",
    "Instant EFT via PayFast",
    "SnapScan support",
    "Automatic invoice reconciliation",
    "Payment confirmation emails",
    "Transaction history in dashboard",
]

export default function PayGateFeaturePage() {
    return (
        <div className="bg-black">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">PayFast Integration</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Get Paid Faster<br />
                        <span className="text-white/50">with PayFast Integration</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg mb-8">
                        Add a &apos;Pay Now&apos; button to every invoice. Clients pay via card, EFT, or SnapScan. Invoice status updates automatically when paid.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Enable PayFast
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5"
                        >
                            <Link href="/pricing">View Pro Plan</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-white/40 mt-4">Pro feature • R350/month</p>
                </div>
            </section>

            {/* Payment Flow Mockup */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Invoice Preview */}
                        <div className="border border-white/10 rounded-3xl bg-black/50 overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <div className="text-sm font-medium text-white">Invoice #INV-2024-042</div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between mb-8">
                                    <div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Bill to</div>
                                        <div className="text-sm text-white">Acme Corp</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Amount Due</div>
                                        <div className="text-3xl font-serif font-bold text-white">R 4,500.00</div>
                                    </div>
                                </div>
                                <div className="border-t border-white/10 pt-6">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-14 text-lg font-medium">
                                        <IconCreditCard className="mr-2 h-5 w-5" />
                                        Pay Now with PayFast
                                    </Button>
                                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/40">
                                        <span>Visa</span>
                                        <span>•</span>
                                        <span>Mastercard</span>
                                        <span>•</span>
                                        <span>EFT</span>
                                        <span>•</span>
                                        <span>SnapScan</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Update */}
                        <div className="space-y-6">
                            <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <IconCheck className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">Payment Received</div>
                                        <div className="text-xs text-white/50">2 minutes ago</div>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70">
                                    Acme Corp paid R 4,500.00 via PayFast. Invoice #INV-2024-042 marked as paid.
                                </p>
                            </div>
                            <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <IconBolt className="h-5 w-5 text-white/70" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">Automatic Updates</div>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70">
                                    No more chasing clients for payment confirmations. PayFast webhooks update your dashboard instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Providers */}
            <section className="py-16 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-white mb-4">South African Payment Providers</h2>
                        <p className="text-white/50">Connect your preferred payment gateway</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {paymentProviders.map((provider, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-lg font-bold text-white/70">{provider.logo}</span>
                                </div>
                                <div className="text-sm font-medium text-white mb-1">{provider.name}</div>
                                <div className={`text-xs ${provider.status === "Primary" ? "text-green-400" : provider.status === "Available" ? "text-white/50" : "text-white/30"}`}>
                                    {provider.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">How PayGate works</h2>
                        <p className="text-white/50 max-w-xl mx-auto">
                            Connect once, get paid on every invoice automatically.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                <feature.icon className="h-10 w-10 text-white/70 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/50">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits List */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Accept all payment methods</h2>
                            <ul className="space-y-4">
                                {benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/70">
                                        <IconCheck className="h-5 w-5 text-green-400 flex-shrink-0" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                            <div className="text-center">
                                <div className="text-sm text-white/50 mb-2">Pro Plan</div>
                                <div className="text-4xl font-serif font-bold text-white mb-2">R350</div>
                                <div className="text-white/50 mb-6">/month</div>
                                <Button
                                    asChild
                                    className="w-full bg-white text-black hover:bg-white/90 rounded-xl h-12"
                                >
                                    <Link href="/login">Upgrade to Pro</Link>
                                </Button>
                                <p className="text-xs text-white/40 mt-4">Cancel anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Start accepting payments today</h2>
                    <p className="text-white/50 mb-8 max-w-xl mx-auto">
                        Connect PayFast and add a Pay Now button to every invoice. Get paid faster, track payments automatically.
                    </p>
                    <Button
                        asChild
                        className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                    >
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
