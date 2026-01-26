"use client"

import Link from "next/link"
import Image from "next/image"
import { IconMenu2, IconChevronDown, IconX, IconSun, IconMoon } from "@tabler/icons-react"
import { useEffect, useState, useRef } from "react"
import { useTheme } from "@/lib/theme-context"

const featureDropdownItems = [
    { name: "Financial Overview", href: "/features/overview" },
    { name: "Invoicing", href: "/features/invoicing" },
    { name: "Expense Tracking", href: "/features/expenses" },
    { name: "Client Management", href: "/features/clients" },
    { name: "PayGate", href: "/features/paygate" },
    { name: "Vault", href: "/features/vault" },
]

const navigation = [
    { name: "Pricing", href: "/pricing" },
    { name: "Integrations", href: "/integrations" },
    { name: "Story", href: "/story" },
    { name: "Contact", href: "/contact" },
]

function ThemeToggleWithShimmer({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
    const [shimmer, setShimmer] = useState(false)

    useEffect(() => {
        // Initial shimmer after 3 seconds
        const initialTimeout = setTimeout(() => {
            setShimmer(true)
            setTimeout(() => setShimmer(false), 1000)
        }, 3000)

        // Then shimmer every 15 seconds
        const interval = setInterval(() => {
            setShimmer(true)
            setTimeout(() => setShimmer(false), 1000)
        }, 15000)

        return () => {
            clearTimeout(initialTimeout)
            clearInterval(interval)
        }
    }, [])

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors overflow-hidden focus:outline-none focus-visible:ring-0 ${shimmer ? 'animate-shimmer' : ''}`}
        >
            {shimmer && (
                <span className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1s_ease-in-out]">
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                </span>
            )}
            {theme === 'dark' ? <IconSun className="h-4 w-4 relative z-10" /> : <IconMoon className="h-4 w-4 relative z-10" />}
        </button>
    )
}


export function MarketingHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()

    useEffect(() => {
        if (!mobileMenuOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false)
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [mobileMenuOpen])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
            {/* Wider navigation with reduced height */}
            <nav className="mx-auto max-w-4xl flex items-center justify-center gap-6 px-6 py-1.5 bg-white/80 dark:bg-background/60 backdrop-blur-xl rounded-lg border border-border">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src={theme === 'dark' ? '/logo.png' : 'https://eagwfcctvfrvxgxaitbd.supabase.co/storage/v1/object/public/logo/logo_black.png'}
                        alt="Illumi Logo"
                        width={24}
                        height={24}
                        className={theme === 'dark' ? 'w-6 h-6' : 'w-6 h-6 scale-[0.75] origin-center'}
                    />
                </Link>

                {/* Features Dropdown */}
                <details className="relative hidden md:block group">
                    <summary className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        Features
                        <IconChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="absolute top-full left-0 mt-2 w-48 bg-popover/90 backdrop-blur-xl border border-border rounded-lg shadow-xl overflow-hidden">
                        {featureDropdownItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </details>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Separator and Sign in */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-muted-foreground/30">|</span>
                    <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Sign in
                    </Link>
                    <ThemeToggleWithShimmer theme={theme} toggleTheme={toggleTheme} />
                </div>

                {/* Mobile menu */}
                <button
                    type="button"
                    aria-label="Open menu"
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden text-foreground"
                >
                    <IconMenu2 className="h-4 w-4" />
                </button>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute inset-0 bg-black/20 dark:bg-black/60"
                    />

                    <div className="absolute left-4 right-4 top-20 mx-auto w-[calc(100vw-2rem)] max-w-sm bg-popover/95 backdrop-blur-xl rounded-lg border border-border overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Menu</span>
                            <button
                                type="button"
                                aria-label="Close menu"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <IconX className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-[calc(100vh-7rem)] overflow-auto px-4 py-3 space-y-3">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Features</div>
                            {featureDropdownItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="pt-3 border-t border-border space-y-3">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-3 border-t border-border space-y-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        toggleTheme()
                                    }}
                                    className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {theme === 'dark' ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
                                    <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                                </button>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
