import Link from "next/link"
import { Metadata } from "next"
import fs from "fs"
import path from "path"
import { notFound } from 'next/navigation'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
    title: "Sitemap | Illumi",
    description: "Browse all public pages on Illumi — features, resources, documentation, and company pages.",
    alternates: {
        canonical: "/site-map",
    },
}

function isRouteGroup(segment: string) {
    return segment.startsWith("(") && segment.endsWith(")")
}

function isDynamicSegment(segment: string) {
    return segment.startsWith("[") && segment.endsWith("]")
}

function shouldExcludeSegments(segments: string[]) {
    const normalized = segments.filter(Boolean)

    if (normalized.some(isDynamicSegment)) return true

    const withoutGroups = normalized.filter((s) => !isRouteGroup(s))
    const first = withoutGroups[0]
    if (!first) return false

    return (
        first === "api" ||
        first === "auth" ||
        first === "pay" ||
        first === "view" ||
        first === "login" ||
        first === "invite" ||
        first === "apps" ||
        first === "overview" ||
        first === "clients" ||
        first === "expenses" ||
        first === "inbox" ||
        first === "invoices" ||
        first === "notifications" ||
        first === "products" ||
        first === "recurring" ||
        first === "transactions" ||
        first === "upgrade" ||
        first === "settings" ||
        first === "admin"
    )
}

function discoverPublicRoutes(): string[] {
    const appDir = path.join(process.cwd(), "src", "app")
    const results: string[] = []

    const walk = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
            if (entry.name.startsWith(".")) continue
            if (entry.name === "node_modules") continue

            const full = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                walk(full)
                continue
            }

            if (entry.isFile() && entry.name === "page.tsx") {
                const rel = path.relative(appDir, full)
                const segments = rel.split(path.sep)
                segments.pop()

                if (shouldExcludeSegments(segments)) continue

                const routeSegments = segments.filter((s) => !isRouteGroup(s))
                const routePath = "/" + routeSegments.join("/")
                results.push(routePath === "/" ? "/" : routePath.replace(/\/+$/g, ""))
            }
        }
    }

    walk(appDir)

    return Array.from(new Set(results)).sort((a, b) => a.localeCompare(b))
}

export default function SiteMapPage() {
    notFound()
}
