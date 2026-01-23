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

type FeatureAgg = { events: number; users: Set<string> }

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
    const days = Math.max(1, Math.min(365, Number(daysRaw || 30) || 30))

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const service = getServiceClient()
    const { data, error } = await service
      .from("app_analytics_events")
      .select("user_id,anonymous_id,event_name,properties")
      .gte("created_at", since)
      .in("event_name", ["feature_use", "click"])
      .limit(10000)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const agg = new Map<string, FeatureAgg>()

    for (const row of data || []) {
      const p = (row as any).properties || {}

      let feature = "unknown"
      if ((row as any).event_name === 'feature_use') {
        feature = (p.feature || p.name || p.key || "unknown").toString()
      } else if ((row as any).event_name === 'click') {
        const label = typeof p.label === 'string' ? p.label.trim() : ''
        feature = label ? `click:${label}` : 'click'
      }
      feature = feature.slice(0, 120)

      const existing = agg.get(feature) || { events: 0, users: new Set<string>() }
      existing.events += 1

      const userKey = row.user_id ? `u:${row.user_id}` : row.anonymous_id ? `a:${row.anonymous_id}` : null
      if (userKey) existing.users.add(userKey)

      agg.set(feature, existing)
    }

    const features = Array.from(agg.entries())
      .map(([feature, v]) => ({ feature, events: v.events, uniqueUsers: v.users.size }))
      .sort((a, b) => b.events - a.events)

    return NextResponse.json({ success: true, features }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load features" },
      { status: 500 }
    )
  }
}
