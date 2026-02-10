import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
    IconDownload,
    IconPalette,
    IconCurrencyDollar,
    IconReceipt,
    IconBriefcase,
    IconBuildingStore,
    IconCode,
    IconCamera,
    IconTruck,
    IconStethoscope,
    IconHammer,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Invoice Template | Professional Invoice Templates Online | Illumi",
    description: "Download free professional invoice templates or create invoices online instantly. Customizable templates for freelancers, small businesses, and contractors. VAT-ready, PDF export, and automatic calculations included.",
    keywords: [
        "invoice template",
        "free invoice template",
        "professional invoice template",
        "invoice template download",
        "invoice template PDF",
        "invoice template free download",
        "freelance invoice template",
        "small business invoice template",
        "contractor invoice template",
        "VAT invoice template",
        "tax invoice template South Africa",
        "simple invoice template",
        "blank invoice template",
        "service invoice template",
        "consulting invoice template",
    ],
    openGraph: {
        title: "Free Invoice Template | Professional Templates | Illumi",
        description: "Download free professional invoice templates. Customizable, VAT-ready, instant PDF export.",
        type: "website",
    },
    alternates: {
        canonical: "/invoice-template",
    },
}

const templates = [
    {
        icon: IconBriefcase,
        name: "Professional Services",
        description: "Clean, corporate design perfect for consultants, accountants, lawyers, and professional service providers.",
        features: ["Itemised billing", "Hourly rate support", "Terms & conditions section"],
    },
    {
        icon: IconCode,
        name: "Freelancer",
        description: "Modern, minimal template ideal for designers, developers, writers, and creative professionals.",
        features: ["Project-based billing", "Milestone tracking", "Portfolio branding"],
    },
    {
        icon: IconBuildingStore,
        name: "Small Business",
        description: "Comprehensive template with full business details, perfect for retail and service businesses.",
        features: ["Product & service lines", "VAT calculations", "Payment terms"],
    },
    {
        icon: IconHammer,
        name: "Contractor",
        description: "Built for tradespeople and contractors with support for materials, labour, and project costs.",
        features: ["Materials line items", "Labour costs", "Quote-to-invoice conversion"],
    },
    {
        icon: IconCamera,
        name: "Creative Agency",
        description: "Sleek template for photographers, videographers, and creative studios.",
        features: ["Project descriptions", "Usage rights", "Deposit tracking"],
    },
    {
        icon: IconTruck,
        name: "Transport & Logistics",
        description: "Detailed template for delivery services, couriers, and logistics companies.",
        features: ["Route details", "Per-km billing", "Delivery confirmations"],
    },
    {
        icon: IconStethoscope,
        name: "Healthcare",
        description: "Professional template for doctors, therapists, and healthcare practitioners.",
        features: ["Patient details", "Medical aid info", "ICD-10 codes"],
    },
    {
        icon: IconReceipt,
        name: "Proforma Invoice",
        description: "Pre-invoice quotation template for confirming orders before payment.",
        features: ["Validity period", "Payment instructions", "Convert to tax invoice"],
    },
]

const steps = [
    { step: "1", title: "Choose a Template", description: "Pick from our collection of professional invoice templates designed for your industry." },
    { step: "2", title: "Add Your Details", description: "Fill in your business info, client details, and line items. VAT is calculated automatically." },
    { step: "3", title: "Send & Get Paid", description: "Download as PDF, email directly, or share via WhatsApp. Accept online payments instantly." },
]

const benefits = [
    "100% free — no hidden fees or credit card required",
    "Professional designs that impress clients",
    "Automatic VAT and tax calculations",
    "Instant PDF download and email sending",
    "Accept online payments via PayFast, Yoco & Stripe",
    "Track invoice status — sent, viewed, paid",
    "Recurring invoice templates for repeat clients",
    "Multi-currency support (ZAR, USD, EUR, GBP & more)",
    "Custom branding with your logo and colours",
    "Works on any device — desktop, tablet, or mobile",
]

