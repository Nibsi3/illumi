import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

function parseDbTimestamp(value: any): Date | null {
    if (!value) return null
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
    if (typeof value !== 'string') {
        try {
            const d = new Date(value)
            return Number.isNaN(d.getTime()) ? null : d
        } catch {
            return null
        }
    }

    // Supabase/Postgres often returns timestamptz like: "2026-02-17 16:11:09.814196+00"
    // JS Date parsing can be inconsistent without a 'T'. Normalize to ISO.
    const normalized = value.includes('T') ? value : value.replace(' ', 'T')
    const d = new Date(normalized)
    return Number.isNaN(d.getTime()) ? null : d
}

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY
    )
    if (!serviceKey) {
        throw new Error("Missing Supabase service role key")
    }
    return createServiceClient(url, serviceKey)
}

// Forced Pro emails - these users always get Pro access
const FORCED_PRO_EMAILS = ['cameronfalck03@gmail.com']

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const workspaceId = searchParams.get('workspace_id')

        if (!workspaceId) {
            return NextResponse.json(
                { success: false, error: "workspace_id is required" },
                { status: 400 }
            )
        }

        // Verify user is logged in
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        const userEmail = (user.email || "").toLowerCase().trim()

        // Check forced Pro emails first
        if (FORCED_PRO_EMAILS.includes(userEmail)) {
            return NextResponse.json(
                {
                    success: true,
                    subscription: {
                        tier: 'pro',
                        status: 'active',
                        expires_at: null,
                        is_forced: true,
                    },
                },
                {
                    status: 200,
                    headers: {
                        'Cache-Control': 'private, max-age=3600, stale-while-revalidate=7200',
                    },
                }
            )
        }

        const service = getServiceClient()

        const { data, error } = await service
            .from('subscriptions')
            .select('id, workspace_id, user_id, tier, status, started_at, expires_at')
            .eq('workspace_id', workspaceId)
            .single()

        // Handle expected errors (no subscription = free tier)
        const errorCode = (error as any)?.code
        const isExpectedError = ['PGRST116', '42P01', 'PGRST205', '42501'].includes(errorCode)

        if (error && !isExpectedError) {
            console.error('Error fetching subscription:', error)
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        if (data) {
            return NextResponse.json(
                {
                    success: true,
                    subscription: {
                        id: data.id,
                        workspace_id: data.workspace_id,
                        user_id: data.user_id,
                        tier: data.tier,
                        status: data.status,
                        started_at: data.started_at,
                        expires_at: data.expires_at,
                    },
                },
                {
                    status: 200,
                    headers: {
                        // Cache for 30 minutes, revalidate for up to 1 hour
                        'Cache-Control': 'private, max-age=1800, stale-while-revalidate=3600',
                    },
                }
            )
        }

        // No paid subscription found — check if workspace qualifies for 2-month free Pro trial
        // Try with trial_started_at first, fall back to just created_at if column doesn't exist yet
        let workspace: any = null
        const { data: wsData, error: wsError } = await service
            .from('workspaces')
            .select('created_at, trial_started_at')
            .eq('id', workspaceId)
            .single()

        if (wsError && !wsData) {
            // Column might not exist yet — retry with just created_at
            const { data: wsFallback } = await service
                .from('workspaces')
                .select('created_at')
                .eq('id', workspaceId)
                .single()
            workspace = wsFallback
        } else {
            workspace = wsData
        }

        if (workspace) {
            // Use trial_started_at if set (for existing users who got reset), otherwise fall back to created_at
            const trialStart = workspace.trial_started_at || workspace.created_at

            if (trialStart) {
                const trialStartDate = parseDbTimestamp(trialStart)
                if (!trialStartDate) {
                    console.error('Invalid trialStart timestamp:', trialStart)
                    return NextResponse.json(
                        {
                            success: true,
                            subscription: {
                                tier: 'free',
                                status: 'expired',
                                expires_at: null,
                                is_trial: false,
                            },
                        },
                        {
                            status: 200,
                            headers: {
                                'Cache-Control': 'private, max-age=1800, stale-while-revalidate=3600',
                            },
                        }
                    )
                }
                const trialEnd = new Date(trialStartDate)
                trialEnd.setMonth(trialEnd.getMonth() + 2)
                const now = new Date()

                if (now < trialEnd) {
                    const diffMs = trialEnd.getTime() - now.getTime()
                    const trialDaysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

                    return NextResponse.json(
                        {
                            success: true,
                            subscription: {
                                tier: 'pro',
                                status: 'trial',
                                started_at: trialStart,
                                expires_at: trialEnd.toISOString(),
                                is_trial: true,
                                trial_days_remaining: trialDaysRemaining,
                            },
                        },
                        {
                            status: 200,
                            headers: {
                                'Cache-Control': 'private, max-age=1800, stale-while-revalidate=3600',
                            },
                        }
                    )
                }
            }
        }

        // Trial expired or no workspace found — free tier
        return NextResponse.json(
            {
                success: true,
                subscription: {
                    tier: 'free',
                    status: 'expired',
                    expires_at: null,
                    is_trial: false,
                },
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'private, max-age=1800, stale-while-revalidate=3600',
                },
            }
        )
    } catch (error: any) {
        console.error('Subscription API error:', error)
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to fetch subscription" },
            { status: 500 }
        )
    }
}
