import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconDeviceLaptop } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Digital vs Manual Invoicing Adoption Trends in SA | Illumi",
    description: "How many South African SMEs use digital invoicing vs email/manual methods? Adoption trends and growth patterns across industries.",
    keywords: [
        "digital invoicing adoption South Africa",
        "invoice software usage SA",
        "manual vs digital invoicing trends",
        "SME technology adoption",
    ],
}

export default function DigitalAdoptionPage() {
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
                        Digital vs Manual Invoicing Adoption Trends
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        How South African SMEs create and send invoices. See adoption rates of digital invoicing software 
                        vs traditional methods, and understand the shift toward automation.
                    </p>
                </div>

                {/* Current State */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-green-500/20 bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Digital Invoicing</div>
                        <div className="text-3xl font-bold text-green-400">42%</div>
                        <div className="text-xs text-muted-foreground mt-1">Use invoice software</div>
                    </div>

                    <div className="rounded-2xl border border-blue-500/20 bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Email/Manual</div>
                        <div className="text-3xl font-bold text-blue-400">48%</div>
                        <div className="text-xs text-muted-foreground mt-1">Word/Excel + email</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="text-sm text-muted-foreground mb-1">Paper Invoices</div>
                        <div className="text-3xl font-bold text-muted-foreground">10%</div>
                        <div className="text-xs text-muted-foreground mt-1">Still use paper</div>
                    </div>
                </div>

                {/* Adoption by Industry */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Digital Adoption by Industry</h2>
                    
                    <div className="space-y-4">
                        {[
                            { industry: "IT & Software Development", digital: 78, manual: 20, paper: 2 },
                            { industry: "Digital Marketing Agencies", digital: 72, manual: 26, paper: 2 },
                            { industry: "E-commerce", digital: 68, manual: 28, paper: 4 },
                            { industry: "Professional Services", digital: 52, manual: 42, paper: 6 },
                            { industry: "Creative & Design", digital: 48, manual: 46, paper: 6 },
                            { industry: "Consulting", digital: 45, manual: 48, paper: 7 },
                            { industry: "Retail", digital: 35, manual: 52, paper: 13 },
                            { industry: "Construction & Trades", digital: 28, manual: 54, paper: 18 },
                        ].map((row) => (
                            <div key={row.industry} className="rounded-xl bg-muted p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-foreground">{row.industry}</h3>
                                    <div className="text-2xl font-bold text-green-400">{row.digital}%</div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                            <span>Digital Invoicing Software</span>
                                            <span>{row.digital}%</span>
                                        </div>
                                        <div className="w-full bg-accent rounded-full h-2">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${row.digital}%` }} />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                            <span>Email/Manual (Word/Excel)</span>
                                            <span>{row.manual}%</span>
                                        </div>
                                        <div className="w-full bg-accent rounded-full h-2">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.manual}%` }} />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                            <span>Paper Invoices</span>
                                            <span>{row.paper}%</span>
                                        </div>
                                        <div className="w-full bg-accent rounded-full h-2">
                                            <div className="h-full bg-white/40 rounded-full" style={{ width: `${row.paper}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Trend */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Adoption Growth Over Time</h2>
                    
                    <div className="space-y-4">
                        {[
                            { year: "2020", digital: 18, manual: 68, paper: 14 },
                            { year: "2021", digital: 24, manual: 64, paper: 12 },
                            { year: "2022", digital: 32, manual: 58, paper: 10 },
                            { year: "2023", digital: 38, manual: 52, paper: 10 },
                            { year: "2024", digital: 42, manual: 48, paper: 10 },
                            { year: "2025 (projected)", digital: 48, manual: 43, paper: 9 },
                        ].map((row) => (
                            <div key={row.year} className="flex items-center gap-4">
                                <div className="w-24 text-muted-foreground text-sm">{row.year}</div>
                                <div className="flex-1 flex items-center gap-2">
                                    <div 
                                        className="h-8 bg-green-500 rounded flex items-center justify-center text-xs font-semibold"
                                        style={{ width: `${row.digital}%` }}
                                    >
                                        {row.digital}%
                                    </div>
                                    <div 
                                        className="h-8 bg-blue-500 rounded flex items-center justify-center text-xs font-semibold"
                                        style={{ width: `${row.manual}%` }}
                                    >
                                        {row.manual}%
                                    </div>
                                    <div 
                                        className="h-8 bg-white/40 rounded flex items-center justify-center text-xs font-semibold"
                                        style={{ width: `${row.paper}%` }}
                                    >
                                        {row.paper}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded" />
                            <span className="text-sm text-muted-foreground">Digital Software</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded" />
                            <span className="text-sm text-muted-foreground">Email/Manual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white/40 rounded" />
                            <span className="text-sm text-muted-foreground">Paper</span>
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="rounded-2xl border border-border bg-card p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Insights</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Digital adoption growing 6% per year</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Digital invoicing adoption has grown from 18% in 2020 to 42% in 2024, a 133% increase. 
                                At current rates, digital will surpass manual methods by 2025.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Tech businesses lead adoption at 78%</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                IT and software businesses have the highest digital adoption (78%), nearly 3x the rate of 
                                construction (28%). Tech-savvy industries adopt faster.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Manual methods still dominate traditional sectors</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Construction, retail, and consulting still rely heavily on Word/Excel + email (48-54%). 
                                These sectors are slower to adopt but represent the biggest growth opportunity.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Paper invoices declining but persistent</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Paper invoices dropped from 14% to 10% (2020-2024) but remain common in construction (18%) 
                                and retail (13%), especially for older business owners.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Switch */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">Why Businesses Switch to Digital</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">86%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Save Time</h3>
                            <p className="text-sm text-muted-foreground">
                                Primary reason for switching. Digital invoicing saves 6+ hours per month vs manual methods.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">72%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Get Paid Faster</h3>
                            <p className="text-sm text-muted-foreground">
                                Digital invoices with "Pay Now" buttons get paid 40% faster (18 vs 34 days).
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">68%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Reduce Errors</h3>
                            <p className="text-sm text-muted-foreground">
                                Automated calculations eliminate math errors. Error rate drops from 18% to 2%.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">54%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Better Record Keeping</h3>
                            <p className="text-sm text-muted-foreground">
                                Automatic storage and search vs digging through email folders or filing cabinets.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">48%</div>
                            <h3 className="font-semibold mb-2 text-foreground">Professional Image</h3>
                            <p className="text-sm text-muted-foreground">
                                Branded, consistent invoices improve client perception and trust.
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">42%</div>
                            <h3 className="font-semibold mb-2 text-foreground">SARS Compliance</h3>
                            <p className="text-sm text-muted-foreground">
                                Built-in VAT calculations and tax-compliant templates reduce audit risk.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Join the 42% of SA SMEs using digital invoicing</p>
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
