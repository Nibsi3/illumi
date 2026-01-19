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

// GET: list domains, or get a specific domain via ?id=<domainId>
export async function GET(req: Request) {
    try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        const resend = getResendClient()

        if (id) {
            const domain = await resend.domains.get(id)
            return NextResponse.json({ success: true, domain })
        }

        const domains = await resend.domains.list()
        return NextResponse.json({ success: true, domains })
    } catch (error: any) {
        console.error("[Resend Domains GET] Error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch domains" },
            { status: 500 }
        )
    }
}

// POST: create domain { name }
export async function POST(req: Request) {
    try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const name = typeof body?.name === "string" ? body.name.trim() : ""

        if (!name) {
            return NextResponse.json({ success: false, error: "Missing domain name" }, { status: 400 })
        }

        const resend = getResendClient()
        const domain = await resend.domains.create({ name })

        return NextResponse.json({ success: true, domain })
    } catch (error: any) {
        console.error("[Resend Domains POST] Error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create domain" },
            { status: 500 }
        )
    }
}

// PATCH: update domain settings { id, openTracking?, clickTracking? }
export async function PATCH(req: Request) {
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
        const updated = await resend.domains.update({
            id,
            openTracking: body?.openTracking,
            clickTracking: body?.clickTracking,
        })

        return NextResponse.json({ success: true, domain: updated })
    } catch (error: any) {
        console.error("[Resend Domains PATCH] Error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update domain" },
            { status: 500 }
        )
    }
}

// DELETE: remove domain via ?id=<domainId> or body { id }
export async function DELETE(req: Request) {
    try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const idFromQuery = searchParams.get("id")

        let id = idFromQuery || ""
        if (!id) {
            try {
                const body = await req.json()
                id = typeof body?.id === "string" ? body.id.trim() : ""
            } catch {
                // ignore
            }
        }

        if (!id) {
            return NextResponse.json({ success: false, error: "Missing domain id" }, { status: 400 })
        }

        const resend = getResendClient()
        const removed = await resend.domains.remove(id)

        return NextResponse.json({ success: true, removed })
    } catch (error: any) {
        console.error("[Resend Domains DELETE] Error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to delete domain" },
            { status: 500 }
        )
    }
}
