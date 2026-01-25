import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { DocsSidebar } from "@/components/docs/docs-sidebar"

type DocLink = { title: string; href: string; description?: string }

type DocSection = {
    heading: string
    body?: string[]
    steps?: { title: string; detail?: string; href?: string }[]
    links?: DocLink[]
    mock?: "workspace_switcher" | "client_create" | "invoice_editor" | "paygate_settings" | "vault_upload" | "troubleshooting_checklist"
}

type DocArticle = {
    title: string
    description: string
    summary?: string
    readingTime?: string
    sections: DocSection[]
    next?: DocLink[]
}

const DOCS: Record<string, DocArticle> = {
    "getting-started": {
        title: "Getting started",
        description: "Create your workspace, add your business details, and send your first invoice.",
        summary: "Follow this quick path to set up Illumi end-to-end.",
        readingTime: "6 min",
        sections: [
            {
                heading: "What you’ll set up",
                body: [
                    "A workspace for your business.",
                    "Your invoice defaults (email, currency, tax rate, templates).",
                    "One client and one invoice to test your end-to-end flow.",
                ],
            },
            {
                heading: "Step-by-step",
                steps: [
                    { title: "Create your workspace", detail: "Workspaces keep your data separated (great for multiple businesses or teams).", href: "/docs/workspace" },
                    { title: "Add your first client", detail: "Capture name, email, phone, and address so invoices are always ready to send.", href: "/docs/clients" },
                    { title: "Create and preview an invoice", detail: "Choose a template, add line items, and preview before sending.", href: "/docs/invoicing" },
                    { title: "Enable PayGate (optional)", detail: "Add a Pay Now button and auto-update invoice status when paid.", href: "/docs/paygate" },
                ],
            },
        ],
        next: [
            { title: "Workspace setup", href: "/docs/workspace", description: "Workspaces, team members, and defaults." },
            { title: "Clients", href: "/docs/clients", description: "Create clients and manage details." },
        ],
    },
    workspace: {
        title: "Workspace",
        description: "Set up your workspace profile, invoice defaults, and team access.",
        summary: "Your workspace is the foundation for invoices, PayGate, and reporting.",
        readingTime: "7 min",
        sections: [
            {
                heading: "Workspace essentials",
                body: [
                    "A workspace contains your clients, invoices, expenses, and PayGate configuration.",
                    "If you run multiple businesses, create one workspace per business.",
                ],
            },
            {
                heading: "Recommended setup",
                steps: [
                    { title: "Open Settings", detail: "Go to your dashboard Settings and confirm your workspace name and details." },
                    { title: "Set invoice defaults", detail: "Confirm currency (ZAR), tax rate, date format, and your from email." },
                    { title: "Add your logo", detail: "Upload your logo once and reuse it across invoices." },
                    { title: "Invite your team (Pro)", detail: "Add members so they can create invoices and manage clients." },
                ],
            },
            {
                heading: "UI preview",
                mock: "workspace_switcher",
            },
        ],
        next: [
            { title: "Clients", href: "/docs/clients", description: "Add your first clients and billing details." },
            { title: "Invoicing", href: "/docs/invoicing", description: "Create invoices and track status." },
        ],
    },
    invoicing: {
        title: "Invoices",
        description: "Create professional invoices, track status, and get paid faster.",
        summary: "This guide covers drafting, sending, scheduled/recurring invoices, and client links.",
        readingTime: "9 min",
        sections: [
            {
                heading: "Create an invoice",
                steps: [
                    { title: "Go to Invoices → New", detail: "Choose invoice type (standard, scheduled, recurring)." },
                    { title: "Choose a template", detail: "Pick a layout that matches your brand." },
                    { title: "Add line items", detail: "Add descriptions, quantities, and prices." },
                    { title: "Preview", detail: "Use Preview to confirm formatting before sending." },
                ],
                links: [
                    { title: "Sending invoices by email", href: "/docs/send-invoices-by-email", description: "Send a secure link to your client." },
                ],
            },
            {
                heading: "Invoice statuses",
                body: [
                    "Draft: not sent yet.",
                    "Sent: emailed/shared with your client.",
                    "Paid: payment confirmed (automatic when PayGate is enabled).",
                ],
            },
            {
                heading: "UI preview",
                mock: "invoice_editor",
            },
        ],
        next: [
            { title: "PayGate", href: "/docs/paygate", description: "Enable online payments and auto-status updates." },
            { title: "Clients", href: "/docs/clients", description: "Keep client details accurate for faster invoicing." },
        ],
    },
    expenses: {
        title: "Expenses",
        description: "Track expenses, recurring costs, and export reports.",
        readingTime: "6 min",
        sections: [
            {
                heading: "Add expenses",
                steps: [
                    { title: "Open Expenses", detail: "Add once-off expenses as they happen." },
                    { title: "Set recurring expenses", detail: "Use recurring for subscriptions, rent, and fixed monthly costs." },
                    { title: "Export for bookkeeping", detail: "Download CSV to share with your accountant." },
                ],
            },
        ],
        next: [
            { title: "Vault", href: "/docs/vault", description: "Store receipts and key documents." },
            { title: "Troubleshooting", href: "/docs/troubleshooting", description: "Common issues and quick fixes." },
        ],
    },
    paygate: {
        title: "PayGate",
        description: "Enable online invoice payments, connect providers, and automate reconciliation.",
        summary: "PayGate adds a Pay Now button and keeps invoice status in sync when payments clear.",
        readingTime: "8 min",
        sections: [
            {
                heading: "What PayGate does",
                body: [
                    "Adds a Pay Now button to invoices.",
                    "Connects to your payment provider (PayFast, Yoco, PayStack, and more).",
                    "Auto-updates invoice status when webhooks confirm payment.",
                ],
            },
            {
                heading: "Set it up",
                steps: [
                    { title: "Go to Settings → PayGate", detail: "Choose your provider and connect your credentials." },
                    { title: "Set your primary provider", detail: "If you connect multiple, pick one as primary." },
                    { title: "Send a test invoice", detail: "Use Preview and send yourself a test invoice to confirm the Pay Now flow." },
                ],
                links: [
                    { title: "Connect PayFast", href: "/docs/payfast-online-payments", description: "Step-by-step provider setup." },
                ],
            },
            {
                heading: "UI preview",
                mock: "paygate_settings",
            },
        ],
        next: [
            { title: "Invoices", href: "/docs/invoicing", description: "Use PayGate on every invoice." },
            { title: "Troubleshooting", href: "/docs/troubleshooting", description: "If payments don’t sync." },
        ],
    },
    payments: {
        title: "PayGate & payments",
        description: "A quick overview of PayGate and payment provider connections.",
        readingTime: "3 min",
        sections: [
            {
                heading: "Start here",
                body: [
                    "This page is a short overview. For the full guide, use the PayGate doc.",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Full setup and best practices." },
                ],
            },
        ],
    },
    clients: {
        title: "Clients",
        description: "Create clients, store billing details, and reuse them across invoices.",
        summary: "Good client data makes invoicing faster and reduces mistakes.",
        readingTime: "6 min",
        sections: [
            {
                heading: "What to store",
                body: [
                    "Client name/company.",
                    "Email address (required for sending invoices).",
                    "Phone and address (optional but recommended).",
                ],
            },
            {
                heading: "Step-by-step",
                steps: [
                    { title: "Go to Clients", detail: "Click Clients in the sidebar." },
                    { title: "Create a client", detail: "Add their details and save." },
                    { title: "Use on invoices", detail: "Select the client in the invoice editor to auto-fill details.", href: "/docs/invoicing" },
                ],
            },
            {
                heading: "UI preview",
                mock: "client_create",
            },
        ],
        next: [
            { title: "Invoices", href: "/docs/invoicing", description: "Create and send invoices." },
            { title: "Workspace", href: "/docs/workspace", description: "Defaults that apply to every client and invoice." },
        ],
    },
    "client-portal": {
        title: "Client portal links",
        description: "Send secure invoice links so clients can view, download, and pay online.",
        readingTime: "4 min",
        sections: [
            {
                heading: "How it works",
                body: [
                    "Sending an invoice creates a secure link for your client.",
                    "Clients can view the invoice, download a PDF, and pay (if PayGate is enabled).",
                ],
                links: [
                    { title: "Sending invoices by email", href: "/docs/send-invoices-by-email" },
                    { title: "PayGate", href: "/docs/paygate" },
                ],
            },
        ],
    },
    settings: {
        title: "Settings & billing",
        description: "Manage your workspace profile, PayGate, members, and subscription.",
        readingTime: "5 min",
        sections: [
            {
                heading: "Where to change what",
                body: [
                    "Workspace profile and invoice defaults: Settings.",
                    "PayGate: Settings → PayGate.",
                    "Members (Pro): Settings → Members.",
                    "Billing: Settings → Billing.",
                ],
            },
        ],
    },
    "send-invoices-by-email": {
        title: "Sending invoices by email",
        description: "Send professional invoice emails with a secure view/pay link.",
        readingTime: "4 min",
        sections: [
            {
                heading: "Send an invoice",
                steps: [
                    { title: "Open your invoice", detail: "From Invoices, open the invoice you want to send." },
                    { title: "Confirm client email", detail: "Make sure the client has a valid email address." },
                    { title: "Send", detail: "Illumi sends a secure link to view and pay." },
                ],
                links: [
                    { title: "Client portal links", href: "/docs/client-portal" },
                ],
            },
        ],
    },
    "payfast-online-payments": {
        title: "Connecting PayFast",
        description: "Use PayFast as your payment provider through PayGate.",
        readingTime: "5 min",
        sections: [
            {
                heading: "Setup",
                steps: [
                    { title: "Go to Settings → PayGate", detail: "Select PayFast as your provider." },
                    { title: "Enter credentials", detail: "Paste your merchant keys / credentials from PayFast." },
                    { title: "Set as primary", detail: "If you connect multiple providers, mark PayFast as primary." },
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Full PayGate guide." },
                ],
            },
        ],
    },
    vault: {
        title: "Vault",
        description: "Store receipts and key business documents securely.",
        readingTime: "5 min",
        sections: [
            {
                heading: "What to store",
                body: [
                    "Receipts for expenses.",
                    "Invoices from suppliers.",
                    "Banking or compliance documents you need to keep handy.",
                ],
            },
            {
                heading: "Workflow",
                steps: [
                    { title: "Upload to Vault", detail: "Add a file and give it a clear name (e.g. 'AWS receipt — Jan 2026')." },
                    { title: "Organise", detail: "Keep a consistent naming style so searching is fast." },
                    { title: "Link to expense", detail: "When logging an expense, reference the Vault item if needed." },
                ],
            },
            {
                heading: "UI preview",
                mock: "vault_upload",
            },
        ],
        next: [
            { title: "Expenses", href: "/docs/expenses", description: "Track spending and export reports." },
            { title: "Troubleshooting", href: "/docs/troubleshooting", description: "Upload and sync issues." },
        ],
    },
    troubleshooting: {
        title: "Troubleshooting",
        description: "Quick fixes for common issues (payments, email sending, and loading problems).",
        readingTime: "7 min",
        sections: [
            {
                heading: "Before you do anything",
                body: [
                    "Hard refresh your browser.",
                    "Log out and back in if your session looks stale.",
                    "If you’re on localhost/dev: restart the dev server to clear HMR issues.",
                ],
            },
            {
                heading: "Checklist",
                mock: "troubleshooting_checklist",
            },
            {
                heading: "Common topics",
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "If payments don’t sync." },
                    { title: "Sending invoices by email", href: "/docs/send-invoices-by-email", description: "If emails fail to send." },
                    { title: "Contact support", href: "/contact", description: "If you’re still stuck." },
                ],
            },
        ],
    },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const doc = DOCS[slug]

    if (!doc) {
        return {}
    }

    return {
        title: `${doc.title} | Illumi Docs`,
        description: doc.description,
        alternates: {
            canonical: `/docs/${slug}`,
        },
    }
}

