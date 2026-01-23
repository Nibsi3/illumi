"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Row = { key: string; count: number }

type DevicesResponse = {
  success: boolean
  days?: number
  pageViews?: number
  deviceTypes?: Row[]
  browsers?: Row[]
  operatingSystems?: Row[]
  error?: string
}

function toChart(rows: Row[]) {
  return rows.map((r) => ({ name: r.key, count: r.count }))
}

function ChartBlock({ title, rows }: { title: string; rows: { name: string; count: number }[] }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 16,
        padding: 12,
        minHeight: 260,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>{title}</div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis type="number" stroke="rgba(255,255,255,0.6)" fontSize={11} />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
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
  )
}

export default function AdminDevicesPage() {
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DevicesResponse | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/analytics/devices?days=${days}`, {
          method: "GET",
          credentials: "include",
          headers: { "Cache-Control": "no-store" },
        })
        const json = (await res.json().catch(() => null)) as DevicesResponse | null
        if (res.ok && json?.success) setData(json)
        else setData(null)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [days])

  const deviceTypes = useMemo(() => toChart(data?.deviceTypes || []), [data])
  const browsers = useMemo(() => toChart(data?.browsers || []), [data])
  const operatingSystems = useMemo(() => toChart(data?.operatingSystems || []), [data])

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Devices</h1>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 12, opacity: 0.75 }}>
            {loading ? "Loading…" : `Last ${days} days — ${data?.pageViews || 0} page views`}
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        <ChartBlock title="Device types" rows={deviceTypes} />
        <ChartBlock title="Browsers" rows={browsers} />
        <ChartBlock title="Operating systems" rows={operatingSystems} />
      </div>

      {data?.error ? (
        <div style={{ marginTop: 10, fontSize: 12, color: "#fb7185" }}>{data.error}</div>
      ) : null}
    </div>
  )
}
