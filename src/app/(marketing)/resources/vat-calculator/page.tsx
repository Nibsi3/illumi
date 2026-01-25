"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconArrowLeft, IconCalculator } from "@tabler/icons-react"

export default function VATCalculatorPage() {
    const [revenue, setRevenue] = useState("")
    const [expenses, setExpenses] = useState("")
    const [vatRate, setVatRate] = useState("15")
    
    const [showResults, setShowResults] = useState(false)

    const calculateVAT = () => {
        const revenueAmount = parseFloat(revenue) || 0
        const expenseAmount = parseFloat(expenses) || 0
        const rate = parseFloat(vatRate) / 100

        // Output VAT (VAT charged to customers)
        const outputVAT = revenueAmount * rate

        // Input VAT (VAT paid on expenses)
        const inputVAT = expenseAmount * rate

        // Net VAT payable to SARS
        const netVAT = outputVAT - inputVAT

        // Revenue and expenses excluding VAT
        const revenueExclVAT = revenueAmount / (1 + rate)
        const expensesExclVAT = expenseAmount / (1 + rate)

        // Profit before and after VAT
        const profitExclVAT = revenueExclVAT - expensesExclVAT
        const profitInclVAT = revenueAmount - expenseAmount

        return {
            outputVAT: Math.round(outputVAT),
            inputVAT: Math.round(inputVAT),
            netVAT: Math.round(netVAT),
            revenueExclVAT: Math.round(revenueExclVAT),
            expensesExclVAT: Math.round(expensesExclVAT),
            profitExclVAT: Math.round(profitExclVAT),
            profitInclVAT: Math.round(profitInclVAT),
            effectiveTaxRate: profitExclVAT > 0 ? ((netVAT / profitExclVAT) * 100).toFixed(2) : "0.00",
        }
    }

    const handleCalculate = () => {
        setShowResults(true)
    }

    const results = showResults ? calculateVAT() : null

    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    VAT & Tax Estimate Explorer
                </h1>
                <p className="text-muted-foreground text-lg mb-10 max-w-3xl">
                    Calculate your VAT obligations and see how VAT affects your small business profitability. 
                    Understand output VAT, input VAT, and net VAT payable to SARS.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-xl font-semibold mb-6">Your Business Data</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="revenue" className="text-foreground">Monthly Revenue (incl. VAT)</Label>
                                <Input
                                    id="revenue"
                                    type="number"
                                    placeholder="e.g., 115000"
                                    value={revenue}
                                    onChange={(e) => setRevenue(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Total revenue including 15% VAT</p>
                            </div>

                            <div>
                                <Label htmlFor="expenses" className="text-foreground">Monthly Expenses (incl. VAT)</Label>
                                <Input
                                    id="expenses"
                                    type="number"
                                    placeholder="e.g., 69000"
                                    value={expenses}
                                    onChange={(e) => setExpenses(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Total expenses including VAT</p>
                            </div>

                            <div>
                                <Label htmlFor="vatRate" className="text-foreground">VAT Rate (%)</Label>
                                <Input
                                    id="vatRate"
                                    type="number"
                                    value={vatRate}
                                    onChange={(e) => setVatRate(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Standard rate in SA is 15%</p>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                            >
                                Calculate VAT
                            </Button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        {!showResults ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <IconCalculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Enter your data to calculate VAT obligations</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center pb-6 border-b border-border">
                                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        Net VAT Payable to SARS
                                    </div>
                                    <div className={`text-5xl font-bold ${results!.netVAT >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        R {Math.abs(results!.netVAT).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {results!.netVAT >= 0 ? 'You owe SARS' : 'SARS owes you (refund)'}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Output VAT (Collected)</div>
                                        <div className="text-2xl font-bold">R {results!.outputVAT.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground mt-1">VAT charged to customers</div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Input VAT (Paid)</div>
                                        <div className="text-2xl font-bold">R {results!.inputVAT.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground mt-1">VAT paid on expenses</div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Revenue (excl. VAT)</div>
                                        <div className="text-2xl font-bold">R {results!.revenueExclVAT.toLocaleString()}</div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Expenses (excl. VAT)</div>
                                        <div className="text-2xl font-bold">R {results!.expensesExclVAT.toLocaleString()}</div>
                                    </div>

                                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                                        <div className="text-sm text-green-400 mb-1">Profit (excl. VAT)</div>
                                        <div className="text-2xl font-bold text-green-400">R {results!.profitExclVAT.toLocaleString()}</div>
                                        <div className="text-xs text-green-400/60 mt-1">Your actual profit</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* VAT Guide */}
                <div className="mt-12 rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">Understanding VAT in South Africa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">When to Register for VAT</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    You must register for VAT if your taxable turnover exceeds R1 million per year. 
                                    You can voluntarily register if turnover is between R50,000 and R1 million.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">VAT Return Deadlines</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    VAT returns are due on the 25th of the month following the tax period. 
                                    Most SMEs file bi-monthly (Category B) or monthly (Category A if turnover &gt; R30m).
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">Zero-Rated vs Exempt</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Zero-rated supplies (0% VAT) allow you to claim input VAT. 
                                    Exempt supplies don't charge VAT and you can't claim input VAT on related expenses.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">What You Can Claim</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    You can claim input VAT on business expenses like office supplies, software, 
                                    professional services, and equipment. Keep valid tax invoices for all claims.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">SARS Tax Invoice Requirements</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Tax invoices must include: "Tax Invoice" or "VAT Invoice" label, your VAT number, 
                                    itemized descriptions, VAT amount shown separately, and customer details.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">Penalties for Late Filing</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Late VAT returns incur a penalty of up to 10% of the VAT due, plus interest at 9.5% per year. 
                                    File on time to avoid penalties.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Common Scenarios */}
                <div className="mt-8 rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">Common VAT Scenarios for SA SMEs</h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-muted">
                            <h3 className="font-semibold mb-2 text-foreground">Scenario 1: Freelancer with R100k Revenue</h3>
                            <p className="text-sm text-muted-foreground">
                                Revenue: R100,000 (incl. VAT) = R86,957 excl. VAT<br/>
                                Expenses: R40,000 (incl. VAT) = R34,783 excl. VAT<br/>
                                Output VAT: R13,043 | Input VAT: R5,217 | <strong className="text-foreground">Net VAT: R7,826 payable</strong>
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-muted">
                            <h3 className="font-semibold mb-2 text-foreground">Scenario 2: Agency with High Expenses</h3>
                            <p className="text-sm text-muted-foreground">
                                Revenue: R200,000 (incl. VAT) = R173,913 excl. VAT<br/>
                                Expenses: R180,000 (incl. VAT) = R156,522 excl. VAT<br/>
                                Output VAT: R26,087 | Input VAT: R23,478 | <strong className="text-foreground">Net VAT: R2,609 payable</strong>
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-muted">
                            <h3 className="font-semibold mb-2 text-foreground">Scenario 3: Startup with VAT Refund</h3>
                            <p className="text-sm text-muted-foreground">
                                Revenue: R50,000 (incl. VAT) = R43,478 excl. VAT<br/>
                                Expenses: R120,000 (incl. VAT) = R104,348 excl. VAT (equipment purchase)<br/>
                                Output VAT: R6,522 | Input VAT: R15,652 | <strong className="text-green-400">Net VAT: R9,130 refund from SARS</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Automate VAT calculations with professional invoices</p>
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
