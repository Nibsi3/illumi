import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "How to Create an Invoice: Complete Step-by-Step Guide (2026) | Illumi",
    description: "Learn how to create a professional invoice from scratch. This step-by-step guide covers required fields, numbering, VAT compliance, payment terms, and how to send invoices online.",
    keywords: [
        "how to create an invoice",
        "how to make an invoice",
        "create invoice step by step",
        "how to write an invoice",
        "invoice guide",
        "how to invoice a client",
        "invoicing for beginners",
        "how to bill a client",
        "how to send an invoice",
        "invoice instructions",
    ],
    alternates: { canonical: "/blog/how-to-create-an-invoice" },
}

const steps = [
    {
        num: "1",
        title: "Add Your Business Details",
        content: "Start with your business name (or your full name if you're a sole proprietor), physical address, email, phone number, and VAT registration number if applicable. This identifies you as the seller and is required by SARS for tax invoices.",
    },
    {
        num: "2",
        title: "Add Your Client's Details",
        content: "Include the client's full name or company name, their address, and email. For B2B transactions where both parties are VAT-registered, include their VAT number as well.",
    },
    {
        num: "3",
        title: "Assign an Invoice Number",
        content: "Every invoice needs a unique, sequential number. Use a consistent format like INV-001, INV-002, etc. This is required for tax compliance and helps both you and your client track payments. Illumi generates these automatically.",
    },
    {
        num: "4",
        title: "Set the Date and Due Date",
        content: "Include the date the invoice is issued and the date payment is due. Common terms include 'Due on Receipt', 'Net 7' (7 days), 'Net 14', or 'Net 30'. Shorter terms mean faster payment.",
    },
    {
        num: "5",
        title: "List Your Line Items",
        content: "Describe each product or service provided. Include the quantity, unit price, and total for each line. Be specific — 'Website Design: Homepage + 5 inner pages' is better than 'Design Services'. Clear descriptions reduce disputes.",
    },
    {
        num: "6",
        title: "Calculate Subtotal, Tax, and Total",
        content: "Add up all line items for the subtotal. If you're VAT-registered, add 15% VAT. Clearly show the subtotal, VAT amount, and grand total. If you're not VAT-registered, just show the total. Illumi calculates all of this automatically.",
    },
    {
        num: "7",
        title: "Add Payment Instructions",
        content: "Tell the client exactly how to pay. Include your bank name, account number, branch code, and reference to use. Even better — add an online payment link so they can pay by card or EFT with one click.",
    },
    {
        num: "8",
        title: "Send and Track",
        content: "Send the invoice via email or WhatsApp. Then track whether it's been viewed and whether payment has been received. Follow up promptly if the due date passes. Illumi tracks all of this automatically.",
    },
]

export default function HowToCreateInvoicePage() {
    return (
        <article className="min-h-screen bg-background">
            <section className="pt-24 md:pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>February 2026</span>
                        <span>·</span>
                        <span>9 min read</span>
                        <span>·</span>
                        <span>Guide</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        How to Create an Invoice: Complete Step-by-Step Guide
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Whether you&apos;re invoicing for the first time or want to improve your process, this guide walks you through every step of creating a professional invoice — from the required fields to sending and getting paid.
                    </p>
                </div>
            </section>

            <section className="pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-8">
                        {steps.map((step) => (
                            <div key={step.num} className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xl font-bold text-primary">{step.num}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-2">{step.title}</h2>
                                    <p className="text-muted-foreground leading-relaxed">{step.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 prose prose-lg dark:prose-invert">
                        <h2>VAT Invoice Requirements in South Africa</h2>
                        <p>If your annual turnover exceeds R1 million, you must register for VAT with SARS. Once registered, your invoices must include:</p>
                        <ul>
                            <li>The words <strong>&quot;Tax Invoice&quot;</strong> prominently displayed</li>
                            <li>Your <strong>VAT registration number</strong></li>
                            <li>The <strong>date of supply</strong></li>
                            <li>A <strong>serial number</strong> (invoice number)</li>
                            <li>Your name, address, and <strong>trade name</strong></li>
                            <li>The recipient&apos;s name and address</li>
                            <li>A full description of <strong>goods or services</strong> supplied</li>
                            <li>The <strong>quantity</strong> of goods or <strong>extent of services</strong></li>
                            <li>The value of supply, <strong>VAT charged</strong>, and <strong>consideration for the supply</strong></li>
                        </ul>
                        <p>Illumi automatically includes all of these fields when you toggle VAT on in your settings. You don&apos;t need to memorise the SARS requirements — we handle it for you.</p>

                        <h2>Common Invoice Mistakes to Avoid</h2>
                        <ul>
                            <li><strong>Missing invoice numbers</strong> — Every invoice must have a unique number for tax records</li>
                            <li><strong>Vague descriptions</strong> — &quot;Services rendered&quot; invites questions and delays payment</li>
                            <li><strong>No due date</strong> — Without a deadline, clients pay whenever they feel like it</li>
                            <li><strong>Wrong calculations</strong> — Manual math leads to errors. Use software that calculates automatically</li>
                            <li><strong>No payment instructions</strong> — Make it obvious how to pay you</li>
                        </ul>

                        <h2>The Fastest Way to Create an Invoice</h2>
                        <p>While you can create invoices manually in Word or Excel, it&apos;s slow, error-prone, and unprofessional. Modern invoice software like Illumi lets you create a polished invoice in under 60 seconds:</p>
                        <ol>
                            <li>Select a client (auto-fills their details)</li>
                            <li>Add line items with descriptions and amounts</li>
                            <li>Review the auto-calculated total</li>
                            <li>Click send — done!</li>
                        </ol>
                    </div>

                    <div className="bg-primary/5 rounded-xl p-8 text-center mt-10">
                        <h3 className="text-2xl font-bold mb-3">Create Your First Invoice in 60 Seconds</h3>
                        <p className="text-muted-foreground mb-6">Free professional invoicing. No spreadsheets needed.</p>
                        <Link href="/invoices/new">
                            <Button size="lg">
                                Start Invoicing Free <IconArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </article>
    )
}
