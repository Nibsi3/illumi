"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconArrowLeft, IconCopy, IconRefresh, IconCheck, IconSparkles } from "@tabler/icons-react"

const industries = [
    "Creative & Design",
    "Technology & Dev",
    "Consulting",
    "Marketing",
    "Finance & Accounting",
    "Construction & Trade",
    "Health & Wellness",
    "Education & Training",
    "Legal Services",
    "E-Commerce & Retail",
]

const prefixes: Record<string, string[]> = {
    "Creative & Design": ["Pixel", "Canvas", "Prism", "Vivid", "Hue", "Craft", "Nova", "Bloom", "Mosaic", "Sketch"],
    "Technology & Dev": ["Byte", "Node", "Apex", "Flux", "Core", "Logic", "Sync", "Proto", "Nexus", "Grid"],
    "Consulting": ["Sage", "Vantage", "Summit", "Pinnacle", "Clarity", "Insight", "Bridge", "Compass", "Meridian", "Keystone"],
    "Marketing": ["Buzz", "Reach", "Spark", "Pulse", "Signal", "Beacon", "Hype", "Viral", "Amplify", "Orbit"],
    "Finance & Accounting": ["Ledger", "Capital", "Vault", "Sterling", "Fiscal", "Equity", "Merit", "Trust", "Zenith", "Rand"],
    "Construction & Trade": ["Forge", "Atlas", "Titan", "Anchor", "Bedrock", "Ironside", "Mason", "Solid", "Ridge", "Pillar"],
    "Health & Wellness": ["Thrive", "Vitae", "Balance", "Serene", "Pure", "Harmony", "Glow", "Flourish", "Renew", "Aura"],
    "Education & Training": ["Scholar", "Mentor", "Ascend", "Uplift", "Elevate", "Pathway", "Beacon", "Quest", "Ignite", "Stride"],
    "Legal Services": ["Justice", "Shield", "Advocate", "Counsel", "Verdict", "Magna", "Lex", "Tribune", "Guardian", "Charter"],
    "E-Commerce & Retail": ["Market", "Cart", "Shelf", "Goods", "Store", "Trade", "Shop", "Merchant", "Harbour", "Bazaar"],
}

const suffixes = [
    "Studio", "Co", "Labs", "Group", "Works", "Hub", "Agency", "Partners",
    "Solutions", "Collective", "SA", "Digital", "Pro", "Ventures", "Creative",
]

const saWords = ["Jacaranda", "Protea", "Karoo", "Kalahari", "Ubuntu", "Shaka", "Baobab", "Amandla", "Simba", "Kudu"]

function generateNames(industry: string, keyword: string, count: number): string[] {
    const pool = prefixes[industry] || prefixes["Technology & Dev"]
    const names: Set<string> = new Set()
    const kw = keyword.trim()

    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    let attempts = 0
    while (names.size < count && attempts < count * 10) {
        attempts++
        const style = Math.floor(Math.random() * 6)
        let name = ""
        switch (style) {
            case 0:
                name = `${pick(pool)} ${pick(suffixes)}`
                break
            case 1:
                name = kw ? `${kw} ${pick(suffixes)}` : `${pick(pool)}${pick(suffixes)}`
                break
            case 2:
                name = `${pick(saWords)} ${pick(suffixes)}`
                break
            case 3:
                name = kw ? `${pick(pool)} ${kw}` : `${pick(pool)} & ${pick(pool)}`
                break
            case 4:
                name = `${pick(pool)}${pick(pool).toLowerCase()}`
                break
            case 5:
                name = kw ? `${kw} ${pick(pool)} ${pick(suffixes)}` : `${pick(saWords)} ${pick(pool)}`
                break
        }
        if (name.length > 3) names.add(name)
    }
    return Array.from(names)
}

export default function BusinessNameGeneratorPage() {
    const [industry, setIndustry] = useState("Creative & Design")
    const [keyword, setKeyword] = useState("")
    const [generated, setGenerated] = useState<string[]>([])
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
    const [favourites, setFavourites] = useState<Set<string>>(new Set())

    const handleGenerate = () => {
        setGenerated(generateNames(industry, keyword, 12))
    }

    const handleCopy = async (name: string, idx: number) => {
        await navigator.clipboard.writeText(name)
        setCopiedIdx(idx)
        setTimeout(() => setCopiedIdx(null), 1500)
    }

    const toggleFav = (name: string) => {
        setFavourites((prev) => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
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
                    Business Name Generator
                </h1>
                <p className="text-muted-foreground text-lg mb-10 max-w-3xl">
                    Generate creative business name ideas inspired by South African culture and your industry.
                    Find the perfect name for your freelance brand or company.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-xl font-semibold mb-6">Your Business</h2>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Industry</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {industries.map((ind) => (
                                        <button
                                            key={ind}
                                            onClick={() => setIndustry(ind)}
                                            className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-colors ${industry === ind ? "border-primary bg-primary/5 text-foreground" : "border-border hover:border-primary/50 text-muted-foreground"}`}
                                        >
                                            {ind}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keyword" className="text-sm font-medium">Keyword (optional)</Label>
                                <Input
                                    id="keyword"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="e.g. your name, a concept, a word you love"
                                    className="bg-muted border-border"
                                />
                            </div>

                            <Button onClick={handleGenerate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                <IconSparkles className="mr-2 h-4 w-4" />
                                Generate Names
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Name Ideas</h2>
                            {generated.length > 0 && (
                                <Button variant="outline" size="sm" onClick={handleGenerate}>
                                    <IconRefresh className="mr-2 h-4 w-4" />
                                    Refresh
                                </Button>
                            )}
                        </div>

                        {generated.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Click &quot;Generate Names&quot; to see ideas.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[420px] overflow-y-auto">
                                {generated.map((name, i) => (
                                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${favourites.has(name) ? "bg-primary/5 border-primary/30" : "bg-muted border-border"}`}>
                                        <span className="font-semibold text-sm">{name}</span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => toggleFav(name)}
                                            >
                                                <span className={favourites.has(name) ? "text-primary" : "text-muted-foreground"}>
                                                    {favourites.has(name) ? "★" : "☆"}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => handleCopy(name, i)}
                                            >
                                                {copiedIdx === i ? <IconCheck className="h-3.5 w-3.5 text-primary" /> : <IconCopy className="h-3.5 w-3.5 text-muted-foreground" />}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {favourites.size > 0 && (
                            <div className="mt-6 pt-4 border-t border-border">
                                <h3 className="text-sm font-semibold mb-2">Your favourites</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(favourites).map((name) => (
                                        <span key={name} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-xl font-semibold mb-4">Tips for choosing a business name in South Africa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                        <ul className="space-y-1.5 list-disc list-inside">
                            <li>Check CIPC availability before committing</li>
                            <li>Ensure the .co.za domain is available</li>
                            <li>Keep it short, memorable, and easy to spell</li>
                            <li>Avoid names too similar to existing SA companies</li>
                        </ul>
                        <ul className="space-y-1.5 list-disc list-inside">
                            <li>Consider how it sounds in multiple SA languages</li>
                            <li>Make sure the social media handles are available</li>
                            <li>Test it with real people before registering</li>
                            <li>Avoid trends — pick something that ages well</li>
                        </ul>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
