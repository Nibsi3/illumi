"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type EventRow = {
  id: string
  created_at: string
  event_name: string
  path: string | null
  referrer: string | null
  user_id: string | null
  user_email: string | null
  anonymous_id: string | null
  session_id: string | null
  user_agent: string | null
  ip: string | null
  properties: any
}

type SessionResponse = {
  success: boolean
  sessionId?: string
  days?: number
  summary?: {
    firstSeen: string | null
    lastSeen: string | null
    events: number
    userId: string | null
    userEmail: string | null
    anonymousId: string | null
    userAgent: string | null
    ip: string | null
  }
  events?: EventRow[]
  error?: string
}

function fmt(ts: string) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ts
  }
}

export default function AdminSessionDetailPage({ params, searchParams }: any) {
  const sessionId = decodeURIComponent(params.sessionId || "")
  const days = Number(searchParams?.days || 30) || 30

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SessionResponse | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/admin/analytics/sessions/${encodeURIComponent(sessionId)}?days=${days}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Cache-Control": "no-store" },
          }
        )
        const json = (await res.json().catch(() => null)) as SessionResponse | null
        if (res.ok && json?.success) setData(json)
        else setData(null)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [sessionId, days])

  const events = useMemo(() => data?.events || [], [data])

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Session</h1>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 12, opacity: 0.75 }}>
            {loading ? "Loading…" : `${events.length} events — last ${days} days`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link
            href={`/admin/sessions?days=${days}`}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              fontSize: 12,
              textDecoration: "none",
            }}
          >
            Back to Sessions
          </Link>
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
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Session: {sessionId}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>First: {data?.summary?.firstSeen ? fmt(data.summary.firstSeen) : "—"}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Last: {data?.summary?.lastSeen ? fmt(data.summary.lastSeen) : "—"}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            User: {data?.summary?.userEmail || data?.summary?.userId || data?.summary?.anonymousId || "—"}
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
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Timeline</div>
        <div style={{ display: "grid", gap: 8 }}>
          {events.map((e, idx) => (
            <div
              key={e.id}
              style={{
                borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                paddingTop: idx === 0 ? 0 : 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9 }}>{e.event_name}</div>
                <div style={{ fontSize: 11, opacity: 0.6, whiteSpace: "nowrap" }}>{fmt(e.created_at)}</div>
              </div>
              <div style={{ marginTop: 4, fontSize: 12, opacity: 0.85 }}>
                {e.path ? <span style={{ opacity: 0.95 }}>{e.path}</span> : <span style={{ opacity: 0.6 }}>—</span>}
              </div>
              {e.referrer ? (
                <div style={{ marginTop: 2, fontSize: 11, opacity: 0.55 }}>
                  Referrer: {String(e.referrer).slice(0, 140)}
                </div>
              ) : null}
              {e.properties && Object.keys(e.properties || {}).length ? (
                <pre
                  style={{
                    marginTop: 6,
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(0,0,0,0.35)",
                    overflowX: "auto",
                    fontSize: 11,
                    opacity: 0.9,
                  }}
                >
                  {JSON.stringify(e.properties, null, 2)}
                </pre>
              ) : null}
            </div>
          ))}

          {!loading && events.length === 0 ? (
            <div style={{ padding: 10, opacity: 0.7, fontSize: 12 }}>No events found for this session.</div>
          ) : null}
        </div>
      </div>

      {data?.error ? (
        <div style={{ marginTop: 10, fontSize: 12, color: "#fb7185" }}>{data.error}</div>
      ) : null}
    </div>
  )
}