function UIMock({ kind }: { kind: NonNullable<DocSection["mock"]> }) {
    if (kind === "workspace_switcher") {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">Workspace</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Switch</div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold text-white">Illumi Studio</div>
                        <div className="text-xs text-white/40 mt-1">Active</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                        <div className="text-sm font-semibold text-white/70">Side Project</div>
                        <div className="text-xs text-white/30 mt-1">Click to switch</div>
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "client_create") {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">New client</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Save</div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Name</div>
                        <div className="text-sm text-white/80 mt-1">Acme Corp</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Email</div>
                        <div className="text-sm text-white/80 mt-1">billing@acme.co.za</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/2 p-3 sm:col-span-2">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Address</div>
                        <div className="text-sm text-white/60 mt-1">1 Loop Street, Cape Town</div>
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "invoice_editor") {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">Invoice editor</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Preview</div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-lg font-semibold text-white">Invoice</div>
                                <div className="text-xs text-white/40 mt-1">INV-2026-0001</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-white/40 uppercase tracking-widest">Total</div>
                                <div className="text-xl font-semibold text-white mt-1">R 4,500.00</div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="h-9 rounded-lg border border-white/10 bg-white/2" />
                            <div className="h-9 rounded-lg border border-white/10 bg-white/2" />
                            <div className="h-9 rounded-lg border border-white/10 bg-white/2" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Actions</div>
                        <div className="mt-3 space-y-2">
                            <div className="h-9 rounded-lg bg-white text-black" />
                            <div className="h-9 rounded-lg bg-white/10" />
                            <div className="h-9 rounded-lg bg-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "paygate_settings") {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">PayGate settings</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Test mode</div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold text-white">PayFast</div>
                        <div className="text-xs text-white/40 mt-1">Available</div>
                        <div className="mt-4 h-9 rounded-lg bg-white text-black" />
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold text-white">Yoco</div>
                        <div className="text-xs text-white/40 mt-1">Available</div>
                        <div className="mt-4 h-9 rounded-lg bg-white/10" />
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                        <div className="text-sm font-semibold text-white/70">PayStack</div>
                        <div className="text-xs text-white/30 mt-1">Available</div>
                        <div className="mt-4 h-9 rounded-lg bg-white/10" />
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "vault_upload") {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">Vault</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Upload</div>
                </div>
                <div className="p-6">
                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
                        <div className="text-sm font-semibold text-white">Drop a file here</div>
                        <div className="text-xs text-white/40 mt-1">PDF, PNG, JPG</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
            <div className="text-sm font-semibold text-white">Troubleshooting checklist</div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/40 uppercase tracking-widest">Check 1</div>
                    <div className="text-sm text-white/70 mt-2">Hard refresh</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/40 uppercase tracking-widest">Check 2</div>
                    <div className="text-sm text-white/70 mt-2">Confirm settings</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/2 p-4 sm:col-span-2">
                    <div className="text-xs text-white/40 uppercase tracking-widest">When to contact support</div>
                    <div className="text-sm text-white/60 mt-2">If you can reproduce the issue consistently, include screenshots and steps.</div>
                </div>
            </div>
        </div>
    )
}

