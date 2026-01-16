/**
 * Subscription Tier Definitions
 * Defines the feature limits and capabilities for Free and Pro tiers
 */

export type SubscriptionTier = "free" | "pro"

export interface TierLimits {
    invoicesPerMonth: number
    connectedBanks: number
    inboxItemsPerMonth: number
    vaultStorageGB: number
    maxUsers: number
    features: {
        recurringPayments: boolean
        clientPortal: boolean
        customPayGate: boolean
        advancedReporting: boolean
        prioritySupport: boolean
    }
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
    free: {
        invoicesPerMonth: 10,
        connectedBanks: 2,
        inboxItemsPerMonth: 50,
        vaultStorageGB: 10,
        maxUsers: 2,
        features: {
            recurringPayments: false,
            clientPortal: false,
            customPayGate: false,
            advancedReporting: false,
            prioritySupport: false,
        },
    },
    pro: {
        invoicesPerMonth: 50,
        connectedBanks: 10,
        inboxItemsPerMonth: 500,
        vaultStorageGB: 100,
        maxUsers: 10,
        features: {
            recurringPayments: true,
            clientPortal: true,
            customPayGate: true,
            advancedReporting: true,
            prioritySupport: true,
        },
    },
}

/**
 * Check if a feature is available for a given tier
 */
export function hasFeatureAccess(
    tier: SubscriptionTier,
    feature: keyof TierLimits["features"]
): boolean {
    return TIER_LIMITS[tier].features[feature]
}

/**
 * Get the limits for a specific tier
 */
export function getTierLimits(tier: SubscriptionTier): TierLimits {
    return TIER_LIMITS[tier]
}

/**
 * Check if usage is within tier limits
 */
export function isWithinLimit(
    tier: SubscriptionTier,
    limitType: keyof Omit<TierLimits, "features">,
    currentUsage: number
): boolean {
    const limit = TIER_LIMITS[tier][limitType]
    return currentUsage < limit
}
