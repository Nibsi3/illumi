"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/features", label: "Features" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/explorer", label: "Explorer" },
    { href: "/admin/channels", label: "Channels" },
    { href: "/admin/devices", label: "Devices" },
    { href: "/admin/funnels", label: "Funnels" },
    { href: "/admin/sessions", label: "Sessions" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12, opacity: 0.8 }}>
            Illumi Admin
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: pathname === l.href ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 12,
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 16 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
