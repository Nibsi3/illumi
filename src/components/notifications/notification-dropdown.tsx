"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconBell, IconX } from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Notification {
    id: string
    title: string
    message: string
    time: string
    read: boolean
    type: "payment" | "update" | "system"
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "New document synced from your gmail account",
        message: "",
        time: "about 7 hours ago",
        read: false,
        type: "system"
    }
]

export function NotificationDropdown() {
    const [activeTab, setActiveTab] = useState<"inbox" | "archive">("inbox")
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
    const [archived, setArchived] = useState<Notification[]>([])

    const unreadCount = notifications.filter(n => !n.read).length

    const handleArchive = (id: string) => {
        const item = notifications.find(n => n.id === id)
        if (item) {
            setNotifications(prev => prev.filter(n => n.id !== id))
            setArchived(prev => [{ ...item, read: true }, ...prev])
        }
    }

    const handleArchiveAll = () => {
        setArchived(prev => [...notifications.map(n => ({ ...n, read: true })), ...prev])
        setNotifications([])
    }

    const handleRemove = (id: string, fromArchive = false) => {
        if (fromArchive) {
            setArchived(prev => prev.filter(n => n.id !== id))
        } else {
            setNotifications(prev => prev.filter(n => n.id !== id))
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-none relative"
                >
                    <IconBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[420px] bg-[#09090b] border-white/10 text-white p-0 shadow-2xl rounded-lg mt-2"
            >
                {/* Header with Tabs */}
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab("inbox")}
                            className={cn(
                                "text-sm font-medium transition-colors pb-1 border-b-2",
                                activeTab === "inbox"
                                    ? "text-white border-white"
                                    : "text-neutral-500 border-transparent hover:text-white"
                            )}
                        >
                            Inbox
                        </button>
                        <button
                            onClick={() => setActiveTab("archive")}
                            className={cn(
                                "text-sm font-medium transition-colors pb-1 border-b-2",
                                activeTab === "archive"
                                    ? "text-white border-white"
                                    : "text-neutral-500 border-transparent hover:text-white"
                            )}
                        >
                            Archive
                        </button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-neutral-500 hover:text-white hover:bg-white/5 rounded-md"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </Button>
                </div>

                {/* Notification List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {activeTab === "inbox" ? (
                        notifications.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="px-4 py-3 hover:bg-white/5 transition-colors group relative border-l-2 border-transparent"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <Link href="/inbox" className="flex-1">
                                                        <p className="text-sm font-medium text-white leading-snug">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">
                                                            {notification.time}
                                                        </p>
                                                    </Link>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleArchive(notification.id)}
                                                            className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded-md transition-all"
                                                            title="Archive"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemove(notification.id)}
                                                            className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                                                            title="Delete"
                                                        >
                                                            <IconX className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {!notification.read && (
                                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-500 rounded-full" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <p className="text-sm text-neutral-500">No new notifications</p>
                            </div>
                        )
                    ) : (
                        archived.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {archived.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="px-4 py-3 hover:bg-white/5 transition-colors group relative opacity-60 hover:opacity-100"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-white leading-snug">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 mt-1">
                                                            Archived
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(notification.id, true)}
                                                        className="p-1 text-neutral-500 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <IconX className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <p className="text-sm text-neutral-500">No archived notifications</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                {activeTab === "inbox" && notifications.length > 0 && (
                    <div className="border-t border-white/5 px-4 py-3">
                        <button
                            onClick={handleArchiveAll}
                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                            Archive all
                        </button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
