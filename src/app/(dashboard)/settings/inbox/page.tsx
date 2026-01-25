"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Copy,
    Trash2,
    RefreshCcw,
    Mail,
    ChevronDown,
    Plus
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function InboxSettings() {
    return (
        <div className="space-y-12 pb-32">
            <div>
                <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-1 text-white">Inbox</h1>
                <p className="hidden sm:block text-muted-foreground">Manage email connections and inbox automation.</p>
            </div>

            {/* Email Connections Section */}
            <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-white">Email Connections</h3>
                    <p className="text-sm text-neutral-500 max-w-xl">
                        Manage your connected email accounts or connect a new one.
                    </p>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Gmail" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">cameronfalck03@gmail.com</span>
                            <span className="text-[11px] text-neutral-500">Last accessed about 5 hours ago</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10">
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Button variant="outline" className="w-full h-11 border-white/5 bg-transparent hover:bg-white/5 transition-colors border-dashed border-2">
                    Connect email
                </Button>
            </div>
        </div>
    )
}
