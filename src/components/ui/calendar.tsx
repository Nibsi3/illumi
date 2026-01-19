"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    parseISO
} from "date-fns"
import { cn } from "@/lib/utils"

export interface CalendarProps {
    selected?: Date
    onSelect?: (date: Date | undefined) => void
    className?: string
    mode?: "single" // Simple support for single mode
}

export function Calendar({
    selected,
    onSelect,
    className,
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    const daysLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    return (
        <div className={cn("ring-1 ring-white/10 bg-white/5 rounded-xl p-4 w-[280px]", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                    {format(currentMonth, "MMMM yyyy")}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-white/5 rounded-md text-neutral-500 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-white/5 rounded-md text-neutral-500 hover:text-white transition-colors"
                    >
                        <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Week Day Labels */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                {daysLabels.map((day) => (
                    <div key={day} className="">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-sm">
                {calendarDays.map((day, idx) => {
                    const isSelected = selected && isSameDay(day, selected)
                    const isCurrentMonth = isSameMonth(day, monthStart)
                    const isToday = isSameDay(day, new Date())

                    return (
                        <div
                            key={idx}
                            className="h-9 flex items-center justify-center relative cursor-pointer"
                            onClick={() => onSelect?.(day)}
                        >
                            {isSelected ? (
                                <div className="h-7 w-7 rounded-lg bg-violet-500 text-white flex items-center justify-center shadow-inner shadow-violet-900/40 text-xs font-bold">
                                    {format(day, "d")}
                                </div>
                            ) : (
                                <button
                                    className={cn(
                                        "h-8 w-8 rounded-lg flex items-center justify-center transition-all text-sm",
                                        isCurrentMonth
                                            ? "text-neutral-300 hover:bg-white/10"
                                            : "text-slate-600 hover:bg-white/5",
                                        isToday && "border border-white/10"
                                    )}
                                >
                                    {format(day, "d")}
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

Calendar.displayName = "Calendar"
