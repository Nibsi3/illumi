"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type SessionRow = {
  sessionId: string
  anonymousId: string | null
  userId: string | null
  userEmail: string | null
  firstSeen: string
  lastSeen: string
  events: number
  pageViews: number
  uniquePages: number
  entryPath: string | null
  entryReferrer: string | null
  userAgent: string | null
  ip: string | null
}

type SessionsResponse = {
  success: boolean
  days?: number
  q?: string
  sessions?: SessionRow[]
  error?: string
}

function fmt(ts: string) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ts
  }
}

export default function AdminSessionsPage() {
  const [days, setDays] = useState(7)
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SessionsResponse | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ days: String(days) })
        if (q.trim()) params.set("q", q.trim())

        const res = await fetch(`/api/admin/analytics/sessions?${params.toString()}`, {
          method: "GET",
          credentials: "include",
          headers: { "Cache-Control": "no-store" },
        })
        const json = (await res.json().catch(() => null)) as SessionsResponse | null
        if (res.ok && json?.success) setData(json)
        else setData(null)
      } finally {
        setLoading(false)
      }
    }

    const t = setTimeout(run, 250)
    return () => clearTimeout(t)
  }, [days, q])

  const sessions = useMemo(() => data?.sessions || [], [data])

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Sessions</h1>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 12, opacity: 0.75 }}>
            {loading ? "Loading…" : `Showing ${sessions.length} sessions (last ${days} days)`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search session/user/email…"
            style={{
              width: 240,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              fontSize: 12,
              outline: "none",
            }}
          />
          {[1, 7, 30, 60, 90].map((d) => (
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

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ textAlign: "left", opacity: 0.8 }}>
              <th style={{ padding: "10px 8px" }}>Last seen</th>
              <th style={{ padding: "10px 8px" }}>Session</th>
              <th style={{ padding: "10px 8px" }}>User</th>
              <th style={{ padding: "10px 8px" }}>PV</th>
              <th style={{ padding: "10px 8px" }}>Pages</th>
              <th style={{ padding: "10px 8px" }}>Entry</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.sessionId} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <td style={{ padding: "10px 8px", whiteSpace: "nowrap", opacity: 0.85 }}>{fmt(s.lastSeen)}</td>
                <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                  <Link
                    href={`/admin/sessions/${encodeURIComponent(s.sessionId)}?days=${days}`}
                    style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    {s.sessionId.slice(0, 8)}…
                  </Link>
                </td>
                <td style={{ padding: "10px 8px", maxWidth: 260 }}>
                  <div style={{ opacity: 0.9 }}>{s.userEmail || s.userId || s.anonymousId || "—"}</div>
                </td>
                <td style={{ padding: "10px 8px", opacity: 0.9 }}>{s.pageViews.toLocaleString()}</td>
                <td style={{ padding: "10px 8px", opacity: 0.9 }}>{s.uniquePages.toLocaleString()}</td>
                <td style={{ padding: "10px 8px", maxWidth: 340 }}>
                  <div style={{ opacity: 0.9 }}>{s.entryPath || "—"}</div>
                  <div style={{ opacity: 0.55, fontSize: 11, marginTop: 2 }}>
                    {s.entryReferrer ? s.entryReferrer.slice(0, 80) : ""}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && sessions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 14, opacity: 0.7 }}>
                  No sessions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {data?.error ? (
        <div style={{ marginTop: 10, fontSize: 12, color: "#fb7185" }}>{data.error}</div>
      ) : null}
    </div>
  )
}
