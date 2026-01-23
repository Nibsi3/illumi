"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecurringModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (settings: {
        interval: string
        endType: "on" | "after" | "never"
        endDate?: Date
        endCount?: number
    }) => void
    initialSettings?: {
        interval: string
        endType: "on" | "after" | "never"
        endDate?: Date
        endCount?: number
    }
}

export function RecurringModal({ isOpen, onClose, onSave, initialSettings }: RecurringModalProps) {
    const [interval, setInterval] = React.useState(initialSettings?.interval || "monthly")
    const [endType, setEndType] = React.useState<"on" | "after" | "never">(initialSettings?.endType || "never")
    const [endDate, setEndDate] = React.useState<Date | undefined>(initialSettings?.endDate)
    const [endCount, setEndCount] = React.useState(initialSettings?.endCount || 12)

    const handleSave = () => {
        onSave({
            interval,
            endType,
            endDate,
            endCount,
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#09090b] border-white/10 text-white">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 mb-4">
                        <Repeat className="h-6 w-6 text-violet-500" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Recurring Settings</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Configure how often this invoice should be generated.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="interval" className="text-xs font-bold uppercase tracking-widest text-neutral-500">Frequency</Label>
                        <Select value={interval} onValueChange={(v: any) => setInterval(v)}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Ends</Label>
                        <Select value={endType} onValueChange={(v: any) => setEndType(v)}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                <SelectValue placeholder="Select end type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                <SelectItem value="never">Never</SelectItem>
                                <SelectItem value="on">On Date</SelectItem>
                                <SelectItem value="after">After X Times</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {endType === "on" && (
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "h-11 justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 hover:text-white",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-[#09090b] border-white/10" align="start">
                                    <Calendar
                                        selected={endDate}
                                        onSelect={setEndDate}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    {endType === "after" && (
                        <div className="grid gap-2">
                            <Label htmlFor="count" className="text-xs font-bold uppercase tracking-widest text-neutral-500">Number of Invoices</Label>
                            <Input
                                id="count"
                                type="number"
                                value={endCount}
                                onChange={(e) => setEndCount(parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 h-11"
                            />
                        </div>
                    )}

                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white hover:bg-white/5">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-white text-black hover:bg-neutral-200">
                        Send Recurring Emails
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
