"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowRight, ExternalLink, Loader2, Mail, MessageCircle, ShieldCheck } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    to: 'info@illumi.co.za',
                    subject: subject?.trim() || 'New contact request',
                    userName: name.trim(),
                    userEmail: email.trim(),
                    description: message.trim(),
                })
            })

            const data = await res.json().catch(() => null)
            if (!res.ok || !data?.success) {
                throw new Error(data?.error || 'Failed to send message')
            }

            toast.success("Message sent", { description: "We’ll get back to you as soon as possible." })
            setName("")
            setEmail("")
            setSubject("")
            setMessage("")
        } catch (err: any) {
            toast.error("Failed to send", { description: err.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: "url(/bg.webp)" }} />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-3xl px-6">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6 justify-center">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">Support</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-white/60">Response within 1–2 business days</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">Contact Illumi</h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg">
                        Get help fast with guided resources, or send a message to our team for anything account-specific.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild className="bg-white text-black hover:bg-neutral-200 font-semibold px-6 h-11 rounded-full">
                            <a href="#contact-form">
                                Send a message <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="h-11 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold px-6">
                            <a href="/docs" className="inline-flex items-center">
                                Browse docs <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 pb-16" id="contact-form">
                <div className="space-y-6">
                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Send a message
                            </CardTitle>
                            <CardDescription className="text-neutral-500">
                                This will email info@illumi.co.za
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-white">Name *</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white">Email *</Label>
                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            type="email"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white">Subject</Label>
                                    <Input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="What is this about?"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white">Message *</Label>
                                    <Textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your message..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 min-h-[200px] resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                                    <div className="text-xs text-white/40">
                                        We’ll reply to the email address you provide.
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-white text-black hover:bg-neutral-200 font-semibold px-8 h-11 rounded-full"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" />
                                Fast paths
                            </CardTitle>
                            <CardDescription className="text-neutral-500">
                                The quickest way to get an answer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <a
                                href="/docs"
                                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors p-4"
                            >
                                <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                    <ExternalLink className="h-4 w-4 text-white/70" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-white">Documentation</div>
                                    <div className="text-xs text-white/50 mt-1">Setup, invoicing, PayGate, troubleshooting.</div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors mt-1" />
                            </a>
                            <a
                                href="/login"
                                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors p-4"
                            >
                                <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                    <MessageCircle className="h-4 w-4 text-white/70" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-white">In-app support</div>
                                    <div className="text-xs text-white/50 mt-1">Best for account-specific help and billing.</div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors mt-1" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
