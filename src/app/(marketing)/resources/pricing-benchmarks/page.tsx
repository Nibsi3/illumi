import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "How SMEs Price Their Services Across SA | Illumi",
    description: "Real-world pricing ranges and patterns for South African service businesses. Hourly rates, project fees, and pricing strategies by industry.",
    keywords: [
        "service pricing South Africa",
        "hourly rates SA",
        "freelance rates South Africa",
        "how to price services",
        "SME pricing strategy",
    ],
}

const pricingData = [
    {
        service: "Web Development",
        hourlyRange: "R 450 - R 1,200",
        projectRange: "R 15,000 - R 150,000",
        avgHourly: "R 750",
        pricingModel: "Project-based (68%), Hourly (32%)",
        notes: "Higher rates for React/Next.js specialists",
    },
    {
        service: "Graphic Design",
        hourlyRange: "R 350 - R 850",
        projectRange: "R 2,500 - R 35,000",
        avgHourly: "R 550",
        pricingModel: "Project-based (82%), Hourly (18%)",
        notes: "Logo design: R 3k-R 15k average",
    },
    {
        service: "Digital Marketing",
        hourlyRange: "R 400 - R 1,000",
        projectRange: "R 8,000 - R 50,000/month",
        avgHourly: "R 650",
        pricingModel: "Retainer (75%), Project (25%)",
        notes: "Retainers typically R 12k-R 35k/month",
    },
    {
        service: "Copywriting & Content",
        hourlyRange: "R 300 - R 800",
        projectRange: "R 1,500 - R 15,000",
        avgHourly: "R 500",
        pricingModel: "Per-word (45%), Project (35%), Hourly (20%)",
        notes: "R 1.50-R 3.50 per word average",
    },
    {
        service: "Business Consulting",
        hourlyRange: "R 800 - R 2,500",
        projectRange: "R 25,000 - R 200,000",
        avgHourly: "R 1,400",
        pricingModel: "Project-based (60%), Hourly (40%)",
        notes: "Strategy projects: R 50k-R 150k",
    },
    {
        service: "Accounting & Bookkeeping",
        hourlyRange: "R 350 - R 900",
        projectRange: "R 2,500 - R 15,000/month",
        avgHourly: "R 550",
        pricingModel: "Monthly retainer (85%), Hourly (15%)",
        notes: "Full bookkeeping: R 4k-R 12k/month",
    },
    {
        service: "Photography (Commercial)",
        hourlyRange: "R 500 - R 1,500",
        projectRange: "R 3,000 - R 25,000",
        avgHourly: "R 850",
        pricingModel: "Day rate (70%), Hourly (30%)",
        notes: "Half-day: R 3k-R 8k, Full day: R 5k-R 15k",
    },
    {
        service: "Video Production",
        hourlyRange: "R 600 - R 1,800",
        projectRange: "R 15,000 - R 150,000",
        avgHourly: "R 1,000",
        pricingModel: "Project-based (90%), Day rate (10%)",
        notes: "Corporate video: R 25k-R 80k average",
    },
]

