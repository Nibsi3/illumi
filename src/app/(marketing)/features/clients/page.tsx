import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconUsers,
    IconHistory,
    IconFolder,
    IconMail,
    IconPhone,
    IconBuilding,
} from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Client Management & CRM for Freelancers | Illumi",
    description: "Simple CRM for South African freelancers and small businesses. Track client history, organize invoices by company, and manage customer relationships.",
    keywords: ["simple CRM freelancers", "client history tracker", "customer management South Africa", "invoice client database", "small business CRM"],
}

const features = [
    {
        icon: IconHistory,
        title: "View Client History",
        description: "See every invoice a client has ever received in one click. Track payment patterns and outstanding balances.",
    },
    {
        icon: IconFolder,
        title: "Folder Organization",
        description: "Invoices are automatically organized by client. Find any invoice instantly with folder-style navigation.",
    },
    {
        icon: IconBuilding,
        title: "Company Profiles",
        description: "Store company details, billing addresses, tax IDs, and contact information in one place.",
    },
    {
        icon: IconMail,
        title: "Quick Contact",
        description: "Email clients directly from their profile. All contact details at your fingertips.",
    },
]

const clients = [
    { name: "Acme Corp", email: "accounts@acme.co.za", invoices: 12, total: "R 45,000.00", status: "Active" },
    { name: "TechStart SA", email: "billing@techstart.co.za", invoices: 8, total: "R 28,500.00", status: "Active" },
    { name: "Design Studio", email: "hello@designstudio.co.za", invoices: 5, total: "R 15,200.00", status: "Active" },
    { name: "Local Shop", email: "owner@localshop.co.za", invoices: 3, total: "R 8,400.00", status: "Inactive" },
]

const clientHistory = [
    { id: "INV-2024-042", date: "15 Jan 2024", amount: "R 4,500.00", status: "Paid" },
    { id: "INV-2024-038", date: "01 Jan 2024", amount: "R 3,200.00", status: "Paid" },
    { id: "INV-2023-156", date: "15 Dec 2023", amount: "R 5,800.00", status: "Paid" },
    { id: "INV-2023-142", date: "01 Dec 2023", amount: "R 2,500.00", status: "Paid" },
]

export default function ClientsFeaturePage() {
    return (
        <div className="bg-background grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-white dark:bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <span className="px-3 py-1 rounded-full bg-accent text-muted-foreground">Simple CRM for Freelancers</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        Know Your Clients,<br />
                        <span className="text-muted-foreground">Grow Your Business</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
                        Simple client management for South African freelancers and small businesses. Track invoice history, organize by company, and never lose track of a customer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Start Managing Clients
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted"
                        >
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Client Database Mockup */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Client List */}
                        <div className="lg:col-span-2 border border-border rounded-3xl bg-card dark:bg-black/50 overflow-hidden">
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <div className="text-sm font-medium text-foreground">Client Database</div>
                                <div className="text-xs text-muted-foreground">{clients.length} clients</div>
                            </div>
                            <div className="divide-y divide-border">
                                {clients.map((client, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                                                <span className="text-sm font-medium text-foreground">{client.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{client.name}</div>
                                                <div className="text-xs text-muted-foreground">{client.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-foreground">{client.total}</div>
                                            <div className="text-xs text-muted-foreground">{client.invoices} invoices</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Client Detail */}
                        <div className="border border-border rounded-3xl bg-card dark:bg-black/50 overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <div className="text-sm font-medium text-foreground">Client History</div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                                        <span className="text-xl font-medium text-foreground">A</span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-medium text-foreground">Acme Corp</div>
                                        <div className="text-xs text-muted-foreground">12 invoices • R 45,000.00 total</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {clientHistory.map((invoice, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div>
                                                <div className="text-sm text-foreground">{invoice.id}</div>
                                                <div className="text-xs text-muted-foreground">{invoice.date}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-foreground">{invoice.amount}</div>
                                                <div className="text-xs text-muted-foreground">{invoice.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Simple CRM, powerful features</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Everything you need to manage client relationships without the complexity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-muted/50 border border-border hover:border-border transition-colors">
                                <feature.icon className="h-10 w-10 text-muted-foreground mb-6" />
                                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Client Folder View */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">Invoices organized by client</h2>
                            <p className="text-muted-foreground mb-8">
                                Every invoice is automatically filed under the right client. Click on any client folder to see all their invoices instantly. No more searching through spreadsheets.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Automatic folder organization",
                                    "One-click access to client invoices",
                                    "Filter by status (paid, pending, overdue)",
                                    "See total outstanding per client",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <IconCheck className="h-5 w-5 text-muted-foreground shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border border-border rounded-2xl p-6 bg-card dark:bg-black/50">
                            <div className="space-y-3">
                                {[
                                    { name: "Acme Corp", count: 12, amount: "R 45,000" },
                                    { name: "TechStart SA", count: 8, amount: "R 28,500" },
                                    { name: "Design Studio", count: 5, amount: "R 15,200" },
                                ].map((folder, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:border-border transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                                            <IconFolder className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-foreground">{folder.name}</div>
                                            <div className="text-xs text-muted-foreground">{folder.count} invoices</div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">{folder.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
