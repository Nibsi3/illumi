"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, Calendar, ArrowRight, MoreHorizontal, User, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

    return (
        <div className="flex flex-col gap-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white tracking-tight italic">Recurring</h1>
                    <p className="text-muted-foreground mt-2">Automate your billing with scheduled invoice generation.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
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
                            <Button type="submit" className="w-full rounded-full" onClick={() => setIsDialogOpen(false)}>Start Automation</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Recurring Table (Redesigned with 1px Grid) */}
            <div className="border border-white/10 bg-black overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[13px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/10">
                                <th className="px-5 py-3 w-10 border-r border-white/10">
                                    <div className="w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors" />
                                </th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Client</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Frequency</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Status</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10 text-right">Amount</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Next Date</th>
                                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] text-center w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockRecurring.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/10 group last:border-0">
                                    <td className="px-5 py-4 border-r border-white/10">
                                        <div className="w-4 h-4 rounded-sm border border-white/20 transition-all flex items-center justify-center cursor-pointer group-hover:border-white/40" />
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-[#878787]">
                                                {item.client.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-[#fafafa] tracking-tight">{item.client}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10">
                                        <Badge variant="outline" className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md border-white/10 bg-white/5 text-[#878787]">
                                            {item.frequency}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                            item.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10 text-right text-white font-bold text-sm">
                                        ZAR {item.amount.toLocaleString()}.00
                                    </td>
                                    <td className="px-5 py-4 border-r border-white/10 text-[#878787]">
                                        {item.nextDate}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-black border-white/10 rounded-xl shadow-2xl p-1">
                                                <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Edit Schedule</DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Pause Automation</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-white/10 mx-1" />
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
                    <Button variant="outline" className="mt-6 rounded-full" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first schedule
                    </Button>
                </div>
            )}
        </div>
    )
}
