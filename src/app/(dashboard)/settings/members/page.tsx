"use client"

import { StatusDot } from "@/components/status-dot"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Mail, UserPlus, Shield, ShieldCheck, User as UserIcon, AlertCircle, Sparkles, Trash2 } from "lucide-react"
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

const mockMembers = [
    {
        id: "1",
        name: "Cameron Falck",
        email: "cameronfalck03@gmail.com",
        role: "Owner",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        status: "active",
    },
    {
        id: "2",
        name: "John Doe",
        email: "john@example.com",
        role: "Member",
        avatar: null,
        status: "pending",
    },
]

export default function MembersPage() {
    const { isPro, limits } = useSubscription()
    const [members, setMembers] = useState(mockMembers)
    const [showInviteForm, setShowInviteForm] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")

    const reachedLimit = members.length >= limits.maxUsers

    const handleInvite = () => {
        if (reachedLimit) return

        if (inviteEmail) {
            setMembers([
                ...members,
                {
                    id: Date.now().toString(),
                    name: inviteEmail.split("@")[0],
                    email: inviteEmail,
                    role: "Member",
                    avatar: null,
                    status: "pending",
                },
            ])
            setInviteEmail("")
            setShowInviteForm(false)
        }
    }

    const removeMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id))
    }

    const changeRole = (id: string, newRole: string) => {
        if (!isPro && newRole === "Admin") return // Pro feature?
        setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m))
    }

    return (
        <div className="pb-32">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-medium mb-1">Members</h1>
                    <p className="text-muted-foreground">Manage team members and their access to your workspace.</p>
                </div>
                {!reachedLimit ? (
                    <Button
                        onClick={() => setShowInviteForm(!showInviteForm)}
                        className="bg-white text-black hover:bg-neutral-200 h-11 px-6 font-semibold rounded-lg"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite member
                    </Button>
                ) : (
                    <Link href="/settings/billing">
                        <Button
                            className="bg-white text-white hover:bg-white/90 h-11 px-6 font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Upgrade to Invite
                        </Button>
                    </Link>
                )}
            </div>

            {/* Limit Warning Banner */}
            {!isPro && reachedLimit && (
                <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">Reached Member Limit</p>
                            <p className="text-sm text-neutral-400">You're currently using {members.length}/{limits.maxUsers} member seats. Upgrade to Pro for up to 10 members.</p>
                        </div>
                    </div>
                    <Link href="/settings/billing">
                        <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-white transition-all font-bold uppercase tracking-tighter text-xs h-10 px-6">
                            View Plans
                        </Button>
                    </Link>
                </div>
            )}

            {/* Invite Form */}
            {showInviteForm && !reachedLimit && (
                <div className="mb-8 p-8 border border-white/5 rounded-2xl bg-[#09090b] shadow-2xl">
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#878787]">Invite via Email</label>
                        <div className="flex items-center gap-4">
                            <Input
                                type="email"
                                placeholder="colleague@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="bg-black border-white/10 h-12 text-lg focus-visible:ring-white/20 px-4"
                            />
                            <Button
                                onClick={handleInvite}
                                className="bg-white text-black hover:bg-neutral-200 h-12 px-8 font-black uppercase tracking-tighter text-xs"
                            >
                                Send Invite
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowInviteForm(false)
                                    setInviteEmail("")
                                }}
                                className="h-12 px-6 text-neutral-500 hover:text-white transition-colors font-bold uppercase tracking-tighter text-xs"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="space-y-4">
                <div className="px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#878787]">
                    <span>Member</span>
                    <span>Role & Actions</span>
                </div>
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="p-4 rounded-2xl border border-white/5 bg-[#09090b] hover:bg-white/[0.02] transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-12 w-12 border border-white/10 shadow-xl">
                                    <AvatarImage src={member.avatar || undefined} />
                                    <AvatarFallback className="bg-neutral-900 text-white text-xs font-bold">
                                        {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {member.status === "active" && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border-2 border-[#09090b] flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white">{member.name}</h3>
                                    <StatusDot
                                        variant={member.status === "active" ? "success" : "warning"}
                                        className="scale-90"
                                    >
                                        {member.status === "active" ? "Active" : "Pending"}
                                    </StatusDot>
                                </div>
                                <p className="text-xs text-neutral-500 font-medium">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    {member.role === "Owner" ? (
                                        <ShieldCheck className="h-3.5 w-3.5 text-white" />
                                    ) : member.role === "Admin" ? (
                                        <Shield className="h-3.5 w-3.5 text-blue-500" />
                                    ) : (
                                        <UserIcon className="h-3.5 w-3.5 text-[#878787]" />
                                    )}
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-tighter",
                                        member.role === "Owner" ? "text-white" :
                                            member.role === "Admin" ? "text-blue-500" : "text-neutral-500"
                                    )}>{member.role}</span>
                                </div>
                            </div>

                            {member.role !== "Owner" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-[#09090b] border-white/10 text-white rounded-xl shadow-2xl p-2">
                                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-[#878787] px-3 py-2">Change Role</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => changeRole(member.id, "Admin")}
                                            className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs font-bold"
                                        >
                                            <Shield className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                            Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => changeRole(member.id, "Member")}
                                            className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs font-bold"
                                        >
                                            <UserIcon className="h-3.5 w-3.5 mr-2 text-neutral-500" />
                                            Member
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/5 my-2" />
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
