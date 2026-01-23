import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"

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

function csvEscape(value: unknown) {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    const url = new URL(req.url)

    const qEvent = (url.searchParams.get("event") || "").trim()
    const qPath = (url.searchParams.get("path") || "").trim()
    const qEmail = (url.searchParams.get("email") || "").trim().toLowerCase()
    const qAnon = (url.searchParams.get("anon") || "").trim()
    const qSession = (url.searchParams.get("session") || "").trim()

    const from = (url.searchParams.get("from") || "").trim()
    const to = (url.searchParams.get("to") || "").trim()

    const limitRaw = url.searchParams.get("limit")
    const offsetRaw = url.searchParams.get("offset")
    const limit = Math.max(1, Math.min(500, Number(limitRaw || 50) || 50))
    const offset = Math.max(0, Number(offsetRaw || 0) || 0)

    const format = (url.searchParams.get("format") || "json").toLowerCase()

    const service = getServiceClient()

    let query = service
      .from("app_analytics_events")
      .select(
        "id,created_at,event_name,path,referrer,user_id,user_email,anonymous_id,session_id,user_agent,ip,properties",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })

    if (from) query = query.gte("created_at", from)
    if (to) query = query.lte("created_at", to)

    if (qEvent) query = query.ilike("event_name", `%${qEvent}%`)
    if (qPath) query = query.ilike("path", `%${qPath}%`)
    if (qEmail) query = query.ilike("user_email", `%${qEmail}%`)
    if (qAnon) query = query.ilike("anonymous_id", `%${qAnon}%`)
    if (qSession) query = query.ilike("session_id", `%${qSession}%`)

    const res = await query.range(offset, offset + limit - 1)

    if (res.error) {
      return NextResponse.json({ success: false, error: res.error.message }, { status: 500 })
    }

    const rows = res.data || []
    const total = res.count || 0

    if (format === "csv") {
      const header = [
        "created_at",
        "event_name",
        "path",
        "referrer",
        "user_email",
        "user_id",
        "anonymous_id",
        "session_id",
        "ip",
        "user_agent",
        "properties",
      ]

      const lines = [header.join(",")]
      for (const r of rows as any[]) {
        lines.push(
          [
            r.created_at,
            r.event_name,
            r.path,
            r.referrer,
            r.user_email,
            r.user_id,
            r.anonymous_id,
            r.session_id,
            r.ip,
            r.user_agent,
            r.properties ? JSON.stringify(r.properties) : "",
          ]
            .map(csvEscape)
            .join(",")
        )
      }

      return new Response(lines.join("\n"), {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Cache-Control": "no-store",
          "Content-Disposition": "attachment; filename=analytics-events.csv",
        },
      })
    }

    return NextResponse.json({ success: true, total, offset, limit, events: rows }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to search events" },
      { status: 500 }
    )
  }
}
