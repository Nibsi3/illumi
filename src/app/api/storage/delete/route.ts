import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { deleteFromR2 } from "@/lib/r2-storage"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { key } = body

        if (!key) {
            return NextResponse.json({ success: false, error: "No key provided" }, { status: 400 })
        }

        // Extract workspace ID from key (format: workspaceId/folder/filename)
        const workspaceId = key.split("/")[0]

        if (workspaceId) {
            // Verify user has access to this workspace (must be owner to delete)
            const { data: workspace } = await supabase
                .from("workspaces")
                .select("id")
                .eq("id", workspaceId)
                .eq("owner_id", user.id)
                .single()

            if (!workspace) {
                return NextResponse.json({ success: false, error: "Access denied - only workspace owner can delete files" }, { status: 403 })
            }
        }

        await deleteFromR2(key)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Delete error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Delete failed" },
            { status: 500 }
        )
    }
}
