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

            if (!activeWorkspace) {
                setIsLoading(false)
                return
            }

            // Fast path: use cached subscription status to avoid "paid user" flicker on refresh.
            // Still fetch in background to keep DB as source of truth.
            applyFromCache()

            const tFetchStart = perfEnabled ? markStart() : 0
            try {
                // First check if user is in the forced Pro list
                const tSessionStart = perfEnabled ? markStart() : 0
                const { data: sessionData } = await supabase.auth.getSession()
                if (perfEnabled) console.log(`subscription:auth.getSession: ${markEnd(tSessionStart)} ms`)
                const user = sessionData?.session?.user || null
                const forcedProEmails = ['cameronfalck03@gmail.com']
                
                const emailForForcedCheck = (userEmail || user?.email || '').toLowerCase()
                if (emailForForcedCheck && forcedProEmails.includes(emailForForcedCheck)) {
                    // Force Pro subscription for specific users
                    setTier("pro")
                    setIsSubscribed(true)
                    setDaysRemaining(null) // Unlimited
                    setIsLoading(false)

                    // Update cache
                    if (cacheKey) {
                        try {
                            localStorage.setItem(cacheKey, JSON.stringify({
                                id: 'forced',
                                workspace_id: activeWorkspace.id,
                                user_id: user?.id || userId || '',
                                userId: userId || user?.id || '',
                                tier: 'pro',
                                status: 'active',
                                started_at: new Date().toISOString(),
                                expires_at: null,
                                updatedAt: Date.now(),
                            }))
                        } catch {
                            // ignore cache errors
                        }
                    }
                    return
                }

                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('id, workspace_id, user_id, tier, status, started_at, expires_at')
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
                    // No subscription found, default to free
                    setTier("free")
                    setIsSubscribed(false)
                    setDaysRemaining(null)

                    // Cache free to prevent repeated re-check flicker
                    if (cacheKey) {
                        try {
                            localStorage.setItem(cacheKey, JSON.stringify({
                                id: null,
                                workspace_id: activeWorkspace.id,
                                user_id: user?.id || userId || null,
                                userId: userId || user?.id || null,
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
