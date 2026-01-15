"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconCheck } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import { Suspense } from "react"

function BillingContent() {
    const searchParams = useSearchParams()
    const plan = searchParams.get("plan")
    const [selectedPlan, setSelectedPlan] = useState<string | null>(plan)

    useEffect(() => {
        if (plan) {
            setSelectedPlan(plan)
        }
    }, [plan])

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-medium mb-1">Billing</h1>
                <p className="text-muted-foreground">Manage your subscription and billing information.</p>
            </div>

            {/* Current Plan */}
            <div className="mb-8 p-6 border border-white/5 rounded-xl bg-[#09090b]">
                <h3 className="text-lg font-medium text-white mb-4">Current Plan</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-white mb-1">Pro Trial</p>
                        <p className="text-sm text-neutral-500">11 days remaining</p>
                    </div>
                    <Button className="bg-white text-black hover:bg-neutral-200 h-11 px-6">
                        Upgrade Now
                    </Button>
                </div>
            </div>

            {/* Plan Selection */}
            {selectedPlan && (
                <div className="mb-8 p-6 border border-white/5 rounded-xl bg-[#09090b]">
                    <h3 className="text-lg font-medium text-white mb-4">Selected Plan: {selectedPlan === "pro" ? "Pro" : "Starter"}</h3>
                    <p className="text-sm text-neutral-500 mb-4">Complete your subscription to continue using Emini.</p>
                    <Button className="bg-white text-black hover:bg-neutral-200 h-11 px-6">
                        Complete Subscription
                    </Button>
                </div>
            )}

            {/* Payment Method */}
            <div className="mb-8 p-6 border border-white/5 rounded-xl bg-[#09090b]">
                <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
                <p className="text-sm text-neutral-500 mb-4">No payment method on file.</p>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 h-11 px-6">
                    Add Payment Method
                </Button>
            </div>

            {/* Billing History */}
            <div className="p-6 border border-white/5 rounded-xl bg-[#09090b]">
                <h3 className="text-lg font-medium text-white mb-4">Billing History</h3>
                <p className="text-sm text-neutral-500">No billing history available.</p>
            </div>
        </div>
    )
}

export default function BillingPage() {
    return (
        <Suspense>
            <BillingContent />
        </Suspense>
    )
}

