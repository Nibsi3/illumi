"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export function ThemeToggle({
  theme,
  onToggle,
  shimmer = false,
  className = "",
}: {
  theme: "light" | "dark"
  onToggle: () => void
  shimmer?: boolean
  className?: string
}) {
  const [isShimmering, setIsShimmering] = useState(false)

  useEffect(() => {
    if (!shimmer) return

    const initialTimeout = window.setTimeout(() => {
      setIsShimmering(true)
      window.setTimeout(() => setIsShimmering(false), 1000)
    }, 3000)

    const interval = window.setInterval(() => {
      setIsShimmering(true)
      window.setTimeout(() => setIsShimmering(false), 1000)
    }, 15000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [shimmer])

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors overflow-hidden focus:outline-none focus-visible:ring-0 ${isShimmering ? "animate-shimmer" : ""} ${className}`}
    >
      {isShimmering && (
        <span className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1s_ease-in-out]">
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        </span>
      )}
      {theme === "dark" ? (
        <IconSun className="h-4 w-4 relative z-10" />
      ) : (
        <IconMoon className="h-4 w-4 relative z-10" />
      )}
    </button>
  )
}
