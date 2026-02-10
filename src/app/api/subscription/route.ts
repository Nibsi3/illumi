import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

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

        // No subscription found = free tier
        return NextResponse.json(
            {
                success: true,
                subscription: {
                    tier: 'free',
                    status: 'trial',
                    expires_at: null,
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
