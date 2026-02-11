import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconReceiptTax } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "VAT in South Africa: The Simple Setup Guide (Without the Confusion) | Illumi",
    description:
        "A practical guide to VAT for South African small businesses: when to register, what to put on a tax invoice, and how to stay compliant.",
    keywords: [
        "VAT South Africa",
        "VAT registration",
        "tax invoice requirements",
        "SARS VAT",
        "VAT number",
        "VAT on invoices",
        "15 percent VAT",
    ],
    alternates: {
        canonical: "/blog/vat-setup-guide",
    },
}

const sections = [
    {
        title: "When should you register for VAT?",
        points: [
            "If your taxable turnover exceeds R1 million in any 12-month period, you must register.",
            "Voluntary registration is available if turnover exceeds R50,000 — useful for claiming input VAT.",
            "B2B clients often prefer working with VAT-registered suppliers for their own input claims.",
            "Registration takes 21 business days via SARS eFiling — plan ahead.",
        ],
    },
    {
        title: "What must a South African tax invoice include?",
        points: [
            "The words 'Tax Invoice' prominently displayed",
            "Your business name, address, and VAT registration number",
            "Invoice number (sequential) and invoice date",
            "Customer name and address (for invoices over R5,000)",
            "Customer VAT number (for invoices over R5,000)",
            "Clear description of goods or services supplied",
            "Quantity and price of each item",
            "VAT rate applied (15%) and VAT amount",
            "Total amount including VAT",
        ],
    },
    {
        title: "Common VAT mistakes that trigger headaches",
        points: [
            "Mixing VAT-inclusive and VAT-exclusive prices without stating it clearly",
            "Not showing VAT as a separate line on the invoice",
            "Using inconsistent or duplicate invoice numbers",
            "Forgetting to include your VAT registration number",
            "Issuing tax invoices before you're actually registered",
            "Not keeping invoices for the required 5-year period",
        ],
    },
    {
        title: "VAT returns and payments",
        points: [
            "VAT returns are due by the 25th of the month following your VAT period",
            "Most small businesses file bi-monthly (every 2 months)",
            "You can file and pay via SARS eFiling — set calendar reminders",
            "Late submissions attract penalties and interest — don't risk it",
        ],
    },
]

const vatCalculationExample = {
    exclusive: "R1,000.00",
    vatAmount: "R150.00",
    inclusive: "R1,150.00",
    formula: "VAT = Price × 15% = R1,000 × 0.15 = R150",
}

export default function VatSetupGuidePost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            6 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Tax & Compliance</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        VAT in South Africa: The Simple Setup Guide (Without the Confusion)
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        VAT doesn’t have to be scary. Here’s the practical version: what to do, what to avoid, and what to put on your invoices.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconReceiptTax className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Quick VAT reminder</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    If you’re VAT registered, you’re collecting VAT on behalf of SARS. That means your invoices need the right details,
                                    and your records need to be clean.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 space-y-6">
                        {sections.map((s) => (
                            <div key={s.title} className="rounded-2xl border border-border bg-card p-8">
                                <h3 className="text-xl font-semibold mb-4">{s.title}</h3>
                                <ul className="space-y-3">
                                    {s.points.map((p) => (
                                        <li key={p} className="flex items-start gap-3">
                                            <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                            <span className="text-muted-foreground">{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-10">
                        <h3 className="text-xl font-semibold mb-4">Quick VAT calculation example</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 rounded-xl bg-muted/50">
                                <div className="text-xs text-muted-foreground uppercase mb-1">Excl. VAT</div>
                                <div className="text-xl font-bold">{vatCalculationExample.exclusive}</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-muted/50">
                                <div className="text-xs text-muted-foreground uppercase mb-1">VAT (15%)</div>
                                <div className="text-xl font-bold text-primary">{vatCalculationExample.vatAmount}</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-muted/50">
                                <div className="text-xs text-muted-foreground uppercase mb-1">Incl. VAT</div>
                                <div className="text-xl font-bold">{vatCalculationExample.inclusive}</div>
                            </div>
                            <div className="flex items-center justify-center p-4">
                                <code className="text-xs text-muted-foreground">{vatCalculationExample.formula}</code>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <h3 className="text-xl font-semibold mb-4">Pro tips for VAT compliance</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Use invoicing software that automatically calculates and displays VAT correctly</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Keep digital copies of all invoices — SARS accepts electronic records</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Reconcile your VAT account monthly, not just at return time</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Consider a separate bank account for VAT funds — it's not your money</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/invoice-generator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Create a Tax-Friendly Invoice
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/sales-tax-calculator">
                            <Button variant="outline">Calculate VAT (15%)</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">VAT doesn't have to be complicated</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi automatically handles VAT calculations on your invoices, so you can focus on your business 
                        instead of worrying about compliance.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Try Illumi Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