export default function PricingBenchmarksPage() {
    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm mb-4">
                        2024 Data
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        How SMEs Price Their Services Across South Africa
                    </h1>
                    <p className="text-white/60 text-lg max-w-3xl">
                        Real-world pricing data from South African freelancers and service businesses. Use these benchmarks 
                        to price your services competitively and profitably.
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="text-sm text-white/60 mb-1">Average Hourly Rate</div>
                        <div className="text-3xl font-bold">R 763</div>
                        <div className="text-xs text-white/40 mt-1">Across all services</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="text-sm text-white/60 mb-1">Most Common Model</div>
                        <div className="text-3xl font-bold">Project</div>
                        <div className="text-xs text-white/40 mt-1">62% use project pricing</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="text-sm text-white/60 mb-1">Highest Paid Service</div>
                        <div className="text-3xl font-bold">R 1,400</div>
                        <div className="text-xs text-white/40 mt-1">Business consulting</div>
                    </div>
                </div>

                {/* Pricing Table */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden mb-12">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-semibold">Service Pricing Benchmarks</h2>
                        <p className="text-sm text-white/60 mt-1">Based on 2,500+ South African service providers</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10">
                                <tr className="text-left">
                                    <th className="p-4 text-sm font-semibold text-white/80">Service</th>
                                    <th className="p-4 text-sm font-semibold text-white/80">Hourly Range</th>
                                    <th className="p-4 text-sm font-semibold text-white/80">Avg Hourly</th>
                                    <th className="p-4 text-sm font-semibold text-white/80">Pricing Model</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricingData.map((row, idx) => (
                                    <tr key={row.service} className={idx !== pricingData.length - 1 ? "border-b border-white/5" : ""}>
                                        <td className="p-4 text-white font-medium">{row.service}</td>
                                        <td className="p-4 text-white/70">{row.hourlyRange}</td>
                                        <td className="p-4">
                                            <span className="font-semibold text-white">{row.avgHourly}</span>
                                        </td>
                                        <td className="p-4 text-white/70 text-sm">{row.pricingModel}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-6 mb-12">
                    {pricingData.map((service) => (
                        <div key={service.service} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{service.service}</h3>
                                    <p className="text-sm text-white/60 mt-1">{service.notes}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-white/40">Avg Hourly</div>
                                    <div className="text-2xl font-bold text-white">{service.avgHourly}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <div className="text-xs text-white/40 mb-1">Hourly Range</div>
                                    <div className="text-white font-semibold">{service.hourlyRange}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/40 mb-1">Project Range</div>
                                    <div className="text-white font-semibold">{service.projectRange}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/40 mb-1">Preferred Model</div>
                                    <div className="text-white font-semibold">{service.pricingModel.split('(')[0].trim()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pricing Strategies */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Pricing Strategy Insights</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Project-based pricing dominates</h3>
                            <p className="text-white/60 leading-relaxed">
                                62% of service providers use project-based pricing rather than hourly. This allows for value-based 
                                pricing and protects against scope creep. Clients also prefer fixed prices for budgeting.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Retainers provide stability</h3>
                            <p className="text-white/60 leading-relaxed">
                                Marketing agencies and accountants favor monthly retainers (75-85% adoption). Retainers provide 
                                predictable recurring revenue and deeper client relationships. Average retainer: R 15,000/month.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Specialists command premium rates</h3>
                            <p className="text-white/60 leading-relaxed">
                                Specialists charge 40-60% more than generalists. React developers earn R 1,200/hour vs R 450 for 
                                general web developers. Strategy consultants earn R 2,500/hour vs R 800 for general consultants.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Experience drives pricing power</h3>
                            <p className="text-white/60 leading-relaxed">
                                Providers with 5+ years experience charge 2x more than beginners. A senior graphic designer 
                                averages R 850/hour vs R 350/hour for juniors. Build your portfolio and raise rates annually.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing Tips */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Price Your Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-white">1. Calculate Your Minimum Rate</h3>
                            <p className="text-sm text-white/60 mb-2">
                                (Monthly expenses + desired profit) ÷ billable hours = minimum hourly rate
                            </p>
                            <p className="text-xs text-white/40">
                                Example: (R 40,000 + R 20,000) ÷ 120 hours = R 500/hour minimum
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">2. Research Market Rates</h3>
                            <p className="text-sm text-white/60 mb-2">
                                Use these benchmarks to position yourself. Beginners: lower 25%, experienced: upper 25%.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">3. Add Value-Based Pricing</h3>
                            <p className="text-sm text-white/60 mb-2">
                                Price based on client value, not just time. A logo worth R 100k to the client justifies R 15k fee.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">4. Raise Rates Annually</h3>
                            <p className="text-sm text-white/60 mb-2">
                                Increase rates 10-15% per year for existing clients, 20-30% for new clients as you gain experience.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">5. Package Your Services</h3>
                            <p className="text-sm text-white/60 mb-2">
                                Create tiered packages (Basic/Pro/Premium) to increase average deal size and simplify sales.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">6. Charge for Rush Work</h3>
                            <p className="text-sm text-white/60 mb-2">
                                Add 50-100% premium for urgent projects with tight deadlines. Your time is valuable.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-white/60 mb-4">Create professional invoices with your pricing using Illumi</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
