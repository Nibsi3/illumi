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

    // Luhn algorithm for card number validation
    const isValidCardNumber = (cardNumber: string) => {
        const digits = cardNumber.replace(/\s/g, '')
        if (digits.length < 13 || digits.length > 19) return false
        
        let sum = 0
        let isEven = false
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i], 10)
            
            if (isEven) {
                digit *= 2
                if (digit > 9) digit -= 9
            }
            
            sum += digit
            isEven = !isEven
        }
        
        return sum % 10 === 0
    }

    // Validate expiry date
    const isValidExpiry = (expiryStr: string) => {
        const parts = expiryStr.split('/')
        if (parts.length !== 2) return false
        
        const month = parseInt(parts[0], 10)
        const year = parseInt(`20${parts[1]}`, 10)
        
        if (month < 1 || month > 12) return false
        
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1
        
        if (year < currentYear) return false
        if (year === currentYear && month < currentMonth) return false
        
        return true
    }

    // Validate CVC
    const isValidCVC = (cvcStr: string) => {
        return cvcStr.length >= 3 && cvcStr.length <= 4 && /^\d+$/.test(cvcStr)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Validate cardholder name
        if (!name.trim()) {
            toast.error("Please enter cardholder name")
            setIsSubmitting(false)
            return
        }

        // Validate card number with Luhn algorithm
        if (!isValidCardNumber(number)) {
            toast.error("Invalid card number", { description: "Please check the card number and try again" })
            setIsSubmitting(false)
            return
        }

        // Validate expiry date
        if (!isValidExpiry(expiry)) {
            toast.error("Invalid expiry date", { description: "Card may be expired or date format is incorrect" })
            setIsSubmitting(false)
            return
        }

        // Validate CVC
        if (!isValidCVC(cvc)) {
            toast.error("Invalid CVC", { description: "CVC must be 3-4 digits" })
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
                <form onSubmit={handleSubmit} className="space-y-4 pt-4" autoComplete="on">
                    <div className="space-y-2">
                        <Label>Cardholder Name</Label>
                        <Input
                            name="cc-name"
                            autoComplete="cc-name"
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
                                name="cc-number"
                                autoComplete="cc-number"
                                inputMode="numeric"
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
                                name="cc-exp"
                                autoComplete="cc-exp"
                                inputMode="numeric"
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
                                    name="cc-csc"
                                    autoComplete="cc-csc"
                                    inputMode="numeric"
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
