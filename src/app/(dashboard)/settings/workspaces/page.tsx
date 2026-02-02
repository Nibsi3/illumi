"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Trash2, Loader2, Building2, Check, Pencil, Users } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useSubscription } from "@/lib/subscription/hooks"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useWorkspace } from "@/lib/workspace-context"

export default function WorkspacesPage() {
    const { isPro } = useSubscription()
    const { workspaces, activeWorkspace, setActiveWorkspace, refreshWorkspaces, userId } = useWorkspace()
    const supabase = createClient()

    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [newWorkspaceName, setNewWorkspaceName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const [showRenameDialog, setShowRenameDialog] = useState(false)
    const [renameWorkspaceId, setRenameWorkspaceId] = useState<string | null>(null)
    const [renameWorkspaceName, setRenameWorkspaceName] = useState("")
    const [isRenaming, setIsRenaming] = useState(false)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string | null>(null)
    const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    // Free users limited to 1 workspace, Pro users unlimited
    const maxWorkspaces = isPro ? Infinity : 1
    const reachedLimit = workspaces.length >= maxWorkspaces

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) {
            toast.error("Please enter a workspace name")
            return
        }

        setIsCreating(true)
        try {
            const res = await fetch('/api/workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newWorkspaceName.trim() }),
                credentials: 'include',
            })

            const json = await res.json()

            if (!res.ok || !json.success) {
                throw new Error(json.error || 'Failed to create workspace')
            }

            toast.success("Workspace created", { description: `"${newWorkspaceName.trim()}" has been created.` })
            setNewWorkspaceName("")
            setShowCreateDialog(false)
            await refreshWorkspaces(true)

            // Switch to the new workspace
            if (json.workspace) {
                setActiveWorkspace(json.workspace)
            }
        } catch (err: any) {
            toast.error("Failed to create workspace", { description: err.message })
        } finally {
            setIsCreating(false)
        }
    }

    const handleRenameWorkspace = async () => {
        if (!renameWorkspaceId || !renameWorkspaceName.trim()) {
            toast.error("Please enter a workspace name")
            return
        }

        setIsRenaming(true)
        try {
            const { error } = await supabase
                .from('workspaces')
                .update({ name: renameWorkspaceName.trim() })
                .eq('id', renameWorkspaceId)

            if (error) throw error

            toast.success("Workspace renamed", { description: `Workspace has been renamed to "${renameWorkspaceName.trim()}".` })
            setRenameWorkspaceName("")
            setRenameWorkspaceId(null)
            setShowRenameDialog(false)
            await refreshWorkspaces(true)
        } catch (err: any) {
            toast.error("Failed to rename workspace", { description: err.message })
        } finally {
            setIsRenaming(false)
        }
    }

    const handleDeleteWorkspace = async () => {
        if (!deleteWorkspaceId) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('workspaces')
                .delete()
                .eq('id', deleteWorkspaceId)

            if (error) throw error

            toast.success("Workspace deleted", { description: `"${deleteWorkspaceName}" has been deleted.` })
            setDeleteWorkspaceId(null)
            setDeleteWorkspaceName("")
            setShowDeleteDialog(false)
            await refreshWorkspaces(true)
        } catch (err: any) {
            toast.error("Failed to delete workspace", { description: err.message })
        } finally {
            setIsDeleting(false)
        }
    }

    const openRenameDialog = (workspace: { id: string; name: string }) => {
        setRenameWorkspaceId(workspace.id)
        setRenameWorkspaceName(workspace.name)
        setShowRenameDialog(true)
    }

    const openDeleteDialog = (workspace: { id: string; name: string }) => {
        setDeleteWorkspaceId(workspace.id)
        setDeleteWorkspaceName(workspace.name)
        setShowDeleteDialog(true)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Workspaces</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your workspaces and switch between them.
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    disabled={reachedLimit && !isPro}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New Workspace
                </Button>
            </div>

            {/* Workspace limit warning */}
            {reachedLimit && !isPro && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Workspace limit reached</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Free accounts are limited to 1 workspace.{" "}
                                <Link href="/upgrade" className="text-primary hover:underline">
                                    Upgrade to Pro
                                </Link>{" "}
                                for unlimited workspaces.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Workspaces list */}
            <div className="space-y-3">
                {workspaces.map((workspace) => {
                    const isActive = activeWorkspace?.id === workspace.id
                    const isWorkspaceOwner = workspace.owner_id === userId

                    return (
                        <div
                            key={workspace.id}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-lg border transition-colors",
                                isActive
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card hover:border-primary/30"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center text-lg font-bold",
                                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}>
                                    {workspace.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground">{workspace.name}</span>
                                        {isActive && (
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                                Active
                                            </span>
                                        )}
                                        {isWorkspaceOwner && (
                                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                                Owner
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Created {new Date(workspace.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!isActive && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setActiveWorkspace(workspace)}
                                        className="gap-2"
                                    >
                                        <Check className="h-4 w-4" />
                                        Switch
                                    </Button>
                                )}

                                <Link href="/settings/members">
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <Users className="h-4 w-4" />
                                        Members
                                    </Button>
                                </Link>

                                {isWorkspaceOwner && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openRenameDialog(workspace)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => openDeleteDialog(workspace)}
                                                className="text-destructive focus:text-destructive"
                                                disabled={workspaces.length <= 1}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Create Workspace Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Workspace</DialogTitle>
                        <DialogDescription>
                            Create a new workspace to organize your invoices and clients separately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="Workspace name"
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateWorkspace} disabled={isCreating}>
                            {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create Workspace
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rename Workspace Dialog */}
            <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Workspace</DialogTitle>
                        <DialogDescription>
                            Enter a new name for this workspace.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="Workspace name"
                            value={renameWorkspaceName}
                            onChange={(e) => setRenameWorkspaceName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameWorkspace()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRenameWorkspace} disabled={isRenaming}>
                            {isRenaming && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Rename
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Workspace Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Workspace</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleteWorkspaceName}"? This action cannot be undone.
                            All invoices, clients, and data in this workspace will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteWorkspace} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Delete Workspace
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
