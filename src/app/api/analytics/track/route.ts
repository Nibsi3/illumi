import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

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

function getIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for")
  if (!xff) return null
  const first = xff.split(",")[0]?.trim()
  return first || null
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    const event_name = body?.event_name
    if (!event_name || typeof event_name !== "string" || event_name.length > 200) {
      return NextResponse.json({ success: false, error: "Invalid event_name" }, { status: 400 })
    }

    const path = typeof body?.path === "string" ? body.path : null
    const referrer = typeof body?.referrer === "string" ? body.referrer : null
    const anonymous_id = typeof body?.anonymous_id === "string" ? body.anonymous_id : null
    const session_id = typeof body?.session_id === "string" ? body.session_id : null
    const properties = body?.properties && typeof body.properties === "object" ? body.properties : {}

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const service = getServiceClient()

    const { error } = await service.from("app_analytics_events").insert({
      event_name,
      path,
      referrer,
      anonymous_id,
      session_id,
      user_id: user?.id || null,
      user_email: (user?.email || "").toLowerCase().trim() || null,
      user_agent: req.headers.get("user-agent"),
      ip: getIp(req),
      properties,
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to track event" },
      { status: 500 }
    )
  }
}
