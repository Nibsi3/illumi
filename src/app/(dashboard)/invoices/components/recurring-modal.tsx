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
            <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 mb-4">
                        <Repeat className="h-6 w-6 text-violet-500" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Recurring Settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Configure how often this invoice should be generated.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="interval" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Frequency</Label>
                        <Select value={interval} onValueChange={(v: any) => setInterval(v)}>
                            <SelectTrigger className="bg-muted border-border h-11">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ends</Label>
                        <Select value={endType} onValueChange={(v: any) => setEndType(v)}>
                            <SelectTrigger className="bg-muted border-border h-11">
                                <SelectValue placeholder="Select end type" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                <SelectItem value="never">Never</SelectItem>
                                <SelectItem value="on">On Date</SelectItem>
                                <SelectItem value="after">After X Times</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {endType === "on" && (
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "h-11 justify-start text-left font-normal bg-muted border-border hover:bg-accent hover:text-foreground",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
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
                            <Label htmlFor="count" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Number of Invoices</Label>
                            <Input
                                id="count"
                                type="number"
                                value={endCount}
                                onChange={(e) => setEndCount(parseInt(e.target.value))}
                                className="bg-muted border-border h-11"
                            />
                        </div>
                    )}

                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-muted">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Send Recurring Emails
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

