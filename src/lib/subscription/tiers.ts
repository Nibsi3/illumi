/**
 * Subscription Tier Definitions
 * 
 * Starter (Free Forever):
 * - Unlimited invoices
 * - Client database
 * - Product catalog
 * - WhatsApp & Email sharing
 * - PDF Exports
 * - Basic reporting
 * 
 * Pro (R350/month):
 * - Everything in Starter
 * - Custom business logo
 * - PayGate integration
 * - Client payment portal
 * - Recurring invoices
 * - Automated status updates
 * - Priority support
 */

export type SubscriptionTier = "free" | "pro"

export interface TierLimits {
    invoicesPerMonth: number
    connectedBanks: number
    inboxItemsPerMonth: number
    vaultStorageGB: number
    maxUsers: number
    features: {
        // Pro-only features
        customLogo: boolean
        payGateIntegration: boolean
        clientPortal: boolean
        recurringInvoices: boolean
        automatedStatusUpdates: boolean
        prioritySupport: boolean
        // Legacy feature names (kept for compatibility)
        recurringPayments: boolean
        customPayGate: boolean
        advancedReporting: boolean
    }
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
    free: {
        // Starter plan - Free Forever
        invoicesPerMonth: Infinity, // Unlimited invoices
        connectedBanks: 0, // No bank connections for free
        inboxItemsPerMonth: Infinity,
        vaultStorageGB: 5,
        maxUsers: 1, // Owner only, no team members
        features: {
            // Pro-only features - all disabled for free
            customLogo: false,
            payGateIntegration: false,
            clientPortal: false,
            recurringInvoices: false,
            automatedStatusUpdates: false,
            prioritySupport: false,
            // Legacy
            recurringPayments: false,
            customPayGate: false,
            advancedReporting: false,
        },
    },
    pro: {
        // Pro plan - R350/month
        invoicesPerMonth: Infinity,
        connectedBanks: 10,
        inboxItemsPerMonth: Infinity,
        vaultStorageGB: 100,
        maxUsers: 5, // Owner + 4 team members
        features: {
            // All Pro features enabled
            customLogo: true,
            payGateIntegration: true,
            clientPortal: true,
            recurringInvoices: true,
            automatedStatusUpdates: true,
            prioritySupport: true,
            // Legacy
            recurringPayments: true,
            customPayGate: true,
            advancedReporting: true,
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
