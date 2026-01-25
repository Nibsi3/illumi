import Link from "next/link"
import Image from "next/image"
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
    title: "PayGate for Invoice Payments | Illumi",
    description: "Accept online payments on your invoices using your preferred payment provider. Automatic payment tracking, client payment portal, and instant notifications for South African businesses.",
    keywords: ["invoice payment gateway", "accept payments South Africa", "online invoice payments ZAR", "PayGate", "payment provider integration"],
}

const paymentProviders = [
    { name: "PayFast", status: "Available", logo: "PF" },
    { name: "PayStack", status: "Available", logo: "PS" },
    { name: "Yoco", status: "Available", logo: "Y" },
    { name: "Ozow", status: "Coming Soon", logo: "OZ" },
]

const features = [
    {
        icon: IconCreditCard,
        title: "Pay Now Button",
        description: "Every invoice includes a 'Pay Now' button. Clients pay instantly using your connected payment provider.",
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
        description: "Payments are handled securely by your connected provider. PCI-DSS compliant with fraud protection built in.",
    },
]

const benefits = [
    "Accept card payments (Visa, Mastercard, Amex)",
    "Instant EFT (provider dependent)",
    "SnapScan support",
    "Automatic invoice reconciliation",
    "Payment confirmation emails",
    "Transaction history in dashboard",
]

export default function PayGateFeaturePage() {
    return (
        <div className="bg-background grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-white dark:bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <span className="px-3 py-1 rounded-full bg-accent text-muted-foreground">PayGate Integration</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        Get Paid Faster<br />
                        <span className="text-muted-foreground">with PayGate</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
                        Add a &apos;Pay Now&apos; button to every invoice. Connect the payment provider you prefer and let invoice status update automatically when paid.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Enable PayGate
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted"
                        >
                            <Link href="/pricing">View Pro Plan</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Pro feature • R350/month</p>
                </div>
            </section>

            {/* Screenshot Section */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="border border-border rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/screenshots/online-invoicing-paygate-integrations-south-africa.png"
                            alt="PayGate settings for online invoicing with PayFast, Yoco, PayStack, Ozow and Peach Payments in South Africa"
                            title="Connect your payment provider"
                            width={1920}
                            height={1080}
                            quality={100}
                            priority
                            sizes="100vw"
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="text-center text-muted-foreground text-sm mt-4">Connect your preferred payment provider in minutes</p>
                </div>
            </section>

            {/* Payment Flow Mockup */}
            <section className="py-16 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Invoice Preview */}
                        <div className="border border-border rounded-3xl bg-card dark:bg-black/50 overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <div className="text-sm font-medium text-foreground">Invoice #INV-2024-042</div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between mb-8">
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bill to</div>
                                        <div className="text-sm text-foreground">Acme Corp</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount Due</div>
                                        <div className="text-3xl font-serif font-bold text-foreground">R 4,500.00</div>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-6">
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-14 text-lg font-medium">
                                        <IconCreditCard className="mr-2 h-5 w-5" />
                                        Pay Now
                                    </Button>
                                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
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
                            <div className="border border-border rounded-2xl p-6 bg-muted/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                                        <IconCheck className="h-5 w-5 text-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-foreground">Payment Received</div>
                                        <div className="text-xs text-muted-foreground">2 minutes ago</div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Acme Corp paid R 4,500.00 online. Invoice #INV-2024-042 marked as paid.
                                </p>
                            </div>
                            <div className="border border-border rounded-2xl p-6 bg-muted/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                                        <IconBolt className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-foreground">Automatic Updates</div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    No more chasing clients for payment confirmations. Payment webhooks update your dashboard instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Providers */}
            <section className="py-16 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">South African Payment Providers</h2>
                        <p className="text-muted-foreground">Connect your preferred payment gateway</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {paymentProviders.map((provider, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-muted/50 border border-border text-center">
                                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3">
                                    <span className="text-lg font-bold text-muted-foreground">{provider.logo}</span>
                                </div>
                                <div className="text-sm font-medium text-foreground mb-1">{provider.name}</div>
                                <div className={`text-xs ${provider.status === "Primary" ? "text-foreground" : provider.status === "Available" ? "text-muted-foreground" : "text-muted-foreground"}`}>
                                    {provider.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">How PayGate works</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Connect once, get paid on every invoice automatically.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-muted/50 border border-border hover:border-border transition-colors">
                                <feature.icon className="h-10 w-10 text-muted-foreground mb-6" />
                                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits List */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">Accept all payment methods</h2>
                            <ul className="space-y-4">
                                {benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <IconCheck className="h-5 w-5 text-muted-foreground shrink-0" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8 rounded-2xl bg-muted/50 border border-border">
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-2">Pro Plan</div>
                                <div className="text-4xl font-serif font-bold text-foreground mb-2">R350</div>
                                <div className="text-muted-foreground mb-6">/month</div>
                                <Button
                                    asChild
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12"
                                >
                                    <Link href="/login">Upgrade to Pro</Link>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-4">Cancel anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
