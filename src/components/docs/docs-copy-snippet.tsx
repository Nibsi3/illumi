"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function DocsCopySnippet({
    label,
    value,
    description,
}: {
    label: string
    value: string
    description?: string
}) {
    const [copied, setCopied] = useState(false)

    return (
        <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
                    {description && (
                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</div>
                    )}
                </div>

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
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground overflow-x-auto">
                {value}
            </div>
        </div>
    )
}
