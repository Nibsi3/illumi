"use client";

import React, { useState, useEffect } from "react";
import {
    IconBrandTabler,
    IconSettings,
    IconReceipt,
    IconClock,
    IconUsers,
    IconSearch,
    IconLogout,
    IconUserCircle,
    IconMessageCircle,
    IconUsersGroup,
    IconMoon,
    IconChevronDown,
    IconPlus,
} from "@tabler/icons-react";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";
import { SearchModal } from "@/components/search-modal";
import { useSubscription } from "@/lib/subscription/hooks";

export function AppSidebar({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [showSwitcher, setShowSwitcher] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Use workspace context
    const { workspaces, activeWorkspace, setActiveWorkspace, refreshWorkspaces } = useWorkspace();
    const { isSubscribed, daysRemaining, isPro, isLoading: subscriptionLoading } = useSubscription();

    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newWorkspaceName.trim()) return;

        setIsCreatingWorkspace(true);
        try {
            const { data, error } = await supabase
                .from('workspaces')
                .insert([{
                    name: newWorkspaceName.trim(),
                    owner_id: user.id,
                    slug: newWorkspaceName.toLowerCase().replace(/\s+/g, '-')
                }])
                .select()
                .single();

            if (error) throw error;

            // Refresh workspaces from context
            await refreshWorkspaces();
            setActiveWorkspace(data);
            toast.success("Workspace Created", { description: `${newWorkspaceName} is ready.` });
            setIsWorkspaceDialogOpen(false);
            setNewWorkspaceName("");
        } catch (error: any) {
            toast.error("Failed to create workspace", { description: error.message });
        } finally {
            setIsCreatingWorkspace(false);
        }
    };

    const links = [
        {
            label: "Overview",
            href: "/overview",
            icon: <IconBrandTabler className="h-5 w-5 shrink-0" rotate={-45} />,
        },
        {
            label: "Invoices",
            href: "/invoices",
            icon: <IconReceipt className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Customers",
            href: "/clients",
            icon: <IconUsers className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Products",
            href: "/products",
            icon: <IconBrandTabler className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: <IconSettings className="h-5 w-5 shrink-0" />,
        },
    ];


    const userEmail = user?.email || "cameronfalck03@gmail.com";
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split("@")[0];
    const userImage = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const initials = userName.substring(0, 2).toUpperCase();

    return (
        <div className="flex flex-col h-screen bg-black text-white selection:bg-white/10 overflow-hidden relative font-sans">
            {/* Global Top Header Line */}
            <div className="h-px w-full bg-white/10 shrink-0" />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar rewritten from scratch with hover logic */}
                <motion.aside
                    initial={false}
                    animate={{ width: open ? 260 : 72 }}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => {
                        setOpen(false);
                        setShowSwitcher(false);
                    }}
                    className="h-full bg-black border-r border-white/10 flex flex-col z-50 transition-colors duration-300 absolute left-0 top-0 shadow-2xl"
                >
                    {/* Logo Section - Centered and Icon only */}
                    <div className="h-20 w-[72px] flex items-center justify-center shrink-0 relative overflow-hidden">
                        <Link href="/overview" className="flex items-center justify-center w-full">
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pt-2">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center px-3 py-2.5 transition-all duration-200 group relative",
                                        isActive ? "text-white" : "text-neutral-500 hover:text-white",
                                        isActive && "bg-white/5"
                                    )}
                                >
                                    <div className={cn(
                                        "w-11 h-6 flex items-center justify-center shrink-0 transition-colors duration-200",
                                        isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
                                    )}>
                                        {link.icon}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <AnimatePresence initial={false}>
                                            {open && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-sm font-medium whitespace-nowrap ml-4"
                                                >
                                                    {link.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-[2.5px] h-6 bg-white rounded-r-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section: Organization Switcher */}
                    <div className="pb-6 w-full">
                        <div className="relative px-3">
                            <AnimatePresence>
                                {showSwitcher && open && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-3 right-3 mb-2 p-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl space-y-1 z-[60] max-h-64 overflow-y-auto"
                                    >
                                        {workspaces.map((ws) => (
                                            <div
                                                key={ws.id}
                                                onClick={() => {
                                                    setActiveWorkspace(ws)
                                                    // Store in localStorage for persistence
                                                    localStorage.setItem('activeWorkspaceId', ws.id)
                                                    setShowSwitcher(false)
                                                    // Navigate to overview on workspace switch
                                                    router.push('/overview')
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors",
                                                    activeWorkspace?.id === ws.id && "bg-white/5"
                                                )}
                                            >
                                                <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center text-[10px] font-bold">
                                                    {ws.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-medium">{ws.name}</span>
                                            </div>
                                        ))}

                                        {workspaces.length === 0 && (
                                            <div className="p-3 text-xs text-neutral-500 text-center">No workspaces yet</div>
                                        )}
                                        <DropdownMenuSeparator className="bg-white/5" />
                                        <Button
                                            onClick={() => setIsWorkspaceDialogOpen(true)}
                                            variant="ghost"
                                            className="w-full justify-start h-10 px-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white text-xs gap-3"
                                        >
                                            <IconPlus className="h-4 w-4" />
                                            <span>Add workspace</span>
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div
                                onClick={() => open && setShowSwitcher(!showSwitcher)}
                                className={cn(
                                    "flex items-center transition-all duration-200 cursor-pointer h-14 w-full px-4 group justify-center",
                                    showSwitcher ? "text-white" : "text-neutral-500 hover:text-white"
                                )}
                            >
                                <div className="flex items-center justify-center shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 uppercase group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                                        {activeWorkspace?.name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'WS'}
                                    </div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <AnimatePresence initial={false}>
                                        {open && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="flex flex-col flex-1 overflow-hidden ml-4"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">{activeWorkspace?.name || 'Select Workspace'}</span>
                                                    <IconChevronDown className={cn("h-3 w-3 text-neutral-500 transition-transform", showSwitcher && "rotate-180")} />
                                                </div>
                                                <span className="text-[10px] text-neutral-500 font-sans">Pro Plan</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Content Spacer for Overlay Sidebar */}
                <div className="w-[72px] shrink-0" />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-black relative">
                    {/* Header (Stayed relatively similar but polished) */}
                    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-md bg-black/50 sticky top-0 z-40">
                        <div className="flex items-center gap-6 flex-1">
                            <button 
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center gap-3 text-neutral-500 hover:text-white transition-colors cursor-pointer max-w-md w-full bg-transparent border-0 outline-none"
                            >
                                <IconSearch className="h-4 w-4" />
                                <span className="text-sm font-medium">Search anything...</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/settings/billing" className="text-[11px] text-neutral-500 hover:text-white transition-colors">
                                {subscriptionLoading ? (
                                    "Loading..."
                                ) : isSubscribed && daysRemaining !== null ? (
                                    `Pro Plan · ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                                ) : isSubscribed ? (
                                    "Pro Plan · Active"
                                ) : (
                                    "Free Plan · Upgrade"
                                )}
                            </Link>

                            <NotificationDropdown />

                            {/* Interactive User Menu with real image */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="outline-none focus:ring-0">
                                        <Avatar className="h-8 w-8 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                                            <AvatarImage src={userImage} />
                                            <AvatarFallback className="bg-white/5 text-[10px] font-bold text-white border border-white/10">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[240px] bg-black border border-white/10 text-white p-2 shadow-2xl rounded-xl mt-2 animate-in fade-in zoom-in-95">
                                    <DropdownMenuLabel className="px-3 pt-3 pb-3">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold truncate">{userName}</p>
                                            <p className="text-[10px] text-neutral-500 truncate">{userEmail}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10 mx-2" />
                                    <div className="py-1">
                                        <Link href="/settings/account">
                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
                                                <IconUserCircle className="h-4 w-4 text-neutral-400" />
                                                <span className="text-xs">Account Settings</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/settings/support">
                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
                                                <IconMessageCircle className="h-4 w-4 text-neutral-400" />
                                                <span className="text-xs">Support</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/settings/members">
                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
                                                <IconUsersGroup className="h-4 w-4 text-neutral-400" />
                                                <span className="text-xs">Manage Team</span>
                                            </DropdownMenuItem>
                                        </Link>
                                    </div>
                                    <DropdownMenuSeparator className="bg-white/10 mx-2" />
                                    <div className="py-1">
                                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                                            <div className="flex items-center gap-3">
                                                <IconMoon className="h-4 w-4 text-neutral-400" />
                                                <span>Display</span>
                                            </div>
                                            <span className="text-[10px] text-neutral-500">Dark</span>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator className="bg-white/10 mx-2" />
                                    <div className="py-1">
                                        <DropdownMenuItem onClick={handleSignOut} className="focus:bg-red-500/10 focus:text-red-500 text-neutral-400 cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
                                            <IconLogout className="h-4 w-4" />
                                            <span className="text-xs">Sign out</span>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Dashboard content */}
                    <main className={cn(
                        "flex-1 w-full",
                        pathname === '/invoices/new' ? "overflow-hidden" : "overflow-y-auto no-scrollbar"
                    )}>
                        <div className={cn(
                            "h-full",
                            pathname === '/invoices/new' ? "p-0" : "p-6 md:p-10"
                        )}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Workspace Creation Dialog */}
            <Dialog open={isWorkspaceDialogOpen} onOpenChange={setIsWorkspaceDialogOpen}>
                <DialogContent className="bg-[#09090b] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            Create a new workspace to organize your team and projects.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateWorkspace} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Workspace Name</Label>
                            <Input
                                value={newWorkspaceName}
                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                placeholder="My New Workspace"
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsWorkspaceDialogOpen(false)} className="hover:bg-white/5">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreatingWorkspace} className="bg-white text-black hover:bg-neutral-200">
                                {isCreatingWorkspace && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Create Workspace
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Search Modal */}
            <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </div>
    );
}
