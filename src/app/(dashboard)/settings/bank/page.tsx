"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCcw, Trash2 } from "lucide-react"
import { IconBrandGoogle } from "@tabler/icons-react"

export default function BankConnectionsPage() {
    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-1">Bank Connections</h1>
                <p className="hidden sm:block text-muted-foreground">Connect your bank accounts to automatically import transactions.</p>
            </div>

            {/* Connected Banks */}
            <div className="space-y-4 mb-8">
                <div className="p-4 border border-border rounded-xl bg-card flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                            <IconBrandGoogle className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">FNB Bank Account</p>
                            <p className="text-xs text-muted-foreground">Last synced 2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add Bank Button */}
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-semibold rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Connect Bank Account
            </Button>
        </div>
    )
}


