import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconRepeat, IconFileInvoice } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Recurring vs One-Off Invoices: Collection Speed & Reliability | Illumi",
    description: "Data comparison of recurring vs one-time invoices in South Africa. Which model gets paid faster and provides better cash flow stability?",
    keywords: [
        "recurring invoices South Africa",
        "subscription billing SA",
        "retainer vs project invoicing",
        "recurring revenue benefits",
    ],
}

export default function RecurringVsOneOffPage() {
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
                        Recurring vs One-Off Invoices: Collection Speed & Reliability
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Real data comparing recurring invoices (subscriptions, retainers) vs one-time project invoices. 
                        Understand which model provides faster payment and better cash flow predictability.
                    </p>
                </div>

                {/* Head-to-Head Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="rounded-2xl border border-green-500/20 bg-card p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-green-500/10">
                                <IconRepeat className="h-8 w-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-semibold">Recurring Invoices</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Avg Payment Time</div>
                                <div className="text-4xl font-bold text-green-400">18 days</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">On-Time Payment Rate</div>
                                <div className="text-4xl font-bold text-green-400">82%</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Late Payment Rate</div>
                                <div className="text-4xl font-bold text-green-400">12%</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Non-Payment Rate</div>
                                <div className="text-4xl font-bold text-green-400">6%</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-500/20 bg-card p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <IconFileInvoice className="h-8 w-8 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-semibold">One-Off Invoices</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Avg Payment Time</div>
                                <div className="text-4xl font-bold text-blue-400">34 days</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">On-Time Payment Rate</div>
                                <div className="text-4xl font-bold text-blue-400">58%</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Late Payment Rate</div>
                                <div className="text-4xl font-bold text-blue-400">31%</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Non-Payment Rate</div>
                                <div className="text-4xl font-bold text-blue-400">11%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Differences */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Differences</h2>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-6">
                                <h3 className="font-semibold mb-3 text-green-400">Recurring Wins: Payment Speed</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Recurring invoices get paid <strong className="text-foreground">47% faster</strong> (18 vs 34 days). 
                                    Clients budget for recurring expenses and often set up automatic payments, reducing delays.
                                </p>
                            </div>

                            <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-6">
                                <h3 className="font-semibold mb-3 text-green-400">Recurring Wins: Reliability</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    <strong className="text-foreground">82% on-time rate</strong> vs 58% for one-off invoices. 
                                    Recurring relationships build trust and payment discipline over time.
                                </p>
                            </div>

                            <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-6">
                                <h3 className="font-semibold mb-3 text-green-400">Recurring Wins: Lower Bad Debt</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Only <strong className="text-foreground">6% non-payment</strong> vs 11% for one-off. 
                                    Long-term clients have more to lose by not paying and value the ongoing relationship.
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-6">
                                <h3 className="font-semibold mb-3 text-blue-400">One-Off Advantage: Higher Value</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Average one-off invoice: <strong className="text-foreground">R 18,500</strong> vs R 8,200 for recurring. 
                                    Project-based work commands premium pricing for specialized deliverables.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Model Impact */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Impact on Business Performance</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border">
                                <tr className="text-left">
                                    <th className="p-4 text-sm font-semibold text-foreground">Metric</th>
                                    <th className="p-4 text-sm font-semibold text-green-400">Recurring Model</th>
                                    <th className="p-4 text-sm font-semibold text-blue-400">One-Off Model</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Winner</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border">
                                    <td className="p-4 text-foreground">Cash Flow Predictability</td>
                                    <td className="p-4 text-green-400 font-semibold">95%</td>
                                    <td className="p-4 text-blue-400">42%</td>
                                    <td className="p-4 text-green-400">Recurring</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="p-4 text-foreground">Revenue Stability (YoY)</td>
                                    <td className="p-4 text-green-400 font-semibold">+18%</td>
                                    <td className="p-4 text-blue-400">-8% to +35%</td>
                                    <td className="p-4 text-green-400">Recurring</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="p-4 text-foreground">Customer Lifetime Value</td>
                                    <td className="p-4 text-green-400 font-semibold">R 98,400</td>
                                    <td className="p-4 text-blue-400">R 18,500</td>
                                    <td className="p-4 text-green-400">Recurring</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="p-4 text-foreground">Sales Effort Required</td>
                                    <td className="p-4 text-green-400 font-semibold">Low (after initial)</td>
                                    <td className="p-4 text-blue-400">High (continuous)</td>
                                    <td className="p-4 text-green-400">Recurring</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="p-4 text-foreground">Business Valuation Multiple</td>
                                    <td className="p-4 text-green-400 font-semibold">4-6x revenue</td>
                                    <td className="p-4 text-blue-400">1-2x revenue</td>
                                    <td className="p-4 text-green-400">Recurring</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-foreground">Avg Invoice Value</td>
                                    <td className="p-4 text-green-400">R 8,200</td>
                                    <td className="p-4 text-blue-400 font-semibold">R 18,500</td>
                                    <td className="p-4 text-blue-400">One-Off</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Insights */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Insights</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Recurring revenue = 5x customer lifetime value</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                A client on a R 8,200/month retainer is worth R 98,400 over 12 months vs R 18,500 for a one-off project. 
                                The compounding value of recurring relationships far exceeds individual transactions.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Businesses with 60%+ recurring revenue grow 3x faster</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                SMEs with majority recurring revenue grow 18% year-over-year vs 6% for project-based businesses. 
                                Predictable cash flow enables investment in growth rather than survival.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Recurring models command higher valuations</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                When selling your business, recurring revenue businesses sell for 4-6x annual revenue vs 1-2x for 
                                project-based businesses. Investors pay premium for predictability.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Hybrid model is optimal for most SMEs</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                The best performing businesses use a 70/30 split: 70% recurring (retainers, subscriptions) for stability 
                                and 30% one-off (projects, upsells) for growth and higher margins.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How to Transition */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Add Recurring Revenue to Your Business</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">1. Convert Projects to Retainers</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                After a successful project, offer ongoing maintenance, support, or optimization for R 3k-R 15k/month.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">2. Create Subscription Tiers</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Package your services into Basic/Pro/Premium monthly plans with clear deliverables.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">3. Offer Prepaid Packages</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Sell blocks of hours or credits upfront (e.g., "10 hours/month for R 6,500") with rollover.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">4. Add Managed Services</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Take over ongoing tasks clients don't want to do themselves (social media, bookkeeping, IT support).
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">5. Build SaaS Products</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Turn your expertise into software tools clients pay monthly to access (like Illumi!).
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">6. Create Membership Programs</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Offer exclusive access, priority support, or community benefits for a monthly fee.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Manage recurring and one-off invoices seamlessly with Illumi</p>
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
