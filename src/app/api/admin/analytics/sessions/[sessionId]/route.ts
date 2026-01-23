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

export async function GET(req: Request, ctx: { params: Promise<{ sessionId: string }> }) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    const { sessionId } = await ctx.params
    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 })
    }

    const url = new URL(req.url)
    const daysRaw = url.searchParams.get("days")
    const days = Math.max(1, Math.min(90, Number(daysRaw || 30) || 30))
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const service = getServiceClient()

    const { data, error } = await service
      .from("app_analytics_events")
      .select(
        "id,created_at,event_name,path,referrer,user_id,user_email,anonymous_id,session_id,user_agent,ip,properties"
      )
      .gte("created_at", since)
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(5000)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const events = (data || []).map((e: any) => ({
      id: e.id,
      created_at: e.created_at,
      event_name: e.event_name,
      path: e.path,
      referrer: e.referrer,
      user_id: e.user_id,
      user_email: e.user_email,
      anonymous_id: e.anonymous_id,
      session_id: e.session_id,
      user_agent: e.user_agent,
      ip: e.ip,
      properties: e.properties,
    }))

    const first = events[0] || null
    const last = events[events.length - 1] || null

    return NextResponse.json(
      {
        success: true,
        sessionId,
        days,
        summary: {
          firstSeen: first?.created_at || null,
          lastSeen: last?.created_at || null,
          events: events.length,
          userId: first?.user_id || last?.user_id || null,
          userEmail: first?.user_email || last?.user_email || null,
          anonymousId: first?.anonymous_id || last?.anonymous_id || null,
          userAgent: first?.user_agent || last?.user_agent || null,
          ip: first?.ip || last?.ip || null,
        },
        events,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load session" },
      { status: 500 }
    )
  }
}
