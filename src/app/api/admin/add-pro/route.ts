import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
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
    return createClient(url, serviceKey)
}

// POST: Add Pro subscription to a workspace
// For dev/testing: just provide workspace_id
export async function POST(req: Request) {
    try {
        const { workspace_id } = await req.json()

        if (!workspace_id) {
            return NextResponse.json({ success: false, error: "Missing workspace_id" }, { status: 400 })
        }

        const service = getServiceClient()

        // Get workspace to find owner
        const { data: workspace, error: wsError } = await service
            .from('workspaces')
            .select('id, name, owner_id')
            .eq('id', workspace_id)
            .single()

        if (wsError || !workspace) {
            return NextResponse.json({ success: false, error: "Workspace not found" }, { status: 404 })
        }

        console.log('[Admin Add Pro] Adding Pro for workspace:', workspace.name, 'owner:', workspace.owner_id)

        const now = new Date()
        const expiresAt = new Date(now)
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)

        const { data, error } = await service
            .from('subscriptions')
            .upsert({
                workspace_id,
                user_id: workspace.owner_id,
                tier: 'pro',
                status: 'active',
                started_at: now.toISOString(),
                expires_at: expiresAt.toISOString(),
                updated_at: now.toISOString(),
            }, { onConflict: 'workspace_id' })
            .select()

        if (error) {
            console.error('[Admin Add Pro] Error:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, subscription: data })
    } catch (err: any) {
        console.error('[Admin Add Pro] Error:', err)
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
