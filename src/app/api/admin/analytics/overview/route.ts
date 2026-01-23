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

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const service = getServiceClient()

    const totalRes = await service
      .from("app_analytics_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)

    const pageViewRes = await service
      .from("app_analytics_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      .eq("event_name", "page_view")

    const signInRes = await service
      .from("app_analytics_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      .eq("event_name", "auth_sign_in")

    const signUpRes = await service
      .from("app_analytics_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      .eq("event_name", "auth_sign_up")

    const visitorsRes = await service
      .from("app_analytics_events")
      .select("user_id,anonymous_id")
      .gte("created_at", since)
      .limit(10000)

    const unique = new Set<string>()
    for (const row of visitorsRes.data || []) {
      const key = row.user_id ? `u:${row.user_id}` : row.anonymous_id ? `a:${row.anonymous_id}` : null
      if (key) unique.add(key)
    }

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalEvents24h: totalRes.count || 0,
          pageViews24h: pageViewRes.count || 0,
          uniqueVisitors24h: unique.size,
          signIns24h: signInRes.count || 0,
          signUps24h: signUpRes.count || 0,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load overview" },
      { status: 500 }
    )
  }
}
