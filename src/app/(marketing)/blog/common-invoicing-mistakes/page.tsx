import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconX } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Common Invoicing Mistakes SA Businesses Make | Illumi",
    description: "Avoid these common invoicing mistakes that South African businesses make. Learn how to fix errors that delay payments and cause compliance issues.",
    keywords: [
        "invoicing mistakes",
        "invoice errors",
        "common billing mistakes",
        "invoicing problems",
        "invoice mistakes to avoid",
        "south africa invoicing errors",
    ],
    alternates: {
        canonical: "/blog/common-invoicing-mistakes",
    },
}

const mistakes = [
    {
        mistake: "Not invoicing promptly",
        problem: "Waiting days or weeks to send invoices delays your payment by the same amount. Clients also forget details over time.",
        solution: "Invoice the same day work is completed. Set a daily invoicing routine.",
        impact: "High",
    },
    {
        mistake: "Vague line item descriptions",
        problem: "'Consulting services' tells clients nothing. Vague descriptions lead to queries and payment delays.",
        solution: "Be specific: 'Website redesign - homepage and 3 landing pages, delivered 15 Jan 2026'.",
        impact: "High",
    },
    {
        mistake: "Missing or unclear payment terms",
        problem: "If clients don't know when to pay, they'll pay when convenient for them — which is never.",
        solution: "State clear terms: 'Payment due within 14 days of invoice date' with the actual due date.",
        impact: "High",
    },
    {
        mistake: "No online payment option",
        problem: "Forcing clients to do manual bank transfers adds friction and delays payment.",
        solution: "Add PayFast or Yoco integration so clients can pay with one click.",
        impact: "High",
    },
    {
        mistake: "Inconsistent invoice numbering",
        problem: "Random or duplicate invoice numbers cause confusion and SARS compliance issues.",
        solution: "Use sequential numbering (INV-001, INV-002). Let software handle this automatically.",
        impact: "Medium",
    },
    {
        mistake: "Wrong VAT calculations",
        problem: "Manual VAT calculations lead to errors. Overcharging or undercharging VAT creates problems.",
        solution: "Use invoicing software that calculates VAT automatically at 15%.",
        impact: "Medium",
    },
    {
        mistake: "Missing business details",
        problem: "Invoices without your company name, address, or VAT number look unprofessional and may not be SARS compliant.",
        solution: "Set up your business profile once. Details appear on every invoice automatically.",
        impact: "Medium",
    },
    {
        mistake: "Not following up on overdue invoices",
        problem: "Hoping clients will pay without reminders rarely works. Overdue invoices pile up.",
        solution: "Set up automatic payment reminders at set intervals.",
        impact: "High",
    },
    {
        mistake: "Sending invoices to the wrong person",
        problem: "The person you work with may not handle payments. Invoices get lost.",
        solution: "Confirm the accounts payable contact and email address for each client.",
        impact: "Medium",
    },
    {
        mistake: "Poor record keeping",
        problem: "Scattered invoices across emails and folders make tax time stressful and audits risky.",
        solution: "Use cloud-based software that stores all invoices in one searchable place.",
        impact: "Medium",
    },
]

export default function CommonInvoicingMistakesPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            6 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Invoicing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Common Invoicing Mistakes SA Businesses Make
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        These invoicing errors cost South African businesses time and money. Here's how to 
                        spot and fix them.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            Small invoicing mistakes add up. A vague description here, a missing detail there — 
                            and suddenly you're chasing payments, answering queries, and scrambling at tax time.
                        </p>
                        <p>
                            We've compiled the most common invoicing mistakes we see from South African businesses, 
                            along with simple fixes for each one.
                        </p>
                    </div>

                    <div className="space-y-6 mb-12">
                        {mistakes.map((item, index) => (
                            <div key={index} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                            <IconX className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        </div>
                                        <h3 className="text-lg font-bold">{item.mistake}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        item.impact === "High" 
                                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    }`}>
                                        {item.impact} Impact
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                                    <div>
                                        <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">The Problem</div>
                                        <p className="text-sm text-muted-foreground">{item.problem}</p>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">The Fix</div>
                                        <p className="text-sm text-muted-foreground">{item.solution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">Quick Checklist</h2>
                        <p className="text-muted-foreground mb-6">
                            Before sending any invoice, make sure you have:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                "Your business name and address",
                                "Your VAT number (if registered)",
                                "Client's correct details",
                                "Sequential invoice number",
                                "Clear line item descriptions",
                                "Correct amounts and VAT",
                                "Payment terms and due date",
                                "Payment methods/instructions",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Avoid Mistakes Automatically</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi prevents most of these mistakes by design. Professional templates, automatic 
                            calculations, sequential numbering, and built-in payment links — all handled for you.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/invoice-software-south-africa">
                                <Button variant="outline">
                                    See All Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/invoice-mistakes" className="text-primary hover:underline">
                                    7 Invoice Mistakes That Kill Your Cash Flow
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/how-to-manage-invoices" className="text-primary hover:underline">
                                    How to Manage Invoices for Small Businesses
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/vat-setup-guide" className="text-primary hover:underline">
                                    VAT Setup Guide for SA Businesses
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Invoice Like a Pro</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Professional invoicing doesn't have to be complicated. Illumi makes it simple.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Free Today
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
