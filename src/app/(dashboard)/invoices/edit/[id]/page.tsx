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
import { useRouter, useParams } from "next/navigation"
import { NumberInput } from "@/components/ui/number-input"
// Lazy load PreviewModal - only needed when user clicks Preview
const PreviewModal = lazy(() => import("../../components/preview-modal").then(m => ({ default: m.PreviewModal })))
import { allClients, allProducts } from "@/lib/data"
import { useSubscription } from "@/lib/subscription/hooks"
import { toast } from "sonner"
import { useSettings } from "@/lib/settings-context"
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

import { CreateClientModal } from "../../components/create-client-modal"
import { CreateProductModal } from "../../components/create-product-modal"
import { RecurringModal } from "../../components/recurring-modal"

type TemplateType = "Classic" | "Minimal" | "Modern"

export default function EditInvoicePage() {
    const router = useRouter()
    const params = useParams()
    const invoiceId = params.id as string
    const { isPro } = useSubscription()
    const settings = useSettings()
    const { activePaymentProvider } = settings

    const [template, setTemplate] = useState<TemplateType>("Classic")
    const [tasks, setTasks] = useState([
        { id: 1, description: "", price: 0, qty: 1 }
    ])

    // Invoice Settings State
    const [currency, setCurrency] = useState(settings.currency ?? "ZAR")
    const [taxRate, setTaxRate] = useState(settings.taxRate ?? 0)
    const [dateFormat, setDateFormat] = useState(settings.dateFormat ?? "DD/MM/YYYY")

    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [invoiceNumber, setInvoiceNumber] = useState("")
    const [clientName, setClientName] = useState("")
    const [clientAddress, setClientAddress] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [clientPhone, setClientPhone] = useState("")

    const [fromEmail, setFromEmail] = useState(settings.fromEmail ?? "hello@illumi.co.za")
    const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [dueDate, setDueDate] = useState("")
    const [logo, setLogo] = useState<string | null>(null)
    const [isIssueDateOpen, setIsIssueDateOpen] = useState(false)
    const [isDueDateOpen, setIsDueDateOpen] = useState(false)
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)

    const [invoiceMode, setInvoiceMode] = useState<"light" | "dark">("dark")
    const illumiLogoSrc = invoiceMode === 'light' ? '/midday-logo.png' : '/logo.png'

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
    const [customers, setCustomers] = useState<any[]>([])
    const [customerId, setCustomerId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    // Helper functions
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
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }

                // Fetch customers
                const { data: customersData } = await supabase.from('customers').select('*')
                if (customersData) setCustomers(customersData)

                // Fetch invoice
                if (invoiceId) {
                    const { data: invoice, error } = await supabase
                        .from('invoices')
                        .select('*, invoice_items(*), customers(*)')
                        .eq('id', invoiceId)
                        .single()

                    if (error) throw error
                    if (invoice) {
                        setInvoiceNumber(invoice.invoice_number)
                        setTemplate(invoice.template as TemplateType || "Classic")
                        setCurrency(invoice.currency || "ZAR")
                        setTaxRate(invoice.tax_rate || 0)
                        setInvoiceMode((invoice.invoice_mode as "light" | "dark") || "dark")
                        setIssueDate(invoice.issue_date || invoice.created_at.split('T')[0])
                        setDueDate(invoice.due_date || "")
                        setCustomerId(invoice.customer_id)
                        setIsRecurringEnabled(invoice.is_recurring || false)
                        setRecurringInterval(invoice.recurring_interval || "monthly")
                        setLogo(invoice.logo_url || settings.logo)
                        setFromEmail(invoice.from_email || settings.fromEmail)
                        setInvoiceNote((invoice.notes || invoice.note || "") as string)

                        if (invoice.customers) {
                            setClientName(invoice.customers.name)
                            setClientEmail(invoice.customers.email)
                            setClientAddress(invoice.customers.address || "")
                            setClientPhone(invoice.customers.phone || "")
                        }

                        if (invoice.invoice_items && invoice.invoice_items.length > 0) {
                            setTasks(invoice.invoice_items.map((item: any) => ({
                                id: item.id,
                                description: item.description,
                                price: item.unit_price,
                                qty: item.quantity
                            })))
                        }
                    }
                }
            } catch (err: any) {
                console.error("Fetch error:", err)
                toast.error("Failed to load invoice")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [invoiceId, router, supabase])

    const handleSaveInvoice = async (status: 'draft' | 'sent' | 'scheduled' = 'draft') => {
        setIsSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Session expired")

            const subtotal = tasks.reduce((acc, t) => acc + (t.price * t.qty), 0)
            const taxAmount = subtotal * (taxRate / 100)
            const total = subtotal + taxAmount

            const invoiceData: any = {
                invoice_number: invoiceNumber,
                status: status,
                issue_date: issueDate,
                due_date: dueDate || null,
                customer_id: customerId || null,
                currency: currency,
                subtotal: subtotal,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                total: total,
                notes: invoiceNote,
                is_recurring: isRecurringEnabled,
                recurring_interval: isRecurringEnabled ? recurringInterval : null,
                template: template,
                invoice_mode: invoiceMode,
                logo_url: logo,
                logo_bg: null,
                from_email: fromEmail,
                company_website: settings.companyWebsite || null,
                bank_name: settings.bankName || null,
                account_name: settings.accountName || null,
                account_number: settings.accountNumber || null,
                branch_code: settings.branchCode || null,
                send_copy_to_self: Boolean(settings.sendInvoiceCopyToSelf),
                hide_illumi_branding: Boolean(isPro && settings.hideIllumiBranding),
            }

            // Update Invoice
            let { error: invoiceError } = await supabase
                .from('invoices')
                .update(invoiceData)
                .eq('id', invoiceId)

            if (invoiceError && invoiceError.message?.includes('notes')) {
                const { notes, ...fallbackData } = invoiceData as any
                const { error: retryError } = await supabase
                    .from('invoices')
                    .update(fallbackData)
                    .eq('id', invoiceId)
                invoiceError = retryError
            }

            if (invoiceError && (invoiceError as any).code === 'PGRST204') {
                const { hide_illumi_branding, company_website, bank_name, account_name, account_number, branch_code, ...fallbackData } = invoiceData as any
                const { error: retryError } = await supabase
                    .from('invoices')
                    .update(fallbackData)
                    .eq('id', invoiceId)
                invoiceError = retryError
            }

            if (invoiceError) throw invoiceError

            // Delete old items and insert new ones (simpler than syncing)
            await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId)

            const itemsToInsert = tasks.filter(t => t.description).map((task, index) => ({
                invoice_id: invoiceId,
                description: task.description,
                quantity: task.qty,
                unit_price: task.price,
                total: task.price * task.qty,
                sort_order: index
            }))

            if (itemsToInsert.length > 0) {
                const { error: itemsError } = await supabase
                    .from('invoice_items')
                    .insert(itemsToInsert)
                if (itemsError) throw itemsError
            }

            // 3. Send Email if status is 'sent'
            if (status === 'sent' && clientEmail) {
                try {
                    const { data: { user } } = await supabase.auth.getUser()
                    const emailRes = await fetch('/api/email/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'invoice',
                            to: clientEmail,
                            bcc: settings.sendInvoiceCopyToSelf ? (fromEmail || undefined) : undefined,
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
                        toast.success("Invoice updated and email sent")
                        if (emailData.copy) {
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
                        toast.warning("Invoice updated, but email failed", {
                            description: isDomainError
                                ? "Resend requires a verified domain to send to external recipients."
                                : emailData.error,
                            action: isDomainError ? {
                                label: "Verify Domain",
                                onClick: () => window.open("https://resend.com/domains", "_blank")
                            } : undefined
                        })
                    }
                } catch (err) {
                    console.error("Email send failed:", err)
                    toast.warning("Invoice updated, but email service is unavailable")
                }
            } else {
                toast.success("Invoice updated successfully")
            }

            router.push('/invoices')

        } catch (error: any) {
            console.error('Update failed:', error)
            toast.error("Failed to update invoice", { description: error.message })
        } finally {
            setIsSaving(false)
        }
    }

    const handleCreate = (type: "create" | "send" | "schedule" | "recurring") => {
        if (type === 'recurring') {
            setIsRecurringModalOpen(true)
            return
        }

        const statusMap = {
            create: 'draft',
            send: 'sent',
            schedule: 'scheduled'
        } as const

        handleSaveInvoice(statusMap[type])
    }

    if (isLoading) {
        return <div className="h-full bg-background flex items-center justify-center text-foreground">Loading Invoice...</div>
    }

    return (
        <div className="h-full bg-background text-foreground font-sans flex overflow-hidden">
            {/* Reuse the UI from new/page.tsx but with Edit context */}
            {/* Since the UI is identical, I will copy the JSX here */}
            {/* NOTE: I'm omitting the full JSX for brevity in this thought but I'll write the full file */}

            <div className="flex-1 flex flex-col relative h-full bg-background">
                <div className="h-20 px-8 flex justify-between items-center border-b border-border bg-background z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/invoices" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-sm font-bold uppercase tracking-widest text-foreground">Edit Invoice</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>

                        <div className="flex items-center h-9 bg-primary text-primary-foreground rounded-lg overflow-hidden transition-all hover:bg-primary/90">
                            <Button
                                className="h-full px-4 rounded-none bg-transparent hover:bg-transparent text-black text-xs font-bold border-r border-foreground/10"
                                onClick={() => handleCreate('create')}
                            >
                                <span className="translate-y-px">Save Changes</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-full px-2 hover:bg-black/5 transition-colors outline-none flex items-center justify-center">
                                        <ChevronDown className="h-3 w-3" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-card border-border text-foreground p-2">
                                    <DropdownMenuItem onClick={() => handleCreate('send')} className="focus:bg-muted cursor-pointer h-9 px-2 text-xs rounded-md">
                                        <Send className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Update & Send</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCreate('schedule')} className="focus:bg-muted cursor-pointer h-9 px-2 text-xs rounded-md">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Schedule...</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-muted" />
                                    <DropdownMenuItem onClick={() => handleCreate('recurring')} className="focus:bg-muted cursor-pointer h-9 px-2 text-xs rounded-md">
                                        <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Recurring...</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pb-40 no-scrollbar">
                    <div className="max-w-5xl mx-auto py-12 px-12">
                        {/* THE ACTUAL EDITOR UI (copied from new/page.tsx) */}
                        {/* ... (Same as new/page.tsx but with state mapped) */}

                        <div className={cn(
                            "rounded-2xl shadow-2xl transition-all duration-500",
                            invoiceMode === "light" ? "bg-primary text-primary-foreground border border-neutral-200" : "bg-card border border-border text-foreground",
                            template === "Classic" && "p-12",
                            template === "Minimal" && "p-20 border-none shadow-none",
                            template === "Modern" && "p-0 overflow-hidden"
                        )}>

                            {template === "Modern" && (
                                <div className="h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />
                            )}

                            <div className={cn(template === "Modern" && "p-12")}>
                                <div className="flex flex-col gap-8 mb-16">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", invoiceMode === "light" ? "text-muted-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
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
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-muted-foreground"><Banknote className="h-4 w-4" /><span className="text-xs">Currency</span></div>
                                                                    <Select value={currency} onValueChange={setCurrency}>
                                                                        <SelectTrigger className="h-9 bg-muted border-border text-xs text-foreground"><SelectValue /></SelectTrigger>
                                                                        <SelectContent className="bg-card border-border text-foreground">
                                                                            <SelectItem value="ZAR">ZAR (R)</SelectItem>
                                                                            <SelectItem value="USD">USD ($)</SelectItem>
                                                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-muted-foreground"><Percent className="h-4 w-4" /><span className="text-xs">Tax Rate</span></div>
                                                                    <Select value={taxRate.toString()} onValueChange={(v) => setTaxRate(parseFloat(v))}>
                                                                        <SelectTrigger className="h-9 bg-muted border-border text-xs text-foreground"><SelectValue /></SelectTrigger>
                                                                        <SelectContent className="bg-card border-border text-foreground">
                                                                            <SelectItem value="0">0%</SelectItem>
                                                                            <SelectItem value="15">15% (VAT)</SelectItem>
                                                                            <SelectItem value="20">20%</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>

                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", invoiceMode === "light" ? "text-muted-foreground hover:bg-neutral-100" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                                                            <LayoutTemplate className="h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent side="bottom" align="start" className="w-64 bg-card border-border p-4 shadow-2xl">
                                                        <div className="space-y-4">
                                                            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Template</h3>
                                                            <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
                                                                <SelectTrigger className="h-9 bg-muted border-border text-xs text-foreground"><SelectValue /></SelectTrigger>
                                                                <SelectContent className="bg-card border-border text-foreground">
                                                                    <SelectItem value="Classic">Classic Serif</SelectItem>
                                                                    <SelectItem value="Minimal">Minimal Canvas</SelectItem>
                                                                    <SelectItem value="Modern">Modern Grid</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className={cn("h-px w-8", invoiceMode === "light" ? "bg-black/10" : "bg-muted/500")} />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Editing Invoice</span>
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
                                                    <Plus className={cn("h-6 w-6 mb-1 group-hover:scale-110 transition-transform", invoiceMode === "light" ? "text-muted-foreground" : "text-foreground")} />
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", invoiceMode === "light" ? "text-muted-foreground" : "text-foreground")}>Logo</span>
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
                                                invoiceMode === "light" ? "text-black" : "text-foreground",
                                                template === "Classic" && "italic",
                                                template === "Minimal" && "font-sans uppercase tracking-[0.3em] font-normal",
                                                template === "Modern" && "font-sans font-black tracking-tighter text-6xl uppercase"
                                            )}>Invoice</h2>
                                            <p className={cn("invoice-font-id text-sm tracking-widest h-5", invoiceMode === "light" ? "text-muted-foreground" : "text-muted-foreground")}>{invoiceNumber}</p>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "grid grid-cols-2 gap-20 mb-16",
                                        template === "Modern" && "bg-muted p-8 rounded-xl"
                                    )}>
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">From</span>
                                            <div className="space-y-3">
                                                <Input
                                                    defaultValue="Illumi Professional"
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
                                                    defaultValue={"123 Business Avenue\nInnovation District\nCape Town, 8001\nSouth Africa"}
                                                    placeholder="Address"
                                                    spellCheck={false}
                                                    className={cn("invoice-font-from w-full bg-transparent border-none p-0 h-20 placeholder:text-muted-foreground text-sm focus:ring-0 resize-none", invoiceMode === "light" ? "text-muted-foreground" : "text-muted-foreground")}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 text-right">
                                            <div className="flex justify-end items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">To</span>
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
                                                        }
                                                    }}
                                                />
                                                <datalist id="client-suggestions">
                                                    {customers.map(c => <option key={c.id} value={c.name} />)}
                                                </datalist>

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

                                    <div className={cn("flex flex-wrap gap-12 mb-16 pb-12 border-b", invoiceMode === "light" ? "border-foreground/5" : "border-border")}>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue Date</span>
                                            <Popover open={isIssueDateOpen} onOpenChange={setIsIssueDateOpen}>
                                                <PopoverTrigger asChild>
                                                    <button className={cn("bg-transparent border-none p-0 h-auto font-bold text-sm outline-none text-left", invoiceMode === "light" ? "text-black" : "text-foreground")}>
                                                        {issueDate ? format(parseISO(issueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : "Select Date"}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-card border-border rounded-xl" align="start">
                                                    <Calendar
                                                        selected={issueDate ? parseISO(issueDate) : undefined}
                                                        onSelect={(date) => {
                                                            if (date) setIssueDate(date.toISOString().split('T')[0])
                                                            setIsIssueDateOpen(false)
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Due Date</span>
                                            <Popover open={isDueDateOpen} onOpenChange={setIsDueDateOpen}>
                                                <PopoverTrigger asChild>
                                                    <button className={cn("bg-transparent border-none p-0 h-auto font-bold text-sm outline-none text-left", invoiceMode === "light" ? "text-black" : "text-foreground")}>
                                                        {dueDate ? format(parseISO(dueDate), dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy')) : "Select Date"}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-card border-border rounded-xl" align="start">
                                                    <Calendar
                                                        selected={dueDate ? parseISO(dueDate) : undefined}
                                                        onSelect={(date) => {
                                                            if (date) setDueDate(date.toISOString().split('T')[0])
                                                            setIsDueDateOpen(false)
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="mb-12">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className={cn("border-b text-[10px] font-bold uppercase tracking-widest text-muted-foreground", invoiceMode === "light" ? "border-foreground/5" : "border-border")}>
                                                    <th className="py-4 text-left">Description</th>
                                                    <th className="py-4 text-right w-32">Price</th>
                                                    <th className="py-4 text-right w-24">Qty</th>
                                                    <th className="py-4 text-right w-32">Total</th>
                                                    <th className="w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className={cn("divide-y", invoiceMode === "light" ? "divide-black/5" : "divide-border")}>
                                                {tasks.map((task) => (
                                                    <tr key={task.id} className="group">
                                                        <td className="py-4">
                                                            <Input
                                                                className={cn("bg-transparent border-none p-0 h-auto text-sm font-medium focus-visible:ring-0", invoiceMode === "light" ? "text-black" : "text-foreground")}
                                                                value={task.description}
                                                                onChange={(e) => {
                                                                    const newTasks = [...tasks]
                                                                    const idx = newTasks.findIndex(t => t.id === task.id)
                                                                    newTasks[idx].description = e.target.value
                                                                    setTasks(newTasks)
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-2 w-32 text-right">
                                                            <NumberInput
                                                                value={task.price}
                                                                onChange={(val) => {
                                                                    const newTasks = [...tasks]
                                                                    const idx = newTasks.findIndex(t => t.id === task.id)
                                                                    newTasks[idx].price = val
                                                                    setTasks(newTasks)
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-2 text-right font-mono text-sm w-24">
                                                            <NumberInput
                                                                value={task.qty}
                                                                onChange={(val) => {
                                                                    const newTasks = [...tasks]
                                                                    const idx = newTasks.findIndex(t => t.id === task.id)
                                                                    newTasks[idx].qty = val
                                                                    setTasks(newTasks)
                                                                }}
                                                            />
                                                        </td>
                                                        <td className={cn("py-4 text-right font-bold text-sm font-mono w-32", invoiceMode === "light" ? "text-black" : "text-foreground")}>
                                                            {(task.price * task.qty).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <button onClick={() => removeTask(task.id)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <Button variant="ghost" className="mt-8 border border-dashed border-border w-full h-12 rounded-xl" onClick={addTask}>
                                            <Plus className="h-4 w-4 mr-2" /> Add line item
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-border">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Note</span>
                                                <textarea
                                                    placeholder="Add a note (visible to client)"
                                                    value={invoiceNote}
                                                    onChange={(e) => setInvoiceNote(e.target.value)}
                                                    className={cn("w-full bg-transparent border-none p-0 h-24 placeholder:text-muted-foreground text-sm focus:ring-0 resize-none italic font-serif", invoiceMode === "light" ? "text-muted-foreground" : "text-muted-foreground")}
                                                />
                                            </div>

                                            {!(Boolean(isPro) && Boolean(settings.hideIllumiBranding)) && Boolean(isPro) && (
                                                <div>
                                                    <img
                                                        src={illumiLogoSrc}
                                                        alt="Illumi"
                                                        className={cn(
                                                            "h-5 w-5 object-contain",
                                                            invoiceMode === 'light' ? 'opacity-40' : 'opacity-60'
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Subtotal</span>
                                                <span className={cn("font-mono", invoiceMode === "light" ? "text-black" : "text-foreground")}>
                                                    {calculateSubtotal().toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Tax ({taxRate}%)</span>
                                                <span className="text-muted-foreground font-mono">
                                                    {(calculateSubtotal() * (taxRate / 100)).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                                </span>
                                            </div>
                                            <div className={cn("pt-6 border-t flex justify-between items-end", invoiceMode === "light" ? "border-foreground/10" : "border-border")}>
                                                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground mb-2">Total Amount</span>
                                                <span className={cn("text-5xl font-serif italic font-bold tracking-tighter", invoiceMode === "light" ? "text-black" : "text-foreground")}>
                                                    {(calculateSubtotal() * (1 + taxRate / 100)).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!(Boolean(isPro) && Boolean(settings.hideIllumiBranding)) && !Boolean(isPro) && (
                                    <div className="flex justify-center pt-10">
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
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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

            <CreateClientModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} onSuccess={(c: any) => { setCustomers([...customers, c]); setCustomerId(c.id); setClientName(c.name); }} />
            <CreateProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSuccess={(p: any) => {
                const newTasks = [...tasks];
                const lastIdx = newTasks.length - 1;
                if (!newTasks[lastIdx].description) {
                    newTasks[lastIdx].description = p.name;
                    newTasks[lastIdx].price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : p.price;
                } else {
                    newTasks.push({ id: Date.now(), description: p.name, price: typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : p.price, qty: 1 });
                }
                setTasks(newTasks);
            }} />
            <RecurringModal isOpen={isRecurringModalOpen} onClose={() => setIsRecurringModalOpen(false)} onSave={(data: any) => { setIsRecurringEnabled(true); setRecurringInterval(data.interval); }} />
        </div>
    )
}
