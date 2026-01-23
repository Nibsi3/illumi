"use client"

import { useEffect, useState } from "react"

type FeatureRow = {
  feature: string
  events: number
  uniqueUsers: number
}

type FeaturesResponse = {
  success: boolean
  features?: FeatureRow[]
  error?: string
}

export default function AdminFeaturesPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<FeatureRow[]>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/analytics/features?days=30", {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-store",
          },
        })
        const json = (await res.json().catch(() => null)) as FeaturesResponse | null
        if (res.ok && json?.success && Array.isArray(json.features)) {
          setRows(json.features)
        } else {
          setRows([])
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Features</h1>
      <p style={{ marginTop: 6, marginBottom: 16, fontSize: 12, opacity: 0.75 }}>
        {loading ? "Loading…" : `Showing ${rows.length} rows (feature_use + click labels)`}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Feature</th>
              <th style={{ textAlign: "right", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Events</th>
              <th style={{ textAlign: "right", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Unique users</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature}>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{r.feature}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, textAlign: "right" }}>{r.events}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, textAlign: "right" }}>{r.uniqueUsers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
