"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type NotificationSetting = {
    id: string
    label: string
    description: string
    inApp: boolean
    email: boolean
}

const invoiceNotifications: NotificationSetting[] = [
    { id: "paid", label: "Paid", description: "Get notified when invoices are paid", inApp: true, email: true },
    { id: "overdue", label: "Overdue", description: "Get notified when invoices become overdue", inApp: true, email: true },
    { id: "scheduled", label: "Scheduled", description: "Get notified when invoices are scheduled for sending", inApp: true, email: false },
    { id: "sent", label: "Sent", description: "Get notified when invoices are successfully sent", inApp: true, email: false },
    { id: "reminder-sent", label: "Reminder Sent", description: "Get notified when invoice reminders are sent", inApp: true, email: false },
    { id: "cancelled", label: "Cancelled", description: "Get notified when invoices are cancelled", inApp: true, email: false },
    { id: "created", label: "Created", description: "Get notified when new invoices are created", inApp: true, email: false },
    { id: "refunded", label: "Refunded", description: "Get notified when invoice payments are refunded", inApp: true, email: false },
    { id: "recurring-completed", label: "Recurring Series Completed", description: "Get notified when a recurring invoice series finishes", inApp: true, email: false },
    { id: "recurring-started", label: "Recurring Series Started", description: "Get notified when a new recurring invoice series begins", inApp: true, email: false },
    { id: "recurring-paused", label: "Recurring Series Paused", description: "Get notified when a recurring invoice series is paused", inApp: true, email: false },
    { id: "upcoming-recurring", label: "Upcoming Recurring Invoice", description: "Get notified 24 hours before a recurring invoice is generated", inApp: true, email: true },
]

const paymentNotifications: NotificationSetting[] = [
    { id: "email-payment", label: "Email Payments", description: "Get notified when payment confirmations arrive via email", inApp: true, email: true },
    { id: "bank-payment", label: "Bank Payments", description: "Get notified when payments are detected from connected banks", inApp: true, email: false },
]

const inboxNotifications: NotificationSetting[] = [
    { id: "new-items", label: "New Inbox Items", description: "Get notified when new items arrive in your inbox", inApp: true, email: false },
    { id: "auto-matched", label: "Auto-matched", description: "Get notified when documents are automatically matched with transactions", inApp: true, email: false },
    { id: "needs-review", label: "Needs Review", description: "Get notified when potential matches are found that need your review", inApp: true, email: false },
    { id: "cross-currency", label: "Cross-currency Match", description: "Get notified when documents are matched with transactions in different currencies", inApp: true, email: false },
]

