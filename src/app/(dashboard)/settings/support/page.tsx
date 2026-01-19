"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, MessageSquare, BookOpen, ExternalLink, Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const categories = [
    { value: "bug", label: "Bug Report", icon: AlertCircle },
    { value: "feature", label: "Feature Request", icon: CheckCircle2 },
    { value: "account", label: "Account Issue", icon: Mail },
    { value: "billing", label: "Billing", icon: Mail },
    { value: "other", label: "Other", icon: MessageSquare },
]

const priorities = [
    { value: "low", label: "Low", description: "General question or minor issue" },
    { value: "medium", label: "Medium", description: "Important but not urgent" },
    { value: "high", label: "High", description: "Affecting my workflow" },
    { value: "urgent", label: "Urgent", description: "Critical issue blocking work" },
]

export default function SupportSettingsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [subject, setSubject] = useState("")
    const [category, setCategory] = useState("")
    const [priority, setPriority] = useState("medium")
    const [description, setDescription] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [userName, setUserName] = useState<string>("")
    const [userEmail, setUserEmail] = useState<string>("")
    const supabase = createClient()

    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUserName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '')
            setUserEmail(user?.email || '')
        }
        loadUser()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!subject || !category || !description) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            // Get current user for context
            const { data: { user } } = await supabase.auth.getUser()

            // Save to support_tickets table
            const { error: dbError } = await supabase
                .from('support_tickets')
                .insert([{
                    user_id: user?.id,
                    subject,
                    category,
                    priority,
                    description,
                    status: 'open'
                }])

            if (dbError) throw dbError

            // Send email via Resend API
            const emailResponse = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'support',
                    to: 'support@illumi.co.za',
                    subject,
                    category: categories.find(c => c.value === category)?.label,
                    priority: priorities.find(p => p.value === priority)?.label,
                    description,
                    userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || userName || 'User',
                    userEmail: user?.email || userEmail
                })
            })

            if (!emailResponse.ok) {
                const data = await emailResponse.json().catch(() => null)
                console.warn("Email sending failed, but ticket was saved", data)
                toast.warning("Support ticket saved, but email failed", {
                    description: data?.error || "Support email could not be sent. Please ensure Resend domain is verified."
                })
            }

            setIsSubmitted(true)
            toast.success("Support request submitted", {
                description: "We'll get back to you as soon as possible."
            })

            // Reset form
            setSubject("")
            setCategory("")
            setPriority("medium")
            setDescription("")
        } catch (error: any) {
            toast.error("Failed to submit request", {
                description: error.message
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Support</h2>
                <p className="text-sm text-neutral-500">
                    Get help from our team or browse our documentation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Support Form */}
                <Card className="lg:col-span-2 bg-[#0a0a0a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Contact Support
                        </CardTitle>
                        <CardDescription className="text-neutral-500">
                            Describe your issue and we'll help you resolve it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Request Submitted</h3>
                                <p className="text-neutral-500 mb-6">
                                    We've received your support request and will respond within 24 hours.
                                </p>
                                <Button
                                    onClick={() => setIsSubmitted(false)}
                                    variant="outline"
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    Submit Another Request
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white">Subject *</Label>
                                    <Input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Brief description of your issue"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-white">Category *</Label>
                                        <Select value={category} onValueChange={setCategory} required>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0a0a0a] border-white/10">
                                                {categories.map((cat) => (
                                                    <SelectItem
                                                        key={cat.value}
                                                        value={cat.value}
                                                        className="text-white focus:bg-white/5 focus:text-white"
                                                    >
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-white">Priority</Label>
                                        <Select value={priority} onValueChange={setPriority}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0a0a0a] border-white/10">
                                                {priorities.map((p) => (
                                                    <SelectItem
                                                        key={p.value}
                                                        value={p.value}
                                                        className="text-white focus:bg-white/5 focus:text-white"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span>{p.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white">Description *</Label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Please provide as much detail as possible about your issue. Include steps to reproduce if reporting a bug."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 min-h-[150px] resize-none"
                                        required
                                    />
                                    <p className="text-[10px] text-neutral-600">
                                        The more details you provide, the faster we can help you.
                                    </p>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-white text-black hover:bg-neutral-200 font-semibold px-8"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Request"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-4">
                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Documentation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-neutral-500 mb-4">
                                Find answers to common questions and learn how to use Illumi effectively.
                            </p>
                            <Link href="https://illumi.co.za/docs" target="_blank">
                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 hover:bg-white/5 text-white text-xs"
                                >
                                    <ExternalLink className="h-3 w-3 mr-2" />
                                    View Documentation
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Direct Email
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-neutral-500 mb-4">
                                Prefer email? Reach us directly at:
                            </p>
                            <a
                                href="mailto:support@illumi.co.za"
                                className="text-sm text-white font-medium hover:underline"
                            >
                                support@illumi.co.za
                            </a>
                        </CardContent>
                    </Card>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-[10px] text-neutral-500 leading-relaxed">
                            <strong className="text-neutral-400">Response Times:</strong><br />
                            Low/Medium: 48 hours<br />
                            High: 24 hours<br />
                            Urgent: 4 hours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
