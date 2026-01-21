import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        throw new Error(
            "Missing Supabase service role credentials. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and one of: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_ROLE_SECRET, SUPABASE_SERVICE_ROLE, SUPABASE_SERVICE_KEY, SERVICE_ROLE_KEY"
        )
    }

    return createServiceClient(url, serviceKey)
}

export async function GET() {
    try {
        // Ensure user is logged in (cookie-based session)
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const userEmail = (user.email || "").toLowerCase().trim()
        if (!userEmail) {
            return NextResponse.json({ success: false, error: "Unable to verify your email address." }, { status: 400 })
        }

        const service = getServiceClient()

        // Run owned workspaces and member rows queries in parallel
        const [ownedRes, memberRes] = await Promise.all([
            service
                .from("workspaces")
                .select("*")
                .eq("owner_id", user.id)
                .order("created_at", { ascending: true }),
            service
                .from("workspace_members")
                .select("workspace_id, status")
                .eq("email", userEmail),
        ])

        if (ownedRes.error) {
            return NextResponse.json({ success: false, error: ownedRes.error.message }, { status: 500 })
        }
        if (memberRes.error) {
            return NextResponse.json({ success: false, error: memberRes.error.message }, { status: 500 })
        }

        const ownedWorkspaces = ownedRes.data || []

        const memberWorkspaceIds = (memberRes.data || [])
            .filter((r: any) => Boolean(r.workspace_id) && (r.status || "").toString().toLowerCase() === "active")
            .map((r: any) => r.workspace_id)

        const { data: memberWorkspaces, error: memberWsError } = memberWorkspaceIds.length
            ? await service
                .from("workspaces")
                .select("*")
                .in("id", memberWorkspaceIds)
            : { data: [], error: null }

        if (memberWsError) {
            return NextResponse.json({ success: false, error: memberWsError.message }, { status: 500 })
        }

        const combined = [...(ownedWorkspaces || []), ...((memberWorkspaces as any[]) || [])]
        const deduped = Array.from(new Map(combined.map((w: any) => [w.id, w])).values())
            .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

        return NextResponse.json({ success: true, workspaces: deduped }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to load workspaces." },
            { status: 500 }
        )
    }
}
