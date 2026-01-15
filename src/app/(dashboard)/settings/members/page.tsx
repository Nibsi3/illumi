"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Mail, UserPlus } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    {
        id: "3",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Member",
        avatar: null,
        status: "active",
    },
]

export default function MembersPage() {
    const [members, setMembers] = useState(mockMembers)
    const [showInviteForm, setShowInviteForm] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")

    const handleInvite = () => {
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

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-medium mb-1">Members</h1>
                    <p className="text-muted-foreground">Manage team members and their access to your workspace.</p>
                </div>
                <Button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="bg-white text-black hover:bg-neutral-200 h-11 px-6 font-semibold rounded-lg"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite member
                </Button>
            </div>

            {/* Invite Form */}
            {showInviteForm && (
                <div className="mb-6 p-6 border border-white/5 rounded-xl bg-[#09090b]">
                    <div className="flex items-center gap-4">
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="bg-black border-white/5 h-11"
                        />
                        <Button
                            onClick={handleInvite}
                            className="bg-white text-black hover:bg-neutral-200 h-11 px-6"
                        >
                            Send invite
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowInviteForm(false)
                                setInviteEmail("")
                            }}
                            className="h-11"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="space-y-2">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="p-4 rounded-lg border border-white/5 bg-[#09090b] hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border border-white/10">
                                <AvatarImage src={member.avatar || undefined} />
                                <AvatarFallback className="bg-neutral-800 text-white text-sm">
                                    {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium text-white">{member.name}</h3>
                                    {member.status === "pending" && (
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 uppercase tracking-wider">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-500">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-neutral-400">{member.role}</span>
                            {member.role !== "Owner" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-[#09090b] border-white/10 text-white rounded-lg">
                                        <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer">
                                            Change role
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/5" />
                                        <DropdownMenuItem
                                            onClick={() => removeMember(member.id)}
                                            className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer"
                                        >
                                            Remove member
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

