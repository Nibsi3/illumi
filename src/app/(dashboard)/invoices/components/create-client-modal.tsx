"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CreateCustomerModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (customer: any) => void
}

export function CreateClientModal({ isOpen, onClose, onSuccess }: CreateCustomerModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("You must be logged in to create a customer")
                return
            }

            const { data, error } = await supabase
                .from('customers')
                .insert([{
                    name,
                    email,
                    address,
                    user_id: user.id,
                    status: 'active'
                }])
                .select()
                .single()

            if (error) throw error

            toast.success("Customer created successfully")
            if (onSuccess) {
                onSuccess(data)
            }
            onClose()
            setName("")
            setEmail("")
            setAddress("")
        } catch (error: any) {
            toast.error("Failed to create customer", {
                description: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Acme Corp"
                            className="bg-white/5 border-white/10"
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
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Physical Address</Label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Business St..."
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5 text-white/60 hover:text-white">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-neutral-200">
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create Customer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
