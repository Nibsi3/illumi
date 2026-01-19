import { NextResponse } from "next/server"

// PayGate link generator
export async function POST(req: Request) {
    try {
        const { invoiceId, amount, currency, provider, invoiceNumber } = await req.json()

        // PayFast Sandbox Implementation
        if (provider === 'payfast') {
            const baseUrl = "https://sandbox.payfast.co.za/eng/process"

            // Determine the base URL for non-local testing
            const host = req.headers.get('host')
            const protocol = req.headers.get('x-forwarded-proto') || 'http'
            const domain = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`

            const params = new URLSearchParams({
                merchant_id: "10000100", // PayFast Sandbox Merchant ID
                merchant_key: "46f0cd694581a", // PayFast Sandbox Merchant Key
                return_url: `${domain}/pay/${invoiceId}?status=success`,
                cancel_url: `${domain}/pay/${invoiceId}?status=cancelled`,
                notify_url: `${domain}/api/webhooks/paygate`,
                amount: amount.toString(),
                item_name: `Invoice ${invoiceNumber || invoiceId}`,
                m_payment_id: invoiceId
            })

            return NextResponse.json({
                success: true,
                link: `${baseUrl}?${params.toString()}`,
                provider: 'payfast'
            })
        }

        // Generic mock for other providers
        const paymentLink = `https://pay.illumi.co.za/${provider}/${invoiceId}?amt=${amount}&cur=${currency}`

        return NextResponse.json({
            success: true,
            link: paymentLink,
            provider,
            reference: `INV-${invoiceId}-${Date.now()}`
        })
    } catch (error) {
        console.error('[Generate Link Error]:', error)
        return NextResponse.json({ success: false, error: "Failed to generate link" }, { status: 500 })
    }
}
