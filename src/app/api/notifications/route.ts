import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: Fetch notifications for current user
export async function GET(req: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unread") === "true"

    let query = supabase
        .from("notifications")
        .select("*, invoices(invoice_number, total, currency)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit)

    if (unreadOnly) {
        query = query.eq("read", false)
    }

    const { data, error } = await query

    if (error) {
        console.error("[Notifications API] Error:", error)
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    return NextResponse.json({ notifications: data || [] })
}

// PATCH: Mark notifications as read
export async function PATCH(req: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { ids, markAll } = await req.json()

        if (markAll) {
            const { error } = await supabase
                .from("notifications")
                .update({ read: true })
                .eq("user_id", user.id)
                .eq("read", false)

            if (error) throw error
        } else if (ids && Array.isArray(ids)) {
            const { error } = await supabase
                .from("notifications")
                .update({ read: true })
                .eq("user_id", user.id)
                .in("id", ids)

            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[Notifications API] Error:", error)
        return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
    }
}

// DELETE: Delete notifications
export async function DELETE(req: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { ids } = await req.json()

        if (ids && Array.isArray(ids)) {
            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("user_id", user.id)
                .in("id", ids)

            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[Notifications API] Error:", error)
        return NextResponse.json({ error: "Failed to delete notifications" }, { status: 500 })
    }
}
