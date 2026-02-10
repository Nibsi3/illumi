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
    IconHammer,
    IconMapPin,
    IconReceipt,
    IconShieldCheck,
    IconTool,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Invoicing Software for Contractors | Illumi South Africa",
    description: "Professional invoicing software for South African contractors. Create quotes, invoices, and track payments for construction, electrical, plumbing, and trade businesses.",
    keywords: [
        "contractor invoicing software",
        "construction invoicing",
        "trade invoicing software",
        "builder invoice software",
        "plumber invoicing",
        "electrician invoicing South Africa",
    ],
    alternates: {
        canonical: "/invoicing-software/contractors",
    },
}

const benefits = [
    "Create quotes and convert to invoices",
    "Progress billing for large projects",
    "Material and labor line items",
    "On-site mobile invoicing",
    "Deposit and milestone tracking",
    "Professional branded invoices",
    "Client approval workflows",
    "Expense tracking for jobs",
]

const contractorTypes = [
    "Builders",
    "Electricians",
    "Plumbers",
    "Painters",
    "Carpenters",
    "HVAC Technicians",
    "Landscapers",
    "General Contractors",
]

const tradePainPoints = [
    {
        title: "Invoice from the job site",
        description:
            "Create and send invoices while you’re on-site—so you don’t forget later and cash flow doesn’t slow down.",
        icon: IconMapPin,
    },
    {
        title: "Materials + labour, clearly separated",
        description:
            "Itemize labour and materials so clients understand the total and disputes are reduced.",
        icon: IconTool,
    },
    {
        title: "Deposits and progress billing",
        description:
            "For longer projects, invoice deposits and milestones to avoid funding the job yourself.",
        icon: IconShieldCheck,
    },
    {
        title: "Receipts and job expenses",
        description:
            "Capture receipts and track job costs so you always know profit per project.",
        icon: IconReceipt,
    },
]

const faqs = [
    {
        q: "Can I invoice deposits and milestones?",
        a: "Yes. Use deposits, progress invoices, and milestone billing to protect cash flow on larger jobs.",
    },
    {
        q: "Is this suitable for VAT-registered contractors?",
        a: "Yes. You can generate VAT-friendly invoices and keep clean records for reporting and compliance.",
    },
    {
        q: "What if most of my clients pay via EFT?",
        a: "That’s common. Clear banking details + consistent reminders still speed up payment approvals.",
    },
]

export default function ContractorsPage() {
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
                            <IconHammer className="h-4 w-4" />
                            For Contractors
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Software for South African Contractors
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            From quote to payment, manage your contracting business with professional invoicing. 
                            Create invoices on-site, track project payments, and get paid faster.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start Free Today
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/blog/getting-paid-faster">
                                <Button size="lg" variant="outline">
                                    Get Paid Faster Tips
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Built for real trade workflows</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tradePainPoints.map((p) => (
                            <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="p-3 rounded-xl bg-accent w-fit mb-4">
                                    <p.icon className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Built for Trade Professionals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                                <IconCheck className="h-5 w-5 text-primary" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Perfect for:</h3>
                    <div className="flex flex-wrap gap-2">
                        {contractorTypes.map((type) => (
                            <span key={type} className="px-4 py-2 rounded-full bg-muted text-sm">
                                {type}
                            </span>
                        ))}
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Invoicing, Zero Cost</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Free forever for contractors. Create invoices from the job site with your phone.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Get Started Free
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
