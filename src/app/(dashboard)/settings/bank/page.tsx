"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCcw, Trash2 } from "lucide-react"
import { IconBrandGoogle } from "@tabler/icons-react"

export default function BankConnectionsPage() {
    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-medium mb-1">Bank Connections</h1>
                <p className="text-muted-foreground">Connect your bank accounts to automatically import transactions.</p>
            </div>

            {/* Connected Banks */}
            <div className="space-y-4 mb-8">
                <div className="p-4 border border-white/5 rounded-xl bg-[#09090b] flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                            <IconBrandGoogle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">FNB Bank Account</p>
                            <p className="text-xs text-neutral-500">Last synced 2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-white hover:bg-white/5">
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add Bank Button */}
            <Button className="bg-white text-black hover:bg-neutral-200 h-11 px-6 font-semibold rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Connect Bank Account
            </Button>
        </div>
    )
}

