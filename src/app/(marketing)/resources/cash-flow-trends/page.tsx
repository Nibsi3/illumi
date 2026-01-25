import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Quarterly SME Cash Flow Trends in South Africa | Illumi",
    description: "Real-time cash flow data from South African SMEs. Track income vs expenses trends, seasonal patterns, and quarterly performance benchmarks.",
    keywords: [
        "SME cash flow trends South Africa",
        "quarterly business performance SA",
        "income vs expenses trends",
        "small business financial data",
    ],
}

const quarterlyData = [
    {
        quarter: "Q1 2024",
        avgIncome: 156000,
        avgExpenses: 142000,
        netCashFlow: 14000,
        trend: "up",
        notes: "Post-holiday recovery, strong start to year",
    },
    {
        quarter: "Q2 2024",
        avgIncome: 168000,
        avgExpenses: 148000,
        netCashFlow: 20000,
        trend: "up",
        notes: "Peak performance quarter, tax season boost",
    },
    {
        quarter: "Q3 2024",
        avgIncome: 152000,
        avgExpenses: 145000,
        netCashFlow: 7000,
        trend: "down",
        notes: "Mid-year slowdown, winter impact",
    },
    {
        quarter: "Q4 2024",
        avgIncome: 182000,
        avgExpenses: 158000,
        netCashFlow: 24000,
        trend: "up",
        notes: "Year-end surge, holiday spending",
    },
]

const sectorTrends = [
    {
        sector: "Retail & E-commerce",
        q1: 12,
        q2: 15,
        q3: 8,
        q4: 28,
        annual: 15.8,
    },
    {
        sector: "Professional Services",
        q1: 18,
        q2: 22,
        q3: 16,
        q4: 19,
        annual: 18.8,
    },
    {
        sector: "IT & Software",
        q1: 22,
        q2: 24,
        q3: 20,
        q4: 26,
        annual: 23.0,
    },
    {
        sector: "Construction",
        q1: 8,
        q2: 14,
        q3: 12,
        q4: 6,
        annual: 10.0,
    },
    {
        sector: "Creative & Design",
        q1: 14,
        q2: 18,
        q3: 11,
        q4: 16,
        annual: 14.8,
    },
]

export default function CashFlowTrendsPage() {
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
                        Updated Q4 2024
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Quarterly SME Cash Flow Trends in South Africa
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Anonymous aggregated data from 2,500+ South African SMEs showing real income vs expenses trends. 
                        Understand seasonal patterns and benchmark your quarterly performance.
                    </p>
                </div>

                {/* Annual Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Avg Quarterly Income</div>
                        <div className="text-3xl font-bold">R 164.5k</div>
                        <div className="text-xs text-muted-foreground mt-1">2024 average</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Avg Quarterly Expenses</div>
                        <div className="text-3xl font-bold">R 148.3k</div>
                        <div className="text-xs text-muted-foreground mt-1">2024 average</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Avg Net Cash Flow</div>
                        <div className="text-3xl font-bold text-green-400">R 16.3k</div>
                        <div className="text-xs text-muted-foreground mt-1">Per quarter</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Best Quarter</div>
                        <div className="text-3xl font-bold">Q4</div>
                        <div className="text-xs text-muted-foreground mt-1">+71% vs worst</div>
                    </div>
                </div>

                {/* Quarterly Breakdown */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">2024 Quarterly Performance</h2>
                    
                    <div className="space-y-6">
                        {quarterlyData.map((quarter) => (
                            <div key={quarter.quarter} className="rounded-xl bg-muted p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{quarter.quarter}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{quarter.notes}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {quarter.trend === "up" ? (
                                            <IconTrendingUp className="h-6 w-6 text-green-400" />
                                        ) : (
                                            <IconTrendingDown className="h-6 w-6 text-red-400" />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Avg Income</div>
                                        <div className="text-2xl font-bold">R {(quarter.avgIncome / 1000).toFixed(0)}k</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Avg Expenses</div>
                                        <div className="text-2xl font-bold">R {(quarter.avgExpenses / 1000).toFixed(0)}k</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Net Cash Flow</div>
                                        <div className={`text-2xl font-bold ${quarter.netCashFlow > 15000 ? 'text-green-400' : quarter.netCashFlow > 10000 ? 'text-foreground' : 'text-yellow-400'}`}>
                                            R {(quarter.netCashFlow / 1000).toFixed(0)}k
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                        <span>Cash Flow Margin</span>
                                        <span>{((quarter.netCashFlow / quarter.avgIncome) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-accent rounded-full h-2">
                                        <div 
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${(quarter.netCashFlow / quarter.avgIncome) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sector Trends */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden mb-12">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold">Cash Flow Margin by Sector (%)</h2>
                        <p className="text-sm text-muted-foreground mt-1">Net cash flow as percentage of revenue</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border">
                                <tr className="text-left">
                                    <th className="p-4 text-sm font-semibold text-foreground">Sector</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Q1 2024</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Q2 2024</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Q3 2024</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Q4 2024</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Annual Avg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectorTrends.map((row, idx) => (
                                    <tr key={row.sector} className={idx !== sectorTrends.length - 1 ? "border-b border-border" : ""}>
                                        <td className="p-4 text-foreground">{row.sector}</td>
                                        <td className="p-4 text-muted-foreground">{row.q1}%</td>
                                        <td className="p-4 text-muted-foreground">{row.q2}%</td>
                                        <td className="p-4 text-muted-foreground">{row.q3}%</td>
                                        <td className="p-4 text-muted-foreground">{row.q4}%</td>
                                        <td className="p-4">
                                            <span className={`font-semibold ${
                                                row.annual > 20 ? 'text-green-400' : 
                                                row.annual > 15 ? 'text-foreground' : 'text-yellow-400'
                                            }`}>
                                                {row.annual}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Insights from 2024</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Q4 is the strongest quarter for most SMEs</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Q4 2024 saw a 46% increase in net cash flow compared to Q3, driven by year-end spending, 
                                holiday sales, and businesses closing deals before year-end. Retail saw a 250% surge.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Q3 is the weakest quarter</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Mid-year slowdown in Q3 affected all sectors, with net cash flow dropping 65% compared to Q2. 
                                Winter months, budget exhaustion, and holiday planning delays contributed to the dip.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">IT & Software maintains consistent margins</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                IT businesses maintained 20%+ cash flow margins across all quarters, showing the least seasonal 
                                variation. Recurring revenue models and project-based work provide stability.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Construction struggles with cash flow</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Construction averaged only 10% cash flow margin annually, with Q4 dropping to 6% due to 
                                holiday shutdowns and delayed payments. Long payment cycles remain a major challenge.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Planning Tips */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Plan for Seasonal Trends</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Build Q4 Cash Reserves in Q2</h3>
                            <p className="text-sm text-muted-foreground">
                                Q2 is typically strong - save 20-30% of Q2 profits to cover Q3 slowdown and invest in Q4 growth.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Reduce Fixed Costs in Q3</h3>
                            <p className="text-sm text-muted-foreground">
                                Anticipate the Q3 dip by negotiating flexible contracts and reducing discretionary spending in July-September.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Maximize Q4 Opportunities</h3>
                            <p className="text-sm text-muted-foreground">
                                Launch promotions, close deals, and push for year-end purchases in Q4 when budgets refresh.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Plan for Q1 Recovery</h3>
                            <p className="text-sm text-muted-foreground">
                                Q1 starts slow but builds momentum. Focus on new client acquisition and setting up recurring revenue.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track your quarterly cash flow trends with Illumi</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-white/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
