"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    IconSettings,
    IconInbox,
    IconUsers,
    IconCreditCard,
    IconShieldLock,
    IconBell,
    IconMessageCircle
} from "@tabler/icons-react"

const settingsNavItems = [
    {
        title: "Invoice",
        href: "/settings",
    },
    {
        title: "Billing",
        href: "/settings/billing",
    },
    {
        title: "PayGate",
        href: "/settings/paygate",
    },
    {
        title: "Members",
        href: "/settings/members",
    },
    {
        title: "Notifications",
        href: "/settings/notifications",
    },
    {
        title: "Support",
        href: "/settings/support",
    },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="w-full pb-32">
            {/* Horizontal Tabs Navigation */}
            <div className="w-full max-w-full overflow-x-auto no-scrollbar">
                <div className="flex flex-nowrap items-center gap-1 border-b border-border mb-8">
                {settingsNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                            pathname === item.href || (item.href === "/settings" && pathname === "/settings")
                                ? "text-foreground border-border"
                                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
                </div>
            </div>

            {/* Settings Content */}
            <div>
                {children}
            </div>
        </div>
    )
}

