import { cn } from "@/lib/utils"
import { AlertTriangle, Info, Lightbulb } from "lucide-react"

type CalloutVariant = "tip" | "note" | "warning"

export function DocsCallout({
    variant,
    title,
    body,
}: {
    variant: CalloutVariant
    title?: string
    body: string[]
}) {
    const meta =
        variant === "tip"
            ? {
                  label: "Tip",
                  Icon: Lightbulb,
                  className: "border-emerald-500/20 bg-emerald-500/5",
                  iconClassName: "text-emerald-500",
              }
            : variant === "warning"
              ? {
                    label: "Warning",
                    Icon: AlertTriangle,
                    className: "border-amber-500/20 bg-amber-500/5",
                    iconClassName: "text-amber-500",
                }
              : {
                    label: "Note",
                    Icon: Info,
                    className: "border-sky-500/20 bg-sky-500/5",
                    iconClassName: "text-sky-500",
                }

    return (
        <div className={cn("rounded-3xl border p-6", meta.className)}>
            <div className="flex items-start gap-3">
                <meta.Icon className={cn("h-5 w-5 mt-0.5", meta.iconClassName)} />
                <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {title || meta.label}
                    </div>
                    <div className="mt-3 space-y-2">
                        {body.map((p, idx) => (
                            <p key={idx} className="text-[15px] leading-relaxed text-muted-foreground">
                                {p}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
