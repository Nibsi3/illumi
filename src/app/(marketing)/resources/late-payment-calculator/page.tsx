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
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Late Payment Cost Calculator
                </h1>
                <p className="text-muted-foreground text-lg mb-10 max-w-3xl">
                    Calculate how much late payments are costing your business annually. See the hidden costs 
                    of cash flow delays, admin time, and bad debt risk.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-xl font-semibold mb-6">Your Business Data</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="invoiceValue" className="text-foreground">Average Invoice Value (ZAR)</Label>
                                <Input
                                    id="invoiceValue"
                                    type="number"
                                    placeholder="e.g., 15000"
                                    value={avgInvoiceValue}
                                    onChange={(e) => setAvgInvoiceValue(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                            </div>

                            <div>
                                <Label htmlFor="monthlyInvoices" className="text-foreground">Invoices Sent Per Month</Label>
                                <Input
                                    id="monthlyInvoices"
                                    type="number"
                                    placeholder="e.g., 20"
                                    value={monthlyInvoices}
                                    onChange={(e) => setMonthlyInvoices(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                            </div>

                            <div>
                                <Label htmlFor="lateRate" className="text-foreground">Late Payment Rate (%)</Label>
                                <Input
                                    id="lateRate"
                                    type="number"
                                    placeholder="e.g., 30"
                                    value={latePaymentRate}
                                    onChange={(e) => setLatePaymentRate(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">% of invoices paid after due date</p>
                            </div>

                            <div>
                                <Label htmlFor="delayDays" className="text-foreground">Average Delay (Days)</Label>
                                <Input
                                    id="delayDays"
                                    type="number"
                                    placeholder="e.g., 15"
                                    value={avgDelayDays}
                                    onChange={(e) => setAvgDelayDays(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Days beyond due date</p>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                            >
                                Calculate Annual Cost
                            </Button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        {!showResults ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <IconAlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Enter your data to see the true cost of late payments</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center pb-6 border-b border-border">
                                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        Total Annual Cost
                                    </div>
                                    <div className="text-5xl font-bold text-red-400">
                                        R {results!.totalCost.toLocaleString()}
                                    </div>
                                    <div className="text-lg text-muted-foreground mt-2">
                                        {results!.percentageOfRevenue}% of annual revenue
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Late Invoices Per Year</div>
                                        <div className="text-2xl font-bold">{results!.lateInvoicesPerYear}</div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Cash Tied Up</div>
                                        <div className="text-2xl font-bold">R {results!.cashTiedUp.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Average at any time</div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Opportunity Cost</div>
                                        <div className="text-2xl font-bold">R {results!.opportunityCost.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground mt-1">10% annual return lost</div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Admin Time Cost</div>
                                        <div className="text-2xl font-bold">R {results!.adminCost.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Chasing payments</div>
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
                <div className="mt-12 rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How to Reduce Late Payment Costs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Enable Online Payments</h3>
                            <p className="text-sm text-muted-foreground">
                                Add a "Pay Now" button with PayFast, Yoco, or Ozow. Invoices with online payment options get paid 40% faster.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Automate Payment Reminders</h3>
                            <p className="text-sm text-muted-foreground">
                                Send automated reminders 3 days before and on the due date. This reduces late payments by 35%.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Offer Early Payment Discounts</h3>
                            <p className="text-sm text-muted-foreground">
                                A 2% discount for payment within 7 days can improve cash flow significantly.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Tighten Payment Terms</h3>
                            <p className="text-sm text-muted-foreground">
                                Move from Net 30 to Net 14 terms. Shorter terms reduce the average delay period.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track and reduce late payments with Illumi</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Create My First Invoice
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
