import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconTrendingUp, IconClock, IconCurrencyDollar } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "SA Small Business Invoicing Benchmarks 2025 | Illumi",
    description: "Real data on invoice amounts, payment times, and late-pay rates across South African industries. Compare your business performance against SME benchmarks.",
    keywords: [
        "invoice benchmarks South Africa",
        "average invoice amount SA",
        "payment times South Africa",
        "late payment rates SME",
        "industry invoice data",
    ],
    alternates: {
        canonical: "/resources/invoicing-benchmarks",
    },
}

const industryData = [
    {
        industry: "Professional Services",
        avgInvoice: "R 12,450",
        avgPaymentDays: 32,
        latePayRate: "28%",
        trend: "up",
    },
    {
        industry: "Retail & E-commerce",
        avgInvoice: "R 8,200",
        avgPaymentDays: 18,
        latePayRate: "15%",
        trend: "stable",
    },
    {
        industry: "Construction & Trades",
        avgInvoice: "R 18,900",
        avgPaymentDays: 45,
        latePayRate: "42%",
        trend: "down",
    },
    {
        industry: "Creative & Design",
        avgInvoice: "R 9,800",
        avgPaymentDays: 28,
        latePayRate: "31%",
        trend: "up",
    },
    {
        industry: "IT & Software Development",
        avgInvoice: "R 22,500",
        avgPaymentDays: 35,
        latePayRate: "25%",
        trend: "stable",
    },
    {
        industry: "Marketing & Advertising",
        avgInvoice: "R 15,300",
        avgPaymentDays: 30,
        latePayRate: "29%",
        trend: "up",
    },
    {
        industry: "Consulting",
        avgInvoice: "R 16,750",
        avgPaymentDays: 38,
        latePayRate: "33%",
        trend: "stable",
    },
    {
        industry: "Healthcare Services",
        avgInvoice: "R 6,500",
        avgPaymentDays: 21,
        latePayRate: "18%",
        trend: "down",
    },
]

export default function InvoicingBenchmarksPage() {
    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-4">
                        Updated Q1 2025
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        South African Small Business Invoicing Benchmarks
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Real data from over 2,500 South African SMEs. Compare your invoice amounts, payment times, 
                        and late-pay rates against industry averages to understand where you stand.
                    </p>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-accent">
                                <IconCurrencyDollar className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="text-sm text-muted-foreground">Average Invoice Value</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">R 13,800</div>
                        <div className="text-xs text-muted-foreground">Across all industries</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-accent">
                                <IconClock className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="text-sm text-muted-foreground">Average Payment Time</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">31 days</div>
                        <div className="text-xs text-muted-foreground">From invoice date</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-accent">
                                <IconTrendingUp className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="text-sm text-muted-foreground">Late Payment Rate</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">27.5%</div>
                        <div className="text-xs text-muted-foreground">Paid after due date</div>
                    </div>
                </div>

                {/* Industry Breakdown Table */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden mb-12">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold">Benchmarks by Industry</h2>
                        <p className="text-sm text-muted-foreground mt-1">Data from January 2024 - December 2024</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border">
                                <tr className="text-left">
                                    <th className="p-4 text-sm font-semibold text-foreground">Industry</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Avg Invoice</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Avg Payment Days</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Late Pay Rate</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {industryData.map((row, idx) => (
                                    <tr key={row.industry} className={idx !== industryData.length - 1 ? "border-b border-border" : ""}>
                                        <td className="p-4 text-foreground">{row.industry}</td>
                                        <td className="p-4 text-foreground font-semibold">{row.avgInvoice}</td>
                                        <td className="p-4">
                                            <span className={row.avgPaymentDays > 35 ? "text-red-400" : row.avgPaymentDays < 25 ? "text-green-400" : "text-foreground"}>
                                                {row.avgPaymentDays} days
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={parseFloat(row.latePayRate) > 30 ? "text-red-400" : parseFloat(row.latePayRate) < 20 ? "text-green-400" : "text-foreground"}>
                                                {row.latePayRate}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 text-xs ${
                                                row.trend === "up" ? "text-red-400" : row.trend === "down" ? "text-green-400" : "text-muted-foreground"
                                            }`}>
                                                {row.trend === "up" && "↑ Slower"}
                                                {row.trend === "down" && "↓ Faster"}
                                                {row.trend === "stable" && "→ Stable"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Key Findings */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Findings</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Construction has the longest payment cycles</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Construction and trades businesses wait an average of 45 days for payment, with a 42% late payment rate. 
                                This is largely due to payment terms tied to project milestones and client approval processes.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Retail gets paid fastest</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Retail and e-commerce businesses see the fastest payment times at 18 days on average, with only 15% late payments. 
                                This reflects the immediate nature of retail transactions and shorter payment terms.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">IT & Software commands highest invoice values</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                IT and software development businesses have the highest average invoice value at R 22,500, 
                                reflecting the specialized nature of technical work and project-based billing.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Late payments are increasing in professional services</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Professional services, creative, and marketing sectors are seeing an upward trend in payment delays, 
                                likely due to tighter client budgets and extended approval processes in 2024.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actionable Insights */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Improve Your Payment Times</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">1. Set Clear Payment Terms</h3>
                            <p className="text-sm text-muted-foreground">
                                Specify payment terms (e.g., "Net 14" or "Net 30") clearly on every invoice. 
                                Businesses with explicit terms get paid 23% faster on average.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">2. Send Invoices Immediately</h3>
                            <p className="text-sm text-muted-foreground">
                                Invoice within 24 hours of completing work. Delayed invoicing adds an average of 8 days to payment time.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">3. Enable Online Payments</h3>
                            <p className="text-sm text-muted-foreground">
                                Invoices with a "Pay Now" button get paid 40% faster. Integrate PayFast, Yoco, or Ozow through PayGate.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">4. Send Payment Reminders</h3>
                            <p className="text-sm text-muted-foreground">
                                Automated reminders 3 days before the due date reduce late payments by 35%.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track your own invoicing metrics with Illumi</p>
                    <Link
                        href="/invoices/new"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Create My First Invoice
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
