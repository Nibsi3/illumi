"use client"

import React, { useState, useEffect } from "react"
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
import { PreviewModal } from "./preview-modal"
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
import { format } from "date-fns"

import { CreateClientModal } from "./create-client-modal"
import { CreateProductModal } from "./create-product-modal"

type TemplateType = "Classic" | "Minimal" | "Modern"

export default function NewInvoicePage() {
    const router = useRouter()
    const { isPro } = useSubscription()
    const settings = useSettings()

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
    // These are now just used for preview/display, not manual editing
    const [clientAddress, setClientAddress] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [clientPhone, setClientPhone] = useState("")

    const [fromEmail, setFromEmail] = useState(settings.fromEmail ?? "hello@illumi.co.za")
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
    const [dueDate, setDueDate] = useState("")
    const [invoiceMode, setInvoiceMode] = useState<"light" | "dark">("dark")
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)

    // Recurring State
    const [recurringInterval, setRecurringInterval] = useState("monthly")
    const [recurringEndType, setRecurringEndType] = useState<"on" | "after" | "never">("on")
    const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
    const [recurringEndCount, setRecurringEndCount] = useState(12)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)

    // Schedule State
    const [isScheduled, setIsScheduled] = useState(false)
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date())
    const [scheduleTime, setScheduleTime] = useState("09:00")

    // Logo
    const [logo, setLogo] = useState<string | null>(null)

    useEffect(() => {
        setInvoiceNumber(`#INV-${Date.now().toString().slice(-6)}`)
    }, [])

    useEffect(() => {
        if (settings.logo && !logo) setLogo(settings.logo)
        if (settings.currency) setCurrency(settings.currency)
        if (settings.dateFormat) setDateFormat(settings.dateFormat)
        if (settings.taxRate !== undefined) setTaxRate(settings.taxRate)
        if (settings.fromEmail && fromEmail === "hello@illumi.co.za") setFromEmail(settings.fromEmail)
    }, [settings, logo, fromEmail])

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

    const fileInputRef = React.useRef<HTMLInputElement>(null)

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

    const handleCreate = (type: "create" | "send" | "schedule") => {
        const actionMap = {
            create: "Invoice Created",
            send: "Invoice Created & Sent",
            schedule: "Invoice Scheduled"
        }

        toast.success(actionMap[type], {
            description: type === "schedule"
                ? `Scheduled for ${scheduleDate ? format(scheduleDate, "PPP") : 'later'} at ${scheduleTime}`
                : `Invoice ${invoiceNumber} has been processed.`
        })
    }

    return (
        <div className="h-full bg-black text-white font-sans flex overflow-hidden">

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col relative h-full bg-black">
                {/* TOP ACTION BAR - Floating/Absolute Top Right */}
                <div className="absolute top-0 right-0 left-0 p-8 flex justify-end items-start pointer-events-none z-20">
                    <div className="pointer-events-auto flex items-center gap-3 bg-black/50 backdrop-blur-sm p-1 rounded-xl border border-white/5 shadow-2xl">
                        <Button
                            variant="ghost"
                            className="h-9 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>

                        {/* SPLIT BUTTON */}
                        <div className="flex items-center h-9 bg-white text-black rounded-lg overflow-hidden transition-all hover:bg-neutral-200">
                            <Button
                                className="h-full px-4 rounded-none bg-transparent hover:bg-transparent text-black text-xs font-bold border-r border-black/10"
                                onClick={() => handleCreate('create')}
                            >
                                Create
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-full px-2 hover:bg-black/5 transition-colors outline-none flex items-center justify-center">
                                        <ChevronDown className="h-3 w-3" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-[#09090b] border-white/10 text-white p-2">
                                    <DropdownMenuItem onClick={() => handleCreate('send')} className="focus:bg-white/5 cursor-pointer h-9 px-2 text-xs rounded-md">
                                        <span>Create & Send</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/5 my-1" />
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="h-9 px-2 text-xs rounded-md focus:bg-white/5 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-3 w-3 text-neutral-400" />
                                                <span>Schedule</span>
                                            </div>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="bg-[#09090b] border-white/10 text-white p-3 w-auto min-w-[320px] mr-2">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Schedule Sending</span>
                                                    <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
                                                </div>

                                                <div className="p-2 bg-black/20 rounded-xl border border-white/5 flex justify-center">
                                                    <Calendar
                                                        mode="single"
                                                        selected={scheduleDate}
                                                        onSelect={setScheduleDate}
                                                        initialFocus
                                                        className="rounded-md border-none p-0"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase text-neutral-500 font-bold">Time</Label>
                                                    <Select value={scheduleTime} onValueChange={setScheduleTime}>
                                                        <SelectTrigger className="h-9 bg-white/5 border-white/10 text-xs text-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#09090b] border-white/10 text-white max-h-[200px]">
                                                            {Array.from({ length: 48 }).map((_, i) => {
                                                                const hour = Math.floor(i / 2)
                                                                const minute = i % 2 === 0 ? "00" : "30"
                                                                const time = `${hour.toString().padStart(2, '0')}:${minute} ${hour < 12 ? 'AM' : 'PM'}`
                                                                return (
                                                                    <SelectItem key={time} value={time}>
                                                                        {time}
                                                                    </SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button
                                                    className="w-full bg-white text-black hover:bg-neutral-200 h-9 text-xs font-bold"
                                                    disabled={!isScheduled}
                                                    onClick={() => handleCreate('schedule')}
                                                >
                                                    Confirm Schedule
                                                </Button>
                                            </div>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="h-9 px-2 text-xs rounded-md focus:bg-white/5 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <Repeat className="h-3 w-3 text-neutral-400" />
                                                <span>Recurring</span>
                                                <span className="ml-auto text-[9px] bg-emerald-500/10 text-emerald-500 px-1 py-0.5 rounded border border-emerald-500/20">Beta</span>
                                            </div>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="bg-[#09090b] border-white/10 text-white p-4 w-80 mr-2 shadow-2xl">
                                            <div className="space-y-6">
                                                {/* Repeat Section */}
                                                <div className="space-y-3">
                                                    <Label className="text-xs text-neutral-500 font-medium">Repeat</Label>
                                                    <Select value={recurringInterval} onValueChange={setRecurringInterval}>
                                                        <SelectTrigger className="h-10 bg-white/5 border-white/10 text-sm focus:ring-0 focus:ring-offset-0">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                                            <SelectItem value="weekly">Weekly on {format(new Date(), 'EEEE')}</SelectItem>
                                                            <SelectItem value="monthly">Monthly on the {format(new Date(), 'do')}</SelectItem>
                                                            <SelectItem value="yearly">Yearly on {format(new Date(), 'MMM do')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Ends Section */}
                                                <div className="space-y-3">
                                                    <Label className="text-xs text-neutral-500 font-medium">Ends</Label>
                                                    <div className="space-y-3">
                                                        {/* On Date */}
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                onClick={() => setRecurringEndType('on')}
                                                                className={cn("w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-colors", recurringEndType === 'on' ? "border-white bg-transparent" : "border-neutral-600 hover:border-neutral-400")}
                                                            >
                                                                {recurringEndType === 'on' && <div className="w-2 h-2 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={cn("text-sm cursor-pointer", recurringEndType === 'on' ? "text-white" : "text-neutral-400")} onClick={() => setRecurringEndType('on')}>On</span>

                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "h-9 border-white/10 bg-white/5 text-sm ml-2 hover:bg-white/10 hover:text-white transition-colors w-32 justify-start font-normal",
                                                                            recurringEndType !== 'on' && "opacity-50 pointer-events-none"
                                                                        )}
                                                                        disabled={recurringEndType !== 'on'}
                                                                    >
                                                                        {recurringEndDate ? format(recurringEndDate, "MMM dd, yyyy") : "Select Date"}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0 bg-[#09090b] border-white/10" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={recurringEndDate}
                                                                        onSelect={setRecurringEndDate}
                                                                        initialFocus
                                                                        className="bg-[#09090b] text-white"
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>

                                                        {/* After Count */}
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                onClick={() => setRecurringEndType('after')}
                                                                className={cn("w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-colors", recurringEndType === 'after' ? "border-white bg-transparent" : "border-neutral-600 hover:border-neutral-400")}
                                                            >
                                                                {recurringEndType === 'after' && <div className="w-2 h-2 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={cn("text-sm cursor-pointer", recurringEndType === 'after' ? "text-white" : "text-neutral-400")} onClick={() => setRecurringEndType('after')}>After</span>

                                                            <div className="flex items-center gap-2 ml-2">
                                                                <Input
                                                                    type="number"
                                                                    value={recurringEndCount}
                                                                    onChange={(e) => setRecurringEndCount(parseInt(e.target.value))}
                                                                    className={cn("h-9 w-16 bg-white/5 border-white/10 text-center text-sm", recurringEndType !== 'after' && "opacity-50 pointer-events-none")}
                                                                    disabled={recurringEndType !== 'after'}
                                                                />
                                                                <span className="text-sm text-white font-bold">invoices</span>
                                                            </div>
                                                        </div>

                                                        {/* Never */}
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                onClick={() => setRecurringEndType('never')}
                                                                className={cn("w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-colors", recurringEndType === 'never' ? "border-white bg-transparent" : "border-neutral-600 hover:border-neutral-400")}
                                                            >
                                                                {recurringEndType === 'never' && <div className="w-2 h-2 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={cn("text-sm cursor-pointer", recurringEndType === 'never' ? "text-white" : "text-neutral-400")} onClick={() => setRecurringEndType('never')}>Never</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* SCROLLABLE EDITOR AREA */}
                <div className="flex-1 overflow-y-auto pb-40 no-scrollbar">
                    <div className="max-w-4xl mx-auto pt-24 px-12">

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
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-neutral-400"><Banknote className="h-4 w-4" /><span className="text-xs">Currency</span></div>
                                                                    <Select value={currency} onValueChange={setCurrency}>
                                                                        <SelectTrigger className="h-9 bg-white/5 border-white/10 text-xs text-white"><SelectValue /></SelectTrigger>
                                                                        <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                                                            <SelectItem value="ZAR">ZAR (R)</SelectItem>
                                                                            <SelectItem value="USD">USD ($)</SelectItem>
                                                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-neutral-400"><Percent className="h-4 w-4" /><span className="text-xs">Tax Rate</span></div>
                                                                    <Select value={taxRate.toString()} onValueChange={(v) => setTaxRate(parseFloat(v))}>
                                                                        <SelectTrigger className="h-9 bg-white/5 border-white/10 text-xs text-white"><SelectValue /></SelectTrigger>
                                                                        <SelectContent className="bg-[#09090b] border-white/10 text-white">
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
                                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", invoiceMode === "light" ? "text-neutral-400 hover:bg-neutral-100" : "text-neutral-500 hover:text-white hover:bg-white/5")}>
                                                            <LayoutTemplate className="h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent side="bottom" align="start" className="w-64 bg-[#09090b] border-white/10 p-4 shadow-2xl">
                                                        <div className="space-y-4">
                                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Template</h3>
                                                            <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
                                                                <SelectTrigger className="h-9 bg-white/5 border-white/10 text-xs text-white"><SelectValue /></SelectTrigger>
                                                                <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                                                    <SelectItem value="Classic">Classic Serif</SelectItem>
                                                                    <SelectItem value="Minimal">Minimal Canvas</SelectItem>
                                                                    <SelectItem value="Modern">Modern Grid</SelectItem>
                                                                </SelectContent>
                                                            </Select>
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
                                                invoiceMode === "light" ? "bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300" : "bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20"
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
                                            <p className="text-neutral-500 font-mono text-sm tracking-widest text-[#878787] h-5">{invoiceNumber}</p>
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
                                                <Input
                                                    placeholder="Add Client"
                                                    list="client-suggestions"
                                                    spellCheck={false}
                                                    value={clientName}
                                                    className={cn("bg-transparent border-none p-0 h-auto placeholder:text-neutral-400 text-lg font-bold focus-visible:ring-0 text-right", invoiceMode === "light" ? "text-black" : "text-white")}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setClientName(val)
                                                        const client = allClients.find(c => c.name === val)
                                                        if (client) {
                                                            setClientAddress(client.address || "")
                                                            setClientEmail(client.email || "")
                                                            setClientPhone(client.phone || "")
                                                        }
                                                    }}
                                                />
                                                <datalist id="client-suggestions">
                                                    {allClients.map(c => <option key={c.id} value={c.name} />)}
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

                                    {/* Meta Details */}
                                    <div className={cn("flex flex-wrap gap-12 mb-16 pb-12 border-b", invoiceMode === "light" ? "border-black/5" : "border-white/5")}>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Issue Date</span>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className={cn(
                                                            "w-[150px] justify-start text-left font-bold text-sm p-0 h-auto hover:bg-transparent",
                                                            !issueDate && "text-muted-foreground",
                                                            invoiceMode === "light" ? "text-black" : "text-white"
                                                        )}
                                                    >
                                                        {issueDate ? format(new Date(issueDate), dateFormat.replace("DD", "dd").replace("YYYY", "yyyy")) : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={new Date(issueDate)}
                                                        onSelect={(date) => date && setIssueDate(date.toISOString().split('T')[0])}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Due Date</span>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className={cn(
                                                            "w-[150px] justify-start text-left font-bold text-sm p-0 h-auto hover:bg-transparent",
                                                            !dueDate && "text-muted-foreground",
                                                            invoiceMode === "light" ? "text-black" : "text-white"
                                                        )}
                                                    >
                                                        {dueDate ? format(new Date(dueDate), dateFormat.replace("DD", "dd").replace("YYYY", "yyyy")) : <span className="text-neutral-500">Select Date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={dueDate ? new Date(dueDate) : undefined}
                                                        onSelect={(date) => date && setDueDate(date.toISOString().split('T')[0])}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    {/* Tasks Table (Refined) */}
                                    <div className="mb-12">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className={cn("border-b text-[10px] font-bold uppercase tracking-widest text-[#878787]", invoiceMode === "light" ? "border-black/5" : "border-white/5")}>
                                                    <th className="py-4 text-left font-medium w-1/2">
                                                        <div className="flex items-center gap-2">
                                                            Item
                                                            <button
                                                                onClick={() => setIsProductModalOpen(true)}
                                                                className={cn("flex items-center gap-1 text-[9px] transition-colors px-1.5 py-0.5 rounded cursor-pointer", invoiceMode === "light" ? "bg-black/5 hover:bg-black/10 text-neutral-600 hover:text-black" : "bg-white/5 hover:bg-white/10 text-neutral-500 hover:text-white")}
                                                            >
                                                                <Plus className="h-2.5 w-2.5" /> New
                                                            </button>
                                                        </div>
                                                    </th>
                                                    <th className="py-4 text-right font-medium px-8 w-32">Price</th>
                                                    <th className="py-4 text-right font-medium px-8 w-24">Qty</th>
                                                    <th className="py-4 text-right font-medium pr-4 w-40">Total</th>
                                                    <th className="w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className={cn("divide-y", invoiceMode === "light" ? "divide-black/5" : "divide-white/5")}>
                                                {tasks.map((task) => (
                                                    <tr key={task.id} className="group transition-colors outline-none">
                                                        <td className="py-6">
                                                            <Input
                                                                placeholder="Enter Product"
                                                                spellCheck={false}
                                                                className={cn("bg-transparent border-none p-0 h-auto placeholder:text-neutral-400 focus-visible:ring-0 text-sm font-medium", invoiceMode === "light" ? "text-black" : "text-white")}
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
                                                        <td className="py-6 px-12 min-w-[200px]">
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
                                                                    "justify-end h-10 px-3 rounded-lg text-sm font-medium transition-all focus-within:ring-1 focus-within:ring-emerald-500/50",
                                                                    invoiceMode === "light"
                                                                        ? "bg-neutral-100 border-transparent text-neutral-900 placeholder:text-neutral-400"
                                                                        : "bg-white/5 border-transparent text-white placeholder:text-white/30"
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="py-6 px-12 text-right font-mono text-sm min-w-[150px]">
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
                                                                    "justify-end h-10 px-3 rounded-lg text-sm font-medium transition-all focus-within:ring-1 focus-within:ring-emerald-500/50",
                                                                    invoiceMode === "light"
                                                                        ? "bg-neutral-100 border-transparent text-neutral-900"
                                                                        : "bg-white/5 border-transparent text-white"
                                                                )}
                                                            />
                                                        </td>
                                                        <td className={cn("py-6 text-right font-bold pr-4 text-sm font-mono min-w-[150px]", invoiceMode === "light" ? "text-black" : "text-white")}>
                                                            {(task.price * task.qty).toLocaleString('en-ZA', { style: 'currency', currency: currency })}
                                                        </td>
                                                        <td className="py-6 text-right">
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
                                    <div className="flex justify-between items-start mt-20 pt-12 border-t border-white/5">
                                        <div className="w-1/2 flex flex-col gap-6">
                                            <div className="flex flex-col gap-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Note</span>
                                                <textarea placeholder="Add a note (visible to client)" className="w-full bg-transparent border-none p-0 h-24 text-neutral-400 placeholder:text-neutral-800 text-sm focus:ring-0 resize-none" />
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Payment Info</span>
                                                {isPro ? (
                                                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] -mr-16 -mt-16" />
                                                        <div className="flex items-center gap-4 relative z-10">
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                                <CreditCard className="h-5 w-5 text-emerald-500" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-black text-white uppercase tracking-widest">PayGate Active</span>
                                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/10">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-[10px] text-neutral-500 font-medium mt-1 uppercase tracking-tighter">Clients can pay via card / Instant EFT</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full mt-4 h-9 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/5 border border-emerald-500/10 gap-2"
                                                            onClick={() => {
                                                                import('sonner').then(({ toast }) => {
                                                                    toast.success("Payment Link Generated", {
                                                                        description: "The customer portal link has been attached to this invoice."
                                                                    })
                                                                })
                                                            }}
                                                        >
                                                            <Globe className="h-3 w-3" />
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

                                        <div className="w-1/3 flex flex-col gap-6">
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
            </div>
        </div >
    )
}
