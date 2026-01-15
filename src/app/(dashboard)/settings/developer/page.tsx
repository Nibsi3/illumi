"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function DeveloperPage() {
    const [apiKey, setApiKey] = useState("sk_live_1234567890abcdef")
    const [copied, setCopied] = useState(false)

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-medium mb-1">Developer</h1>
                <p className="text-muted-foreground">Manage API keys and developer settings.</p>
            </div>

            {/* API Key */}
            <div className="mb-8 space-y-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-white">API Key</h3>
                    <p className="text-sm text-neutral-500 max-w-xl">
                        Use this API key to authenticate requests to the Emini API.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        value={apiKey}
                        readOnly
                        className="bg-black border-white/5 h-11 font-mono text-sm"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={copyApiKey}
                        className="border-white/10 bg-white/5 hover:bg-white/10 h-11 w-11"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>

                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 h-11 px-6">
                    Regenerate API Key
                </Button>
            </div>

            {/* Webhooks */}
            <div className="mb-8 space-y-6 pt-10 border-t border-white/5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-white">Webhooks</h3>
                    <p className="text-sm text-neutral-500 max-w-xl">
                        Configure webhooks to receive real-time notifications about events in your account.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Input
                            placeholder="https://your-domain.com/webhook"
                            className="bg-black border-white/5 h-11"
                        />
                        <Button className="bg-white text-black hover:bg-neutral-200 h-11 px-6">
                            Add Webhook
                        </Button>
                    </div>
                </div>
            </div>

            {/* Documentation */}
            <div className="p-6 border border-white/5 rounded-xl bg-[#09090b]">
                <h3 className="text-lg font-medium text-white mb-2">API Documentation</h3>
                <p className="text-sm text-neutral-500 mb-4">
                    View our comprehensive API documentation to learn how to integrate Emini into your application.
                </p>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 h-11 px-6">
                    View Documentation
                </Button>
            </div>
        </div>
    )
}

