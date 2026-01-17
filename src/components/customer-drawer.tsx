"use client"

import * as React from "react"
import { useState } from "react"
import { Drawer } from "vaul"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface CustomerDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCustomerCreated?: (customer: any) => void
}

export function CustomerDrawer({ open, onOpenChange, onCustomerCreated }: CustomerDrawerProps) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [billingEmail, setBillingEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [website, setWebsite] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [taxId, setTaxId] = useState("")
    const [notes, setNotes] = useState("")

    const supabase = createClient()

    const handleSubmit = async () => {
        if (!name || !email) {
            toast.error("Name and Email are required")
            return
        }

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("You must be logged in")
                return
            }

            const { data, error } = await supabase
                .from('customers')
                .insert({
                    user_id: user.id,
                    name,
                    email,
                    billing_email: billingEmail,
                    phone,
                    website,
                    contact_person: contactPerson,
                    address: `${addressLine1} ${addressLine2} ${city} ${state} ${zipCode}`.trim(),
                    tax_id: taxId,
                    notes,
                    status: 'active'
                })
                .select()
                .single()

            if (error) throw error

            toast.success("Customer created successfully")
            if (onCustomerCreated) onCustomerCreated(data)
            onOpenChange(false)

            // Reset form
            setName("")
            setEmail("")
            setBillingEmail("")
            setPhone("")
            setWebsite("")
            setContactPerson("")
            setAddressLine1("")
            setAddressLine2("")
            setCity("")
            setState("")
            setZipCode("")
            setTaxId("")
            setNotes("")
        } catch (error: any) {
            toast.error("Failed to create customer", {
                description: error.message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange} direction="right">
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300" />
                <Drawer.Content className="bg-background flex flex-col rounded-l-[2rem] h-full w-full max-w-lg fixed bottom-0 right-0 z-50 shadow-2xl transition-transform duration-300 ease-in-out">
                    <div className="p-8 flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <Drawer.Title className="text-3xl font-serif font-bold tracking-tight">
                                Create Customer
                            </Drawer.Title>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => onOpenChange(false)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <Accordion type="multiple" defaultValue={["general"]} className="w-full">
                            <AccordionItem value="general" className="border-none">
                                <AccordionTrigger className="text-xl font-serif font-bold py-6 hover:no-underline">
                                    General
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-name" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Name *</Label>
                                        <Input id="cust-name" value={name} onChange={e => setName(e.target.value)} placeholder="Acme Inc" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-email" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Email *</Label>
                                        <Input id="cust-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="acme@example.com" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-billing" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Billing Email</Label>
                                        <Input id="cust-billing" type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} placeholder="finance@example.com" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight pl-1">This is an additional email that will be used to send invoices to.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-phone" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Phone</Label>
                                        <Input id="cust-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-website" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Website</Label>
                                        <Input id="cust-website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="acme.com" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-contact" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Contact person</Label>
                                        <Input id="cust-contact" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="John Doe" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="details" className="border-none mt-2">
                                <AccordionTrigger className="text-xl font-serif font-bold py-6 hover:no-underline">
                                    Details
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-address-1" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Address Line 1</Label>
                                        <Input id="cust-address-1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="123 Main St" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-address-2" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Address Line 2</Label>
                                        <Input id="cust-address-2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} placeholder="Suite 100" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">City</Label>
                                            <Input value={city} onChange={e => setCity(e.target.value)} placeholder="New York" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">State / Province</Label>
                                            <Input value={state} onChange={e => setState(e.target.value)} placeholder="NY" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">ZIP Code</Label>
                                            <Input value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="10001" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-tax-id" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Tax ID / VAT Number</Label>
                                        <Input id="cust-tax-id" value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="Enter VAT number" className="h-12 rounded-xl bg-muted/20 border-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cust-note" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Note</Label>
                                        <Textarea
                                            id="cust-note"
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            placeholder="Additional information..."
                                            className="w-full min-h-[120px] p-4 rounded-xl bg-muted/20 border-none shadow-sm resize-none focus:ring-0 text-sm"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="p-8 border-t bg-background/50 backdrop-blur-md flex items-center justify-end gap-3 sticky bottom-0">
                        <Button variant="ghost" className="rounded-xl px-6 h-12 font-bold" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button className="rounded-xl px-8 h-12 font-bold shadow-lg" onClick={handleSubmit} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
