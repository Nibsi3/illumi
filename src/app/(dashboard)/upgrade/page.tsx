"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

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
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: sessionData } = await supabase.auth.getSession()
            setUser(sessionData?.session?.user || null)
        }
        getUser()
    }, [supabase])

    const userFirstName = user?.user_metadata?.full_name?.split(" ")[0]
        || user?.user_metadata?.name?.split(" ")[0]
        || user?.email?.split("@")[0]
        || ""

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Secure your 50% discount before trial ends
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {userFirstName ? `Hi ${userFirstName}, your` : "Your"} trial ends in 11 days. Choose a plan now to continue using all of Illumi's features and secure our limited-time discount—save 50% on the Pro plan.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Free Plan */}
                <div className="p-8 rounded-xl bg-card border border-border">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Forever free</p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">INCLUDING</h4>
                        <ul className="space-y-3">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                                    <IconCheck className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-12 bg-card border-border text-foreground hover:bg-muted rounded-lg"
                        onClick={() => router.push("/settings/billing?plan=free")}
                    >
                        Current plan
                    </Button>
                </div>

                {/* Pro Plan */}
                <div className="p-8 rounded-xl bg-card border border-border relative">
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-neutral-700 text-foreground text-xs font-medium">
                        Limited offer
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-muted-foreground line-through">$99</span>
                            <span className="text-4xl font-bold text-foreground">$49</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Excl. VAT</p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">INCLUDING</h4>
                        <ul className="space-y-3">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                                    <IconCheck className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold"
                        onClick={() => router.push("/settings/billing?plan=pro")}
                    >
                        Choose pro plan
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
                Questions? Contact support or book a call with the founders.
            </p>
        </div>
    )
}


