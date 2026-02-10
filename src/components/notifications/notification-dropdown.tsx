"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconBell, IconX, IconReceipt, IconCash, IconAlertCircle, IconClock } from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface Notification {
    id: string
    type: 'payment_received' | 'invoice_sent' | 'payment_reminder' | 'final_notice' | 'invoice_overdue'
    title: string
    message: string | null
    amount: number | null
    read: boolean
    created_at: string
    invoice_id?: string | null
    invoices?: {
        invoice_number: string
        total: number
        currency: string
    }
}

const typeIcons: Record<string, any> = {
    payment_received: IconCash,
    invoice_sent: IconReceipt,
    payment_reminder: IconClock,
    final_notice: IconAlertCircle,
    invoice_overdue: IconAlertCircle,
}

const typeColors: Record<string, string> = {
    payment_received: "text-emerald-500",
    invoice_sent: "text-blue-500",
    payment_reminder: "text-amber-500",
    final_notice: "text-red-500",
    invoice_overdue: "text-red-500",
}

const CACHE_TTL_MS = 10_000
let notificationsCache:
    | {
          fetchedAt: number
          unread: Notification[]
          read: Notification[]
      }
    | null = null

export function NotificationDropdown() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"inbox" | "archive">("inbox")
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [archived, setArchived] = useState<Notification[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchNotifications = async (opts?: { preferCache?: boolean }) => {
        const preferCache = opts?.preferCache ?? false

        if (preferCache && notificationsCache && Date.now() - notificationsCache.fetchedAt < CACHE_TTL_MS) {
            setNotifications(notificationsCache.unread)
            setArchived(notificationsCache.read)
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/notifications?limit=20')
            const data = await res.json()
            if (data.notifications) {
                const unread = data.notifications.filter((n: Notification) => !n.read)
                const read = data.notifications.filter((n: Notification) => n.read)
                setNotifications(unread)
                setArchived(read)
                notificationsCache = {
                    fetchedAt: Date.now(),
                    unread,
                    read,
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!open) {
            if (pollRef.current) {
                clearInterval(pollRef.current)
                pollRef.current = null
            }
            return
        }

        // When the dropdown opens, show cached results immediately (if fresh), then refresh.
        fetchNotifications({ preferCache: true })
        void fetchNotifications({ preferCache: false })

        // Poll only while open.
        pollRef.current = setInterval(() => {
            void fetchNotifications({ preferCache: false })
        }, 30000)

        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current)
                pollRef.current = null
            }
        }
    }, [open])

    const unreadCount = notifications.length

    const handleMarkAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [id] })
            })
            const item = notifications.find(n => n.id === id)
            if (item) {
                // Remove from notifications first
                setNotifications(prev => prev.filter(n => n.id !== id))
                // Add to archived with modified ID to prevent duplicates during transition
                setArchived(prev => {
                    // Check if already exists in archived
                    if (prev.some(n => n.id === id)) return prev
                    return [{ ...item, read: true }, ...prev]
                })
            }
        } catch (error) {
            console.error("Failed to mark as read:", error)
        }
    }


    const handleArchiveAll = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true })
            })
            setArchived(prev => [...notifications.map(n => ({ ...n, read: true })), ...prev])
            setNotifications([])
        } catch (error) {
            console.error("Failed to archive all:", error)
        }
    }

    const handleRemove = async (id: string, fromArchive = false) => {
        try {
            await fetch('/api/notifications', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [id] })
            })
            if (fromArchive) {
                setArchived(prev => prev.filter(n => n.id !== id))
            } else {
                setNotifications(prev => prev.filter(n => n.id !== id))
            }
        } catch (error) {
            console.error("Failed to delete notification:", error)
        }
    }

    const formatTime = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
        } catch {
            return dateStr
        }
    }

    const formatAmount = (amount: number | null, currency?: string) => {
        if (!amount) return null
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: currency || 'ZAR'
        }).format(amount)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-none relative"
                >
                    <IconBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[420px] bg-popover border-border text-popover-foreground p-0 shadow-2xl rounded-lg mt-2"
            >
                {/* Header with Tabs */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab("inbox")}
                            className={cn(
                                "text-sm font-medium transition-colors pb-1 border-b-2",
                                activeTab === "inbox"
                                    ? "text-foreground border-foreground"
                                    : "text-muted-foreground border-transparent hover:text-foreground"
                            )}
                        >
                            Inbox {unreadCount > 0 && `(${unreadCount})`}
                        </button>
                        <button
                            onClick={() => setActiveTab("archive")}
                            className={cn(
                                "text-sm font-medium transition-colors pb-1 border-b-2",
                                activeTab === "archive"
                                    ? "text-foreground border-foreground"
                                    : "text-muted-foreground border-transparent hover:text-foreground"
                            )}
                        >
                            Archive
                        </button>
                    </div>
                    <Link href="/settings/notifications">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Button>
                    </Link>
                </div>

                {/* Notification List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-12 text-center">
                            <p className="text-sm text-muted-foreground">Loading...</p>
                        </div>
                    ) : activeTab === "inbox" ? (
                        notifications.length > 0 ? (
                            <div className="divide-y divide-border">
                                {notifications.map((notification) => {
                                    const Icon = typeIcons[notification.type] || IconBell
                                    const colorClass = typeColors[notification.type] || "text-foreground"

                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "px-4 py-3 hover:bg-accent transition-colors group relative",
                                                notification.invoice_id ? "cursor-pointer" : ""
                                            )}
                                            onClick={async () => {
                                                if (!notification.invoice_id) return
                                                await handleMarkAsRead(notification.id)
                                                router.push(`/invoices/preview/${notification.invoice_id}`)
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn("mt-0.5", colorClass)}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-foreground leading-snug">
                                                                {notification.title}
                                                            </p>
                                                            {notification.message && (
                                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                                    {notification.message}
                                                                </p>
                                                            )}
                                                            {notification.amount && notification.type === 'payment_received' && (
                                                                <p className="text-sm font-semibold text-emerald-500 mt-1">
                                                                    {formatAmount(notification.amount, notification.invoices?.currency)}
                                                                </p>
                                                            )}
                                                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                                                                {formatTime(notification.created_at)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleMarkAsRead(notification.id)
                                                                }}
                                                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all"
                                                                title="Archive"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleRemove(notification.id)
                                                                }}
                                                                className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                                                                title="Delete"
                                                            >
                                                                <IconX className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-500 rounded-full" />
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <p className="text-sm text-muted-foreground">No new notifications</p>
                            </div>
                        )
                    ) : (
                        archived.length > 0 ? (
                            <div className="divide-y divide-border">
                                {archived.map((notification) => {
                                    const Icon = typeIcons[notification.type] || IconBell

                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "px-4 py-3 hover:bg-accent transition-colors group relative opacity-60 hover:opacity-100",
                                                notification.invoice_id ? "cursor-pointer" : ""
                                            )}
                                            onClick={() => {
                                                if (!notification.invoice_id) return
                                                router.push(`/invoices/preview/${notification.invoice_id}`)
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 text-muted-foreground">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-foreground leading-snug">
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {formatTime(notification.created_at)}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleRemove(notification.id, true)
                                                            }}
                                                            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <IconX className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <p className="text-sm text-muted-foreground">No archived notifications</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 py-3 flex items-center justify-between">
                    <div>
                        {activeTab === "inbox" && notifications.length > 0 && (
                            <button
                                onClick={handleArchiveAll}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Archive all
                            </button>
                        )}
                    </div>
                    <Link href="/notifications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        View all
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
