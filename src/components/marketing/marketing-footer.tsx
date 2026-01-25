import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    IconBrandTwitter,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandDiscord,
} from "@tabler/icons-react"

const footerLinks = {
    features: [
        { name: "Overview", href: "/features/overview" },
        { name: "Invoicing", href: "/features/invoicing" },
        { name: "Client Portal", href: "/features/inbox" },
        { name: "Vault", href: "/features/vault" },
    ],
    resources: [
        { name: "SME Resources", href: "/resources" },
        { name: "Documentation", href: "/docs" },
        { name: "Integrations", href: "/integrations" },
        { name: "Support", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms", href: "/terms-and-conditions" },
    ],
    company: [
        { name: "Story", href: "/story" },
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "/contact" },
    ],
}

const socialLinks = [
    { name: "Twitter", icon: IconBrandTwitter, href: "#" },
    { name: "GitHub", icon: IconBrandGithub, href: "#" },
    { name: "LinkedIn", icon: IconBrandLinkedin, href: "#" },
    { name: "Discord", icon: IconBrandDiscord, href: "#" },
]

export function MarketingFooter() {
    return (
        <footer className="bg-background border-t border-border">
            {/* Links Section */}
            <div className="border-t border-border py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Features */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Features
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.features.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Resources
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Company
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Run your business smarter.
                            </h3>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-full h-10"
                                />
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 h-10">
                                    →
                                </Button>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-4 mt-6">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={social.name}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom watermark */}
            <div className="relative overflow-hidden py-12">
                <div className="text-[12rem] md:text-[18rem] font-bold text-foreground/5 text-center leading-none tracking-tighter select-none">
                    illumi
                </div>
                <div className="text-center mt-8 text-xs text-muted-foreground">
                    Proudly supporting small businesses in Johannesburg, Cape Town, Durban, Pretoria, and across South Africa, including Bloemfontein, Port Elizabeth, East London, and the Garden Route.
                </div>
            </div>
        </footer>
    )
}
