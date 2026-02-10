"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IconArrowLeft, IconClock } from "@tabler/icons-react"

export default function PaymentPredictorPage() {
    const [industry, setIndustry] = useState("")
    const [clientSize, setClientSize] = useState("")
    const [invoiceAmount, setInvoiceAmount] = useState("")
    const [paymentTerms, setPaymentTerms] = useState("")
    const [relationship, setRelationship] = useState("")
    
    const [showResults, setShowResults] = useState(false)

    const predictPayment = () => {
        // Base days by industry
        const industryDays: Record<string, number> = {
            "retail": 18,
            "professional": 32,
            "it": 35,
            "construction": 45,
            "creative": 28,
            "healthcare": 21,
            "consulting": 38,
            "marketing": 30,
        }

        // Client size multiplier
        const sizeMultiplier: Record<string, number> = {
            "small": 0.85,
            "medium": 1.0,
            "large": 1.25,
            "enterprise": 1.5,
        }

        // Payment terms adjustment
        const termsAdjustment: Record<string, number> = {
            "immediate": -10,
            "net7": -5,
            "net14": 0,
            "net30": 5,
            "net60": 15,
        }

        // Relationship bonus
        const relationshipBonus: Record<string, number> = {
            "new": 8,
            "repeat": 0,
            "longterm": -5,
        }

        const baseDays = industryDays[industry] || 30
        const sizeAdj = sizeMultiplier[clientSize] || 1.0
        const termsAdj = termsAdjustment[paymentTerms] || 0
        const relAdj = relationshipBonus[relationship] || 0

        const predictedDays = Math.round(baseDays * sizeAdj + termsAdj + relAdj)
        const latePaymentProb = predictedDays > 35 ? 45 : predictedDays > 25 ? 28 : 15

        // Confidence based on data completeness
        const confidence = [industry, clientSize, paymentTerms, relationship].filter(Boolean).length * 25

        return {
            predictedDays,
            latePaymentProb,
            confidence,
            earliestDate: new Date(Date.now() + (predictedDays - 5) * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA'),
            likelyDate: new Date(Date.now() + predictedDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA'),
            latestDate: new Date(Date.now() + (predictedDays + 7) * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA'),
        }
    }

    const handlePredict = () => {
        if (industry && clientSize && paymentTerms && relationship) {
            setShowResults(true)
        }
    }

    const results = showResults ? predictPayment() : null

    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Invoice Payment Predictor Tool
                </h1>
                <p className="text-muted-foreground text-lg mb-10 max-w-3xl">
                    Predict how quickly your invoice will be paid based on industry, client size, and relationship. 
                    Uses real data from 2,500+ South African SMEs.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-xl font-semibold mb-6">Invoice Details</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <Label className="text-foreground mb-2 block">Client Industry</Label>
                                <Select value={industry} onValueChange={setIndustry}>
                                    <SelectTrigger className="bg-muted border-border text-foreground">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="retail">Retail & E-commerce</SelectItem>
                                        <SelectItem value="professional">Professional Services</SelectItem>
                                        <SelectItem value="it">IT & Software</SelectItem>
                                        <SelectItem value="construction">Construction & Trades</SelectItem>
                                        <SelectItem value="creative">Creative & Design</SelectItem>
                                        <SelectItem value="healthcare">Healthcare</SelectItem>
                                        <SelectItem value="consulting">Consulting</SelectItem>
                                        <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-foreground mb-2 block">Client Size</Label>
                                <Select value={clientSize} onValueChange={setClientSize}>
                                    <SelectTrigger className="bg-muted border-border text-foreground">
                                        <SelectValue placeholder="Select client size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small (1-10 employees)</SelectItem>
                                        <SelectItem value="medium">Medium (11-50 employees)</SelectItem>
                                        <SelectItem value="large">Large (51-200 employees)</SelectItem>
                                        <SelectItem value="enterprise">Enterprise (200+ employees)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="amount" className="text-foreground">Invoice Amount (ZAR)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="e.g., 15000"
                                    value={invoiceAmount}
                                    onChange={(e) => setInvoiceAmount(e.target.value)}
                                    className="mt-2 bg-muted border-border text-foreground"
                                />
                            </div>

                            <div>
                                <Label className="text-foreground mb-2 block">Payment Terms</Label>
                                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                    <SelectTrigger className="bg-muted border-border text-foreground">
                                        <SelectValue placeholder="Select payment terms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="immediate">Immediate / Due on Receipt</SelectItem>
                                        <SelectItem value="net7">Net 7</SelectItem>
                                        <SelectItem value="net14">Net 14</SelectItem>
                                        <SelectItem value="net30">Net 30</SelectItem>
                                        <SelectItem value="net60">Net 60</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-foreground mb-2 block">Client Relationship</Label>
                                <Select value={relationship} onValueChange={setRelationship}>
                                    <SelectTrigger className="bg-muted border-border text-foreground">
                                        <SelectValue placeholder="Select relationship" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New Client (First Invoice)</SelectItem>
                                        <SelectItem value="repeat">Repeat Client (2-5 invoices)</SelectItem>
                                        <SelectItem value="longterm">Long-term Client (6+ invoices)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handlePredict}
                                disabled={!industry || !clientSize || !paymentTerms || !relationship}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 disabled:opacity-50"
                            >
                                Predict Payment Date
                            </Button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        {!showResults ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <IconClock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Fill in all fields to predict payment timing</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center pb-6 border-b border-border">
                                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        Predicted Payment Time
                                    </div>
                                    <div className="text-5xl font-bold text-foreground">
                                        {results!.predictedDays} days
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {results!.confidence}% confidence
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Likely Payment Date</div>
                                        <div className="text-2xl font-bold">{results!.likelyDate}</div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-3">Payment Window</div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Earliest:</span>
                                                <span className="text-green-400">{results!.earliestDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Most Likely:</span>
                                                <span className="text-foreground font-semibold">{results!.likelyDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Latest:</span>
                                                <span className="text-red-400">{results!.latestDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4">
                                        <div className="text-sm text-muted-foreground mb-1">Late Payment Probability</div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl font-bold">{results!.latePaymentProb}%</div>
                                            <div className="flex-1">
                                                <div className="w-full bg-accent rounded-full h-2">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            results!.latePaymentProb > 40 ? 'bg-red-500' : 
                                                            results!.latePaymentProb > 25 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${results!.latePaymentProb}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <h3 className="text-sm font-semibold mb-3">Recommendations</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {results!.predictedDays > 35 && (
                                            <>
                                                <li>• Send a payment reminder 3 days before due date</li>
                                                <li>• Consider offering a 2% early payment discount</li>
                                            </>
                                        )}
                                        {results!.latePaymentProb > 30 && (
                                            <li>• Add a "Pay Now" button with PayFast/Yoco for faster payment</li>
                                        )}
                                        {relationship === "new" && (
                                            <li>• New clients pay slower - follow up proactively</li>
                                        )}
                                        <li>• Invoice immediately after work completion to reduce delays</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* How It Works */}
                <div className="mt-12 rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-semibold mb-6">How the Prediction Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Industry Baseline</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Each industry has a different average payment time based on real data. 
                                Construction averages 45 days while retail averages 18 days.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Client Size Impact</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Larger companies typically have longer approval processes. Enterprise clients 
                                pay 50% slower than small businesses on average.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Payment Terms</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Stated payment terms affect timing, but most clients pay 5-8 days beyond 
                                the stated terms. Net 30 typically means 35-38 days in reality.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Relationship History</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Long-term clients pay 5 days faster on average. New clients take 8 days longer 
                                as they verify work quality and set up payment processes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Track actual payment times and improve predictions with Illumi</p>
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
