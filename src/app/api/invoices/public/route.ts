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

const isUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const invoiceId = searchParams.get("id")

        if (!invoiceId) {
            return NextResponse.json(
                { success: false, error: "Invoice ID is required" },
                { status: 400 }
            )
        }

        const service = getServiceClient()

        let query = service
            .from("invoices")
            .select("*, customers(*), invoice_items(*)")
            .limit(1)

        if (isUUID(invoiceId)) {
            query = query.eq("id", invoiceId)
        } else {
            query = query.eq("invoice_number", invoiceId)
        }

        const { data, error } = await query.single()

        if (error || !data) {
            return NextResponse.json(
                { success: false, error: "Invoice not found" },
                { status: 404 }
            )
        }

        let allowHideIllumiBranding = false
        try {
            if (data.workspace_id) {
                const nowIso = new Date().toISOString()
                const { data: sub, error: subError } = await service
                    .from('subscriptions')
                    .select('tier, status, expires_at')
                    .eq('workspace_id', data.workspace_id)
                    .maybeSingle()

                if (!subError && sub && sub.tier === 'pro' && sub.status === 'active') {
                    const expiresAt = sub.expires_at ? new Date(sub.expires_at).toISOString() : null
                    allowHideIllumiBranding = !expiresAt || expiresAt > nowIso
                }
            }
        } catch {
            allowHideIllumiBranding = false
        }

        // Return only the fields needed for the payment page
        // Do NOT expose sensitive workspace/user data
        const safeInvoice = {
            id: data.id,
            invoice_number: data.invoice_number,
            status: data.status,
            issue_date: data.issue_date,
            due_date: data.due_date,
            currency: data.currency,
            subtotal: data.subtotal,
            tax_rate: data.tax_rate,
            tax_amount: data.tax_amount,
            total: data.total,
            notes: data.notes,
            template: data.template,
            invoice_mode: data.invoice_mode,
            logo_url: data.logo_url,
            hide_illumi_branding: Boolean(data.hide_illumi_branding && allowHideIllumiBranding),
            payment_provider: data.payment_provider,
            vat_rate: data.vat_rate,
            vat_amount: data.vat_amount,
            from_email: data.from_email,
            workspace_id: data.workspace_id,
            customers: data.customers
                ? {
                      name: data.customers.name,
                      email: data.customers.email,
                      address: data.customers.address,
                  }
                : null,
            invoice_items: (data.invoice_items || []).map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.total,
            })),
        }

        return NextResponse.json({ success: true, invoice: safeInvoice })
    } catch (error: any) {
        console.error("Public invoice fetch error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch invoice" },
            { status: 500 }
        )
    }
}
