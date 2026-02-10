"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconArrowLeft, IconCopy, IconRefresh, IconCheck } from "@tabler/icons-react"

const formats = [
    { id: "inv-seq", label: "INV-001", description: "Classic sequential", generate: (n: number) => `INV-${String(n).padStart(3, "0")}` },
    { id: "date-seq", label: "2026-02-001", description: "Year-month + sequence", generate: (n: number) => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(n).padStart(3, "0")}` } },
    { id: "prefix-seq", label: "ILLUMI-0001", description: "Custom prefix + sequence", generate: (n: number, prefix?: string) => `${prefix || "ILLUMI"}-${String(n).padStart(4, "0")}` },
    { id: "random", label: "INV-A3F8K2", description: "Random alphanumeric", generate: () => { const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let r = ""; for (let i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)]; return `INV-${r}` } },
    { id: "date-random", label: "20260210-X4K9", description: "Date + random code", generate: () => { const d = new Date(); const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let r = ""; for (let i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)]; return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${r}` } },
]

export default function InvoiceNumberGeneratorPage() {
    const [selectedFormat, setSelectedFormat] = useState("inv-seq")
    const [startNumber, setStartNumber] = useState("1")
    const [prefix, setPrefix] = useState("ILLUMI")
    const [count, setCount] = useState("10")
    const [generated, setGenerated] = useState<string[]>([])
    const [copied, setCopied] = useState(false)

    const handleGenerate = () => {
        const format = formats.find((f) => f.id === selectedFormat)
        if (!format) return
        const start = parseInt(startNumber) || 1
        const total = Math.min(parseInt(count) || 10, 50)
        const numbers: string[] = []
        for (let i = 0; i < total; i++) {
            numbers.push(format.generate(start + i, prefix))
        }
        setGenerated(numbers)
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generated.join("\n"))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />

            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Invoice Number Generator
                </h1>
                <p className="text-muted-foreground text-lg mb-10 max-w-3xl">
                    Generate professional invoice numbers in bulk. Choose from sequential, date-based, or random formats.
                    Copy them to use in your invoicing workflow.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-xl font-semibold mb-6">Configure</h2>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Format</Label>
                                <div className="grid grid-cols-1 gap-2">
                                    {formats.map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setSelectedFormat(f.id)}
                                            className={`text-left p-3 rounded-xl border transition-colors ${selectedFormat === f.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                                        >
                                            <div className="font-mono text-sm font-semibold">{f.label}</div>
                                            <div className="text-xs text-muted-foreground">{f.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedFormat === "prefix-seq" && (
                                <div className="space-y-2">
                                    <Label htmlFor="prefix" className="text-sm font-medium">Custom Prefix</Label>
                                    <Input
                                        id="prefix"
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                                        placeholder="ILLUMI"
                                        className="bg-muted border-border"
                                    />
                                </div>
                            )}

                            {!selectedFormat.includes("random") && (
                                <div className="space-y-2">
                                    <Label htmlFor="start" className="text-sm font-medium">Starting Number</Label>
                                    <Input
                                        id="start"
                                        type="number"
                                        value={startNumber}
                                        onChange={(e) => setStartNumber(e.target.value)}
                                        min="1"
                                        className="bg-muted border-border"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="count" className="text-sm font-medium">How many? (max 50)</Label>
                                <Input
                                    id="count"
                                    type="number"
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                    min="1"
                                    max="50"
                                    className="bg-muted border-border"
                                />
                            </div>

                            <Button onClick={handleGenerate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                <IconRefresh className="mr-2 h-4 w-4" />
                                Generate Numbers
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Generated Numbers</h2>
                            {generated.length > 0 && (
                                <Button variant="outline" size="sm" onClick={handleCopy}>
                                    {copied ? <IconCheck className="mr-2 h-4 w-4" /> : <IconCopy className="mr-2 h-4 w-4" />}
                                    {copied ? "Copied!" : "Copy All"}
                                </Button>
                            )}
                        </div>

                        {generated.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Click &quot;Generate Numbers&quot; to see results.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {generated.map((num, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border">
                                        <span className="font-mono text-sm font-semibold">{num}</span>
                                        <span className="text-xs text-muted-foreground">#{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-xl font-semibold mb-4">Best practices for invoice numbering</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Do</h3>
                            <ul className="space-y-1.5 list-disc list-inside">
                                <li>Use sequential numbers for easy tracking</li>
                                <li>Include a date component for quick reference</li>
                                <li>Keep the format consistent across all invoices</li>
                                <li>Start from 001, not 1 (looks more professional)</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Don&apos;t</h3>
                            <ul className="space-y-1.5 list-disc list-inside">
                                <li>Reuse invoice numbers (SARS requires unique numbers)</li>
                                <li>Skip numbers without documenting why</li>
                                <li>Use overly complex formats that confuse clients</li>
                                <li>Start at 1 if you want to appear established</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
