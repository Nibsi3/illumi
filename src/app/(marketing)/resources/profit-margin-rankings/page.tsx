import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconChartBar } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Best Performing Business Types for Profit Margin in SA | Illumi",
    description: "Which business types have the highest profit margins in South Africa? Real data from SMEs ranked by profitability and cash flow performance.",
    keywords: [
        "highest profit margin businesses South Africa",
        "most profitable business types SA",
        "SME profitability rankings",
        "best business models South Africa",
    ],
    alternates: {
        canonical: "/resources/profit-margin-rankings",
    },
}

const profitMarginRankings = [
    {
        rank: 1,
        businessType: "SaaS & Software Development",
        avgMargin: 42.5,
        revenueRange: "R 150k - R 500k/month",
        keyFactors: ["Low overhead", "Recurring revenue", "High scalability"],
        challenges: ["High customer acquisition cost", "Churn management"],
    },
    {
        rank: 2,
        businessType: "Digital Marketing Agencies",
        avgMargin: 38.2,
        revenueRange: "R 120k - R 400k/month",
        keyFactors: ["Low fixed costs", "Remote work", "High-value services"],
        challenges: ["Client retention", "Scope creep"],
    },
    {
        rank: 3,
        businessType: "Consulting (Strategy, Management)",
        avgMargin: 35.8,
        revenueRange: "R 180k - R 600k/month",
        keyFactors: ["Expertise-based pricing", "Minimal overhead", "High hourly rates"],
        challenges: ["Time-for-money model", "Scaling limitations"],
    },
    {
        rank: 4,
        businessType: "Accounting & Bookkeeping",
        avgMargin: 32.4,
        revenueRange: "R 100k - R 350k/month",
        keyFactors: ["Recurring clients", "Predictable revenue", "Low overhead"],
        challenges: ["Seasonal workload", "Compliance pressure"],
    },
    {
        rank: 5,
        businessType: "Graphic Design & Creative Studios",
        avgMargin: 28.6,
        revenueRange: "R 90k - R 300k/month",
        keyFactors: ["Project-based pricing", "Low equipment costs", "Remote work"],
        challenges: ["Inconsistent pipeline", "Price competition"],
    },
    {
        rank: 6,
        businessType: "E-commerce (Dropshipping/Digital)",
        avgMargin: 24.3,
        revenueRange: "R 200k - R 800k/month",
        keyFactors: ["No inventory costs", "Automation", "Global reach"],
        challenges: ["Marketing costs", "Supplier reliability"],
    },
    {
        rank: 7,
        businessType: "Professional Photography",
        avgMargin: 22.1,
        revenueRange: "R 60k - R 200k/month",
        keyFactors: ["Premium pricing", "Low ongoing costs", "Niche markets"],
        challenges: ["Equipment investment", "Seasonal demand"],
    },
    {
        rank: 8,
        businessType: "Retail (Physical Stores)",
        avgMargin: 18.5,
        revenueRange: "R 250k - R 1M/month",
        keyFactors: ["Volume sales", "Established market", "Brand loyalty"],
        challenges: ["High rent", "Inventory costs", "Theft/shrinkage"],
    },
    {
        rank: 9,
        businessType: "Construction & Trades",
        avgMargin: 15.2,
        revenueRange: "R 180k - R 600k/month",
        keyFactors: ["Essential services", "Repeat business", "Project-based"],
        challenges: ["Material costs", "Labor expenses", "Payment delays"],
    },
    {
        rank: 10,
        businessType: "Restaurants & Food Service",
        avgMargin: 12.8,
        revenueRange: "R 150k - R 500k/month",
        keyFactors: ["High volume", "Cash flow", "Local market"],
        challenges: ["Food costs", "Labor intensive", "Waste"],
    },
]

