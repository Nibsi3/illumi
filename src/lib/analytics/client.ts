function getOrCreateId(key: string) {
  if (typeof window === "undefined") return null
  try {
    const existing = window.localStorage.getItem(key)
    if (existing && existing.length >= 8) return existing
    const id = crypto.randomUUID()
    window.localStorage.setItem(key, id)
    return id
  } catch {
    return null
  }
}

export function getAnonymousId() {
  return getOrCreateId("illumi_anon_id")
}

export function getSessionId() {
  return getOrCreateId("illumi_session_id")
}

export async function trackEvent(
  event_name: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === "undefined") return
  if (!event_name || typeof event_name !== "string") return

  const anonymous_id = getAnonymousId()
  const session_id = getSessionId()

  const payload = {
    event_name,
    path: window.location?.pathname || null,
    referrer: document?.referrer || null,
    anonymous_id,
    session_id,
    properties: properties || {},
  }

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" })
      const ok = navigator.sendBeacon("/api/analytics/track", blob)
      if (!ok) {
        console.error("[analytics] sendBeacon failed")
      }
      return
    }

    const res = await fetch("/api/analytics/track", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.error("[analytics] track failed", res.status, text)
    }
  } catch (e) {
    console.error("[analytics] track exception", e)
    return
  }
}

export async function trackFeatureUsage(feature: string, properties?: Record<string, unknown>) {
  const name = (feature || "").toString().trim()
  if (!name) return
  return trackEvent("feature_use", {
    feature: name,
    ...(properties || {}),
  })
}
