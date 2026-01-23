"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics/client"

function safeText(value: string) {
  const t = value.replace(/\s+/g, " ").trim()
  if (!t) return null
  return t.slice(0, 80)
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (lastPathRef.current === pathname) return
    lastPathRef.current = pathname
    trackEvent("page_view", { pathname })
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const el = target.closest<HTMLElement>("a,button,[role='button'],[data-analytics]")
      if (!el) return

      const tag = el.tagName?.toLowerCase?.() || null
      const href = tag === "a" ? (el as HTMLAnchorElement).href : null
      const label = safeText(el.getAttribute("data-analytics") || el.textContent || "")

      trackEvent("click", {
        tag,
        href,
        id: el.id || null,
        class: el.className || null,
        label,
      })
    }

    document.addEventListener("click", onClick, { capture: true })
    return () => {
      document.removeEventListener("click", onClick, { capture: true } as any)
    }
  }, [])

  return null
}
