import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconSearch,
    IconFilter,
    IconFolder,
    IconCalendar,
    IconUser,
    IconHash,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Search & Filtering | Find Any Invoice Instantly | Illumi",
    description: "Powerful invoice search for South African businesses. Find invoices by number, client, amount, date, or status. Filter and organize your invoicing history effortlessly.",
    keywords: [
        "invoice search",
        "find invoices",
        "invoice filtering",
        "search invoice history",
        "invoice lookup",
        "invoice organization",
        "invoice management search",
        "find old invoices",
    ],
    alternates: {
        canonical: "/features/invoice-search",
    },
    openGraph: {
        title: "Invoice Search & Filtering | Illumi",
        description: "Find any invoice in seconds. Search by number, client, amount, or date.",
        type: "website",
        locale: "en_ZA",
    },
}

const searchFeatures = [
    {
        icon: IconHash,
        title: "Search by Invoice Number",
        description: "Type any invoice number and find it instantly. Works with partial matches too.",
    },
    {
        icon: IconUser,
        title: "Search by Client",
        description: "Find all invoices for a specific client. See their complete billing history.",
    },
    {
        icon: IconCalendar,
        title: "Filter by Date Range",
        description: "Find invoices from a specific period. Perfect for quarterly reviews or tax time.",
    },
    {
        icon: IconFilter,
        title: "Filter by Status",
        description: "Show only paid, pending, or overdue invoices. Focus on what matters.",
    },
    {
        icon: IconFolder,
        title: "Folder Organization",
        description: "Invoices are automatically organized by client in folders. Browse like a file system.",
    },
    {
        icon: IconSearch,
        title: "Full-Text Search",
        description: "Search invoice descriptions, line items, and notes. Find invoices by what's in them.",
    },
]

const searchExamples = [
    { query: "INV-2024", result: "All invoices from 2024" },
    { query: "Acme Corp", result: "All invoices for Acme Corp" },
    { query: "R 5000", result: "Invoices around R 5,000" },
    { query: "website design", result: "Invoices containing 'website design'" },
]

const benefits = [
    "Find any invoice in under 3 seconds",
    "No more scrolling through spreadsheets",
    "Instant access to client history",
    "Perfect for tax time and audits",
    "Works on mobile and desktop",
    "Search across all your workspaces",
]

export default function InvoiceSearchPage() {
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
                        <span className="px-3 py-1 rounded-full bg-accent text-muted-foreground">Invoice Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        Find Any Invoice<br />
                        <span className="text-muted-foreground">In Seconds</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
                        Powerful search and filtering for your invoice history. No more digging through spreadsheets or email archives.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Start Searching
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted"
                        >
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Search Demo */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border mb-6">
                            <IconSearch className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Search invoices...</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">Try searching for:</div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {searchExamples.map((example, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <code className="text-sm text-primary">{example.query}</code>
                                    <span className="text-xs text-muted-foreground">→ {example.result}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Features */}
            <section className="py-16 bg-muted/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                        Search & Filter Options
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchFeatures.map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
                                <feature.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                        Why Businesses Love Invoice Search
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <IconCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-foreground">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-muted/30">
                <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Stop Searching, Start Finding
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Join thousands of South African businesses who find invoices in seconds, not minutes.
                    </p>
                    <Button
                        asChild
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                    >
                        <Link href="/login">
                            Try Illumi Free
                            <IconArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
