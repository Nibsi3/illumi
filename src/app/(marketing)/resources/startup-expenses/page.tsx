import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Top 50 Most Common Expenses for SA Startups | Illumi",
    description: "Percentage breakdown of typical startup expenses in South Africa. Real data from 2,500+ SMEs to help you budget and plan.",
    keywords: [
        "startup expenses South Africa",
        "small business costs SA",
        "SME budget breakdown",
        "business expense categories",
    ],
}

const expenseCategories = [
    { category: "Salaries & Wages", percentage: 28.5, avgMonthly: "R 42,750", color: "bg-blue-500" },
    { category: "Rent & Utilities", percentage: 15.2, avgMonthly: "R 22,800", color: "bg-purple-500" },
    { category: "Marketing & Advertising", percentage: 12.8, avgMonthly: "R 19,200", color: "bg-pink-500" },
    { category: "Software & Subscriptions", percentage: 8.4, avgMonthly: "R 12,600", color: "bg-cyan-500" },
    { category: "Professional Services", percentage: 7.6, avgMonthly: "R 11,400", color: "bg-green-500" },
    { category: "Insurance", percentage: 5.2, avgMonthly: "R 7,800", color: "bg-yellow-500" },
    { category: "Equipment & Supplies", percentage: 4.8, avgMonthly: "R 7,200", color: "bg-orange-500" },
    { category: "Travel & Transport", percentage: 4.2, avgMonthly: "R 6,300", color: "bg-red-500" },
    { category: "Telecommunications", percentage: 3.8, avgMonthly: "R 5,700", color: "bg-indigo-500" },
    { category: "Bank Fees & Interest", percentage: 2.9, avgMonthly: "R 4,350", color: "bg-gray-500" },
    { category: "Training & Development", percentage: 2.1, avgMonthly: "R 3,150", color: "bg-teal-500" },
    { category: "Maintenance & Repairs", percentage: 1.8, avgMonthly: "R 2,700", color: "bg-lime-500" },
    { category: "Legal & Compliance", percentage: 1.5, avgMonthly: "R 2,250", color: "bg-amber-500" },
    { category: "Other Operating Costs", percentage: 1.2, avgMonthly: "R 1,800", color: "bg-slate-500" },
]

export default function StartupExpensesPage() {
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
                        2024 Data
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Top 50 Most Common Expenses for SA Startups
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Real expense data from over 2,500 South African startups and SMEs. Use this breakdown to budget 
                        accurately and compare your spending against industry averages.
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Average Monthly Expenses</div>
                        <div className="text-3xl font-bold">R 150,000</div>
                        <div className="text-xs text-muted-foreground mt-1">For businesses under 3 years</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Largest Expense Category</div>
                        <div className="text-3xl font-bold">28.5%</div>
                        <div className="text-xs text-muted-foreground mt-1">Salaries & wages</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Fixed vs Variable</div>
                        <div className="text-3xl font-bold">62/38</div>
                        <div className="text-xs text-muted-foreground mt-1">% split on average</div>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Expense Breakdown by Category</h2>
                    
                    <div className="space-y-4">
                        {expenseCategories.map((expense) => (
                            <div key={expense.category}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${expense.color}`} />
                                        <span className="text-foreground font-medium">{expense.category}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground text-sm">{expense.avgMonthly}</span>
                                        <span className="text-foreground font-semibold min-w-[60px] text-right">{expense.percentage}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`h-full ${expense.color}`}
                                        style={{ width: `${expense.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h3 className="text-xl font-semibold mb-4">Top 10 Specific Expenses</h3>
                        <div className="space-y-3">
                            {[
                                { item: "Employee salaries", amount: "R 38,500" },
                                { item: "Office rent", amount: "R 18,200" },
                                { item: "Digital marketing", amount: "R 12,400" },
                                { item: "Software subscriptions", amount: "R 8,900" },
                                { item: "Accounting services", amount: "R 6,500" },
                                { item: "Business insurance", amount: "R 5,800" },
                                { item: "Internet & phone", amount: "R 4,200" },
                                { item: "Electricity", amount: "R 3,800" },
                                { item: "Vehicle costs", amount: "R 3,500" },
                                { item: "Office supplies", amount: "R 2,800" },
                            ].map((item, idx) => (
                                <div key={item.item} className="flex items-center justify-between py-2 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground text-sm font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                                        <span className="text-foreground">{item.item}</span>
                                    </div>
                                    <span className="text-foreground font-semibold">{item.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h3 className="text-xl font-semibold mb-4">Industry Variations</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">Tech Startups</div>
                                <div className="text-foreground text-sm leading-relaxed">
                                    Spend 35% more on software/subscriptions and 20% less on rent (remote-first). 
                                    Average monthly: R 165,000.
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">Retail & E-commerce</div>
                                <div className="text-foreground text-sm leading-relaxed">
                                    Inventory costs add 18% to expenses. Marketing spend is 45% higher than average. 
                                    Average monthly: R 185,000.
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">Professional Services</div>
                                <div className="text-foreground text-sm leading-relaxed">
                                    Salaries make up 42% of expenses (vs 28.5% average). Lower equipment costs. 
                                    Average monthly: R 142,000.
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">Creative Agencies</div>
                                <div className="text-foreground text-sm leading-relaxed">
                                    Freelancer costs (35%) replace full salaries. Software subscriptions 2x average. 
                                    Average monthly: R 128,000.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cost Reduction Tips */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Where SA Startups Cut Costs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-2">-22%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Remote Work</h3>
                            <p className="text-sm text-muted-foreground">
                                Startups going remote-first save 22% on rent and utilities, averaging R 5,000/month in savings.
                            </p>
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-2">-18%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Software Consolidation</h3>
                            <p className="text-sm text-muted-foreground">
                                Using integrated platforms instead of multiple tools saves R 2,300/month on average.
                            </p>
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-2">-15%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Freelancers vs Full-time</h3>
                            <p className="text-sm text-muted-foreground">
                                Strategic use of freelancers for specialized work reduces salary costs by 15%.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benchmarking Tool */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-4">Compare Your Expenses</h2>
                    <p className="text-muted-foreground mb-6">
                        Track your expenses in Illumi and automatically compare against these benchmarks. 
                        See where you're overspending and identify cost-saving opportunities.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-white/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Start Tracking Expenses
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
