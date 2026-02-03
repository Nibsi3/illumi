"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function DocsCopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false)

    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(value)
                    setCopied(true)
                    toast.success("Copied")
                    window.setTimeout(() => setCopied(false), 1200)
                } catch {
                    toast.error("Copy failed")
                }
            }}
            className={cn(
                "h-9 px-3 rounded-xl border border-border bg-background hover:bg-accent transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2",
                copied && "text-emerald-500"
            )}
        >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
        </button>
    )
}
