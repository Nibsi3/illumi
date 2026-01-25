"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ChevronLeft,
    X,
    Plus,
    Search,
    Globe,
    Building2,
    Mail,
    Phone,
    User,
    MapPin,
    Tag,
    Hash,
    FileText,
    Eye,
    Trash
} from "lucide-react"
import Link from "next/link"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import { toast } from "sonner"

export default function NewClientPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()
    
    // Form state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [billingEmail, setBillingEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [website, setWebsite] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [address, setAddress] = useState("")
    const [country, setCountry] = useState("South Africa")
    const [taxId, setTaxId] = useState("")
    const [notes, setNotes] = useState("")
    const [industry, setIndustry] = useState("")

    const handleCreate = async () => {
        if (!name) {
            toast.error("Client name is required")
            return
        }
        if (!email) {
            toast.error("Email is required")
            return
        }
        if (!activeWorkspace) {
            toast.error("No workspace selected")
            return
        }

        setIsLoading(true)
        
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error("You must be logged in")
                return
            }

            const { error } = await supabase
                .from('customers')
                .insert({
                    name,
                    email,
                    billing_email: billingEmail || null,
                    phone: phone || null,
                    address: address || null,
                    country,
                    industry: industry || null,
                    status: 'active',
                    user_id: user.id,
                    workspace_id: activeWorkspace.id
                })

            if (error) throw error

            toast.success("Client created successfully")
            router.push("/clients")
        } catch (error: any) {
            toast.error("Failed to create client", { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-full bg-background text-foreground font-sans flex flex-col lg:flex-row overflow-hidden">
            {/* Main Form Area */}
            <div className="flex-1 overflow-y-auto pb-32 lg:pb-40 no-scrollbar">
                <div className="max-w-4xl mx-auto pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-12">
                    {/* Back Link */}
                    <Link href="/clients" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 group">
                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Clients</span>
                    </Link>

                    <div className="flex items-center justify-between mb-20">
                        <div>
                            <h1 className="text-3xl sm:text-5xl font-serif text-foreground mb-2 italic">New Client</h1>
                            <p className="text-muted-foreground font-mono text-xs sm:text-sm tracking-widest">Add a new client to your workspace</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* General Section */}
                        <div className="bg-card border border-border rounded-2xl p-6 sm:p-12 shadow-2xl">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">General Information</h2>
                            <div className="grid gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company / Client Name</Label>
                                    <Input
                                        placeholder="Acme Inc"
                                        spellCheck={false}
                                        className="bg-transparent border-border h-12 text-lg font-bold focus-visible:ring-white/20"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                        <Input
                                            placeholder="acme@example.com"
                                            spellCheck={false}
                                            className="bg-transparent border-border h-12 focus-visible:ring-white/20"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Billing Email</Label>
                                        <Input
                                            placeholder="finance@example.com"
                                            spellCheck={false}
                                            className="bg-transparent border-border h-12 focus-visible:ring-white/20"
                                            value={billingEmail}
                                            onChange={(e) => setBillingEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                                        <Input placeholder="+27 12 345 6789" className="bg-transparent border-border h-12 focus-visible:ring-white/20" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Website</Label>
                                        <Input placeholder="acme.com" className="bg-transparent border-border h-12 focus-visible:ring-white/20" value={website} onChange={(e) => setWebsite(e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Person</Label>
                                    <Input
                                        placeholder="John Doe"
                                        spellCheck={false}
                                        className="bg-transparent border-border h-12 focus-visible:ring-white/20"
                                        value={contactPerson}
                                        onChange={(e) => setContactPerson(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="bg-card border border-border rounded-2xl p-6 sm:p-12 shadow-2xl">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Address & Localization</h2>
                            <div className="grid gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Address</Label>
                                    <textarea
                                        placeholder="Line 1, Line 2, City, State, ZIP"
                                        spellCheck={false}
                                        className="w-full bg-transparent border border-border rounded-xl p-4 h-32 focus:ring-1 focus:ring-white/20 transition-all text-sm resize-none outline-none"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Country</Label>
                                        <Select value={country} onValueChange={setCountry}>
                                            <SelectTrigger className="bg-transparent border-border h-12 focus:ring-white/20">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border text-foreground">
                                                <SelectItem value="South Africa">South Africa</SelectItem>
                                                <SelectItem value="United States">United States</SelectItem>
                                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tax ID / VAT Number</Label>
                                        <Input placeholder="Enter VAT number" className="bg-transparent border-border h-12 focus-visible:ring-white/20" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="bg-card border border-border rounded-2xl p-6 sm:p-12 shadow-2xl">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Private Notes</h2>
                            <textarea placeholder="Add any private details about this client..." className="w-full bg-transparent border border-border rounded-xl p-4 h-32 focus:ring-1 focus:ring-white/20 transition-all text-sm resize-none outline-none" value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden sticky bottom-0 z-30 bg-background/95 backdrop-blur border-t border-border p-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-12 flex-1 border-border bg-muted hover:bg-accent px-6 font-bold"
                        onClick={() => router.push("/clients")}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="h-12 flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl px-8 font-bold"
                        onClick={handleCreate}
                        disabled={isLoading}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Create"}
                    </Button>
                </div>
            </div>

            {/* Right Side Action Bar (Centrally Sticky) */}
            <div className="hidden lg:flex w-80 border-l border-border bg-card flex-col h-full sticky top-0 overflow-y-auto no-scrollbar">
                {/* Status at Top */}
                <div className="p-8 shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Creation</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-bold text-foreground uppercase tracking-tighter">Ready to Save</span>
                        </div>
                    </div>
                </div>

                {/* Vertically Centered Content */}
                <div className="flex-1 flex flex-col justify-center px-8 min-h-[500px] gap-10 py-12">
                    <div className="space-y-8">
                        {/* Help & Categories Above */}
                        <div className="space-y-6">
                            <div className="space-y-4 text-left">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Information</span>
                                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                    Creating a client allows you to assign invoices, track expenses, and manage communications in one place. Ensure the contact person is correct for automated reminders.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categories</span>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-medium">Industry</Label>
                                    <Select>
                                        <SelectTrigger className="h-10 bg-muted border-border text-foreground rounded-lg">
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border text-foreground">
                                            <SelectItem value="tech">Technology</SelectItem>
                                            <SelectItem value="finance">Finance</SelectItem>
                                            <SelectItem value="health">Healthcare</SelectItem>
                                            <SelectItem value="retail">Retail</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="h-12 rounded-xl border-border bg-muted hover:bg-accent px-6 font-bold"
                                onClick={() => router.push("/clients")}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl px-8 font-bold"
                                onClick={handleCreate}
                                disabled={isLoading}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isLoading ? "Saving..." : "Create Client"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Discard at Bottom */}
                <div className="p-8 shrink-0">
                    <button className="flex items-center gap-3 text-red-500/60 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-tighter">
                        <Trash className="h-4 w-4" />
                        Discard
                    </button>
                </div>
            </div>
        </div>
    )
}

