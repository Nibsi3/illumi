import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        throw new Error("Missing Supabase service role credentials")
    }

    return createServiceClient(url, serviceKey)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { invoiceId } = body

        if (!invoiceId) {
            return NextResponse.json(
                { success: false, error: "Invoice ID is required" },
                { status: 400 }
            )
        }

        const service = getServiceClient()

        // Only update if current status is 'sent'
        const { error } = await service
            .from("invoices")
            .update({
                status: "viewed",
                viewed_at: new Date().toISOString(),
            })
            .eq("id", invoiceId)
            .eq("status", "sent")

        if (error) {
            console.error("Mark viewed error:", error)
            return NextResponse.json(
                { success: false, error: "Failed to update invoice" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Mark viewed error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to mark invoice as viewed" },
            { status: 500 }
        )
    }
}
