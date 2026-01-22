import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconEye, IconCreditCard, IconFileInvoice, IconClock, IconBell, IconLock } from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Client Portal for Invoice Tracking | Illumi",
    description: "Give your clients a professional portal to view invoices, track payments, and pay online. Automated invoice tracking for South African businesses.",
    keywords: ["client portal", "invoice tracking", "payment portal", "customer portal South Africa", "automated invoicing"],
}

const features = [
    {
        icon: IconEye,
        title: "Invoice Viewing",
        description: "Clients can view all their invoices in one place with full details, line items, and payment history.",
    },
    {
        icon: IconCreditCard,
        title: "Online Payments",
        description: "Accept online payments via your connected provider. Clients pay directly from the invoice with one click.",
    },
    {
        icon: IconClock,
        title: "Payment History",
        description: "Complete transaction history showing all paid, pending, and overdue invoices at a glance.",
    },
    {
        icon: IconBell,
        title: "Automatic Reminders",
        description: "Automated email reminders for overdue invoices. Set reminder schedules that work for you.",
    },
    {
        icon: IconFileInvoice,
        title: "PDF Downloads",
        description: "Clients can download professional PDF invoices anytime for their records.",
    },
    {
        icon: IconLock,
        title: "Secure Access",
        description: "Each client gets a unique, secure link to their invoices. No passwords to remember.",
    },
]

const invoiceStatuses = [
    { id: "INV-2024-042", client: "Acme Corp", amount: "R 4,500.00", status: "Paid", date: "15 Jan 2024" },
    { id: "INV-2024-041", client: "TechStart SA", amount: "R 2,800.00", status: "Viewed", date: "14 Jan 2024" },
    { id: "INV-2024-040", client: "Design Studio", amount: "R 1,200.00", status: "Sent", date: "13 Jan 2024" },
    { id: "INV-2024-039", client: "Local Shop", amount: "R 850.00", status: "Overdue", date: "10 Jan 2024" },
]

export default function ClientPortalFeaturePage() {
    return (
        <div className="bg-black grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: "url(/bg.webp)" }} />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">Automated Invoice Tracking</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Client Portal for<br />
                        <span className="text-white/50">Professional Invoicing</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg mb-8">
                        Give your clients a professional portal to view invoices, track payments, and pay online. 
                        Know exactly when invoices are viewed and paid.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Get Started Free
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
                </div>
            </section>

            {/* Email to Pay Flow */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">What clients see</h2>
                            <p className="text-white/50 mb-8 max-w-xl">
                                Illumi emails the invoice with a secure link. Your client clicks "View & Pay" to open the portal and pay online.
                            </p>

                            <div className="space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                                        <div className="text-sm font-medium text-white">Invoice email</div>
                                        <div className="text-xs text-white/40">to: client@company.co.za</div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xl font-bold text-white">Invoice INV-20260120-WVXZ</div>
                                        <div className="mt-2 text-sm text-white/60">Amount due: <span className="text-white">ZAR 1,150.00</span></div>
                                        <div className="mt-1 text-xs text-white/40">Due: 20/01/2026</div>
                                        <div className="mt-6">
                                            <div className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold">
                                                View & Pay Invoice <IconArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                                        <div className="text-sm font-medium text-white">Client portal</div>
                                        <div className="text-xs text-white/40">secure link</div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <div className="text-xs uppercase tracking-widest text-white/40">Invoice</div>
                                                <div className="text-lg font-semibold text-white">INV-20260120-WVXZ</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs uppercase tracking-widest text-white/40">Total due</div>
                                                <div className="text-2xl font-bold text-white">R1,150.00</div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                                            <div className="text-sm font-medium text-white">Payment method</div>
                                            <div className="mt-2 text-xs text-white/50">Your connected provider</div>
                                            <div className="mt-4 inline-flex items-center justify-center rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold">
                                                Pay now <IconArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/50 p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Why this reduces follow-ups</h3>
                            <ul className="space-y-4">
                                {[
                                    "Clients receive a clear email with a single call-to-action",
                                    "The portal shows invoice status and amounts due",
                                    "Online payments update your records automatically (provider dependent)",
                                    "PDF download is always available for client records",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-white/70">
                                        <IconCheck className="h-5 w-5 text-white/50 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Invoice Tracking Dashboard */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="border border-white/10 rounded-3xl bg-black/50 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="text-sm font-medium text-white">Invoice Tracking</div>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                Real-time status updates
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                                        <th className="text-left p-4">Invoice</th>
                                        <th className="text-left p-4">Client</th>
                                        <th className="text-right p-4">Amount</th>
                                        <th className="text-center p-4">Status</th>
                                        <th className="text-right p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {invoiceStatuses.map((inv, i) => (
                                        <tr key={i} className="hover:bg-white/5">
                                            <td className="p-4 text-sm font-medium text-white">{inv.id}</td>
                                            <td className="p-4 text-sm text-white/70">{inv.client}</td>
                                            <td className="p-4 text-sm text-right text-white font-bold">{inv.amount}</td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    inv.status === 'Paid' ? 'bg-white/10 text-white' :
                                                    inv.status === 'Viewed' ? 'bg-white/10 text-white/90' :
                                                    inv.status === 'Sent' ? 'bg-white/5 text-white/70' :
                                                    'bg-white/5 text-white/60'
                                                }`}>
                                                    {inv.status === 'Paid' && <IconCheck className="h-3 w-3" />}
                                                    {inv.status === 'Viewed' && <IconEye className="h-3 w-3" />}
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-right text-white/50">{inv.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">How the Client Portal works</h2>
                        <p className="text-white/50 max-w-xl mx-auto">
                            Your clients get a professional experience while you get complete visibility.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Send Invoice</h3>
                            <p className="text-white/50 text-sm">
                                Create and send an invoice via email. Your client receives a unique link.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Client Views</h3>
                            <p className="text-white/50 text-sm">
                                Your client opens the portal to view their invoice. You're notified when they view it.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Get Paid</h3>
                            <p className="text-white/50 text-sm">
                                Client pays online via your connected provider. Payment is automatically recorded.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything your clients need</h2>
                        <p className="text-white/50 max-w-xl mx-auto">
                            A professional portal that makes it easy for clients to view and pay invoices.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                                <feature.icon className="h-10 w-10 text-white/70 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/50 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Faster payments, happier clients</h2>
                    <p className="text-white/50 max-w-xl mx-auto mb-12">
                        Businesses using our client portal get paid faster and spend less time chasing invoices.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                            <div className="text-4xl font-serif font-bold text-white mb-2">3x</div>
                            <div className="text-sm text-white/50">Faster payments</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                            <div className="text-4xl font-serif font-bold text-white mb-2">85%</div>
                            <div className="text-sm text-white/50">View rate</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                            <div className="text-4xl font-serif font-bold text-white mb-2">0</div>
                            <div className="text-sm text-white/50">Follow-up emails needed</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
