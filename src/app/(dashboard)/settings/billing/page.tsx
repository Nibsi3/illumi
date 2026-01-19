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
    IconReceipt,
    IconX,
    IconLock,
    IconSparkles
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { AddCardModal } from "./components/add-card-modal"
import { PayFastSubscribeButton } from "./components/payfast-subscribe"
import { useSettings } from "@/lib/settings-context"
import { useWorkspace } from "@/lib/workspace-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { format } from "date-fns"

interface BillingHistoryItem {
    id: string
    description: string
    date: string
    amount: number
    status: string
}

function BillingContent() {
    const searchParams = useSearchParams()
    const plan = searchParams.get("plan")
    const { isPro, daysRemaining, subscription } = useSubscription()
    const { billingMethods, setBillingMethods, currency } = useSettings()
    const { activeWorkspace } = useWorkspace()
    const [selectedPlan, setSelectedPlan] = useState<string | null>(plan)
    const [isAddCardOpen, setIsAddCardOpen] = useState(false)
    const [isManagePlanOpen, setIsManagePlanOpen] = useState(false)
    const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    
    const supabase = createClient()

    useEffect(() => {
        if (plan) {
            setSelectedPlan(plan)
        }
    }, [plan])
    
    // Fetch billing history from subscription payments only
    useEffect(() => {
        async function fetchBillingHistory() {
            if (!activeWorkspace) {
                setIsLoadingHistory(false)
                return
            }
            
            try {
                // Fetch subscription payment history (not customer invoices)
                const { data: payments } = await supabase
                    .from('subscription_payments')
                    .select('id, payment_date, amount, status, description')
                    .eq('workspace_id', activeWorkspace.id)
                    .order('payment_date', { ascending: false })
                    .limit(10)
                
                if (payments && payments.length > 0) {
                    const history: BillingHistoryItem[] = payments.map(payment => ({
                        id: payment.id,
                        description: payment.description || 'Pro Subscription',
                        date: payment.payment_date,
                        amount: payment.amount || 350,
                        status: payment.status || 'paid'
                    }))
                    setBillingHistory(history)
                } else {
                    // No subscription payments yet - show empty state
                    setBillingHistory([])
                }
            } catch (error) {
                // Table might not exist yet, show empty state
                console.error('Error fetching billing history:', error)
                setBillingHistory([])
            } finally {
                setIsLoadingHistory(false)
            }
        }
        
        fetchBillingHistory()
    }, [activeWorkspace, supabase])

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
        // Check for duplicate cards (same last4 and expiry)
        const isDuplicate = billingMethods.some(
            existing => existing.last4 === card.last4 && 
                        existing.expMonth === card.expMonth && 
                        existing.expYear === card.expYear
        )
        
        if (isDuplicate) {
            toast.error("Card already exists", { description: "This card has already been added to your account." })
            return
        }
        
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
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{daysRemaining} days remaining</span>
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
                                        const confirmed = window.confirm(
                                            `Are you sure you want to cancel your subscription?\n\nYou have ${daysRemaining ?? 0} days remaining. Your Pro features will remain active until the end of your billing period.`
                                        )
                                        if (confirmed) {
                                            // TODO: Implement actual PayFast subscription cancellation API call
                                            toast.success("Subscription cancelled", {
                                                description: `Your Pro access will remain active for ${daysRemaining ?? 0} more days.`
                                            })
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
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                                <IconCircleCheckFilled size={16} className="text-emerald-500" />
                                <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Subscribed</span>
                            </div>
                            <Button
                                onClick={() => setIsManagePlanOpen(true)}
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 h-10 px-6 font-bold uppercase tracking-tighter text-xs"
                            >
                                Manage Plan
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-end gap-3">
                            <PayFastSubscribeButton />
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Secure monthly billing via PayFast</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Payment Methods */}
                <div className="space-y-6 flex flex-col">
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

                    <div className="space-y-3 flex-1">
                        {billingMethods.length === 0 && (
                            <div className="p-8 border border-white/5 border-dashed rounded-xl bg-[#09090b] text-center min-h-[96px] flex items-center justify-center">
                                <p className="text-sm text-neutral-500">No payment methods added.</p>
                            </div>
                        )}
                        {billingMethods.map((card) => (
                            <div
                                key={card.id}
                                className={cn(
                                    "p-4 rounded-xl border transition-all flex items-center justify-between group",
                                    card.isDefault ? "border-white/20 bg-white/5" : "border-white/5 bg-[#09090b] hover:bg-white/2"
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
                                        {/* Can only remove card if it's not default OR if there are other cards */}
                                        {(!card.isDefault || billingMethods.length > 1) && (
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    if (card.isDefault && billingMethods.length > 1) {
                                                        toast.error("Please set another card as default first")
                                                        return
                                                    }
                                                    removeCard(card.id)
                                                }}
                                                className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer text-xs font-bold"
                                            >
                                                <IconTrash size={14} className="mr-2" />
                                                Remove Card
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Billing History / Details */}
                <div className="space-y-6 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Billing History</h3>
                        <div className="h-6" />
                    </div>
                    <div className="border border-white/5 rounded-xl bg-[#09090b] divide-y divide-white/5 flex-1">
                        {isLoadingHistory ? (
                            <div className="p-8 text-center min-h-[96px] flex items-center justify-center">
                                <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em]">Loading...</p>
                            </div>
                        ) : billingHistory.length > 0 ? (
                            <>
                                {billingHistory.map((item) => (
                                    <div 
                                        key={item.id}
                                        className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-white">{item.description}</p>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">
                                                {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'N/A'} • {currency} {item.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Paid</span>
                                    </div>
                                ))}
                                {billingHistory.length < 10 && (
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em]">End of history</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-8 text-center min-h-[96px] flex items-center justify-center">
                                <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em]">No billing history yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddCardModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
                onSave={handleAddCard}
            />

            {/* Manage Plan Modal */}
            <Dialog open={isManagePlanOpen} onOpenChange={setIsManagePlanOpen}>
                <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <IconSparkles className="w-5 h-5 text-white" />
                            Manage Subscription
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        {/* Current Plan Status */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-white">Current Plan</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">Pro Plan</p>
                            <p className="text-sm text-neutral-400">R350/month • Renews automatically</p>
                        </div>

                        {/* Billing Info */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Billing Details</h4>
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                                <span className="text-sm text-neutral-400">Next billing date</span>
                                <span className="text-sm font-medium text-white">
                                    {subscription?.expires_at 
                                        ? format(new Date(subscription.expires_at), 'MMM dd, yyyy')
                                        : daysRemaining !== null 
                                            ? `In ${daysRemaining} days` 
                                            : 'Active (no expiry)'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                                <span className="text-sm text-neutral-400">Payment method</span>
                                <span className="text-sm font-medium text-white">
                                    {billingMethods.find(c => c.isDefault)?.brand || 'None'} •••• {billingMethods.find(c => c.isDefault)?.last4 || '----'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-neutral-400">Amount</span>
                                <span className="text-sm font-medium text-white">R350.00/mo</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                onClick={() => {
                                    setIsManagePlanOpen(false)
                                    setIsAddCardOpen(true)
                                }}
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/5 h-11"
                            >
                                <IconCreditCard className="w-4 h-4 mr-2" />
                                Update Payment Method
                            </Button>
                            <Button
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Are you sure you want to cancel your subscription?\n\nYou have ${daysRemaining ?? 0} days remaining. Your Pro features will remain active until the end of your billing period.`
                                    )
                                    if (confirmed) {
                                        toast.success("Subscription cancelled", {
                                            description: `Your Pro access will remain active for ${daysRemaining ?? 0} more days.`
                                        })
                                        setIsManagePlanOpen(false)
                                    }
                                }}
                                variant="ghost"
                                className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 h-11"
                            >
                                <IconX className="w-4 h-4 mr-2" />
                                Cancel Subscription
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Pricing Comparison Section */}
            <div className="mt-12 pt-12 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-2">Compare Plans</h2>
                <p className="text-neutral-500 mb-8">Choose the plan that works best for your business</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Starter Plan */}
                    <div className={cn(
                        "p-6 rounded-2xl border transition-all",
                        !isPro ? "border-white/20 bg-white/5" : "border-white/5 bg-[#09090b]"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Starter</h3>
                            {!isPro && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 px-2 py-1 rounded">Current</span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">Free</p>
                        <p className="text-sm text-neutral-500 mb-6">Forever</p>
                        
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Unlimited invoices
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Client database
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Product catalog
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                WhatsApp & Email sharing
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                PDF Exports
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Basic reporting
                            </li>
                        </ul>
                        
                        {!isPro && (
                            <Button disabled className="w-full bg-white/10 text-white cursor-default">
                                Current Plan
                            </Button>
                        )}
                    </div>

                    {/* Pro Plan */}
                    <div className={cn(
                        "p-6 rounded-2xl border transition-all relative overflow-hidden",
                        isPro ? "border-white/20 bg-white/5" : "border-white/5 bg-[#09090b]"
                    )}>
                        <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                            Popular
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Pro</h3>
                            {isPro && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Current</span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">R350</p>
                        <p className="text-sm text-neutral-500 mb-6">per month</p>
                        
                        <p className="text-xs text-neutral-400 mb-4">Everything in Starter, plus:</p>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Custom business logo
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                PayGate integration
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Client payment portal
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Recurring invoices
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Automated status updates
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-300">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Priority support
                            </li>
                        </ul>
                        
                        {isPro ? (
                            <Button 
                                onClick={() => setIsManagePlanOpen(true)}
                                variant="outline" 
                                className="w-full border-white/10 hover:bg-white/5"
                            >
                                Manage Plan
                            </Button>
                        ) : (
                            <PayFastSubscribeButton />
                        )}
                    </div>
                </div>
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
