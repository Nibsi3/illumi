"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { IconArrowLeft, IconFileInvoice, IconCheck, IconX } from "@tabler/icons-react"

export default function TemplateAnalyzerPage() {
    const [showResults, setShowResults] = useState(false)
    const [checklist, setChecklist] = useState({
        hasInvoiceLabel: false,
        hasInvoiceNumber: false,
        hasVATNumber: false,
        hasVATAmount: false,
        hasItemizedList: false,
        hasDueDate: false,
        hasPaymentTerms: false,
        hasBusinessDetails: false,
        hasClientDetails: false,
        hasBankDetails: false,
        hasTotal: false,
        hasProfessionalDesign: false,
    })

    const handleCheckboxChange = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const calculateScore = () => {
        const total = Object.keys(checklist).length
        const checked = Object.values(checklist).filter(Boolean).length
        return {
            score: Math.round((checked / total) * 100),
            checked,
            total,
        }
    }

    const handleAnalyze = () => {
        setShowResults(true)
    }

    const results = showResults ? calculateScore() : null

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-400"
        if (score >= 70) return "text-blue-400"
        if (score >= 50) return "text-yellow-400"
        return "text-red-400"
    }

    const getScoreLabel = (score: number) => {
        if (score >= 90) return "Excellent - Professional Quality"
        if (score >= 70) return "Good - Minor improvements needed"
        if (score >= 50) return "Fair - Several issues to fix"
        return "Poor - Major improvements required"
    }

    const checklistItems = [
        { key: "hasInvoiceLabel" as const, label: "Has 'Tax Invoice' or 'VAT Invoice' label", required: true },
        { key: "hasInvoiceNumber" as const, label: "Unique invoice number", required: true },
        { key: "hasVATNumber" as const, label: "Your VAT registration number (if registered)", required: true },
        { key: "hasVATAmount" as const, label: "VAT amount shown separately", required: true },
        { key: "hasItemizedList" as const, label: "Itemized list with descriptions", required: true },
        { key: "hasDueDate" as const, label: "Clear due date", required: true },
        { key: "hasPaymentTerms" as const, label: "Payment terms (e.g., Net 30)", required: false },
        { key: "hasBusinessDetails" as const, label: "Your business name, address, contact", required: true },
        { key: "hasClientDetails" as const, label: "Client name and address", required: true },
        { key: "hasBankDetails" as const, label: "Bank account details for payment", required: false },
        { key: "hasTotal" as const, label: "Clear total amount due", required: true },
        { key: "hasProfessionalDesign" as const, label: "Professional, branded design", required: false },
    ]

    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Invoice Template Performance Analyzer
                </h1>
                <p className="text-white/60 text-lg mb-10 max-w-3xl">
                    Check if your invoice template meets SARS requirements and best practices. 
                    Get suggestions to improve payment speed and compliance.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Checklist */}
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        <h2 className="text-xl font-semibold mb-6">Analyze Your Template</h2>
                        
                        <div className="space-y-4 mb-6">
                            {checklistItems.map((item) => (
                                <div key={item.key} className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id={item.key}
                                        checked={checklist[item.key]}
                                        onChange={() => handleCheckboxChange(item.key)}
                                        className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                                    />
                                    <label htmlFor={item.key} className="flex-1 cursor-pointer">
                                        <span className="text-white/80">{item.label}</span>
                                        {item.required && (
                                            <span className="ml-2 text-xs text-red-400">*Required</span>
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleAnalyze}
                            className="w-full bg-white text-black hover:bg-white/90 h-11"
                        >
                            Analyze Template
                        </Button>
                    </div>

                    {/* Results */}
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                        {!showResults ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <IconFileInvoice className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40">Check the items that apply to your template</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center pb-6 border-b border-white/10">
                                    <div className="text-sm font-bold uppercase tracking-wider text-white/40 mb-2">
                                        Template Score
                                    </div>
                                    <div className={`text-6xl font-bold ${getScoreColor(results!.score)}`}>
                                        {results!.score}%
                                    </div>
                                    <div className="text-lg text-white/60 mt-2">
                                        {getScoreLabel(results!.score)}
                                    </div>
                                    <div className="text-sm text-white/40 mt-2">
                                        {results!.checked} of {results!.total} items checked
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3 text-white">What You're Doing Right</h3>
                                        <div className="space-y-2">
                                            {checklistItems
                                                .filter(item => checklist[item.key])
                                                .slice(0, 3)
                                                .map(item => (
                                                    <div key={item.key} className="flex items-start gap-2 text-sm">
                                                        <IconCheck className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                                                        <span className="text-white/70">{item.label}</span>
                                                    </div>
                                                ))}
                                            {checklistItems.filter(item => checklist[item.key]).length === 0 && (
                                                <p className="text-sm text-white/40">No items checked yet</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold mb-3 text-white">What to Add</h3>
                                        <div className="space-y-2">
                                            {checklistItems
                                                .filter(item => !checklist[item.key])
                                                .slice(0, 4)
                                                .map(item => (
                                                    <div key={item.key} className="flex items-start gap-2 text-sm">
                                                        <IconX className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                                        <span className="text-white/70">{item.label}</span>
                                                    </div>
                                                ))}
                                            {checklistItems.filter(item => !checklist[item.key]).length === 0 && (
                                                <p className="text-sm text-green-400">Perfect! All items included.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {results!.score < 100 && (
                                    <div className="pt-4 border-t border-white/10">
                                        <h3 className="text-sm font-semibold mb-3">Impact of Missing Items</h3>
                                        <ul className="space-y-2 text-sm text-white/60">
                                            {!checklist.hasVATAmount && (
                                                <li>• Missing VAT = SARS non-compliance, potential penalties</li>
                                            )}
                                            {!checklist.hasDueDate && (
                                                <li>• No due date = 8 days slower payment on average</li>
                                            )}
                                            {!checklist.hasBankDetails && (
                                                <li>• No bank details = clients can't pay easily</li>
                                            )}
                                            {!checklist.hasProfessionalDesign && (
                                                <li>• Unprofessional design = lower client trust</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* SARS Requirements */}
                <div className="mt-12 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                    <h2 className="text-2xl font-semibold mb-6">SARS Tax Invoice Requirements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-3 text-white">Mandatory Elements</h3>
                            <ul className="space-y-2 text-sm text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>Words "Tax Invoice" or "VAT Invoice"</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>Your VAT registration number</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>Unique invoice number</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>Invoice date</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>Your business name and address</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>Customer name and address</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>Itemized description of goods/services</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 shrink-0">*</span>
                                    <span>VAT amount shown separately (15%)</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3 text-white">Best Practices (Optional)</h3>
                            <ul className="space-y-2 text-sm text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>Payment terms (e.g., Net 30)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>Due date prominently displayed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>Bank account details for EFT</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>"Pay Now" button with online payment</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>Professional branding (logo, colors)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>Contact details (phone, email)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>Notes or payment instructions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 shrink-0">✓</span>
                                    <span>Subtotal, VAT, and total clearly separated</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Template Improvements */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                    <h2 className="text-2xl font-semibold mb-6">How Template Quality Affects Payment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-2">-40%</div>
                            <h3 className="font-semibold mb-2 text-white">Payment Time</h3>
                            <p className="text-sm text-white/60">
                                Professional templates with "Pay Now" buttons get paid 40% faster (18 vs 30 days).
                            </p>
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-2">-89%</div>
                            <h3 className="font-semibold mb-2 text-white">Error Rate</h3>
                            <p className="text-sm text-white/60">
                                Automated templates reduce errors from 18% to 2%, preventing payment delays.
                            </p>
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-2">+73%</div>
                            <h3 className="font-semibold mb-2 text-white">Client Trust</h3>
                            <p className="text-sm text-white/60">
                                73% of clients say professional invoices increase their trust in the business.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-white/60 mb-4">Use professional invoice templates automatically with Illumi</p>
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
