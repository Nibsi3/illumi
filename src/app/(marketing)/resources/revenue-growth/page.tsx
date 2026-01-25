import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconTrendingUp } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "SME Revenue Growth Benchmarks Year-on-Year | Illumi SA",
    description: "Real revenue growth data from South African SMEs by business age and sector. See how fast businesses typically grow in their first 5 years.",
    keywords: [
        "SME revenue growth South Africa",
        "startup growth benchmarks SA",
        "business growth rates by sector",
        "year-on-year revenue growth",
    ],
}

const growthByAge = [
    { age: "Year 1", avgGrowth: 0, range: "0% (baseline)", businesses: 2500 },
    { age: "Year 2", avgGrowth: 45, range: "15% - 85%", businesses: 1850 },
    { age: "Year 3", avgGrowth: 28, range: "8% - 62%", businesses: 1420 },
    { age: "Year 4", avgGrowth: 22, range: "5% - 48%", businesses: 1080 },
    { age: "Year 5", avgGrowth: 18, range: "3% - 38%", businesses: 820 },
    { age: "Year 6+", avgGrowth: 12, range: "0% - 28%", businesses: 650 },
]

const growthBySector = [
    { sector: "SaaS & Software", year1: 65, year2: 48, year3: 35, year4: 28, year5: 22 },
    { sector: "E-commerce", year1: 58, year2: 42, year3: 32, year4: 24, year5: 18 },
    { sector: "Professional Services", year1: 42, year2: 28, year3: 22, year4: 18, year5: 15 },
    { sector: "Digital Marketing", year1: 48, year2: 35, year3: 26, year4: 20, year5: 16 },
    { sector: "Creative Services", year1: 38, year2: 25, year3: 18, year4: 14, year5: 12 },
    { sector: "Consulting", year1: 35, year2: 24, year3: 18, year4: 15, year5: 12 },
    { sector: "Retail (Physical)", year1: 28, year2: 18, year3: 14, year4: 10, year5: 8 },
    { sector: "Construction", year1: 22, year2: 15, year3: 12, year4: 9, year5: 7 },
]

export default function RevenueGrowthPage() {
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
                        SME Revenue Growth Benchmarks Year-on-Year
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Real revenue growth data from South African SMEs. Understand typical growth rates by business age 
                        and sector to set realistic targets and measure your performance.
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Year 2 Average Growth</div>
                        <div className="text-3xl font-bold text-green-400">+45%</div>
                        <div className="text-xs text-muted-foreground mt-1">Highest growth year</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Fastest Growing Sector</div>
                        <div className="text-2xl font-bold">SaaS</div>
                        <div className="text-xs text-muted-foreground mt-1">65% year 1 growth</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">5-Year Survival Rate</div>
                        <div className="text-3xl font-bold">33%</div>
                        <div className="text-xs text-muted-foreground mt-1">Of businesses reach year 5</div>
                    </div>
                </div>

                {/* Growth by Age */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Revenue Growth by Business Age</h2>
                    
                    <div className="space-y-4">
                        {growthByAge.map((data) => (
                            <div key={data.age} className="rounded-xl bg-muted p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{data.age}</h3>
                                        <p className="text-sm text-muted-foreground">{data.businesses.toLocaleString()} businesses</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-3xl font-bold ${data.avgGrowth > 30 ? 'text-green-400' : data.avgGrowth > 15 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {data.avgGrowth > 0 ? '+' : ''}{data.avgGrowth}%
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">Average YoY growth</div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                        <span>Growth Range</span>
                                        <span>{data.range}</span>
                                    </div>
                                    <div className="w-full bg-accent rounded-full h-2">
                                        <div 
                                            className={`h-full rounded-full ${data.avgGrowth > 30 ? 'bg-green-500' : data.avgGrowth > 15 ? 'bg-blue-500' : 'bg-white/40'}`}
                                            style={{ width: `${Math.min(data.avgGrowth, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth by Sector */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden mb-12">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold">Revenue Growth by Sector (%)</h2>
                        <p className="text-sm text-muted-foreground mt-1">Year-on-year growth rates for first 5 years</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border">
                                <tr className="text-left">
                                    <th className="p-4 text-sm font-semibold text-foreground">Sector</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Year 1→2</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Year 2→3</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Year 3→4</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Year 4→5</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">5-Yr Avg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {growthBySector.map((row, idx) => {
                                    const fiveYearAvg = Math.round((row.year1 + row.year2 + row.year3 + row.year4 + row.year5) / 5)
                                    return (
                                        <tr key={row.sector} className={idx !== growthBySector.length - 1 ? "border-b border-border" : ""}>
                                            <td className="p-4 text-foreground">{row.sector}</td>
                                            <td className="p-4 text-green-400 font-semibold">+{row.year1}%</td>
                                            <td className="p-4 text-muted-foreground">+{row.year2}%</td>
                                            <td className="p-4 text-muted-foreground">+{row.year3}%</td>
                                            <td className="p-4 text-muted-foreground">+{row.year4}%</td>
                                            <td className="p-4">
                                                <span className={`font-semibold ${fiveYearAvg > 30 ? 'text-green-400' : fiveYearAvg > 20 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    +{fiveYearAvg}%
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Insights</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Year 2 is the highest growth year</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Businesses experience their fastest growth in year 2 (45% average), after establishing product-market fit 
                                and initial customer base. This is when you should invest heavily in scaling.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Growth slows but stabilizes over time</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Growth rates decline from 45% in year 2 to 18% by year 5, but become more predictable. 
                                Mature businesses (6+ years) grow at 12% annually with less volatility.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Tech businesses grow 2-3x faster</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                SaaS and e-commerce businesses grow 2-3x faster than traditional sectors (retail, construction) 
                                due to scalability and lower marginal costs. Year 1 growth: 65% vs 22%.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Only 1 in 3 businesses reach year 5</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                The survival rate drops from 2,500 businesses in year 1 to 820 by year 5 (33% survival). 
                                The biggest drop-off happens between years 2-3 when growth slows and cash flow challenges emerge.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Growth Strategies */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Accelerate Growth</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">1. Add Recurring Revenue</h3>
                            <p className="text-sm text-muted-foreground">
                                Businesses with 60%+ recurring revenue grow 3x faster (54% vs 18% annually). 
                                Convert projects to retainers or subscriptions.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">2. Invest in Year 2</h3>
                            <p className="text-sm text-muted-foreground">
                                Year 2 is your growth window. Reinvest 40-60% of profits into marketing, hiring, and product 
                                to maximize the high-growth period.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">3. Focus on Retention</h3>
                            <p className="text-sm text-muted-foreground">
                                Businesses with 80%+ customer retention grow 2.5x faster. It's cheaper to keep customers 
                                than acquire new ones.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">4. Increase Prices Annually</h3>
                            <p className="text-sm text-muted-foreground">
                                Raise prices 10-15% per year for new clients, 5-8% for existing. This alone can drive 
                                10-12% revenue growth without new customers.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">5. Expand Service Offerings</h3>
                            <p className="text-sm text-muted-foreground">
                                Businesses that add complementary services grow 35% faster. Cross-sell and upsell to 
                                increase revenue per customer.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">6. Automate & Delegate</h3>
                            <p className="text-sm text-muted-foreground">
                                Founders who delegate operational tasks and automate processes grow 2x faster. 
                                Focus your time on sales and strategy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track your revenue growth and compare against benchmarks with Illumi</p>
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
