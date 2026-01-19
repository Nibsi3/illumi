"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconPlus,
    IconCreditCard,
    IconDots,
    IconTrash,
    IconCircleCheckFilled,
    IconStarFilled,
    IconReceipt
} from "@tabler/icons-react"
import { useEffect, useState, Suspense } from "react"
import { useSubscription } from "@/lib/subscription/hooks"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AddCardModal } from "./components/add-card-modal"
import { PayFastSubscribeButton } from "./components/payfast-subscribe"
import { useSettings } from "@/lib/settings-context"

function BillingContent() {
    const searchParams = useSearchParams()
    const plan = searchParams.get("plan")
    const { isPro, trialDaysLeft } = useSubscription()
    const { billingMethods, setBillingMethods } = useSettings()
    const [selectedPlan, setSelectedPlan] = useState<string | null>(plan)
    const [isAddCardOpen, setIsAddCardOpen] = useState(false)

    useEffect(() => {
        if (plan) {
            setSelectedPlan(plan)
        }
    }, [plan])

    const setDefaultCard = (id: string) => {
        setBillingMethods(billingMethods.map(card => ({
            ...card,
            isDefault: card.id === id
        })))
    }

    const removeCard = (id: string) => {
        setBillingMethods(billingMethods.filter(card => card.id !== id))
    }

    const handleAddCard = (card: any) => {
        // If first card, make default
        if (billingMethods.length === 0) {
            card.isDefault = true
        }
        setBillingMethods([...billingMethods, card])
    }

    return (
        <div className="pb-32">
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-medium mb-1">Billing</h1>
                <p className="text-muted-foreground">Manage your subscription, payment methods, and billing history.</p>
            </div>

            {/* Current Plan Card (High Contrast) */}
            <div className="mb-12 p-8 border border-white/5 rounded-2xl bg-[#09090b] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <IconReceipt size={120} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-white/10 px-3 py-1 rounded-full">
                                {isPro ? "Pro Plan" : "Free Plan"}
                            </span>
                            {!isPro && (
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{trialDaysLeft} days remaining</span>
                            )}
                        </div>
                        <p className="text-3xl font-serif italic text-white mb-2">
                            {isPro ? "Illumi Professional" : "Ready for Pro?"}
                        </p>
                        <p className="text-sm text-neutral-400 max-w-md">
                            {isPro
                                ? "Access to all features including recurring invoices, client portal, and up to 10 team members."
                                : "Upgrade to Pro for R350/mo to unlock recurring invoices, custom branding, and the client portal."}
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            {isPro ? (
                                <Button
                                    onClick={() => {
                                        if (confirm(`Cancel subscription? You have ${trialDaysLeft} days remaining on your pro-rata balance.`)) {
                                            alert("Subscription cancelled. Your access will remain active until the end of the period.");
                                        }
                                    }}
                                    variant="ghost"
                                    className="h-9 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-red-500 hover:bg-red-500/5 px-4"
                                >
                                    Cancel Plan
                                </Button>
                            ) : null}
                        </div>
                    </div>
                    {isPro ? (
                        <Button
                            onClick={() => window.open('https://billing.illumi.co.za', '_blank')}
                            className="bg-white text-black hover:bg-neutral-200 h-12 px-8 font-black uppercase tracking-tighter text-xs shadow-2xl"
                        >
                            Manage Plan
                        </Button>
                    ) : (
                        <div className="flex flex-col items-end gap-2">
                            <PayFastSubscribeButton />
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-2">Secure monthly billing</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Methods */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Payment Methods</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] font-bold uppercase tracking-widest text-[#878787] hover:text-white px-0"
                            onClick={() => setIsAddCardOpen(true)}
                        >
                            <IconPlus size={14} className="mr-1" />
                            Add New
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {billingMethods.length === 0 && (
                            <div className="p-8 border border-white/5 border-dashed rounded-xl bg-[#09090b] text-center">
                                <p className="text-sm text-neutral-500">No payment methods added.</p>
                            </div>
                        )}
                        {billingMethods.map((card) => (
                            <div
                                key={card.id}
                                className={cn(
                                    "p-4 rounded-xl border transition-all flex items-center justify-between group",
                                    card.isDefault ? "border-white/20 bg-white/5" : "border-white/5 bg-[#09090b] hover:bg-white/[0.02]"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 rounded bg-black border border-white/10 flex items-center justify-center">
                                        <IconCreditCard size={18} className="text-neutral-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                                            <span>{card.brand} •••• {card.last4}</span>
                                            {card.isDefault && (
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-white border border-white/20 px-1.5 py-0.5 rounded">Active</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-neutral-500">Expires {card.expMonth}/{card.expYear}</p>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white group-hover:opacity-100 opacity-0 transition-opacity">
                                            <IconDots size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#09090b] border-white/10 text-white p-2 rounded-xl">
                                        {!card.isDefault && (
                                            <DropdownMenuItem
                                                onClick={() => setDefaultCard(card.id)}
                                                className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer text-xs font-bold"
                                            >
                                                Make Default
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onClick={() => removeCard(card.id)}
                                            className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer text-xs font-bold"
                                        >
                                            <IconTrash size={14} className="mr-2" />
                                            Remove Card
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Billing History / Details */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Billing History</h3>
                    <div className="border border-white/5 rounded-xl bg-[#09090b] divide-y divide-white/5">
                        <div className="p-4 flex items-center justify-between group hover:bg-white/[0.01] transition-colors cursor-pointer">
                            <div>
                                <p className="text-xs font-bold text-white">PRO_SUBSCRIPTION_JAN_2024</p>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">Jan 15, 2024 • ZAR 299.00</p>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">Receipt</span>
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em]">No further history</p>
                        </div>
                    </div>
                </div>
            </div>

            <AddCardModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
                onSave={handleAddCard}
            />
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
