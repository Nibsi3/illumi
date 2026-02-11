import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconCreditCard,
    IconBolt,
    IconShieldCheck,
    IconChartBar,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Online Payments for Invoices: Get Paid in Hours, Not Weeks | Illumi",
    description:
        "Stop waiting for EFT payments to clear. Learn how adding online payment options to your invoices can cut payment time from weeks to hours.",
    keywords: [
        "online invoice payments",
        "pay invoice online",
        "PayFast invoicing",
        "Yoco invoicing",
        "instant invoice payment",
        "South Africa online payments",
        "card payments for invoices",
    ],
    alternates: {
        canonical: "/blog/online-payments",
    },
}

const paymentStats = [
    { stat: "3x faster", description: "Invoices with payment links get paid 3x faster than bank-only invoices" },
    { stat: "47%", description: "of clients pay within 24 hours when a payment link is included" },
    { stat: "R0", description: "upfront cost — you only pay transaction fees when you get paid" },
]

const paymentMethods = [
    {
        icon: IconCreditCard,
        title: "Card payments",
        description: "Visa, Mastercard, and Amex. Clients pay in seconds, you get paid in 1-2 business days.",
    },
    {
        icon: IconBolt,
        title: "Instant EFT",
        description: "Clients pay directly from their bank. Faster than traditional EFT, no card needed.",
    },
    {
        icon: IconShieldCheck,
        title: "Secure checkout",
        description: "PCI-compliant payment processing. Your clients' data is protected.",
    },
    {
        icon: IconChartBar,
        title: "Automatic reconciliation",
        description: "Payments are matched to invoices automatically. No manual tracking needed.",
    },
]

const objections = [
    {
        objection: "But the transaction fees...",
        response: "A 2.5% fee on a R10,000 invoice is R250. Getting paid 3 weeks earlier is worth far more to your cash flow.",
    },
    {
        objection: "My clients prefer EFT",
        response: "Offer both. Many clients will choose the convenience of a payment link when given the option.",
    },
    {
        objection: "It seems complicated to set up",
        response: "Illumi connects to PayFast and Yoco in minutes. No coding, no technical skills needed.",
    },
]

const setupSteps = [
    "Connect your PayFast or Yoco account in Illumi settings",
    "Create an invoice as normal",
    "Payment link is automatically added to the invoice",
    "Client clicks, pays, done — you get notified instantly",
]

export default function OnlinePaymentsPost() {
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
                            5 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Payments</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Online Payments for Invoices: Get Paid in Hours, Not Weeks
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        The #1 reason invoices sit unpaid? Friction. Adding a "Pay Now" button removes that friction 
                        and dramatically speeds up payment.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {paymentStats.map((ps) => (
                            <div key={ps.stat} className="rounded-2xl border border-border bg-card p-6 text-center">
                                <div className="text-3xl font-bold text-primary mb-2">{ps.stat}</div>
                                <div className="text-sm text-muted-foreground">{ps.description}</div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <div className="flex items-start gap-3">
                            <IconCreditCard className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Why online payments work</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    When a client receives your invoice with a "Pay Now" button, they can pay immediately — 
                                    before they get distracted, before they forget, before it gets buried in their inbox. 
                                    The easier you make it to pay, the faster you get paid.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Payment options your clients will love</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paymentMethods.map((pm) => (
                            <div key={pm.title} className="rounded-2xl border border-border bg-card p-6">
                                <pm.icon className="h-6 w-6 text-primary mb-3" />
                                <div className="font-semibold mb-1">{pm.title}</div>
                                <div className="text-sm text-muted-foreground">{pm.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Common objections (and why they're wrong)</h2>
                    <div className="space-y-4">
                        {objections.map((obj) => (
                            <div key={obj.objection} className="rounded-2xl border border-border bg-card p-6">
                                <div className="font-semibold text-destructive mb-2">"{obj.objection}"</div>
                                <div className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <p className="text-sm text-muted-foreground">{obj.response}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-10">
                        <h3 className="text-xl font-semibold mb-4">Set up in 5 minutes</h3>
                        <div className="space-y-4">
                            {setupSteps.map((step, i) => (
                                <div key={step} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <p className="text-muted-foreground pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/invoices/new">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Enable Online Payments
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/integrations">
                            <Button variant="outline">View Payment Integrations</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Stop waiting. Start getting paid.</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi integrates with South Africa's top payment providers. Add a payment link to your invoices 
                        and watch your average payment time drop dramatically.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Try Illumi Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
