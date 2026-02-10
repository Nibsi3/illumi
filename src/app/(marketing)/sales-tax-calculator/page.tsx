"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    IconCalculator,
    IconArrowRight,
    IconInfoCircle,
} from "@tabler/icons-react"

export default function SalesTaxCalculatorPage() {
    const [amount, setAmount] = useState("")
    const [taxRate, setTaxRate] = useState("15")
    const [calculationType, setCalculationType] = useState<"add" | "remove">("add")

    const calculate = () => {
        const amountNum = parseFloat(amount) || 0
        const rate = parseFloat(taxRate) / 100

        if (calculationType === "add") {
            const taxAmount = amountNum * rate
            const total = amountNum + taxAmount
            return {
                original: amountNum,
                taxAmount: taxAmount,
                total: total,
            }
        } else {
            const originalAmount = amountNum / (1 + rate)
            const taxAmount = amountNum - originalAmount
            return {
                original: originalAmount,
                taxAmount: taxAmount,
                total: amountNum,
            }
        }
    }

    const results = calculate()

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconCalculator className="h-4 w-4" />
                            Free Tool
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Sales Tax Calculator for South Africa
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Instantly calculate VAT and sales tax for your invoices. Add or remove 15% VAT 
                            with our free calculator. Perfect for freelancers, contractors, and small businesses.
                        </p>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input */}
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold mb-6">Calculate Sales Tax</h2>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                                    <button
                                        onClick={() => setCalculationType("add")}
                                        className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                                            calculationType === "add"
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        Add Tax
                                    </button>
                                    <button
                                        onClick={() => setCalculationType("remove")}
                                        className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                                            calculationType === "remove"
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        Remove Tax
                                    </button>
                                </div>

                                <div>
                                    <Label htmlFor="amount" className="text-foreground">
                                        {calculationType === "add" ? "Amount (excl. tax)" : "Amount (incl. tax)"}
                                    </Label>
                                    <div className="relative mt-2">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="pl-8 bg-muted border-border text-foreground h-12"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="taxRate" className="text-foreground">Tax Rate (%)</Label>
                                    <Input
                                        id="taxRate"
                                        type="number"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(e.target.value)}
                                        className="mt-2 bg-muted border-border text-foreground h-12"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        South African VAT rate is 15%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold mb-6">Results</h2>
                            
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-muted">
                                    <div className="text-sm text-muted-foreground mb-1">
                                        {calculationType === "add" ? "Original Amount" : "Amount Before Tax"}
                                    </div>
                                    <div className="text-2xl font-bold">
                                        R {results.original.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-muted">
                                    <div className="text-sm text-muted-foreground mb-1">Tax Amount ({taxRate}%)</div>
                                    <div className="text-2xl font-bold text-primary">
                                        R {results.taxAmount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <div className="text-sm text-primary mb-1">
                                        {calculationType === "add" ? "Total (incl. tax)" : "Total Amount"}
                                    </div>
                                    <div className="text-3xl font-bold text-primary">
                                        R {results.total.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <Link href="/invoices/new">
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                        Create Invoice with This Amount
                                        <IconArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        Understanding Sales Tax & VAT in South Africa
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="flex items-start gap-3">
                                    <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold mb-2">What is VAT?</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Value Added Tax (VAT) is a consumption tax levied on goods and services in South Africa. 
                                            The current standard rate is 15%, introduced in April 2018.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="flex items-start gap-3">
                                    <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold mb-2">When to Register for VAT</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            You must register for VAT if your taxable turnover exceeds R1 million in any 
                                            12-month period. Voluntary registration is available for turnover above R50,000.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="flex items-start gap-3">
                                    <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold mb-2">Zero-Rated Items</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Some goods are zero-rated (0% VAT) including basic food items, exports, 
                                            fuel levy goods, and international transport services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="flex items-start gap-3">
                                    <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold mb-2">VAT on Invoices</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            If you're VAT registered, your invoices must show VAT separately, include 
                                            your VAT number, and be labeled as "Tax Invoice".
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Reference Table */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Quick VAT Reference</h2>
                    
                    <div className="rounded-2xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Amount (excl. VAT)</th>
                                    <th className="text-left p-4 font-semibold">VAT (15%)</th>
                                    <th className="text-left p-4 font-semibold">Total (incl. VAT)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {[100, 500, 1000, 5000, 10000, 50000].map((amt) => (
                                    <tr key={amt} className="hover:bg-muted/50 transition-colors">
                                        <td className="p-4">R {amt.toLocaleString()}</td>
                                        <td className="p-4 text-primary">R {(amt * 0.15).toLocaleString()}</td>
                                        <td className="p-4 font-semibold">R {(amt * 1.15).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Automate Your Tax Calculations
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi automatically calculates VAT on all your invoices. Set your tax rate once 
                        and never worry about manual calculations again.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
