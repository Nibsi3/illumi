import { NextRequest, NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { createClient } from "@/lib/supabase/server"
import { S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "illumi"
const R2_ENDPOINT = process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

function getS3Client(): S3Client {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        throw new Error("R2 credentials not configured")
    }

    return new S3Client({
        region: "auto",
        endpoint: R2_ENDPOINT,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    })
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const key = searchParams.get("key")

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

        const s3 = getS3Client()
        const obj = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))

        const body = obj.Body
        if (!body) {
            return NextResponse.json({ success: false, error: "File not found" }, { status: 404 })
        }

        // Convert Node stream -> Web stream for NextResponse
        const nodeStream = body as any as Readable
        const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream

        const filename = key.split("/").pop() || "download"
        const contentType = (obj.ContentType as string) || "application/octet-stream"

        return new NextResponse(webStream, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename=\"${filename}\"`,
                // safe default: don't cache private downloads
                "Cache-Control": "private, no-store",
            },
        })
    } catch (error: any) {
        console.error("Download error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Download failed" },
            { status: 500 }
        )
    }
}
