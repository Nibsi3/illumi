import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Examples: 8 Real Invoice Samples for Every Industry | Illumi",
    description: "Browse 8 real invoice examples for freelancers, contractors, consultants, retailers, and small businesses. See exactly what to include and download free templates.",
    keywords: [
        "invoice example",
        "invoice sample",
        "invoice examples for freelancers",
        "simple invoice example",
        "professional invoice example",
        "invoice format",
        "invoice layout example",
        "what does an invoice look like",
        "invoice example South Africa",
    ],
    alternates: { canonical: "/blog/invoice-examples" },
}

const examples = [
    {
        title: "1. Freelance Designer Invoice",
        description: "A clean, branded invoice for a graphic designer billing a logo design project. Includes project description, deliverables, and payment terms.",
        includes: ["Business logo and branding", "Project name and description", "Fixed project fee", "50% deposit noted", "Net 14 payment terms"],
    },
    {
        title: "2. Web Developer Invoice",
        description: "A detailed invoice for a website build with milestone-based billing. Shows completed phases and remaining balance.",
        includes: ["Milestone breakdown", "Hours per phase", "Hourly rate calculation", "Subtotal per milestone", "Total project cost"],
    },
    {
        title: "3. Consulting Invoice",
        description: "An hourly consulting invoice with session dates, hours, and rate. Perfect for business consultants, coaches, and advisors.",
        includes: ["Date of each session", "Hours per session", "Hourly rate", "Total hours and amount", "Retainer credit (if applicable)"],
    },
    {
        title: "4. Contractor / Tradesperson Invoice",
        description: "A contractor invoice separating materials and labour. Ideal for plumbers, electricians, builders, and handymen.",
        includes: ["Materials list with costs", "Labour hours and rate", "Travel/callout fee", "VAT at 15%", "Banking details for EFT"],
    },
    {
        title: "5. Small Business Retail Invoice",
        description: "A product-based invoice for a small retailer or e-commerce business. Lists items, quantities, and per-unit pricing.",
        includes: ["Product names and SKUs", "Quantity and unit price", "Discount applied", "VAT calculation", "Delivery charges"],
    },
    {
        title: "6. Photography Invoice",
        description: "A photography invoice covering shoot time, editing, and usage licensing. Includes deposit and balance due.",
        includes: ["Shoot date and location", "Editing and retouching fees", "Number of final images", "Usage rights/licence", "50% deposit paid"],
    },
    {
        title: "7. Proforma Invoice",
        description: "A pre-sale estimate used to confirm order details before delivery. Not a demand for payment — a preliminary document.",
        includes: ["'Proforma Invoice' label", "Estimated costs", "Validity period (e.g., 30 days)", "Terms and conditions", "Conversion note to tax invoice"],
    },
    {
        title: "8. VAT Tax Invoice (SARS-Compliant)",
        description: "A full tax invoice meeting all SARS requirements for VAT-registered businesses in South Africa.",
        includes: ["'Tax Invoice' label", "Seller's VAT number", "Buyer's VAT number (B2B)", "VAT amount at 15%", "Total inclusive and exclusive of VAT"],
    },
]

export default function InvoiceExamplesPage() {
    return (
        <article className="min-h-screen bg-background">
            <section className="pt-24 md:pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>February 2026</span>
                        <span>·</span>
                        <span>10 min read</span>
                        <span>·</span>
                        <span>Invoicing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Invoice Examples: 8 Real Invoice Samples for Every Industry
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Not sure what your invoice should look like? Here are 8 real-world invoice examples covering the most common industries and use cases. Each one shows exactly what to include so you look professional and get paid on time.
                    </p>
                </div>
            </section>

            <section className="pb-16 px-6">
                <div className="max-w-3xl mx-auto space-y-10">
                    {examples.map((ex) => (
                        <div key={ex.title} className="bg-card rounded-xl border p-8">
                            <h2 className="text-2xl font-bold mb-3">{ex.title}</h2>
                            <p className="text-muted-foreground mb-4">{ex.description}</p>
                            <h3 className="font-semibold mb-2">What this invoice includes:</h3>
                            <ul className="space-y-1">
                                {ex.includes.map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm">
                                        <IconCheck className="w-4 h-4 text-green-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="prose prose-lg dark:prose-invert">
                        <h2>What Every Invoice Should Include</h2>
                        <p>Regardless of your industry, every professional invoice needs these core elements:</p>
                        <ul>
                            <li><strong>Your business details</strong> — name, address, email, phone</li>
                            <li><strong>Client details</strong> — name, company, address</li>
                            <li><strong>Invoice number</strong> — unique, sequential (e.g., INV-001)</li>
                            <li><strong>Date issued</strong> and <strong>due date</strong></li>
                            <li><strong>Line items</strong> — description, quantity, rate, amount</li>
                            <li><strong>Subtotal, tax, and total</strong></li>
                            <li><strong>Payment instructions</strong> — bank details or online payment link</li>
                        </ul>

                        <h2>Create Professional Invoices Instantly</h2>
                        <p>Instead of formatting invoices manually, use Illumi to generate any of these invoice types automatically. Pick a template, fill in your details once, and create polished invoices in seconds.</p>
                    </div>

                    <div className="bg-primary/5 rounded-xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-3">Create Your Invoice Now — Free</h3>
                        <p className="text-muted-foreground mb-6">All 8 invoice formats available as customisable templates in Illumi.</p>
                        <Link href="/login">
                            <Button size="lg">
                                Create an Invoice — Free <IconArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </article>
    )
}
