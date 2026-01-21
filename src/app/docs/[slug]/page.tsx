import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"

const DOCS: Record<string, { title: string; description: string; body: string[] }> = {
    "getting-started": {
        title: "Getting started",
        description: "Create your account, set up your business profile, and send your first invoice.",
        body: [
            "Sign in and create your workspace.",
            "Add your company details (name, VAT number, website, and support email).",
            "Create a client and add your first invoice.",
            "Send the invoice by email. Your client receives a secure link to view and pay (when PayGate is enabled).",
        ],
    },
    invoicing: {
        title: "Invoicing",
        description: "Create professional invoices, track status, and manage overdue payments.",
        body: [
            "Create invoices from the Invoices page.",
            "Track payment status (draft, pending, paid, overdue).",
            "Send invoices by email or share a link.",
            "Use recurring invoices (Pro) for retainers and subscriptions.",
        ],
    },
    expenses: {
        title: "Expenses",
        description: "Track business expenses, recurring costs, and export reports for your accountant.",
        body: [
            "Add expenses as once-off or recurring.",
            "Categorize expenses for clearer reporting.",
            "Export your expenses to CSV for bookkeeping and tax preparation.",
        ],
    },
    payments: {
        title: "PayGate & payments",
        description: "Connect a payment provider, enable online payments, and auto-update invoice status.",
        body: [
            "Go to Settings > PayGate.",
            "Connect your preferred payment provider.",
            "Choose a primary provider.",
            "Once enabled, invoices include a Pay Now button and status updates automatically when paid.",
        ],
    },
    clients: {
        title: "Clients & CRM",
        description: "Manage client details, view invoice history, and keep everything organised by company.",
        body: [
            "Create clients with contact and billing details.",
            "View invoice history per client.",
            "Keep your billing communication consistent and professional.",
        ],
    },
    "client-portal": {
        title: "Client portal links",
        description: "Send invoices by email with a secure link so clients can view and pay online.",
        body: [
            "When you send an invoice, Illumi generates a secure link for your client.",
            "Clients can view their invoice details, download a PDF, and pay online (when PayGate is enabled).",
            "You keep visibility on payment status and outstanding balances.",
        ],
    },
    settings: {
        title: "Settings & billing",
        description: "Manage your workspace profile, subscription, members, and notifications.",
        body: [
            "Update your company profile and invoice settings.",
            "Manage billing and upgrades from the Billing page.",
            "Invite team members (Pro) and control roles.",
        ],
    },
    "send-invoices-by-email": {
        title: "Sending invoices by email",
        description: "Email invoices in one click so clients receive a secure link to view and pay.",
        body: [
            "Open an invoice and use the Send via Email option.",
            "Confirm the client email address.",
            "Illumi sends the invoice email with a secure view/pay link.",
        ],
    },
    "payfast-online-payments": {
        title: "Connecting PayFast for online payments",
        description: "Use PayFast as your payment provider through PayGate.",
        body: [
            "Go to Settings > PayGate.",
            "Select PayFast and enter your credentials.",
            "Set PayFast as the primary provider if desired.",
        ],
    },
}

export default async function DocsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const doc = DOCS[slug]

    if (!doc) notFound()

    return (
        <div className="min-h-screen bg-black text-white">
            <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
                <div className="mb-8">
                    <Link href="/docs" className="text-sm text-white/60 hover:text-white transition-colors">
                        Back to Documentation
                    </Link>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{doc.title}</h1>
                <p className="text-white/50 text-lg mb-10">{doc.description}</p>

                <div className="space-y-4">
                    {doc.body.map((p, i) => (
                        <p key={i} className="text-white/70 leading-relaxed">
                            {p}
                        </p>
                    ))}
                </div>

                <div className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div>
                        <div className="text-sm font-medium text-white">Need help?</div>
                        <div className="text-sm text-white/50">Contact us and we’ll get you sorted.</div>
                    </div>
                    <Button asChild className="bg-white text-black hover:bg-neutral-200 rounded-xl h-11 px-6">
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                </div>
            </main>
        </div>
    )
}
