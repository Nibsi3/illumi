import { Metadata } from "next"
import Link from "next/link"
import {
    IconFileInvoice,
    IconReceipt,
    IconUsers,
    IconChartBar,
    IconRobot,
    IconSearch,
    IconArrowRight,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Help Center | Invoicing Guides & Tutorials | Illumi",
    description: "Learn how to use Illumi for invoicing, client management, and business finances. Guides, tutorials, and best practices for South African businesses.",
    keywords: [
        "illumi help",
        "invoicing help",
        "invoice tutorials",
        "invoicing guides south africa",
        "how to invoice",
        "vat invoice help",
    ],
    alternates: {
        canonical: "/help",
    },
}

const helpCategories = [
    {
        title: "Getting Started",
        description: "New to Illumi? Start here.",
        articles: [
            { title: "What is Invoice Management?", href: "/help/what-is-invoice-management" },
            { title: "How VAT Invoices Work in South Africa", href: "/help/how-vat-invoices-work-south-africa" },
        ],
    },
]

const featureGuides = [
    {
        icon: IconFileInvoice,
        title: "Invoice Management",
        description: "Create, send, and track professional invoices",
        href: "/features/invoicing",
    },
    {
        icon: IconUsers,
        title: "Client Management",
        description: "Organize clients and track invoice history",
        href: "/features/clients",
    },
    {
        icon: IconRobot,
        title: "Automated Invoicing",
        description: "Set up recurring invoices and reminders",
        href: "/features/automated-invoicing",
    },
    {
        icon: IconChartBar,
        title: "Invoice Reports",
        description: "Generate VAT reports and analytics",
        href: "/features/invoice-reports",
    },
    {
        icon: IconSearch,
        title: "Invoice Search",
        description: "Find any invoice instantly",
        href: "/features/invoice-search",
    },
    {
        icon: IconReceipt,
        title: "Invoice Tracking",
        description: "Monitor payment status in real-time",
        href: "/features/invoice-tracking",
    },
]

export default function HelpPage() {
    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Help Center
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Guides, tutorials, and best practices for getting the most out of Illumi.
                    </p>
                </div>
            </section>

            {/* Help Categories */}
            <section className="py-16 bg-muted/30">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    {helpCategories.map((category, idx) => (
                        <div key={idx} className="mb-12 last:mb-0">
                            <h2 className="text-2xl font-bold text-foreground mb-2">{category.title}</h2>
                            <p className="text-muted-foreground mb-6">{category.description}</p>
                            <div className="space-y-3">
                                {category.articles.map((article, articleIdx) => (
                                    <Link
                                        key={articleIdx}
                                        href={article.href}
                                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                                    >
                                        <span className="font-medium text-foreground">{article.title}</span>
                                        <IconArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Guides */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-foreground mb-8">Feature Guides</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {featureGuides.map((guide, idx) => (
                            <Link
                                key={idx}
                                href={guide.href}
                                className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                            >
                                <guide.icon className="w-8 h-8 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {guide.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-16 bg-muted/30">
                <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        Can't find what you're looking for?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Our support team is here to help during South African business hours.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        Contact Support
                        <IconArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
