"use client"

import { useEffect, useState } from "react"

type UsersResponse = {
  success: boolean
  users?: {
    id: string
    email: string | null
    created_at: string | null
    last_sign_in_at: string | null
    app_metadata: any
    user_metadata: any
    identities: any
  }[]
  error?: string
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<NonNullable<UsersResponse["users"]>>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/analytics/users?limit=200", {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-store",
          },
        })
        const json = (await res.json().catch(() => null)) as UsersResponse | null
        if (res.ok && json?.success && Array.isArray(json.users)) {
          setUsers(json.users)
        } else {
          setUsers([])
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Users</h1>
      <p style={{ marginTop: 6, marginBottom: 16, fontSize: 12, opacity: 0.75 }}>
        {loading ? "Loading…" : `Showing ${users.length} users`}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Time</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Email</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>User ID</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Provider</th>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>Last sign-in</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const provider =
                (u.app_metadata && (u.app_metadata.provider || u.app_metadata.providers?.[0])) ||
                (Array.isArray(u.identities) && u.identities[0]?.provider) ||
                null

              return (
                <tr key={u.id}>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{u.created_at ? new Date(u.created_at).toLocaleString() : ""}</td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{u.email || ""}</td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{u.id}</td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{provider || ""}</td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : ""}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
