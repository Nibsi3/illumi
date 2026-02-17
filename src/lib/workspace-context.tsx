"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface Workspace {
    id: string
    name: string
    slug: string
    owner_id: string
    logo_url?: string | null
    created_at: string
}

interface WorkspaceContextType {
    workspaces: Workspace[]
    activeWorkspace: Workspace | null
    setActiveWorkspace: (workspace: Workspace) => void
    isLoading: boolean
    refreshWorkspaces: (forceRefresh?: boolean) => Promise<void>
    isOwner: boolean
    userId: string | null
    userEmail: string | null
}

const WorkspaceContext = createContext<WorkspaceContextType>({
    workspaces: [],
    activeWorkspace: null,
    setActiveWorkspace: () => { },
    isLoading: true,
    refreshWorkspaces: async () => { },
    isOwner: false,
    userId: null,
    userEmail: null,
})

export function useWorkspace() {
    return useContext(WorkspaceContext)
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClient()
    const queryClient = useQueryClient()

    const SIGNED_IN_AT_KEY = 'illumi_auth_signed_in_at'
    const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000

    const isOwner = Boolean(activeWorkspace && userId && activeWorkspace.owner_id === userId)

    const refreshWorkspaces = useCallback(async (forceRefresh = false) => {
        let perfEnabled = false
        try {
            perfEnabled = localStorage.getItem('illumi_perf') === '1'
        } catch {
            perfEnabled = false
        }

        if (perfEnabled) console.time('workspace:refreshWorkspaces')
        try {
            if (perfEnabled) console.time('workspace:auth.getSession')
            const { data: sessionData } = await supabase.auth.getSession()
            if (perfEnabled) console.timeEnd('workspace:auth.getSession')

            const user = sessionData?.session?.user || null
            if (!user) {
                setIsLoading(false)
                setUserEmail(null)
                setUserId(null)
                return
            }

            setUserId(user.id)
            setUserEmail((user.email || '').toLowerCase().trim() || null)

            // Use cached workspaces if available and not forcing refresh
            // Cache is scoped by user ID to prevent cross-user data leaking
            const CACHE_KEY = `illumi_workspaces_cache_${user.id}`
            const CACHE_TTL = 10 * 60 * 1000 // 10 minutes - reduces API calls
            let deduped: Workspace[] = []

            // Remove legacy non-user-scoped cache to prevent cross-user data leaking
            try { localStorage.removeItem('illumi_workspaces_cache') } catch { /* ignore */ }

            // Detect user switch: if a different user was previously active, clear stale data
            try {
                const prevUserId = localStorage.getItem('illumi_active_user_id')
                if (prevUserId && prevUserId !== user.id) {
                    // Different user — purge all workspace/settings data from previous user
                    localStorage.removeItem('activeWorkspaceId')
                    localStorage.removeItem(CACHE_KEY)
                    const keysToRemove: string[] = []
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i)
                        if (key && (
                            key.startsWith('illumi_workspaces_cache') ||
                            key.startsWith('illumi_settings') ||
                            key.startsWith('illumi_sub_') ||
                            key === 'illumi_billing'
                        )) {
                            keysToRemove.push(key)
                        }
                    }
                    keysToRemove.forEach(k => localStorage.removeItem(k))
                }
                localStorage.setItem('illumi_active_user_id', user.id)
            } catch { /* ignore */ }

            if (!forceRefresh) {
                try {
                    const cached = localStorage.getItem(CACHE_KEY)
                    if (cached) {
                        const { workspaces: cachedWs, timestamp } = JSON.parse(cached)
                        if (Date.now() - timestamp < CACHE_TTL && Array.isArray(cachedWs) && cachedWs.length > 0) {
                            deduped = cachedWs
                        }
                    }
                } catch {
                    // ignore cache errors
                }
            }

            // Fetch workspaces via server API to avoid RLS issues on workspace_members
            // that can cause invited workspaces not to appear immediately after accepting an invite.
            if (deduped.length === 0) {
                try {
                    if (perfEnabled) console.time('workspace:fetch:/api/workspaces')
                    const res = await fetch('/api/workspaces', { credentials: 'include' })
                    const json = await res.json().catch(() => null)
                    if (perfEnabled) console.timeEnd('workspace:fetch:/api/workspaces')
                    if (res.ok && json?.success && Array.isArray(json?.workspaces)) {
                        deduped = json.workspaces as Workspace[]
                        // Cache the result
                        try {
                            localStorage.setItem(CACHE_KEY, JSON.stringify({ workspaces: deduped, timestamp: Date.now() }))
                        } catch {
                            // ignore
                        }
                    } else {
                        deduped = []
                    }
                } catch {
                    deduped = []
                }
            }

            // Fallback to previous client-side behavior if API returns nothing
            if (deduped.length === 0) {
                if (perfEnabled) console.time('workspace:fallback:supabase.workspaces')
                const { data: ownedWorkspaces } = await supabase
                    .from('workspaces')
                    .select('id, name, slug, owner_id, logo_url, created_at')
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: true })

                if (perfEnabled) console.timeEnd('workspace:fallback:supabase.workspaces')

                let memberWorkspaceIds: string[] = []
                try {
                    if (perfEnabled) console.time('workspace:fallback:supabase.workspace_members')
                    const { data: memberRows } = await supabase
                        .from('workspace_members')
                        .select('workspace_id, status')
                        .eq('email', user.email || '')

                    if (perfEnabled) console.timeEnd('workspace:fallback:supabase.workspace_members')

                    memberWorkspaceIds = (memberRows || [])
                        .filter((r: any) => Boolean(r.workspace_id) && (r.status || '').toString().toLowerCase() === 'active')
                        .map((r: any) => r.workspace_id)
                } catch (e) {
                    memberWorkspaceIds = []
                }

                const { data: memberWorkspaces } = memberWorkspaceIds.length
                    ? await supabase
                        .from('workspaces')
                        .select('id, name, slug, owner_id, logo_url, created_at')
                        .in('id', memberWorkspaceIds)
                    : { data: [] as Workspace[] }

                const combined = [...(ownedWorkspaces || []), ...(memberWorkspaces || [])]
                deduped = Array.from(new Map(combined.map(w => [w.id, w])).values())
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            }

            // If user has no workspaces, create a default one based on their email
            if (deduped.length === 0 && user.email) {
                try {
                    const emailName = user.email.split('@')[0] || 'user'
                    const prefix = emailName.substring(0, 2).toUpperCase()
                    const defaultName = `${prefix}'s Workspace`
                    
                    const res = await fetch('/api/workspaces', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            name: defaultName,
                            slug: emailName.toLowerCase().replace(/[^a-z0-9]/g, ''),
                        }),
                    })
                    const json = await res.json().catch(() => null)
                    if (res.ok && json?.success && json?.workspace) {
                        deduped = [json.workspace]
                        // Update cache with new workspace
                        try {
                            localStorage.setItem(CACHE_KEY, JSON.stringify({ workspaces: deduped, timestamp: Date.now() }))
                        } catch {
                            // ignore
                        }
                    }
                } catch (e) {
                    console.error('Failed to create default workspace:', e)
                }
            }

            setWorkspaces(deduped)

            if (deduped.length > 0) {
                // Try to restore from localStorage
                const savedWorkspaceId = localStorage.getItem('activeWorkspaceId')
                const savedWorkspace = savedWorkspaceId
                    ? deduped.find(w => w.id === savedWorkspaceId)
                    : null

                if (savedWorkspace) {
                    // Saved workspace belongs to this user — restore it
                    setActiveWorkspaceState(savedWorkspace)
                } else {
                    // Saved workspace doesn't belong to this user or doesn't exist — clear it and use first
                    if (savedWorkspaceId) {
                        try { localStorage.removeItem('activeWorkspaceId') } catch { /* ignore */ }
                    }
                    setActiveWorkspaceState(deduped[0])
                    try { localStorage.setItem('activeWorkspaceId', deduped[0].id) } catch { /* ignore */ }
                }
            } else {
                localStorage.removeItem('activeWorkspaceId')
                setActiveWorkspaceState(null)
            }
        } catch (error) {
            console.error('Error loading workspaces:', error)
        } finally {
            setIsLoading(false)
            if (perfEnabled) console.timeEnd('workspace:refreshWorkspaces')
        }
    }, [supabase])

    useEffect(() => {
        // Enforce a 7-day max "stay signed in" window.
        const enforceMaxSessionAge = async () => {
            let perfEnabled = false
            try {
                perfEnabled = localStorage.getItem('illumi_perf') === '1'
            } catch {
                perfEnabled = false
            }
            try {
                if (perfEnabled) console.time('workspace:enforceMaxSessionAge')
                const { data: sessionData } = await supabase.auth.getSession()
                const user = sessionData?.session?.user || null
                if (!user) return

                const existing = localStorage.getItem(SIGNED_IN_AT_KEY)
                const signedInAt = existing ? Number(existing) : NaN

                // If we have a valid session but no timestamp yet (existing users), set it now.
                if (!existing || Number.isNaN(signedInAt)) {
                    localStorage.setItem(SIGNED_IN_AT_KEY, String(Date.now()))
                    return
                }

                if (Date.now() - signedInAt > MAX_SESSION_AGE_MS) {
                    await supabase.auth.signOut()
                    localStorage.removeItem(SIGNED_IN_AT_KEY)
                    localStorage.removeItem('activeWorkspaceId')
                    window.location.assign('/login')
                }
            } catch {
                // ignore
            } finally {
                if (perfEnabled) console.timeEnd('workspace:enforceMaxSessionAge')
            }
        }

        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                try {
                    localStorage.setItem(SIGNED_IN_AT_KEY, String(Date.now()))
                } catch {
                    // ignore
                }
                // Clear all React Query caches to prevent stale data from previous user
                queryClient.removeQueries()
                // Force refresh workspaces for the new user
                refreshWorkspaces(true)
            }
            if (event === 'SIGNED_OUT') {
                try {
                    localStorage.removeItem(SIGNED_IN_AT_KEY)
                    localStorage.removeItem('activeWorkspaceId')
                    // Clear all workspace caches to prevent cross-user data leaking
                    const keysToRemove: string[] = []
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i)
                        if (key && (
                            key.startsWith('illumi_workspaces_cache') ||
                            key.startsWith('illumi_settings') ||
                            key.startsWith('illumi_sub_') ||
                            key === 'illumi_billing'
                        )) {
                            keysToRemove.push(key)
                        }
                    }
                    keysToRemove.forEach(k => localStorage.removeItem(k))
                } catch {
                    // ignore
                }
                // Reset in-memory state immediately
                setWorkspaces([])
                setActiveWorkspaceState(null)
                setUserId(null)
                setUserEmail(null)
            }
        })

        enforceMaxSessionAge()

        // Check occasionally while the app is open too.
        const interval = window.setInterval(enforceMaxSessionAge, 5 * 60 * 1000)

        return () => {
            try {
                sub?.subscription?.unsubscribe()
            } catch {
                // ignore
            }
            window.clearInterval(interval)
        }
    }, [supabase])

    useEffect(() => {
        refreshWorkspaces()
    }, [refreshWorkspaces])

    // Disabled realtime subscription to reduce Supabase egress costs
    // Workspace membership changes are rare - users can refresh manually or we poll less frequently
    // useEffect(() => {
    //     if (!userEmail) return
    //     const channel = supabase
    //         .channel(`workspace-membership:${userEmail}`)
    //         .on('postgres_changes', { event: '*', schema: 'public', table: 'workspace_members', filter: `email=eq.${userEmail}` },
    //             async () => { await refreshWorkspaces() }
    //         ).subscribe()
    //     return () => { try { supabase.removeChannel(channel) } catch {} }
    // }, [refreshWorkspaces, supabase, userEmail])

    const setActiveWorkspace = useCallback((workspace: Workspace) => {
        setActiveWorkspaceState(workspace)
        localStorage.setItem('activeWorkspaceId', workspace.id)
        // Clear all React Query data when switching workspaces to prevent
        // stale data from another workspace showing up
        queryClient.removeQueries()
    }, [queryClient])

    return (
        <WorkspaceContext.Provider value={{
            workspaces,
            activeWorkspace,
            setActiveWorkspace,
            isLoading,
            refreshWorkspaces,
            isOwner,
            userId,
            userEmail,
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}
