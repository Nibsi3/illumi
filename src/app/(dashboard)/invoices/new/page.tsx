"use client"

import React, { useState, useEffect, useRef, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ChevronLeft,
    Eye,
    Plus,
    Trash2,
    CalendarDays,
    Globe,
    CreditCard,
    Percent,
    Banknote,
    Mail,
    Send,
    MessageCircle,
    Copy,
    Trash,
    Check,
    ChevronDown,
    ChevronRight,
    Clock,
    Repeat,
    Settings2,
    LayoutTemplate
} from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { NumberInput } from "@/components/ui/number-input"
// Lazy load PreviewModal - only needed when user clicks Preview
const PreviewModal = lazy(() => import("../components/preview-modal").then(m => ({ default: m.PreviewModal })))
import { allClients } from "@/lib/data"
import { useSubscription } from "@/lib/subscription/hooks"
import { toast } from "sonner"
import { useSettings } from "@/lib/settings-context"
import { useWorkspace } from "@/lib/workspace-context"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { format, parseISO } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

import { CreateClientModal } from "../components/create-client-modal"
import { CreateProductModal } from "../components/create-product-modal"

type TemplateType = "Classic" | "Minimal" | "Modern"

export default function NewInvoicePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isPro } = useSubscription()
    const settings = useSettings()
    const { activeWorkspace } = useWorkspace()
    const { activePaymentProvider } = settings

    const isDev = process.env.NODE_ENV !== 'production'
    const debugLog = (...args: any[]) => {
        if (isDev) console.log(...args)
    }
    const debugWarn = (...args: any[]) => {
        if (isDev) console.warn(...args)
    }

    const invoiceCreationMode = (searchParams.get('mode') || 'invoice') as 'invoice' | 'scheduled' | 'recurring'
    const canDraft = invoiceCreationMode === 'invoice'
    const canSchedule = invoiceCreationMode === 'scheduled'
    const canRecurring = invoiceCreationMode === 'recurring'

    const [actionsOpen, setActionsOpen] = useState(false)
    const [schedulePopoverOpen, setSchedulePopoverOpen] = useState(false)
    const [recurringPopoverOpen, setRecurringPopoverOpen] = useState(false)
    const actionsPanelOpen = actionsOpen || schedulePopoverOpen || recurringPopoverOpen

    const timeQuickPicks = [
        '08:00',
        '09:00',
        '12:00',
        '14:00',
        '17:00',
        '18:00',
        '18:45',
        '20:00',
    ]

    const normalizeTimeInput = (raw: string) => {
        const cleaned = raw.replace(/[^0-9:]/g, '').slice(0, 5)
        if (cleaned.length <= 2) return cleaned
        if (cleaned.includes(':')) return cleaned
        return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`
    }

    const paygateLabel = (activePaymentProvider || 'payfast')
        .split('_')
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')

    const [template, setTemplate] = useState<TemplateType>("Classic")
    const [tasks, setTasks] = useState([
        { id: 1, description: "", price: 0, qty: 1 }
    ])

    // Invoice Settings State
    const currency = settings.currency || "ZAR"
    const taxRate = settings.taxRate || 0
    const [dateFormat, setDateFormat] = useState(settings.dateFormat ?? "DD/MM/YYYY")

    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [invoiceNumber, setInvoiceNumber] = useState("")
    const [clientName, setClientName] = useState("")
    // These are now just used for preview/display, not manual editing
    const [clientAddress, setClientAddress] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [clientPhone, setClientPhone] = useState("")

    const defaultFromName = "Illumi Professional"
    const defaultFromAddress = "123 Business Avenue\nInnovation District\nCape Town, 8001\nSouth Africa"

    const [fromName, setFromName] = useState(settings.companyName ?? defaultFromName)
    const [fromEmail, setFromEmail] = useState(settings.fromEmail ?? "hello@illumi.co.za")
    const [fromAddress, setFromAddress] = useState(settings.companyAddress ?? defaultFromAddress)
    const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [dueDate, setDueDate] = useState("")
    const [isIssueDateOpen, setIsIssueDateOpen] = useState(false)
    const [isDueDateOpen, setIsDueDateOpen] = useState(false)
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)

    const [invoiceMode, setInvoiceMode] = useState<"light" | "dark">("dark")
    const illumiLogoSrc = invoiceMode === 'light' ? '/midday-logo.png' : '/logo.png'

    const scrollToSection = (id: string) => {
        try {
            const el = document.getElementById(id)
            if (!el) return
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } catch {
            // ignore
        }
    }

    // Recurring State
    const [isRecurringEnabled, setIsRecurringEnabled] = useState(false)
    const [recurringInterval, setRecurringInterval] = useState("monthly")
    const [recurringEndType, setRecurringEndType] = useState<"on" | "after" | "never">("never")
    const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
    const [recurringEndCount, setRecurringEndCount] = useState(12)
    const [recurringDayOfWeek, setRecurringDayOfWeek] = useState<number>(4) // Thursday
    const [recurringDayOfMonth, setRecurringDayOfMonth] = useState<number>(22)
    const [recurringWeekOfMonth, setRecurringWeekOfMonth] = useState<string>("fourth")
    const [recurringCustomInterval, setRecurringCustomInterval] = useState<number>(1)
    const [recurringCustomUnit, setRecurringCustomUnit] = useState<string>("days")
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)

    // Schedule State
    const [isScheduled, setIsScheduled] = useState(false)
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date())
    const [scheduleTime, setScheduleTime] = useState("09:00")

    // Note
    const [invoiceNote, setInvoiceNote] = useState("")

    // Logo
    const [logo, setLogo] = useState<string | null>(settings.logo ?? null)

    // Sync from settings once loaded
    useEffect(() => {
        if (settings.logo && !logo) setLogo(settings.logo)
        if (settings.fromEmail && fromEmail === "hello@illumi.co.za") setFromEmail(settings.fromEmail)
        if (settings.companyName && fromName === defaultFromName) setFromName(settings.companyName)
        if (settings.companyAddress && fromAddress === defaultFromAddress) setFromAddress(settings.companyAddress)
    }, [settings.logo, settings.fromEmail, settings.companyName, settings.companyAddress])

    const [customers, setCustomers] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [customerId, setCustomerId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    // Helper functions restored
    const addTask = () => {
        setTasks([...tasks, { id: Date.now(), description: "", price: 0, qty: 1 }])
    }

    const removeTask = (id: number) => {
        if (tasks.length > 1) {
            setTasks(tasks.filter(t => t.id !== id))
        }
    }

    const calculateSubtotal = () => {
        return tasks.reduce((acc, task) => acc + (task.price * task.qty), 0)
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    const generateUniqueInvoiceNumber = () => {
        const datePart = format(new Date(), "yyyyMMdd")
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `INV-${datePart}-${randomPart}`
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setLogo(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
        }

        const fetchCustomers = async () => {
            if (!activeWorkspace) return
            const { data } = await supabase
                .from('customers')
                .select('*')
                .eq('workspace_id', activeWorkspace.id)
            if (data) setCustomers(data)
        }

        const fetchProducts = async () => {
            if (!activeWorkspace) return
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('workspace_id', activeWorkspace.id)
                .eq('status', 'active')
            if (data) setProducts(data)
        }

        if (!invoiceNumber) {
            setInvoiceNumber(generateUniqueInvoiceNumber())
        }

        checkAuth()
        fetchCustomers()
        fetchProducts()
    }, [router, supabase, activeWorkspace, invoiceNumber])

    const handleCreate = async (type: string) => {
        if (type === 'create') {
            if (!canDraft) {
                toast.error("Draft not available", { description: "Only standard invoices can be saved as a draft." })
                return
            }
            await handleSaveInvoice('draft')
        } else if (type === 'send') {
            if (canSchedule) {
                toast.error("Send now not available", { description: "Scheduled invoices must be scheduled." })
                return
            }
            if (canRecurring) {
                toast.error("Send now not available", { description: "Recurring invoices must be configured before sending." })
                return
            }
            await handleSaveInvoice('sent')
        } else if (type === 'schedule') {
            if (!canSchedule) {
                toast.error("Scheduling not available", { description: "Use Schedule Invoice to schedule an invoice." })
                return
            }
            if (scheduleDate) {
                const [hh, mm] = (scheduleTime || "09:00").split(":")
                const scheduled = new Date(scheduleDate)
                scheduled.setHours(Number(hh) || 0, Number(mm) || 0, 0, 0)
                await handleSaveInvoice('scheduled', { issueDate: scheduleDate, scheduledDate: scheduled })
            } else {
                toast.error("Please select a date first")
            }
        }
    }

    const handleSaveInvoice = async (status: 'draft' | 'sent' | 'scheduled' = 'draft', overrides: any = {}) => {
        // Prevent double-submission
        if (isSaving) {
            debugLog('[Invoice Save] Already saving, ignoring duplicate call')
            return
        }
        setIsSaving(true)
        debugLog('[Invoice Save] Starting save process...', { status, invoiceNumber, customerId })

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            debugLog('[Invoice Save] Auth check:', { userId: user?.id, userError })

            if (userError || !user) {
                toast.error("Session expired. Please log in again.")
                router.push('/login')
                return
            }

            // Calculate totals
            const subtotal = tasks.reduce((acc, t) => acc + (t.price * t.qty), 0)
            const taxAmount = subtotal * (taxRate / 100)
            const total = subtotal + taxAmount
            debugLog('[Invoice Save] Calculated totals:', { subtotal, taxAmount, total })

            // Prepare invoice data
            const isRecurring = overrides.isRecurring ?? isRecurringEnabled
            const rawEndType = overrides.recurringEndType ?? recurringEndType
            const normalizedEndType = rawEndType === 'after_minutes' ? 'after' : rawEndType
            const recurringEndDateForDb =
                isRecurring && normalizedEndType === 'on'
                    ? (overrides.recurringEndDate ?? recurringEndDate)
                    : null

            const recurringEndTypeForDb = !isRecurring
                ? null
                : normalizedEndType === 'on'
                    ? 'on'
                    : normalizedEndType === 'after'
                        ? 'after'
                        : null

            // Map UI interval values to DB-allowed values
            // DB constraint may vary by environment; prefer preserving the selected interval.
            const rawInterval = overrides.recurringInterval ?? recurringInterval
            const mapIntervalForDb = (interval: string): string | null => {
                if (!isRecurring) return null
                switch (interval) {
                    case 'minute': return 'minute'
                    case 'daily': return 'daily'
                    case 'weekly': return 'weekly'
                    case 'monthly': return 'monthly'
                    case 'quarterly': return 'quarterly'
                    case 'yearly': return 'yearly'
                    default: return 'monthly'
                }
            }
            const recurringIntervalForDb = mapIntervalForDb(rawInterval)

            const issueDateForDb = overrides.issueDate
                ? format(overrides.issueDate, 'yyyy-MM-dd')
                : (issueDate || format(new Date(), 'yyyy-MM-dd'))

            const scheduledDateForDb = overrides.scheduledDate instanceof Date
                ? overrides.scheduledDate.toISOString()
                : null

            const invoiceData: any = {
                user_id: user.id,
                workspace_id: activeWorkspace?.id,
                customer_id: customerId,
                invoice_number: invoiceNumber,
                issue_date: issueDateForDb,
                scheduled_date: status === 'scheduled' ? scheduledDateForDb : null,
                due_date: dueDate || null,
                currency,
                subtotal,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                total,
                status,
                notes: invoiceNote,
                payment_provider: activePaymentProvider || 'payfast',
                logo_url: logo || null,
                logo_bg: null,
                template,
                invoice_mode: invoiceMode,
                from_email: fromEmail,
                send_copy_to_self: Boolean(settings.sendInvoiceCopyToSelf),
                is_recurring: Boolean(isRecurring),
                recurring_interval: isRecurring ? recurringIntervalForDb : null,
                recurring_end_type: isRecurring ? recurringEndTypeForDb : null,
                recurring_end_date:
                    isRecurring && recurringEndTypeForDb === 'on'
                        ? (recurringEndDateForDb ? format(recurringEndDateForDb, 'yyyy-MM-dd') : null)
                        : null,
                recurring_end_count:
                    isRecurring && recurringEndTypeForDb === 'after'
                        ? (overrides.recurringEndCount ?? recurringEndCount)
                        : null,
                recurring_day_of_week: isRecurring && (recurringIntervalForDb === 'weekly' || recurringIntervalForDb === 'bi-weekly' || recurringIntervalForDb === 'monthly-week') ? recurringDayOfWeek : null,
                recurring_day_of_month: isRecurring && (recurringIntervalForDb === 'monthly' || recurringIntervalForDb === 'quarterly' || recurringIntervalForDb === 'semi-annually' || recurringIntervalForDb === 'yearly') ? recurringDayOfMonth : null,
                recurring_week_of_month: isRecurring && recurringIntervalForDb === 'monthly-week' ? recurringWeekOfMonth : null,
                recurring_custom_interval: isRecurring && recurringIntervalForDb === 'custom' ? recurringCustomInterval : null,
                recurring_custom_unit: isRecurring && recurringIntervalForDb === 'custom' ? recurringCustomUnit : null,
            }

            const optionalInvoiceExtras = {
                template: template,
                invoice_mode: invoiceMode,
                logo_url: logo,
                logo_bg: null,
                payment_provider: activePaymentProvider || null,
                from_email: fromEmail,
                company_website: settings.companyWebsite || null,
                bank_name: settings.bankName || null,
                account_name: settings.accountName || null,
                account_number: settings.accountNumber || null,
                branch_code: settings.branchCode || null,
                send_copy_to_self: Boolean(settings.sendInvoiceCopyToSelf),
                hide_illumi_branding: Boolean(isPro && settings.hideIllumiBranding),
            }

            // 1. Create Invoice with fallback for missing columns
            let { data: invoice, error: invoiceError } = await supabase
                .from('invoices')
                .insert(invoiceData)
                .select()
                .single()

            // Handle recurring_interval check constraint - retry with 'monthly' as fallback
            if (
                invoiceError &&
                (invoiceError as any).code === '23514' &&
                (invoiceError.message || '').includes('invoices_recurring_interval_check')
            ) {
                debugWarn('[Invoice Save] Retrying with recurring_interval="monthly" due to DB constraint')
                const { data: retryInvoiceInterval, error: retryErrorInterval } = await supabase
                    .from('invoices')
                    .insert({
                        ...(invoiceData as any),
                        recurring_interval: 'monthly',
                    })
                    .select()
                    .single()

                invoice = retryInvoiceInterval
                invoiceError = retryErrorInterval

                // If still failing, disable recurring entirely
                if (
                    invoiceError &&
                    (invoiceError as any).code === '23514' &&
                    (invoiceError.message || '').includes('invoices_recurring_interval_check')
                ) {
                    debugWarn('[Invoice Save] Retrying with recurring disabled due to interval constraint')
                    const {
                        is_recurring,
                        recurring_interval,
                        recurring_end_type,
                        recurring_end_date,
                        ...retryDataNoRecurring
                    } = invoiceData as any
                    const { data: retryInvoice2, error: retryError2 } = await supabase
                        .from('invoices')
                        .insert({
                            ...retryDataNoRecurring,
                            is_recurring: false,
                            recurring_interval: null,
                        })
                        .select()
                        .single()
                    invoice = retryInvoice2
                    invoiceError = retryError2
                }
            }

            // Handle recurring_end_type check constraint differences across DB versions
            if (
                invoiceError &&
                (invoiceError as any).code === '23514' &&
                (invoiceError.message || '').includes('invoices_recurring_end_type_check')
            ) {
                // Some DBs use 'on_date' instead of 'on'
                if ((invoiceData as any).recurring_end_type === 'on') {
                    debugWarn('[Invoice Save] Retrying with recurring_end_type="on_date" due to DB constraint')
                    const { data: retryInvoiceOnDate, error: retryErrorOnDate } = await supabase
                        .from('invoices')
                        .insert({
                            ...(invoiceData as any),
                            recurring_end_type: 'on_date',
                        })
                        .select()
                        .single()

                    invoice = retryInvoiceOnDate
                    invoiceError = retryErrorOnDate
                }

                if (
                    invoiceError &&
                    (invoiceError as any).code === '23514' &&
                    (invoiceError.message || '').includes('invoices_recurring_end_type_check')
                ) {
                    debugWarn('[Invoice Save] Retrying with recurring fields omitted due to DB constraint')
                    const { recurring_end_type, recurring_end_date, ...retryData } = invoiceData as any
                    const { data: retryInvoice, error: retryError } = await supabase
                        .from('invoices')
                        .insert(retryData)
                        .select()
                        .single()

                    invoice = retryInvoice
                    invoiceError = retryError
                }

                if (
                    invoiceError &&
                    (invoiceError as any).code === '23514' &&
                    (invoiceError.message || '').includes('invoices_recurring_end_type_check')
                ) {
                    debugWarn('[Invoice Save] Retrying with recurring disabled due to DB constraint')
                    const {
                        is_recurring,
                        recurring_interval,
                        recurring_end_type: _retryEndType,
                        recurring_end_date: _retryEndDate,
                        ...retryData2
                    } = invoiceData as any
                    const { data: retryInvoice2, error: retryError2 } = await supabase
                        .from('invoices')
                        .insert({
                            ...retryData2,
                            is_recurring: false,
                            recurring_interval: null,
                        })
                        .select()
                        .single()
                    invoice = retryInvoice2
                    invoiceError = retryError2
                }
            }

            // Best-effort: update optional extras (older DBs may not have these columns)
            if (!invoiceError && invoice?.id) {
                const { data: updatedInvoice, error: extrasError } = await supabase
                    .from('invoices')
                    .update(optionalInvoiceExtras as any)
                    .eq('id', invoice.id)
                    .select()
                    .single()

                if (extrasError) {
                    const extrasCode = (extrasError as any).code
                    if (extrasCode !== 'PGRST204') {
                        debugWarn('[Invoice Save] Optional invoice extras update failed:', extrasError)
                    }
                } else if (updatedInvoice) {
                    invoice = updatedInvoice
                }
            }

            if (invoiceError) {
                console.error('[Invoice Save] Invoice insert failed:', invoiceError)
                console.error('[Invoice Save] Error Details:', JSON.stringify(invoiceError, null, 2))
                throw invoiceError
            }

            // 2. Create Invoice Items
            if (invoice) {
                const itemsToInsert = tasks.filter(t => t.description).map((task, index) => ({
                    invoice_id: invoice.id,
                    description: task.description || 'Untitled Item',
                    quantity: task.qty,
                    unit_price: task.price,
                    total: task.price * task.qty,
                    sort_order: index
                }))

                debugLog('[Invoice Save] Items to insert:', itemsToInsert)

                if (itemsToInsert.length > 0) {
                    const { error: itemsError } = await supabase
                        .from('invoice_items')
                        .insert(itemsToInsert)

                    if (itemsError) {
                        console.error('[Invoice Save] Items insert failed:', itemsError)
                        throw itemsError
                    }
                    debugLog('[Invoice Save] Items inserted successfully')
                }

                // 3. Send Email if status is 'sent'
                const targetEmail = clientEmail?.trim()
                if (status === 'sent' && targetEmail) {
                    debugLog('[Invoice Save] Triggering email send to:', targetEmail)
                    try {
                        const requestedBcc = settings.sendInvoiceCopyToSelf
                            ? ((fromEmail || settings.fromEmail || '').trim() || undefined)
                            : undefined

                        debugLog('[Invoice Save] Copy config:', {
                            sendInvoiceCopyToSelf: settings.sendInvoiceCopyToSelf,
                            requestedBcc,
                            fromEmail,
                            settingsFromEmail: settings.fromEmail,
                        })

                        const emailRes = await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'invoice',
                                to: targetEmail,
                                bcc: requestedBcc,
                                companyName: settings.companyName,
                                supportEmail: fromEmail,
                                companyWebsite: settings.companyWebsite,
                                allowCustomBranding: Boolean(isPro),
                                hideIllumiBranding: Boolean(isPro && settings.hideIllumiBranding),
                                invoiceNumber: invoiceNumber,
                                customerName: clientName,
                                amount: `${currency} ${total.toLocaleString()}`,
                                currency,
                                dueDate: dueDate ? format(parseISO(dueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : 'N/A',
                                paymentLink: `${window.location.origin}/pay/${invoiceNumber}${activePaymentProvider ? `?provider=${activePaymentProvider}` : ''}`,
                                note: invoiceNote,
                                items: tasks.map(t => ({
                                    description: t.description,
                                    quantity: t.qty,
                                    unit_price: t.price
                                })),
                            })
                        })
                        const emailData = await emailRes.json()
                        if (emailData.success) {
                            debugLog('[Invoice Save] Email sent successfully')
                            if (emailData.copy) {
                                debugLog('[Invoice Save] Copy result:', emailData.copy)
                                const requested = Array.isArray(emailData.copy.requested)
                                    ? emailData.copy.requested.join(', ')
                                    : ''
                                const attempted = Array.isArray(emailData.copy.attempted)
                                    ? emailData.copy.attempted.join(', ')
                                    : ''

                                if (emailData.copy.sent === false) {
                                    toast.warning("Invoice sent, but copy failed", {
                                        description: `${emailData.copy.error || 'Copy could not be delivered'}${attempted ? ` (attempted: ${attempted})` : requested ? ` (requested: ${requested})` : ''}`,
                                    })
                                } else {
                                    toast.success("Copy sent", {
                                        description: attempted || requested || "Copy delivered",
                                    })
                                }
                            }
                        } else {
                            const isDomainError = emailData.error?.includes("verify a domain") || emailData.error?.includes("testing emails");
                            if (isDomainError) {
                                debugWarn('[Invoice Save] Email blocked by Resend domain verification/testing restriction:', emailData.error)
                            } else {
                                console.error('[Invoice Save] Email send failed:', emailData.error)
                            }
                            toast.warning("Invoice created, but email failed", {
                                description: isDomainError
                                    ? "Resend requires a verified domain to send to external recipients."
                                    : emailData.error,
                                action: isDomainError ? {
                                    label: "Verify Domain",
                                    onClick: () => window.open("https://resend.com/domains", "_blank")
                                } : undefined
                            })
                        }
                    } catch (emailErr) {
                        console.error('[Invoice Save] Email API error:', emailErr)
                        toast.warning("Invoice created, but email service is unavailable")
                    }
                }

                debugLog('[Invoice Save] SUCCESS! Invoice created:', invoice?.id)

                toast.success("Invoice saved successfully", {
                    description: `Invoice ${invoiceNumber} has been created.`
                })

                setTimeout(() => {
                    router.push('/invoices')
                }, 500)
            }

        } catch (error: any) {
            console.error('[Invoice Save] FAILED:', error)
            console.error('[Invoice Save] Full Error:', JSON.stringify(error, null, 2))
            toast.error("Failed to save invoice", {
                description: error.message || 'Unknown error occurred'
            })
        } finally {
            setIsSaving(false)
        }
    }



    return (
        <div className="h-full bg-background text-foreground font-sans flex overflow-hidden">

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col relative h-full bg-background">
                {/* STATIC TOP ACTION BAR */}
                <div className="h-20 px-4 sm:px-6 md:px-8 flex justify-end items-center border-b border-border bg-background z-20 shrink-0">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full">
                        <Button
                            variant="ghost"
                            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>

                        {/* ACTION BUTTONS - Sliding Drawer */}
                        <div className="flex items-center gap-3">
                            <div
                                className="relative flex items-center"
                                onMouseEnter={() => setActionsOpen(true)}
                                onMouseLeave={() => {
                                    if (!schedulePopoverOpen && !recurringPopoverOpen) setActionsOpen(false)
                                }}
                            >
                                {/* Primary Action */}
                                {canSchedule ? (
                                    <Popover
                                        open={schedulePopoverOpen}
                                        onOpenChange={(open) => {
                                            setSchedulePopoverOpen(open)
                                            if (open) setActionsOpen(true)
                                        }}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                disabled={isSaving}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-xs font-bold rounded-lg z-10 disabled:opacity-50"
                                            >
                                                {isSaving ? 'Saving...' : 'Schedule'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-[360px] p-4 bg-card border-border rounded-md shadow-2xl"
                                            side="bottom"
                                            align="center"
                                            sideOffset={12}
                                            collisionPadding={16}
                                        >
                                            <div className="space-y-4">
                                                <Calendar
                                                    mode="single"
                                                    selected={scheduleDate}
                                                    onSelect={setScheduleDate}
                                                    className="rounded-md"
                                                />
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs text-muted-foreground">Time (24h):</Label>
                                                        <Input
                                                            inputMode="numeric"
                                                            value={scheduleTime}
                                                            onChange={(e) => setScheduleTime(normalizeTimeInput(e.target.value))}
                                                            placeholder="17:00"
                                                            className="h-8 w-28 bg-muted border-border text-foreground text-xs rounded-md"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {timeQuickPicks.map((t) => (
                                                            <Button
                                                                key={t}
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => setScheduleTime(t)}
                                                                className={cn(
                                                                    "h-8 px-0 text-[10px] font-bold border-border bg-muted hover:bg-accent text-foreground rounded-md",
                                                                    scheduleTime === t ? "border-border/30 bg-accent" : ""
                                                                )}
                                                            >
                                                                {t}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        if (scheduleDate) {
                                                            handleCreate('schedule')
                                                            setSchedulePopoverOpen(false)
                                                            setActionsOpen(false)
                                                        } else {
                                                            toast.error("Please select a date first")
                                                        }
                                                    }}
                                                    disabled={isSaving || !scheduleDate}
                                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs font-bold rounded-md"
                                                >
                                                    Schedule Now
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                ) : canRecurring ? (
                                    <Popover
                                        open={recurringPopoverOpen}
                                        onOpenChange={(open) => {
                                            setRecurringPopoverOpen(open)
                                            if (open) setActionsOpen(true)
                                        }}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                disabled={isSaving}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-xs font-bold rounded-lg z-10 disabled:opacity-50"
                                            >
                                                {isSaving ? 'Saving...' : 'Recurring'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 p-4 bg-card border-border rounded-xl shadow-2xl" align="end">
                                            {!isPro ? (
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Recurring Invoice</h4>
                                                    <p className="text-[10px] text-muted-foreground">Recurring invoices are only available on the Pro plan.</p>
                                                    <HoverBorderGradient
                                                        as="button"
                                                        onClick={() => router.push('/settings/billing')}
                                                        containerClassName="w-full"
                                                        className="bg-primary text-primary-foreground font-bold h-8 text-xs w-full flex items-center justify-center"
                                                    >
                                                        Upgrade to Pro
                                                    </HoverBorderGradient>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Recurring Settings</h4>
                                                        <p className="text-[10px] text-muted-foreground">Configure how often this invoice should be generated.</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Repeat</Label>
                                                        <Select value={recurringInterval} onValueChange={(val) => {
                                                            setRecurringInterval(val)
                                                            // Set sensible defaults based on selection
                                                            if (val === 'weekly' || val === 'bi-weekly') {
                                                                setRecurringDayOfWeek(4) // Thursday
                                                            } else if (val === 'monthly' || val === 'quarterly' || val === 'semi-annually' || val === 'yearly') {
                                                                setRecurringDayOfMonth(22)
                                                            }
                                                        }}>
                                                            <SelectTrigger className="bg-muted border-border h-10 text-xs">
                                                                <SelectValue placeholder="Select frequency" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-card border-border text-foreground">
                                                                <SelectItem value="weekly">Weekly on {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][recurringDayOfWeek]}</SelectItem>
                                                                <SelectItem value="bi-weekly">Bi-weekly on {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][recurringDayOfWeek]}</SelectItem>
                                                                <SelectItem value="monthly">Monthly on the {recurringDayOfMonth}{recurringDayOfMonth === 1 ? 'st' : recurringDayOfMonth === 2 ? 'nd' : recurringDayOfMonth === 3 ? 'rd' : 'th'}</SelectItem>
                                                                <SelectItem value="monthly-week">Monthly on the {recurringWeekOfMonth} {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][recurringDayOfWeek]}</SelectItem>
                                                                <SelectItem value="monthly-last">Monthly on the last day</SelectItem>
                                                                <SelectItem value="quarterly">Quarterly on the {recurringDayOfMonth}{recurringDayOfMonth === 1 ? 'st' : recurringDayOfMonth === 2 ? 'nd' : recurringDayOfMonth === 3 ? 'rd' : 'th'}</SelectItem>
                                                                <SelectItem value="semi-annually">Semi-annually on the {recurringDayOfMonth}{recurringDayOfMonth === 1 ? 'st' : recurringDayOfMonth === 2 ? 'nd' : recurringDayOfMonth === 3 ? 'rd' : 'th'}</SelectItem>
                                                                <SelectItem value="yearly">Annually on the {recurringDayOfMonth}{recurringDayOfMonth === 1 ? 'st' : recurringDayOfMonth === 2 ? 'nd' : recurringDayOfMonth === 3 ? 'rd' : 'th'}</SelectItem>
                                                                <SelectItem value="custom">Custom</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {recurringInterval === 'custom' && (
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Repeat every</Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    value={recurringCustomInterval}
                                                                    onChange={(e) => setRecurringCustomInterval(parseInt(e.target.value) || 1)}
                                                                    className="bg-muted border-border h-10 text-xs w-20"
                                                                />
                                                                <Select value={recurringCustomUnit} onValueChange={setRecurringCustomUnit}>
                                                                    <SelectTrigger className="bg-muted border-border h-10 text-xs flex-1">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-card border-border text-foreground">
                                                                        <SelectItem value="days">days</SelectItem>
                                                                        <SelectItem value="weeks">weeks</SelectItem>
                                                                        <SelectItem value="months">months</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ends</Label>
                                                        <Select value={recurringEndType} onValueChange={(v: any) => setRecurringEndType(v)}>
                                                            <SelectTrigger className="bg-muted border-border h-10 text-xs">
                                                                <SelectValue placeholder="Select end type" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-card border-border text-foreground">
                                                                <SelectItem value="never">Never</SelectItem>
                                                                <SelectItem value="on">On Date</SelectItem>
                                                                <SelectItem value="after">After X Times</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {recurringEndType === 'on' && (
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</Label>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "h-10 w-full justify-start text-left font-normal bg-muted border-border hover:bg-accent hover:text-foreground text-xs",
                                                                            !recurringEndDate && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        <CalendarDays className="mr-2 h-4 w-4" />
                                                                        {recurringEndDate ? format(recurringEndDate, "PPP") : <span>Pick a date</span>}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                                                    <Calendar selected={recurringEndDate} onSelect={setRecurringEndDate} />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    )}

                                                    {recurringEndType === 'after' && (
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                                Number of Invoices
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={recurringEndCount}
                                                                onChange={(e) => setRecurringEndCount(parseInt(e.target.value || '0'))}
                                                                className="bg-muted border-border h-10 text-xs"
                                                            />
                                                        </div>
                                                    )}

                                                    <Button
                                                        onClick={async () => {
                                                            await handleSaveInvoice('sent', {
                                                                isRecurring: true,
                                                                recurringInterval,
                                                                recurringEndType,
                                                                recurringEndDate,
                                                                recurringEndCount,
                                                            })
                                                            setRecurringPopoverOpen(false)
                                                            setActionsOpen(false)
                                                        }}
                                                        disabled={isSaving}
                                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs font-bold"
                                                    >
                                                        Create Recurring Invoice
                                                    </Button>
                                                </div>
                                            )}
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <Button
                                        onClick={() => handleCreate('send')}
                                        disabled={isSaving}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-xs font-bold rounded-l-lg z-10 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Send'}
                                    </Button>
                                )}

                                {/* Secondary Actions Container */}
                                <div
                                    className={cn(
                                        "flex items-center bg-secondary h-9 ml-[-4px] pl-2 pr-1 rounded-r-lg border border-border overflow-hidden transition-all duration-300",
                                        actionsPanelOpen
                                            ? "opacity-100 translate-x-0 pointer-events-auto max-w-[400px]"
                                            : "opacity-0 -translate-x-4 pointer-events-none max-w-0"
                                    )}
                                >
                                    {canDraft && (
                                        <>
                                            <Button
                                                onClick={() => handleCreate('create')}
                                                disabled={isSaving}
                                                variant="ghost"
                                                className="h-7 px-3 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent gap-2 shrink-0"
                                            >
                                                Draft
                                            </Button>
                                            <div className="w-px h-4 bg-accent mx-1" />
                                        </>
                                    )}

                                    {!canSchedule && !canRecurring && (
                                        <Button
                                            onClick={() => handleCreate('send')}
                                            disabled={isSaving}
                                            variant="ghost"
                                            className="h-7 px-3 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent gap-2 shrink-0"
                                        >
                                            <Send className="h-3 w-3" />
                                            Send Now
                                        </Button>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


                {/* SCROLLABLE EDITOR AREA */}
                <div className="flex-1 overflow-y-auto pb-28 sm:pb-40 no-scrollbar">
                    <div className="max-w-5xl mx-auto py-6 sm:py-12 px-4 sm:px-8 md:px-12">

                        {/* Mobile section tabs */}
                        <div className="md:hidden sticky top-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-b border-border">
                            <div className="grid grid-cols-3 gap-2">
                                <Button type="button" variant="outline" className="h-9 text-xs" onClick={() => scrollToSection('invoice-details')}>
                                    Details
                                </Button>
                                <Button type="button" variant="outline" className="h-9 text-xs" onClick={() => scrollToSection('invoice-items')}>
                                    Items
                                </Button>
                                <Button type="button" variant="outline" className="h-9 text-xs" onClick={() => scrollToSection('invoice-summary')}>
                                    Summary
                                </Button>
                            </div>
                        </div>

                        <div className={cn(
                            "rounded-2xl shadow-2xl transition-all duration-500",
                            invoiceMode === "light" ? "bg-primary text-primary-foreground border border-neutral-200" : "bg-card border border-border text-foreground",
                            template === "Classic" && "p-6 sm:p-12",
                            template === "Minimal" && "p-8 sm:p-20 border-none shadow-none",
                            template === "Modern" && "p-0 overflow-hidden"
                        )}>

                            {template === "Modern" && (
                                <div className="h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />
                            )}

                            <div className={cn(template === "Modern" && "p-6 sm:p-12")}>
                                {/* Header: Logo & Title */}
                                <div className="flex flex-col gap-8 mb-16">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Moved Settings Icons Here */}
                                            <div className="flex items-center gap-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                                                            <Settings2 className="h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent side="bottom" align="start" className="w-80 bg-card border-border p-4 shadow-2xl">
                                                        <div className="space-y-6">
                                                            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Invoice Settings</h3>
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /><span className="text-xs">Date Format</span></div>
                                                                    <Select value={dateFormat} onValueChange={setDateFormat}>
                                                                        <SelectTrigger className="h-9 bg-muted border-border text-xs text-foreground"><SelectValue /></SelectTrigger>
                                                                        <SelectContent className="bg-card border-border text-foreground">
                                                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>


                                            </div>

                                            <div className={cn("h-px w-8", "bg-muted/500")} />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Draft Invoice</span>
                                        </div>
                                        <div className="flex items-center p-0.5 rounded-full border transition-all bg-card border-border">
                                            <button
                                                type="button"
                                                onClick={() => setInvoiceMode("light")}
                                                className={cn(
                                                    "h-6 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
                                                    invoiceMode === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Light
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setInvoiceMode("dark")}
                                                className={cn(
                                                    "h-6 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
                                                    invoiceMode === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Dark
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "w-32 h-32 border border-dashed rounded-3xl flex items-center justify-center transition-all cursor-pointer group relative overflow-hidden",
                                                invoiceMode === "light"
                                                    ? "bg-card border-neutral-200 hover:border-neutral-300"
                                                    : "bg-card border-border hover:bg-white/8 hover:border-border"
                                            )}
                                        >
                                            {logo ? (
                                                <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <>
                                                    <Plus className={cn("h-6 w-6 mb-1 group-hover:scale-110 transition-transform", "text-foreground")} />
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", "text-foreground")}>Logo</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                            />
                                        </div>

                                        <div className={cn(
                                            "text-right",
                                            template === "Minimal" && "text-center"
                                        )}>
                                            <h2 className={cn(
                                                "text-5xl invoice-font-title font-bold mb-2",
                                                invoiceMode === "light" ? "text-black" : "text-foreground",
                                                template === "Minimal" && "font-sans uppercase tracking-[0.3em] font-normal",
                                                template === "Modern" && "font-sans font-black tracking-tighter text-6xl uppercase"
                                            )}>Invoice</h2>
                                            <p className={cn("invoice-font-id text-sm tracking-widest h-5", invoiceMode === "light" ? "text-muted-foreground" : "text-muted-foreground")}>{invoiceNumber}</p>
                                        </div>
                                    </div>

                                    {/* From / To Section (Cleaned up) */}
                                    <div className={cn(
                                        "grid grid-cols-2 gap-20 mb-16",
                                        template === "Modern" && "bg-muted p-8 rounded-xl"
                                    )}>
                                        <div className="col-span-2 flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">From</span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">To</span>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="space-y-2">
                                                <Input
                                                    value={fromName}
                                                    onChange={(e) => setFromName(e.target.value)}
                                                    placeholder="Your Name / Company"
                                                    spellCheck={false}
                                                    className={cn("invoice-font-from bg-transparent border-none p-0 h-auto placeholder:text-muted-foreground text-lg font-bold focus-visible:ring-0", invoiceMode === "light" ? "text-black" : "text-foreground")}
                                                />
                                                <Input
                                                    value={fromEmail}
                                                    onChange={(e) => setFromEmail(e.target.value)}
                                                    placeholder="your@email.com"
                                                    type="email"
                                                    className={cn("invoice-font-from bg-transparent border-none p-0 h-auto placeholder:text-muted-foreground text-sm focus-visible:ring-0", invoiceMode === "light" ? "text-muted-foreground" : "text-muted-foreground")}
                                                />
                                                <textarea
                                                    value={fromAddress}
                                                    onChange={(e) => setFromAddress(e.target.value)}
                                                    placeholder="Address"
                                                    rows={3}
                                                    spellCheck={false}
                                                    className={cn("invoice-font-from w-full bg-transparent border-none p-0 h-auto placeholder:text-muted-foreground text-sm focus:ring-0 resize-none", invoiceMode === "light" ? "text-muted-foreground" : "text-muted-foreground")}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 text-right">
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn("h-6 text-[10px] px-2 gap-1", invoiceMode === "light" ? "text-muted-foreground hover:text-black hover:bg-neutral-100" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
                                                    onClick={() => setIsClientModalOpen(true)}
                                                >
                                                    <Plus className="h-3 w-3" /> New Client
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-3">
                                                    <Input
                                                        placeholder="Add Client"
                                                        list="client-suggestions"
                                                        spellCheck={false}
                                                        value={clientName}
                                                        className={cn("invoice-font-from bg-transparent border-none p-0 h-auto placeholder:text-muted-foreground text-lg font-bold focus-visible:ring-0 text-right", invoiceMode === "light" ? "text-black" : "text-foreground")}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setClientName(val)
                                                            const client = customers.find(c => c.name === val)
                                                            if (client) {
                                                                setCustomerId(client.id)
                                                                setClientAddress(client.address || "")
                                                                setClientEmail(client.email || "")
                                                                setClientPhone(client.phone || "")
                                                            } else {
                                                                setCustomerId(null)
                                                                setClientAddress("")
                                                                setClientEmail("")
                                                                setClientPhone("")
                                                            }
                                                        }}
                                                    />
                                                    <datalist id="client-suggestions">
                                                        {customers.map(c => <option key={c.id} value={c.name} />)}
                                                    </datalist>

                                                    {/* Read-only client details display if selected */}
                                                    {(clientEmail || clientAddress) && (
                                                        <div className="invoice-font-from flex flex-col items-end gap-1 text-xs text-muted-foreground">
                                                            {clientEmail && <span>{clientEmail}</span>}
                                                            {clientPhone && <span>{clientPhone}</span>}
                                                            {clientAddress && <span className="whitespace-pre-wrap text-right">{clientAddress}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Meta Details */}
                                <div id="invoice-details" />
                                {!canSchedule && (
                                    <div className={cn("flex flex-wrap gap-12 mb-16 pb-12 border-b", invoiceMode === "light" ? "border-foreground/5" : "border-border")}>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue Date</span>
                                            <div className="relative">
                                                <Popover open={isIssueDateOpen} onOpenChange={setIsIssueDateOpen}>
                                                    <PopoverTrigger asChild>
                                                        <button className={cn(
                                                            "invoice-font-date bg-transparent border-none p-0 h-auto font-bold text-sm focus:ring-0 cursor-pointer min-w-[150px] outline-none text-left",
                                                            invoiceMode === "light" ? "text-black" : "text-foreground"
                                                        )}>
                                                            {issueDate ? format(parseISO(issueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : "Select Date"}
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-card border-border rounded-xl" align="start">
                                                        <Calendar
                                                            selected={issueDate ? parseISO(issueDate) : undefined}
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    setIssueDate(date.toISOString().split('T')[0])
                                                                }
                                                                setIsIssueDateOpen(false)
                                                            }}
                                                            className="border-none"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Due Date</span>
                                            <div className="relative">
                                                <Popover open={isDueDateOpen} onOpenChange={setIsDueDateOpen}>
                                                    <PopoverTrigger asChild>
                                                        <button className={cn(
                                                            "invoice-font-date bg-transparent border-none p-0 h-auto font-bold text-sm focus:ring-0 cursor-pointer min-w-[150px] outline-none text-left",
                                                            invoiceMode === "light" ? "text-black" : "text-foreground"
                                                        )}>
                                                            {dueDate ? format(parseISO(dueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : "Select Date"}
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-card border-border rounded-xl" align="start">
                                                        <Calendar
                                                            selected={dueDate ? parseISO(dueDate) : undefined}
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    setDueDate(date.toISOString().split('T')[0])
                                                                }
                                                                setIsDueDateOpen(false)
                                                            }}
                                                            className="border-none"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tasks Table (Refined) */}
                                <div id="invoice-items" />
                                <div className="mb-12">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className={cn("border-b text-[10px] font-bold uppercase tracking-widest text-muted-foreground", invoiceMode === "light" ? "border-foreground/5" : "border-border")}>
                                                <th className="py-4 text-left font-medium">
                                                    <div className="flex items-center gap-4">
                                                        Products
                                                        <button
                                                            onClick={() => setIsProductModalOpen(true)}
                                                            className={cn("flex items-center gap-1 text-[9px] transition-colors px-2 py-1 rounded cursor-pointer", invoiceMode === "light" ? "bg-black/5 hover:bg-black/10 text-muted-foreground hover:text-black" : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground")}
                                                        >
                                                            <Plus className="h-2.5 w-2.5" /> New
                                                        </button>
                                                    </div>
                                                </th>

                                                <th className="py-4 text-right font-medium w-32">Price</th>
                                                <th className="py-4 text-right font-medium w-24">Qty</th>
                                                <th className="py-4 text-right font-medium w-32">Total</th>
                                                <th className="w-8"></th>
                                            </tr>
                                        </thead>
                                        <tbody className={cn("divide-y", invoiceMode === "light" ? "divide-black/5" : "divide-border")}>
                                            {tasks.map((task) => (
                                                <tr key={task.id} className="group transition-colors outline-none">
                                                    <td className="py-4">
                                                        <Input
                                                            placeholder="Enter Product"
                                                            spellCheck={false}
                                                            className={cn("invoice-font-item bg-transparent border-none p-0 h-auto placeholder:text-muted-foreground focus-visible:ring-0 text-sm font-medium w-full", invoiceMode === "light" ? "text-black" : "text-foreground")}
                                                            value={task.description}
                                                            list="product-suggestions"
                                                            onChange={(e) => {
                                                                const newTasks = [...tasks]
                                                                const idx = newTasks.findIndex(t => t.id === task.id)
                                                                newTasks[idx].description = e.target.value

                                                                // Auto-fill price if product matches
                                                                const product = products.find(p => p.name === e.target.value)
                                                                if (product) {
                                                                    newTasks[idx].price = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price
                                                                }
                                                                setTasks(newTasks)
                                                            }}
                                                        />
                                                        <datalist id="product-suggestions">
                                                            {products.map(p => <option key={p.id} value={p.name} />)}
                                                        </datalist>
                                                    </td>
                                                    <td className="py-4 px-2 w-32">
                                                        <NumberInput
                                                            value={task.price}
                                                            onChange={(val) => {
                                                                const newTasks = [...tasks]
                                                                const idx = newTasks.findIndex(t => t.id === task.id)
                                                                newTasks[idx].price = val
                                                                setTasks(newTasks)
                                                            }}
                                                            variant={invoiceMode}
                                                            className="h-10 w-full"
                                                        />
                                                    </td>
                                                    <td className="py-4 px-2 w-24">
                                                        <NumberInput
                                                            value={task.qty}
                                                            onChange={(val) => {
                                                                const newTasks = [...tasks]
                                                                const idx = newTasks.findIndex(t => t.id === task.id)
                                                                newTasks[idx].qty = val
                                                                setTasks(newTasks)
                                                            }}
                                                            variant={invoiceMode}
                                                            className="h-10 w-full"
                                                        />
                                                    </td>
                                                    <td className={cn("py-4 text-right font-bold text-sm invoice-font-amount w-32", invoiceMode === "light" ? "text-black" : "text-foreground")}>
                                                        {(task.price * task.qty).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                                    </td>
                                                    <td className="py-4 text-right pl-2">
                                                        <button
                                                            onClick={() => removeTask(task.id)}
                                                            className="text-muted-foreground hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all outline-none"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <Button
                                        variant="ghost"
                                        className="mt-8 text-muted-foreground hover:text-foreground gap-2 px-0 hover:bg-transparent border border-dashed border-border hover:border-border w-full h-12 rounded-xl group transition-all"
                                        onClick={addTask}
                                    >
                                        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Add line item</span>
                                    </Button>
                                </div>

                                {/* Summary & Totals */}
                                {/* Summary & Totals */}
                                <div id="invoice-summary" />
                                <div className="grid grid-cols-12 gap-8 mt-20 pt-12 border-t border-border">
                                    <div className="col-span-8 flex flex-col gap-6">
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Note</span>
                                            <textarea
                                                placeholder="Add a note (visible to client)"
                                                value={invoiceNote}
                                                onChange={(e) => setInvoiceNote(e.target.value)}
                                                className="invoice-font-notes w-full bg-transparent border-none p-0 h-24 text-muted-foreground placeholder:text-neutral-800 text-sm focus:ring-0 resize-none"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payment Info</span>
                                            {isPro ? (
                                                <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group hover:border-border transition-all min-w-[320px]">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-muted blur-[50px] -mr-16 -mt-16" />
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0">
                                                            <CreditCard className="h-5 w-5 text-foreground" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-black text-foreground uppercase tracking-widest whitespace-nowrap">PayGate Active</span>
                                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-full border border-border shrink-0">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                                    <span className="text-[8px] font-black text-foreground uppercase tracking-widest">Live</span>
                                                                </div>
                                                                <div className="flex items-center px-2 py-0.5 bg-muted rounded-full border border-border shrink-0">
                                                                    <span className="text-[8px] font-black text-foreground uppercase tracking-widest">{paygateLabel}</span>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter truncate">Clients can pay via card / Instant EFT</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full mt-4 h-auto py-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-muted border border-border gap-2 whitespace-normal text-center leading-relaxed"
                                                        onClick={() => {
                                                            import('sonner').then(({ toast }) => {
                                                                toast.success("Payment Link Generated", {
                                                                    description: "The customer portal link has been attached to this invoice."
                                                                })
                                                            })
                                                        }}
                                                    >
                                                        <Globe className="h-3 w-3 shrink-0" />
                                                        Pay with Paygate (Customer Preview)
                                                    </Button>
                                                </div>

                                            ) : (
                                                <div className="space-y-1 text-sm text-muted-foreground font-medium">
                                                    {settings.accountName && <p>Account name: {settings.accountName}</p>}
                                                    {settings.accountNumber && <p>Account number: {settings.accountNumber}</p>}
                                                    {settings.bankName && <p>Bank: {settings.bankName}</p>}
                                                    {settings.branchCode && <p>Branch code: {settings.branchCode}</p>}
                                                    {!settings.accountName && !settings.accountNumber && !settings.bankName && !settings.branchCode && (
                                                        <p>Enter your banking details in Settings to show them on invoices.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-4 flex flex-col gap-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="invoice-font-amount text-foreground">{calculateSubtotal().toLocaleString('en-ZA', { style: 'currency', currency: currency })}</span>
                                        </div>
                                        {taxRate > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                                                <span className="invoice-font-amount text-foreground">{(calculateSubtotal() * taxRate / 100).toLocaleString('en-ZA', { style: 'currency', currency: currency })}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-6 border-t border-border">
                                            <span className="text-sm font-bold text-foreground uppercase tracking-widest">Total</span>
                                            <span className="text-3xl font-black text-foreground invoice-font-amount">
                                                {(calculateSubtotal() * (1 + taxRate / 100)).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center pt-10 gap-2">
                                    {!(Boolean(isPro) && Boolean(settings.hideIllumiBranding)) && !Boolean(isPro) && (
                                        <a
                                            href="https://illumi.co.za"
                                            target="_blank"
                                            rel="noreferrer"
                                            className={cn(
                                                "inline-flex items-center gap-2",
                                                invoiceMode === 'light' ? "opacity-40 hover:opacity-60" : "opacity-60 hover:opacity-80"
                                            )}
                                        >
                                            <img
                                                src={illumiLogoSrc}
                                                alt="Illumi"
                                                className="h-5 w-5 object-contain"
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] underline underline-offset-4">
                                                Made with Illumi Invoice
                                            </span>
                                        </a>
                                    )}
                                    {settings.companyWebsite && (
                                        <a
                                            href={settings.companyWebsite.startsWith('http') ? settings.companyWebsite : `https://${settings.companyWebsite}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={cn(
                                                "text-[10px] font-bold uppercase tracking-[0.2em] underline underline-offset-4",
                                                invoiceMode === 'light' ? "opacity-40 hover:opacity-60" : "opacity-60 hover:opacity-80"
                                            )}
                                        >
                                            {settings.companyWebsite}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Mobile sticky actions */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur p-3">
                <div className="max-w-5xl mx-auto flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 flex-1"
                        onClick={() => setIsPreviewOpen(true)}
                    >
                        <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>

                    <Button
                        type="button"
                        className="h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isSaving}
                        onClick={() => handleCreate(canSchedule ? 'schedule' : 'send')}
                    >
                        {isSaving ? 'Saving...' : (canSchedule ? 'Schedule' : 'Send')}
                    </Button>
                </div>
            </div>

            {isPreviewOpen && (
                <Suspense fallback={null}>
                    <PreviewModal
                        isOpen={isPreviewOpen}
                        onClose={() => setIsPreviewOpen(false)}
                        data={{
                            template,
                            logo,
                            tasks,
                            currency,
                            taxRate,
                            dateFormat,
                            invoiceMode,
                            isPro: Boolean(isPro),
                            hideIllumiBranding: Boolean(isPro && settings.hideIllumiBranding),
                            companyWebsite: settings.companyWebsite,
                            bankName: settings.bankName,
                            accountName: settings.accountName,
                            accountNumber: settings.accountNumber,
                            branchCode: settings.branchCode,
                            fromName,
                            fromAddress,
                            clientName,
                            clientEmail,
                            clientPhone,
                            clientAddress,
                            invoiceNumber,
                            fromEmail,
                            issueDate,
                            dueDate,
                            note: invoiceNote
                        }}
                    />
                </Suspense>
            )}


            <CreateClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSuccess={(client) => {
                    setClientName(client.name)
                    setClientEmail(client.email)
                    setClientAddress(client.address)
                }}
            />

            <CreateProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSuccess={(product) => {
                    const newId = Date.now()
                    setTasks([...tasks, {
                        id: newId,
                        description: product.name,
                        price: product.price,
                        qty: 1
                    }])
                }}
            />
        </div>
    )
}

