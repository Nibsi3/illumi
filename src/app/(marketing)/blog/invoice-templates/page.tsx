import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconPalette,
    IconPhoto,
    IconDeviceFloppy,
    IconSparkles,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Templates That Make Clients Pay Faster (Psychology-Backed) | Illumi",
    description:
        "Your invoice design affects how quickly you get paid. Learn the psychology behind invoice templates that get results — and grab free templates that work.",
    keywords: [
        "invoice template",
        "free invoice template",
        "professional invoice design",
        "invoice layout",
        "South Africa invoice template",
        "branded invoices",
    ],
    alternates: {
        canonical: "/blog/invoice-templates",
    },
}

const designPrinciples = [
    {
        icon: IconPhoto,
        title: "Your logo at the top",
        description: "Branded invoices get paid 15% faster. They signal 'real business' not 'side hustle.'",
    },
    {
        icon: IconSparkles,
        title: "Due date near the total",
        description: "The two most important numbers should be visually connected. Don't hide the due date.",
    },
    {
        icon: IconPalette,
        title: "Clean, minimal design",
        description: "White space isn't wasted space. Cluttered invoices confuse clients and delay approval.",
    },
    {
        icon: IconDeviceFloppy,
        title: "Consistent formatting",
        description: "Same template, every time. Clients learn to recognize and process your invoices faster.",
    },
]

const mustHaveElements = [
    "Your business name, address, and contact details",
    "Client's name and billing address",
    "Unique invoice number (sequential)",
    "Invoice date and due date",
    "Clear line items with descriptions, quantities, and rates",
    "Subtotal, VAT (if applicable), and total amount due",
    "Payment instructions (banking details or payment link)",
    "Payment terms and late payment policy",
]

const templateMistakes = [
    {
        mistake: "Using Word or Excel templates",
        why: "They look amateur, break formatting, and don't auto-calculate.",
    },
    {
        mistake: "Tiny, hard-to-read fonts",
        why: "If finance needs a magnifying glass, they'll put your invoice aside.",
    },
    {
        mistake: "No branding whatsoever",
        why: "Generic invoices blend in with spam. Branded invoices get attention.",
    },
    {
        mistake: "Burying payment details at the bottom",
        why: "Make it obvious how to pay. Don't make clients hunt for your bank details.",
    },
]

export default function InvoiceTemplatesPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-4xl mx-auto relative">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            6 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Invoicing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Invoice Templates That Make Clients Pay Faster (Psychology-Backed)
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Your invoice isn't just a bill — it's a sales document. The right template can mean the difference 
                        between getting paid in 3 days vs. 30 days.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconPalette className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Design matters more than you think</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Studies show that professional-looking invoices are perceived as more legitimate and urgent. 
                                    A well-designed invoice signals that you run a serious business — and serious businesses 
                                    expect to be paid on time.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {designPrinciples.map((dp) => (
                            <div key={dp.title} className="rounded-2xl border border-border bg-card p-6">
                                <dp.icon className="h-6 w-6 text-primary mb-3" />
                                <div className="font-semibold mb-1">{dp.title}</div>
                                <div className="text-sm text-muted-foreground">{dp.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Every invoice must include</h2>
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <ul className="space-y-3">
                            {mustHaveElements.map((el) => (
                                <li key={el} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <span className="text-muted-foreground">{el}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Template mistakes that cost you money</h2>
                    <div className="space-y-4">
                        {templateMistakes.map((tm) => (
                            <div key={tm.mistake} className="rounded-2xl border border-border bg-card p-6">
                                <div className="font-semibold text-destructive mb-2">{tm.mistake}</div>
                                <p className="text-sm text-muted-foreground">{tm.why}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-primary/50 bg-primary/5 p-8 mt-10">
                        <h3 className="text-xl font-semibold mb-4">Skip the template hunt</h3>
                        <p className="text-muted-foreground mb-6">
                            Illumi's invoice generator creates professional, branded invoices automatically. 
                            Add your logo, customize colors, and start sending invoices that get paid faster — 
                            all without touching a template file.
                        </p>
                        <Link href="/invoice-generator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Try the Free Invoice Generator
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/invoices/new">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Create Branded Invoices
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/invoice-mistakes">
                            <Button variant="outline">Read: 7 Invoice Mistakes</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Professional invoices, zero design skills needed</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi handles the design so you can focus on your work. Beautiful, professional invoices 
                        that make clients take you seriously — completely free.
                    </p>
                    <Link href="/invoices/new">
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
