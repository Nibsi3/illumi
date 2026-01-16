"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconChevronRight, IconMessageCircle, IconBook } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        setIsContactOpen(false)
        toast.success("Message Sent", { description: "We'll get back to you shortly." })
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Support & Help</h1>
                <p className="text-neutral-400">Get help with your account or browse our documentation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Option */}
                <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors flex flex-col items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <IconMessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Contact Support</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Need help with your account or have a payment issue? Not to worry, we are here to help.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsContactOpen(true)}
                        className="w-full mt-auto bg-white text-black hover:bg-neutral-200 font-bold h-12 rounded-xl gap-2"
                    >
                        Contact Support
                        <IconChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Documentation Option */}
                <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors flex flex-col items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                        <IconBook className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Documentation</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Browse our detailed guides and API reference to get the most out of the platform.
                        </p>
                    </div>
                    <Link href="/docs" className="w-full mt-auto">
                        <Button
                            variant="outline"
                            className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white font-bold h-12 rounded-xl gap-2"
                        >
                            View Documentation
                            <IconChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Contact Support</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            Fill out the form below and we'll help you resolve your issue.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendMessage} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input placeholder="What do you need help with?" className="bg-white/5 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea placeholder="Describe your issue in detail..." className="bg-white/5 border-white/10 min-h-[150px]" required />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => setIsContactOpen(false)} className="hover:bg-white/5">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-neutral-200">
                                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Send Message
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
