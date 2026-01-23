import Link from "next/link"
import { Metadata } from "next"
import fs from "fs"
import path from "path"

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

export default function HtmlSitemapPage() {
    const routes = discoverPublicRoutes()

    const sections: Array<{ title: string; filter: (p: string) => boolean }> = [
        { title: "Main", filter: (p) => ["/", "/pricing", "/contact", "/story"].includes(p) },
        { title: "Features", filter: (p) => p.startsWith("/features") },
        { title: "Resources", filter: (p) => p === "/resources" || p.startsWith("/resources/") },
        { title: "Documentation", filter: (p) => p === "/docs" || p.startsWith("/docs/") },
        { title: "Integrations", filter: (p) => p === "/integrations" || p.startsWith("/integrations/") },
        { title: "Legal", filter: (p) => ["/privacy", "/terms", "/terms-and-conditions"].includes(p) },
        { title: "Other", filter: (p) => true },
    ]

    const used = new Set<string>()

    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <div className="mx-auto max-w-5xl px-6 pt-32 pb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sitemap</h1>
                <p className="mt-3 text-white/60 max-w-2xl">
                    A complete list of Illumi’s public pages to help you navigate and help search engines discover the site.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {sections.map((section) => {
                        const items = routes.filter((p) => !used.has(p)).filter(section.filter)
                        items.forEach((p) => used.add(p))

                        if (items.length === 0) return null

                        return (
                            <div key={section.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                                <h2 className="text-sm uppercase tracking-widest font-bold text-white/70">{section.title}</h2>
                                <ul className="mt-4 space-y-2">
                                    {items.map((p) => (
                                        <li key={p}>
                                            <Link href={p} className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                                                {p}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
