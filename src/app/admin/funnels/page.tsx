"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type FunnelRow = {
  step: string
  eventName: string
  count: number
  rateFromPrev: number
}

type FunnelsResponse = {
  success: boolean
  days?: number
  funnel?: FunnelRow[]
  conversion?: {
    createdToSent: number
    sentToPaid: number
    createdToPaid: number
  }
  error?: string
}

function pct(n: number) {
  if (!Number.isFinite(n)) return "0%"
  return `${Math.round(n * 1000) / 10}%`
}

export default function AdminFunnelsPage() {
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<FunnelsResponse | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/analytics/funnels?days=${days}`, {
          method: "GET",
          credentials: "include",
          headers: { "Cache-Control": "no-store" },
        })
        const json = (await res.json().catch(() => null)) as FunnelsResponse | null
        if (res.ok && json?.success) setData(json)
        else setData(null)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [days])

  const chartData = useMemo(() => {
    return (data?.funnel || []).map((r) => ({ name: r.step, count: r.count }))
  }, [data])

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Funnels</h1>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 12, opacity: 0.75 }}>
            {loading ? "Loading…" : `Last ${days} days`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[7, 30, 60, 90].map((d) => (
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Conversion</div>
          <div style={{ display: "grid", gap: 6, fontSize: 12, opacity: 0.9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span>Created → Sent</span>
              <span style={{ fontWeight: 700 }}>{pct(data?.conversion?.createdToSent || 0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span>Sent → Paid</span>
              <span style={{ fontWeight: 700 }}>{pct(data?.conversion?.sentToPaid || 0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span>Created → Paid</span>
              <span style={{ fontWeight: 700 }}>{pct(data?.conversion?.createdToPaid || 0)}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            padding: 12,
            minHeight: 260,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Funnel volume</div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={11} />
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
                <Bar dataKey="count" fill="rgba(99,102,241,0.9)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          borderRadius: 16,
          padding: 12,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Steps</div>
        <div style={{ display: "grid", gap: 8 }}>
          {(data?.funnel || []).map((r, idx) => (
            <div
              key={r.eventName}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                paddingTop: idx === 0 ? 0 : 8,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.85 }}>{r.step}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                <div style={{ opacity: 0.8 }}>{r.count.toLocaleString()}</div>
                <div style={{ width: 90, textAlign: "right", fontWeight: 700 }}>
                  {idx === 0 ? "—" : pct(r.rateFromPrev)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {data?.error ? (
        <div style={{ marginTop: 10, fontSize: 12, color: "#fb7185" }}>{data.error}</div>
      ) : null}
    </div>
  )
}
