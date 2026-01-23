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

type EventRow = {
  properties: any
}

function distinctInvoiceCount(rows: EventRow[] | null | undefined) {
  const set = new Set<string>()
  for (const r of rows || []) {
    const id = r?.properties?.invoice_id
    if (id) set.add(String(id))
  }
  return set.size
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

    const steps = ["invoice_created", "invoice_sent", "invoice_paid"] as const

    const results = await Promise.all(
      steps.map(async (eventName) => {
        const { data, error } = await service
          .from("app_analytics_events")
          .select("properties")
          .gte("created_at", since)
          .eq("event_name", eventName)
          .limit(20000)

        if (error) throw new Error(error.message)

        return {
          eventName,
          count: distinctInvoiceCount(data as any),
        }
      })
    )

    const created = results.find((r) => r.eventName === "invoice_created")?.count || 0
    const sent = results.find((r) => r.eventName === "invoice_sent")?.count || 0
    const paid = results.find((r) => r.eventName === "invoice_paid")?.count || 0

    const safeRate = (a: number, b: number) => (b > 0 ? a / b : 0)

    return NextResponse.json(
      {
        success: true,
        days,
        funnel: [
          { step: "Created", eventName: "invoice_created", count: created, rateFromPrev: 1 },
          { step: "Sent", eventName: "invoice_sent", count: sent, rateFromPrev: safeRate(sent, created) },
          { step: "Paid", eventName: "invoice_paid", count: paid, rateFromPrev: safeRate(paid, sent) },
        ],
        conversion: {
          createdToSent: safeRate(sent, created),
          sentToPaid: safeRate(paid, sent),
          createdToPaid: safeRate(paid, created),
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load funnels" },
      { status: 500 }
    )
  }
}
