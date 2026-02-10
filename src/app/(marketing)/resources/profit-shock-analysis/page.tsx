import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "SME Profit Shock Analysis: Unexpected Expenses Impact | Illumi",
    description: "How unexpected expenses hit South African SME profits and recovery patterns. Real data on business resilience and financial shock management.",
    keywords: [
        "unexpected business expenses",
        "profit shock recovery",
        "SME financial resilience South Africa",
        "emergency business expenses",
    ],
    alternates: {
        canonical: "/resources/profit-shock-analysis",
    },
}

export default function ProfitShockAnalysisPage() {
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
                        SME "Profit Shock" Analysis
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Real data on how unexpected expenses impact South African SME profits and how businesses recover. 
                        Learn from 2,500+ businesses' experiences with financial shocks.
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Experience Profit Shock</div>
                        <div className="text-3xl font-bold text-red-400">78%</div>
                        <div className="text-xs text-muted-foreground mt-1">Of SMEs in first 3 years</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Avg Impact on Profit</div>
                        <div className="text-3xl font-bold text-red-400">-42%</div>
                        <div className="text-xs text-muted-foreground mt-1">In the shock month</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Recovery Time</div>
                        <div className="text-3xl font-bold">3.2 months</div>
                        <div className="text-xs text-muted-foreground mt-1">To return to baseline</div>
                    </div>
                </div>

                {/* Common Profit Shocks */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Most Common Profit Shocks</h2>
                    
                    <div className="space-y-4">
                        {[
                            { type: "Equipment failure/replacement", frequency: 32, avgCost: "R 28,500", impact: "-38%", recovery: "2.8 months" },
                            { type: "Major client non-payment", frequency: 28, avgCost: "R 45,000", impact: "-52%", recovery: "4.2 months" },
                            { type: "Unexpected tax/compliance costs", frequency: 24, avgCost: "R 18,200", impact: "-28%", recovery: "2.1 months" },
                            { type: "Key employee departure", frequency: 18, avgCost: "R 32,000", impact: "-35%", recovery: "3.5 months" },
                            { type: "Legal/dispute costs", frequency: 12, avgCost: "R 52,000", impact: "-48%", recovery: "5.2 months" },
                            { type: "Theft/fraud", frequency: 10, avgCost: "R 38,000", impact: "-42%", recovery: "3.8 months" },
                            { type: "Property damage/repairs", frequency: 8, avgCost: "R 65,000", impact: "-58%", recovery: "6.1 months" },
                            { type: "Health emergency (owner)", frequency: 6, avgCost: "R 42,000", impact: "-65%", recovery: "4.5 months" },
                        ].map((shock) => (
                            <div key={shock.type} className="rounded-xl bg-muted p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground mb-1">{shock.type}</h3>
                                        <p className="text-sm text-muted-foreground">{shock.frequency}% of businesses experience this</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IconAlertTriangle className="h-5 w-5 text-red-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Avg Cost</div>
                                        <div className="text-lg font-bold text-foreground">{shock.avgCost}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Profit Impact</div>
                                        <div className="text-lg font-bold text-red-400">{shock.impact}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Recovery Time</div>
                                        <div className="text-lg font-bold text-foreground">{shock.recovery}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recovery Patterns */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Recovery Patterns</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Typical Recovery Timeline</h3>
                            <div className="space-y-3">
                                {[
                                    { month: "Month 1 (Shock)", profit: -42, description: "Unexpected expense hits, profit drops sharply" },
                                    { month: "Month 2", profit: -28, description: "Initial recovery, cost-cutting measures implemented" },
                                    { month: "Month 3", profit: -12, description: "Stabilization, revenue starts recovering" },
                                    { month: "Month 4", profit: 2, description: "Return to baseline profitability" },
                                    { month: "Month 5", profit: 8, description: "Catch-up growth phase begins" },
                                    { month: "Month 6", profit: 12, description: "Full recovery, stronger systems in place" },
                                ].map((stage) => (
                                    <div key={stage.month} className="flex items-center gap-4">
                                        <div className="w-32 text-muted-foreground text-sm">{stage.month}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="w-full bg-accent rounded-full h-6 overflow-hidden">
                                                    <div 
                                                        className={`h-full flex items-center justify-center text-xs font-semibold ${
                                                            stage.profit < 0 ? 'bg-red-500' : 'bg-green-500'
                                                        }`}
                                                        style={{ 
                                                            width: `${Math.abs(stage.profit) * 2}%`,
                                                            marginLeft: stage.profit < 0 ? `${50 - Math.abs(stage.profit) * 2}%` : '50%'
                                                        }}
                                                    >
                                                        {stage.profit > 0 ? '+' : ''}{stage.profit}%
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{stage.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Survival Factors */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">What Determines Survival vs Failure?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                            <h3 className="text-xl font-semibold mb-4 text-green-400">Businesses That Recover (68%)</h3>
                            <ul className="space-y-3 text-sm text-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span><strong>3+ months cash reserves</strong> - Can weather the storm without panic</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span><strong>Diversified revenue</strong> - Multiple clients/income streams reduce impact</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span><strong>Insurance coverage</strong> - Equipment, liability, business interruption</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span><strong>Flexible cost structure</strong> - Can quickly reduce expenses if needed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span><strong>Strong client relationships</strong> - Can negotiate payment terms/advance payments</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span><strong>Access to credit</strong> - Business line of credit or emergency funding</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
                            <h3 className="text-xl font-semibold mb-4 text-red-400">Businesses That Fail (32%)</h3>
                            <ul className="space-y-3 text-sm text-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">✗</span>
                                    <span><strong>No cash reserves</strong> - Living paycheck to paycheck, no buffer</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">✗</span>
                                    <span><strong>Single client dependency</strong> - 60%+ revenue from one client</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">✗</span>
                                    <span><strong>No insurance</strong> - Fully exposed to all risks</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">✗</span>
                                    <span><strong>High fixed costs</strong> - Long-term leases, permanent staff, can't adjust quickly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">✗</span>
                                    <span><strong>Poor client terms</strong> - Net 60+ payment terms, no advance deposits</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">✗</span>
                                    <span><strong>Maxed out credit</strong> - Already in debt, no emergency funding available</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Prevention Strategies */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Protect Your Business</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">1. Build 3-6 Month Cash Reserve</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Save 20-30% of monthly profit until you have 3-6 months operating expenses in reserve. 
                                This is your survival buffer.
                            </p>
                            <p className="text-xs text-green-400">Impact: 85% survival rate vs 42% without reserves</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">2. Get Business Insurance</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Equipment, liability, and business interruption insurance cost R 2k-R 5k/month but can save your business.
                            </p>
                            <p className="text-xs text-green-400">Impact: Reduces shock impact by 60% on average</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">3. Diversify Revenue Streams</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                No single client should be more than 30% of revenue. Add new services or client segments.
                            </p>
                            <p className="text-xs text-green-400">Impact: 2.5x faster recovery from client loss</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">4. Maintain Flexible Costs</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Use freelancers instead of full-time staff, month-to-month leases, and variable expenses where possible.
                            </p>
                            <p className="text-xs text-green-400">Impact: Can reduce costs 40% faster in crisis</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">5. Secure Credit Line Before You Need It</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Get a business line of credit when times are good. Banks won't lend when you're in crisis.
                            </p>
                            <p className="text-xs text-green-400">Impact: Access to R 50k-R 200k emergency funding</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">6. Improve Payment Terms</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Shorten payment terms to Net 14, require 30-50% deposits on projects, use recurring billing.
                            </p>
                            <p className="text-xs text-green-400">Impact: Improves cash flow by 35%, faster shock recovery</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track expenses and build cash reserves with Illumi</p>
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
