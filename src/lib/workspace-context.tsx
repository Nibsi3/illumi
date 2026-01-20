"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Workspace {
    id: string
    name: string
    slug: string
    owner_id: string
    created_at: string
}

interface WorkspaceContextType {
    workspaces: Workspace[]
    activeWorkspace: Workspace | null
    setActiveWorkspace: (workspace: Workspace) => void
    isLoading: boolean
    refreshWorkspaces: () => Promise<void>
    isOwner: boolean
    userId: string | null
}

const WorkspaceContext = createContext<WorkspaceContextType>({
    workspaces: [],
    activeWorkspace: null,
    setActiveWorkspace: () => { },
    isLoading: true,
    refreshWorkspaces: async () => { },
    isOwner: false,
    userId: null,
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

    const isOwner = Boolean(activeWorkspace && userId && activeWorkspace.owner_id === userId)

    const refreshWorkspaces = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsLoading(false)
                setUserEmail(null)
                setUserId(null)
                return
            }

            setUserId(user.id)
            setUserEmail((user.email || '').toLowerCase().trim() || null)

            // Fetch workspaces via server API to avoid RLS issues on workspace_members
            // that can cause invited workspaces not to appear immediately after accepting an invite.
            let deduped: Workspace[] = []
            try {
                const res = await fetch('/api/workspaces', { credentials: 'include' })
                const json = await res.json().catch(() => null)
                if (res.ok && json?.success && Array.isArray(json?.workspaces)) {
                    deduped = json.workspaces as Workspace[]
                } else {
                    deduped = []
                }
            } catch {
                deduped = []
            }

            // Fallback to previous client-side behavior if API returns nothing
            if (deduped.length === 0) {
                const { data: ownedWorkspaces } = await supabase
                    .from('workspaces')
                    .select('*')
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: true })

                let memberWorkspaceIds: string[] = []
                try {
                    const { data: memberRows } = await supabase
                        .from('workspace_members')
                        .select('workspace_id, status')
                        .eq('email', user.email || '')

                    memberWorkspaceIds = (memberRows || [])
                        .filter((r: any) => Boolean(r.workspace_id) && (r.status || '').toString().toLowerCase() === 'active')
                        .map((r: any) => r.workspace_id)
                } catch (e) {
                    memberWorkspaceIds = []
                }

                const { data: memberWorkspaces } = memberWorkspaceIds.length
                    ? await supabase
                        .from('workspaces')
                        .select('*')
                        .in('id', memberWorkspaceIds)
                    : { data: [] as Workspace[] }

                const combined = [...(ownedWorkspaces || []), ...(memberWorkspaces || [])]
                deduped = Array.from(new Map(combined.map(w => [w.id, w])).values())
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            }

            setWorkspaces(deduped)

            if (deduped.length > 0) {
                // Try to restore from localStorage
                const savedWorkspaceId = localStorage.getItem('activeWorkspaceId')
                const savedWorkspace = savedWorkspaceId
                    ? deduped.find(w => w.id === savedWorkspaceId)
                    : null

                if (!savedWorkspaceId || savedWorkspace) {
                    setActiveWorkspaceState(savedWorkspace || deduped[0])
                } else {
                    // Saved workspace isn't in the current list yet (e.g., invite just accepted and
                    // memberships/workspaces haven't propagated). Keep the saved ID and fall back for now.
                    setActiveWorkspaceState(deduped[0])
                }
            } else {
                localStorage.removeItem('activeWorkspaceId')
                setActiveWorkspaceState(null)
            }
        } catch (error) {
            console.error('Error loading workspaces:', error)
        } finally {
            setIsLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        refreshWorkspaces()
    }, [refreshWorkspaces])

    useEffect(() => {
        if (!userEmail) return

        const channel = supabase
            .channel(`workspace-membership:${userEmail}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'workspace_members',
                    filter: `email=eq.${userEmail}`,
                },
                async () => {
                    // Membership changed (removed/added/activated). Refresh workspace list.
                    await refreshWorkspaces()
                }
            )
            .subscribe()

        return () => {
            try {
                supabase.removeChannel(channel)
            } catch {
                // ignore
            }
        }
    }, [refreshWorkspaces, supabase, userEmail])

    const setActiveWorkspace = useCallback((workspace: Workspace) => {
        setActiveWorkspaceState(workspace)
        localStorage.setItem('activeWorkspaceId', workspace.id)
    }, [])

    return (
        <WorkspaceContext.Provider value={{
            workspaces,
            activeWorkspace,
            setActiveWorkspace,
            isLoading,
            refreshWorkspaces,
            isOwner,
            userId,
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}
