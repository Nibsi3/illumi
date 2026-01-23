"use client"

import { useEffect, useState } from "react"

type EventRow = {
  id: string
  created_at: string
  event_name: string
  path: string | null
  user_email: string | null
  anonymous_id: string | null
  session_id: string | null
}

type EventsResponse = {
  success: boolean
  events?: EventRow[]
  error?: string
}

export default function AdminEventsPage() {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<EventRow[]>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/analytics/events?limit=200", {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-store",
          },
        })
        const json = (await res.json().catch(() => null)) as EventsResponse | null
        if (res.ok && json?.success && Array.isArray(json.events)) {
          setEvents(json.events)
        } else {
          setEvents([])
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Events</h1>
      <p style={{ marginTop: 6, marginBottom: 16, fontSize: 12, opacity: 0.75 }}>
        {loading ? "Loading…" : `Showing ${events.length} events`}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Time</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Event</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Path</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>User</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Anon</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{new Date(e.created_at).toLocaleString()}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{e.event_name}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{e.path || ""}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{e.user_email || ""}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{e.anonymous_id || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
