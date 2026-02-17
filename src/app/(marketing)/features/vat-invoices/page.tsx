import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconReceipt2,
    IconShieldCheck,
    IconCalculator,
    IconFileText,
    IconBuilding,
    IconPercentage,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "VAT Invoice Software South Africa | SARS Compliant | Illumi",
    description: "Create SARS-compliant VAT invoices for South African businesses. Automatic 15% VAT calculations, all required fields included, and professional tax invoice templates. Free to use.",
    keywords: [
        "VAT invoice software",
        "VAT invoicing south africa",
        "SARS compliant invoices",
        "tax invoice software",
        "VAT invoice generator",
        "south africa VAT invoice",
        "15% VAT invoice",
        "tax invoice template south africa",
    ],
    alternates: {
        canonical: "/features/vat-invoices",
    },
    openGraph: {
        title: "VAT Invoice Software South Africa | Illumi",
        description: "Create SARS-compliant VAT invoices with automatic calculations. Free for SA businesses.",
        type: "website",
        locale: "en_ZA",
    },
}

const vatFeatures = [
    {
        icon: IconShieldCheck,
        title: "SARS Compliant",
        description: "Every invoice includes all fields required by SARS for valid tax invoices. Stay compliant without thinking about it.",
    },
    {
        icon: IconCalculator,
        title: "Automatic VAT Calculation",
        description: "Enter prices inclusive or exclusive of VAT — Illumi calculates the rest automatically at 15%.",
    },
    {
        icon: IconFileText,
        title: "Professional Templates",
        description: "Clean, professional tax invoice templates that clearly display VAT amounts and your VAT registration number.",
    },
    {
        icon: IconBuilding,
        title: "Business Details",
        description: "Your company name, address, and VAT number are automatically included on every invoice.",
    },
    {
        icon: IconPercentage,
        title: "Zero-Rated Support",
        description: "Support for zero-rated and exempt supplies. Apply different VAT rates to different line items.",
    },
    {
        icon: IconReceipt2,
        title: "Tax Invoice Records",
        description: "All invoices are stored securely for the required 5-year period. Export anytime for SARS submissions.",
    },
]

const sarsRequirements = [
    { requirement: "The words 'Tax Invoice'", included: true },
    { requirement: "Seller's name, address, and VAT number", included: true },
    { requirement: "Buyer's name and address", included: true },
    { requirement: "Buyer's VAT number (if registered)", included: true },
    { requirement: "Serial number (invoice number)", included: true },
    { requirement: "Date of issue", included: true },
    { requirement: "Description of goods/services", included: true },
    { requirement: "Quantity and unit price", included: true },
    { requirement: "Total excluding VAT", included: true },
    { requirement: "VAT amount (at 15%)", included: true },
    { requirement: "Total including VAT", included: true },
]

const faqs = [
    {
        question: "What is a VAT invoice?",
        answer: "A VAT invoice (or tax invoice) is a document issued by a VAT-registered business that includes specific information required by SARS. It allows the recipient to claim input VAT on their purchases. In South Africa, businesses with turnover exceeding R1 million must register for VAT and issue tax invoices.",
    },
    {
        question: "What must be included on a South African VAT invoice?",
        answer: "SARS requires tax invoices to include: the words 'Tax Invoice', seller's details (name, address, VAT number), buyer's details, invoice number, date, description of goods/services, quantity, price excluding VAT, VAT amount at 15%, and total including VAT. Illumi includes all of these automatically.",
    },
    {
        question: "Does Illumi calculate VAT automatically?",
        answer: "Yes. You can enter prices inclusive or exclusive of VAT, and Illumi calculates the rest. The standard 15% rate is applied automatically, and you can also apply zero-rated or exempt status to specific line items.",
    },
    {
        question: "Can I use Illumi if I'm not VAT registered?",
        answer: "Absolutely. If you're not VAT registered, simply don't add a VAT number to your profile. Your invoices will be standard invoices without VAT. When you register for VAT, just add your number and all future invoices will be tax invoices.",
    },
    {
        question: "How long must I keep VAT invoices?",
        answer: "SARS requires you to keep tax invoices for 5 years. Illumi stores all your invoices securely in the cloud, so you'll always have access to your records. You can export invoices anytime for audits or submissions.",
    },
    {
        question: "What's the VAT registration threshold in South Africa?",
        answer: "Businesses must register for VAT when taxable turnover exceeds R1 million in any 12-month period. Voluntary registration is possible for businesses with turnover between R50,000 and R1 million.",
    },
]

const vatTips = [
    {
        title: "When to Register",
        description: "You must register for VAT when your taxable turnover exceeds R1 million in any 12-month period. Voluntary registration is available from R50,000.",
    },
    {
        title: "Input vs Output VAT",
        description: "Output VAT is what you charge customers. Input VAT is what you pay on business purchases. You pay SARS the difference.",
    },
    {
        title: "Keep Good Records",
        description: "SARS requires 5 years of records. Illumi stores everything securely and lets you export anytime.",
    },
    {
        title: "Submit on Time",
        description: "VAT returns are due by the 25th of the month following the tax period. Late submissions incur penalties.",
    },
]

