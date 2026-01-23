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

type TopRow = { key: string; count: number }

type Bucket = {
  t: string
  events: number
  pageViews: number
  signIns: number
  signUps: number
  visitors: number
}

type SeriesRow = Bucket & {
  eventsPrev?: number
  pageViewsPrev?: number
  signInsPrev?: number
  signUpsPrev?: number
  visitorsPrev?: number
}

function bucketKey(date: Date, bucket: "hour" | "day") {
  if (bucket === "hour") {
    const y = date.getUTCFullYear()
    const m = String(date.getUTCMonth() + 1).padStart(2, "0")
    const d = String(date.getUTCDate()).padStart(2, "0")
    const h = String(date.getUTCHours()).padStart(2, "0")
    return `${y}-${m}-${d} ${h}:00Z`
  }
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function floorToBucket(date: Date, bucket: "hour" | "day") {
  const d = new Date(date)
  if (bucket === "hour") {
    d.setUTCMinutes(0, 0, 0)
    return d
  }
  d.setUTCHours(0, 0, 0, 0)
  return d
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
    const days = Math.max(1, Math.min(90, Number(daysRaw || 14) || 14))

    const compare = url.searchParams.get("compare") === "1"

    const bucket: "hour" | "day" = days <= 2 ? "hour" : "day"
    const currentStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const prevStart = new Date(currentStart.getTime() - days * 24 * 60 * 60 * 1000)

    const service = getServiceClient()

    const { data, error } = await service
      .from("app_analytics_events")
      .select("created_at,event_name,path,user_id,anonymous_id,properties")
      .gte("created_at", (compare ? prevStart : currentStart).toISOString())
      .order("created_at", { ascending: true })
      .limit(20000)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const buckets = new Map<string, Bucket>()
    const bucketVisitors = new Map<string, Set<string>>()
    const uniqueVisitors = new Set<string>()

    const prevBuckets = new Map<string, Bucket>()
    const prevBucketVisitors = new Map<string, Set<string>>()
    const uniqueVisitorsPrev = new Set<string>()
    const topPages = new Map<string, number>()
    const topFeatures = new Map<string, number>()

    // Prefill continuous buckets so charts render even when only one bucket has data.
    const start = floorToBucket(currentStart, bucket)
    const end = floorToBucket(new Date(), bucket)
    const cursor = new Date(start)
    while (cursor <= end) {
      const key = bucketKey(cursor, bucket)
      buckets.set(key, { t: key, events: 0, pageViews: 0, signIns: 0, signUps: 0, visitors: 0 })
      if (bucket === "hour") cursor.setUTCHours(cursor.getUTCHours() + 1)
      else cursor.setUTCDate(cursor.getUTCDate() + 1)
    }

    if (compare) {
      const prevEnd = new Date(start)
      if (bucket === "hour") prevEnd.setUTCHours(prevEnd.getUTCHours() - 1)
      else prevEnd.setUTCDate(prevEnd.getUTCDate() - 1)

      const prevCursor = floorToBucket(prevStart, bucket)
      while (prevCursor <= prevEnd) {
        const key = bucketKey(prevCursor, bucket)
        prevBuckets.set(key, { t: key, events: 0, pageViews: 0, signIns: 0, signUps: 0, visitors: 0 })
        if (bucket === "hour") prevCursor.setUTCHours(prevCursor.getUTCHours() + 1)
        else prevCursor.setUTCDate(prevCursor.getUTCDate() + 1)
      }
    }

    for (const row of data || []) {
      const created = new Date(row.created_at)
      const key = bucketKey(created, bucket)

      const isPrev = compare && created < start

      const targetBuckets = isPrev ? prevBuckets : buckets
      const targetBucketVisitors = isPrev ? prevBucketVisitors : bucketVisitors
      const targetUniqueVisitors = isPrev ? uniqueVisitorsPrev : uniqueVisitors

      const b =
        targetBuckets.get(key) ||
        ({ t: key, events: 0, pageViews: 0, signIns: 0, signUps: 0, visitors: 0 } as Bucket)

      b.events += 1

      if (row.event_name === "page_view") {
        b.pageViews += 1
        const p = (row.path || "").toString().slice(0, 300)
        if (p) topPages.set(p, (topPages.get(p) || 0) + 1)
      }
      if (row.event_name === "auth_sign_in") b.signIns += 1
      if (row.event_name === "auth_sign_up") b.signUps += 1

      const visitorKey = row.user_id
        ? `u:${row.user_id}`
        : row.anonymous_id
            ? `a:${row.anonymous_id}`
            : null
      if (visitorKey) {
        targetUniqueVisitors.add(visitorKey)
        const set = targetBucketVisitors.get(key) || new Set<string>()
        set.add(visitorKey)
        targetBucketVisitors.set(key, set)
        b.visitors = set.size
      }

      const props = (row.properties || {}) as any
      if (row.event_name === "feature_use") {
        const feature = (props.feature || props.name || props.key || "unknown").toString().slice(0, 120)
        topFeatures.set(feature, (topFeatures.get(feature) || 0) + 1)
      }

      // Fallback: treat clicks with a label as "features" so the dashboard is useful immediately.
      // The client tracker sends click events with { label, href, id, class }.
      if (row.event_name === "click") {
        const label = typeof props.label === 'string' ? props.label.trim() : ''
        if (label) {
          const feature = `click:${label}`.slice(0, 120)
          topFeatures.set(feature, (topFeatures.get(feature) || 0) + 1)
        }
      }

      targetBuckets.set(key, b)
    }

    const currentSeries = Array.from(buckets.values()).sort((a, b) => a.t.localeCompare(b.t))
    const prevSeries = compare
      ? Array.from(prevBuckets.values()).sort((a, b) => a.t.localeCompare(b.t))
      : []

    const series: SeriesRow[] = currentSeries.map((row, idx) => {
      const prev = prevSeries[idx]
      if (!compare || !prev) return row
      return {
        ...row,
        eventsPrev: prev.events,
        pageViewsPrev: prev.pageViews,
        signInsPrev: prev.signIns,
        signUpsPrev: prev.signUps,
        visitorsPrev: prev.visitors,
      }
    })

    const trimmedSeries = series.slice(-500)

    const topPagesArr: TopRow[] = Array.from(topPages.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const topFeaturesArr: TopRow[] = Array.from(topFeatures.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const totals = trimmedSeries.reduce(
      (acc, r) => {
        acc.events += r.events
        acc.pageViews += r.pageViews
        acc.signIns += r.signIns
        acc.signUps += r.signUps
        // Visitors is computed across the whole range below
        return acc
      },
      { events: 0, pageViews: 0, signIns: 0, signUps: 0, visitors: 0 }
    )

    totals.visitors = uniqueVisitors.size

    return NextResponse.json(
      {
        success: true,
        range: { days, bucket },
        totals,
        series: trimmedSeries,
        topPages: topPagesArr,
        topFeatures: topFeaturesArr,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load dashboard" },
      { status: 500 }
    )
  }
}
