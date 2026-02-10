import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    IconArrowRight,
    IconCheck,
    IconClipboardList,
    IconFileInvoice,
    IconReceiptTax,
    IconUserCircle,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Without a Company | Personal Invoicing | Illumi",
    description: "Create professional invoices without registering a company in South Africa. Perfect for individuals, side hustlers, and those just starting out. No PTY LTD required.",
    keywords: [
        "invoice without company",
        "personal invoicing",
        "invoice as individual",
        "no company invoice",
        "sole proprietor invoice",
        "invoice without PTY LTD",
        "individual invoicing South Africa",
    ],
    alternates: {
        canonical: "/invoicing-software/no-company",
    },
}

const benefits = [
    "No company registration required",
    "Use your personal details",
    "Professional invoice templates",
    "Accept payments to personal account",
    "Track income for tax purposes",
    "SARS compliant invoices",
    "Free forever",
    "Upgrade when you register a company",
]

const whatToInclude = [
    "Your full name (or trading name if you have one)",
    "Invoice number + invoice date",
    "Client name and address (where relevant)",
    "Clear description of work delivered",
    "Total amount due + due date",
    "Payment instructions (banking details)",
]

const faqs = [
    {
        q: "Can I legally invoice without a registered company?",
        a: "In many cases, yes — you can invoice as an individual/sole proprietor. The key is to be accurate about who is providing the service and keep records for tax.",
    },
    {
        q: "Do I need a VAT number?",
        a: "Not unless you are VAT registered. If you are not VAT registered, don’t charge VAT and don’t label the invoice a tax invoice.",
    },
    {
        q: "What should I put as my business name?",
        a: "Use your legal name. If you have a trading name, you can include it, but keep your personal details clear so clients and accountants understand who’s invoicing.",
    },
]

export default function NoCompanyPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconUserCircle className="h-4 w-4" />
                            For Individuals
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoice Without a Registered Company
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Start invoicing before you register your business. Perfect for freelancers, 
                            sole proprietor, or side hustler. Start earning and formalize later.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start Invoicing Now
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/what-is-an-invoice">
                                <Button size="lg" variant="outline">
                                    What is an invoice?
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                                <IconCheck className="h-5 w-5 text-primary" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <div className="flex items-start gap-3">
                                <IconFileInvoice className="h-6 w-6 text-primary mt-0.5" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">What to include on your invoice</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        Keep it simple and professional. The goal is to make payment approvals frictionless.
                                    </p>
                                    <ul className="space-y-2">
                                        {whatToInclude.map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                                <span className="text-sm text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <div className="flex items-start gap-3">
                                <IconReceiptTax className="h-6 w-6 text-primary mt-0.5" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">VAT note (important)</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        If you’re not VAT registered, don’t charge VAT and don’t label the invoice “Tax Invoice”.
                                        If you are VAT registered, include your VAT number and show VAT clearly.
                                    </p>
                                    <div className="mt-4">
                                        <Link href="/blog/vat-setup-guide" className="text-sm text-primary hover:underline">
                                            Read: VAT setup guide →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h3 className="text-xl font-semibold mb-4">What You Need to Know</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>• You can invoice using your full name and ID number</li>
                            <li>• No VAT number needed if earning under R1 million/year</li>
                            <li>• Keep records for provisional tax if earning over R30,000</li>
                            <li>• Consider registering a company when you scale</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">FAQs</h2>
                    <div className="rounded-2xl border border-border bg-card p-2 md:p-6">
                        <Accordion type="single" collapsible>
                            {faqs.map((item) => (
                                <AccordionItem key={item.q} value={item.q}>
                                    <AccordionTrigger>{item.q}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-muted-foreground">{item.a}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Journey Today</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Every business starts somewhere. Begin invoicing professionally without the paperwork.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Your First Invoice
                        </Button>
                    </Link>
                    <div className="mt-6">
                        <Link href="/invoice-generator" className="text-sm text-primary hover:underline">
                            Need a quick template? Use the free invoice generator →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
