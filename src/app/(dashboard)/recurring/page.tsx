"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, Calendar, ArrowRight, MoreHorizontal, User, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSubscription } from "@/lib/subscription/hooks"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const mockRecurring = [
    { id: 1, client: "Acme Corp", amount: 1500, frequency: "monthly", nextDate: "2024-02-01", status: "active" },
    { id: 2, client: "Globex Corporation", amount: 2500, frequency: "weekly", nextDate: "2024-01-21", status: "active" },
    { id: 3, client: "Initech", amount: 800, frequency: "monthly", nextDate: "2024-02-15", status: "paused" },
]

export default function RecurringInvoicesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { isPro, isLoading } = useSubscription()

    if (isLoading) return null

    if (!isPro) {
        return (
            <div className="flex flex-col gap-y-8 animate-in fade-in duration-500 pb-20">
                <div className="flex flex-col items-start justify-center min-h-[60vh]">
                    <h1 className="text-4xl font-serif text-foreground tracking-tight italic">Recurring</h1>
                    <p className="text-muted-foreground mt-2 max-w-xl">Recurring invoices are a Pro feature. Upgrade to automate your monthly billing.</p>
                    <div className="mt-6">
                        <Link href="/settings/billing">
                            <HoverBorderGradient as="div" containerClassName="w-full" className="bg-primary text-primary-foreground font-bold h-11 px-6 flex items-center justify-center">
                                Upgrade to Pro
                            </HoverBorderGradient>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-foreground tracking-tight italic">Recurring</h1>
                    <p className="text-muted-foreground mt-2">Automate your billing with scheduled invoice generation.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="px-6 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            New Schedule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5" />
                                Create Recurring Schedule
                            </DialogTitle>
                            <DialogDescription>
                                Set up an automated invoice that generates on a schedule.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="client">Client</Label>
                                <Select>
                                    <SelectTrigger className="bg-muted/30">
                                        <SelectValue placeholder="Select a client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Acme Corp</SelectItem>
                                        <SelectItem value="2">Globex Corporation</SelectItem>
                                        <SelectItem value="3">Initech</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="frequency">Frequency</Label>
                                <Select defaultValue="monthly">
                                    <SelectTrigger className="bg-muted/30">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="start-date">First Invoice Date</Label>
                                <Input id="start-date" type="date" className="bg-muted/30" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Base Amount ($)</Label>
                                <Input id="amount" type="number" placeholder="0.00" className="bg-muted/30" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full" onClick={() => setIsDialogOpen(false)}>Start Automation</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Recurring Table (Redesigned with 1px Grid) */}
            <div className="border border-border bg-background overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[13px]">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-5 py-3 w-10 border-r border-border">
                                    <div className="w-4 h-4 rounded-sm border border-border flex items-center justify-center cursor-pointer hover:border-border transition-colors" />
                                </th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Client</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Frequency</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Status</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border text-right">Amount</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Next Date</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground text-center w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockRecurring.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/50 transition-colors border-b border-border group last:border-0">
                                    <td className="px-5 py-4 border-r border-border">
                                        <div className="w-4 h-4 rounded-sm border border-border transition-all flex items-center justify-center cursor-pointer group-hover:border-border" />
                                    </td>
                                    <td className="px-5 py-4 border-r border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-black text-muted-foreground">
                                                {item.client.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-foreground tracking-tight">{item.client}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 border-r border-border">
                                        <Badge variant="outline" className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md border-border bg-muted text-muted-foreground">
                                            {item.frequency}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4 border-r border-border">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                            item.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-r border-border text-right text-foreground font-bold text-sm">
                                        ZAR {item.amount.toLocaleString()}.00
                                    </td>
                                    <td className="px-5 py-4 border-r border-border text-muted-foreground">
                                        {item.nextDate}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-background border-border rounded-xl shadow-2xl p-1">
                                                <DropdownMenuItem className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs">Edit Schedule</DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs">Pause Automation</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-accent mx-1" />
                                                <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer px-3 py-2 text-xs">Stop Schedule</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {mockRecurring.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-muted-foreground/10">
                    <Clock className="h-12 w-12 text-muted-foreground/20 mb-4" />
                    <h2 className="text-xl font-serif">No recurring invoices yet</h2>
                    <p className="text-muted-foreground mt-2">Create a schedule to automate your monthly billing.</p>
                    <p className="text-sm text-muted-foreground mt-3">
                        <Link href="/features/automated-invoicing" className="text-primary hover:underline" target="_blank">Learn how automated invoicing works →</Link>
                    </p>
                    <Button variant="outline" className="mt-6 rounded-full" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first schedule
                    </Button>
                </div>
            )}
        </div>
    )
}