export default function InvoiceTemplatePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <IconFileInvoice className="w-4 h-4" />
                            Free Invoice Templates — No Signup Required
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Professional Invoice Templates for Every Business
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Create beautiful, professional invoices in minutes. Choose from industry-specific templates, customise with your branding, and send to clients instantly. Free forever.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    Create Your First Invoice
                                    <IconArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/invoice-generator">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    <IconDownload className="mr-2 w-5 h-5" />
                                    Try Invoice Generator
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Trusted by 5,000+ South African businesses. No credit card needed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Invoice Templates for Every Industry
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Whether you&apos;re a freelancer, contractor, or business owner, we have an invoice template designed specifically for your needs.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {templates.map((template) => (
                            <div key={template.name} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
                                <template.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                                <ul className="space-y-1">
                                    {template.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm">
                                            <IconCheck className="w-4 h-4 text-green-500 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/login">
                            <Button size="lg">
                                Use a Template Now — It&apos;s Free
                                <IconArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How to Create an Invoice in 3 Steps
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Go from blank template to paid invoice in under 2 minutes.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {steps.map((s) => (
                            <div key={s.step} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary">{s.step}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                                <p className="text-muted-foreground">{s.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Why Choose Illumi Invoice Templates?
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                More than just templates — a complete invoicing platform that helps you get paid faster.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {benefits.map((b) => (
                                <div key={b} className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                                    <IconCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* What to Include */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            What to Include in Your Invoice Template
                        </h2>
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <p>A professional invoice template should include these essential elements to ensure you get paid on time and stay compliant with South African tax regulations:</p>
                            <div className="grid md:grid-cols-2 gap-8 not-prose mt-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Required Information</h3>
                                    <ul className="space-y-2">
                                        {[
                                            "Your business name and contact details",
                                            "Client's name and address",
                                            "Unique invoice number",
                                            "Invoice date and due date",
                                            "Detailed description of goods or services",
                                            "Quantity and unit price for each line item",
                                            "Subtotal, VAT (if applicable), and total amount",
                                            "Payment terms and accepted methods",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <IconCheck className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">For VAT-Registered Businesses</h3>
                                    <ul className="space-y-2">
                                        {[
                                            "Your VAT registration number",
                                            "Client's VAT number (if B2B)",
                                            "VAT amount clearly shown",
                                            "Tax invoice label (required by SARS)",
                                            "Total inclusive and exclusive of VAT",
                                            "Currency clearly stated (e.g., ZAR)",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <IconCheck className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-8">Illumi&apos;s invoice templates include all of these fields by default, so you never miss a required detail. Our automatic VAT calculations ensure your invoices are always compliant with SARS requirements.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            Invoice Template FAQ
                        </h2>
                        <div className="space-y-6">
                            {[
                                {
                                    q: "Are the invoice templates really free?",
                                    a: "Yes! Illumi's invoice templates are 100% free to use. Create unlimited invoices, download PDFs, and email them to clients at no cost. Our Pro plan adds features like online payments and recurring invoices.",
                                },
                                {
                                    q: "Can I customise the invoice template with my logo?",
                                    a: "Absolutely. Upload your company logo, set your brand colours, and add your business details. Every invoice you send will look uniquely yours.",
                                },
                                {
                                    q: "Do the templates support VAT calculations?",
                                    a: "Yes. Our templates automatically calculate VAT at 15% (South Africa's current rate) or any custom tax rate you set. VAT is optional — perfect for both registered and non-registered businesses.",
                                },
                                {
                                    q: "Can I send invoices directly to clients?",
                                    a: "Yes! Send invoices via email with a single click, share a payment link via WhatsApp, or download as a PDF to send manually. Clients can pay online instantly.",
                                },
                                {
                                    q: "What's the difference between an invoice template and an invoice generator?",
                                    a: "An invoice template is the design and layout of your invoice. An invoice generator is the tool that fills in the template with your data and creates the final document. Illumi combines both — beautiful templates powered by a smart invoice generator.",
                                },
                                {
                                    q: "How is Illumi different from Invoice Ninja or Conta?",
                                    a: "Illumi is built specifically for South African businesses. We support ZAR, South African payment gateways (PayFast, Yoco, Ozow), SARS-compliant VAT invoicing, and local banking details. Plus, our free plan is more generous than most competitors.",
                                },
                            ].map(({ q, a }) => (
                                <div key={q} className="bg-card rounded-lg border p-6">
                                    <h3 className="text-lg font-semibold mb-2">{q}</h3>
                                    <p className="text-muted-foreground">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stop Using Spreadsheets. Start Looking Professional.
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join thousands of businesses using Illumi to create professional invoices, track payments, and grow their revenue. Free forever.
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Create Your Free Invoice Now
                                <IconArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
