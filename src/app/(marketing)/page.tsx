import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import {
    IconFileInvoice,
    IconFolder,
    IconSparkles,
    IconArrowRight,
    IconCheck,
    IconLayoutDashboard,
    IconMail,
    IconWallet,
    IconFileExport,
    IconLink,
    IconRefresh,
    IconCalendar,
    IconShieldCheck,
    IconCurrencyDollar,
    IconUsers,
    IconChartBar,
    IconReceipt,
} from "@tabler/icons-react"

const stats = [
    { label: "Invoices created", value: "15,000+" },
    { label: "SA businesses", value: "2,500+" },
    { label: "Clients managed", value: "8,400+" },
    { label: "ZAR processed", value: "R12M+" },
]

const featureCards = [
    {
        icon: IconMail,
        title: "Email Invoicing",
        description: "Send invoices by email in one click. Clients receive a secure link to view and pay.",
        keyword: "Tax invoices in ZAR",
    },
    {
        icon: IconFolder,
        title: "Client Folders",
        description: "Organize invoices by company with folder-style client management.",
        keyword: "Client invoice organization",
    },
    {
        icon: IconChartBar,
        title: "Net Profit Tracking",
        description: "See your real profit after expenses. Track income vs expenses in ZAR.",
        keyword: "Business expense tracker SA",
    },
    {
        icon: IconShieldCheck,
        title: "PayGate Integration",
        description: "Accept online payments using your chosen provider. Invoices auto-update when paid.",
        keyword: "Invoice payment gateway",
    },
    {
        icon: IconReceipt,
        title: "Tax & VAT Reports",
        description: "Export invoices and expenses for tax season. VAT-ready reporting.",
        keyword: "VAT invoice generator South Africa",
    },
    {
        icon: IconRefresh,
        title: "Recurring Invoices",
        description: "Set up recurring invoices for retainer clients. Save time on billing.",
        keyword: "Recurring invoice automation",
    },
]

const faqs = [
    {
        question: "What must be on a South African tax invoice?",
        answer: "A professional invoice should include: your business name and details, invoice number and date, customer details, itemized description of goods/services, and clear pricing. For VAT-registered businesses, you should also include your VAT number and VAT breakdown. Illumi handles all of this automatically based on your settings.",
    },
    {
        question: "Does Illumi work for VAT-registered businesses?",
        answer: "Yes! Illumi works for both VAT-registered and non-VAT registered businesses. You can set your VAT rate to 15% (or any rate) in settings, and invoices will automatically calculate and display VAT. For non-VAT registered businesses, simply keep the tax rate at 0% for clean, simple invoices.",
    },
    {
        question: "How do clients receive invoices?",
        answer: "Illumi sends invoices by email. Your client receives a secure link to view the invoice and pay online in ZAR (when PayGate is enabled with PayFast, Yoco, Ozow, or other South African payment providers).",
    },
    {
        question: "Can I accept online payments in South Africa?",
        answer: "Yes! Pro users can connect South African payment providers like PayFast, Yoco, Ozow, PayStack, or Peach Payments through PayGate. Once connected, a 'Pay Now' button appears on invoices, clients can pay online in ZAR, and invoice status updates automatically when paid.",
    },
    {
        question: "Is Illumi really free for South African businesses?",
        answer: "Yes! Our Free plan includes unlimited professional invoices, client database, product catalog, email sending, and PDF exports - free forever. Pro features like PayGate payments, custom branding, and recurring invoices are R350/month.",
    },
    {
        question: "Can I track business expenses and calculate net profit?",
        answer: "Absolutely. Track once-off and recurring expenses in ZAR, categorize them, and see your net profit (income minus expenses) on your dashboard. Export expense reports as CSV for your accountant or SARS tax submissions.",
    },
]

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
        },
    })),
}

const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Illumi - Professional Invoice Generator for South Africa",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Create professional invoices in ZAR for South African businesses. Optional VAT calculation. Free invoicing software.",
    "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "ZAR",
        "availability": "https://schema.org/InStock",
        "description": "Free plan with unlimited invoices. Pro plan at R350/month.",
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2500",
        "bestRating": "5",
        "worstRating": "1",
    },
    "featureList": [
        "Professional invoices for South Africa",
        "Optional VAT calculation",
        "ZAR currency support",
        "Email invoicing",
        "Online payment integration",
        "Expense tracking",
        "PDF export",
    ],
}

const invoicingFeatures = [
    "Build your client database",
    "Create product catalog",
    "Professional invoice templates",
    "Send via Email or Link",
    "Schedule invoices for later",
    "Recurring invoices (Pro)",
    "Client Payment Portal (Pro)",
]

const freeFeatures = [
    "Unlimited invoices",
    "Client database",
    "Product catalog",
    "Copy & paste invoices",
    "Sort by company (folders)",
    "Export as PDF",
]

const proFeatures = [
    "Custom business logo",
    "PayGate integration",
    "Client payment portal",
    "Recurring emails",
    "Auto-update invoice status",
]

