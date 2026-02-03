import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { uploadToR2, generateFileKey } from "@/lib/r2-storage"

export const runtime = "nodejs"

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        throw new Error("Missing Supabase service role credentials")
    }

    return createServiceClient(url, serviceKey)
}

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

        const userEmail = (user.email || '').toLowerCase().trim()

        // Verify user has access to this workspace
        const { data: membership } = await supabase
            .from("workspace_members")
            .select("id")
            .eq("workspace_id", workspaceId)
            .eq("email", userEmail)
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
        const resolvedFolder = (folder || "attachments")

        // Upload to R2 (preferred)
        try {
            const key = generateFileKey(workspaceId, resolvedFolder, file.name)
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
        } catch (e: any) {
            const message = (e?.message || '').toString()

            // Fallback for logos when R2 isn't configured
            if (resolvedFolder === 'logos' && message.toLowerCase().includes('r2 credentials not configured')) {
                const service = getServiceClient()
                const fileExt = (file.name.split('.').pop() || 'png').toLowerCase()
                const objectPath = `${workspaceId}/logo.${fileExt}`

                const { error: uploadError } = await service.storage
                    .from('logos')
                    .upload(objectPath, buffer, {
                        contentType: file.type || 'application/octet-stream',
                        upsert: true,
                    })

                if (uploadError) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: uploadError.message || 'Logo upload failed (storage)',
                        },
                        { status: 500 }
                    )
                }

                const { data: pub } = service.storage.from('logos').getPublicUrl(objectPath)
                const publicUrl = pub?.publicUrl

                if (!publicUrl) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Logo uploaded but public URL could not be generated. Ensure the "logos" bucket is public.',
                        },
                        { status: 500 }
                    )
                }

                return NextResponse.json({
                    success: true,
                    key: objectPath,
                    url: publicUrl,
                    storage: 'supabase',
                })
            }

            throw e
        }
    } catch (error: any) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Upload failed" },
            { status: 500 }
        )
    }
}
