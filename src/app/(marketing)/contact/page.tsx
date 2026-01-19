"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Mail } from "lucide-react"

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
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-3xl px-6 py-16">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact</h1>
                    <p className="mt-3 text-white/50">
                        Send a message to our team. For account-specific help, use Support inside your dashboard.
                    </p>
                </div>

                <Card className="bg-[#0a0a0a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Contact Form
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
                                    className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 min-h-[160px] resize-none"
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-white text-black hover:bg-neutral-200 font-semibold px-8"
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
            </div>
        </div>
    )
}
