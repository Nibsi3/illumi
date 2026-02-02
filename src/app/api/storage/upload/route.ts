import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { uploadToR2, generateFileKey } from "@/lib/r2-storage"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File | null
        const workspaceId = formData.get("workspaceId") as string | null
        const folder = formData.get("folder") as "logos" | "invoices" | "attachments" | "receipts" | null

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
        }

        if (!workspaceId) {
            return NextResponse.json({ success: false, error: "No workspace ID provided" }, { status: 400 })
        }

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

        // Read file content
        const buffer = Buffer.from(await file.arrayBuffer())
        const key = generateFileKey(workspaceId, folder || "attachments", file.name)

        // Upload to R2
        const result = await uploadToR2(key, buffer, {
            contentType: file.type,
            metadata: {
                originalName: file.name,
                uploadedBy: user.id,
            },
        })

        return NextResponse.json({
            success: true,
            key: result.key,
            url: result.url,
        })
    } catch (error: any) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Upload failed" },
            { status: 500 }
        )
    }
}