export const metadata: Metadata = {
    title: "Illumi | Professional Invoicing for South African Businesses",
    description: "Create professional invoices in ZAR with optional VAT. Track expenses, manage clients, and accept online payments with PayGate — built for South African businesses.",
    alternates: {
        canonical: "/",
    },
}

export default function LandingPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `(() => { try { const u = new URL(window.location.href); if (u.pathname === '/' && u.searchParams.get('code')) { u.pathname = '/auth/callback'; window.location.replace(u.toString()); } } catch {} })();`,
                }}
            />
            <div className="bg-background font-sans text-foreground grainy-gradient">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-border py-24 md:py-32 pt-32 md:pt-40">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-background/60" />
                </div>
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground">Built for South Africa</span>
                                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">ZAR-first invoicing</span>
                                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">PayGate-ready</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground mb-6 font-serif font-medium tracking-tight">
                                Professional Invoicing
                                <br className="hidden md:block" />
                                <span className="text-muted-foreground">for South African Businesses</span>
                            </h1>

                            <p className="text-lg text-muted-foreground mb-7 max-w-xl leading-relaxed">
                                Create professional invoices in ZAR with optional VAT. Perfect for VAT and non-VAT registered businesses. Get paid online with PayFast, Yoco, Ozow. Free forever.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-xl">
                                {[
                                    { title: "Unlimited invoices", meta: "Free plan" },
                                    { title: "Client folders", meta: "Organised" },
                                    { title: "Recurring & scheduled", meta: "Automated" },
                                ].map((item) => (
                                    <div key={item.title} className="rounded-2xl border border-border bg-card p-4">
                                        <div className="text-sm font-semibold text-card-foreground">{item.title}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{item.meta}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <Link href="/login">
                                    <HoverBorderGradient
                                        as="div"
                                        containerClassName="w-full sm:w-auto"
                                        className="bg-primary text-primary-foreground font-sans font-medium px-8 h-12 flex items-center justify-center"
                                    >
                                        Get Started for Free
                                    </HoverBorderGradient>
                                </Link>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="px-8 h-12 border-border text-foreground hover:bg-accent font-sans"
                                >
                                    <Link href="/pricing">View Pricing</Link>
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground mb-12 font-sans">
                                Free forever • No credit card required
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">

                                {stats.map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-sans">
                                            {stat.label}
                                        </div>
                                        <div className="text-xl font-medium text-foreground">
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex lg:justify-end lg:pl-10">
                            <div
                                className="relative w-full max-w-xl lg:translate-x-10"
                                style={{
                                    transform: "perspective(1200px) rotateY(-8deg) rotateX(2deg)",
                                    transformOrigin: "center center",
                                }}
                            >
                                <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-linear-to-br from-foreground/5 via-transparent to-transparent pointer-events-none" />
                                    <div className="p-6 border-b border-border flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted" />
                                            <div className="text-sm text-muted-foreground">
                                                Overview <span className="text-muted-foreground/50">•</span> <span className="font-serif italic text-foreground">Net Profit</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="text-4xl font-serif text-foreground mb-8">R 5,278.50</div>
                                        <div className="h-32 flex items-end gap-1.5 mb-8">
                                            {[20, 35, 25, 50, 30, 45, 40, 60, 50, 65, 40, 75, 55, 70, 60, 80].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-primary/20 dark:bg-primary/10 rounded-t hover:bg-primary/30 transition-colors"
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { client: "Acme Corp", amount: "R 2,500.00", status: "Paid" },
                                                { client: "TechStart", amount: "R 1,800.00", status: "Pending" },
                                            ].map((invoice, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                                                    <span className="text-sm text-muted-foreground">{invoice.client}</span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-foreground">{invoice.amount}</span>
                                                        <span
                                                            className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
                                                                invoice.status === "Paid" ? "bg-success/20 text-success dark:bg-success/10" : "bg-muted text-muted-foreground"
                                                            }`}
                                                        >
                                                            {invoice.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Everything you need - Boxed Sections */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-16">
                        <h2 className="text-5xl md:text-6xl font-medium text-foreground mb-4 font-sans leading-none tracking-tight">Invoicing made simple</h2>
                        <p className="text-muted-foreground text-lg font-sans max-w-2xl">Everything you need to build invoices, manage clients, and get paid faster.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Client Database - Large Box */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-8 lg:p-12 bg-muted/50 flex items-center justify-center border-r border-border">
                                <div className="space-y-4 w-full max-w-sm">
                                    {[
                                        { name: "Acme Corp", contact: "John Doe", email: "john@acme.com" },
                                        { name: "Global Tech", contact: "Jane Smith", email: "jane@global.com" },
                                        { name: "Local Shop", contact: "Mike Jones", email: "mike@local.com" },
                                    ].map((client, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{client.name}</div>
                                                <div className="text-[10px] text-muted-foreground">{client.email}</div>
                                            </div>
                                            <div className="text-[10px] px-2 py-0.5 rounded bg-success/20 text-success">Active</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <h3 className="text-2xl font-medium text-foreground mb-6">Client management</h3>
                                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                    Build and manage your client database. Keep track of customer information, billing details, and communication history in one place.
                                </p>
                                <ul className="space-y-4">
                                    {["Detailed client profiles", "Multiple contact persons", "Billing history", "Automated payment tracking"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                            <IconCheck className="h-4 w-4 text-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Invoicing & Inbox - Two Boxes */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Invoicing */}
                            <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                                <h3 className="text-2xl font-medium text-foreground mb-6">Invoicing</h3>
                                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                    Create and send invoices to your customers, monitor your sent balance, track overdue payments and send reminders.
                                </p>
                                <ul className="space-y-4 mb-12">
                                    {invoicingFeatures.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                            <IconCheck className="h-4 w-4 text-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/features/invoicing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Explore invoicing
                                    <IconArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* PayGate */}
                            <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                                <h3 className="text-2xl font-medium text-foreground mb-6">PayGate</h3>
                                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                    Accept online payments via your preferred provider. Add a Pay Now button and let invoice status update automatically when paid.
                                </p>
                                <ul className="space-y-4 mb-12">
                                    {[
                                        "Connect PayFast, Yoco, PayStack and more",
                                        "Provider-dependent payment methods (card / EFT)",
                                        "Automatic status updates via webhooks",
                                        "Secure client payment portal link",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                            <IconCheck className="h-4 w-4 text-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/features/paygate" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Learn about PayGate
                                    <IconArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Free vs Pro - Two Boxes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Free */}
                        <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                            <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">Free Forever</div>
                            <h3 className="text-2xl font-medium text-foreground mb-6">Get started for free</h3>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                Everything you need to create and send professional invoices. No credit card required.
                            </p>
                            <ul className="space-y-4 mb-12">
                                {freeFeatures.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Start for free
                                <IconArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="bg-card border border-primary/20 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                                                        <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-6">Pro</div>
                            <h3 className="text-2xl font-medium text-foreground mb-6">Automate your payments</h3>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                Client payment portal with PayGate integration. Invoices update automatically when paid.
                            </p>
                            <ul className="space-y-4 mb-12">
                                {proFeatures.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                                View Pricing
                                <IconArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Reorganized Vault Section */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Folder cards */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {["Company", "Contracts", "Office"].map((folder, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                            <IconFolder className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-foreground">{folder}</div>
                                            <div className="text-[10px] text-muted-foreground">89.17 kb</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 pt-4">
                                {["Exports", "Brand.jpeg", "Client.txt"].map((file, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                                        <IconFolder className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex-1">
                                            <div className="text-sm text-foreground/70">{file}</div>
                                            <div className="text-[10px] text-muted-foreground">89.17 kb</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vault Main Info */}
                        <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
                            <h2 className="text-3xl font-medium text-foreground mb-6">Vault</h2>
                            <p className="text-muted-foreground text-sm mb-6 max-w-md">Store and organise invoices per client in Illumi.</p>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-md">
                                Keep every invoice and supporting file grouped by customer so it's easy to track each client and pull up their history.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {["Invoices stored per client", "Search and filter by client and date"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/features/vault" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
                                Centralize Your Files now
                                <IconArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        {/* Seamless export Box */}
                        <div className="lg:col-span-1 p-8 rounded-2xl bg-card border border-border flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-medium text-foreground mb-4">Seamless export</h3>
                                <p className="text-muted-foreground text-xs leading-relaxed mb-8">
                                    Take the hassle out of tax season. Just select your invoicing period and hit export to generate professional reports for your accountant.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                <div className="flex items-center gap-3 text-sm text-foreground/70">
                                    <div className="w-4 h-4 rounded-full border border-primary/30 border-t-primary animate-spin" />
                                    Exporting transactions
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-2">Please do not close browser until completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid - SEO Goldmine */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-medium text-foreground mb-4 font-sans">Built for South African Small Businesses</h2>
                        <p className="text-muted-foreground text-lg font-sans max-w-2xl mx-auto">
                            Everything you need to invoice clients, track expenses, and grow your business in ZAR.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featureCards.map((feature, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
                                <feature.icon className="h-10 w-10 text-primary mb-6" />
                                <h3 className="text-xl font-medium text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feature.description}</p>
                                <span className="text-xs text-muted-foreground/50 uppercase tracking-wider">{feature.keyword}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-16 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <IconShieldCheck className="h-5 w-5" />
                            <span>Secure payments via PayGate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconReceipt className="h-5 w-5" />
                            <span>VAT-ready reporting</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconCurrencyDollar className="h-5 w-5" />
                            <span>ZAR currency support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconMail className="h-5 w-5" />
                            <span>Email invoice delivery</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section with Schema */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-medium text-foreground mb-4">Frequently Asked Questions</h2>
                        <p className="text-sm text-muted-foreground">Add your business logo for free, or upgrade to Pro for PayGate, recurring invoices, and to remove Illumi branding.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-foreground font-medium mb-3">{faq.question}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
        </>
    )
}
