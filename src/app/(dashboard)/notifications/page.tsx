"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Settings } from "lucide-react"
import { IconCash, IconReceipt, IconClock, IconAlertCircle, IconBell } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Notification {
    id: string
    type: 'payment_received' | 'invoice_sent' | 'payment_reminder' | 'final_notice' | 'invoice_overdue'
    title: string
    message: string | null
    amount: number | null
    read: boolean
    created_at: string
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
    payment_received: "text-emerald-500 bg-emerald-500/10",
    invoice_sent: "text-blue-500 bg-blue-500/10",
    payment_reminder: "text-amber-500 bg-amber-500/10",
    final_notice: "text-red-500 bg-red-500/10",
    invoice_overdue: "text-red-500 bg-red-500/10",
}

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState<"inbox" | "archive">("inbox")
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications?limit=50')
            const data = await res.json()
            if (data.notifications) {
                setNotifications(data.notifications)
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const archiveAll = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true })
            })
            setNotifications(notifications.map(n => ({ ...n, read: true })))
        } catch (error) {
            console.error("Failed to archive all:", error)
        }
    }

    const deleteNotification = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [id] })
            })
            setNotifications(notifications.filter(n => n.id !== id))
        } catch (error) {
            console.error("Failed to delete notification:", error)
        }
    }

    const filteredNotifications = activeTab === "inbox"
        ? notifications.filter(n => !n.read)
        : notifications.filter(n => n.read)

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
        <div className="max-w-4xl mx-auto pb-32">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-medium mb-1">Notifications</h1>
                <p className="text-muted-foreground">Stay updated on payments, invoices, and important updates.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab("inbox")}
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                            activeTab === "inbox"
                                ? "text-white border-white"
                                : "text-neutral-500 border-transparent hover:text-white"
                        )}
                    >
                        Inbox ({notifications.filter(n => !n.read).length})
                    </button>
                    <button
                        onClick={() => setActiveTab("archive")}
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                            activeTab === "archive"
                                ? "text-white border-white"
                                : "text-neutral-500 border-transparent hover:text-white"
                        )}
                    >
                        Archive
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {activeTab === "inbox" && filteredNotifications.length > 0 && (
                        <Button
                            variant="ghost"
                            onClick={archiveAll}
                            className="text-xs text-neutral-500 hover:text-white"
                        >
                            Archive all
                        </Button>
                    )}
                    <Link href="/settings/notifications">
                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="text-center py-12 text-neutral-500">
                        <p>Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        <p>No notifications in {activeTab}</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => {
                        const Icon = typeIcons[notification.type] || IconBell
                        const colorClass = typeColors[notification.type] || "text-white bg-white/10"

                        return (
                            <div
                                key={notification.id}
                                className={cn(
                                    "p-4 rounded-lg border border-white/5 bg-[#09090b] hover:bg-white/5 transition-colors flex items-start gap-4 group",
                                    !notification.read && "bg-white/2"
                                )}
                            >
                                <div className={cn("p-2 rounded-lg", colorClass)}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <div>
                                            <h3 className="text-sm font-medium text-white mb-1">
                                                {notification.title}
                                            </h3>
                                            {notification.message && (
                                                <p className="text-xs text-neutral-400 mb-2">
                                                    {notification.message}
                                                </p>
                                            )}
                                            {notification.amount && notification.type === 'payment_received' && (
                                                <p className="text-sm font-semibold text-emerald-500">
                                                    {formatAmount(notification.amount, notification.invoices?.currency)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                            {notification.type.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                            {formatTime(notification.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteNotification(notification.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
