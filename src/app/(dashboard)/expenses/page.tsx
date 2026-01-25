"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import { useSettings } from "@/lib/settings-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Download, Filter, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react"

type RecurringType = "once" | "monthly" | "yearly"

type Expense = {
    id: string
    user_id: string
    workspace_id: string | null
    title: string
    amount: number
    category: string | null
    expense_date: string
    recurring: RecurringType
    end_date: string | null
    notes: string | null
    created_at: string
}

type ExpenseOccurrence = Expense & {
    original_id: string
    occurrence_date: string
    is_generated: boolean
}

const CATEGORIES = [
    "Rent",
    "Utilities",
    "Internet & Phone",
    "Software & Subscriptions",
    "Office Supplies",
    "Equipment",
    "Repairs & Maintenance",
    "Fuel & Travel",
    "Meals & Entertainment",
    "Marketing & Advertising",
    "Bank Fees",
    "Professional Services",
    "Insurance",
    "Training",
    "Salaries & Wages",
    "SARS & Tax",
    "Other",
] as const

function startOfMonthISO(d: Date) {
    const x = new Date(d)
    x.setDate(1)
    x.setHours(0, 0, 0, 0)
    return x.toISOString().split("T")[0]
}

function endOfMonthISO(d: Date) {
    const x = new Date(d)
    x.setMonth(x.getMonth() + 1)
    x.setDate(0)
    x.setHours(0, 0, 0, 0)
    return x.toISOString().split("T")[0]
}

function parseISODateLocal(iso: string) {
    return new Date(iso + "T00:00:00")
}

function addMonthsLocal(d: Date, months: number) {
    const next = new Date(d)
    next.setMonth(next.getMonth() + months)
    return next
}

function expandRecurringExpenses(expenses: Expense[], rangeStartISO: string, rangeEndISO: string): ExpenseOccurrence[] {
    const rangeStart = parseISODateLocal(rangeStartISO)
    const rangeEnd = parseISODateLocal(rangeEndISO)

    const out: ExpenseOccurrence[] = []

    for (const e of expenses) {
        const baseStart = parseISODateLocal(e.expense_date)
        const effectiveEnd = e.end_date ? parseISODateLocal(e.end_date) : rangeEnd

        if (e.recurring === 'once') {
            if (baseStart >= rangeStart && baseStart <= rangeEnd) {
                out.push({
                    ...e,
                    original_id: e.id,
                    occurrence_date: e.expense_date,
                    is_generated: false,
                })
            }
            continue
        }

        const stepMonths = e.recurring === 'monthly' ? 1 : 12
        let cursor = new Date(baseStart)

        // If the series starts before the range, fast-forward to near the range
        while (cursor < rangeStart) {
            const next = addMonthsLocal(cursor, stepMonths)
            if (next.getTime() === cursor.getTime()) break
            cursor = next
        }

        while (cursor <= rangeEnd && cursor <= effectiveEnd) {
            const iso = cursor.toISOString().split('T')[0]
            if (iso >= rangeStartISO && iso <= rangeEndISO) {
                out.push({
                    ...e,
                    id: `${e.id}:${iso}`,
                    original_id: e.id,
                    occurrence_date: iso,
                    is_generated: iso !== e.expense_date,
                })
            }
            const next = addMonthsLocal(cursor, stepMonths)
            if (next.getTime() === cursor.getTime()) break
            cursor = next
        }
    }

    // newest first
    out.sort((a, b) => (a.occurrence_date < b.occurrence_date ? 1 : a.occurrence_date > b.occurrence_date ? -1 : 0))
    return out
}

