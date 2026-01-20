"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

const freeFeatures = [
    "Send up to 10 invoices per month",
    "2 connected banks",
    "Unlimited bank accounts",
    "Financial overview",
    "Time Tracker",
    "50 inbox items per month",
    "Customer management",
    "Export CSV & reports",
    "10GB Vault Storage",
    "2 users",
]

const proFeatures = [
    "Send up to 50 invoices per month",
    "10 connected banks",
    "Unlimited bank accounts",
    "Financial overview",
    "Time Tracker",
    "500 inbox items per month",
    "Customer management",
    "Export CSV & reports",
    "Recurring payments",
    "Client payment portal",
    "Custom PayGate integration",
    "100GB Vault Storage",
    "10 users",
]

export default function PricingPage() {
    const router = useRouter()

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                    Secure your 50% discount before trial ends
                </h1>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                    Hi Cameron, Your trial ends in 11 days. Choose a plan now to continue using all of Illumi's features and secure our limited-time discount—save 50% on the Pro plan.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Free Plan */}
                <div className="p-8 rounded-xl bg-[#09090b] border border-white/5">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-bold text-white">$0</span>
                            <span className="text-neutral-400">/mo</span>
                        </div>
                        <p className="text-sm text-neutral-500">Forever free</p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">INCLUDING</h4>
                        <ul className="space-y-3">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                    <IconCheck className="h-5 w-5 text-white shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-12 bg-[#09090b] border-white/10 text-white hover:bg-white/5 rounded-lg"
                        onClick={() => router.push("/settings/billing?plan=free")}
                    >
                        Current plan
                    </Button>
                </div>

                {/* Pro Plan */}
                <div className="p-8 rounded-xl bg-[#09090b] border border-white/5 relative">
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-neutral-700 text-white text-xs font-medium">
                        Limited offer
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-neutral-500 line-through">$99</span>
                            <span className="text-4xl font-bold text-white">$49</span>
                            <span className="text-neutral-400">/mo</span>
                        </div>
                        <p className="text-sm text-neutral-500">Excl. VAT</p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">INCLUDING</h4>
                        <ul className="space-y-3">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                    <IconCheck className="h-5 w-5 text-white shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        className="w-full h-12 bg-white text-black hover:bg-neutral-200 rounded-lg font-semibold"
                        onClick={() => router.push("/settings/billing?plan=pro")}
                    >
                        Choose pro plan
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-neutral-500">
                Questions? Contact support or book a call with the founders.
            </p>
        </div>
    )
}

