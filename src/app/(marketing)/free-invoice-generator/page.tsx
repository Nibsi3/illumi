import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
    IconGift,
    IconInfinity,
    IconDownload,
    IconShieldCheck,
    IconRocket,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Invoice Generator — No Signup, No Hidden Fees | Illumi",
    description: "Generate professional invoices for free. Unlimited invoices, PDF export, VAT calculations, and client management — all completely free. No credit card, no trials, no catch.",
    keywords: [
        "free invoice generator",
        "free invoice generator no sign up",
        "free invoice maker",
        "free invoice software",
        "free invoicing",
        "free invoice creator",
        "generate invoice free",
        "free invoice template generator",
        "free online invoice generator",
        "invoice generator no signup",
        "free billing software",
        "free invoice app",
        "free invoice PDF",
    ],
    openGraph: {
        title: "Free Invoice Generator | No Hidden Fees | Illumi",
        description: "Generate unlimited professional invoices for free. No credit card, no trials.",
        type: "website",
    },
    alternates: {
        canonical: "/free-invoice-generator",
    },
}

const freeFeatures = [
    { icon: IconInfinity, title: "Unlimited Invoices", desc: "Create as many invoices as you need. No monthly limits, no per-invoice fees, no restrictions." },
    { icon: IconDownload, title: "Free PDF Export", desc: "Download every invoice as a polished PDF document. Print, email, or archive — all free." },
    { icon: IconShieldCheck, title: "SARS-Compliant", desc: "Every invoice includes all fields required by SARS for VAT compliance. Tax invoice ready." },
    { icon: IconGift, title: "No Hidden Fees", desc: "Our free plan is genuinely free. No credit card on file, no sneaky upgrades, no trial expiry." },
]

const freeVsPro = [
    { feature: "Unlimited invoices", free: true, pro: true },
    { feature: "Professional templates", free: true, pro: true },
    { feature: "PDF export", free: true, pro: true },
    { feature: "Client management", free: true, pro: true },
    { feature: "Expense tracking", free: true, pro: true },
    { feature: "VAT calculations", free: true, pro: true },
    { feature: "Email invoices", free: true, pro: true },
    { feature: "Online payments", free: false, pro: true },
    { feature: "Recurring invoices", free: false, pro: true },
    { feature: "Custom branding (remove Illumi logo)", free: false, pro: true },
    { feature: "WhatsApp payment links", free: false, pro: true },
    { feature: "Priority support", free: false, pro: true },
]

export default function FreeInvoiceGeneratorPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
                            <IconGift className="w-4 h-4" />
                            100% Free — No Catch
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Free Invoice Generator
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Create unlimited professional invoices for free. No credit card required, no trial period, no per-invoice fees. Just sign up and start invoicing — free forever.
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="text-lg px-8 py-6">
                                <IconRocket className="mr-2 w-5 h-5" />
                                Generate Your First Invoice — Free
                            </Button>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Join 5,000+ businesses already using Illumi for free.
                        </p>
                    </div>
                </div>
            </section>

            {/* What's Free */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What&apos;s Included for Free?</h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Everything you need to create, send, and manage professional invoices — at zero cost.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {freeFeatures.map((f) => (
                            <div key={f.title} className="bg-card rounded-xl border p-6 text-center">
                                <f.icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Free vs Pro */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Free Plan vs Pro Plan</h2>
                            <p className="text-lg text-muted-foreground">Our free plan covers everything most businesses need. Upgrade to Pro only if you want online payments and advanced features.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 font-semibold">Feature</th>
                                        <th className="p-4 font-semibold text-green-600">Free</th>
                                        <th className="p-4 font-semibold text-primary">Pro (R149/mo)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {freeVsPro.map((row) => (
                                        <tr key={row.feature} className="border-b">
                                            <td className="p-4 text-sm">{row.feature}</td>
                                            <td className="p-4 text-center">
                                                {row.free ? <IconCheck className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.pro ? <IconCheck className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-4 justify-center mt-8">
                            <Link href="/login"><Button size="lg">Create an Invoice — Free</Button></Link>
                            <Link href="/pricing"><Button size="lg" variant="outline">Compare Plans</Button></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                        <h2>Why Illumi&apos;s Free Invoice Generator is Different</h2>
                        <p>Most &quot;free&quot; invoice generators have a catch: limited invoices per month, watermarks on your PDFs, or a 14-day trial that expires. Illumi is different. Our free plan gives you genuinely unlimited invoicing capabilities with no strings attached.</p>

                        <h3>What You Can Do for Free</h3>
                        <ul>
                            <li>Create <strong>unlimited invoices</strong> — there is no monthly cap</li>
                            <li>Add <strong>unlimited clients</strong> to your address book</li>
                            <li>Track <strong>unlimited expenses</strong> for tax time</li>
                            <li>Download invoices as <strong>professional PDFs</strong></li>
                            <li>Send invoices via <strong>email</strong> directly from Illumi</li>
                            <li><strong>Automatic VAT calculations</strong> at 15% or any custom rate</li>
                            <li><strong>Sequential invoice numbering</strong> handled automatically</li>
                            <li>Full <strong>expense tracking</strong> with receipt upload</li>
                        </ul>

                        <h3>When Should You Upgrade to Pro?</h3>
                        <p>The Pro plan (R149/month) is designed for businesses that want to accept online payments directly through their invoices. If your clients want to pay by card, EFT, or mobile money, Pro gives you integration with PayFast, Yoco, Ozow, and Stripe. You also get recurring invoices for retainer clients, custom branding (remove the Illumi watermark), and WhatsApp payment links.</p>

                        <h3>Free Invoice Generator for South African Businesses</h3>
                        <p>Illumi is built by South Africans, for South Africans. Our default currency is ZAR, we support all major SA payment gateways, and our invoice format meets SARS requirements. Whether you&apos;re a sole proprietor in Pretoria or a startup in Stellenbosch, Illumi helps you invoice like a pro — for free.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Invoicing for Free Today</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">No credit card. No trial. No catch. Just free, professional invoicing.</p>
                    <Link href="/login">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Create Free Account
                            <IconArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