function toCSV(rows: Record<string, any>[]) {
    const headers = Object.keys(rows[0] || {})
    const escape = (v: any) => {
        const s = String(v ?? "")
        if (/[\n\r\",]/.test(s)) return `"${s.replace(/"/g, '""')}"`
        return s
    }

    const lines = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))]
    return lines.join("\n")
}

export default function ExpensesPage() {
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()
    const { currency } = useSettings()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [expenses, setExpenses] = useState<Expense[]>([])

    // Add form state
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState<string>("")
    const [category, setCategory] = useState<string>("Other")
    const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [recurring, setRecurring] = useState<RecurringType>("once")
    const [endDate, setEndDate] = useState<string>("")
    const [notes, setNotes] = useState("")

    // Filters
    const [searchQuery, setSearchQuery] = useState("")
    const [startDate, setStartDate] = useState<string>(startOfMonthISO(new Date()))
    const [endDateFilter, setEndDateFilter] = useState<string>(endOfMonthISO(new Date()))
    const [filterRecurring, setFilterRecurring] = useState<"all" | RecurringType>("all")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    // Edit dialog
    const [editing, setEditing] = useState<Expense | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                if (!activeWorkspace) return
                const { data, error } = await supabase
                    .from("expenses")
                    .select("*")
                    .eq("workspace_id", activeWorkspace.id)
                    .order("expense_date", { ascending: false })

                if (error) throw error
                setExpenses((data || []) as Expense[])
            } catch (e: any) {
                toast.error("Failed to load expenses", { description: e.message })
            } finally {
                setIsLoading(false)
            }
        }
        fetchExpenses()
    }, [activeWorkspace, supabase])

    const filteredExpenses = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()

        const rangeStart = startDate || startOfMonthISO(new Date())
        const rangeEnd = endDateFilter || endOfMonthISO(new Date())
        const expanded = expandRecurringExpenses(expenses, rangeStart, rangeEnd)

        return expanded.filter(e => {
            const recurringOk = filterRecurring === "all" ? true : e.recurring === filterRecurring
            const categoryOk = selectedCategories.length ? selectedCategories.includes(e.category || "Other") : true
            const queryOk = !q
                ? true
                : (e.title || "").toLowerCase().includes(q) || (e.notes || "").toLowerCase().includes(q) || (e.category || "").toLowerCase().includes(q)
            return recurringOk && categoryOk && queryOk
        })
    }, [expenses, searchQuery, startDate, endDateFilter, filterRecurring, selectedCategories])

    const monthExpenses = useMemo(() => {
        const monthStart = startOfMonthISO(new Date())
        const monthEnd = endOfMonthISO(new Date())
        return expandRecurringExpenses(expenses, monthStart, monthEnd)
    }, [expenses])

    const totals = useMemo(() => {
        const totalThisMonth = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
        const totalOnceOffThisMonth = monthExpenses
            .filter(e => e.recurring === "once")
            .reduce((sum, e) => sum + Number(e.amount || 0), 0)

        const byCategory = monthExpenses.reduce((acc: Record<string, number>, e) => {
            const key = e.category || "Other"
            acc[key] = (acc[key] || 0) + Number(e.amount || 0)
            return acc
        }, {})

        return { totalThisMonth, totalOnceOffThisMonth, byCategory }
    }, [monthExpenses])

    const [invoiceIncomeThisMonth, setInvoiceIncomeThisMonth] = useState(0)

    useEffect(() => {
        const fetchInvoiceIncome = async () => {
            try {
                if (!activeWorkspace) return

                const monthStart = startOfMonthISO(new Date())
                const monthEnd = endOfMonthISO(new Date())

                const monthStartTs = `${monthStart}T00:00:00.000Z`
                const monthEndTs = `${monthEnd}T23:59:59.999Z`

                const { data, error } = await supabase
                    .from('invoices')
                    .select('status,total,paid_at,issue_date')
                    .eq('workspace_id', activeWorkspace.id)
                    .eq('status', 'paid')
                    .gte('paid_at', monthStartTs)
                    .lte('paid_at', monthEndTs)

                if (error) throw error

                const sum = (data || []).reduce((acc: number, inv: any) => {
                    const v = Number(inv.total ?? 0)
                    return acc + (Number.isFinite(v) ? v : 0)
                }, 0)

                setInvoiceIncomeThisMonth(sum)
            } catch (e: any) {
                console.error('Failed to load invoice income:', e?.message || e)
                setInvoiceIncomeThisMonth(0)
            }
        }

        fetchInvoiceIncome()
    }, [activeWorkspace, supabase])

    const netProfitThisMonth = useMemo(() => {
        return invoiceIncomeThisMonth - totals.totalThisMonth
    }, [invoiceIncomeThisMonth, totals.totalThisMonth])

    const formatMoney = (v: number) => {
        const cur = currency || "ZAR"
        return new Intl.NumberFormat("en-ZA", { style: "currency", currency: cur }).format(v)
    }

    const handleAddExpense = async () => {
        if (!activeWorkspace) {
            toast.error("No workspace selected")
            return
        }
        if (!title.trim()) {
            toast.error("Title is required")
            return
        }
        const amt = Number(amount)
        if (!Number.isFinite(amt) || amt <= 0) {
            toast.error("Enter a valid amount")
            return
        }

        setIsSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error("You must be logged in")
                return
            }

            const { data, error } = await supabase
                .from("expenses")
                .insert({
                    user_id: user.id,
                    workspace_id: activeWorkspace.id,
                    title: title.trim(),
                    amount: amt,
                    category: category || null,
                    expense_date: expenseDate,
                    recurring,
                    end_date: recurring === "once" ? null : (endDate || null),
                    notes: notes.trim() || null,
                })
                .select()
                .single()

            if (error) throw error

            setExpenses(prev => [data as Expense, ...prev])
            setTitle("")
            setAmount("")
            setCategory("Other")
            setExpenseDate(new Date().toISOString().split("T")[0])
            setRecurring("once")
            setEndDate("")
            setNotes("")

            toast.success("Expense added")
        } catch (e: any) {
            toast.error("Failed to add expense", { description: e.message })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("expenses").delete().eq("id", id)
            if (error) throw error
            setExpenses(prev => prev.filter(e => e.id !== id))
            toast.success("Expense deleted")
        } catch (e: any) {
            toast.error("Failed to delete", { description: e.message })
        }
    }

    const openEdit = (e: Expense) => {
        setEditing(e)
        setIsEditOpen(true)
    }

    const saveEdit = async () => {
        if (!editing) return
        const amt = Number(editing.amount)
        if (!Number.isFinite(amt) || amt <= 0) {
            toast.error("Enter a valid amount")
            return
        }

        try {
            const { error } = await supabase
                .from("expenses")
                .update({
                    title: editing.title,
                    amount: amt,
                    category: editing.category,
                    expense_date: editing.expense_date,
                    recurring: editing.recurring,
                    end_date: editing.recurring === "once" ? null : (editing.end_date || null),
                    notes: editing.notes,
                })
                .eq("id", editing.id)

            if (error) throw error

            setExpenses(prev => prev.map(x => (x.id === editing.id ? editing : x)))
            setIsEditOpen(false)
            setEditing(null)
            toast.success("Expense updated")
        } catch (e: any) {
            toast.error("Failed to update", { description: e.message })
        }
    }

    const exportCSV = () => {
        const rows = filteredExpenses.map(e => ({
            date: (e as any).occurrence_date || (e as any).expense_date,
            title: e.title,
            category: e.category || "Other",
            recurring: e.recurring,
            amount: e.amount,
            notes: e.notes || "",
        }))
        if (!rows.length) {
            toast.error("No expenses to export")
            return
        }
        const csv = toCSV(rows)
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `expenses_${startDate || "all"}_${endDateFilter || "all"}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col gap-y-10 font-sans pb-20">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-serif text-foreground tracking-tight italic">Expenses</h1>
                    <p className="hidden sm:block text-muted-foreground mt-1">Track business expenses, recurring costs, and profitability.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        className="border-border bg-muted hover:bg-accent w-full md:w-auto"
                        onClick={exportCSV}
                    >
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="xl:grid xl:grid-cols-3 gap-6">
                <div className="xl:hidden w-full max-w-full overflow-x-auto no-scrollbar">
                    <div className="flex gap-3 w-max">
                        <div className="bg-card border border-border rounded-2xl p-4 w-[240px]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total expenses (this month)</p>
                            <p className="text-xl font-semibold text-foreground mt-2">{formatMoney(totals.totalThisMonth)}</p>
                        </div>
                        <div className="bg-card border border-border rounded-2xl p-4 w-[240px]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Once-off (this month)</p>
                            <p className="text-xl font-semibold text-foreground mt-2">{formatMoney(totals.totalOnceOffThisMonth)}</p>
                        </div>
                        <div className="bg-card border border-border rounded-2xl p-4 w-[240px]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Net profit (this month)</p>
                            <p className={cn("text-xl font-semibold mt-2", netProfitThisMonth >= 0 ? "text-foreground" : "text-red-400")}>{formatMoney(netProfitThisMonth)}</p>
                            <p className="text-[10px] text-muted-foreground mt-2">Paid income − expenses (this month).</p>
                        </div>
                    </div>
                </div>

                <div className="hidden xl:block bg-card border border-border rounded-2xl p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total expenses (this month)</p>
                    <p className="text-2xl font-semibold text-foreground mt-2">{formatMoney(totals.totalThisMonth)}</p>
                </div>
                <div className="hidden xl:block bg-card border border-border rounded-2xl p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Once-off (this month)</p>
                    <p className="text-2xl font-semibold text-foreground mt-2">{formatMoney(totals.totalOnceOffThisMonth)}</p>
                </div>
                <div className="hidden xl:block bg-card border border-border rounded-2xl p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Net profit (this month)</p>
                    <p className={cn("text-2xl font-semibold mt-2", netProfitThisMonth >= 0 ? "text-foreground" : "text-red-400")}>{formatMoney(netProfitThisMonth)}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">Paid income − expenses (this month).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-10 items-stretch">
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-8">
                        <div>
                            <h2 className="text-lg sm:text-xl font-medium text-foreground">Add Expense</h2>
                            <p className="text-sm text-muted-foreground">Add once-off or recurring expenses.</p>
                        </div>
                        <Button
                            onClick={handleAddExpense}
                            disabled={isSaving}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 font-semibold w-full sm:w-auto"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                            Add
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Office rent"
                                className="bg-background border-border h-11 focus-visible:ring-white/10"
                            />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</Label>
                                <Input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    inputMode="decimal"
                                    className="bg-background border-border h-11 focus-visible:ring-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="bg-background border-border h-11 focus:ring-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        {CATEGORIES.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</Label>
                                <Input
                                    type="date"
                                    value={expenseDate}
                                    onChange={(e) => setExpenseDate(e.target.value)}
                                    className="bg-background border-border h-11 focus-visible:ring-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recurring</Label>
                                <Select value={recurring} onValueChange={(v: any) => setRecurring(v)}>
                                    <SelectTrigger className="bg-background border-border h-11 focus:ring-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="once">Once</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {recurring !== "once" && (
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End date (optional)</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-background border-border h-11 focus-visible:ring-white/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notes (optional)</Label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-background border border-border rounded-md p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/10 h-24 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 h-full">
                    <div className="xl:static xl:bg-card xl:border xl:border-border xl:rounded-2xl xl:p-6 sticky top-16 z-20 bg-background/95 backdrop-blur border-y border-border py-3 xl:py-0">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search expenses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background border-border h-11 focus-visible:ring-white/10"
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="border-border bg-muted hover:bg-accent h-11">
                                        <Filter className="h-4 w-4 mr-2" /> Filters
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-card border-border text-foreground w-80" align="end">
                                    <div className="p-3 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start</Label>
                                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-background border-border h-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End</Label>
                                                <Input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} className="bg-background border-border h-10" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recurring</Label>
                                            <Select value={filterRecurring} onValueChange={(v: any) => setFilterRecurring(v)}>
                                                <SelectTrigger className="bg-background border-border h-10">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border text-foreground">
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="once">Once</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="yearly">Yearly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</Label>
                                            <div className="space-y-1">
                                                {CATEGORIES.map(c => (
                                                    <DropdownMenuCheckboxItem
                                                        key={c}
                                                        checked={selectedCategories.includes(c)}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedCategories(prev => checked ? [...prev, c] : prev.filter(x => x !== c))
                                                        }}
                                                        className="focus:bg-muted"
                                                    >
                                                        {c}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </div>
                                        </div>

                                        <DropdownMenuSeparator className="bg-accent" />

                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-foreground hover:text-foreground hover:bg-muted"
                                            onClick={() => {
                                                setStartDate(startOfMonthISO(new Date()))
                                                setEndDateFilter(endOfMonthISO(new Date()))
                                                setFilterRecurring("all")
                                                setSelectedCategories([])
                                            }}
                                        >
                                            Clear filters
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Card className="overflow-hidden border-none shadow-none bg-transparent flex-1">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto bg-card border border-border rounded-2xl">
                                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                                    <div>
                                        <h3 className="text-foreground font-medium">Expenses</h3>
                                        <p className="text-xs text-muted-foreground">{filteredExpenses.length} items</p>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="p-10 text-muted-foreground flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                                    </div>
                                ) : (
                                    <>
                                        {/* Mobile list */}
                                        <div className="xl:hidden divide-y divide-border">
                                            {filteredExpenses.map((e) => (
                                                <div key={e.id} className="p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-bold text-foreground truncate">{e.title}</div>
                                                            <div className="mt-1 text-xs text-muted-foreground">
                                                                {(e as any).occurrence_date || (e as any).expense_date} · {e.category || "Other"} · {e.recurring}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-bold text-foreground shrink-0">{formatMoney(Number(e.amount || 0))}</div>
                                                    </div>

                                                    <div className="mt-3 flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="h-10 flex-1 border-border bg-muted hover:bg-accent rounded-lg"
                                                            onClick={() => openEdit(expenses.find(x => x.id === (e as any).original_id) || (e as any))}
                                                        >
                                                            <Pencil className="h-4 w-4 mr-2" /> Edit
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="h-10 flex-1 border-border bg-muted hover:bg-accent rounded-lg"
                                                            onClick={() => handleDelete((e as any).original_id || e.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {!filteredExpenses.length && (
                                                <div className="p-6 text-sm text-muted-foreground">No expenses found.</div>
                                            )}
                                        </div>

                                        {/* Desktop table */}
                                        <div className="hidden xl:block">
                                            <table className="w-full text-left text-sm">
                                                <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                                    <tr>
                                                        <th className="px-6 py-4 font-medium">Date</th>
                                                        <th className="px-6 py-4 font-medium">Title</th>
                                                        <th className="px-6 py-4 font-medium">Category</th>
                                                        <th className="px-6 py-4 font-medium">Recurring</th>
                                                        <th className="px-6 py-4 font-medium text-right">Amount</th>
                                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {filteredExpenses.map((e) => (
                                                        <tr key={e.id} className="hover:bg-muted/50 transition-colors">
                                                            <td className="px-6 py-4 text-muted-foreground">{(e as any).occurrence_date || (e as any).expense_date}</td>
                                                            <td className="px-6 py-4 font-medium text-foreground">{e.title}</td>
                                                            <td className="px-6 py-4 text-muted-foreground">{e.category || "Other"}</td>
                                                            <td className="px-6 py-4 text-muted-foreground">{e.recurring}</td>
                                                            <td className="px-6 py-4 text-right font-semibold text-foreground">{formatMoney(Number(e.amount || 0))}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="inline-flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 hover:bg-muted"
                                                                        onClick={() => openEdit(expenses.find(x => x.id === (e as any).original_id) || (e as any))}
                                                                    >
                                                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 hover:bg-muted"
                                                                        onClick={() => handleDelete((e as any).original_id || e.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {!filteredExpenses.length && (
                                                        <tr>
                                                            <td className="px-6 py-10 text-muted-foreground" colSpan={6}>No expenses found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-card border-border max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Edit Expense</DialogTitle>
                    </DialogHeader>

                    {editing && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
                                <Input
                                    value={editing.title}
                                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                                    className="bg-background border-border h-11"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</Label>
                                    <Input
                                        value={String(editing.amount)}
                                        onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })}
                                        inputMode="decimal"
                                        className="bg-background border-border h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                                    <Select
                                        value={editing.category || "Other"}
                                        onValueChange={(v) => setEditing({ ...editing, category: v })}
                                    >
                                        <SelectTrigger className="bg-background border-border h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border text-foreground">
                                            {CATEGORIES.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</Label>
                                    <Input
                                        type="date"
                                        value={editing.expense_date}
                                        onChange={(e) => setEditing({ ...editing, expense_date: e.target.value })}
                                        className="bg-background border-border h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recurring</Label>
                                    <Select
                                        value={editing.recurring}
                                        onValueChange={(v: any) => setEditing({ ...editing, recurring: v })}
                                    >
                                        <SelectTrigger className="bg-background border-border h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border text-foreground">
                                            <SelectItem value="once">Once</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {editing.recurring !== "once" && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End date (optional)</Label>
                                    <Input
                                        type="date"
                                        value={editing.end_date || ""}
                                        onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                                        className="bg-background border-border h-11"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notes</Label>
                                <textarea
                                    value={editing.notes || ""}
                                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                                    className="w-full bg-background border border-border rounded-md p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/10 h-24 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-border bg-muted hover:bg-accent"
                            onClick={() => setIsEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={saveEdit}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

