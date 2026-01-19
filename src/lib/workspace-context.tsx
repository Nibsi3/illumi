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
}

const WorkspaceContext = createContext<WorkspaceContextType>({
    workspaces: [],
    activeWorkspace: null,
    setActiveWorkspace: () => { },
    isLoading: true,
    refreshWorkspaces: async () => { },
})

export function useWorkspace() {
    return useContext(WorkspaceContext)
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    const refreshWorkspaces = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsLoading(false)
                return
            }

            const { data: workspaceData } = await supabase
                .from('workspaces')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: true })

            if (workspaceData && workspaceData.length > 0) {
                setWorkspaces(workspaceData)

                // Try to restore from localStorage
                const savedWorkspaceId = localStorage.getItem('activeWorkspaceId')
                const savedWorkspace = savedWorkspaceId
                    ? workspaceData.find(w => w.id === savedWorkspaceId)
                    : null

                setActiveWorkspaceState(savedWorkspace || workspaceData[0])
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
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}
