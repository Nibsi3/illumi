import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
    IconBolt,
    IconCloud,
    IconDevices,
    IconShieldCheck,
    IconClock,
    IconChartBar,
    IconMail,
    IconCreditCard,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Creator Online | Create Professional Invoices Free | Illumi",
    description: "Create professional invoices online in seconds with Illumi's free invoice creator. Beautiful templates, automatic VAT calculations, online payments, and instant PDF export. No software to install.",
    keywords: [
        "invoice creator",
        "invoice creator online",
        "invoice creator free",
        "create invoice online",
        "create invoice online free",
        "online invoice creator",
        "simple invoice creator",
        "professional invoice creator",
        "best invoice creator",
        "invoice creator app",
        "create invoices",
        "make an invoice",
        "how to create an invoice",
    ],
    openGraph: {
        title: "Invoice Creator Online | Create Professional Invoices | Illumi",
        description: "Create professional invoices online in seconds. Free, no signup required to preview.",
        type: "website",
    },
    alternates: {
        canonical: "/invoice-creator",
    },
}

const features = [
    {
        icon: IconBolt,
        title: "Create Invoices in Seconds",
        description: "Our smart invoice creator auto-fills your details, calculates totals, and generates professional invoices faster than any spreadsheet.",
    },
    {
        icon: IconCloud,
        title: "Cloud-Based — Access Anywhere",
        description: "No software to install. Create, edit, and send invoices from any device with a web browser. Your data is always synced and backed up.",
    },
    {
        icon: IconDevices,
        title: "Works on Every Device",
        description: "Desktop, laptop, tablet, or phone — our invoice creator works beautifully on any screen size. Create invoices on the go.",
    },
    {
        icon: IconShieldCheck,
        title: "Secure & SARS-Compliant",
        description: "Bank-level encryption protects your data. Our invoices include all fields required by SARS for tax compliance.",
    },
    {
        icon: IconClock,
        title: "Recurring Invoices",
        description: "Set up recurring invoices for retainer clients. They're created and sent automatically — you never forget to bill again.",
    },
    {
        icon: IconChartBar,
        title: "Track Everything",
        description: "Know when clients view your invoice, track payment status, and see your revenue at a glance with built-in analytics.",
    },
    {
        icon: IconMail,
        title: "Send via Email or WhatsApp",
        description: "Email invoices with one click or share a payment link via WhatsApp. Clients can view and pay online instantly.",
    },
    {
        icon: IconCreditCard,
        title: "Accept Online Payments",
        description: "Get paid faster with integrated PayFast, Yoco, Ozow, and Stripe. Clients pay directly from the invoice.",
    },
]

const comparisons = [
    { feature: "Create unlimited invoices", illumi: true, spreadsheets: true, others: "Limited" },
    { feature: "Professional templates", illumi: true, spreadsheets: false, others: "Limited" },
    { feature: "Automatic VAT calculations", illumi: true, spreadsheets: false, others: true },
    { feature: "Online payments (PayFast, Yoco)", illumi: true, spreadsheets: false, others: false },
    { feature: "Email & WhatsApp sending", illumi: true, spreadsheets: false, others: "Email only" },
    { feature: "Invoice tracking (viewed/paid)", illumi: true, spreadsheets: false, others: true },
    { feature: "Expense tracking", illumi: true, spreadsheets: false, others: "Paid" },
    { feature: "Client management", illumi: true, spreadsheets: false, others: "Paid" },
    { feature: "ZAR & SA payment gateways", illumi: true, spreadsheets: false, others: false },
    { feature: "Free plan", illumi: true, spreadsheets: true, others: "Trial only" },
]

export default function InvoiceCreatorPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <IconFileInvoice className="w-4 h-4" />
                            The Fastest Way to Create Professional Invoices
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Create Beautiful Invoices Online — Free
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Stop wasting hours on spreadsheets. Illumi&apos;s invoice creator lets you build professional invoices in seconds, send them instantly, and get paid online. No installation needed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/invoices/new">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    Start Creating Invoices
                                    <IconArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Create, Send & Track Invoices
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Illumi is more than an invoice creator — it&apos;s a complete business tool that helps you look professional and get paid faster.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {features.map((f) => (
                            <div key={f.title} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
                                <f.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Illumi vs Spreadsheets vs Other Invoice Creators
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                See why businesses switch from Excel and other tools to Illumi.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 font-semibold">Feature</th>
                                        <th className="p-4 font-semibold text-primary">Illumi</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Spreadsheets</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Other Tools</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisons.map((row) => (
                                        <tr key={row.feature} className="border-b">
                                            <td className="p-4 text-sm">{row.feature}</td>
                                            <td className="p-4 text-center">
                                                {row.illumi === true ? (
                                                    <IconCheck className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">{String(row.illumi)}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.spreadsheets === true ? (
                                                    <IconCheck className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : row.spreadsheets === false ? (
                                                    <span className="text-red-400">✕</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">{String(row.spreadsheets)}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.others === true ? (
                                                    <IconCheck className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : row.others === false ? (
                                                    <span className="text-red-400">✕</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">{row.others}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                        <h2>How to Create an Invoice Online</h2>
                        <p>Creating a professional invoice online has never been easier. With Illumi&apos;s free invoice creator, you can generate polished, SARS-compliant invoices in under a minute. Here&apos;s everything you need to know about creating invoices that get you paid faster.</p>

                        <h3>What is an Invoice Creator?</h3>
                        <p>An invoice creator is a digital tool that helps you generate professional invoices without manual formatting or calculations. Unlike spreadsheet templates that require constant updating, a modern invoice creator like Illumi handles everything automatically — from sequential invoice numbering to VAT calculations.</p>

                        <h3>Why Use an Online Invoice Creator Instead of Excel?</h3>
                        <p>While Excel and Google Sheets can technically create invoices, they lack critical features that save time and reduce errors:</p>
                        <ul>
                            <li><strong>No automatic numbering</strong> — you have to manually track invoice numbers in spreadsheets</li>
                            <li><strong>No payment tracking</strong> — you can&apos;t see if a client has viewed or paid your invoice</li>
                            <li><strong>No online payments</strong> — clients can&apos;t click a button to pay instantly</li>
                            <li><strong>Manual calculations</strong> — VAT and totals must be calculated with formulas that can break</li>
                            <li><strong>No client management</strong> — each invoice is a standalone file with no history</li>
                        </ul>

                        <h3>Creating Invoices for South African Businesses</h3>
                        <p>South African businesses have specific invoicing requirements set by SARS. If you&apos;re VAT-registered, your tax invoices must include your VAT number, the words &quot;Tax Invoice&quot;, and clearly show the VAT amount. Illumi&apos;s invoice creator handles all of this automatically, ensuring every invoice you send is fully compliant.</p>

                        <p>Whether you&apos;re a freelance designer in Cape Town, a plumber in Johannesburg, or a consulting firm in Durban, Illumi gives you the tools to invoice professionally and get paid faster. <Link href="/invoices/new" className="text-primary font-semibold">Create your free account today</Link> and send your first invoice in minutes.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Create Your First Invoice?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of businesses using Illumi. 2 months of Pro features free — no credit card required.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Create Free Invoice Now
                            <IconArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
