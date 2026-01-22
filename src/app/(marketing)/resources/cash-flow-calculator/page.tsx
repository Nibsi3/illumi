"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    IconArrowLeft,
    IconTrendingUp,
    IconTrendingDown,
    IconMinus,
    IconAlertCircle,
    IconCircleCheck,
} from "@tabler/icons-react"

export default function CashFlowCalculatorPage() {
    const [monthlyRevenue, setMonthlyRevenue] = useState("")
    const [monthlyExpenses, setMonthlyExpenses] = useState("")
    const [accountsReceivable, setAccountsReceivable] = useState("")
    const [accountsPayable, setAccountsPayable] = useState("")
    const [cashReserves, setCashReserves] = useState("")
    
    const [showResults, setShowResults] = useState(false)

    const calculateHealthScore = () => {
        const revenue = parseFloat(monthlyRevenue) || 0
        const expenses = parseFloat(monthlyExpenses) || 0
        const receivable = parseFloat(accountsReceivable) || 0
        const payable = parseFloat(accountsPayable) || 0
        const reserves = parseFloat(cashReserves) || 0

        // Cash flow ratio
        const netCashFlow = revenue - expenses
        const cashFlowRatio = revenue > 0 ? (netCashFlow / revenue) * 100 : 0

        // Runway (months)
        const monthlyBurn = expenses
        const runway = monthlyBurn > 0 ? reserves / monthlyBurn : 0

        // Working capital ratio
        const workingCapital = receivable + reserves - payable
        const workingCapitalRatio = payable > 0 ? workingCapital / payable : 0

        // Calculate overall health score (0-100)
        let score = 0
        
        // Cash flow ratio (40 points)
        if (cashFlowRatio >= 20) score += 40
        else if (cashFlowRatio >= 10) score += 30
        else if (cashFlowRatio >= 0) score += 20
        else score += 10

        // Runway (30 points)
        if (runway >= 6) score += 30
        else if (runway >= 3) score += 20
        else if (runway >= 1) score += 10
        else score += 5

        // Working capital (30 points)
        if (workingCapitalRatio >= 2) score += 30
        else if (workingCapitalRatio >= 1) score += 20
        else if (workingCapitalRatio >= 0.5) score += 10
        else score += 5

        return {
            score: Math.round(score),
            netCashFlow,
            cashFlowRatio,
            runway,
            workingCapital,
            workingCapitalRatio,
        }
    }

    const handleCalculate = () => {
        setShowResults(true)
    }

    const results = showResults ? calculateHealthScore() : null

    const getScoreColor = (score: number) => {
        if (score >= 70) return "text-green-400"
        if (score >= 40) return "text-yellow-400"
        return "text-red-400"
    }

    const getScoreLabel = (score: number) => {
        if (score >= 70) return "Healthy"
        if (score >= 40) return "Moderate"
        return "At Risk"
    }

    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    SME Cash Flow Health Score Calculator
                </h1>
                <p className="text-white/60 text-lg mb-10 max-w-3xl">
                    Get an instant assessment of your business's cash flow health. Input your basic financial data 
                    to receive a visual health score and actionable insights.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        <h2 className="text-xl font-semibold mb-6">Your Business Data</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="revenue" className="text-white/80">Monthly Revenue (ZAR)</Label>
                                <Input
                                    id="revenue"
                                    type="number"
                                    placeholder="e.g., 50000"
                                    value={monthlyRevenue}
                                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label htmlFor="expenses" className="text-white/80">Monthly Expenses (ZAR)</Label>
                                <Input
                                    id="expenses"
                                    type="number"
                                    placeholder="e.g., 35000"
                                    value={monthlyExpenses}
                                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label htmlFor="receivable" className="text-white/80">Accounts Receivable (ZAR)</Label>
                                <Input
                                    id="receivable"
                                    type="number"
                                    placeholder="e.g., 75000"
                                    value={accountsReceivable}
                                    onChange={(e) => setAccountsReceivable(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                                <p className="text-xs text-white/40 mt-1">Money owed to you by clients</p>
                            </div>

                            <div>
                                <Label htmlFor="payable" className="text-white/80">Accounts Payable (ZAR)</Label>
                                <Input
                                    id="payable"
                                    type="number"
                                    placeholder="e.g., 20000"
                                    value={accountsPayable}
                                    onChange={(e) => setAccountsPayable(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                                <p className="text-xs text-white/40 mt-1">Money you owe to suppliers</p>
                            </div>

                            <div>
                                <Label htmlFor="reserves" className="text-white/80">Cash Reserves (ZAR)</Label>
                                <Input
                                    id="reserves"
                                    type="number"
                                    placeholder="e.g., 100000"
                                    value={cashReserves}
                                    onChange={(e) => setCashReserves(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                                <p className="text-xs text-white/40 mt-1">Cash in bank accounts</p>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full bg-white text-black hover:bg-white/90 h-11"
                            >
                                Calculate Health Score
                            </Button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        {!showResults ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <IconAlertCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40">Enter your data and click calculate to see your health score</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center pb-6 border-b border-white/10">
                                    <div className="text-sm font-bold uppercase tracking-wider text-white/40 mb-2">
                                        Cash Flow Health Score
                                    </div>
                                    <div className={`text-6xl font-bold ${getScoreColor(results!.score)}`}>
                                        {results!.score}
                                    </div>
                                    <div className="text-lg text-white/60 mt-2">
                                        {getScoreLabel(results!.score)}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl bg-white/5 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-white/60">Net Cash Flow</span>
                                            {results!.netCashFlow >= 0 ? (
                                                <IconTrendingUp className="h-4 w-4 text-green-400" />
                                            ) : (
                                                <IconTrendingDown className="h-4 w-4 text-red-400" />
                                            )}
                                        </div>
                                        <div className="text-2xl font-bold">
                                            R {results!.netCashFlow.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-white/40 mt-1">
                                            {results!.cashFlowRatio.toFixed(1)}% of revenue
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-white/5 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-white/60">Cash Runway</span>
                                            <IconMinus className="h-4 w-4 text-white/40" />
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {results!.runway.toFixed(1)} months
                                        </div>
                                        <div className="text-xs text-white/40 mt-1">
                                            At current burn rate
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-white/5 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-white/60">Working Capital</span>
                                            <IconCircleCheck className="h-4 w-4 text-white/40" />
                                        </div>
                                        <div className="text-2xl font-bold">
                                            R {results!.workingCapital.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-white/40 mt-1">
                                            Ratio: {results!.workingCapitalRatio.toFixed(2)}x
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="text-sm font-semibold mb-3">Recommendations</h3>
                                    <ul className="space-y-2 text-sm text-white/60">
                                        {results!.score < 70 && (
                                            <>
                                                {results!.runway < 3 && (
                                                    <li>• Build cash reserves to at least 3 months of expenses</li>
                                                )}
                                                {results!.cashFlowRatio < 10 && (
                                                    <li>• Review expenses and look for cost reduction opportunities</li>
                                                )}
                                                {results!.workingCapitalRatio < 1 && (
                                                    <li>• Focus on collecting outstanding invoices faster</li>
                                                )}
                                            </>
                                        )}
                                        {results!.score >= 70 && (
                                            <li>• Your cash flow is healthy! Consider investing in growth.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Benchmark Context */}
                <div className="mt-12 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                    <h2 className="text-xl font-semibold mb-4">How SA SMEs Compare</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-sm text-white/40 mb-1">Average Cash Flow Ratio</div>
                            <div className="text-2xl font-bold">12.5%</div>
                            <div className="text-xs text-white/40 mt-1">Across all industries</div>
                        </div>
                        <div>
                            <div className="text-sm text-white/40 mb-1">Median Cash Runway</div>
                            <div className="text-2xl font-bold">2.3 months</div>
                            <div className="text-xs text-white/40 mt-1">For businesses under 5 years</div>
                        </div>
                        <div>
                            <div className="text-sm text-white/40 mb-1">Healthy Working Capital Ratio</div>
                            <div className="text-2xl font-bold">&gt; 1.5x</div>
                            <div className="text-xs text-white/40 mt-1">Industry benchmark</div>
                        </div>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
