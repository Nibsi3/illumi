"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { IconStarFilled } from "@tabler/icons-react"

// PayFast Production Credentials - Set these in environment variables
const PAYFAST_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || ""
const PAYFAST_MERCHANT_KEY = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || ""
const PAYFAST_URL = "https://www.payfast.co.za/eng/process"

export function PayFastSubscribeButton() {
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
            <input type="hidden" name="return_url" value="https://illumi.co.za/settings/billing?success=true" />
            <input type="hidden" name="cancel_url" value="https://illumi.co.za/settings/billing?cancelled=true" />
            <input type="hidden" name="notify_url" value="https://illumi.co.za/api/payfast/notify" />
            
            {/* Transaction Details */}
            <input type="hidden" name="amount" value="350.00" />
            <input type="hidden" name="item_name" value="Illumi Pro Plan" />
            <input type="hidden" name="item_description" value="Monthly subscription to Illumi Pro Plan" />
            
            {/* Subscription Details */}
            <input type="hidden" name="subscription_type" value="1" />
            <input type="hidden" name="billing_date" value="" />
            <input type="hidden" name="recurring_amount" value="350.00" />
            <input type="hidden" name="frequency" value="3" />
            <input type="hidden" name="cycles" value="0" />

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
