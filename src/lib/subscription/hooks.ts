"use client"

import { useState, useEffect } from "react"
import { SubscriptionTier, hasFeatureAccess, getTierLimits, isWithinLimit, TierLimits } from "./tiers"

/**
 * Hook to get current user's subscription tier
 * TODO: Replace with actual user data from database/auth
 */
export function useSubscription() {
    const [tier, setTier] = useState<SubscriptionTier>("free")
    const [isLoading, setIsLoading] = useState(true)
    const [trialDaysLeft, setTrialDaysLeft] = useState(11)

    useEffect(() => {
        // TODO: Fetch actual subscription data from database
        // Setting to free by default so we can test the subscription flow
        setTier("free")
        setIsLoading(false)
    }, [])

    return {
        tier,
        isLoading,
        trialDaysLeft,
        isPro: tier === "pro",
        isFree: tier === "free",
        limits: getTierLimits(tier),
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
