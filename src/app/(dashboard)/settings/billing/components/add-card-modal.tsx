"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { IconCreditCard, IconLock } from "@tabler/icons-react"
import { toast } from "sonner"

interface AddCardModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (card: any) => void
}

export function AddCardModal({ isOpen, onClose, onSave }: AddCardModalProps) {
    const [number, setNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvc, setCvc] = useState("")
    const [name, setName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
        const matches = v.match(/\d{4,16}/g)
        const match = matches && matches[0] || ""
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(" ")
        } else {
            return value
        }
    }

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4)
        }
        return v
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Basic Validation
        if (number.length < 16) {
            toast.error("Invalid card number")
            setIsSubmitting(false)
            return
        }

        // Simulate API call
        setTimeout(() => {
            const last4 = number.replace(/\s/g, "").slice(-4)
            const [expMonth, expYear] = expiry.split('/')

            // Infer brand (simplistic)
            const brand = number.startsWith("4") ? "Visa" : "Mastercard"

            const newCard = {
                id: Math.random().toString(36).substr(2, 9),
                brand,
                last4,
                expMonth: parseInt(expMonth),
                expYear: parseInt(`20${expYear}`),
                isDefault: false
            }

            onSave(newCard)
            setIsSubmitting(false)
            setNumber("")
            setExpiry("")
            setCvc("")
            setName("")
            onClose()
            toast.success("Card added successfully")
        }, 1500)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconCreditCard className="w-5 h-5 text-neutral-400" />
                        Add Payment Method
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Cardholder Name</Label>
                        <Input
                            placeholder="John Doe"
                            className="bg-white/5 border-white/10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Card Number</Label>
                        <div className="relative">
                            <Input
                                placeholder="0000 0000 0000 0000"
                                className="bg-white/5 border-white/10 pl-10"
                                value={number}
                                onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                                maxLength={19}
                                required
                            />
                            <IconCreditCard className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Expiry Date</Label>
                            <Input
                                placeholder="MM/YY"
                                className="bg-white/5 border-white/10"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                maxLength={5}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CVC</Label>
                            <div className="relative">
                                <Input
                                    placeholder="123"
                                    className="bg-white/5 border-white/10 pl-10"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
                                    required
                                />
                                <IconLock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-neutral-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Adding Card..." : "Add Card"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
