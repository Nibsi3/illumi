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
            .select("id, invoice_number, status, issue_date, due_date, currency, subtotal, tax_rate, tax_amount, total, notes, template, invoice_mode, logo_url, hide_illumi_branding, payment_provider, from_email, company_website, bank_name, account_name, account_number, branch_code, workspace_id, customers(name, email, address), invoice_items(description, quantity, unit_price, discount_rate, total)")
            .limit(1)

        if (isUUID(invoiceId)) {
            query = query.eq("id", invoiceId)
        } else {
            query = query.eq("invoice_number", invoiceId)
        }

        const { data, error } = await query.single()

        if (error || !data) {
            console.error("Public invoice lookup failed:", { invoiceId, error })
            return NextResponse.json(
                { success: false, error: "Invoice not found" },
                { status: 404 }
            )
        }

        // Workspace branding (name + logo)
        let workspaceBrand: { name: string | null; logo_url: string | null } | null = null
        try {
            if (data.workspace_id) {
                const { data: ws } = await service
                    .from('workspaces')
                    .select('name, logo_url')
                    .eq('id', data.workspace_id)
                    .maybeSingle()

                if (ws) {
                    workspaceBrand = {
                        name: (ws as any).name ?? null,
                        logo_url: (ws as any).logo_url ?? null,
                    }
                }
            }
        } catch {
            workspaceBrand = null
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
            logo_url: data.logo_url || workspaceBrand?.logo_url || null,
            workspace: workspaceBrand,
            hide_illumi_branding: Boolean(data.hide_illumi_branding && allowHideIllumiBranding),
            is_pro_workspace: Boolean(allowHideIllumiBranding),
            payment_provider: data.payment_provider || null,
            vat_rate: data.tax_rate,
            vat_amount: data.tax_amount,
            from_email: data.from_email,
            company_website: data.company_website,
            bank_name: data.bank_name,
            account_name: data.account_name,
            account_number: data.account_number,
            branch_code: data.branch_code,
            workspace_id: data.workspace_id,
            customers: data.customers
                ? {
                      name: (data.customers as any).name,
                      email: (data.customers as any).email,
                      address: (data.customers as any).address,
                  }
                : null,
            invoice_items: (data.invoice_items || []).map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                discount_rate: item.discount_rate ?? 0,
                total: item.total,
            })),
        }

        const response = NextResponse.json({ success: true, invoice: safeInvoice })
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
        return response
    } catch (error: any) {
        console.error("Public invoice fetch error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch invoice" },
            { status: 500 }
        )
    }
}
