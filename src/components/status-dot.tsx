import { cn } from "@/lib/utils"

interface StatusDotProps {
    className?: string
    variant?: "success" | "warning" | "error" | "neutral" | "brand"
    children: React.ReactNode
}

export function StatusDot({ className, variant = "neutral", children }: StatusDotProps) {
    const colorClass = {
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        error: "bg-red-500",
        neutral: "bg-neutral-500",
        brand: "bg-white"
    }[variant]

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", colorClass)} />
            <span className="text-[13px] font-medium text-neutral-300">{children}</span>
        </div>
    )
}
