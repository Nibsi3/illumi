"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    IconClock,
    IconArrowRight,
    IconInfoCircle,
    IconCalculator,
} from "@tabler/icons-react"

export default function HourlyRateCalculatorPage() {
    const [annualIncome, setAnnualIncome] = useState("")
    const [hoursPerWeek, setHoursPerWeek] = useState("40")
    const [weeksPerYear, setWeeksPerYear] = useState("48")
    const [expenses, setExpenses] = useState("")
    const [profitMargin, setProfitMargin] = useState("20")

    const calculate = () => {
        const income = parseFloat(annualIncome) || 0
        const hours = parseFloat(hoursPerWeek) || 40
        const weeks = parseFloat(weeksPerYear) || 48
        const annualExpenses = parseFloat(expenses) || 0
        const margin = parseFloat(profitMargin) / 100 || 0.2

        const totalHoursPerYear = hours * weeks
        const billableHours = totalHoursPerYear * 0.7 // Assume 70% billable
        
        // Basic hourly rate
        const basicRate = income / totalHoursPerYear
        
        // Rate covering expenses
        const rateWithExpenses = (income + annualExpenses) / billableHours
        
        // Rate with profit margin
        const rateWithMargin = rateWithExpenses * (1 + margin)

        return {
            totalHours: Math.round(totalHoursPerYear),
            billableHours: Math.round(billableHours),
            basicRate: Math.round(basicRate),
            rateWithExpenses: Math.round(rateWithExpenses),
            recommendedRate: Math.round(rateWithMargin),
            dailyRate: Math.round(rateWithMargin * 8),
            weeklyRate: Math.round(rateWithMargin * hours),
            monthlyRate: Math.round(rateWithMargin * hours * (weeks / 12)),
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
                            <IconClock className="h-4 w-4" />
                            Free Calculator
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Freelance Hourly Rate Calculator
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Calculate your ideal hourly rate as a freelancer in South Africa. Factor in expenses, 
                            billable hours, and profit margins to price your services correctly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input */}
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold mb-6">Your Details</h2>
                            
                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="annualIncome" className="text-foreground">
                                        Desired Annual Income (ZAR)
                                    </Label>
                                    <div className="relative mt-2">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                        <Input
                                            id="annualIncome"
                                            type="number"
                                            placeholder="e.g., 600000"
                                            value={annualIncome}
                                            onChange={(e) => setAnnualIncome(e.target.value)}
                                            className="pl-8 bg-muted border-border text-foreground h-12"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        What you want to take home after expenses
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="hoursPerWeek" className="text-foreground">Hours/Week</Label>
                                        <Input
                                            id="hoursPerWeek"
                                            type="number"
                                            value={hoursPerWeek}
                                            onChange={(e) => setHoursPerWeek(e.target.value)}
                                            className="mt-2 bg-muted border-border text-foreground h-12"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="weeksPerYear" className="text-foreground">Weeks/Year</Label>
                                        <Input
                                            id="weeksPerYear"
                                            type="number"
                                            value={weeksPerYear}
                                            onChange={(e) => setWeeksPerYear(e.target.value)}
                                            className="mt-2 bg-muted border-border text-foreground h-12"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Minus holidays/leave
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="expenses" className="text-foreground">
                                        Annual Business Expenses (ZAR)
                                    </Label>
                                    <div className="relative mt-2">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                        <Input
                                            id="expenses"
                                            type="number"
                                            placeholder="e.g., 120000"
                                            value={expenses}
                                            onChange={(e) => setExpenses(e.target.value)}
                                            className="pl-8 bg-muted border-border text-foreground h-12"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Software, equipment, office, insurance, etc.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="profitMargin" className="text-foreground">
                                        Profit Margin (%)
                                    </Label>
                                    <Input
                                        id="profitMargin"
                                        type="number"
                                        value={profitMargin}
                                        onChange={(e) => setProfitMargin(e.target.value)}
                                        className="mt-2 bg-muted border-border text-foreground h-12"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Buffer for growth, savings, and unexpected costs
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold mb-6">Your Rates</h2>
                            
                            <div className="space-y-4">
                                <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
                                    <div className="text-sm text-primary mb-1">Recommended Hourly Rate</div>
                                    <div className="text-4xl font-bold text-primary">
                                        R {results.recommendedRate.toLocaleString()}/hr
                                    </div>
                                    <p className="text-xs text-primary/70 mt-2">
                                        Includes expenses + {profitMargin}% margin
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-4 rounded-xl bg-muted text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Daily (8hr)</div>
                                        <div className="text-lg font-bold">R {results.dailyRate.toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Weekly</div>
                                        <div className="text-lg font-bold">R {results.weeklyRate.toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Monthly</div>
                                        <div className="text-lg font-bold">R {results.monthlyRate.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total hours/year</span>
                                        <span className="font-medium">{results.totalHours.toLocaleString()} hrs</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Billable hours (~70%)</span>
                                        <span className="font-medium">{results.billableHours.toLocaleString()} hrs</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Basic rate (no expenses)</span>
                                        <span className="font-medium">R {results.basicRate.toLocaleString()}/hr</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Rate with expenses</span>
                                        <span className="font-medium">R {results.rateWithExpenses.toLocaleString()}/hr</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <Link href="/login">
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                        Create Invoice at This Rate
                                        <IconArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        Pricing Tips for South African Freelancers
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-start gap-3">
                                <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-2">Account for Non-Billable Time</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Freelancers typically only bill 60-70% of their working hours. The rest goes to 
                                        admin, marketing, invoicing, and client acquisition.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-start gap-3">
                                <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-2">Include All Business Costs</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Don't forget: software subscriptions, equipment, internet, phone, insurance, 
                                        accounting fees, and professional development.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-start gap-3">
                                <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-2">Factor in Benefits You're Missing</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Unlike employees, you pay for your own medical aid, retirement, UIF equivalent, 
                                        and don't get paid leave. Add 25-30% to cover these.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-start gap-3">
                                <IconInfoCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-2">Research Market Rates</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Check what others in your industry charge. Platforms like Upwork, local job boards, 
                                        and industry associations can provide benchmarks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Benchmarks */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        Typical Freelance Rates in South Africa (2024)
                    </h2>
                    
                    <div className="rounded-2xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Industry</th>
                                    <th className="text-left p-4 font-semibold">Junior</th>
                                    <th className="text-left p-4 font-semibold">Mid-Level</th>
                                    <th className="text-left p-4 font-semibold">Senior</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">Web Development</td>
                                    <td className="p-4">R250-400/hr</td>
                                    <td className="p-4">R400-700/hr</td>
                                    <td className="p-4">R700-1200/hr</td>
                                </tr>
                                <tr className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">Graphic Design</td>
                                    <td className="p-4">R200-350/hr</td>
                                    <td className="p-4">R350-550/hr</td>
                                    <td className="p-4">R550-900/hr</td>
                                </tr>
                                <tr className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">Copywriting</td>
                                    <td className="p-4">R200-350/hr</td>
                                    <td className="p-4">R350-600/hr</td>
                                    <td className="p-4">R600-1000/hr</td>
                                </tr>
                                <tr className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">Photography</td>
                                    <td className="p-4">R300-500/hr</td>
                                    <td className="p-4">R500-800/hr</td>
                                    <td className="p-4">R800-1500/hr</td>
                                </tr>
                                <tr className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">Consulting</td>
                                    <td className="p-4">R400-600/hr</td>
                                    <td className="p-4">R600-1000/hr</td>
                                    <td className="p-4">R1000-2500/hr</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        * Rates vary by location, specialization, and client type. These are general guidelines.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Start Invoicing at Your New Rate
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Create professional invoices with Illumi. Track your hours, set your rates, 
                        and get paid faster with online payments.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create My First Invoice
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
