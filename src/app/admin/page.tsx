"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Brush,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type DashboardResponse = {
  success: boolean
  range?: {
    days: number
    bucket: "hour" | "day"
  }
  totals?: {
    events: number
    pageViews: number
    signIns: number
    signUps: number
    visitors: number
  }
  series?: {
    t: string
    events: number
    pageViews: number
    signIns: number
    signUps: number
    visitors: number
    eventsPrev?: number
    pageViewsPrev?: number
    signInsPrev?: number
    signUpsPrev?: number
  }[]
  topPages?: { key: string; count: number }[]
  topFeatures?: { key: string; count: number }[]
  error?: string
}

function formatTick(t: string) {
  // t is either `YYYY-MM-DD` or `YYYY-MM-DD HH:00Z`
  if (t.includes(" ")) {
    const parts = t.split(" ")
    return parts[1]?.replace("Z", "") || t
  }
  return t.slice(5)
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        padding: 12,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>{value}</div>
    </div>
  )
}

export default function AdminOverviewPage() {
  const [days, setDays] = useState(14)
  const [compare, setCompare] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardResponse | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/admin/analytics/dashboard?days=${days}${compare ? "&compare=1" : ""}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-store",
            },
          }
        )
        const json = (await res.json().catch(() => null)) as DashboardResponse | null
        if (res.ok && json?.success) {
          setData(json)
        } else {
          setData(null)
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [days, compare])

  const series = data?.series || []
  const topPages = useMemo(() => {
    return (data?.topPages || []).map((r) => ({ name: r.key, count: r.count }))
  }, [data])
  const topFeatures = useMemo(() => {
    return (data?.topFeatures || []).map((r) => ({ name: r.key, count: r.count }))
  }, [data])

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Overview</h1>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 12, opacity: 0.75 }}>
            {loading ? "Loading…" : `Last ${days} day${days === 1 ? "" : "s"}`}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              opacity: 0.85,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: compare ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
              userSelect: "none",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={compare}
              onChange={(e) => setCompare(e.target.checked)}
              style={{ accentColor: "#a78bfa" }}
            />
            Compare
          </label>
          {[1, 7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              style={{
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: days === d ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
                color: "#fff",
                fontSize: 12,
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <Card title="Events" value={data?.totals?.events ?? 0} />
        <Card title="Page views" value={data?.totals?.pageViews ?? 0} />
        <Card title="Users" value={data?.totals?.visitors ?? 0} />
        <Card title="Sign-ins" value={data?.totals?.signIns ?? 0} />
        <Card title="Sign-ups" value={data?.totals?.signUps ?? 0} />
      </div>

      <div style={{ height: 14 }} />

      {!loading && series.length === 0 ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>No analytics data yet</div>
          <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>
            This page reads from the Supabase table <code style={{ opacity: 0.9 }}>app_analytics_events</code>.
            If it’s empty, charts will be blank.
            <br />
            Quick checks:
            <br />
            - Open DevTools Console and look for <code style={{ opacity: 0.9 }}>[analytics] track failed</code>
            <br />
            - Ensure you applied the migration <code style={{ opacity: 0.9 }}>20260123000000_app_analytics.sql</code>
            <br />
            - Ensure <code style={{ opacity: 0.9 }}>SUPABASE_SERVICE_ROLE_KEY</code> is set (server needs it to insert/read)
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, alignItems: "stretch" }}>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            padding: 12,
            minHeight: 320,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85 }}>Trends</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>bucket: {data?.range?.bucket || "day"}</div>
          </div>

          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="t" tickFormatter={formatTick} stroke="rgba(255,255,255,0.6)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,10,0.92)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="events" stroke="#a78bfa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pageViews" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="signIns" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="signUps" stroke="#fb7185" strokeWidth={2} dot={false} />

                {compare ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="eventsPrev"
                      stroke="rgba(167,139,250,0.45)"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="6 6"
                      name="events (prev)"
                    />
                    <Line
                      type="monotone"
                      dataKey="pageViewsPrev"
                      stroke="rgba(34,197,94,0.45)"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="6 6"
                      name="pageViews (prev)"
                    />
                    <Line
                      type="monotone"
                      dataKey="signInsPrev"
                      stroke="rgba(56,189,248,0.45)"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="6 6"
                      name="signIns (prev)"
                    />
                    <Line
                      type="monotone"
                      dataKey="signUpsPrev"
                      stroke="rgba(251,113,133,0.45)"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="6 6"
                      name="signUps (prev)"
                    />
                  </>
                ) : null}

                <Brush
                  dataKey="t"
                  height={20}
                  travellerWidth={10}
                  tickFormatter={formatTick}
                  stroke="rgba(255,255,255,0.3)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 16,
              padding: 12,
              minHeight: 154,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Top pages</div>
            <div style={{ width: "100%", height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPages} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <XAxis type="number" stroke="rgba(255,255,255,0.6)" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,10,10,0.92)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="rgba(34,197,94,0.9)" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 16,
              padding: 12,
              minHeight: 154,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Top features</div>
            <div style={{ width: "100%", height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFeatures} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <XAxis type="number" stroke="rgba(255,255,255,0.6)" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,10,10,0.92)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="rgba(167,139,250,0.9)" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 10 }} />
      <div style={{ fontSize: 11, opacity: 0.55 }}>
        {data?.error ? `Error: ${data.error}` : null}
      </div>
    </div>
  )
}
