"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Settings, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const mockNotifications = [
    {
        id: "1",
        type: "payment",
        source: "whatsapp",
        title: "Payment received via WhatsApp",
        message: "Invoice #INV-0001 has been paid by Acme Corp",
        amount: "ZAR 5,000.00",
        time: "2 hours ago",
        read: false,
    },
    {
        id: "2",
        type: "payment",
        source: "email",
        title: "Payment confirmation email",
        message: "Standard Bank payment confirmation for Invoice #INV-0002",
        amount: "ZAR 800.00",
        time: "5 hours ago",
        read: false,
    },
    {
        id: "3",
        type: "invoice",
        source: "system",
        title: "Invoice sent successfully",
        message: "Invoice #INV-0003 has been sent to wefwe",
        time: "1 day ago",
        read: true,
    },
    {
        id: "4",
        type: "payment",
        source: "whatsapp",
        title: "Payment received via WhatsApp",
        message: "Invoice #INV-0004 has been paid by Globex Corporation",
        amount: "ZAR 12,500.00",
        time: "2 days ago",
        read: true,
    },
]

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState<"inbox" | "archive">("inbox")
    const [notifications, setNotifications] = useState(mockNotifications)

    const archiveAll = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const filteredNotifications = activeTab === "inbox" 
        ? notifications.filter(n => !n.read)
        : notifications.filter(n => n.read)

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
                        Inbox
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
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        <p>No notifications in {activeTab}</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                                "p-4 rounded-lg border border-white/5 bg-[#09090b] hover:bg-white/5 transition-colors flex items-start gap-4 group",
                                !notification.read && "bg-white/[0.02]"
                            )}
                        >
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">
                                            {notification.title}
                                        </h3>
                                        <p className="text-xs text-neutral-400 mb-2">
                                            {notification.message}
                                        </p>
                                        {notification.amount && (
                                            <p className="text-sm font-semibold text-green-500">
                                                {notification.amount}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                        {notification.source}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        {notification.time}
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
                    ))
                )}
            </div>
        </div>
    )
}

