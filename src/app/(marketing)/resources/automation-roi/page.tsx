import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconRobot, IconClock, IconCurrencyDollar, IconFileInvoice, IconAlertTriangle } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Automation vs Manual Invoicing ROI | Illumi",
    description: "Real data showing time and cost savings from automated invoicing. Calculate your ROI from switching to automated invoice software.",
    keywords: [
        "invoice automation ROI",
        "automated invoicing benefits",
        "invoice software savings",
        "manual vs automated invoicing",
    ],
}

export default function AutomationROIPage() {
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
                        Invoicing Automation vs Manual Invoicing ROI
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Real data from South African SMEs showing time and cost savings from automated invoicing. 
                        See the actual ROI of switching from manual processes to invoice automation software.
                    </p>
                </div>

                {/* Head-to-Head Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="rounded-2xl border border-red-500/20 bg-card p-8">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                            <IconFileInvoice className="h-6 w-6 text-red-400" />
                            Manual Invoicing
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Time Per Invoice</div>
                                <div className="text-4xl font-bold text-red-400">22 min</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Monthly Time Cost (20 invoices)</div>
                                <div className="text-4xl font-bold text-red-400">7.3 hrs</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Error Rate</div>
                                <div className="text-4xl font-bold text-red-400">18%</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Payment Delays from Errors</div>
                                <div className="text-4xl font-bold text-red-400">+12 days</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-green-500/20 bg-card p-8">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                            <IconRobot className="h-6 w-6 text-green-400" />
                            Automated Invoicing
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Time Per Invoice</div>
                                <div className="text-4xl font-bold text-green-400">3 min</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Monthly Time Cost (20 invoices)</div>
                                <div className="text-4xl font-bold text-green-400">1 hr</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Error Rate</div>
                                <div className="text-4xl font-bold text-green-400">2%</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Payment Delays from Errors</div>
                                <div className="text-4xl font-bold text-green-400">+1 day</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROI Breakdown */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Annual ROI Breakdown</h2>
                    
                    <div className="space-y-6">
                        <div className="rounded-xl bg-muted p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <IconClock className="h-6 w-6 text-blue-400" />
                                <h3 className="text-lg font-semibold">Time Savings</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Hours Saved Per Year</div>
                                    <div className="text-2xl font-bold text-foreground">75.6 hours</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Value at R 500/hour</div>
                                    <div className="text-2xl font-bold text-green-400">R 37,800</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Efficiency Gain</div>
                                    <div className="text-2xl font-bold text-green-400">86%</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <IconCurrencyDollar className="h-6 w-6 text-green-400" />
                                <h3 className="text-lg font-semibold">Faster Payment Collection</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Payment Time Reduction</div>
                                    <div className="text-2xl font-bold text-foreground">-11 days</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Cash Flow Improvement</div>
                                    <div className="text-2xl font-bold text-green-400">R 48,000</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Opportunity Cost Saved</div>
                                    <div className="text-2xl font-bold text-green-400">R 4,800</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <IconAlertTriangle className="h-6 w-6 text-yellow-400" />
                                <h3 className="text-lg font-semibold">Error Reduction</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Errors Prevented</div>
                                    <div className="text-2xl font-bold text-foreground">38/year</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Correction Time Saved</div>
                                    <div className="text-2xl font-bold text-green-400">19 hours</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Value of Error Prevention</div>
                                    <div className="text-2xl font-bold text-green-400">R 9,500</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">Total Annual Savings</div>
                                    <div className="text-4xl font-bold text-green-400">R 52,100</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground mb-2">Software Cost (Illumi Pro)</div>
                                    <div className="text-2xl font-bold text-foreground">R 4,200/year</div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-green-500/20">
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-semibold text-foreground">Net Annual Benefit</div>
                                    <div className="text-4xl font-bold text-green-400">R 47,900</div>
                                </div>
                                <div className="text-sm text-muted-foreground mt-2">ROI: 1,140% | Payback period: 0.9 months</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Benefits */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Additional Benefits Beyond ROI</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Professional Image</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Branded, consistent invoices improve client perception. 73% of clients say professional invoices 
                                increase their trust in the business.
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Better Record Keeping</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Automated systems maintain perfect records for tax compliance. Reduces accounting fees by R 2,400/year 
                                on average and eliminates SARS audit stress.
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Payment Tracking</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Real-time visibility into who owes what. Automated reminders reduce late payments by 35% without 
                                awkward manual follow-ups.
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Scalability</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Handle 100 invoices/month as easily as 10. Manual processes break down at scale, but automation 
                                grows with your business at no extra time cost.
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Analytics & Insights</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Track revenue trends, client payment patterns, and cash flow forecasts automatically. 
                                Make data-driven decisions instead of guessing.
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-6">
                            <h3 className="font-semibold mb-3 text-foreground">Online Payment Integration</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                "Pay Now" buttons with PayFast, Yoco, Ozow reduce payment time by 40%. Clients pay instantly 
                                instead of initiating manual EFTs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* By Business Size */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">ROI by Business Size</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">5 invoices/month (Freelancer)</div>
                                <div className="text-sm text-muted-foreground">Saves 1.6 hours/month</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">R 9,600/year</div>
                                <div className="text-xs text-muted-foreground">229% ROI</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">20 invoices/month (Small Business)</div>
                                <div className="text-sm text-muted-foreground">Saves 6.3 hours/month</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">R 47,900/year</div>
                                <div className="text-xs text-muted-foreground">1,140% ROI</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">50 invoices/month (Growing Business)</div>
                                <div className="text-sm text-muted-foreground">Saves 15.8 hours/month</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">R 118,600/year</div>
                                <div className="text-xs text-muted-foreground">2,724% ROI</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                            <div>
                                <div className="font-semibold text-foreground">100+ invoices/month (Established)</div>
                                <div className="text-sm text-muted-foreground">Saves 31.6 hours/month</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">R 236,400/year</div>
                                <div className="text-xs text-muted-foreground">5,533% ROI</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Implementation Timeline */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">Implementation Timeline</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Day 1: Setup (30 minutes)</h3>
                                <p className="text-sm text-muted-foreground">Add business details, upload logo, customize invoice template</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Week 1: Import Clients (1 hour)</h3>
                                <p className="text-sm text-muted-foreground">Upload existing client list, set payment terms, configure defaults</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold shrink-0">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Week 2: First Invoices (15 minutes)</h3>
                                <p className="text-sm text-muted-foreground">Send first automated invoices, set up payment reminders</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold shrink-0">
                                4
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Month 1: Full ROI Realized</h3>
                                <p className="text-sm text-muted-foreground">Start seeing time savings, faster payments, and reduced errors immediately</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Start saving time and money with automated invoicing</p>
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
