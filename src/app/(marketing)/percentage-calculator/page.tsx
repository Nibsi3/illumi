"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    IconPercentage,
    IconArrowRight,
} from "@tabler/icons-react"

export default function PercentageCalculatorPage() {
    const [calcType, setCalcType] = useState<"whatIs" | "isWhatPercent" | "percentChange">("whatIs")
    
    // What is X% of Y
    const [percentage1, setPercentage1] = useState("")
    const [value1, setValue1] = useState("")
    
    // X is what % of Y
    const [partValue, setPartValue] = useState("")
    const [wholeValue, setWholeValue] = useState("")
    
    // Percent change
    const [oldValue, setOldValue] = useState("")
    const [newValue, setNewValue] = useState("")

    const calculateWhatIs = () => {
        const pct = parseFloat(percentage1) || 0
        const val = parseFloat(value1) || 0
        return (pct / 100) * val
    }

    const calculateIsWhatPercent = () => {
        const part = parseFloat(partValue) || 0
        const whole = parseFloat(wholeValue) || 0
        if (whole === 0) return 0
        return (part / whole) * 100
    }

    const calculatePercentChange = () => {
        const oldVal = parseFloat(oldValue) || 0
        const newVal = parseFloat(newValue) || 0
        if (oldVal === 0) return 0
        return ((newVal - oldVal) / oldVal) * 100
    }

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconPercentage className="h-4 w-4" />
                            Free Calculator
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Percentage Calculator
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Calculate percentages instantly. Find what percentage one number is of another, 
                            calculate percentage changes, or find a percentage of any value.
                        </p>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Calculator Type Tabs */}
                    <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg mb-8">
                        <button
                            onClick={() => setCalcType("whatIs")}
                            className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                                calcType === "whatIs"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            X% of Y
                        </button>
                        <button
                            onClick={() => setCalcType("isWhatPercent")}
                            className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                                calcType === "isWhatPercent"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            X is ?% of Y
                        </button>
                        <button
                            onClick={() => setCalcType("percentChange")}
                            className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                                calcType === "percentChange"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            % Change
                        </button>
                    </div>

                    {/* What is X% of Y */}
                    {calcType === "whatIs" && (
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold mb-6">What is X% of Y?</h2>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <span className="text-lg text-muted-foreground">What is</span>
                                <Input
                                    type="number"
                                    placeholder="10"
                                    value={percentage1}
                                    onChange={(e) => setPercentage1(e.target.value)}
                                    className="w-24 bg-muted border-border text-foreground h-12 text-center text-lg"
                                />
                                <span className="text-lg text-muted-foreground">% of</span>
                                <Input
                                    type="number"
                                    placeholder="500"
                                    value={value1}
                                    onChange={(e) => setValue1(e.target.value)}
                                    className="w-32 bg-muted border-border text-foreground h-12 text-center text-lg"
                                />
                                <span className="text-lg text-muted-foreground">?</span>
                            </div>

                            <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
                                <div className="text-sm text-primary mb-1">Result</div>
                                <div className="text-4xl font-bold text-primary">
                                    {calculateWhatIs().toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <p className="text-sm text-primary/70 mt-2">
                                    {percentage1 || "0"}% of {value1 || "0"} = {calculateWhatIs().toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* X is what % of Y */}
                    {calcType === "isWhatPercent" && (
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold mb-6">X is what percent of Y?</h2>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <Input
                                    type="number"
                                    placeholder="25"
                                    value={partValue}
                                    onChange={(e) => setPartValue(e.target.value)}
                                    className="w-32 bg-muted border-border text-foreground h-12 text-center text-lg"
                                />
                                <span className="text-lg text-muted-foreground">is what % of</span>
                                <Input
                                    type="number"
                                    placeholder="200"
                                    value={wholeValue}
                                    onChange={(e) => setWholeValue(e.target.value)}
                                    className="w-32 bg-muted border-border text-foreground h-12 text-center text-lg"
                                />
                                <span className="text-lg text-muted-foreground">?</span>
                            </div>

                            <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
                                <div className="text-sm text-primary mb-1">Result</div>
                                <div className="text-4xl font-bold text-primary">
                                    {calculateIsWhatPercent().toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                </div>
                                <p className="text-sm text-primary/70 mt-2">
                                    {partValue || "0"} is {calculateIsWhatPercent().toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% of {wholeValue || "0"}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Percent Change */}
                    {calcType === "percentChange" && (
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <h2 className="text-xl font-semibold mb-6">Percentage Change</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <Label htmlFor="oldValue" className="text-foreground">Original Value</Label>
                                    <Input
                                        id="oldValue"
                                        type="number"
                                        placeholder="100"
                                        value={oldValue}
                                        onChange={(e) => setOldValue(e.target.value)}
                                        className="mt-2 bg-muted border-border text-foreground h-12"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newValue" className="text-foreground">New Value</Label>
                                    <Input
                                        id="newValue"
                                        type="number"
                                        placeholder="125"
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        className="mt-2 bg-muted border-border text-foreground h-12"
                                    />
                                </div>
                            </div>

                            <div className={`p-6 rounded-xl border ${
                                calculatePercentChange() >= 0 
                                    ? "bg-green-500/10 border-green-500/20" 
                                    : "bg-red-500/10 border-red-500/20"
                            }`}>
                                <div className={`text-sm mb-1 ${calculatePercentChange() >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {calculatePercentChange() >= 0 ? "Increase" : "Decrease"}
                                </div>
                                <div className={`text-4xl font-bold ${calculatePercentChange() >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {calculatePercentChange() >= 0 ? "+" : ""}{calculatePercentChange().toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                </div>
                                <p className={`text-sm mt-2 ${calculatePercentChange() >= 0 ? "text-green-500/70" : "text-red-500/70"}`}>
                                    From {oldValue || "0"} to {newValue || "0"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Common Calculations */}
            <section className="py-16 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        Common Percentage Calculations
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Discounts</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>10% off R500 = R450</p>
                                <p>20% off R1000 = R800</p>
                                <p>25% off R2000 = R1500</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">VAT (15%)</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>R100 + 15% = R115</p>
                                <p>R500 + 15% = R575</p>
                                <p>R1000 + 15% = R1150</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Tips & Gratuity</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>10% tip on R200 = R20</p>
                                <p>15% tip on R300 = R45</p>
                                <p>20% tip on R500 = R100</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Profit Margins</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>20% margin on R1000 cost = R1200 price</p>
                                <p>30% margin on R500 cost = R650 price</p>
                                <p>50% margin on R200 cost = R300 price</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Salary Increases</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>5% raise on R20k = R21k</p>
                                <p>8% raise on R30k = R32.4k</p>
                                <p>10% raise on R50k = R55k</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Commission</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>5% on R10k sale = R500</p>
                                <p>10% on R50k sale = R5000</p>
                                <p>15% on R100k sale = R15k</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Formulas */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        Percentage Formulas
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Finding X% of Y</h3>
                            <code className="block p-4 bg-muted rounded-lg text-sm">
                                Result = (X / 100) × Y
                            </code>
                            <p className="text-sm text-muted-foreground mt-3">
                                Example: 15% of 200 = (15 / 100) × 200 = 30
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Finding What Percent X is of Y</h3>
                            <code className="block p-4 bg-muted rounded-lg text-sm">
                                Percentage = (X / Y) × 100
                            </code>
                            <p className="text-sm text-muted-foreground mt-3">
                                Example: 25 is what % of 200? = (25 / 200) × 100 = 12.5%
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-3">Percentage Change</h3>
                            <code className="block p-4 bg-muted rounded-lg text-sm">
                                Change = ((New - Old) / Old) × 100
                            </code>
                            <p className="text-sm text-muted-foreground mt-3">
                                Example: From 80 to 100 = ((100 - 80) / 80) × 100 = 25% increase
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Need to Add Percentages to Invoices?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi automatically calculates discounts, taxes, and markups on your invoices. 
                        Create professional invoices with accurate calculations every time.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
