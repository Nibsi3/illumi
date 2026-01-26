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
    illumi: [
        { name: "Sales Tax Calculator", href: "/sales-tax-calculator" },
        { name: "Hourly Rate Calculator", href: "/hourly-rate-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Free Invoice Generator", href: "/invoice-generator" },
        { name: "Free Receipt Maker", href: "/receipt-maker" },
        { name: "Invoicing Glossary", href: "/glossary" },
        { name: "What is an Invoice?", href: "/what-is-an-invoice" },
        { name: "Blog", href: "/blog" },
    ],
    invoicingSoftware: [
        { name: "Premium", href: "/invoicing-software/premium" },
        { name: "Freelancers", href: "/invoicing-software/freelancers" },
        { name: "Contractors", href: "/invoicing-software/contractors" },
        { name: "Invoice Without Company", href: "/invoicing-software/no-company" },
        { name: "Self-Employed", href: "/invoicing-software/self-employed" },
        { name: "Small Businesses", href: "/invoicing-software/small-business" },
        { name: "Startups", href: "/invoicing-software/startups" },
        { name: "Solopreneurs", href: "/invoicing-software/solopreneurs" },
        { name: "Restaurants", href: "/invoicing-software/restaurants" },
        { name: "Hotels", href: "/invoicing-software/hotels" },
    ],
    solutions: [
        { name: "For Businesses", href: "/for-business" },
        { name: "For Individuals", href: "/for-individuals" },
        { name: "Features", href: "/features/overview" },
        { name: "Invoicing", href: "/features/invoicing" },
        { name: "Client Portal", href: "/features/inbox" },
        { name: "Vault", href: "/features/vault" },
    ],
    resources: [
        { name: "SME Resources", href: "/resources" },
        { name: "Documentation", href: "/docs" },
        { name: "Integrations", href: "/integrations" },
        { name: "Support", href: "/contact" },
    ],
    company: [
        { name: "Story", href: "/story" },
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms", href: "/terms-and-conditions" },
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {/* Illumi */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Illumi
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.illumi.map((link) => (
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

                        {/* Free Invoicing Software */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Free Invoicing Software
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.invoicingSoftware.map((link) => (
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

                        {/* Solutions */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Solutions
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.solutions.map((link) => (
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
                                Stay Updated
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Run your business smarter.
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
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
