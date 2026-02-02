import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSignedDownloadUrl, getSignedUploadUrl } from "@/lib/r2-storage"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { key, type, contentType, expiresIn } = body

        if (!key) {
            return NextResponse.json({ success: false, error: "No key provided" }, { status: 400 })
        }

        // Extract workspace ID from key (format: workspaceId/folder/filename)
        const workspaceId = key.split("/")[0]

        if (workspaceId) {
            // Verify user has access to this workspace
            const { data: membership } = await supabase
                .from("workspace_members")
                .select("id")
                .eq("workspace_id", workspaceId)
                .eq("email", user.email)
                .single()

            const { data: workspace } = await supabase
                .from("workspaces")
                .select("id")
                .eq("id", workspaceId)
                .eq("owner_id", user.id)
                .single()

            if (!membership && !workspace) {
                return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 })
            }
        }

        let signedUrl: string

        if (type === "upload") {
            if (!contentType) {
                return NextResponse.json({ success: false, error: "Content type required for upload" }, { status: 400 })
            }
            signedUrl = await getSignedUploadUrl(key, contentType, expiresIn || 3600)
        } else {
            signedUrl = await getSignedDownloadUrl(key, expiresIn || 3600)
        }

        return NextResponse.json({
            success: true,
            signedUrl,
        })
    } catch (error: any) {
        console.error("Signed URL error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to generate signed URL" },
            { status: 500 }
        )
    }
}
