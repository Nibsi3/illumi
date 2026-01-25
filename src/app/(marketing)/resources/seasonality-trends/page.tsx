import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconCalendar } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing & Expense Seasonality Trends | Illumi SA",
    description: "Monthly peaks and troughs in SME invoicing and expenses throughout the year. Plan for seasonal cash flow variations in South Africa.",
    keywords: [
        "seasonal business trends South Africa",
        "monthly cash flow patterns",
        "SME seasonality SA",
        "business planning calendar",
    ],
}

const monthlyData = [
    { month: "January", invoicing: 72, expenses: 85, netFlow: -13, trend: "Recovery from holidays, high expenses" },
    { month: "February", invoicing: 88, expenses: 82, netFlow: 6, trend: "Business ramps up, back-to-school spending" },
    { month: "March", invoicing: 95, expenses: 88, netFlow: 7, trend: "Q1 close, tax year-end push" },
    { month: "April", invoicing: 92, expenses: 90, netFlow: 2, trend: "Post-Easter slowdown" },
    { month: "May", invoicing: 98, expenses: 86, netFlow: 12, trend: "Strong month, budget approvals" },
    { month: "June", invoicing: 100, expenses: 92, netFlow: 8, trend: "Mid-year peak, financial year-end" },
    { month: "July", invoicing: 78, expenses: 88, netFlow: -10, trend: "Winter slowdown, school holidays" },
    { month: "August", invoicing: 82, expenses: 85, netFlow: -3, trend: "Slow recovery, budget constraints" },
    { month: "September", invoicing: 90, expenses: 90, netFlow: 0, trend: "Spring pickup, new projects" },
    { month: "October", invoicing: 94, expenses: 88, netFlow: 6, trend: "Q4 momentum builds" },
    { month: "November", invoicing: 105, expenses: 95, netFlow: 10, trend: "Year-end push, Black Friday" },
    { month: "December", invoicing: 110, expenses: 105, netFlow: 5, trend: "Peak month, holiday spending" },
]

export default function SeasonalityTrendsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Invoicing & Expense Seasonality Trends
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Monthly patterns in South African SME invoicing and expenses. Understand seasonal peaks and troughs 
                        to plan cash flow, staffing, and marketing throughout the year.
                    </p>
                </div>

                {/* Annual Overview */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Annual Seasonality Pattern</h2>
                    
                    <div className="space-y-3">
                        {monthlyData.map((data) => (
                            <div key={data.month} className="rounded-xl bg-muted p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <IconCalendar className="h-5 w-5 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold text-foreground">{data.month}</h3>
                                    </div>
                                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                        data.netFlow > 5 ? 'bg-green-500/20 text-green-400' :
                                        data.netFlow < 0 ? 'bg-red-500/20 text-red-400' :
                                        'bg-accent text-muted-foreground'
                                    }`}>
                                        {data.netFlow > 0 ? '+' : ''}{data.netFlow}% net flow
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">Invoicing Activity</div>
                                        <div className="w-full bg-accent rounded-full h-2">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${data.invoicing}%` }}
                                            />
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">{data.invoicing}% of peak</div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">Expense Level</div>
                                        <div className="w-full bg-accent rounded-full h-2">
                                            <div 
                                                className="h-full bg-orange-500 rounded-full"
                                                style={{ width: `${data.expenses}%` }}
                                            />
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">{data.expenses}% of peak</div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">Net Cash Flow</div>
                                        <div className="w-full bg-accent rounded-full h-2">
                                            <div 
                                                className={`h-full rounded-full ${data.netFlow >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.abs(data.netFlow) * 5}%` }}
                                            />
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">{data.netFlow > 0 ? 'Positive' : 'Negative'}</div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground">{data.trend}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Seasonal Patterns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="rounded-2xl border border-green-500/20 bg-card p-8">
                        <h2 className="text-xl font-semibold mb-6 text-green-400">Peak Months</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">December (110% activity)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Year-end push, holiday retail surge, clients closing budgets. Best month for revenue but also highest expenses.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">November (105% activity)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Black Friday boost, Q4 momentum, businesses rushing to meet annual targets before December holidays.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">June (100% activity)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Financial year-end for many businesses, budget approvals, strong B2B activity before mid-year break.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-card p-8">
                        <h2 className="text-xl font-semibold mb-6 text-red-400">Slow Months</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">January (72% activity)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Post-holiday recovery, clients on leave, budgets not yet approved. High expenses from holiday carryover.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">July (78% activity)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Winter slowdown, school holidays, reduced business activity. Second-weakest month after January.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">August (82% activity)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Slow recovery from winter, budget constraints, businesses conserving cash before Q4 push.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industry-Specific Patterns */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Industry-Specific Seasonality</h2>
                    <div className="space-y-6">
                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Retail & E-commerce</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                <strong className="text-foreground">Peak:</strong> November-December (Black Friday, Christmas)<br/>
                                <strong className="text-foreground">Low:</strong> January-February (post-holiday slump)<br/>
                                <strong className="text-foreground">Planning tip:</strong> Build inventory in October, hire seasonal staff in November
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Professional Services</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                <strong className="text-foreground">Peak:</strong> March, June (quarter/year-end)<br/>
                                <strong className="text-foreground">Low:</strong> December-January (holidays)<br/>
                                <strong className="text-foreground">Planning tip:</strong> Front-load work in Feb-May, use slow months for business development
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Construction & Trades</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                <strong className="text-foreground">Peak:</strong> September-November (spring/summer)<br/>
                                <strong className="text-foreground">Low:</strong> June-July (winter weather)<br/>
                                <strong className="text-foreground">Planning tip:</strong> Schedule major projects for spring, use winter for maintenance
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Hospitality & Tourism</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                <strong className="text-foreground">Peak:</strong> December-January, June-July (school holidays)<br/>
                                <strong className="text-foreground">Low:</strong> May, August (between holiday periods)<br/>
                                <strong className="text-foreground">Planning tip:</strong> Maximize pricing during peak, offer specials in shoulder months
                            </p>
                        </div>
                    </div>
                </div>

                {/* Planning Strategies */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Plan for Seasonality</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">1. Build Cash Reserves in Peak Months</h3>
                            <p className="text-sm text-muted-foreground">
                                Save 30-40% of profits from Nov-Dec to cover Jan-Feb slow period. Aim for 3 months operating expenses in reserve.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">2. Adjust Marketing Spend</h3>
                            <p className="text-sm text-muted-foreground">
                                Increase marketing 2 months before peak seasons. Reduce spend during slow months or focus on long-term brand building.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">3. Flexible Staffing</h3>
                            <p className="text-sm text-muted-foreground">
                                Hire temporary staff for peak months (Nov-Dec). Use freelancers during slow periods instead of full-time hires.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">4. Negotiate Payment Terms</h3>
                            <p className="text-sm text-muted-foreground">
                                Request shorter payment terms (Net 14) during slow months. Offer early payment discounts in Jan-Feb to improve cash flow.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">5. Plan Major Expenses</h3>
                            <p className="text-sm text-muted-foreground">
                                Schedule equipment purchases, office moves, or major investments for peak revenue months (May-June, Nov-Dec).
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">6. Diversify Revenue Streams</h3>
                            <p className="text-sm text-muted-foreground">
                                Add counter-seasonal products/services. If retail peaks in Dec, add B2B services that peak in March/June.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track your seasonal patterns and plan ahead with Illumi analytics</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
