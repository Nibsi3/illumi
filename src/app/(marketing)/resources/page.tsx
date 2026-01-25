import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import {
    IconCalculator,
    IconChartBar,
    IconTrendingUp,
    IconFileAnalytics,
    IconScale,
    IconClock,
    IconCurrencyDollar,
    IconReportAnalytics,
    IconBulb,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "SME Resources & Benchmarks | Illumi South Africa",
    description: "Free tools, calculators, and data insights for South African small businesses. Cash flow benchmarks, payment trends, expense analysis, and industry comparisons.",
    keywords: [
        "SME benchmarks South Africa",
        "small business cash flow calculator",
        "invoice payment trends SA",
        "business expense analysis",
        "SME financial tools",
        "South African business data",
    ],
}

const resourceCategories = [
    {
        title: "Benchmark Reports & Industry Insights",
        icon: IconChartBar,
        description: "Real data on South African SME performance, payment trends, and industry benchmarks",
        resources: [
            {
                title: "SA Small Business Invoicing Benchmarks",
                description: "Typical invoice amounts, payment times, and late-pay rates by industry",
                href: "/resources/invoicing-benchmarks",
                badge: "Popular",
            },
            {
                title: "Average Payment Terms & Days Outstanding",
                description: "How long SA businesses wait for payment by sector",
                href: "/resources/payment-terms-analysis",
            },
            {
                title: "Quarterly SME Cash Flow Trends",
                description: "Real data on income vs expenses (anonymous aggregated)",
                href: "/resources/cash-flow-trends",
            },
            {
                title: "Top 50 Most Common Expenses for SA Startups",
                description: "With percentage breakdowns and industry comparisons",
                href: "/resources/startup-expenses",
            },
            {
                title: "Invoicing & Expense Seasonality Trends",
                description: "Peaks and troughs over the year for SMEs",
                href: "/resources/seasonality-trends",
            },
        ],
    },
    {
        title: "Interactive Tools & Calculators",
        icon: IconCalculator,
        description: "Free calculators and tools to analyze your business performance",
        resources: [
            {
                title: "Invoice Payment Predictor Tool",
                description: "Predict payment speed based on industry and client size",
                href: "/resources/payment-predictor",
                badge: "Interactive",
            },
            {
                title: "SME Cash Flow Health Score Calculator",
                description: "Input basic data to get a visual health score",
                href: "/resources/cash-flow-calculator",
                badge: "Interactive",
            },
            {
                title: "VAT & Tax Estimate Explorer",
                description: "See how VAT and taxes affect small business profitability",
                href: "/resources/vat-calculator",
                badge: "Interactive",
            },
            {
                title: "Late Payment Cost Calculator",
                description: "Calculate how much overdue invoices cost annually",
                href: "/resources/late-payment-calculator",
                badge: "Interactive",
            },
            {
                title: "Invoice Template Performance Analyzer",
                description: "Get suggestions to improve your invoice templates",
                href: "/resources/template-analyzer",
            },
        ],
    },
    {
        title: "Comparisons & Rankings",
        icon: IconScale,
        description: "Data-driven comparisons and industry rankings for SA businesses",
        resources: [
            {
                title: "Top Paying vs Slowest Paying Clients by Industry",
                description: "Aggregated anonymized rankings",
                href: "/resources/client-payment-rankings",
            },
            {
                title: "Best Performing Business Types for Profit Margin",
                description: "Rankings based on invoicing and expense data",
                href: "/resources/profit-margin-rankings",
            },
            {
                title: "Recurring vs One-Off Invoices Comparison",
                description: "Stats on collection speed and reliability",
                href: "/resources/recurring-vs-oneoff",
            },
            {
                title: "Invoicing Automation vs Manual Invoicing ROI",
                description: "Data showing time and cost savings",
                href: "/resources/automation-roi",
            },
        ],
    },
    {
        title: "Educational Data Series",
        icon: IconBulb,
        description: "Learn from real-world data and trends across South African SMEs",
        resources: [
            {
                title: "How SMEs Price Their Services Across SA",
                description: "Real world pricing ranges and patterns",
                href: "/resources/pricing-benchmarks",
            },
            {
                title: "SME Revenue Growth Benchmarks Year-on-Year",
                description: "By business age and sector",
                href: "/resources/revenue-growth",
            },
            {
                title: "Digital vs Manual Invoicing Adoption Trends",
                description: "Usage patterns with trend charts",
                href: "/resources/digital-adoption",
            },
            {
                title: "Invoice Email Open & Paid Rate Stats",
                description: "Data-driven email optimization tips",
                href: "/resources/email-performance",
            },
            {
                title: "Small Business Expense Category Breakdown",
                description: "Visuals showing where money typically goes",
                href: "/resources/expense-breakdown",
            },
            {
                title: "SME Profit Shock Analysis",
                description: "How unexpected expenses hit profits and recovery patterns",
                href: "/resources/profit-shock-analysis",
            },
        ],
    },
]

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-white dark:bg-black/60" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconFileAnalytics className="h-4 w-4" />
                            Free Resources & Data
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            SME Resources & Benchmarks for South Africa
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Free tools, calculators, and real data insights to help you understand your business performance. 
                            Compare your metrics against South African industry benchmarks and make smarter decisions.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="#calculators"
                                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-11 text-sm font-semibold transition-colors"
                            >
                                <IconCalculator className="mr-2 h-4 w-4" />
                                Explore Calculators
                            </Link>
                            <Link
                                href="#benchmarks"
                                className="inline-flex items-center justify-center border border-border text-foreground hover:bg-muted px-6 h-11 text-sm font-semibold transition-colors"
                            >
                                <IconChartBar className="mr-2 h-4 w-4" />
                                View Benchmarks
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resource Categories */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    {resourceCategories.map((category, idx) => (
                        <div key={category.title} id={idx === 1 ? "calculators" : idx === 0 ? "benchmarks" : undefined}>
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-lg bg-accent">
                                        <category.icon className="h-6 w-6 text-foreground" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold">{category.title}</h2>
                                </div>
                                <p className="text-muted-foreground max-w-3xl">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.resources.map((resource) => (
                                    <Link
                                        key={resource.href}
                                        href={resource.href}
                                        className="group block rounded-2xl border border-border bg-card p-6 hover:border-border hover:bg-muted transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground transition-colors">
                                                {resource.title}
                                            </h3>
                                            {resource.badge && (
                                                <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-muted-foreground rounded">
                                                    {resource.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                            {resource.description}
                                        </p>
                                        <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            Explore →
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to track your own metrics?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Use Illumi to create professional invoices, track expenses, and monitor your cash flow in real-time. 
                        Compare your performance against these benchmarks automatically.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>

            <MarketingFooter />
        </div>
    )
}
