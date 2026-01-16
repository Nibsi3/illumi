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

export default function NewClientPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = () => {
        setIsLoading(true)
        // Simulate creation
        setTimeout(() => {
            setIsLoading(false)
            router.push("/clients")
        }, 1000)
    }

    return (
        <div className="h-full bg-black text-white font-sans flex overflow-hidden">
            {/* Main Form Area */}
            <div className="flex-1 overflow-y-auto pb-40 no-scrollbar">
                <div className="max-w-4xl mx-auto pt-16 px-12">
                    {/* Back Link */}
                    <Link href="/clients" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 group">
                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Customers</span>
                    </Link>

                    <div className="flex items-center justify-between mb-20">
                        <div>
                            <h1 className="text-5xl font-serif text-white mb-2 italic">New Customer</h1>
                            <p className="text-neutral-500 font-mono text-sm tracking-widest">Add a new client to your workspace</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* General Section */}
                        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-12 shadow-2xl">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787] mb-8">General Information</h2>
                            <div className="grid gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Company / Client Name</Label>
                                    <Input
                                        placeholder="Acme Inc"
                                        spellCheck={false}
                                        className="bg-transparent border-white/10 h-12 text-lg font-bold focus-visible:ring-white/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Email Address</Label>
                                        <Input
                                            placeholder="acme@example.com"
                                            spellCheck={false}
                                            className="bg-transparent border-white/10 h-12 focus-visible:ring-white/20"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Billing Email</Label>
                                        <Input
                                            placeholder="finance@example.com"
                                            spellCheck={false}
                                            className="bg-transparent border-white/10 h-12 focus-visible:ring-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Phone Number</Label>
                                        <Input placeholder="+27 12 345 6789" className="bg-transparent border-white/10 h-12 focus-visible:ring-white/20" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Website</Label>
                                        <Input placeholder="acme.com" className="bg-transparent border-white/10 h-12 focus-visible:ring-white/20" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Contact Person</Label>
                                    <Input
                                        placeholder="John Doe"
                                        spellCheck={false}
                                        className="bg-transparent border-white/10 h-12 focus-visible:ring-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-12 shadow-2xl">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787] mb-8">Address & Localization</h2>
                            <div className="grid gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Full Address</Label>
                                    <textarea
                                        placeholder="Line 1, Line 2, City, State, ZIP"
                                        spellCheck={false}
                                        className="w-full bg-transparent border border-white/10 rounded-xl p-4 h-32 focus:ring-1 focus:ring-white/20 transition-all text-sm resize-none outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Country</Label>
                                        <Select defaultValue="za">
                                            <SelectTrigger className="bg-transparent border-white/10 h-12 focus:ring-white/20">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                                <SelectItem value="za">South Africa</SelectItem>
                                                <SelectItem value="us">United States</SelectItem>
                                                <SelectItem value="uk">United Kingdom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-[#878787]">Tax ID / VAT Number</Label>
                                        <Input placeholder="Enter VAT number" className="bg-transparent border-white/10 h-12 focus-visible:ring-white/20" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-12 shadow-2xl">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787] mb-8">Private Notes</h2>
                            <textarea placeholder="Add any private details about this client..." className="w-full bg-transparent border border-white/10 rounded-xl p-4 h-32 focus:ring-1 focus:ring-white/20 transition-all text-sm resize-none outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side Action Bar (Centrally Sticky) */}
            <div className="w-80 border-l border-white/10 bg-[#050505] flex flex-col h-full sticky top-0 overflow-y-auto no-scrollbar">
                {/* Status at Top */}
                <div className="p-8 shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787] mb-1">Creation</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-bold text-white uppercase tracking-tighter">Ready to Save</span>
                        </div>
                    </div>
                </div>

                {/* Vertically Centered Content */}
                <div className="flex-1 flex flex-col justify-center px-8 min-h-[500px] gap-10 py-12">
                    <div className="space-y-8">
                        {/* Help & Categories Above */}
                        <div className="space-y-6">
                            <div className="space-y-4 text-left">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Information</span>
                                <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                                    Creating a customer allows you to assign invoices, track expenses, and manage communications in one place. Ensure the contact person is correct for automated reminders.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Categories</span>
                                <div className="space-y-2">
                                    <Label className="text-xs text-neutral-500 font-medium">Industry</Label>
                                    <Select>
                                        <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white rounded-lg">
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                            <SelectItem value="tech">Technology</SelectItem>
                                            <SelectItem value="finance">Finance</SelectItem>
                                            <SelectItem value="health">Healthcare</SelectItem>
                                            <SelectItem value="retail">Retail</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Actions at the bottom of the centered block */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <Button
                                className="w-full h-12 bg-white text-black hover:bg-neutral-200 transition-colors font-black uppercase tracking-tighter text-xs"
                                onClick={handleCreate}
                                disabled={isLoading}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isLoading ? "Saving..." : "Create Customer"}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12 border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors font-bold uppercase tracking-tighter text-xs"
                                onClick={() => router.back()}
                            >
                                Cancel
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