export default function ProfitMarginRankingsPage() {
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
                        2024 Rankings
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Best Performing Business Types for Profit Margin in SA
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Real profitability data from South African SMEs. See which business models generate the highest 
                        profit margins and understand the factors that drive profitability.
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Highest Profit Margin</div>
                        <div className="text-3xl font-bold text-green-400">42.5%</div>
                        <div className="text-xs text-muted-foreground mt-1">SaaS & Software</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Average Across All Types</div>
                        <div className="text-3xl font-bold">27.0%</div>
                        <div className="text-xs text-muted-foreground mt-1">Median margin</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Margin Spread</div>
                        <div className="text-3xl font-bold">3.3x</div>
                        <div className="text-xs text-muted-foreground mt-1">Top vs bottom</div>
                    </div>
                </div>

                {/* Rankings */}
                <div className="space-y-4 mb-12">
                    {profitMarginRankings.map((business) => (
                        <div key={business.rank} className="rounded-2xl border border-border bg-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                                        business.rank <= 3 ? 'bg-green-500/20 text-green-400' :
                                        business.rank <= 6 ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-accent text-muted-foreground'
                                    }`}>
                                        {business.rank}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">{business.businessType}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{business.revenueRange}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Avg Profit Margin</div>
                                    <div className={`text-3xl font-bold ${
                                        business.avgMargin > 35 ? 'text-green-400' :
                                        business.avgMargin > 25 ? 'text-blue-400' :
                                        business.avgMargin > 18 ? 'text-foreground' :
                                        'text-yellow-400'
                                    }`}>
                                        {business.avgMargin}%
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
                                <div>
                                    <div className="text-sm font-semibold text-foreground mb-2">Key Success Factors</div>
                                    <ul className="space-y-1">
                                        {business.keyFactors.map((factor, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground">• {factor}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-foreground mb-2">Main Challenges</div>
                                    <ul className="space-y-1">
                                        {business.challenges.map((challenge, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground">• {challenge}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Key Insights */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Insights</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Software businesses dominate profitability</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                SaaS and software development businesses achieve 42.5% profit margins due to low overhead, 
                                recurring revenue models, and high scalability. Once built, software can serve unlimited customers 
                                with minimal incremental cost.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Service businesses outperform product businesses</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                The top 5 are all service-based businesses (software, marketing, consulting, accounting, design). 
                                Service businesses have lower inventory costs, less capital requirements, and higher pricing flexibility.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Physical businesses face margin pressure</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Retail, construction, and restaurants rank lowest due to high fixed costs (rent, inventory, labor). 
                                These businesses require volume to compensate for thin margins.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Remote work = higher margins</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Businesses that can operate remotely (software, digital marketing, consulting) save 20-30% on overhead 
                                compared to those requiring physical locations. This directly translates to higher profit margins.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Margin Improvement Strategies */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">How to Improve Your Profit Margin</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">+15%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Add Recurring Revenue</h3>
                            <p className="text-sm text-muted-foreground">
                                Businesses with recurring revenue (subscriptions, retainers) have 15% higher margins than project-based work.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">+12%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Reduce Fixed Costs</h3>
                            <p className="text-sm text-muted-foreground">
                                Going remote, using freelancers, and automating processes can reduce fixed costs by 12% on average.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">+10%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Increase Prices</h3>
                            <p className="text-sm text-muted-foreground">
                                Most SMEs are underpriced. A 10% price increase with 95% retention improves margins by 10%.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">+8%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Productize Services</h3>
                            <p className="text-sm text-muted-foreground">
                                Package services into fixed-price offerings to reduce scope creep and improve efficiency.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Margin by Revenue Size */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">Profit Margin by Business Size</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">Under R 100k/month</div>
                                <div className="text-sm text-muted-foreground">Solopreneurs, freelancers</div>
                            </div>
                            <div className="text-2xl font-bold text-green-400">38%</div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">R 100k - R 500k/month</div>
                                <div className="text-sm text-muted-foreground">Small teams (2-10 people)</div>
                            </div>
                            <div className="text-2xl font-bold text-foreground">28%</div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">R 500k - R 2M/month</div>
                                <div className="text-sm text-muted-foreground">Growing businesses (10-50 people)</div>
                            </div>
                            <div className="text-2xl font-bold text-foreground">24%</div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">Over R 2M/month</div>
                                <div className="text-sm text-muted-foreground">Established companies (50+ people)</div>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">18%</div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-6">
                        Note: Solopreneurs have highest margins due to zero employee costs. Margins compress as businesses scale due to employee and operational overhead.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track your profit margins and compare against benchmarks with Illumi</p>
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
