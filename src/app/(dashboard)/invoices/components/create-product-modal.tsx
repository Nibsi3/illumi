"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { NumberInput } from "@/components/ui/number-input"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"

interface CreateProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (product: any) => void
}

export function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("You must be logged in to create a product")
                return
            }

            if (!activeWorkspace) {
                toast.error("No workspace selected")
                return
            }

            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name,
                    price,
                    description,
                    user_id: user.id,
                    workspace_id: activeWorkspace.id,
                    status: 'active'
                }])
                .select()
                .single()

            if (error) throw error

            toast.success("Product created successfully")
            if (onSuccess) {
                onSuccess(data)
            }
            onClose()
            setName("")
            setPrice(0)
            setDescription("")
        } catch (error: any) {
            toast.error("Failed to create product", {
                description: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-card border-border text-foreground sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Consulting Fee"
                            className="bg-muted border-border"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Price</Label>
                        <NumberInput
                            value={price}
                            onChange={setPrice}
                            className="bg-muted border-border h-10 px-3"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Hourly rate..."
                            className="bg-muted border-border"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-muted text-muted-foreground hover:text-foreground">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create Product
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

