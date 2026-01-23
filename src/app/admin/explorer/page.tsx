"use client"

import { useEffect, useMemo, useState } from "react"

type EventRow = {
  id: string
  created_at: string
  event_name: string
  path: string | null
  referrer: string | null
  user_email: string | null
  user_id: string | null
  anonymous_id: string | null
  session_id: string | null
  ip: string | null
  user_agent: string | null
  properties: any
}

type SearchResponse = {
  success: boolean
  total?: number
  offset?: number
  limit?: number
  events?: EventRow[]
  error?: string
}

function buildQuery(params: Record<string, string>) {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v)
  }
  return usp.toString()
}

export default function AdminExplorerPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [event, setEvent] = useState("")
  const [path, setPath] = useState("")
  const [email, setEmail] = useState("")
  const [anon, setAnon] = useState("")
  const [session, setSession] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(50)

  const [rows, setRows] = useState<EventRow[]>([])
  const [total, setTotal] = useState(0)

  const queryString = useMemo(() => {
    return buildQuery({
      event: event.trim(),
      path: path.trim(),
      email: email.trim(),
      anon: anon.trim(),
      session: session.trim(),
      from: from.trim(),
      to: to.trim(),
      limit: String(limit),
      offset: String(offset),
    })
  }, [event, path, email, anon, session, from, to, limit, offset])

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/analytics/events-search?${queryString}`, {
        method: "GET",
        credentials: "include",
        headers: { "Cache-Control": "no-store" },
      })
      const json = (await res.json().catch(() => null)) as SearchResponse | null
      if (!res.ok || !json?.success) {
        setRows([])
        setTotal(0)
        setError(json?.error || `Request failed (${res.status})`)
        return
      }
      setRows(json.events || [])
      setTotal(json.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString])

  const canPrev = offset > 0
  const canNext = offset + limit < total

  const exportCsvUrl = useMemo(() => {
    const qs = buildQuery({
      event: event.trim(),
      path: path.trim(),
      email: email.trim(),
      anon: anon.trim(),
      session: session.trim(),
      from: from.trim(),
      to: to.trim(),
      limit: String(limit),
      offset: String(offset),
      format: "csv",
    })
    return `/api/admin/analytics/events-search?${qs}`
  }, [event, path, email, anon, session, from, to, limit, offset])

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Events Explorer</h1>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 12, opacity: 0.75 }}>
            {loading ? "Loading…" : `${total} events`}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <a
            href={exportCsvUrl}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              textDecoration: "none",
              fontSize: 12,
            }}
          >
            Export CSV
          </a>
          <button
            type="button"
            onClick={() => {
              setOffset(0)
              run()
            }}
            style={{
              cursor: "pointer",
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              fontSize: 12,
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 10,
        }}
      >
        {[
          { label: "Event", value: event, set: setEvent },
          { label: "Path", value: path, set: setPath },
          { label: "Email", value: email, set: setEmail },
          { label: "Anon", value: anon, set: setAnon },
          { label: "Session", value: session, set: setSession },
        ].map((f) => (
          <div key={f.label}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>{f.label}</div>
            <input
              value={f.value}
              onChange={(e) => {
                f.set(e.target.value)
                setOffset(0)
              }}
              style={{
                width: "100%",
                padding: "10px 10px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.03)",
                color: "#fff",
                outline: "none",
                fontSize: 12,
              }}
            />
          </div>
        ))}

        <div>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>From (ISO)</div>
          <input
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              setOffset(0)
            }}
            placeholder="2026-01-01T00:00:00Z"
            style={{
              width: "100%",
              padding: "10px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              outline: "none",
              fontSize: 12,
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>To (ISO)</div>
          <input
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              setOffset(0)
            }}
            placeholder="2026-01-31T23:59:59Z"
            style={{
              width: "100%",
              padding: "10px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              outline: "none",
              fontSize: 12,
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>Page size</div>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value) || 50)
              setOffset(0)
            }}
            style={{
              width: "100%",
              padding: "10px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              outline: "none",
              fontSize: 12,
            }}
          >
            {[25, 50, 100, 200, 500].map((n) => (
              <option key={n} value={n} style={{ background: "#0a0a0a" }}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div style={{ marginTop: 12, fontSize: 12, color: "#fb7185" }}>{error}</div>
      ) : null}

      <div style={{ height: 12 }} />

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setOffset(Math.max(0, offset - limit))}
          style={{
            cursor: canPrev ? "pointer" : "not-allowed",
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            fontSize: 12,
            opacity: canPrev ? 1 : 0.4,
          }}
        >
          Prev
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setOffset(offset + limit)}
          style={{
            cursor: canNext ? "pointer" : "not-allowed",
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            fontSize: 12,
            opacity: canNext ? 1 : 0.4,
          }}
        >
          Next
        </button>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {total === 0 ? "" : `${offset + 1}-${Math.min(total, offset + limit)} of ${total}`}
        </div>
      </div>

      <div style={{ height: 10 }} />

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                "Time",
                "Event",
                "Path",
                "Email",
                "Anon",
                "Session",
                "Referrer",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 8px",
                    fontSize: 11,
                    opacity: 0.7,
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, whiteSpace: "nowrap" }}>
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
                  {r.event_name}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
                  {r.path || ""}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
                  {r.user_email || ""}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
                  {r.anonymous_id || ""}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
                  {r.session_id || ""}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
                  {r.referrer || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
