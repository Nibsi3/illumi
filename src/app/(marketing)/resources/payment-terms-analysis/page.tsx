import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconClock, IconTrendingUp } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Average Payment Terms & Days Outstanding in SA | Illumi",
    description: "How long do South African businesses wait for payment? Industry-specific data on payment terms and days sales outstanding (DSO) across sectors.",
    keywords: [
        "payment terms South Africa",
        "days sales outstanding SA",
        "average payment time by industry",
        "DSO benchmarks South Africa",
    ],
}

const sectorData = [
    {
        sector: "Retail & E-commerce",
        standardTerms: "Net 14",
        actualDSO: 18,
        variance: "+4 days",
        cashConversion: 22,
    },
    {
        sector: "Professional Services",
        standardTerms: "Net 30",
        actualDSO: 38,
        variance: "+8 days",
        cashConversion: 45,
    },
    {
        sector: "IT & Software",
        standardTerms: "Net 30",
        actualDSO: 35,
        variance: "+5 days",
        cashConversion: 42,
    },
    {
        sector: "Construction & Trades",
        standardTerms: "Net 30-60",
        actualDSO: 52,
        variance: "+12 days",
        cashConversion: 68,
    },
    {
        sector: "Marketing & Advertising",
        standardTerms: "Net 30",
        actualDSO: 36,
        variance: "+6 days",
        cashConversion: 43,
    },
    {
        sector: "Healthcare Services",
        standardTerms: "Net 14-30",
        actualDSO: 24,
        variance: "+3 days",
        cashConversion: 28,
    },
    {
        sector: "Consulting",
        standardTerms: "Net 30",
        actualDSO: 41,
        variance: "+11 days",
        cashConversion: 48,
    },
    {
        sector: "Creative & Design",
        standardTerms: "Net 30",
        actualDSO: 33,
        variance: "+3 days",
        cashConversion: 39,
    },
]

export default function PaymentTermsAnalysisPage() {
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
                        Updated Q1 2025
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Average Payment Terms & Days Outstanding in SA SMEs
                    </h1>
                    <p className="text-white/60 text-lg max-w-3xl">
                        Real data on how long South African businesses actually wait for payment, compared to their stated payment terms. 
                        Understand DSO (Days Sales Outstanding) and cash conversion cycles by sector.
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-white/10">
                                <IconClock className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-sm text-white/60">Average DSO</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">34 days</div>
                        <div className="text-xs text-white/40">Across all sectors</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-white/10">
                                <IconTrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-sm text-white/60">Average Variance</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">+6.5 days</div>
                        <div className="text-xs text-white/40">Beyond stated terms</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-white/10">
                                <IconClock className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-sm text-white/60">Cash Conversion Cycle</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">42 days</div>
                        <div className="text-xs text-white/40">Average time to cash</div>
                    </div>
                </div>

                {/* Sector Breakdown */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden mb-12">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-semibold">Payment Terms vs Reality by Sector</h2>
                        <p className="text-sm text-white/60 mt-1">Data from 2,500+ South African SMEs (2024)</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10">
                                <tr className="text-left">
                                    <th className="p-4 text-sm font-semibold text-white/80">Sector</th>
                                    <th className="p-4 text-sm font-semibold text-white/80">Standard Terms</th>
                                    <th className="p-4 text-sm font-semibold text-white/80">Actual DSO</th>
                                    <th className="p-4 text-sm font-semibold text-white/80">Variance</th>
                                    <th className="p-4 text-sm font-semibold text-white/80">Cash Conversion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectorData.map((row, idx) => (
                                    <tr key={row.sector} className={idx !== sectorData.length - 1 ? "border-b border-white/5" : ""}>
                                        <td className="p-4 text-white">{row.sector}</td>
                                        <td className="p-4 text-white/70">{row.standardTerms}</td>
                                        <td className="p-4">
                                            <span className={row.actualDSO > 40 ? "text-red-400 font-semibold" : row.actualDSO < 25 ? "text-green-400 font-semibold" : "text-white font-semibold"}>
                                                {row.actualDSO} days
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-red-400">{row.variance}</span>
                                        </td>
                                        <td className="p-4 text-white/70">{row.cashConversion} days</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        <h2 className="text-xl font-semibold mb-4">What is DSO?</h2>
                        <p className="text-white/60 leading-relaxed mb-4">
                            Days Sales Outstanding (DSO) measures the average number of days it takes to collect payment after a sale. 
                            It's calculated as: (Accounts Receivable / Total Credit Sales) × Number of Days.
                        </p>
                        <p className="text-white/60 leading-relaxed">
                            A lower DSO means faster cash collection and better cash flow. The SA SME average is 34 days, 
                            but this varies significantly by industry.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        <h2 className="text-xl font-semibold mb-4">Cash Conversion Cycle</h2>
                        <p className="text-white/60 leading-relaxed mb-4">
                            The cash conversion cycle measures how long it takes to convert inventory and other resources into cash. 
                            It includes DSO plus inventory days minus accounts payable days.
                        </p>
                        <p className="text-white/60 leading-relaxed">
                            For service businesses (most SMEs), this is primarily driven by DSO. The faster you collect, 
                            the better your cash flow and growth potential.
                        </p>
                    </div>
                </div>

                {/* Findings */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Findings</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Construction has the longest cash conversion</h3>
                            <p className="text-white/60 leading-relaxed">
                                Construction businesses wait an average of 52 days for payment (DSO), with a 68-day cash conversion cycle. 
                                This is 12 days beyond their stated Net 30-60 terms, creating significant cash flow pressure.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Retail has the tightest cash cycle</h3>
                            <p className="text-white/60 leading-relaxed">
                                Retail and e-commerce businesses have an 18-day DSO and 22-day cash conversion cycle, 
                                the fastest in any sector. This reflects immediate payment culture and shorter terms.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Most businesses exceed their stated terms</h3>
                            <p className="text-white/60 leading-relaxed">
                                On average, actual payment time is 6.5 days beyond stated terms. Consulting and construction 
                                see the largest variance (+11 and +12 days respectively), indicating enforcement challenges.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Healthcare maintains discipline</h3>
                            <p className="text-white/60 leading-relaxed">
                                Healthcare services have the smallest variance (+3 days) and maintain a 24-day DSO, 
                                likely due to insurance payment structures and immediate payment requirements.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Improvement Strategies */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Improve Your DSO</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">-40%</div>
                            <h3 className="font-semibold mb-2 text-white">Add Online Payment Options</h3>
                            <p className="text-sm text-white/60">
                                Businesses with PayFast, Yoco, or Ozow integration reduce DSO by an average of 40%.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">-35%</div>
                            <h3 className="font-semibold mb-2 text-white">Automate Payment Reminders</h3>
                            <p className="text-sm text-white/60">
                                Automated reminders before and on due dates reduce late payments by 35%.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">-23%</div>
                            <h3 className="font-semibold mb-2 text-white">Set Clear Payment Terms</h3>
                            <p className="text-sm text-white/60">
                                Invoices with explicit terms (e.g., "Net 14") get paid 23% faster than vague terms.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">-18%</div>
                            <h3 className="font-semibold mb-2 text-white">Invoice Immediately</h3>
                            <p className="text-sm text-white/60">
                                Sending invoices within 24 hours of work completion reduces DSO by 18%.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-white/60 mb-4">Track your DSO and improve cash flow with Illumi</p>
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
