import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"
import UAParser from "ua-parser-js"

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

function inc(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1)
}

function top(map: Map<string, number>, limit = 10) {
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
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
      .select("user_agent")
      .gte("created_at", since)
      .eq("event_name", "page_view")
      .limit(20000)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const deviceTypes = new Map<string, number>()
    const browsers = new Map<string, number>()
    const oss = new Map<string, number>()

    const parser = new UAParser()

    for (const row of data || []) {
      const ua = (row as any).user_agent || ""
      parser.setUA(ua)
      const result = parser.getResult()

      const browser = result.browser?.name || "Unknown"
      const os = result.os?.name || "Unknown"
      const deviceType = result.device?.type || "desktop"

      inc(browsers, browser)
      inc(oss, os)
      inc(deviceTypes, deviceType)
    }

    return NextResponse.json(
      {
        success: true,
        days,
        pageViews: (data || []).length,
        deviceTypes: top(deviceTypes, 20),
        browsers: top(browsers, 20),
        operatingSystems: top(oss, 20),
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load devices" },
      { status: 500 }
    )
  }
}
