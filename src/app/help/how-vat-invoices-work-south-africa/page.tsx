import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconAlertCircle,
    IconFileInvoice,
    IconCalculator,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "How VAT Invoices Work in South Africa | SARS Requirements | Illumi",
    description: "Complete guide to VAT invoices in South Africa. Learn SARS requirements, what must be included on a tax invoice, and how to stay compliant with South African tax law.",
    keywords: [
        "vat invoice south africa",
        "sars invoice requirements",
        "tax invoice south africa",
        "vat invoice requirements",
        "south africa vat 15%",
        "sars compliant invoice",
        "vat registration invoice",
        "tax invoice template south africa",
    ],
    alternates: {
        canonical: "/help/how-vat-invoices-work-south-africa",
    },
    openGraph: {
        title: "How VAT Invoices Work in South Africa | Illumi",
        description: "Complete guide to SARS-compliant VAT invoices for South African businesses.",
        type: "article",
        locale: "en_ZA",
    },
}

const requiredFields = [
    {
        field: "The words 'Tax Invoice'",
        description: "Must be prominently displayed on the document",
        required: true,
    },
    {
        field: "Supplier's name, address, and VAT number",
        description: "Your registered business details",
        required: true,
    },
    {
        field: "Recipient's name and address",
        description: "Your customer's details",
        required: true,
    },
    {
        field: "Unique invoice number",
        description: "Sequential numbering is recommended",
        required: true,
    },
    {
        field: "Date of issue",
        description: "When the invoice was created",
        required: true,
    },
    {
        field: "Description of goods/services",
        description: "Clear description of what was supplied",
        required: true,
    },
    {
        field: "Quantity and unit price",
        description: "For each line item",
        required: true,
    },
    {
        field: "VAT amount",
        description: "Shown separately from the total",
        required: true,
    },
    {
        field: "Total amount including VAT",
        description: "The final amount payable",
        required: true,
    },
]

const vatRates = [
    { rate: "15%", description: "Standard rate for most goods and services", examples: "Consulting, products, most services" },
    { rate: "0%", description: "Zero-rated supplies", examples: "Exports, basic food items, fuel levy goods" },
    { rate: "Exempt", description: "VAT-exempt supplies", examples: "Financial services, residential rent, public transport" },
]

const commonMistakes = [
    "Missing the words 'Tax Invoice' on the document",
    "Not showing VAT as a separate line item",
    "Using an incorrect or expired VAT number",
    "Issuing invoices before registering for VAT",
    "Not keeping copies of invoices for 5 years",
    "Incorrect VAT calculations (should be 15% of the VAT-exclusive amount)",
]

const faqs = [
    {
        question: "When do I need to register for VAT in South Africa?",
        answer: "You must register for VAT if your taxable turnover exceeds R1 million in any 12-month period. You may voluntarily register if your turnover exceeds R50,000.",
    },
    {
        question: "Can I claim VAT on invoices that don't say 'Tax Invoice'?",
        answer: "No. SARS requires the words 'Tax Invoice' to appear on the document for you to claim input VAT. Regular invoices or receipts are not sufficient.",
    },
    {
        question: "How long must I keep VAT invoices?",
        answer: "SARS requires you to keep all tax invoices for at least 5 years from the date of the last entry in the books.",
    },
    {
        question: "What's the difference between a tax invoice and a regular invoice?",
        answer: "A tax invoice includes VAT details and meets SARS requirements, allowing the recipient to claim input VAT. A regular invoice is just a request for payment without VAT implications.",
    },
]

export default function HowVatInvoicesWorkPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="bg-background">
                {/* Hero Section */}
                <section className="relative py-24 md:py-32 pt-32 md:pt-40">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
                            <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
                            <span>/</span>
                            <span>VAT Invoices in South Africa</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            How VAT Invoices Work in South Africa
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            A complete guide to creating SARS-compliant tax invoices. Learn what's required, avoid common mistakes, and stay on the right side of South African tax law.
                        </p>
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                            <IconAlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground">
                                <strong>Important:</strong> This guide is for informational purposes. Consult a registered tax practitioner for advice specific to your situation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What is a VAT Invoice */}
                <section className="py-16 bg-muted/30">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            What is a VAT Invoice (Tax Invoice)?
                        </h2>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p>
                                A VAT invoice, officially called a "tax invoice" in South Africa, is a document that a VAT-registered supplier must issue when making a taxable supply of goods or services. It serves as proof of the transaction and allows the recipient to claim input VAT.
                            </p>
                            <p>
                                The current VAT rate in South Africa is <strong>15%</strong>, which has been in effect since 1 April 2018.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Required Fields */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground mb-8">
                            What Must Be on a Tax Invoice?
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            SARS requires the following information on every tax invoice:
                        </p>
                        <div className="space-y-3">
                            {requiredFields.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                                    <IconCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-medium text-foreground">{item.field}</span>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* VAT Rates */}
                <section className="py-16 bg-muted/30">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground mb-8">
                            VAT Rates in South Africa
                        </h2>
                        <div className="space-y-4">
                            {vatRates.map((rate, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl font-bold text-primary">{rate.rate}</span>
                                        <span className="text-lg font-medium text-foreground">{rate.description}</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        <strong>Examples:</strong> {rate.examples}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* VAT Calculation */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground mb-8">
                            How to Calculate VAT
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <IconCalculator className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-4">Adding VAT (VAT Exclusive → Inclusive)</h3>
                                <div className="space-y-2 text-muted-foreground">
                                    <p>Amount × 1.15 = VAT-inclusive amount</p>
                                    <p className="text-sm">Example: R1,000 × 1.15 = R1,150</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <IconCalculator className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-4">Extracting VAT (VAT Inclusive → VAT Amount)</h3>
                                <div className="space-y-2 text-muted-foreground">
                                    <p>Amount × 15 ÷ 115 = VAT amount</p>
                                    <p className="text-sm">Example: R1,150 × 15 ÷ 115 = R150</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Common Mistakes */}
                <section className="py-16 bg-muted/30">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground mb-8">
                            Common VAT Invoice Mistakes
                        </h2>
                        <div className="space-y-3">
                            {commonMistakes.map((mistake, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <IconAlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-foreground">{mistake}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground mb-8">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-muted/30">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
                        <IconFileInvoice className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            Create SARS-Compliant Invoices
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Illumi automatically includes all required fields for South African tax invoices. VAT is calculated correctly every time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                            >
                                <Link href="/login">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted"
                            >
                                <Link href="/features/invoicing">See Features</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Related Articles */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            Related Articles
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Link href="/help/what-is-invoice-management" className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
                                <h3 className="font-semibold text-foreground mb-1">What is Invoice Management?</h3>
                                <p className="text-sm text-muted-foreground">Learn the basics of managing invoices for your business.</p>
                            </Link>
                            <Link href="/features/invoice-reports" className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
                                <h3 className="font-semibold text-foreground mb-1">Invoice Reports</h3>
                                <p className="text-sm text-muted-foreground">Generate VAT reports for SARS submissions.</p>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
