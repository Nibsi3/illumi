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
        title: "General",
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
            <div className="flex items-center gap-1 border-b border-white/5 mb-8 no-scrollbar">
                {settingsNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                            pathname === item.href || (item.href === "/settings" && pathname === "/settings")
                                ? "text-white border-white"
                                : "text-neutral-500 border-transparent hover:text-white hover:border-white/20"
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>

            {/* Settings Content */}
            <div>
                {children}
            </div>
        </div>
    )
}