export default async function DocsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const doc = DOCS[slug]

    if (!doc) notFound()

    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <MarketingHeader />
            <main className="relative z-10 flex">
                <aside className="hidden lg:block w-80 border-r border-white/10 bg-[#0a0a0a] sticky top-0 h-screen overflow-y-auto">
                    <DocsSidebar />
                </aside>

                <div className="flex-1 px-6 lg:px-12 pt-32 md:pt-40 pb-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-8">
                            <Link href="/docs" className="text-sm text-white/60 hover:text-white transition-colors">
                                Back to Documentation
                            </Link>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{doc.title}</h1>
                        <p className="text-white/50 text-lg mb-10">{doc.description}</p>

                {doc.summary && (
                    <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-white/50">Overview</div>
                                <div className="text-white/80 mt-2">{doc.summary}</div>
                            </div>
                            {doc.readingTime && (
                                <div className="text-xs font-bold uppercase tracking-widest text-white/40">
                                    {doc.readingTime} read
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-12">
                    {doc.sections.map((section, i) => (
                        <section key={i} className="space-y-4">
                            <h2 className="text-xl font-bold tracking-tight">{section.heading}</h2>

                            {section.body && (
                                <div className="space-y-3">
                                    {section.body.map((p, idx) => (
                                        <p key={idx} className="text-white/70 leading-relaxed">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {section.steps && (
                                <div className="grid grid-cols-1 gap-3">
                                    {section.steps.map((s, idx) => (
                                        <div key={idx} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="text-sm font-semibold text-white">{idx + 1}. {s.title}</div>
                                                    {s.detail && <div className="text-sm text-white/50 mt-1 leading-relaxed">{s.detail}</div>}
                                                </div>
                                                {s.href && (
                                                    <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-9 px-4">
                                                        <Link href={s.href}>Open</Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.mock && (
                                <UIMock kind={section.mock} />
                            )}

                            {section.links && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {section.links.map((l, idx) => (
                                        <Link
                                            key={idx}
                                            href={l.href}
                                            className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-colors p-5"
                                        >
                                            <div className="text-sm font-semibold text-white">{l.title}</div>
                                            {l.description && <div className="text-sm text-white/50 mt-1 leading-relaxed">{l.description}</div>}
                                            <div className="mt-3 text-xs font-bold uppercase tracking-widest text-white/40">Read</div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                {doc.next && doc.next.length > 0 && (
                    <div className="mt-12 pt-10 border-t border-white/10">
                        <div className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Next up</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {doc.next.map((n, i) => (
                                <Link
                                    key={i}
                                    href={n.href}
                                    className="rounded-2xl border border-white/10 bg-[#0a0a0a] hover:bg-white/5 hover:border-white/20 transition-colors p-6"
                                >
                                    <div className="text-lg font-semibold text-white">{n.title}</div>
                                    {n.description && <div className="text-sm text-white/50 mt-2 leading-relaxed">{n.description}</div>}
                                    <div className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40">Continue</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                        <div className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                            <div>
                                <div className="text-sm font-medium text-white">Need help?</div>
                                <div className="text-sm text-white/50">Contact us and we’ll get you sorted.</div>
                            </div>
                            <Button asChild className="bg-white text-black hover:bg-neutral-200 rounded-xl h-11 px-6">
                                <Link href="/contact">Contact Support</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
