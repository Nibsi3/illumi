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

type RawEvent = {
  created_at: string
  event_name: string
  path: string | null
  referrer: string | null
  user_id: string | null
  user_email: string | null
  anonymous_id: string | null
  session_id: string | null
  user_agent: string | null
  ip: string | null
  properties: any
}

type SessionAgg = {
  sessionId: string
  anonymousId: string | null
  userId: string | null
  userEmail: string | null
  firstSeen: string
  lastSeen: string
  events: number
  pageViews: number
  uniquePages: number
  entryPath: string | null
  entryReferrer: string | null
  userAgent: string | null
  ip: string | null
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
    const daysRaw = url.searchParams.get("days")
    const q = (url.searchParams.get("q") || "").trim()
    const days = Math.max(1, Math.min(90, Number(daysRaw || 7) || 7))
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const service = getServiceClient()

    const { data, error } = await service
      .from("app_analytics_events")
      .select(
        "created_at,event_name,path,referrer,user_id,user_email,anonymous_id,session_id,user_agent,ip,properties"
      )
      .gte("created_at", since)
      .not("session_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(20000)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const map = new Map<string, SessionAgg & { _pageSet: Set<string> }>()

    for (const e of (data || []) as RawEvent[]) {
      const sid = e.session_id
      if (!sid) continue

      if (q) {
        const hay = `${sid} ${e.anonymous_id || ""} ${e.user_id || ""} ${e.user_email || ""}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) continue
      }

      let s = map.get(sid)
      if (!s) {
        s = {
          sessionId: sid,
          anonymousId: e.anonymous_id || null,
          userId: e.user_id || null,
          userEmail: e.user_email || null,
          firstSeen: e.created_at,
          lastSeen: e.created_at,
          events: 0,
          pageViews: 0,
          uniquePages: 0,
          entryPath: null,
          entryReferrer: null,
          userAgent: e.user_agent || null,
          ip: e.ip || null,
          _pageSet: new Set<string>(),
        }
        map.set(sid, s)
      }

      s.events += 1

      if (e.created_at > s.lastSeen) s.lastSeen = e.created_at
      if (e.created_at < s.firstSeen) {
        s.firstSeen = e.created_at
        s.entryPath = e.path || null
        s.entryReferrer = e.referrer || null
        s.userAgent = e.user_agent || s.userAgent
        s.ip = e.ip || s.ip
      }

      if (e.event_name === "page_view") {
        s.pageViews += 1
        if (e.path) s._pageSet.add(e.path)
      }

      // Prefer real user info if it appears later in the session
      if (!s.userId && e.user_id) s.userId = e.user_id
      if (!s.userEmail && e.user_email) s.userEmail = e.user_email
      if (!s.anonymousId && e.anonymous_id) s.anonymousId = e.anonymous_id
    }

    const sessions = Array.from(map.values())
      .map(({ _pageSet, ...rest }) => ({ ...rest, uniquePages: _pageSet.size }))
      .sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1))
      .slice(0, 200)

    return NextResponse.json(
      {
        success: true,
        days,
        q,
        sessions,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load sessions" },
      { status: 500 }
    )
  }
}
