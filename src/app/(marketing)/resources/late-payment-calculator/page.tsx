"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react"

export default function LatePaymentCalculatorPage() {
    const [avgInvoiceValue, setAvgInvoiceValue] = useState("")
    const [monthlyInvoices, setMonthlyInvoices] = useState("")
    const [latePaymentRate, setLatePaymentRate] = useState("")
    const [avgDelayDays, setAvgDelayDays] = useState("")
    
    const [showResults, setShowResults] = useState(false)

    const calculateCost = () => {
        const invoiceValue = parseFloat(avgInvoiceValue) || 0
        const invoicesPerMonth = parseFloat(monthlyInvoices) || 0
        const lateRate = parseFloat(latePaymentRate) || 0
        const delayDays = parseFloat(avgDelayDays) || 0

        // Annual revenue
        const annualRevenue = invoiceValue * invoicesPerMonth * 12

        // Late invoices per year
        const lateInvoicesPerYear = invoicesPerMonth * 12 * (lateRate / 100)

        // Cash flow impact (money tied up)
        const avgLateInvoiceValue = invoiceValue
        const cashTiedUp = lateInvoicesPerYear * avgLateInvoiceValue * (delayDays / 365)

        // Opportunity cost (assuming 10% annual return)
        const opportunityCost = cashTiedUp * 0.10

        // Admin time cost (15 min per chase at R200/hour)
        const adminCostPerChase = (15 / 60) * 200
        const totalAdminCost = lateInvoicesPerYear * adminCostPerChase * 2 // 2 chases average

        // Bad debt risk (2% of late invoices typically go unpaid)
        const badDebtRisk = lateInvoicesPerYear * avgLateInvoiceValue * 0.02

        // Total annual cost
        const totalCost = opportunityCost + totalAdminCost + badDebtRisk

        return {
            annualRevenue,
            lateInvoicesPerYear: Math.round(lateInvoicesPerYear),
            cashTiedUp: Math.round(cashTiedUp),
            opportunityCost: Math.round(opportunityCost),
            adminCost: Math.round(totalAdminCost),
            badDebtRisk: Math.round(badDebtRisk),
            totalCost: Math.round(totalCost),
            percentageOfRevenue: ((totalCost / annualRevenue) * 100).toFixed(2),
        }
    }

    const handleCalculate = () => {
        setShowResults(true)
    }

    const results = showResults ? calculateCost() : null

    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Late Payment Cost Calculator
                </h1>
                <p className="text-white/60 text-lg mb-10 max-w-3xl">
                    Calculate how much late payments are costing your business annually. See the hidden costs 
                    of cash flow delays, admin time, and bad debt risk.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        <h2 className="text-xl font-semibold mb-6">Your Business Data</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="invoiceValue" className="text-white/80">Average Invoice Value (ZAR)</Label>
                                <Input
                                    id="invoiceValue"
                                    type="number"
                                    placeholder="e.g., 15000"
                                    value={avgInvoiceValue}
                                    onChange={(e) => setAvgInvoiceValue(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label htmlFor="monthlyInvoices" className="text-white/80">Invoices Sent Per Month</Label>
                                <Input
                                    id="monthlyInvoices"
                                    type="number"
                                    placeholder="e.g., 20"
                                    value={monthlyInvoices}
                                    onChange={(e) => setMonthlyInvoices(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label htmlFor="lateRate" className="text-white/80">Late Payment Rate (%)</Label>
                                <Input
                                    id="lateRate"
                                    type="number"
                                    placeholder="e.g., 30"
                                    value={latePaymentRate}
                                    onChange={(e) => setLatePaymentRate(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                                <p className="text-xs text-white/40 mt-1">% of invoices paid after due date</p>
                            </div>

                            <div>
                                <Label htmlFor="delayDays" className="text-white/80">Average Delay (Days)</Label>
                                <Input
                                    id="delayDays"
                                    type="number"
                                    placeholder="e.g., 15"
                                    value={avgDelayDays}
                                    onChange={(e) => setAvgDelayDays(e.target.value)}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                />
                                <p className="text-xs text-white/40 mt-1">Days beyond due date</p>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full bg-white text-black hover:bg-white/90 h-11"
                            >
                                Calculate Annual Cost
                            </Button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        {!showResults ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <IconAlertTriangle className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40">Enter your data to see the true cost of late payments</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center pb-6 border-b border-white/10">
                                    <div className="text-sm font-bold uppercase tracking-wider text-white/40 mb-2">
                                        Total Annual Cost
                                    </div>
                                    <div className="text-5xl font-bold text-red-400">
                                        R {results!.totalCost.toLocaleString()}
                                    </div>
                                    <div className="text-lg text-white/60 mt-2">
                                        {results!.percentageOfRevenue}% of annual revenue
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl bg-white/5 p-4">
                                        <div className="text-sm text-white/60 mb-1">Late Invoices Per Year</div>
                                        <div className="text-2xl font-bold">{results!.lateInvoicesPerYear}</div>
                                    </div>

                                    <div className="rounded-xl bg-white/5 p-4">
                                        <div className="text-sm text-white/60 mb-1">Cash Tied Up</div>
                                        <div className="text-2xl font-bold">R {results!.cashTiedUp.toLocaleString()}</div>
                                        <div className="text-xs text-white/40 mt-1">Average at any time</div>
                                    </div>

                                    <div className="rounded-xl bg-white/5 p-4">
                                        <div className="text-sm text-white/60 mb-1">Opportunity Cost</div>
                                        <div className="text-2xl font-bold">R {results!.opportunityCost.toLocaleString()}</div>
                                        <div className="text-xs text-white/40 mt-1">10% annual return lost</div>
                                    </div>

                                    <div className="rounded-xl bg-white/5 p-4">
                                        <div className="text-sm text-white/60 mb-1">Admin Time Cost</div>
                                        <div className="text-2xl font-bold">R {results!.adminCost.toLocaleString()}</div>
                                        <div className="text-xs text-white/40 mt-1">Chasing payments</div>
                                    </div>

                                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                                        <div className="text-sm text-red-400 mb-1">Bad Debt Risk</div>
                                        <div className="text-2xl font-bold text-red-400">R {results!.badDebtRisk.toLocaleString()}</div>
                                        <div className="text-xs text-red-400/60 mt-1">2% of late invoices</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Solutions */}
                <div className="mt-12 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Reduce Late Payment Costs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-white">Enable Online Payments</h3>
                            <p className="text-sm text-white/60">
                                Add a "Pay Now" button with PayFast, Yoco, or Ozow. Invoices with online payment options get paid 40% faster.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">Automate Payment Reminders</h3>
                            <p className="text-sm text-white/60">
                                Send automated reminders 3 days before and on the due date. This reduces late payments by 35%.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">Offer Early Payment Discounts</h3>
                            <p className="text-sm text-white/60">
                                A 2% discount for payment within 7 days can improve cash flow significantly.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-white">Tighten Payment Terms</h3>
                            <p className="text-sm text-white/60">
                                Move from Net 30 to Net 14 terms. Shorter terms reduce the average delay period.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-white/60 mb-4">Track and reduce late payments with Illumi</p>
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
