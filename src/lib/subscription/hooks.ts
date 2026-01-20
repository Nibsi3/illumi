"use client"

import { useState, useEffect } from "react"
import { SubscriptionTier, hasFeatureAccess, getTierLimits, isWithinLimit, TierLimits } from "./tiers"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"

interface Subscription {
    id: string
    workspace_id: string
    user_id: string
    tier: SubscriptionTier
    status: 'active' | 'cancelled' | 'expired' | 'trial'
    started_at: string
    expires_at: string | null
}

/**
 * Hook to get current user's subscription tier
 * Fetches real subscription data from the database
 */
export function useSubscription() {
    const [tier, setTier] = useState<SubscriptionTier>("free")
    const [isLoading, setIsLoading] = useState(true)
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null)
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [isSubscribed, setIsSubscribed] = useState(false)
    
    const supabase = createClient()
    const { activeWorkspace, isOwner, userId } = useWorkspace()

    useEffect(() => {
        async function fetchSubscription() {
            if (!activeWorkspace) {
                setIsLoading(false)
                return
            }

            try {
                // First check if user is in the forced Pro list
                const { data: { user } } = await supabase.auth.getUser()
                const forcedProEmails = ['cameronfalck03@gmail.com']
                
                if (user?.email && forcedProEmails.includes(user.email.toLowerCase())) {
                    // Force Pro subscription for specific users
                    setTier("pro")
                    setIsSubscribed(true)
                    setDaysRemaining(null) // Unlimited
                    setIsLoading(false)
                    return
                }

                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('workspace_id', activeWorkspace.id)
                    .single()

                // PGRST116 = no rows found, which is expected for free users
                // 42P01 = table doesn't exist
                // PGRST205 = table/view not found in schema cache
                // 42501 = insufficient privilege (RLS / perms)
                const errorCode = (error as any)?.code
                const isExpectedError =
                    errorCode === 'PGRST116' ||
                    errorCode === '42P01' ||
                    errorCode === 'PGRST205' ||
                    errorCode === '42501'

                if (error && !isExpectedError) {
                    const safeError = {
                        message: (error as any)?.message,
                        details: (error as any)?.details,
                        hint: (error as any)?.hint,
                        code: (error as any)?.code,
                        name: (error as any)?.name,
                    }
                    console.error('Error fetching subscription:', safeError)
                }

                if (data) {
                    setSubscription(data)
                    setTier(data.tier as SubscriptionTier)
                    setIsSubscribed(data.tier === 'pro' && data.status === 'active')
                    
                    // Calculate days remaining
                    if (data.expires_at) {
                        const expiresAt = new Date(data.expires_at)
                        const now = new Date()
                        const diffTime = expiresAt.getTime() - now.getTime()
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                        setDaysRemaining(Math.max(0, diffDays))
                    } else {
                        setDaysRemaining(null)
                    }
                } else {
                    // No subscription found, default to free
                    setTier("free")
                    setIsSubscribed(false)
                    setDaysRemaining(null)
                }
            } catch (error) {
                const safeError = {
                    message: (error as any)?.message,
                    name: (error as any)?.name,
                }
                console.error('Error fetching subscription:', safeError)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSubscription()
    }, [activeWorkspace, supabase])

    // Pro benefits only apply if user is the workspace owner
    // Members get access to workspace features but cannot "own" Pro status
    const effectiveTier: SubscriptionTier = isOwner ? tier : "free"
    const effectiveIsPro = isOwner && tier === "pro"

    return {
        tier: effectiveTier,
        isLoading,
        daysRemaining: isOwner ? daysRemaining : null,
        subscription: isOwner ? subscription : null,
        isSubscribed: effectiveIsPro,
        isPro: effectiveIsPro,
        isFree: !effectiveIsPro,
        limits: getTierLimits(effectiveTier),
        isOwner,
    }
}

/**
 * Hook to check if user has access to a specific feature
 */
export function useFeatureAccess(feature: keyof TierLimits["features"]) {
    const { tier, isLoading } = useSubscription()

    return {
        hasAccess: hasFeatureAccess(tier, feature),
        isLoading,
        tier,
    }
}

/**
 * Hook to check usage limits
 */
export function useUsageLimit(
    limitType: keyof Omit<TierLimits, "features">,
    currentUsage: number
) {
    const { tier, limits, isLoading } = useSubscription()

    const limit = limits[limitType]
    const isWithin = isWithinLimit(tier, limitType, currentUsage)
    const percentage = (currentUsage / (limit as number)) * 100

    return {
        limit,
        currentUsage,
        isWithin,
        percentage,
        remaining: (limit as number) - currentUsage,
        isLoading,
    }
}

/**
 * Hook to check if user can perform an action based on limits
 */
export function useCanPerformAction(
    limitType: keyof Omit<TierLimits, "features">,
    currentUsage: number
) {
    const { isWithin, limit } = useUsageLimit(limitType, currentUsage)

    return {
        canPerform: isWithin,
        limit,
        currentUsage,
    }
}
