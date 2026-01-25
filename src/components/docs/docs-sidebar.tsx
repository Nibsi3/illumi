"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type DocsNavItem = {
    title: string
    href: string
    description?: string
}

type DocsNavGroup = {
    title: string
    items: DocsNavItem[]
}

const NAV: DocsNavGroup[] = [
    {
        title: "Start",
        items: [
            { title: "Getting started", href: "/docs/getting-started", description: "Set up Illumi end-to-end" },
            { title: "Workspace", href: "/docs/workspace", description: "Defaults & team" },
        ],
    },
    {
        title: "Core",
        items: [
            { title: "Clients", href: "/docs/clients", description: "Billing details" },
            { title: "Invoices", href: "/docs/invoicing", description: "Create, send, track" },
            { title: "Send invoices by email", href: "/docs/send-invoices-by-email", description: "Email delivery" },
            { title: "Client portal links", href: "/docs/client-portal", description: "View & pay link" },
        ],
    },
    {
        title: "Payments",
        items: [
            { title: "PayGate", href: "/docs/paygate", description: "Online payments" },
            { title: "PayGate & payments", href: "/docs/payments", description: "Overview" },
            { title: "Connecting PayFast", href: "/docs/payfast-online-payments", description: "Provider setup" },
        ],
    },
    {
        title: "Ops",
        items: [
            { title: "Expenses", href: "/docs/expenses", description: "Track & export" },
            { title: "Vault", href: "/docs/vault", description: "Store receipts" },
            { title: "Settings & billing", href: "/docs/settings", description: "Workspace settings" },
        ],
    },
    {
        title: "Help",
        items: [
            { title: "Troubleshooting", href: "/docs/troubleshooting", description: "Quick fixes" },
            { title: "Contact support", href: "/contact", description: "Get help" },
        ],
    },
]

export function DocsSidebar() {
    const pathname = usePathname()

    return (
        <nav className="w-full h-full overflow-y-auto">
            <div className="p-6 border-b border-border">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Documentation</div>
                <div className="text-xs text-muted-foreground mt-1">Jump between guides</div>
            </div>
            <div className="p-4 space-y-6">
                {NAV.map((group) => (
                    <div key={group.title} className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">{group.title}</div>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "block px-3 py-2 transition-colors",
                                            isActive
                                                ? "bg-accent text-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <div className="text-sm font-medium">{item.title}</div>
                                        {item.description && (
                                            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    )
}
