"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"

const supabase = createClient()

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
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
    })
}

export function useInvoice(id: string) {
    return useQuery({
        queryKey: queryKeys.invoice(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("invoices")
                .select("*")
                .eq("id", id)
                .single()
            if (error) throw error
            return data
        },
        enabled: !!id,
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
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
    })
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: queryKeys.customer(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("customers")
                .select("*")
                .eq("id", id)
                .single()
            if (error) throw error
            return data
        },
        enabled: !!id,
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
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
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
            const { data, error } = await supabase
                .from("payments")
                .select("*, invoices(invoice_number, customers(name, email))")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
                .limit(limit)
            if (error) throw error
            return data || []
        },
        enabled: !!workspaceId,
    })
}

// Settings
export function useSettings() {
    const { activeWorkspace } = useWorkspace()
    const workspaceId = activeWorkspace?.id

    return useQuery({
        queryKey: queryKeys.settings(workspaceId || ""),
        queryFn: async () => {
            if (!workspaceId) return null
            const { data, error } = await supabase
                .from("workspace_settings")
                .select("*")
                .eq("workspace_id", workspaceId)
                .single()
            if (error && error.code !== "PGRST116") throw error
            return data
        },
        enabled: !!workspaceId,
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
