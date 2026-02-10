"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import { useInvalidateCache } from "@/lib/hooks/use-cached-data"

interface CreateCustomerModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (customer: any) => void
}

export function CreateClientModal({ isOpen, onClose, onSuccess }: CreateCustomerModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [billingEmail, setBillingEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [country, setCountry] = useState("South Africa")
    const [industry, setIndustry] = useState("")
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()
    const { invalidateCustomers } = useInvalidateCache()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("You must be logged in to create a client")
                return
            }

            if (!activeWorkspace?.id) {
                toast.error("No workspace selected")
                return
            }

            const { data, error } = await supabase
                .from('customers')
                .insert([{
                    name,
                    email,
                    billing_email: billingEmail || null,
                    phone: phone || null,
                    address: address || null,
                    country,
                    industry: industry || null,
                    user_id: user.id,
                    workspace_id: activeWorkspace.id,
                    status: 'active'
                }])
                .select()
                .single()

            if (error) throw error

            toast.success("Client created successfully")
            await invalidateCustomers()
            if (onSuccess) {
                onSuccess(data)
            }
            onClose()
            setName("")
            setEmail("")
            setBillingEmail("")
            setPhone("")
            setAddress("")
            setCountry("South Africa")
            setIndustry("")
        } catch (error: any) {
            toast.error("Failed to create client", {
                description: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-card border-border text-foreground sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Client</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>Client Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Acme Corp"
                            className="bg-muted border-border"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="billing@acme.com"
                            className="bg-muted border-border"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Billing Email</Label>
                        <Input
                            value={billingEmail}
                            onChange={(e) => setBillingEmail(e.target.value)}
                            type="email"
                            placeholder="finance@acme.com"
                            className="bg-muted border-border"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+27 12 345 6789"
                            className="bg-muted border-border"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Physical Address</Label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Business St..."
                            className="bg-muted border-border"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="South Africa"
                            className="bg-muted border-border"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Industry</Label>
                        <Input
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="E.g. Construction"
                            className="bg-muted border-border"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-muted text-muted-foreground hover:text-foreground">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create Client
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

