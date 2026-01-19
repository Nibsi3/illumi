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
    variant?: "dark" | "light"
}

export function NumberInput({
    value,
    onChange,
    disabled,
    className,
    placeholder,
    variant = "dark",
}: NumberInputProps) {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
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

    const isLight = variant === "light"

    return (
        <div
            className={cn(
                "relative flex items-center group transition-all rounded-md h-10",
                isLight
                    ? "bg-neutral-100 border border-neutral-200 focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-300"
                    : "bg-transparent border border-white/10 focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10",
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
                placeholder={placeholder || "0"}
                disabled={disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                    const val = parseFloat(e.target.value)
                    if (!isNaN(val)) onChange(val)
                    else if (e.target.value === "") onChange(0)
                }}
                className={cn(
                    "w-full bg-transparent border-none px-3 h-full focus:ring-0 focus:outline-none text-sm font-semibold font-mono",
                    isLight
                        ? "text-neutral-900 placeholder:text-neutral-400"
                        : "text-white placeholder:text-neutral-600",
                    !className?.includes("text-left") && "text-right"
                )}
            />

            {!disabled && (isHovered || isFocused) && (
                <div className="flex flex-col border-l border-inherit">
                    <Button
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                        className={cn(
                            "h-5 w-6 p-0 rounded-none rounded-tr-md",
                            isLight
                                ? "hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900"
                                : "hover:bg-white/10 text-neutral-500 hover:text-white"
                        )}
                        onMouseDown={() => startContinuous(increment)}
                        onMouseUp={stopContinuous}
                        onMouseLeave={stopContinuous}
                    >
                        <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                        className={cn(
                            "h-5 w-6 p-0 rounded-none rounded-br-md border-t border-inherit",
                            isLight
                                ? "hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900"
                                : "hover:bg-white/10 text-neutral-500 hover:text-white"
                        )}
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
