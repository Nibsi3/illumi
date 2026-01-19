"use client"

import React from "react"

export function PayFastSubscribeButton() {
    return (
        <form
            name="PayFastPayNowForm"
            action="https://payment.payfast.io/eng/process"
            method="post"
            className="flex flex-col items-center"
        >
            <input required type="hidden" name="cmd" value="_paynow" />
            <input required type="hidden" name="receiver" value="10378042" />
            <input type="hidden" name="return_url" value="https://illumi.co.za/settings/billing" />
            <input type="hidden" name="cancel_url" value="https://illumi.co.za/overview" />
            <input required type="hidden" name="amount" value="350" />
            <input required type="hidden" name="item_name" value="Pro Plan" />
            <input type="hidden" name="item_description" value="For growing businesses and teams
Everything in Starter
Custom business logo
PayGate integration
Client payment portal
Recurring invoices
Automated status updates
Priority support" />
            <input required type="hidden" name="subscription_type" value="1" />
            <input type="hidden" name="recurring_amount" value="350" />
            <input required type="hidden" name="cycles" value="0" />
            <input required type="hidden" name="frequency" value="3" />

            <button
                type="submit"
                className="transition-transform hover:scale-105 active:scale-95 shadow-2xl rounded-lg overflow-hidden"
            >
                <img
                    src="https://my.payfast.io/images/buttons/Subscribe/Light-Large-Subscribe.png"
                    alt="Subscribe"
                    title="Subscribe with Payfast"
                    className="h-12 w-auto"
                />
            </button>
        </form>
    )
}
