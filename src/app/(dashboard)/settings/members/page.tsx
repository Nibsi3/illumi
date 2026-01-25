"use client"

import { StatusDot } from "@/components/status-dot"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Mail, UserPlus, Shield, ShieldCheck, User as UserIcon, AlertCircle, Sparkles, Trash2, Loader2, Users } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSubscription } from "@/lib/subscription/hooks"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useWorkspace } from "@/lib/workspace-context"

type MemberRow = {
    id: string
    name: string
    email: string
    role: "Owner" | "Admin" | "Member"
    avatar: string | null
    status: "active" | "pending"
}

export default function MembersPage() {
    const { isPro, limits, isOwner } = useSubscription()
    const { activeWorkspace } = useWorkspace()
    const [members, setMembers] = useState<MemberRow[]>([])
    const [isLoadingMembers, setIsLoadingMembers] = useState(true)
    const [showInviteForm, setShowInviteForm] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [isInviting, setIsInviting] = useState(false)
    const supabase = createClient()

    const reachedLimit = members.length >= limits.maxUsers

    const activeWorkspaceId = activeWorkspace?.id

    useEffect(() => {
        const fetchMembers = async () => {
            if (!activeWorkspaceId) {
                setMembers([])
                setIsLoadingMembers(false)
                return
            }

            setIsLoadingMembers(true)
            try {
                const { data, error } = await supabase
                    .from('workspace_members')
                    .select('id, email, role, status')
                    .eq('workspace_id', activeWorkspaceId)

                if (error) throw error

                const rows = (data || []).map((m: any) => {
                    const email = (m.email || '').trim()
                    const name = email ? email.split('@')[0] : 'Member'
                    const normalizedRole = (m.role || 'member').toString().toLowerCase()
                    const role: MemberRow['role'] = normalizedRole === 'owner'
                        ? 'Owner'
                        : normalizedRole === 'admin'
                            ? 'Admin'
                            : 'Member'
                    const status: MemberRow['status'] = (m.status || 'pending').toString().toLowerCase() === 'active' ? 'active' : 'pending'

                    return {
                        id: m.id,
                        name,
                        email,
                        role,
                        avatar: null,
                        status,
                    }
                })

                setMembers(rows)
            } catch (err: any) {
                console.error('Failed to load members:', {
                    message: err?.message,
                    details: err?.details,
                    hint: err?.hint,
                    code: err?.code,
                })
                toast.error('Failed to load members', { description: err?.message || 'Please try again.' })
            } finally {
                setIsLoadingMembers(false)
            }
        }

        fetchMembers()
    }, [activeWorkspaceId, supabase])

    const handleInvite = async () => {
        if (!isOwner) {
            toast.error('Only workspace owners can invite members')
            return
        }
        if (reachedLimit) return
        if (!inviteEmail) return

        if (!activeWorkspaceId) {
            toast.error('No workspace selected')
            return
        }

        const normalizedInviteEmail = inviteEmail.toLowerCase().trim()
        if (!normalizedInviteEmail) return

        setIsInviting(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            // Save to workspace_members
            let memberRowId: string | null = null
            const { data: insertedMember, error: memberError } = await supabase
                .from('workspace_members')
                .insert([{
                    workspace_id: activeWorkspaceId,
                    email: normalizedInviteEmail,
                    role: 'member',
                    status: 'pending'
                }])
                .select('id')
                .single()

            if (memberError) {
                const msg = (memberError.message || '').toLowerCase()
                const isDuplicate = msg.includes('duplicate') || msg.includes('unique')
                if (!isDuplicate) throw memberError

                const { data: existing } = await supabase
                    .from('workspace_members')
                    .select('id')
                    .eq('workspace_id', activeWorkspaceId)
                    .eq('email', normalizedInviteEmail)
                    .maybeSingle()
                memberRowId = existing?.id || null
            } else {
                memberRowId = insertedMember?.id || null
            }

            if (!memberRowId) {
                throw new Error('Failed to create invite. Please try again.')
            }

            // Send invite email via Resend
            const invitePath = `/invite/${memberRowId}`
            const emailResponse = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'invite',
                    to: normalizedInviteEmail,
                    inviterName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'A team member',
                    workspaceName: activeWorkspace?.name || 'Illumi',
                    inviteLink: `${window.location.origin}${invitePath}`
                })
            })

            if (!emailResponse.ok) {
                console.warn("Email sending may have failed")
            }

            const newRow: MemberRow = {
                id: memberRowId,
                name: normalizedInviteEmail.split("@")[0],
                email: normalizedInviteEmail,
                role: "Member",
                avatar: null,
                status: "pending",
            }
            setMembers(prev => {
                const exists = prev.some(m => m.email.toLowerCase() === normalizedInviteEmail)
                return exists ? prev : [...prev, newRow]
            })

            toast.success("Invitation sent", {
                description: `An invite has been sent to ${normalizedInviteEmail}`
            })

            setInviteEmail("")
            setShowInviteForm(false)
        } catch (error: any) {
            toast.error("Failed to send invitation", {
                description: error.message
            })
        } finally {
            setIsInviting(false)
        }
    }

    const removeMember = async (id: string) => {
        if (!isOwner) {
            toast.error('Only workspace owners can remove members')
            return
        }
        if (!activeWorkspaceId) return
        try {
            const { error } = await supabase
                .from('workspace_members')
                .delete()
                .eq('id', id)
                .eq('workspace_id', activeWorkspaceId)

            if (error) throw error
            setMembers(prev => prev.filter(m => m.id !== id))
            toast.success('Member removed')
        } catch (err: any) {
            toast.error('Failed to remove member', { description: err.message })
        }
    }

    const changeRole = async (id: string, newRole: string) => {
        if (!isOwner) {
            toast.error('Only workspace owners can change roles')
            return
        }
        if (!activeWorkspaceId) return
        if (!isPro && newRole === "Admin") return
        const dbRole = newRole.toLowerCase()
        try {
            const { error } = await supabase
                .from('workspace_members')
                .update({ role: dbRole })
                .eq('id', id)
                .eq('workspace_id', activeWorkspaceId)

            if (error) throw error

            setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole as any } : m))
            toast.success('Role updated')
        } catch (err: any) {
            toast.error('Failed to update role', { description: err.message })
        }
    }

    return (
        <div className="pb-32">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-1">Members</h1>
                    <p className="hidden sm:block text-muted-foreground">Manage team members and their access to your workspace.</p>
                </div>
                {isOwner ? (
                    !reachedLimit ? (
                        <Button
                            onClick={() => setShowInviteForm(!showInviteForm)}
                            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-semibold rounded-lg"
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite member
                        </Button>
                    ) : (
                        <Link href="/settings/billing">
                            <Button
                                className="w-full sm:w-auto bg-white text-foreground hover:bg-white/90 h-11 px-6 font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Upgrade to Invite
                            </Button>
                        </Link>
                    )
                ) : null}
            </div>

            {/* Non-owner info banner */}
            {!isOwner && (
                <div className="mb-8 p-6 bg-muted border border-border rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">View Only</p>
                        <p className="text-sm text-muted-foreground">Only workspace owners can manage team members.</p>
                    </div>
                </div>
            )}

            {/* Limit Warning Banner */}
            {isOwner && !isPro && reachedLimit && (
                <div className="mb-8 p-6 bg-muted border border-border rounded-2xl flex items-center justify-between group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="h-12 w-12 text-foreground" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground uppercase tracking-widest mb-1">Reached Member Limit</p>
                            <p className="text-sm text-muted-foreground">You're currently using {members.length}/{limits.maxUsers} member seats. Upgrade to Pro for up to 10 members.</p>
                        </div>
                    </div>
                    <Link href="/settings/billing">
                        <Button variant="outline" className="border-border bg-accent text-foreground hover:bg-white hover:text-foreground transition-all font-bold uppercase tracking-tighter text-xs h-10 px-6">
                            View Plans
                        </Button>
                    </Link>
                </div>
            )}

            {/* Invite Form */}
            {isOwner && showInviteForm && !reachedLimit && (
                <div className="mb-8 p-8 border border-border rounded-2xl bg-card shadow-2xl">
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Invite via Email</label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Input
                                type="email"
                                placeholder="colleague@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="bg-background border-border h-12 text-lg focus-visible:ring-white/20 px-4"
                            />
                            <Button
                                onClick={handleInvite}
                                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-black uppercase tracking-tighter text-xs"
                            >
                                Send Invite
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowInviteForm(false)
                                    setInviteEmail("")
                                }}
                                className="w-full sm:w-auto h-12 px-6 text-muted-foreground hover:text-foreground transition-colors font-bold uppercase tracking-tighter text-xs"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="space-y-4">
                <div className="px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Member</span>
                    <span>Role & Actions</span>
                </div>
                {isLoadingMembers && (
                    <div className="p-6 rounded-2xl border border-border bg-card flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs">Loading members...</span>
                    </div>
                )}
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-12 w-12 border border-border shadow-xl">
                                    <AvatarImage src={member.avatar || undefined} />
                                    <AvatarFallback className="bg-neutral-900 text-foreground text-xs font-bold">
                                        {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {member.status === "active" && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border-2 border-[#09090b] flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-foreground">{member.name}</h3>
                                    <StatusDot
                                        variant={member.status === "active" ? "success" : "warning"}
                                        className="scale-90"
                                    >
                                        {member.status === "active" ? "Active" : "Pending"}
                                    </StatusDot>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    {member.role === "Owner" ? (
                                        <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
                                    ) : member.role === "Admin" ? (
                                        <Shield className="h-3.5 w-3.5 text-blue-500" />
                                    ) : (
                                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-tighter",
                                        member.role === "Owner" ? "text-foreground" :
                                            member.role === "Admin" ? "text-blue-500" : "text-muted-foreground"
                                    )}>{member.role}</span>
                                </div>
                            </div>

                            {isOwner && member.role !== "Owner" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-card border-border text-foreground rounded-xl shadow-2xl p-2">
                                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">Change Role</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => changeRole(member.id, "Admin")}
                                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs font-bold"
                                        >
                                            <Shield className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                            Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => changeRole(member.id, "Member")}
                                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs font-bold"
                                        >
                                            <UserIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            Member
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-muted my-2" />
                                        <DropdownMenuItem
                                            onClick={() => removeMember(member.id)}
                                            className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer px-3 py-2 text-xs font-bold"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                                            Remove Member
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

