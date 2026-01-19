import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient as createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        throw new Error("Missing RESEND_API_KEY")
    }
    return new Resend(apiKey)
}

// POST: verify a domain { id }
export async function POST(req: Request) {
    try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const id = typeof body?.id === "string" ? body.id.trim() : ""

        if (!id) {
            return NextResponse.json({ success: false, error: "Missing domain id" }, { status: 400 })
        }

        const resend = getResendClient()
        const verified = await resend.domains.verify(id)

        return NextResponse.json({ success: true, domain: verified })
    } catch (error: any) {
        console.error("[Resend Domains Verify] Error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to verify domain" },
            { status: 500 }
        )
    }
}
