"use client"

import { useState, useEffect } from "react"
import { SubscriptionTier, hasFeatureAccess, getTierLimits, isWithinLimit, TierLimits } from "./tiers"
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
    const [isTrial, setIsTrial] = useState(false)
    const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null)
    const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)
    
    const { activeWorkspace, isOwner, userId, userEmail } = useWorkspace()

    useEffect(() => {
        async function fetchSubscription() {
            let perfEnabled = false
            try {
                perfEnabled = localStorage.getItem('illumi_perf') === '1'
            } catch {
                perfEnabled = false
            }

            const markStart = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
            const markEnd = (start: number) => (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start

            const CACHE_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours
            const cacheKey = activeWorkspace?.id ? `illumi_subscription_cache:${activeWorkspace.id}` : null
            const applyFromCache = () => {
                if (!cacheKey) return false
                try {
                    const raw = localStorage.getItem(cacheKey)
                    if (!raw) return false
                    const parsed = JSON.parse(raw)
                    if (!parsed || typeof parsed !== 'object') return false
                    if (!parsed.updatedAt || typeof parsed.updatedAt !== 'number') return false
                    if (Date.now() - parsed.updatedAt > CACHE_TTL_MS) return false

                    // Only apply cache if it was created for the same user (defensive)
                    if (userId && parsed.userId && parsed.userId !== userId) return false

                    const cachedTier = (parsed.tier as SubscriptionTier) || 'free'
                    const cachedStatus = (parsed.status as Subscription['status']) || 'trial'
                    const cachedExpiresAt = (parsed.expires_at as string | null) ?? null

                    setTier(cachedTier)
                    setIsSubscribed(cachedTier === 'pro' && cachedStatus === 'active')

                    if (cachedExpiresAt) {
                        const expiresAt = new Date(cachedExpiresAt)
                        const now = new Date()
                        const diffTime = expiresAt.getTime() - now.getTime()
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                        setDaysRemaining(Math.max(0, diffDays))
                    } else {
                        setDaysRemaining(null)
                    }

                    if (cachedTier !== 'free') {
                        setSubscription({
                            id: parsed.id || '',
                            workspace_id: activeWorkspace?.id || '',
                            user_id: parsed.user_id || (userId || ''),
                            tier: cachedTier,
                            status: cachedStatus,
                            started_at: parsed.started_at || '',
                            expires_at: cachedExpiresAt,
                        })
                    }

                    // Important: allow UI to render immediately.
                    setIsLoading(false)
                    return true
                } catch {
                    return false
                }
            }

            // Check forced Pro emails BEFORE workspace check so Pro shows even while loading
            const forcedProEmails = ['cameronfalck03@gmail.com']
            const earlyEmail = (userEmail || '').toLowerCase()
            if (earlyEmail && forcedProEmails.includes(earlyEmail)) {
                setTier("pro")
                setIsSubscribed(true)
                setDaysRemaining(null)
                setIsLoading(false)
                return
            }

            if (!activeWorkspace) {
                setIsLoading(false)
                return
            }

            // Fast path: use cached subscription status to avoid "paid user" flicker on refresh.
            // Still fetch in background to keep DB as source of truth.
            applyFromCache()

            const tFetchStart = perfEnabled ? markStart() : 0
            try {
                // Use cached API route instead of direct Supabase call to reduce egress
                // The API route handles forced Pro emails server-side
                const res = await fetch(`/api/subscription?workspace_id=${activeWorkspace.id}`, {
                    credentials: 'include',
                })
                const json = await res.json().catch(() => null)

                if (!res.ok || !json?.success) {
                    console.error('Error fetching subscription:', json?.error)
                }

                const data = json?.subscription
                if (data && data.tier !== 'free') {
                    setSubscription(data)
                    setTier(data.tier as SubscriptionTier)
                    setIsSubscribed(data.tier === 'pro' && (data.status === 'active' || data.status === 'trial'))
                    
                    // Track trial status
                    const isTrialSub = Boolean(data.is_trial || data.status === 'trial')
                    setIsTrial(isTrialSub)
                    setTrialDaysRemaining(data.trial_days_remaining ?? null)
                    setTrialEndsAt(isTrialSub ? (data.expires_at || null) : null)

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

                    // Cache latest subscription status for fast refresh
                    if (cacheKey) {
                        try {
                            localStorage.setItem(cacheKey, JSON.stringify({
                                id: data.id,
                                workspace_id: data.workspace_id,
                                user_id: data.user_id,
                                userId: userId || data.user_id,
                                tier: data.tier,
                                status: data.status,
                                started_at: data.started_at,
                                expires_at: data.expires_at,
                                updatedAt: Date.now(),
                            }))
                        } catch {
                            // ignore cache errors
                        }
                    }
                } else {
                    // No subscription found or free tier, default to free
                    setTier("free")
                    setIsSubscribed(false)
                    setDaysRemaining(null)
                    setIsTrial(false)
                    setTrialDaysRemaining(null)
                    setTrialEndsAt(null)

                    // Cache free to prevent repeated re-check flicker
                    if (cacheKey) {
                        try {
                            localStorage.setItem(cacheKey, JSON.stringify({
                                id: null,
                                workspace_id: activeWorkspace.id,
                                user_id: userId || null,
                                userId: userId || null,
                                tier: 'free',
                                status: 'trial',
                                started_at: null,
                                expires_at: null,
                                updatedAt: Date.now(),
                            }))
                        } catch {
                            // ignore cache errors
                        }
                    }
                }
            } catch (error) {
                const safeError = {
                    message: (error as any)?.message,
                    name: (error as any)?.name,
                }
                console.error('Error fetching subscription:', safeError)
            } finally {
                setIsLoading(false)
                if (perfEnabled) console.log(`subscription:fetchSubscription: ${markEnd(tFetchStart)} ms`)
            }
        }

        fetchSubscription()
    }, [activeWorkspace, userId, userEmail])

    // Pro benefits only apply if user is the workspace owner
    // Members get access to workspace features but cannot "own" Pro status
    const effectiveTier: SubscriptionTier = isOwner ? tier : "free"
    const effectiveIsPro = isOwner && tier === "pro"
    const effectiveIsTrial = isOwner && isTrial

    return {
        tier: effectiveTier,
        isLoading,
        daysRemaining: isOwner ? daysRemaining : null,
        subscription: isOwner ? subscription : null,
        isSubscribed: effectiveIsPro,
        isPro: effectiveIsPro,
        isFree: !effectiveIsPro,
        isTrial: effectiveIsTrial,
        trialDaysRemaining: isOwner ? trialDaysRemaining : null,
        trialEndsAt: isOwner ? trialEndsAt : null,
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
