"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { useRouter } from "next/navigation"
import { NumberInput } from "@/components/ui/number-input"
import { PreviewModal } from "../components/preview-modal"
import { allClients, allProducts } from "@/lib/data"
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

import { CreateClientModal } from "../components/create-client-modal"
import { CreateProductModal } from "../components/create-product-modal"
import { RecurringModal } from "../components/recurring-modal"

type TemplateType = "Classic" | "Minimal" | "Modern"

export default function NewInvoicePage() {
    const router = useRouter()
    const { isPro } = useSubscription()
    const settings = useSettings()
    const { activeWorkspace } = useWorkspace()

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

    const [fromEmail, setFromEmail] = useState(settings.fromEmail ?? "hello@illumi.co.za")
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
    const [dueDate, setDueDate] = useState("")
    const [isIssueDateOpen, setIsIssueDateOpen] = useState(false)
    const [isDueDateOpen, setIsDueDateOpen] = useState(false)
    const [invoiceMode, setInvoiceMode] = useState<"light" | "dark">("dark")
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)

    // Recurring State
    const [isRecurringEnabled, setIsRecurringEnabled] = useState(false)
    const [recurringInterval, setRecurringInterval] = useState("monthly")
    const [recurringEndType, setRecurringEndType] = useState<"on" | "after" | "never">("never")
    const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
    const [recurringEndCount, setRecurringEndCount] = useState(12)
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
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
    }, [settings.logo, settings.fromEmail])

    const [customers, setCustomers] = useState<any[]>([])
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
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error || !user) {
                router.push('/login')
                return
            }

            // Generate initial unique invoice number if none exists
            if (!invoiceNumber) {
                setInvoiceNumber(generateUniqueInvoiceNumber())
            }
        }

        const fetchCustomers = async () => {
            const { data } = await supabase.from('customers').select('*')
            if (data) setCustomers(data)
        }

        checkAuth()
        fetchCustomers()
    }, [router, supabase])

    const handleCreate = async (type: string) => {
        if (type === 'create') {
            await handleSaveInvoice('draft')
        } else if (type === 'send') {
            await handleSaveInvoice('sent')
        } else if (type === 'schedule') {
            if (scheduleDate) {
                await handleSaveInvoice('scheduled', { issueDate: scheduleDate })
            } else {
                toast.error("Please select a date first")
            }
        } else if (type === 'recurring') {
            setIsRecurringModalOpen(true)
        }
    }

    const handleSaveInvoice = async (status: 'draft' | 'sent' | 'scheduled' = 'draft', overrides: any = {}) => {
        setIsSaving(true)
        console.log('[Invoice Save] Starting save process...', { status, invoiceNumber, customerId })

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            console.log('[Invoice Save] Auth check:', { userId: user?.id, userError })

            if (userError || !user) {
                toast.error("Session expired. Please log in again.")
                router.push('/login')
                return
            }

            // Calculate totals
            const subtotal = tasks.reduce((acc, t) => acc + (t.price * t.qty), 0)
            const taxAmount = subtotal * (taxRate / 100)
            const total = subtotal + taxAmount
            console.log('[Invoice Save] Calculated totals:', { subtotal, taxAmount, total })

            // Prepare invoice data
            const invoiceData = {
                user_id: user.id,
                workspace_id: activeWorkspace?.id,
                invoice_number: invoiceNumber,
                status: status,
                issue_date: overrides.issueDate ? format(overrides.issueDate, 'yyyy-MM-dd') : issueDate,
                due_date: dueDate || null,
                customer_id: customerId || null,
                currency: currency,
                subtotal: subtotal,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                total: total,
                is_recurring: overrides.isRecurring ?? isRecurringEnabled,
                recurring_interval: overrides.recurringInterval ?? (isRecurringEnabled ? recurringInterval : null),
                recurring_end_date: overrides.recurringEndDate ?? recurringEndDate,
                recurring_end_type: overrides.recurringEndType ?? recurringEndType,
                template: template,
                invoice_mode: invoiceMode,
                logo_url: logo,
            }
            console.log('[Invoice Save] Invoice data to insert:', invoiceData)

            // 1. Create Invoice with fallback for missing columns
            let { data: invoice, error: invoiceError } = await supabase
                .from('invoices')
                .insert(invoiceData)
                .select()
                .single()

            // Handle potential schema cache error for new columns
            if (invoiceError && (invoiceError.message?.includes('invoice_mode') || invoiceError.message?.includes('logo_url'))) {
                console.warn('[Invoice Save] Retrying without new columns due to schema error')
                const { template, invoice_mode, logo_url, ...fallbackData } = invoiceData as any
                const { data: retryInvoice, error: retryError } = await supabase
                    .from('invoices')
                    .insert(fallbackData)
                    .select()
                    .single()
                invoice = retryInvoice
                invoiceError = retryError
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

                console.log('[Invoice Save] Items to insert:', itemsToInsert)

                if (itemsToInsert.length > 0) {
                    const { error: itemsError } = await supabase
                        .from('invoice_items')
                        .insert(itemsToInsert)

                    if (itemsError) {
                        console.error('[Invoice Save] Items insert failed:', itemsError)
                        throw itemsError
                    }
                    console.log('[Invoice Save] Items inserted successfully')
                }

                // 3. Send Email if status is 'sent'
                const targetEmail = clientEmail?.trim()
                if (status === 'sent' && targetEmail) {
                    console.log('[Invoice Save] Triggering email send to:', targetEmail)
                    try {
                        const emailRes = await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'invoice',
                                to: targetEmail,
                                invoiceNumber: invoiceNumber,
                                customerName: clientName,
                                amount: `${currency} ${total.toLocaleString()}`,
                                dueDate: dueDate ? format(parseISO(dueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : 'N/A',
                                paymentLink: `${process.env.NEXT_PUBLIC_URL || 'https://illumi.co.za'}/pay/${invoice.id}`,
                                note: invoiceNote,
                                items: tasks.map(t => ({
                                    description: t.description,
                                    quantity: t.qty,
                                    unit_price: t.price
                                })),
                                currency: currency
                            })
                        })
                        const emailData = await emailRes.json()
                        if (emailData.success) {
                            console.log('[Invoice Save] Email sent successfully')
                        } else {
                            console.error('[Invoice Save] Email send failed:', emailData.error)
                            const isDomainError = emailData.error?.includes("verify a domain") || emailData.error?.includes("testing emails");
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

                console.log('[Invoice Save] SUCCESS! Invoice created:', invoice?.id)

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
        <div className="h-full bg-black text-white font-sans flex overflow-hidden">

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col relative h-full bg-black">
                {/* STATIC TOP ACTION BAR */}
                <div className="h-20 px-8 flex justify-end items-center border-b border-white/5 bg-black z-20 shrink-0">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="h-9 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>

                        {/* ACTION BUTTONS */}
                        <div className="flex items-center gap-3">
                            {/* Hover Reveal Actions */}
                            <div className="relative group flex items-center">
                                {/* Primary Action: Draft */}
                                <Button
                                    onClick={() => handleCreate('create')}
                                    className="bg-white text-black hover:bg-neutral-200 h-9 px-4 text-xs font-bold rounded-l-lg z-10"
                                >
                                    Save Draft
                                </Button>

                                {/* Secondary Actions Container - Reveals on Hover */}
                                <div className="flex items-center bg-[#1a1a1a] h-9 ml-[-4px] pl-2 pr-1 rounded-r-lg border border-white/10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto overflow-hidden max-w-0 group-hover:max-w-[300px]">
                                    <Button
                                        onClick={() => handleCreate('send')}
                                        variant="ghost"
                                        className="h-7 px-3 text-[10px] text-neutral-400 hover:text-white hover:bg-white/10 gap-2 shrink-0"
                                    >
                                        <Send className="h-3 w-3" />
                                        Send Now
                                    </Button>
                                    <div className="w-px h-4 bg-white/10 mx-1" />

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-7 px-3 text-[10px] text-neutral-400 hover:text-white hover:bg-white/10 gap-2 shrink-0"
                                            >
                                                <Clock className="h-3 w-3" />
                                                Schedule
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-[#09090b] border-white/10" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={scheduleDate}
                                                onSelect={(date) => {
                                                    setScheduleDate(date)
                                                    if (date) handleCreate('schedule')
                                                }}
                                                className="rounded-md border-white/5"
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <div className="w-px h-4 bg-white/10 mx-1" />
                                    <Button
                                        onClick={() => handleCreate('recurring')}
                                        variant="ghost"
                                        className="h-7 px-3 text-[10px] text-neutral-400 hover:text-white hover:bg-white/10 gap-2 shrink-0"
                                    >
                                        <Repeat className="h-3 w-3" />
                                        Recurring
                                    </Button>
                                </div>

                                {/* Hint Icon to indicate more actions */}
                                <div className="absolute -right-6 text-neutral-600 group-hover:opacity-0 transition-opacity">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* SCROLLABLE EDITOR AREA */}
                <div className="flex-1 overflow-y-auto pb-40 no-scrollbar">
                    <div className="max-w-5xl mx-auto py-12 px-12">

                        <div className={cn(
                            "rounded-2xl shadow-2xl transition-all duration-500",
                            invoiceMode === "light" ? "bg-white text-black border border-neutral-200" : "bg-[#09090b] border border-white/5 text-white",
                            template === "Classic" && "p-12",
                            template === "Minimal" && "p-20 border-none shadow-none",
                            template === "Modern" && "p-0 overflow-hidden"
                        )}>

                            {template === "Modern" && (
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />
                            )}

                            <div className={cn(template === "Modern" && "p-12")}>
                                {/* Header: Logo & Title */}
                                <div className="flex flex-col gap-8 mb-16">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Moved Settings Icons Here */}
                                            <div className="flex items-center gap-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", invoiceMode === "light" ? "text-neutral-400 hover:bg-neutral-100" : "text-neutral-500 hover:text-white hover:bg-white/5")}>
                                                            <Settings2 className="h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent side="bottom" align="start" className="w-80 bg-[#09090b] border-white/10 p-4 shadow-2xl">
                                                        <div className="space-y-6">
                                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Invoice Settings</h3>
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-neutral-400"><CalendarDays className="h-4 w-4" /><span className="text-xs">Date Format</span></div>
                                                                    <Select value={dateFormat} onValueChange={setDateFormat}>
                                                                        <SelectTrigger className="h-9 bg-white/5 border-white/10 text-xs text-white"><SelectValue /></SelectTrigger>
                                                                        <SelectContent className="bg-[#09090b] border-white/10 text-white">
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

                                            <div className={cn("h-px w-8", invoiceMode === "light" ? "bg-black/10" : "bg-white/20")} />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#878787]">Draft Invoice</span>
                                        </div>
                                        <div className={cn("flex items-center p-0.5 rounded-full border transition-all", invoiceMode === "light" ? "bg-white border-neutral-200" : "bg-[#0a0a0a] border-white/5")}>
                                            <button
                                                onClick={() => setInvoiceMode("light")}
                                                className={cn(
                                                    "h-7 w-7 rounded-full flex items-center justify-center transition-all",
                                                    invoiceMode === "light" ? "bg-black text-white shadow-sm" : "text-neutral-500 hover:text-white"
                                                )}
                                                title="Light Mode"
                                            >
                                                <div className="w-4 h-4 rounded-full bg-current" />
                                            </button>
                                            <button
                                                onClick={() => setInvoiceMode("dark")}
                                                className={cn(
                                                    "h-7 w-7 rounded-full flex items-center justify-center transition-all",
                                                    invoiceMode === "dark" ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-black"
                                                )}
                                                title="Dark Mode"
                                            >
                                                <div className="w-4 h-4 rounded-full border-2 border-current" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "w-32 h-32 border border-dashed rounded-3xl flex items-center justify-center transition-all cursor-pointer group relative overflow-hidden",
                                                invoiceMode === "light" ? "bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300" : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                                            )}
                                        >
                                            {logo ? (
                                                <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <>
                                                    <Plus className={cn("h-6 w-6 mb-1 group-hover:scale-110 transition-transform", invoiceMode === "light" ? "text-neutral-400" : "text-white")} />
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", invoiceMode === "light" ? "text-neutral-400" : "text-white")}>Logo</span>
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
                                                "text-5xl font-serif mb-2 italic",
                                                invoiceMode === "light" ? "text-black" : "text-white",
                                                template === "Classic" && "italic",
                                                template === "Minimal" && "font-sans uppercase tracking-[0.3em] font-normal",
                                                template === "Modern" && "font-sans font-black tracking-tighter text-6xl uppercase"
                                            )}>Invoice</h2>
                                            <p className="font-mono text-sm tracking-widest text-[#878787] h-5">{invoiceNumber}</p>
                                        </div>
                                    </div>

                                    {/* From / To Section (Cleaned up) */}
                                    <div className={cn(
                                        "grid grid-cols-2 gap-20 mb-16",
                                        template === "Modern" && "bg-white/5 p-8 rounded-xl"
                                    )}>
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787]">From</span>
                                            <div className="space-y-3">
                                                <Input
                                                    defaultValue="Illumi Professional"
                                                    placeholder="Your Name / Company"
                                                    spellCheck={false}
                                                    className={cn("bg-transparent border-none p-0 h-auto placeholder:text-neutral-400 text-lg font-bold focus-visible:ring-0", invoiceMode === "light" ? "text-black" : "text-white")}
                                                />
                                                <Input
                                                    value={fromEmail}
                                                    onChange={(e) => setFromEmail(e.target.value)}
                                                    placeholder="your@email.com"
                                                    type="email"
                                                    className={cn("bg-transparent border-none p-0 h-auto placeholder:text-neutral-400 text-sm focus-visible:ring-0", invoiceMode === "light" ? "text-neutral-600" : "text-neutral-400")}
                                                />
                                                <textarea
                                                    defaultValue={"123 Business Avenue\nInnovation District\nCape Town, 8001\nSouth Africa"}
                                                    placeholder="Address"
                                                    spellCheck={false}
                                                    className={cn("w-full bg-transparent border-none p-0 h-20 placeholder:text-neutral-400 text-sm focus:ring-0 resize-none", invoiceMode === "light" ? "text-neutral-600" : "text-neutral-400")}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 text-right">
                                            <div className="flex justify-between items-center mb-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn("h-6 text-[10px] px-2 gap-1", invoiceMode === "light" ? "text-neutral-500 hover:text-black hover:bg-neutral-100" : "text-neutral-500 hover:text-white hover:bg-white/5")}
                                                    onClick={() => setIsClientModalOpen(true)}
                                                >
                                                    <Plus className="h-3 w-3" /> New Client
                                                </Button>
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787]">To</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-3">
                                                    <Input
                                                        placeholder="Add Client"
                                                        list="client-suggestions"
                                                        spellCheck={false}
                                                        value={clientName}
                                                        className={cn("bg-transparent border-none p-0 h-auto placeholder:text-neutral-400 text-lg font-bold focus-visible:ring-0 text-right", invoiceMode === "light" ? "text-black" : "text-white")}
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
                                                        <div className="flex flex-col items-end gap-1 text-xs text-neutral-500">
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
                                <div className={cn("flex flex-wrap gap-12 mb-16 pb-12 border-b", invoiceMode === "light" ? "border-black/5" : "border-white/5")}>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Issue Date</span>
                                        <div className="relative">
                                            <Popover open={isIssueDateOpen} onOpenChange={setIsIssueDateOpen}>
                                                <PopoverTrigger asChild>
                                                    <button className={cn(
                                                        "bg-transparent border-none p-0 h-auto font-bold text-sm focus:ring-0 cursor-pointer min-w-[150px] outline-none text-left",
                                                        invoiceMode === "light" ? "text-black" : "text-white"
                                                    )}>
                                                        {issueDate ? format(parseISO(issueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : "Select Date"}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-[#09090b] border-white/10 rounded-xl" align="start">
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
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Due Date</span>
                                        <div className="relative">
                                            <Popover open={isDueDateOpen} onOpenChange={setIsDueDateOpen}>
                                                <PopoverTrigger asChild>
                                                    <button className={cn(
                                                        "bg-transparent border-none p-0 h-auto font-bold text-sm focus:ring-0 cursor-pointer min-w-[150px] outline-none text-left",
                                                        invoiceMode === "light" ? "text-black" : "text-white"
                                                    )}>
                                                        {dueDate ? format(parseISO(dueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : "Select Date"}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-[#09090b] border-white/10 rounded-xl" align="start">
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

                                {/* Tasks Table (Refined) */}
                                <div className="mb-12">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className={cn("border-b text-[10px] font-bold uppercase tracking-widest text-[#878787]", invoiceMode === "light" ? "border-black/5" : "border-white/5")}>
                                                <th className="py-4 text-left font-medium">
                                                    <div className="flex items-center gap-4">
                                                        Products
                                                        <button
                                                            onClick={() => setIsProductModalOpen(true)}
                                                            className={cn("flex items-center gap-1 text-[9px] transition-colors px-2 py-1 rounded cursor-pointer", invoiceMode === "light" ? "bg-black/5 hover:bg-black/10 text-neutral-600 hover:text-black" : "bg-white/5 hover:bg-white/10 text-neutral-500 hover:text-white")}
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
                                        <tbody className={cn("divide-y", invoiceMode === "light" ? "divide-black/5" : "divide-white/5")}>
                                            {tasks.map((task) => (
                                                <tr key={task.id} className="group transition-colors outline-none">
                                                    <td className="py-4">
                                                        <Input
                                                            placeholder="Enter Product"
                                                            spellCheck={false}
                                                            className={cn("bg-transparent border-none p-0 h-auto placeholder:text-neutral-600 focus-visible:ring-0 text-sm font-medium w-full", invoiceMode === "light" ? "text-black" : "text-white")}
                                                            value={task.description}
                                                            list="product-suggestions"
                                                            onChange={(e) => {
                                                                const newTasks = [...tasks]
                                                                const idx = newTasks.findIndex(t => t.id === task.id)
                                                                newTasks[idx].description = e.target.value

                                                                // Auto-fill price if product matches
                                                                const product = allProducts.find(p => p.name === e.target.value)
                                                                if (product) {
                                                                    newTasks[idx].price = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price
                                                                }
                                                                setTasks(newTasks)
                                                            }}
                                                        />
                                                        <datalist id="product-suggestions">
                                                            {allProducts.map(p => <option key={p.id} value={p.name} />)}
                                                        </datalist>
                                                    </td>
                                                    <td className="py-4 px-2 w-32">
                                                        {/* Improved Number Input Styles */}
                                                        <NumberInput
                                                            value={task.price}
                                                            onChange={(val) => {
                                                                const newTasks = [...tasks]
                                                                const idx = newTasks.findIndex(t => t.id === task.id)
                                                                newTasks[idx].price = val
                                                                setTasks(newTasks)
                                                            }}
                                                            className={cn(
                                                                "justify-end h-11 px-3 rounded-md text-base font-medium transition-all focus-within:ring-1 focus-within:ring-emerald-500/50 w-full text-right",
                                                                invoiceMode === "light"
                                                                    ? "bg-neutral-100 border-transparent text-neutral-900 placeholder:text-neutral-400"
                                                                    : "bg-white/5 border-transparent text-white placeholder:text-white/30"
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="py-4 px-2 text-right font-mono text-sm w-24">
                                                        {/* Improved Number Input Styles */}
                                                        <NumberInput
                                                            value={task.qty}
                                                            onChange={(val) => {
                                                                const newTasks = [...tasks]
                                                                const idx = newTasks.findIndex(t => t.id === task.id)
                                                                newTasks[idx].qty = val
                                                                setTasks(newTasks)
                                                            }}
                                                            className={cn(
                                                                "justify-end h-11 px-3 rounded-md text-base font-medium transition-all focus-within:ring-1 focus-within:ring-emerald-500/50 w-full text-right",
                                                                invoiceMode === "light"
                                                                    ? "bg-neutral-100 border-transparent text-neutral-900"
                                                                    : "bg-white/5 border-transparent text-white"
                                                            )}
                                                        />
                                                    </td>
                                                    <td className={cn("py-4 text-right font-bold text-sm font-mono w-32", invoiceMode === "light" ? "text-black" : "text-white")}>
                                                        {(task.price * task.qty).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                                    </td>
                                                    <td className="py-4 text-right pl-2">
                                                        <button
                                                            onClick={() => removeTask(task.id)}
                                                            className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all outline-none"
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
                                        className="mt-8 text-neutral-500 hover:text-emerald-500 gap-2 px-0 hover:bg-transparent border border-dashed border-white/5 w-full h-12 rounded-xl group transition-all"
                                        onClick={addTask}
                                    >
                                        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Add line item</span>
                                    </Button>
                                </div>

                                {/* Summary & Totals */}
                                {/* Summary & Totals */}
                                <div className="grid grid-cols-12 gap-8 mt-20 pt-12 border-t border-white/5">
                                    <div className="col-span-8 flex flex-col gap-6">
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Note</span>
                                            <textarea
                                                placeholder="Add a note (visible to client)"
                                                value={invoiceNote}
                                                onChange={(e) => setInvoiceNote(e.target.value)}
                                                className="w-full bg-transparent border-none p-0 h-24 text-neutral-400 placeholder:text-neutral-800 text-sm focus:ring-0 resize-none"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Payment Info</span>
                                            {isPro ? (
                                                <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all min-w-[320px]">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] -mr-16 -mt-16" />
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                                            <CreditCard className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-black text-white uppercase tracking-widest whitespace-nowrap">PayGate Active</span>
                                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/10 shrink-0">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Live</span>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] text-neutral-500 font-medium mt-1 uppercase tracking-tighter truncate">Clients can pay via card / Instant EFT</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full mt-4 h-auto py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 border border-white/10 gap-2 whitespace-normal text-center leading-relaxed"
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
                                                <div className="space-y-1 text-sm text-neutral-500 font-medium">
                                                    <p>Account name: Illumi Professional</p>
                                                    <p>Account number: 123456789</p>
                                                    <p>Bank: First National Bank</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-4 flex flex-col gap-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500">Subtotal</span>
                                            <span className="font-mono text-white">{calculateSubtotal().toLocaleString('en-ZA', { style: 'currency', currency: currency })}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500">Tax ({taxRate}%)</span>
                                            <span className="font-mono text-white">{(calculateSubtotal() * taxRate / 100).toLocaleString('en-ZA', { style: 'currency', currency: currency })}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                            <span className="text-sm font-bold text-white uppercase tracking-widest">Total</span>
                                            <span className="text-3xl font-black text-white font-mono">
                                                {(calculateSubtotal() * (1 + taxRate / 100)).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

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
                    invoiceMode, // Pass the mode state
                    clientName,
                    clientEmail,
                    clientPhone,
                    clientAddress,
                    invoiceNumber,
                    fromEmail,
                    issueDate,
                    dueDate
                }}
            />


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

            <RecurringModal
                isOpen={isRecurringModalOpen}
                onClose={() => setIsRecurringModalOpen(false)}
                onSave={(settings) => {
                    setIsRecurringEnabled(true)
                    setRecurringInterval(settings.interval)
                    setRecurringEndType(settings.endType)
                    setRecurringEndDate(settings.endDate)

                    // Trigger save with overrides
                    handleSaveInvoice('sent', {
                        isRecurring: true,
                        recurringInterval: settings.interval,
                        recurringEndType: settings.endType,
                        recurringEndDate: settings.endDate
                    })
                    setRecurringEndCount(settings.endCount || 12)
                    toast.success(`Recurring set to ${settings.interval}`)
                }}
                initialSettings={{
                    interval: recurringInterval,
                    endType: recurringEndType,
                    endDate: recurringEndDate,
                    endCount: recurringEndCount
                }}
            />
        </div>
    )
}
