import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconClock,
    IconBuildingBank,
    IconCreditCard,
    IconDeviceMobile,
    IconWorld,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Payment Methods in South Africa: EFT, Card, PayFast & More | Illumi",
    description:
        "Compare every invoice payment method available in South Africa — EFT, credit card, PayFast, Yoco, Ozow, Stripe and more. Fees, speed, and setup guides.",
    keywords: [
        "invoice payment methods South Africa",
        "PayFast invoicing",
        "Yoco online payments",
        "EFT payment invoices",
        "accept card payments South Africa",
        "Ozow instant EFT",
        "online payment gateway SA",
    ],
    alternates: {
        canonical: "/blog/invoice-payment-methods-sa",
    },
}

const methods = [
    {
        name: "Manual EFT / Bank Transfer",
        speed: "1-3 business days",
        fees: "Free (your bank charges may apply)",
        pros: "No gateway fees. Clients are familiar with it. Works for any amount.",
        cons: "Slow. Requires manual reconciliation. Clients can delay easily.",
        best: "Trusted, long-term clients with predictable payment habits.",
    },
    {
        name: "PayFast",
        speed: "Instant to 1 business day",
        fees: "3.5% + R2 per transaction",
        pros: "Most popular SA gateway. Supports cards, EFT, Mobicred, SnapScan. Easy setup.",
        cons: "Fees add up on large invoices. Requires PayFast merchant account.",
        best: "South African businesses wanting the widest payment option coverage.",
    },
    {
        name: "Yoco",
        speed: "Next business day",
        fees: "2.95% per online transaction",
        pros: "Simple API. Clean checkout experience. Good for small businesses.",
        cons: "No instant EFT option. Limited to card payments online.",
        best: "Small businesses and freelancers wanting a simple card payment flow.",
    },
    {
        name: "Ozow (Instant EFT)",
        speed: "Instant",
        fees: "~1.5-2% per transaction",
        pros: "Instant bank-to-bank transfer. Lower fees than card payments. No chargebacks.",
        cons: "Client needs online banking. Not all banks supported equally.",
        best: "High-value invoices where card fees would be expensive.",
    },
    {
        name: "Stripe",
        speed: "2-7 business days (international)",
        fees: "2.9% + R5.50 per transaction",
        pros: "Global reach. Accepts international cards. Excellent developer tools.",
        cons: "Payouts in USD require conversion. Higher fees for SA businesses.",
        best: "Freelancers with international clients paying in USD/EUR/GBP.",
    },
    {
        name: "Peach Payments",
        speed: "1-2 business days",
        fees: "Custom pricing (typically 2.5-3.5%)",
        pros: "Enterprise-grade. Supports 3D Secure. Multiple payment methods.",
        cons: "Setup can be complex. Better suited for higher volumes.",
        best: "Growing businesses processing R50k+ per month in payments.",
    },
]

export default function PaymentMethodsPost() {
    return (
        <>
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
                        <span className="px-2 py-1 rounded bg-muted">Payments</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Invoice Payment Methods in South Africa: EFT, Card, PayFast &amp; More
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        The payment method on your invoice directly affects how fast you get paid.
                        Here&apos;s every option available in SA — with real fees, speed, and setup advice.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-bold mb-4">Why payment method matters</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Research shows that adding a &quot;Pay Now&quot; button to invoices reduces average payment time from
                            21 days to under 3 days. The easier you make it for clients to pay, the faster your cash flows.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconBuildingBank className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">EFT</div>
                            <div className="text-sm text-muted-foreground">Free but slow. Still the default for most SA businesses.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconCreditCard className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Card</div>
                            <div className="text-sm text-muted-foreground">Fast and convenient. 2.5-3.5% fee per transaction.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconDeviceMobile className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Instant EFT</div>
                            <div className="text-sm text-muted-foreground">Bank-to-bank in seconds. Lower fees than card.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconWorld className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">International</div>
                            <div className="text-sm text-muted-foreground">Stripe for USD/EUR. Higher fees but global reach.</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Payment method comparison</h2>
                    <div className="space-y-6">
                        {methods.map((m) => (
                            <div key={m.name} className="rounded-2xl border border-border bg-card p-6">
                                <div className="text-lg font-semibold mb-3">{m.name}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-foreground">Speed:</span>{" "}
                                        <span className="text-muted-foreground">{m.speed}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Fees:</span>{" "}
                                        <span className="text-muted-foreground">{m.fees}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-primary">Pros:</span>{" "}
                                        <span className="text-muted-foreground">{m.pros}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-destructive">Cons:</span>{" "}
                                        <span className="text-muted-foreground">{m.cons}</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm">
                                    <span className="font-medium text-foreground">Best for:</span>{" "}
                                    <span className="text-muted-foreground">{m.best}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-bold mb-4">Our recommendation</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For most South African freelancers and small businesses, we recommend offering <strong>two options</strong> on every invoice:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li><strong>A &quot;Pay Now&quot; button</strong> via PayFast or Yoco for instant card/EFT payments</li>
                            <li><strong>Banking details</strong> as a fallback for clients who prefer manual EFT</li>
                        </ol>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            This covers 95% of SA clients. For international work, add Stripe as a secondary gateway.
                        </p>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/login">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Set Up Online Payments
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/online-payments">
                            <Button variant="outline">Online Payments Guide</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Accept payments on your invoices today</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi supports PayFast, Yoco, Ozow, Stripe, and more — built in.
                        Connect your gateway and start getting paid faster.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
