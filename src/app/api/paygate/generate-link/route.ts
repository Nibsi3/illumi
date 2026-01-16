import { NextResponse } from "next/server"

// Mock implementation of a PayGate link generator
export async function POST(req: Request) {
    try {
        const { invoiceId, amount, currency, provider } = await req.json()

        // In a real implementation, you would call the PayGate/PayFast/PayStack API here
        // For development/mock purposes, we generate a unique link tied to the invoice
        const paymentLink = `https://pay.illumi.co.za/${provider}/${invoiceId}?amt=${amount}&cur=${currency}`

        return NextResponse.json({
            success: true,
            link: paymentLink,
            provider,
            reference: `INV-${invoiceId}-${Date.now()}`
        })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to generate link" }, { status: 500 })
    }
}
