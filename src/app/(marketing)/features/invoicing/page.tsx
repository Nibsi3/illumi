import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconBrandWhatsapp,
    IconMail,
    IconLink,
    IconFolder,
    IconCopy,
    IconRefresh,
    IconCalendar,
    IconFileInvoice,
} from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Free Invoice Generator for South Africa | Illumi",
    description: "Create and send professional invoices via WhatsApp or Email. Free invoice generator with recurring invoices, payment tracking, and folder organization for SA businesses.",
    keywords: ["free invoice generator", "WhatsApp invoicing", "recurring invoices South Africa", "track overdue payments", "invoice software ZAR"],
}

const features = [
    {
        icon: IconBrandWhatsapp,
        title: "WhatsApp Invoice Sharing",
        description: "Send invoices directly via WhatsApp with one click. Your clients receive a professional PDF instantly - perfect for the South African market.",
    },
    {
        icon: IconFolder,
        title: "Folder-Style Organization",
        description: "Invoices are automatically organized by client in folders. Click any client to see all their invoices. No more searching through spreadsheets.",
    },
    {
        icon: IconCopy,
        title: "Duplicate & Edit",
        description: "Create new invoices in seconds by duplicating existing ones. Perfect for recurring work with the same clients.",
    },
    {
        icon: IconRefresh,
        title: "Recurring Invoices",
        description: "Set up automatic recurring invoices for retainer clients. Invoices are created and sent on your schedule (Pro feature).",
    },
    {
        icon: IconCalendar,
        title: "Schedule for Later",
        description: "Create invoices now, send them later. Schedule invoices to be sent on a specific date and time.",
    },
    {
        icon: IconFileInvoice,
        title: "Mark as Paid",
        description: "Track payment status with one click. Mark invoices as paid and see your outstanding balance update instantly.",
    },
]

const sharingOptions = [
    { icon: IconBrandWhatsapp, name: "WhatsApp", description: "Send via WhatsApp" },
    { icon: IconMail, name: "Email", description: "Send via Email" },
    { icon: IconLink, name: "Link", description: "Copy shareable link" },
]

const invoiceStatuses = [
    { status: "Paid", count: 24, amount: "R 125,000", color: "text-green-400", bg: "bg-green-400/10" },
    { status: "Pending", count: 5, amount: "R 18,500", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { status: "Overdue", count: 2, amount: "R 4,200", color: "text-red-400", bg: "bg-red-400/10" },
]

export default function InvoicingFeaturePage() {
    return (
        <div className="bg-black">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">Free Invoice Generator</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Send Invoices via<br />
                        <span className="text-white/50">WhatsApp in Seconds</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg mb-8">
                        Create professional invoices and send them via WhatsApp, Email, or shareable link. Track payments, manage overdue invoices, and get paid faster.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Create Free Invoice
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5"
                        >
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-white/40 mt-4">Free forever • Unlimited invoices • No credit card</p>
                </div>
            </section>

            {/* Invoice Status Cards */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {invoiceStatuses.map((status, i) => (
                            <div key={i} className={`p-6 rounded-2xl border border-white/10 ${status.bg}`}>
                                <div className={`text-sm font-medium ${status.color} mb-2`}>{status.status}</div>
                                <div className="text-3xl font-serif font-bold text-white mb-1">{status.amount}</div>
                                <div className="text-sm text-white/50">{status.count} invoices</div>
                            </div>
                        ))}
                    </div>

                    {/* Invoice Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="border border-white/10 rounded-3xl bg-black/50 overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div className="text-sm font-medium text-white">Invoice Preview</div>
                                <div className="text-xs text-white/50">INV-2024-042</div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between mb-8">
                                    <div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Bill to</div>
                                        <div className="text-sm text-white">Acme Corp</div>
                                        <div className="text-xs text-white/50">accounts@acme.co.za</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Amount Due</div>
                                        <div className="text-3xl font-serif font-bold text-white">R 4,500.00</div>
                                    </div>
                                </div>
                                <div className="border-t border-white/10 pt-4 mb-6">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-white/50 text-xs uppercase tracking-wider">
                                                <th className="text-left pb-2">Description</th>
                                                <th className="text-right pb-2">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-white">
                                            <tr>
                                                <td className="py-2">Web Design Services</td>
                                                <td className="text-right">R 3,500.00</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2">Hosting (Annual)</td>
                                                <td className="text-right">R 1,000.00</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-white/10">
                                    <div className="text-right">
                                        <div className="text-xs text-white/50 mb-1">Total (incl. VAT)</div>
                                        <div className="text-xl font-bold text-white">R 4,500.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sharing Options */}
                        <div className="space-y-6">
                            <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                                <h3 className="text-lg font-medium text-white mb-4">Share Invoice</h3>
                                <div className="space-y-3">
                                    {sharingOptions.map((option, i) => (
                                        <button key={i} className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors text-left">
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                <option.icon className="h-5 w-5 text-white/70" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{option.name}</div>
                                                <div className="text-xs text-white/50">{option.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                                <h3 className="text-lg font-medium text-white mb-2">Quick Actions</h3>
                                <p className="text-sm text-white/50 mb-4">Manage invoice status with one click</p>
                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors">
                                        Mark as Paid
                                    </button>
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors">
                                        Duplicate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything you need for invoicing</h2>
                        <p className="text-white/50 max-w-xl mx-auto">
                            Professional invoicing tools built for South African freelancers and small businesses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                <feature.icon className="h-10 w-10 text-white/70 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/50 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Folder Organization */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Organized by client, automatically</h2>
                            <p className="text-white/50 mb-8">
                                Every invoice is automatically filed under the right client. No more searching through folders or spreadsheets. Click on any client to see all their invoices instantly.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Automatic client folder organization",
                                    "See invoice history per client",
                                    "Filter by paid, pending, or overdue",
                                    "Quick search across all invoices",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/70">
                                        <IconCheck className="h-5 w-5 text-green-400 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border border-white/10 rounded-2xl p-6 bg-black/50">
                            <div className="text-sm font-medium text-white mb-4">Client Folders</div>
                            <div className="space-y-3">
                                {[
                                    { name: "Acme Corp", invoices: 12, pending: 1 },
                                    { name: "TechStart SA", invoices: 8, pending: 2 },
                                    { name: "Design Studio", invoices: 5, pending: 0 },
                                    { name: "Local Shop", invoices: 3, pending: 1 },
                                ].map((client, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                            <IconFolder className="h-5 w-5 text-white/50" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-white">{client.name}</div>
                                            <div className="text-xs text-white/50">{client.invoices} invoices</div>
                                        </div>
                                        {client.pending > 0 && (
                                            <div className="px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs">
                                                {client.pending} pending
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Start invoicing for free</h2>
                    <p className="text-white/50 mb-8 max-w-xl mx-auto">
                        Create unlimited invoices, send via WhatsApp, and track payments - all for free. Upgrade to Pro for recurring invoices and PayFast integration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">Create Your First Invoice</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-white/40 mt-4">Free forever • No credit card required</p>
                </div>
            </section>
        </div>
    )
}
