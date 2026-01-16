"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NumberInputProps {
    value: number
    onChange: (value: number) => void
    disabled?: boolean
    className?: string
    placeholder?: string
}

export function NumberInput({
    value,
    onChange,
    disabled,
    className,
    placeholder,
}: NumberInputProps) {
    const [isHovered, setIsHovered] = React.useState(false)
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

    const increment = React.useCallback(() => {
        onChange(value + 1)
    }, [onChange, value])

    const decrement = React.useCallback(() => {
        onChange(Math.max(0, value - 1))
    }, [onChange, value])

    const startContinuous = (action: () => void) => {
        action()
        timerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(action, 50)
        }, 500)
    }

    const stopContinuous = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return (
        <div
            className={cn(
                "relative flex items-center group bg-white/[0.03] hover:bg-white/[0.05] transition-colors rounded-lg px-2 border border-transparent focus-within:border-white/10",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                stopContinuous()
            }}
        >
            <input
                type="text"
                inputMode="decimal"
                value={value === 0 ? "" : value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => {
                    const val = parseFloat(e.target.value)
                    if (!isNaN(val)) onChange(val)
                    else if (e.target.value === "") onChange(0)
                }}
                className={cn(
                    "w-full bg-transparent border-none p-0 h-full text-white focus:ring-0 text-sm font-bold font-mono placeholder:text-neutral-700",
                    !className?.includes("text-left") && "text-right"
                )}
            />

            {!disabled && (
                <div className={cn(
                    "flex flex-col gap-0 transition-all duration-200 ml-2",
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-5 p-0 hover:bg-white/10 text-neutral-600 hover:text-white rounded-none border-b border-white/5"
                        onMouseDown={() => startContinuous(increment)}
                        onMouseUp={stopContinuous}
                        onMouseLeave={stopContinuous}
                    >
                        <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-5 p-0 hover:bg-white/10 text-neutral-600 hover:text-white rounded-none"
                        onMouseDown={() => startContinuous(decrement)}
                        onMouseUp={stopContinuous}
                        onMouseLeave={stopContinuous}
                    >
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    )
}
