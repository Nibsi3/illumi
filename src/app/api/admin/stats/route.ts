import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

const ADMIN_EMAILS = [
    "cameronfalck03@gmail.com",
    "sweedienibs@gmail.com",
    "anchenfalck@gmail.com",
    "anchenhohls@gmail.com",
]

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY
    )
    if (!serviceKey) {
        throw new Error("Missing Supabase service role key")
    }
    return createClient(url, serviceKey)
}

export async function GET() {
    try {
        // Auth check: only admin emails can access
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user || !ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const service = getServiceClient()

        // Fetch all workspaces with owner info
        const { data: workspaces } = await service
            .from("workspaces")
            .select("id, name, owner_id, created_at")
            .order("created_at", { ascending: false })

        // Fetch all workspace members to get user emails
        const { data: members } = await service
            .from("workspace_members")
            .select("workspace_id, email, role, user_id")

        // Fetch all subscriptions
        const { data: subscriptions } = await service
            .from("subscriptions")
            .select("id, workspace_id, user_id, tier, status, started_at, expires_at")

        // Fetch all invoices (excluding admin workspaces)
        // First, find admin workspace IDs
        const adminOwnerIds = new Set<string>()
        const adminWorkspaceIds = new Set<string>()

        // Build owner email map from members
        const ownerEmailMap: Record<string, string> = {} // owner_id -> email
        for (const m of members || []) {
            if (m.role === "owner" && m.email && m.user_id) {
                ownerEmailMap[m.user_id] = m.email.toLowerCase()
            }
        }

        for (const ws of workspaces || []) {
            const ownerEmail = ownerEmailMap[ws.owner_id] || ""
            if (ADMIN_EMAILS.includes(ownerEmail)) {
                adminOwnerIds.add(ws.owner_id)
                adminWorkspaceIds.add(ws.id)
            }
        }

        // Get non-admin workspaces
        const nonAdminWorkspaces = (workspaces || []).filter(ws => !adminWorkspaceIds.has(ws.id))
        const nonAdminWorkspaceIds = nonAdminWorkspaces.map(ws => ws.id)

        // Fetch invoices for non-admin workspaces
        let allInvoices: any[] = []
        if (nonAdminWorkspaceIds.length > 0) {
            const { data: invoices } = await service
                .from("invoices")
                .select("id, invoice_number, workspace_id, customer_id, total, tax_amount, status, currency, issue_date, due_date, paid_at, created_at")
                .in("workspace_id", nonAdminWorkspaceIds)
                .order("created_at", { ascending: false })
            allInvoices = invoices || []
        }

        // Fetch customers for non-admin workspaces
        let allCustomers: any[] = []
        if (nonAdminWorkspaceIds.length > 0) {
            const { data: customers } = await service
                .from("customers")
                .select("id, name, email, workspace_id")
                .in("workspace_id", nonAdminWorkspaceIds)
            allCustomers = customers || []
        }

        // Build per-workspace stats
        const customerMap: Record<string, any> = {}
        for (const c of allCustomers) {
            customerMap[c.id] = c
        }

        const subsByWorkspace: Record<string, any> = {}
        for (const s of subscriptions || []) {
            subsByWorkspace[s.workspace_id] = s
        }

        // Build user accounts list (non-admin workspaces grouped by owner)
        const userAccounts: any[] = []

        for (const ws of nonAdminWorkspaces) {
            const ownerEmail = ownerEmailMap[ws.owner_id] || "unknown"
            const sub = subsByWorkspace[ws.id]
            const tier = sub?.tier === "pro" && sub?.status === "active" ? "pro" : "free"

            const wsInvoices = allInvoices.filter(inv => inv.workspace_id === ws.id)

            const invoiceStats = {
                total: wsInvoices.length,
                paid: wsInvoices.filter(i => i.status === "paid").length,
                pending: wsInvoices.filter(i => i.status === "pending" || i.status === "sent").length,
                overdue: wsInvoices.filter(i => i.status === "overdue").length,
                draft: wsInvoices.filter(i => i.status === "draft").length,
                cancelled: wsInvoices.filter(i => i.status === "cancelled").length,
                totalAmount: wsInvoices.reduce((sum: number, i: any) => sum + (Number(i.total) || 0), 0),
                paidAmount: wsInvoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + (Number(i.total) || 0), 0),
                pendingAmount: wsInvoices.filter((i: any) => i.status === "pending" || i.status === "sent").reduce((sum: number, i: any) => sum + (Number(i.total) || 0), 0),
            }

            // Build recent invoices list (last 10)
            const recentInvoices = wsInvoices.slice(0, 10).map((inv: any) => {
                const customer = customerMap[inv.customer_id]
                return {
                    invoiceNumber: inv.invoice_number,
                    status: inv.status,
                    total: inv.total,
                    currency: inv.currency || "ZAR",
                    issueDate: inv.issue_date,
                    dueDate: inv.due_date,
                    paidAt: inv.paid_at,
                    customerName: customer?.name || "Unknown",
                    customerEmail: customer?.email || "",
                }
            })

            userAccounts.push({
                workspaceId: ws.id,
                workspaceName: ws.name,
                ownerEmail,
                ownerId: ws.owner_id,
                tier,
                createdAt: ws.created_at,
                invoiceStats,
                recentInvoices,
            })
        }

        // Global summary
        const totalUsers = nonAdminWorkspaces.length
        const proUsers = userAccounts.filter(u => u.tier === "pro").length
        const freeUsers = totalUsers - proUsers
        const totalInvoices = allInvoices.length
        const paidInvoices = allInvoices.filter(i => i.status === "paid").length
        const pendingInvoices = allInvoices.filter(i => i.status === "pending" || i.status === "sent").length
        const overdueInvoices = allInvoices.filter(i => i.status === "overdue").length
        const totalRevenue = allInvoices.reduce((s: number, i: any) => s + (Number(i.total) || 0), 0)
        const paidRevenue = allInvoices.filter(i => i.status === "paid").reduce((s: number, i: any) => s + (Number(i.total) || 0), 0)

        return NextResponse.json({
            success: true,
            summary: {
                totalUsers,
                proUsers,
                freeUsers,
                totalInvoices,
                paidInvoices,
                pendingInvoices,
                overdueInvoices,
                totalRevenue,
                paidRevenue,
            },
            users: userAccounts,
        })
    } catch (err: any) {
        console.error("[Admin Stats] Error:", err)
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
