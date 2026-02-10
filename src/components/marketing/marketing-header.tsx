"use client"

import Link from "next/link"
import Image from "next/image"
import { IconMenu2, IconChevronDown, IconX } from "@tabler/icons-react"
import { MoonStar, SunMedium } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

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
            {/* Mobile Header - Logo left, Hamburger right */}
            <div className="md:hidden flex items-center justify-between px-2 py-3 bg-white/80 dark:bg-background/60 backdrop-blur-xl rounded-lg border border-border">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={theme === 'dark' ? '/logo.png' : '/logo_black.png'}
                        alt="Illumi Logo"
                        width={28}
                        height={28}
                        className="w-7 h-7"
                    />
                    <span className="text-sm font-bold text-foreground">Illumi</span>
                </Link>
                <button
                    type="button"
                    aria-label="Open menu"
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-3 text-foreground"
                >
                    <IconMenu2 className="h-6 w-6" />
                </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex mx-auto max-w-4xl items-center justify-center gap-6 px-6 py-1.5 bg-white/80 dark:bg-background/60 backdrop-blur-xl rounded-lg border border-border">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src={theme === 'dark' ? '/logo.png' : '/logo_black.png'}
                        alt="Illumi Logo"
                        width={24}
                        height={24}
                        className={theme === 'dark' ? 'w-6 h-6' : 'w-6 h-6 scale-75 origin-center'}
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
                <div className="flex items-center gap-4">
                    <span className="text-muted-foreground/30">|</span>
                    <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Sign in
                    </Link>
                    <ThemeToggle theme={theme} onToggle={toggleTheme} shimmer />
                </div>
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

                            <div className="pt-3 border-t border-border space-y-3">
                                {/* Theme toggle switch */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Dark mode</span>
                                    <label className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={theme === 'dark'}
                                            onChange={() => toggleTheme()}
                                            className="sr-only"
                                            aria-label="Toggle dark mode"
                                        />
                                        <span
                                            className={`relative w-11 h-6 rounded-full transition-colors ${
                                                theme === 'dark' ? 'bg-primary' : 'bg-muted'
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background border border-border shadow-sm transition-transform flex items-center justify-center ${
                                                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            >
                                                {theme === 'dark' ? (
                                                    <MoonStar className="w-3.5 h-3.5 text-foreground" />
                                                ) : (
                                                    <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                                                )}
                                            </span>
                                        </span>
                                    </label>
                                </div>

                                {/* Auth buttons */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Link href="/login?mode=sign_in" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full h-10 text-sm">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/login?mode=sign_up" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full h-10 text-sm bg-primary text-primary-foreground">
                                            Sign up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
