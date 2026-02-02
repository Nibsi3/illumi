import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { recipients } = await req.json()

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing recipients array" },
                { status: 400 }
            )
        }

        const results = []

        for (const recipient of recipients) {
            const { email, companyName } = recipient

            if (!email) {
                results.push({ email, success: false, error: "Missing email" })
                continue
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'https://www.illumi.co.za'}/api/email/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'marketing_demo',
                        to: email,
                        customerName: companyName || 'Your Company',
                        subject: 'See How Illumi Can Transform Your Invoicing',
                    })
                })

                const data = await response.json()
                results.push({ email, companyName, success: data.success, error: data.error })
            } catch (err: any) {
                results.push({ email, companyName, success: false, error: err.message })
            }
        }

        const successCount = results.filter(r => r.success).length
        const failCount = results.filter(r => !r.success).length

        return NextResponse.json({
            success: true,
            summary: {
                total: recipients.length,
                sent: successCount,
                failed: failCount,
            },
            results,
        })
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        )
    }
}
