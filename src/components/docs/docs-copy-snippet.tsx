import { DocsCopyButton } from "@/components/docs/docs-copy-button"

export function DocsCopySnippet({
    label,
    value,
    description,
}: {
    label: string
    value: string
    description?: string
}) {
    return (
        <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
                    {description && (
                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</div>
                    )}
                </div>

                <DocsCopyButton value={value} />
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground overflow-x-auto">
                {value}
            </div>
        </div>
    )
}
