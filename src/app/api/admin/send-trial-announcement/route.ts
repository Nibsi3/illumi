import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

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
    return createServiceClient(url, serviceKey)
}

const EXCLUDE_EMAILS = new Set(["cameronfalck03@gmail.com"].map((e) => e.toLowerCase()))

export async function POST(req: Request) {
    try {
        const cronSecret = process.env.CRON_SECRET
        const authHeader = req.headers.get("authorization")

        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json().catch(() => ({}))
        const dryRun = Boolean(body?.dryRun)
        const limit = typeof body?.limit === "number" ? body.limit : null

        const service = getServiceClient()
        const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.illumi.co.za"

        // Gather all workspace owners from workspace_members (public schema)
        const { data: members, error: membersError } = await service
            .from("workspace_members")
            .select("workspace_id, email, role, user_id")

        if (membersError) {
            return NextResponse.json(
                { success: false, error: `Failed to fetch workspace_members: ${membersError.message}` },
                { status: 500 }
            )
        }

        const ownerEmailByWorkspaceId: Record<string, string> = {}
        for (const m of members || []) {
            if (m?.role === "owner" && m?.email && m?.workspace_id) {
                ownerEmailByWorkspaceId[m.workspace_id] = String(m.email).toLowerCase().trim()
            }
        }

        const { data: subscriptions, error: subsError } = await service
            .from("subscriptions")
            .select("workspace_id, tier, status")

        if (subsError) {
            return NextResponse.json(
                { success: false, error: `Failed to fetch subscriptions: ${subsError.message}` },
                { status: 500 }
            )
        }

        const paidProWorkspaceIds = new Set<string>()
        for (const s of subscriptions || []) {
            const tier = String(s?.tier || "").toLowerCase()
            const status = String(s?.status || "").toLowerCase()
            if (tier === "pro" && status === "active" && s?.workspace_id) {
                paidProWorkspaceIds.add(s.workspace_id)
            }
        }

        const { data: workspaces, error: wsError } = await service
            .from("workspaces")
            .select("id")

        if (wsError) {
            return NextResponse.json(
                { success: false, error: `Failed to fetch workspaces: ${wsError.message}` },
                { status: 500 }
            )
        }

        const recipients = new Set<string>()
        for (const ws of workspaces || []) {
            const workspaceId = ws?.id
            if (!workspaceId) continue
            if (paidProWorkspaceIds.has(workspaceId)) continue

            const email = ownerEmailByWorkspaceId[workspaceId]
            if (!email) continue
            if (EXCLUDE_EMAILS.has(email)) continue

            recipients.add(email)
        }

        const allRecipients = Array.from(recipients)
        const toSend = limit !== null ? allRecipients.slice(0, Math.max(0, limit)) : allRecipients

        let emailsSent = 0
        let emailErrors = 0
        const results: { email: string; status: string; error?: string }[] = []

        for (const email of toSend) {
            if (dryRun) {
                results.push({ email, status: "dry_run" })
                continue
            }

            try {
                const res = await fetch(`${baseUrl}/api/email/send`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${cronSecret}`,
                    },
                    body: JSON.stringify({
                        type: "trial_started_announcement",
                        to: email,
                    }),
                })

                if (res.ok) {
                    emailsSent++
                    results.push({ email, status: "sent" })
                } else {
                    const errJson = await res.json().catch(() => null)
                    emailErrors++
                    results.push({ email, status: "failed", error: errJson?.error || `HTTP ${res.status}` })
                }

                await new Promise((r) => setTimeout(r, 150))
            } catch (err: any) {
                emailErrors++
                results.push({ email, status: "error", error: err?.message || "Unknown error" })
            }
        }

        return NextResponse.json({
            success: true,
            dry_run: dryRun,
            summary: {
                recipients_found: allRecipients.length,
                recipients_attempted: toSend.length,
                emails_sent: emailsSent,
                email_errors: emailErrors,
            },
            results,
        })
    } catch (error: any) {
        console.error("[Admin] send-trial-announcement error:", error)
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to send trial announcement" },
            { status: 500 }
        )
    }
}
