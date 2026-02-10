"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"

const supabase = createClient()

// Shared stale time to reduce Supabase egress
const DEFAULT_STALE_TIME = 5 * 60 * 1000 // 5 minutes

// Query keys for cache invalidation
export const queryKeys = {
    invoices: (workspaceId: string) => ["invoices", workspaceId] as const,
    invoice: (id: string) => ["invoice", id] as const,
    customers: (workspaceId: string) => ["customers", workspaceId] as const,
    customer: (id: string) => ["customer", id] as const,
    products: (workspaceId: string) => ["products", workspaceId] as const,
    product: (id: string) => ["product", id] as const,
    payments: (workspaceId: string) => ["payments", workspaceId] as const,
    settings: (workspaceId: string) => ["settings", workspaceId] as const,
    members: (workspaceId: string) => ["members", workspaceId] as const,
    notifications: (userId: string) => ["notifications", userId] as const,
    metrics: (workspaceId: string, period: string) => ["metrics", workspaceId, period] as const,
}

// Invoices
export function useInvoices() {
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id

    return useQuery({
        queryKey: queryKeys.invoices(workspaceId || ""),
        queryFn: async () => {
            if (!workspaceId) return []
            const { data, error } = await supabase
                .from("invoices")
                .select("id, invoice_number, customer_id, total, tax_amount, status, issue_date, due_date, paid_at, currency, notes, workspace_id, created_at")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
        staleTime: DEFAULT_STALE_TIME,
    })
}

export function useInvoice(id: string) {
    return useQuery({
        queryKey: queryKeys.invoice(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("invoices")
                .select("id, invoice_number, customer_id, user_id, workspace_id, status, issue_date, due_date, currency, subtotal, tax_rate, tax_amount, total, notes, template, invoice_mode, logo_url, payment_provider, is_recurring, recurring_interval, from_email, sent_at, paid_at, created_at")
                .eq("id", id)
                .single()
            if (error) throw error
            return data
        },
        enabled: !!id,
        staleTime: DEFAULT_STALE_TIME,
    })
}

// Customers
export function useCustomers() {
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id

    return useQuery({
        queryKey: queryKeys.customers(workspaceId || ""),
        queryFn: async () => {
            if (!workspaceId) return []
            const { data, error } = await supabase
                .from("customers")
                .select("id, name, email, billing_email, phone, address, status, industry, country, created_at, workspace_id")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
        staleTime: DEFAULT_STALE_TIME,
    })
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: queryKeys.customer(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("customers")
                .select("id, name, email, billing_email, phone, address, status, industry, country, created_at, workspace_id")
                .eq("id", id)
                .single()
            if (error) throw error
            return data
        },
        enabled: !!id,
        staleTime: DEFAULT_STALE_TIME,
    })
}

// Products
export function useProducts() {
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id

    return useQuery({
        queryKey: queryKeys.products(workspaceId || ""),
        queryFn: async () => {
            if (!workspaceId) return []
            const { data, error } = await supabase
                .from("products")
                .select("id, name, sku, description, price, currency, billing_type, status, created_at, workspace_id")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
        staleTime: DEFAULT_STALE_TIME,
    })
}

// Recent Payments
export function useRecentPayments(limit = 10) {
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id

    return useQuery({
        queryKey: [...queryKeys.payments(workspaceId || ""), "recent", limit],
        queryFn: async () => {
            if (!workspaceId) return []
            // payments table has no workspace_id — filter via invoices join
            const { data, error } = await supabase
                .from("payments")
                .select("id, invoice_id, amount, currency, provider, status, paid_at, created_at, invoices!inner(invoice_number, workspace_id, customers(name, email))")
                .eq("invoices.workspace_id", workspaceId)
                .order("created_at", { ascending: false })
                .limit(limit)
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
        staleTime: DEFAULT_STALE_TIME,
    })
}

// Settings
export function useCachedSettings() {
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id

    return useQuery({
        queryKey: queryKeys.settings(workspaceId || ""),
        queryFn: async () => {
            if (!workspaceId) return null
            const { data, error } = await supabase
                .from("workspace_settings")
                .select("id, workspace_id, currency, tax_rate, date_format, from_email, company_name, company_website, company_address, bank_name, account_name, account_number, branch_code, country")
                .eq("workspace_id", workspaceId)
                .single()
            if (error && error.code !== "PGRST116") throw error
            return data
        },
        enabled: !!workspaceId,
        staleTime: DEFAULT_STALE_TIME,
    })
}

// Members
export function useMembers() {
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id

    return useQuery({
        queryKey: queryKeys.members(workspaceId || ""),
        queryFn: async () => {
            if (!workspaceId) return []
            const { data, error } = await supabase
                .from("workspace_members")
                .select("id, email, role, status")
                .eq("workspace_id", workspaceId)
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
    })
}

// Hook to invalidate cache after mutations
export function useInvalidateCache() {
    const queryClient = useQueryClient()
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id || ""

    return {
        invalidateInvoices: () => queryClient.invalidateQueries({ queryKey: queryKeys.invoices(workspaceId) }),
        invalidateInvoice: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.invoice(id) }),
        invalidateCustomers: () => queryClient.invalidateQueries({ queryKey: queryKeys.customers(workspaceId) }),
        invalidateCustomer: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.customer(id) }),
        invalidateProducts: () => queryClient.invalidateQueries({ queryKey: queryKeys.products(workspaceId) }),
        invalidatePayments: () => queryClient.invalidateQueries({ queryKey: queryKeys.payments(workspaceId) }),
        invalidateSettings: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings(workspaceId) }),
        invalidateMembers: () => queryClient.invalidateQueries({ queryKey: queryKeys.members(workspaceId) }),
        invalidateAll: () => queryClient.invalidateQueries(),
    }
}
