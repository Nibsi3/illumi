import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

type PublicInvoiceCustomer = {
    name: string | null
    email: string | null
    address: string | null
}

type PublicInvoiceItem = {
    description: string | null
    quantity: number | null
    unit_price: number | null
    total: number | null
}

type PublicInvoiceRow = {
    id: string
    invoice_number: string | null
    status: string | null
    issue_date: string | null
    due_date: string | null
    currency: string | null
    subtotal: number | null
    tax_rate: number | null
    tax_amount: number | null
    total: number | null
    notes: string | null
    template: string | null
    invoice_mode: string | null
    logo_url: string | null
    hide_illumi_branding: boolean | null
    payment_provider: string | null
    vat_rate: number | null
    vat_amount: number | null
    from_email: string | null
    company_website: string | null
    bank_name: string | null
    account_name: string | null
    account_number: string | null
    branch_code: string | null
    workspace_id: string | null
    updated_at: string | null
    viewed_at: string | null
    paid_at: string | null
    customers: PublicInvoiceCustomer | null
    invoice_items: PublicInvoiceItem[] | null
}

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

        const lookupIsUuid = isUUID(invoiceId)

        let query = service
            .from("invoices")
            .select(
                [
                    "id",
                    "invoice_number",
                    "status",
                    "issue_date",
                    "due_date",
                    "currency",
                    "subtotal",
                    "tax_rate",
                    "tax_amount",
                    "total",
                    "notes",
                    "template",
                    "invoice_mode",
                    "logo_url",
                    "hide_illumi_branding",
                    "payment_provider",
                    "vat_rate",
                    "vat_amount",
                    "from_email",
                    "company_website",
                    "bank_name",
                    "account_name",
                    "account_number",
                    "branch_code",
                    "workspace_id",
                    "updated_at",
                    "viewed_at",
                    "paid_at",
                    "customers(name,email,address)",
                    "invoice_items(description,quantity,unit_price,total)",
                ].join(",")
            )

        if (lookupIsUuid) {
            query = query.eq("id", invoiceId)
        } else {
            // invoice_number is not guaranteed to be globally unique across workspaces.
            // Use a deterministic pick to avoid .single() errors when duplicates exist.
            query = query.eq("invoice_number", invoiceId).order("updated_at", { ascending: false }).limit(1)
        }

        const { data: rawData, error } = await (lookupIsUuid ? query.maybeSingle() : query.maybeSingle())

        if (error) {
            console.error("Public invoice fetch query error:", error)
            return NextResponse.json(
                { success: false, error: "Failed to fetch invoice", details: error.message || String(error) },
                { status: 500 }
            )
        }

        if (!rawData) {
            // Debug: check if any invoice exists with similar number
            const { data: debugData, error: debugError } = await service
                .from("invoices")
                .select("id, invoice_number")
                .ilike("invoice_number", `%${invoiceId.slice(-4)}%`)
                .limit(5)
            console.error("Invoice not found. Lookup:", { invoiceId, lookupIsUuid, debugMatches: debugData, debugError })
            return NextResponse.json(
                { success: false, error: "Invoice not found", lookup: { id: invoiceId, isUuid: lookupIsUuid }, similar: debugData || [] },
                { status: 404 }
            )
        }

        const data = rawData as unknown as PublicInvoiceRow

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
            is_pro_workspace: Boolean(allowHideIllumiBranding),
            payment_provider: data.payment_provider || null,
            vat_rate: data.vat_rate,
            vat_amount: data.vat_amount,
            from_email: data.from_email,
            company_website: data.company_website,
            bank_name: data.bank_name,
            account_name: data.account_name,
            account_number: data.account_number,
            branch_code: data.branch_code,
            workspace_id: data.workspace_id,
            updated_at: data.updated_at,
            viewed_at: data.viewed_at,
            paid_at: data.paid_at,
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

        // Cache public invoice payload briefly to reduce repeated DB egress.
        // Keep TTL short because invoices can change (viewed/paid).
        const res = NextResponse.json({ success: true, invoice: safeInvoice })
        res.headers.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400")
        return res
    } catch (error: any) {
        console.error("Public invoice fetch error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch invoice" },
            { status: 500 }
        )
    }
}
