import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsCallout } from "@/components/docs/docs-callout"
import { DocsCopySnippet } from "@/components/docs/docs-copy-snippet"

type DocLink = { title: string; href: string; description?: string }

type DocSection = {
    heading: string
    body?: string[]
    steps?: { title: string; detail?: string; href?: string }[]
    links?: DocLink[]
    callouts?: { variant: "tip" | "note" | "warning"; title?: string; body: string[] }[]
    snippets?: { label: string; value: string; description?: string }[]
    mock?: "workspace_switcher" | "client_create" | "invoice_editor" | "paygate_settings" | "vault_upload" | "troubleshooting_checklist"
}

type DocArticle = {
    title: string
    description: string
    summary?: string
    readingTime?: string
    lastUpdated?: string
    sections: DocSection[]
    next?: DocLink[]
}

function toAnchorId(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
}

const DOCS: Record<string, DocArticle> = {
    "getting-started": {
        title: "Getting started",
        description: "Create your workspace, add your business details, and send your first invoice.",
        summary: "Follow this quick path to set up Illumi end-to-end.",
        readingTime: "6 min",
        lastUpdated: "2026-02-03",
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
                heading: "Before you start",
                body: [
                    "Have your business details ready (trading name, registration/VAT number if applicable, address and contact details).",
                    "If you plan to accept payments online, decide which PayGate provider you’ll use and keep the credentials handy.",
                    "If you invoice retainers, subscriptions or monthly services, you’ll probably want a recurring invoice after your first test invoice.",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Online payments + provider setup." },
                    { title: "Invoices", href: "/docs/invoicing", description: "Invoice types, recurring and sending." },
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
            {
                heading: "Your first 30-minute setup checklist",
                body: [
                    "Workspace: name, email, address, and logo uploaded.",
                    "Invoice defaults: currency (ZAR), VAT/tax rate (if applicable), invoice numbering, and any template preferences.",
                    "Client: name + billing email.",
                    "Invoice: at least 1–3 line items with correct quantities and prices.",
                    "Payment info: either bank details are filled in, or PayGate is enabled.",
                ],
                callouts: [
                    {
                        variant: "tip",
                        body: [
                            "If you’re going to use PayGate, set it up before sending invoices. It’s easier than retrofitting payment links later.",
                        ],
                    },
                ],
            },
            {
                heading: "Test your end-to-end flow",
                body: [
                    "Send yourself a test invoice and open it in an incognito/private window to see what your client sees.",
                    "If PayGate is enabled, click Pay Now and confirm the payment link opens successfully.",
                    "Download the PDF and check that your logo, tax details and bank/payment details appear as expected.",
                ],
                links: [
                    { title: "Client portal links", href: "/docs/client-portal", description: "What clients see and how the secure link works." },
                    { title: "Troubleshooting", href: "/docs/troubleshooting", description: "If links, emails or payments fail." },
                ],
            },
            {
                heading: "Common beginner mistakes",
                body: [
                    "Mixing up Test vs Live keys in PayGate (causes authentication errors).",
                    "Forgetting to add the client email (prevents sending).",
                    "Not checking the PDF/print layout before sending (logo or bottom section might not look right).",
                    "Using unclear line item descriptions (leads to delayed approvals).",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Test vs Live mode and provider keys." },
                    { title: "Invoices", href: "/docs/invoicing", description: "Preview, PDF and printing." },
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
        lastUpdated: "2026-02-03",
        sections: [
            {
                heading: "Workspace essentials",
                body: [
                    "A workspace contains your clients, invoices, expenses, and PayGate configuration.",
                    "If you run multiple businesses, create one workspace per business.",
                ],
            },
            {
                heading: "What workspace settings affect invoices",
                body: [
                    "Your logo and business details appear on invoice previews, PDFs and public client links.",
                    "Your PayGate configuration is workspace-specific, so each workspace can use a different provider.",
                    "Your invoice defaults (tax/VAT rate, currency, date format) help keep your invoices consistent.",
                ],
                links: [
                    { title: "Invoices", href: "/docs/invoicing", description: "Preview/PDF and invoice consistency." },
                    { title: "PayGate", href: "/docs/paygate", description: "Payment provider configuration." },
                ],
            },
            {
                heading: "Branding that shows on invoices",
                body: [
                    "Your workspace logo and business details are used across invoices and public client links.",
                    "If you operate multiple brands, keep branding separated by workspace.",
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "If you update your logo, regenerate/download a PDF to verify the new branding is reflected exactly how you expect.",
                        ],
                    },
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
                heading: "Best practices",
                body: [
                    "Use a consistent invoice numbering style so your accountant can reconcile quickly.",
                    "If you’re VAT registered, ensure your VAT number appears on invoices and that your VAT rate is correct.",
                    "If you plan to accept online payments, set up PayGate before sending invoices so every invoice includes a Pay Now option.",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Connect a provider and verify payments." },
                    { title: "Invoices", href: "/docs/invoicing", description: "Create, send and track invoices." },
                ],
            },
            {
                heading: "Teams (Pro)",
                body: [
                    "If you have team members, keep one person responsible for PayGate credentials (to reduce accidental key changes).",
                    "Use workspaces to separate access across different businesses or departments.",
                ],
                callouts: [
                    {
                        variant: "warning",
                        body: [
                            "Treat payment provider credentials like passwords. Only share them with trusted admins.",
                        ],
                    },
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
        lastUpdated: "2026-02-03",
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
                heading: "Invoice types (standard, scheduled, recurring)",
                body: [
                    "Standard: create and send immediately.",
                    "Scheduled: prepare now, send later.",
                    "Recurring: automatically create invoices on a set schedule (useful for retainers, subscriptions, and monthly services).",
                ],
            },
            {
                heading: "Recurring invoices (retainters & subscriptions)",
                body: [
                    "Use recurring invoices when you want Illumi to generate new invoices on a schedule.",
                    "A recurring invoice is ideal for monthly retainers, service subscriptions, and maintenance plans.",
                    "Pair recurring invoices with PayGate providers that support recurring collections when you need automatic recurring payments.",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Provider setup and payment options." },
                    { title: "PayGate & payments", href: "/docs/payments", description: "Choosing the right provider." },
                ],
                callouts: [
                    {
                        variant: "tip",
                        body: [
                            "Start by creating a normal invoice and perfecting your template, totals and payment flow. Then convert to recurring once you’re happy.",
                        ],
                    },
                ],
            },
            {
                heading: "Line items, tax, and discounts",
                body: [
                    "Use clear line descriptions so clients know what they’re paying for.",
                    "If you apply discounts, use the line discount percentage (Disc %) so totals remain transparent.",
                    "If you’re VAT registered, confirm your VAT rate and ensure the correct amounts show on the preview and PDF.",
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "Line discounts are applied per item. This makes it easy to discount only certain services while keeping others full price.",
                        ],
                    },
                ],
            },
            {
                heading: "Due dates and payment terms",
                body: [
                    "Pick a due date your client understands (e.g. 7 days, 14 days, end-of-month).",
                    "For retainer clients, use consistent billing dates to reduce payment delays.",
                    "If you accept online payments, include PayGate links so the client can pay immediately without doing a manual EFT.",
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
                heading: "Preview, PDF and printing",
                body: [
                    "Use Preview to confirm layout before sending.",
                    "Download PDF for sending outside of Illumi (or for your records).",
                    "When printing, always check the bottom of the invoice and page breaks to ensure nothing is clipped.",
                ],
                callouts: [
                    {
                        variant: "tip",
                        body: [
                            "If you change invoice mode (dark/light), always re-check the PDF output so colours and contrast remain readable.",
                        ],
                    },
                ],
            },
            {
                heading: "Getting paid faster",
                body: [
                    "Send invoices as soon as work is approved (same-day invoicing tends to get paid faster).",
                    "Use clear line items and attach any supporting documents if your client requires them.",
                    "Enable PayGate so clients can pay immediately by card or Pay by Bank (provider dependent).",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Enable Pay Now links." },
                    { title: "Client portal links", href: "/docs/client-portal", description: "What clients see." },
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
        lastUpdated: "2026-02-03",
        sections: [
            {
                heading: "Add expenses",
                steps: [
                    { title: "Open Expenses", detail: "Add once-off expenses as they happen." },
                    { title: "Set recurring expenses", detail: "Use recurring for subscriptions, rent, and fixed monthly costs." },
                    { title: "Export for bookkeeping", detail: "Download CSV to share with your accountant." },
                ],
            },
            {
                heading: "Tips for clean records",
                body: [
                    "Use consistent categories (e.g. Software, Travel, Marketing, Equipment).",
                    "Attach receipts in Vault so you can find supporting documents later.",
                    "If you have recurring expenses, set them up once so monthly reporting stays accurate.",
                ],
                links: [
                    { title: "Vault", href: "/docs/vault", description: "Store receipts and documents." },
                ],
            },
            {
                heading: "Recurring expenses",
                body: [
                    "Use recurring expenses for subscriptions like Adobe, Google Workspace, hosting, rent, and insurance.",
                    "Recurring expenses reduce manual admin and improve month-to-month reporting consistency.",
                    "If you cancel a subscription, update or disable the recurring expense so reports stay accurate.",
                ],
                callouts: [
                    {
                        variant: "tip",
                        body: [
                            "If you’re unsure how to categorise an expense, use a simple category now and refine later — consistency matters more than perfection.",
                        ],
                    },
                ],
            },
            {
                heading: "Exporting for your accountant",
                body: [
                    "Export CSV regularly (monthly is common).",
                    "Make sure each expense has a clear description that matches the receipt/vendor.",
                    "Keep supporting receipts in Vault and use consistent naming so you can find them quickly during reconciliations.",
                ],
                links: [
                    { title: "Vault", href: "/docs/vault", description: "Store receipts and documents." },
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
        lastUpdated: "2026-02-03",
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
                heading: "Payment links vs webhooks",
                body: [
                    "Payment link generation creates a hosted checkout page for the client.",
                    "Webhooks are optional server callbacks that can mark invoices paid automatically after payment completes.",
                    "Some providers support webhooks in Illumi today; others may still be link-only.",
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "If your provider is link-only, you can still use PayGate to collect payment — you’ll just mark invoices paid manually or rely on provider reconciliation.",
                        ],
                    },
                ],
            },
            {
                heading: "Test mode vs Live mode",
                body: [
                    "Use Test mode to validate your setup before charging real customers.",
                    "Use Live mode when you’re ready to take real payments.",
                    "If you see authentication errors (e.g. invalid_client), the most common cause is a mismatch between selected mode and the credentials you entered.",
                ],
                callouts: [
                    {
                        variant: "tip",
                        title: "Fast check",
                        body: [
                            "If PayGate is set to Live mode, make sure you’ve entered Live keys (not test keys).",
                            "If PayGate is set to Test mode, make sure you’ve entered test/sandbox keys.",
                        ],
                    },
                ],
            },
            {
                heading: "Which credentials do I paste into PayGate?",
                body: [
                    "Each provider uses different credential names (Merchant ID, Secret Key, Client ID, etc). Illumi shows the exact field labels for the selected provider.",
                    "Keep credentials private. Never share them in emails or invoices.",
                    "If you rotate keys in your provider dashboard, update them in Settings → PayGate immediately.",
                ],
                links: [
                    { title: "Browse integrations", href: "/integrations", description: "Provider-specific key lists + official docs." },
                ],
                callouts: [
                    {
                        variant: "warning",
                        body: [
                            "Never paste provider secret keys into invoices, emails, or client notes. Only paste them into Settings → PayGate.",
                        ],
                    },
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
                    { title: "Connect Stitch", href: "/docs/stitch-online-payments", description: "Client ID + Client Secret setup." },
                    { title: "Connect Netcash", href: "/docs/netcash-online-payments", description: "Service Key + API Key setup." },
                ],
                snippets: [
                    {
                        label: "Pay page URL format",
                        value: "https://www.illumi.co.za/pay/<INVOICE_NUMBER>?provider=<provider>",
                        description: "Use this format to share a direct pay link (provider is optional if you set a primary provider).",
                    },
                ],
            },
            {
                heading: "Webhooks (payment status updates)",
                body: [
                    "Some providers send a server-to-server webhook after payment completes so Illumi can automatically mark the invoice paid.",
                    "Only configure webhook endpoints that match your connected provider. If you’re unsure, start by testing Pay Now links first.",
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "Stripe uses a webhook secret (STRIPE_WEBHOOK_SECRET) to verify events. If you set up Stripe webhooks, you must set that secret on the server.",
                        ],
                    },
                ],
                snippets: [
                    {
                        label: "Stripe webhook endpoint",
                        value: "https://www.illumi.co.za/api/webhooks/paygate",
                        description: "Use this endpoint when configuring Stripe webhooks (Checkout Session Completed).",
                    },
                    {
                        label: "PayFast ITN endpoint (subscription / server notifications)",
                        value: "https://www.illumi.co.za/api/payfast/notify",
                        description: "Use this endpoint if your PayFast flow requires ITN/notify callbacks (provider dependent).",
                    },
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
    "stitch-online-payments": {
        title: "Connecting Stitch",
        description: "Use Stitch as your PayGate provider (Pay by Bank + card payments).",
        readingTime: "6 min",
        lastUpdated: "2026-02-03",
        sections: [
            {
                heading: "What you’ll need",
                body: [
                    "Stitch Client ID.",
                    "Stitch Client Secret.",
                    "Choose Test vs Live mode based on your Stitch environment.",
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "If you get invalid_client, it’s almost always because the selected mode (Test/Live) doesn’t match the keys you pasted.",
                        ],
                    },
                ],
                links: [
                    { title: "Stitch payment products", href: "https://docs.stitch.money/payment-products", description: "Official docs" },
                    { title: "Stitch client tokens", href: "https://docs.stitch.money/authentication/client-tokens", description: "Official docs" },
                ],
            },
            {
                heading: "Step-by-step",
                steps: [
                    { title: "Open Illumi Settings → PayGate", detail: "In your dashboard, go to Settings and open PayGate." },
                    { title: "Select Stitch", detail: "Choose Stitch as your provider and click Connect." },
                    { title: "Paste your Client ID + Client Secret", detail: "Add credentials for Test mode or Live mode (depending on your environment)." },
                    { title: "Save and set as primary (optional)", detail: "If you use multiple providers, set Stitch as your primary provider." },
                    { title: "Send a test invoice", detail: "Open an invoice preview and click Pay Now to verify the payment link flow." },
                ],
            },
            {
                heading: "Common issues",
                body: [
                    "If you see invalid_client: confirm Test vs Live mode matches your Stitch credentials.",
                    "If payments don’t update status: confirm your PayGate webhook settings and provider callbacks.",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Overview + troubleshooting" },
                    { title: "Troubleshooting", href: "/docs/troubleshooting", description: "Quick checks" },
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "Stitch payment link generation is supported through PayGate. Automatic invoice status updates may be provider/webhook dependent and can vary by setup.",
                        ],
                    },
                ],
            },
        ],
        next: [
            { title: "PayGate", href: "/docs/paygate", description: "Overview" },
            { title: "Invoices", href: "/docs/invoicing", description: "Create and send invoices" },
        ],
    },
    "netcash-online-payments": {
        title: "Connecting Netcash",
        description: "Use Netcash as your PayGate provider (payment links + subscriptions).",
        readingTime: "6 min",
        lastUpdated: "2026-02-03",
        sections: [
            {
                heading: "What you’ll need",
                body: [
                    "Netcash Service Key.",
                    "Netcash API Key.",
                    "Choose Test vs Live mode based on your Netcash environment.",
                ],
                links: [
                    { title: "Netcash payment gateway", href: "https://netcash.co.za/services/payment-gateway/", description: "Official overview" },
                    { title: "Netcash subscriptions", href: "https://netcash.co.za/services/payment-gateway/subscription-billing/", description: "Official overview" },
                ],
            },
            {
                heading: "Step-by-step",
                steps: [
                    { title: "Open Illumi Settings → PayGate", detail: "In your dashboard, go to Settings and open PayGate." },
                    { title: "Select Netcash", detail: "Choose Netcash as your provider and click Connect." },
                    { title: "Paste your Service Key + API Key", detail: "Add credentials for Test mode or Live mode (depending on your environment)." },
                    { title: "Save and set as primary (optional)", detail: "If you use multiple providers, set Netcash as your primary provider." },
                    { title: "Send a test invoice", detail: "Open an invoice preview and click Pay Now to verify the payment link flow." },
                ],
            },
            {
                heading: "Common issues",
                body: [
                    "If the payment link fails: confirm your keys are correct and match the selected mode (Test vs Live).",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Overview + troubleshooting" },
                    { title: "Troubleshooting", href: "/docs/troubleshooting", description: "Quick checks" },
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "Netcash payment link generation is supported through PayGate. If you need automatic status updates, your provider/webhook setup may require additional configuration.",
                        ],
                    },
                ],
            },
        ],
        next: [
            { title: "PayGate", href: "/docs/paygate", description: "Overview" },
            { title: "Invoices", href: "/docs/invoicing", description: "Create and send invoices" },
        ],
    },
    payments: {
        title: "PayGate & payments",
        description: "A quick overview of PayGate and payment provider connections.",
        readingTime: "3 min",
        lastUpdated: "2026-02-03",
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
            {
                heading: "Choosing a provider",
                body: [
                    "If most of your clients are in South Africa, Instant EFT / Pay by Bank can reduce friction.",
                    "If you have international clients, card-based providers can be easier for them.",
                    "If you want recurring collections, choose a provider that supports tokens/subscriptions and complete their onboarding steps.",
                ],
                links: [
                    { title: "Integrations", href: "/integrations", description: "Compare providers and credential requirements." },
                ],
            },
            {
                heading: "Recurring collections (important)",
                body: [
                    "Recurring invoicing and recurring payments are related but not the same.",
                    "Recurring invoices: Illumi automatically generates new invoices on a schedule.",
                    "Recurring payments: the payment provider charges the customer automatically (token/subscription).",
                    "If you need automatic recurring payments, choose a provider that supports tokenization/subscriptions and complete their setup steps.",
                ],
                callouts: [
                    {
                        variant: "tip",
                        body: [
                            "Start with recurring invoices first. Once that’s stable, add provider-level subscriptions if your business requires it.",
                        ],
                    },
                ],
            },
        ],
    },
    clients: {
        title: "Clients",
        description: "Create clients, store billing details, and reuse them across invoices.",
        summary: "Good client data makes invoicing faster and reduces mistakes.",
        readingTime: "6 min",
        lastUpdated: "2026-02-03",
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
                heading: "Best practices",
                body: [
                    "Use the billing contact email your client expects invoices from.",
                    "Store a correct VAT number (if applicable) so VAT invoices are valid.",
                    "If you bill different departments, create separate client entries so sending is always accurate.",
                ],
            },
            {
                heading: "Client billing workflow",
                body: [
                    "Create the client once and keep their billing details up to date.",
                    "When creating invoices, always select the client from your client list so details auto-fill correctly.",
                    "If a client changes their billing contact, update the client record before sending the next invoice.",
                ],
                callouts: [
                    {
                        variant: "note",
                        body: [
                            "If you bill multiple contacts at the same company, separate client records per contact is often simpler than trying to manage multiple billing emails on one record.",
                        ],
                    },
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
        lastUpdated: "2026-02-03",
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
            {
                heading: "What your client can do",
                body: [
                    "View invoice details and totals.",
                    "Download a PDF copy.",
                    "Pay online when PayGate is enabled (provider dependent).",
                ],
            },
            {
                heading: "Security notes",
                body: [
                    "Treat invoice links like private documents (they include sensitive pricing and client data).",
                    "If you need to revoke access, void the invoice and reissue a new one (best practice).",
                ],
            },
        ],
    },
    settings: {
        title: "Settings & billing",
        description: "Manage your workspace profile, PayGate, members, and subscription.",
        readingTime: "5 min",
        lastUpdated: "2026-02-03",
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
            {
                heading: "Recommended setup order",
                body: [
                    "1) Workspace profile + logo.",
                    "2) Invoice defaults (currency, VAT, email).",
                    "3) PayGate provider (optional).",
                    "4) Add clients.",
                ],
            },
            {
                heading: "Pro billing & recurring charges",
                body: [
                    "Your subscription provider (e.g. PayFast) can send recurring payment notifications to Illumi.",
                    "If a charge fails, your Pro access may lapse when the current period expires.",
                ],
                links: [
                    { title: "Troubleshooting", href: "/docs/troubleshooting", description: "If billing or payments look incorrect." },
                ],
            },
            {
                heading: "Security best practices",
                body: [
                    "Only admins should manage PayGate provider keys.",
                    "Never share provider secret keys in emails, invoices, or support tickets.",
                    "Rotate provider keys if you suspect they were exposed.",
                ],
                callouts: [
                    {
                        variant: "warning",
                        body: [
                            "Treat payment provider credentials like passwords. Anyone with your secret keys can potentially create charges or payment requests in your name.",
                        ],
                    },
                ],
            },
        ],
    },
    "send-invoices-by-email": {
        title: "Sending invoices by email",
        description: "Send professional invoice emails with a secure view/pay link.",
        readingTime: "4 min",
        lastUpdated: "2026-02-03",
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
            {
                heading: "Delivery tips",
                body: [
                    "If a client says they didn’t receive the email, ask them to check spam/junk and search for the invoice number.",
                    "If you resend invoices frequently, keep the subject line consistent so clients can thread emails.",
                ],
                links: [
                    { title: "Troubleshooting", href: "/docs/troubleshooting", description: "Email delivery + link issues." },
                ],
            },
            {
                heading: "What the client receives",
                body: [
                    "A professional email with a secure link to view the invoice.",
                    "From the client portal, they can download the PDF.",
                    "If PayGate is enabled, they can pay online via the Pay Now button (provider dependent).",
                ],
                links: [
                    { title: "Client portal links", href: "/docs/client-portal", description: "What clients see and can do." },
                    { title: "PayGate", href: "/docs/paygate", description: "Enable Pay Now links." },
                ],
            },
        ],
    },
    "payfast-online-payments": {
        title: "Connecting PayFast",
        description: "Use PayFast as your payment provider through PayGate.",
        readingTime: "5 min",
        lastUpdated: "2026-02-03",
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
            {
                heading: "PayFast ITN / notify URL",
                body: [
                    "PayFast can send server notifications (ITN) for subscription/recurring events.",
                    "Illumi listens for those notifications at the endpoint below.",
                ],
                snippets: [
                    {
                        label: "PayFast notify URL",
                        value: "https://www.illumi.co.za/api/payfast/notify",
                        description: "Use this as the notify/ITN callback URL when required by your PayFast setup.",
                    },
                ],
                callouts: [
                    {
                        variant: "warning",
                        body: [
                            "Keep your PayFast passphrase consistent between PayFast and Illumi server settings. Signature validation is a primary security control.",
                        ],
                    },
                ],
            },
            {
                heading: "What PayFast keys mean",
                body: [
                    "Merchant ID: identifies your PayFast account.",
                    "Merchant Key: used to sign/verify requests.",
                    "Passphrase (optional): extra signing security you configure in PayFast.",
                ],
                links: [
                    { title: "PayFast docs", href: "https://developers.payfast.co.za/", description: "Official docs" },
                ],
            },
        ],
    },
    vault: {
        title: "Vault",
        description: "Store receipts and key business documents securely.",
        readingTime: "5 min",
        lastUpdated: "2026-02-03",
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
                heading: "Naming conventions that work",
                body: [
                    "Start names with vendor + month (e.g. 'Vodacom — 2026-02').",
                    "Include invoice/receipt numbers if you reconcile manually.",
                    "Avoid generic names like 'receipt.pdf' — you won’t find them later.",
                ],
            },
            {
                heading: "Recommended structure",
                body: [
                    "Use consistent naming so searching is fast.",
                    "Group by vendor + month, or client + project if you store client-related docs.",
                    "Attach receipts to expenses where possible to simplify audits and bookkeeping.",
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
        lastUpdated: "2026-02-03",
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
                heading: "PayGate problems",
                body: [
                    "If Pay Now fails: confirm the active provider is connected and credentials are saved.",
                    "If you get authentication errors: verify Test vs Live mode matches the keys you entered.",
                    "If invoice status doesn’t update: this is usually webhook/provider dependent — check PayGate docs and provider settings.",
                ],
                links: [
                    { title: "PayGate", href: "/docs/paygate", description: "Provider setup + verification" },
                    { title: "Integrations", href: "/integrations", description: "Provider-specific docs" },
                ],
                snippets: [
                    {
                        label: "PayGate webhook endpoint (Stripe / generic)",
                        value: "https://www.illumi.co.za/api/webhooks/paygate",
                        description: "If you’re setting up Stripe webhooks, point Stripe to this endpoint.",
                    },
                ],
            },
            {
                heading: "PDF / printing problems",
                body: [
                    "If a PDF looks blank: try downloading again and confirm your browser isn’t blocking it.",
                    "If the printed invoice is clipped: use the Preview/PDF layout and avoid browser scaling that cuts off the bottom.",
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
            {
                heading: "What to send support",
                body: [
                    "Invoice number and workspace name.",
                    "Which provider you used (PayFast/Stripe/Stitch/etc).",
                    "Screenshot of the error + the time it occurred.",
                    "Whether PayGate was set to Test or Live mode.",
                ],
                callouts: [
                    {
                        variant: "tip",
                        body: [
                            "If the issue is payment-related, include whether you clicked Pay Now from Preview, from an emailed link, or from the public pay page.",
                        ],
                    },
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
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Workspace</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Switch</div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-muted p-4">
                        <div className="text-sm font-semibold text-foreground">Illumi Studio</div>
                        <div className="text-xs text-muted-foreground mt-1">Active</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4 hover:bg-accent transition-colors cursor-pointer">
                        <div className="text-sm font-semibold text-muted-foreground">Side Project</div>
                        <div className="text-xs text-muted-foreground mt-1">Click to switch</div>
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "client_create") {
        return (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New client</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Save</div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-muted p-3">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Name</div>
                        <div className="text-sm text-foreground mt-1">Acme Corp</div>
                    </div>
                    <div className="rounded-xl border border-border bg-muted p-3">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Email</div>
                        <div className="text-sm text-foreground mt-1">billing@acme.co.za</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3 sm:col-span-2">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Address</div>
                        <div className="text-sm text-foreground mt-1">1 Loop Street, Cape Town</div>
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "invoice_editor") {
        return (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invoice editor</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preview</div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 rounded-xl border border-border bg-muted p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-lg font-semibold text-foreground">Invoice</div>
                                <div className="text-xs text-muted-foreground mt-1">INV-2026-0001</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Total</div>
                                <div className="text-xl font-semibold text-foreground mt-1">R 4,500.00</div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="h-9 rounded-lg border border-border bg-background flex items-center px-3">
                                <span className="text-xs text-muted-foreground">Website Design</span>
                                <span className="ml-auto text-xs text-foreground">R 2,500.00</span>
                            </div>
                            <div className="h-9 rounded-lg border border-border bg-background flex items-center px-3">
                                <span className="text-xs text-muted-foreground">Development</span>
                                <span className="ml-auto text-xs text-foreground">R 1,500.00</span>
                            </div>
                            <div className="h-9 rounded-lg border border-border bg-background flex items-center px-3">
                                <span className="text-xs text-muted-foreground">Hosting (monthly)</span>
                                <span className="ml-auto text-xs text-foreground">R 500.00</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Actions</div>
                        <div className="mt-3 space-y-2">
                            <div className="h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">Send Invoice</div>
                            <div className="h-9 rounded-lg bg-accent flex items-center justify-center text-xs text-foreground">Download PDF</div>
                            <div className="h-9 rounded-lg bg-accent flex items-center justify-center text-xs text-foreground">Preview</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "paygate_settings") {
        return (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">PayGate settings</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Test mode</div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-muted p-4">
                        <div className="text-sm font-semibold text-foreground">PayFast</div>
                        <div className="text-xs text-muted-foreground mt-1">Available</div>
                        <div className="mt-4 h-9 rounded-lg bg-primary text-primary-foreground" />
                    </div>
                    <div className="rounded-xl border border-border bg-muted p-4">
                        <div className="text-sm font-semibold text-foreground">Yoco</div>
                        <div className="text-xs text-muted-foreground mt-1">Available</div>
                        <div className="mt-4 h-9 rounded-lg bg-accent" />
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4">
                        <div className="text-sm font-semibold text-foreground">PayStack</div>
                        <div className="text-xs text-muted-foreground mt-1">Available</div>
                        <div className="mt-4 h-9 rounded-lg bg-accent flex items-center justify-center text-xs text-foreground">Connect</div>
                    </div>
                </div>
            </div>
        )
    }

    if (kind === "vault_upload") {
        return (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vault</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Upload</div>
                </div>
                <div className="p-6">
                    <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
                        <div className="text-sm font-semibold text-foreground">Drop a file here</div>
                        <div className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm font-semibold text-foreground">Troubleshooting checklist</div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-muted p-4">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Check 1</div>
                    <div className="text-sm text-muted-foreground mt-2">Hard refresh</div>
                </div>
                <div className="rounded-xl border border-border bg-muted p-4">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Check 2</div>
                    <div className="text-sm text-muted-foreground mt-2">Confirm settings</div>
                </div>
                <div className="rounded-xl border border-border bg-background p-4 sm:col-span-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">When to contact support</div>
                    <div className="text-sm text-foreground mt-2">If you can reproduce the issue consistently, include screenshots and steps.</div>
                </div>
            </div>
        </div>
    )
}

export default async function DocsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const doc = DOCS[slug]

    if (!doc) notFound()

    const sectionsWithIds = doc.sections.map((section, i) => ({
        ...section,
        id: `${toAnchorId(section.heading)}-${i + 1}`,
    }))

    return (
        <div className="min-h-screen bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            <main className="relative z-10 flex">
                <aside className="hidden lg:block w-80 border-r border-border bg-card sticky top-0 h-screen overflow-y-auto">
                    <DocsSidebar />
                </aside>

                <div className="flex-1 px-6 lg:px-12 pt-32 md:pt-40 pb-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Back to Documentation
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10">
                            <article>
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{doc.title}</h1>
                                <p className="text-muted-foreground text-lg leading-relaxed mb-10">{doc.description}</p>

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
                                    {doc.readingTime && (
                                        <div>{doc.readingTime} read</div>
                                    )}
                                    {doc.lastUpdated && (
                                        <div>Last updated {doc.lastUpdated}</div>
                                    )}
                                </div>

                                {doc.summary && (
                                    <div className="mb-10 rounded-3xl border border-border bg-card p-7">
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overview</div>
                                            <div className="text-foreground/80 mt-2 leading-relaxed">{doc.summary}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-14">
                                    {sectionsWithIds.map((section, i) => (
                                        <section key={section.id} id={section.id} className="scroll-mt-28 space-y-5">
                                            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{section.heading}</h2>

                                            {section.body && (
                                                <div className="space-y-4">
                                                    {section.body.map((p, idx) => (
                                                        <p key={idx} className="text-muted-foreground leading-relaxed text-[15px]">
                                                            {p}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}

                                            {section.steps && (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {section.steps.map((s, idx) => (
                                                        <div key={idx} className="rounded-3xl border border-border bg-card p-6">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <div className="text-sm font-semibold text-foreground">{idx + 1}. {s.title}</div>
                                                                    {s.detail && <div className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.detail}</div>}
                                                                </div>
                                                                {s.href && (
                                                                    <Button asChild variant="outline" className="border-border bg-background hover:bg-accent text-foreground h-9 px-4">
                                                                        <Link href={s.href}>Open</Link>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {section.callouts && section.callouts.length > 0 && (
                                                <div className="space-y-3">
                                                    {section.callouts.map((c, idx) => (
                                                        <DocsCallout
                                                            key={idx}
                                                            variant={c.variant}
                                                            title={c.title}
                                                            body={c.body}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {section.snippets && section.snippets.length > 0 && (
                                                <div className="space-y-3">
                                                    {section.snippets.map((s, idx) => (
                                                        <DocsCopySnippet
                                                            key={idx}
                                                            label={s.label}
                                                            value={s.value}
                                                            description={s.description}
                                                        />
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
                                                            className="rounded-3xl border border-border bg-card hover:bg-accent transition-colors p-6"
                                                        >
                                                            <div className="text-sm font-semibold text-foreground">{l.title}</div>
                                                            {l.description && <div className="text-sm text-muted-foreground mt-2 leading-relaxed">{l.description}</div>}
                                                            <div className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Read</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    ))}
                                </div>

                                {doc.next && doc.next.length > 0 && (
                                    <div className="mt-14 pt-10 border-t border-border">
                                        <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Next up</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {doc.next.map((n, i) => (
                                                <Link
                                                    key={i}
                                                    href={n.href}
                                                    className="rounded-3xl border border-border bg-card hover:bg-accent transition-colors p-7"
                                                >
                                                    <div className="text-lg font-semibold text-foreground">{n.title}</div>
                                                    {n.description && <div className="text-sm text-muted-foreground mt-2 leading-relaxed">{n.description}</div>}
                                                    <div className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Continue</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>

                            <aside className="hidden lg:block">
                                <div className="sticky top-32 rounded-3xl border border-border bg-card p-6">
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">On this page</div>
                                    <div className="mt-4 space-y-1">
                                        {sectionsWithIds.map((s) => (
                                            <a
                                                key={s.id}
                                                href={`#${s.id}`}
                                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors leading-relaxed"
                                            >
                                                {s.heading}
                                            </a>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-border">
                                        <Link
                                            href="/integrations"
                                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Browse integrations
                                        </Link>
                                        <Link
                                            href="/docs/paygate"
                                            className="mt-2 block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            PayGate setup
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
