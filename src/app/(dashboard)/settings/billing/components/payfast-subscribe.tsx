"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { IconStarFilled, IconLoader2 } from "@tabler/icons-react"
import { useWorkspace } from "@/lib/workspace-context"
import { createClient } from "@/lib/supabase/client"

// PayFast Production Credentials
const PAYFAST_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || ""
const PAYFAST_MERCHANT_KEY = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || ""
const PAYFAST_URL = "https://www.payfast.co.za/eng/process"

// Base URL for callbacks
const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://illumi.co.za"

export function PayFastSubscribeButton() {
    const { activeWorkspace, userId } = useWorkspace()
    const [userEmail, setUserEmail] = useState<string>("")
    const [userName, setUserName] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    
    const supabase = createClient()
    
    useEffect(() => {
        async function fetchUserDetails() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email || "")
                setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "")
            }
            setIsLoading(false)
        }
        fetchUserDetails()
    }, [supabase])
    
    if (isLoading || !activeWorkspace || !userId) {
        return (
            <Button
                disabled
                className="bg-white/50 text-black h-12 px-8 font-black uppercase tracking-tighter text-sm"
            >
                <IconLoader2 size={18} className="mr-2 animate-spin" />
                Loading...
            </Button>
        )
    }

    return (
        <form
            name="PayFastPayNowForm"
            action={PAYFAST_URL}
            method="post"
            className="flex flex-col items-center"
        >
            {/* Merchant Details */}
            <input type="hidden" name="merchant_id" value={PAYFAST_MERCHANT_ID} />
            <input type="hidden" name="merchant_key" value={PAYFAST_MERCHANT_KEY} />
            
            {/* Return URLs */}
            <input type="hidden" name="return_url" value={`${BASE_URL}/settings/billing?success=true`} />
            <input type="hidden" name="cancel_url" value={`${BASE_URL}/settings/billing?cancelled=true`} />
            <input type="hidden" name="notify_url" value={`${BASE_URL}/api/payfast/notify`} />
            
            {/* Buyer Details */}
            <input type="hidden" name="name_first" value={userName.split(" ")[0] || ""} />
            <input type="hidden" name="name_last" value={userName.split(" ").slice(1).join(" ") || ""} />
            <input type="hidden" name="email_address" value={userEmail} />
            
            {/* Transaction Details */}
            <input type="hidden" name="m_payment_id" value={`SUB-${activeWorkspace.id}-${Date.now()}`} />
            <input type="hidden" name="amount" value="350.00" />
            <input type="hidden" name="item_name" value="Illumi Pro Plan" />
            <input type="hidden" name="item_description" value="Monthly subscription to Illumi Pro Plan" />
            
            {/* Custom fields for tracking */}
            <input type="hidden" name="custom_str1" value={activeWorkspace.id} />
            <input type="hidden" name="custom_str2" value={userId} />
            
            {/* Subscription Details for Recurring Billing */}
            <input type="hidden" name="subscription_type" value="1" />
            <input type="hidden" name="recurring_amount" value="350.00" />
            <input type="hidden" name="frequency" value="3" /> {/* 3 = Monthly */}
            <input type="hidden" name="cycles" value="0" /> {/* 0 = Indefinite */}

            <Button
                type="submit"
                className="bg-white text-black hover:bg-neutral-200 h-12 px-8 font-black uppercase tracking-tighter text-sm shadow-2xl transition-all"
            >
                <IconStarFilled size={18} className="mr-2" />
                Subscribe Now — R350/mo
            </Button>
        </form>
    )
}
