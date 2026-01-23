import Link from "next/link"
import Image from "next/image"
import { IconMenu2, IconChevronDown } from "@tabler/icons-react"

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
    return (
        <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
            {/* Wider navigation with reduced height */}
            <nav className="mx-auto max-w-4xl flex items-center justify-center gap-6 px-6 py-1.5 bg-black/40 backdrop-blur-xl rounded-lg border border-white/10">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Illumi Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                    />
                </Link>

                {/* Features Dropdown */}
                <details className="relative hidden md:block group">
                    <summary className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        Features
                        <IconChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden">
                        {featureDropdownItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
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
                            className="text-sm text-white/70 hover:text-white transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Separator and Sign in */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-white/20">|</span>
                    <Link
                        href="/login"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                        Sign in
                    </Link>
                </div>

                {/* Mobile menu */}
                <details className="md:hidden relative">
                    <summary className="text-white cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <IconMenu2 className="h-4 w-4" />
                    </summary>

                    <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
                        <div className="px-4 py-3 space-y-3">
                            <div className="text-xs uppercase tracking-wider text-white/40 mb-2">Features</div>
                            {featureDropdownItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-white/10 space-y-3">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block text-sm text-white/70 hover:text-white transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <Link
                                    href="/login"
                                    className="block text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </details>
            </nav>
        </header>
    )
}
