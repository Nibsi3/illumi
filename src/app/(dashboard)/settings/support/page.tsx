"use client"

import { useEffect, useState } from "react"
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
import { Loader2, MessageSquare, BookOpen, ExternalLink, Mail, AlertCircle, CheckCircle2, Bug, Sparkles, User, CreditCard, HelpCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const categories = [
    { value: "bug", label: "Bug Report", icon: Bug },
    { value: "feature", label: "Feature Request", icon: Sparkles },
    { value: "account", label: "Account Issue", icon: User },
    { value: "billing", label: "Billing", icon: CreditCard },
    { value: "other", label: "Other", icon: HelpCircle },
]

const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
]

export default function SupportSettingsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [subject, setSubject] = useState("")
    const [category, setCategory] = useState("account")
    const [priority, setPriority] = useState("low")
    const [priorityTouched, setPriorityTouched] = useState(false)
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
            const { data: { user } } = await supabase.auth.getUser()

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
            }

            setIsSubmitted(true)
            toast.success("Support request submitted", {
                description: "We'll get back to you as soon as possible."
            })

            setSubject("")
            setCategory("account")
            setPriority("low")
            setPriorityTouched(false)
            setDescription("")
        } catch (error: any) {
            toast.error("Failed to submit request", {
                description: error.message
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedCategory = categories.find(c => c.value === category)
    const selectedPriority = priorities.find(p => p.value === priority)

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-1">Support</h1>
                <p className="hidden sm:block text-muted-foreground">Get help from our team or browse our documentation.</p>
            </div>

            {isSubmitted ? (
                <div className="max-w-xl mx-auto text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Request Submitted</h2>
                    <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                        We've received your support request and will respond within 24 hours. Check your email for updates.
                    </p>
                    <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-white text-black hover:bg-neutral-200 font-semibold px-8"
                    >
                        Submit Another Request
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Main Form */}
                    <div className="lg:col-span-8 flex">
                        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-4 sm:p-6 lg:p-8 w-full flex flex-col">
                            <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                            {/* Category Selection */}
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">What can we help you with?</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon
                                        const isSelected = category === cat.value
                                        return (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setCategory(cat.value)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                                    isSelected
                                                        ? "bg-white/10 border-white/20"
                                                        : "bg-[#09090b] border-white/5 hover:border-white/10 hover:bg-white/5"
                                                )}
                                            >
                                                <Icon className={cn("h-5 w-5", isSelected ? "text-white" : "text-neutral-500")} />
                                                <span className={cn("text-xs font-medium", isSelected ? "text-white" : "text-neutral-400")}>{cat.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Subject</Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief description of your issue"
                                    className="bg-[#09090b] border-white/5 h-12 text-white placeholder:text-neutral-600 focus-visible:ring-white/10"
                                    required
                                />
                            </div>

                            {/* Priority */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Priority</Label>
                                <div className="flex flex-wrap gap-2">
                                    {priorities.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => {
                                                setPriorityTouched(true)
                                                setPriority(p.value)
                                            }}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                                                priority === p.value
                                                    ? "bg-white/10 border-white/20"
                                                    : "bg-[#09090b] border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            {priorityTouched && priority === p.value && (
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            )}
                                            <span className={cn("text-sm font-medium", priority === p.value ? "text-white" : "text-neutral-400")}>{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please provide as much detail as possible about your issue..."
                                    className="bg-[#09090b] border-white/5 text-white placeholder:text-neutral-600 min-h-[180px] resize-none focus-visible:ring-white/10"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
                                <p className="text-xs text-neutral-600">
                                    Submitting as <span className="text-neutral-400">{userEmail || 'you'}</span>
                                </p>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !category || !subject || !description}
                                    className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 font-semibold px-8 h-11"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Submit Request
                                        </>
                                    )}
                                </Button>
                            </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 flex">
                        <div className="w-full flex flex-col gap-6">
                        {/* Quick Links */}
                        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex-1">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <Link
                                    href="https://illumi.co.za/docs"
                                    target="_blank"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <BookOpen className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Documentation</p>
                                        <p className="text-xs text-neutral-500">Browse guides & tutorials</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-neutral-600 ml-auto" />
                                </Link>
                                <a
                                    href="mailto:support@illumi.co.za"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Email Us</p>
                                        <p className="text-xs text-neutral-500">support@illumi.co.za</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Response Times */}
                        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex-1">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Response Times</h3>
                            <div className="space-y-3">
                                {priorities.map((p) => (
                                    <div key={p.value} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {priorityTouched && priority === p.value && (
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            )}
                                            <span className="text-sm text-neutral-400">{p.label}</span>
                                        </div>
                                        <span className="text-sm font-medium text-white">
                                            {p.value === 'low' && '48 hours'}
                                            {p.value === 'medium' && '24 hours'}
                                            {p.value === 'high' && '12 hours'}
                                            {p.value === 'urgent' && '4 hours'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
