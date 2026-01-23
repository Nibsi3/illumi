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
    const limitRaw = url.searchParams.get("limit")
    const limit = Math.max(1, Math.min(500, Number(limitRaw || 200) || 200))

    const service = getServiceClient()

    const usersRes = await service.auth.admin.listUsers({ perPage: Math.min(200, limit) })
    if (usersRes.error) {
      return NextResponse.json({ success: false, error: usersRes.error.message }, { status: 500 })
    }

    const { data, error } = await service
      .from("app_analytics_events")
      .select("id,created_at,event_name,user_email,user_id,anonymous_id")
      .in("event_name", ["auth_sign_in", "auth_sign_up"])
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const users = (usersRes.data?.users || []).map((u: any) => ({
      id: u.id,
      email: u.email || null,
      created_at: u.created_at || null,
      last_sign_in_at: u.last_sign_in_at || null,
      app_metadata: u.app_metadata || null,
      user_metadata: u.user_metadata || null,
      identities: u.identities || null,
    }))

    return NextResponse.json(
      {
        success: true,
        users,
        events: data || [],
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load users" },
      { status: 500 }
    )
  }
}
