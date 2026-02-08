import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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
    return createClient(url, serviceKey)
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const workspaceId = searchParams.get('workspace_id')

        const service = getServiceClient()

        // Get all subscriptions
        const { data: allSubs, error: allError } = await service
            .from('subscriptions')
            .select('id, workspace_id, user_id, tier, status, started_at, expires_at')
            .limit(10)

        // Get specific subscription if workspace_id provided
        let specificSub = null
        if (workspaceId) {
            const { data } = await service
                .from('subscriptions')
                .select('id, workspace_id, user_id, tier, status, started_at, expires_at')
                .eq('workspace_id', workspaceId)
                .single()
            specificSub = data
        }

        return NextResponse.json({
            success: true,
            allSubscriptions: allSubs,
            allError: allError?.message,
            specificSubscription: specificSub,
        })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