export default function NotificationsSettingsPage() {
    const [invoiceSettings, setInvoiceSettings] = useState(invoiceNotifications)
    const [paymentSettings, setPaymentSettings] = useState(paymentNotifications)
    const [inboxSettings, setInboxSettings] = useState(inboxNotifications)
    const [expandedSections, setExpandedSections] = useState<string[]>(["invoices", "payments", "inbox"])

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        )
    }

    const toggleSetting = (
        settings: NotificationSetting[],
        setSettings: React.Dispatch<React.SetStateAction<NotificationSetting[]>>,
        id: string,
        type: "inApp" | "email"
    ) => {
        setSettings(prev =>
            prev.map(setting =>
                setting.id === id
                    ? { ...setting, [type]: !setting[type] }
                    : setting
            )
        )
    }

    return (
        <div className="pb-32">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-1">Notifications</h1>
                <p className="hidden sm:block text-muted-foreground">Manage your personal notification settings for this team.</p>
            </div>

            {/* Invoices Section */}
            <div className="mb-8 border border-white/5 rounded-xl bg-[#09090b] overflow-hidden">
                <button
                    onClick={() => toggleSection("invoices")}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                >
                    <h2 className="text-lg font-medium text-white">Invoices</h2>
                    <span className={cn(
                        "text-neutral-500 transition-transform",
                        expandedSections.includes("invoices") ? "rotate-180" : ""
                    )}>
                        ↑
                    </span>
                </button>
                {expandedSections.includes("invoices") && (
                    <div className="px-6 pb-6 space-y-4">
                        {invoiceSettings.map((setting) => (
                            <div key={setting.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-white mb-1">{setting.label}</h3>
                                    <p className="text-xs text-neutral-500">{setting.description}</p>
                                </div>
                                <div className="flex items-center gap-4 sm:gap-6 sm:ml-8">
                                    <button
                                        onClick={() => toggleSetting(invoiceSettings, setInvoiceSettings, setting.id, "inApp")}
                                        className={cn(
                                            "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                                            setting.inApp
                                                ? "bg-white border-white"
                                                : "border-white/20 hover:border-white/40"
                                        )}
                                    >
                                        {setting.inApp && <Check className="h-3 w-3 text-black" />}
                                    </button>
                                    <span className="text-xs text-neutral-500">In-app</span>
                                    {setting.email !== undefined && (
                                        <>
                                            <button
                                                onClick={() => toggleSetting(invoiceSettings, setInvoiceSettings, setting.id, "email")}
                                                className={cn(
                                                    "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                                                    setting.email
                                                        ? "bg-white border-white"
                                                        : "border-white/20 hover:border-white/40"
                                                )}
                                            >
                                                {setting.email && <Check className="h-3 w-3 text-black" />}
                                            </button>
                                            <span className="text-xs text-neutral-500">Email</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payments Section */}
            <div className="mb-8 border border-white/5 rounded-xl bg-[#09090b] overflow-hidden">
                <button
                    onClick={() => toggleSection("payments")}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                >
                    <h2 className="text-lg font-medium text-white">Payments</h2>
                    <span className={cn(
                        "text-neutral-500 transition-transform",
                        expandedSections.includes("payments") ? "rotate-180" : ""
                    )}>
                        ↑
                    </span>
                </button>
                {expandedSections.includes("payments") && (
                    <div className="px-6 pb-6 space-y-4">
                        {paymentSettings.map((setting) => (
                            <div key={setting.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-white mb-1">{setting.label}</h3>
                                    <p className="text-xs text-neutral-500">{setting.description}</p>
                                </div>
                                <div className="flex items-center gap-4 sm:gap-6 sm:ml-8">
                                    <button
                                        onClick={() => toggleSetting(paymentSettings, setPaymentSettings, setting.id, "inApp")}
                                        className={cn(
                                            "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                                            setting.inApp
                                                ? "bg-white border-white"
                                                : "border-white/20 hover:border-white/40"
                                        )}
                                    >
                                        {setting.inApp && <Check className="h-3 w-3 text-black" />}
                                    </button>
                                    <span className="text-xs text-neutral-500">In-app</span>
                                    {setting.email !== undefined && (
                                        <>
                                            <button
                                                onClick={() => toggleSetting(paymentSettings, setPaymentSettings, setting.id, "email")}
                                                className={cn(
                                                    "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                                                    setting.email
                                                        ? "bg-white border-white"
                                                        : "border-white/20 hover:border-white/40"
                                                )}
                                            >
                                                {setting.email && <Check className="h-3 w-3 text-black" />}
                                            </button>
                                            <span className="text-xs text-neutral-500">Email</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Inbox Section */}
            <div className="mb-8 border border-white/5 rounded-xl bg-[#09090b] overflow-hidden">
                <button
                    onClick={() => toggleSection("inbox")}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                >
                    <h2 className="text-lg font-medium text-white">Inbox</h2>
                    <span className={cn(
                        "text-neutral-500 transition-transform",
                        expandedSections.includes("inbox") ? "rotate-180" : ""
                    )}>
                        ↑
                    </span>
                </button>
                {expandedSections.includes("inbox") && (
                    <div className="px-6 pb-6 space-y-4">
                        {inboxSettings.map((setting) => (
                            <div key={setting.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-white mb-1">{setting.label}</h3>
                                    <p className="text-xs text-neutral-500">{setting.description}</p>
                                </div>
                                <div className="flex items-center gap-4 sm:gap-6 sm:ml-8">
                                    <button
                                        onClick={() => toggleSetting(inboxSettings, setInboxSettings, setting.id, "inApp")}
                                        className={cn(
                                            "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                                            setting.inApp
                                                ? "bg-white border-white"
                                                : "border-white/20 hover:border-white/40"
                                        )}
                                    >
                                        {setting.inApp && <Check className="h-3 w-3 text-black" />}
                                    </button>
                                    <span className="text-xs text-neutral-500">In-app</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

