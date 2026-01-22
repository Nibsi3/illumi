"use client";

import React, { useState, useEffect } from "react";
import {
    IconLayoutDashboard,
    IconPackage,
    IconSettings,
    IconReceipt,
    IconClock,
    IconCash,
    IconUsers,
    IconSearch,
    IconLogout,
    IconUserCircle,
    IconMessageCircle,
    IconUsersGroup,
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
import { useSettings } from "@/lib/settings-context";

export function AppSidebar({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [showSwitcher, setShowSwitcher] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);

    // Use workspace context
    const { workspaces, activeWorkspace, setActiveWorkspace, refreshWorkspaces, isOwner } = useWorkspace();
    const { isSubscribed, daysRemaining, isPro, isLoading: subscriptionLoading } = useSubscription();
    const { logo } = useSettings();

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
        try {
            localStorage.removeItem('illumi_auth_signed_in_at')
        } catch {
            // ignore
        }
        router.push("/");
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
            icon: <IconLayoutDashboard className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Invoices",
            href: "/invoices",
            icon: <IconReceipt className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Expenses",
            href: "/expenses",
            icon: <IconCash className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Clients",
            href: "/clients",
            icon: <IconUsers className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Products",
            href: "/products",
            icon: <IconPackage className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: <IconSettings className="h-5 w-5 shrink-0" />,
        },
    ];


    const userEmail = user?.email || "cameronfalck03@gmail.com";
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split("@")[0];
    const initials = userName.substring(0, 2).toUpperCase();
    const headerLogo = logo || "/logo.png";

    return (
        <div className="flex flex-col h-screen bg-background text-foreground selection:bg-primary/10 overflow-hidden relative font-sans">
            {/* Global Top Header Line */}
            <div className="h-px w-full bg-border shrink-0" />

            <div className="flex flex-1 overflow-hidden relative">
                <div className="pointer-events-none absolute left-0 right-0 top-16 border-b border-border z-70" />
                {/* Sidebar rewritten from scratch with hover logic */}
                <motion.aside
                    initial={false}
                    animate={{ width: open ? 260 : 72 }}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => {
                        setOpen(false);
                        setShowSwitcher(false);
                    }}
                    className="h-full bg-sidebar border-r border-sidebar-border flex flex-col z-60 transition-colors duration-300 absolute left-0 top-0 shadow-xl"
                >
                    {/* Logo Section - Centered and Icon only */}
                    <div className="h-16 w-[72px] flex items-center justify-center shrink-0 relative overflow-hidden">
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
                                        isActive ? "text-sidebar-foreground" : "text-muted-foreground hover:text-sidebar-foreground",
                                        isActive && "bg-sidebar-accent"
                                    )}
                                >
                                    <div className={cn(
                                        "w-11 h-6 flex items-center justify-center shrink-0 transition-colors duration-200",
                                        isActive ? "text-sidebar-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"
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
                                            className="absolute left-0 w-[2.5px] h-6 bg-sidebar-foreground rounded-r-full"
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
                                        className="absolute bottom-full left-3 right-3 mb-2 p-2 bg-popover border border-border rounded-xl shadow-2xl space-y-1 z-60 max-h-64 overflow-y-auto"
                                    >
                                        {workspaces.map((ws) => (
                                            <div
                                                key={ws.id}
                                                onClick={() => {
                                                    if (activeWorkspace?.id === ws.id) {
                                                        setShowSwitcher(false)
                                                        return
                                                    }

                                                    setIsSwitchingWorkspace(true)
                                                    setActiveWorkspace(ws)
                                                    // Store in localStorage for persistence
                                                    localStorage.setItem('activeWorkspaceId', ws.id)
                                                    setShowSwitcher(false)
                                                    // Navigate to overview on workspace switch
                                                    router.push('/overview')

                                                    setTimeout(() => {
                                                        setIsSwitchingWorkspace(false)
                                                    }, 800)
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors",
                                                    activeWorkspace?.id === ws.id && "bg-accent"
                                                )}
                                            >
                                                <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                                                    {ws.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-medium">{ws.name}</span>
                                            </div>
                                        ))}

                                        {workspaces.length === 0 && (
                                            <div className="p-3 text-xs text-muted-foreground text-center">No workspaces yet</div>
                                        )}
                                        <DropdownMenuSeparator className="bg-border" />
                                        {isOwner ? (
                                            <Button
                                                onClick={() => setIsWorkspaceDialogOpen(true)}
                                                variant="ghost"
                                                className="w-full justify-start h-10 px-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground text-xs gap-3"
                                            >
                                                <IconPlus className="h-4 w-4" />
                                                <span>Add workspace</span>
                                            </Button>
                                        ) : (
                                            <div className="px-2 py-2 text-[10px] text-muted-foreground text-center">
                                                Only workspace owners can create new workspaces
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div
                                onClick={() => open && setShowSwitcher(!showSwitcher)}
                                className={cn(
                                    "flex items-center transition-all duration-200 cursor-pointer h-14 w-full px-4 group justify-center",
                                    showSwitcher ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center justify-center shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase group-hover:text-foreground group-hover:bg-accent group-hover:border-border transition-all">
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
                                                    <IconChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", showSwitcher && "rotate-180")} />
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-sans">Pro Plan</span>
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
                <div className="flex-1 flex flex-col min-w-0 bg-background relative">
                    {isSwitchingWorkspace && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
                            <div className="relative flex flex-col items-center gap-3 text-foreground/80">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <div className="text-xs font-sans tracking-wide">Loading workspace…</div>
                            </div>
                        </div>
                    )}
                    {/* Header (Stayed relatively similar but polished) */}
                    <header className="h-16 flex items-center justify-between px-8 backdrop-blur-md bg-background/50 sticky top-0 z-50">
                        <div className="flex items-center gap-6 flex-1">
                            <button 
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer max-w-md w-full bg-transparent border-0 outline-none"
                            >
                                <IconSearch className="h-4 w-4" />
                                <span className="text-sm font-medium">Search anything...</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/settings/billing" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="outline-none focus:ring-0">
                                        <Avatar className="h-8 w-8 border border-border hover:border-muted-foreground transition-colors cursor-pointer">
                                            <AvatarImage src={headerLogo} />
                                            <AvatarFallback className="bg-accent text-[10px] font-bold text-foreground border border-border">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[240px] bg-popover border border-border text-popover-foreground p-2 shadow-2xl rounded-xl mt-2 animate-in fade-in zoom-in-95">
                                    <DropdownMenuLabel className="px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{userName}</span>
                                            <span className="text-[10px] text-muted-foreground font-sans truncate">{userEmail}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-border mx-2" />
                                    <div className="py-1">
                                        <Link href="/settings/account">
                                            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
                                                <IconUserCircle className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs">Account Settings</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/settings/support">
                                            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
                                                <IconMessageCircle className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs">Support</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/settings/members">
                                            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
                                                <IconUsersGroup className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs">Manage Team</span>
                                            </DropdownMenuItem>
                                        </Link>
                                    </div>
                                    <DropdownMenuSeparator className="bg-border mx-2" />
                                    <div className="py-1">
                                        <DropdownMenuItem onClick={handleSignOut} className="focus:bg-red-500/10 focus:text-red-500 text-muted-foreground cursor-pointer px-3 py-2 rounded-lg flex items-center gap-3">
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
                <DialogContent className="bg-card border-border text-card-foreground">
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
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
                                className="bg-muted border-border"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsWorkspaceDialogOpen(false)} className="hover:bg-accent">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreatingWorkspace} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
