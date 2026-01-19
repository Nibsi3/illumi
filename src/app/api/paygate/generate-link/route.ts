import { NextResponse } from "next/server"

// PayGate link generator
export async function POST(req: Request) {
    try {
        const { invoiceId, amount, currency, provider, invoiceNumber } = await req.json()

        // Determine the base URL for callbacks
        const host = req.headers.get('host')
        const protocol = req.headers.get('x-forwarded-proto') || 'http'
        const domain = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`

        // PayFast Implementation
        if (provider === 'payfast') {
            const baseUrl = "https://sandbox.payfast.co.za/eng/process"

            const params = new URLSearchParams({
                merchant_id: process.env.PAYFAST_MERCHANT_ID || "10000100", // Sandbox default
                merchant_key: process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a", // Sandbox default
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

        // Yoco Implementation - Checkout API
        if (provider === 'yoco') {
            // Yoco uses a Checkout API - we create a checkout session
            // In production, this would call the Yoco API to create a checkout
            // For now, we'll use their hosted checkout page format
            const yocoSecretKey = process.env.YOCO_SECRET_KEY || ''
            
            if (!yocoSecretKey) {
                // Fallback to test mode simulation
                return NextResponse.json({
                    success: true,
                    link: `https://pay.yoco.com/checkout?amount=${Math.round(amount * 100)}&currency=${currency}&reference=${invoiceNumber || invoiceId}&return_url=${encodeURIComponent(`${domain}/pay/${invoiceId}?status=success`)}`,
                    provider: 'yoco',
                    note: 'Yoco test mode - configure YOCO_SECRET_KEY for production'
                })
            }

            // Production Yoco Checkout API call would go here
            // For now, return a placeholder that indicates Yoco is selected
            return NextResponse.json({
                success: true,
                link: `https://payments.yoco.com/checkout?amount=${Math.round(amount * 100)}&currency=${currency}&merchantReference=${invoiceNumber || invoiceId}`,
                provider: 'yoco'
            })
        }

        // PayStack Implementation
        if (provider === 'paystack') {
            const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || ''
            
            // PayStack hosted checkout
            return NextResponse.json({
                success: true,
                link: `https://checkout.paystack.com/initialize?amount=${Math.round(amount * 100)}&email=customer@example.com&reference=${invoiceNumber || invoiceId}&callback_url=${encodeURIComponent(`${domain}/pay/${invoiceId}?status=success`)}`,
                provider: 'paystack'
            })
        }

        // Ozow Implementation
        if (provider === 'ozow') {
            return NextResponse.json({
                success: true,
                link: `https://pay.ozow.com/?amount=${amount}&reference=${invoiceNumber || invoiceId}&cancelUrl=${encodeURIComponent(`${domain}/pay/${invoiceId}?status=cancelled`)}&successUrl=${encodeURIComponent(`${domain}/pay/${invoiceId}?status=success`)}`,
                provider: 'ozow'
            })
        }

        // Peach Payments Implementation
        if (provider === 'peach') {
            return NextResponse.json({
                success: true,
                link: `https://checkout.peachpayments.com/?amount=${amount}&currency=${currency}&reference=${invoiceNumber || invoiceId}`,
                provider: 'peach'
            })
        }

        // Generic fallback for unknown providers
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