export default function VatInvoicesPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconReceipt2 className="h-4 w-4" />
                            VAT Invoicing
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            VAT Invoice Software for South African Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Create SARS-compliant tax invoices with automatic VAT calculations. All required fields 
                            included, professional templates, and secure record-keeping. Free for SA businesses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Create VAT Invoice Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/resources/vat-calculator">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    VAT Calculator
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            2 months Pro free • SARS compliant • Automatic calculations
                        </p>
                    </div>
                </div>
            </section>

            {/* What Is a VAT Invoice */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is a VAT Invoice?</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                A VAT invoice (also called a tax invoice) is a document issued by a VAT-registered 
                                business that includes specific information required by the South African Revenue 
                                Service (SARS). It serves as proof of a taxable transaction and allows the recipient 
                                to claim input VAT.
                            </p>
                            <p className="mb-4">
                                In South Africa, businesses with annual turnover exceeding R1 million must register 
                                for VAT and issue tax invoices for all taxable supplies. The current VAT rate is 15%.
                            </p>
                            <p>
                                Illumi makes VAT invoicing simple. Enter your VAT number once, and every invoice you 
                                create will be a fully compliant tax invoice with all required fields and automatic 
                                VAT calculations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">VAT Invoicing Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need for compliant VAT invoicing in South Africa.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vatFeatures.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SARS Requirements Checklist */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">SARS Tax Invoice Requirements</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                SARS has specific requirements for what must appear on a tax invoice. Illumi 
                                includes all of them automatically — you don't have to think about compliance.
                            </p>
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <IconShieldCheck className="h-6 w-6 text-primary" />
                                    <span className="font-medium">All Illumi invoices are SARS compliant</span>
                                </div>
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-6 bg-card">
                            <div className="text-sm font-medium text-muted-foreground mb-4">SARS Requirements Checklist</div>
                            <div className="space-y-3">
                                {sarsRequirements.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <IconCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                                        <span className="text-sm">{item.requirement}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Invoice Example */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional VAT Invoice Template</h2>
                        <p className="text-lg text-muted-foreground">
                            Clean, professional tax invoices that meet all SARS requirements.
                        </p>
                    </div>
                    <div className="border border-border rounded-2xl p-8 bg-card">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="text-2xl font-bold mb-1">TAX INVOICE</div>
                                <div className="text-sm text-muted-foreground">INV-2026-001</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">Your Business Name</div>
                                <div className="text-sm text-muted-foreground">123 Main Street, Cape Town</div>
                                <div className="text-sm text-muted-foreground">VAT No: 4123456789</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bill To</div>
                                <div className="font-medium">Acme Corporation (Pty) Ltd</div>
                                <div className="text-sm text-muted-foreground">456 Business Park, Johannesburg</div>
                                <div className="text-sm text-muted-foreground">VAT No: 4987654321</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Invoice Date</div>
                                <div className="font-medium">1 February 2026</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-3 mb-1">Due Date</div>
                                <div className="font-medium">28 February 2026</div>
                            </div>
                        </div>
                        <div className="border-t border-border pt-6 mb-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                                        <th className="text-left pb-3">Description</th>
                                        <th className="text-right pb-3">Qty</th>
                                        <th className="text-right pb-3">Unit Price</th>
                                        <th className="text-right pb-3">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2">Website Development Services</td>
                                        <td className="text-right">1</td>
                                        <td className="text-right">R 15,000.00</td>
                                        <td className="text-right">R 15,000.00</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Monthly Hosting (Annual)</td>
                                        <td className="text-right">12</td>
                                        <td className="text-right">R 250.00</td>
                                        <td className="text-right">R 3,000.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-border pt-6">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal (excl. VAT)</span>
                                        <span>R 18,000.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">VAT (15%)</span>
                                        <span>R 2,700.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                                        <span>Total (incl. VAT)</span>
                                        <span>R 20,700.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VAT Tips */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">VAT Tips for SA Businesses</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Quick tips to help you manage VAT effectively.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {vatTips.map((tip) => (
                            <div key={tip.title} className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-lg font-bold mb-2">{tip.title}</h3>
                                <p className="text-muted-foreground text-sm">{tip.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link href="/blog/vat-setup-guide" className="text-primary hover:underline">
                            Read our complete VAT guide for South African businesses →
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-border rounded-xl p-6 bg-card">
                                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Create Your First VAT Invoice Free
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        SARS-compliant tax invoices with automatic VAT calculations. 
                        Set up in minutes, invoice for free.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/invoices/new">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                Start Free Today
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invoice-software-south-africa">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Illumi VAT Invoice Software",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "featureList": ["SARS compliant invoices", "Automatic VAT calculation", "Professional templates", "Secure record keeping"],
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "ZAR",
                        },
                        "description": "VAT invoice software for South African businesses. Create SARS-compliant tax invoices with automatic 15% VAT calculations.",
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map((faq) => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer,
                            },
                        })),
                    }),
                }}
            />
        </>
    )
}
