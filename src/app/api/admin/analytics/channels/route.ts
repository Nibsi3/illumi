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

function domainFromReferrer(referrer: string | null) {
  if (!referrer) return null
  try {
    const u = new URL(referrer)
    return u.hostname || null
  } catch {
    return null
  }
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
    const days = Math.max(1, Math.min(90, Number(daysRaw || 30) || 30))
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const service = getServiceClient()

    const { data, error } = await service
      .from("app_analytics_events")
      .select("referrer,properties")
      .gte("created_at", since)
      .eq("event_name", "page_view")
      .limit(20000)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const byReferrer = new Map<string, number>()
    const bySource = new Map<string, number>()
    const byMedium = new Map<string, number>()
    const byCampaign = new Map<string, number>()

    let direct = 0

    for (const row of data || []) {
      const domain = domainFromReferrer((row as any).referrer)
      if (!domain) direct += 1
      else byReferrer.set(domain, (byReferrer.get(domain) || 0) + 1)

      const p = ((row as any).properties || {}) as any
      const utm_source = typeof p.utm_source === "string" ? p.utm_source.trim() : ""
      const utm_medium = typeof p.utm_medium === "string" ? p.utm_medium.trim() : ""
      const utm_campaign = typeof p.utm_campaign === "string" ? p.utm_campaign.trim() : ""

      const source = utm_source || (domain ? domain : "direct")
      const medium = utm_medium || (domain ? "referral" : "direct")

      bySource.set(source, (bySource.get(source) || 0) + 1)
      byMedium.set(medium, (byMedium.get(medium) || 0) + 1)
      if (utm_campaign) byCampaign.set(utm_campaign, (byCampaign.get(utm_campaign) || 0) + 1)
    }

    const top = (m: Map<string, number>, limit = 10) =>
      Array.from(m.entries())
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)

    return NextResponse.json(
      {
        success: true,
        days,
        summary: {
          pageViews: (data || []).length,
          direct,
        },
        referrers: top(byReferrer),
        sources: top(bySource),
        mediums: top(byMedium),
        campaigns: top(byCampaign),
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load channels" },
      { status: 500 }
    )
  }
}
