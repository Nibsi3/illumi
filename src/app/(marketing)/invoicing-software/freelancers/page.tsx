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
    IconBolt,
    IconCheck,
    IconClock,
    IconFileInvoice,
    IconMessageCircle,
    IconUser,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Invoicing Software for Freelancers | Illumi South Africa",
    description: "The best free invoicing software for South African freelancers. Create professional invoices, track payments, and get paid faster. No monthly fees.",
    keywords: [
        "freelancer invoicing software",
        "free invoicing for freelancers",
        "freelance invoice app South Africa",
        "self-employed invoicing",
        "freelancer billing software",
        "invoice software freelancers",
    ],
    alternates: {
        canonical: "/invoicing-software/freelancers",
    },
}

const benefits = [
    "Create unlimited professional invoices",
    "Track time and bill hourly",
    "Accept online payments via PayFast",
    "Automatic payment reminders",
    "Expense tracking for tax season",
    "Professional invoice templates",
    "Client management portal",
    "Mobile-friendly invoicing",
]

const painPoints = [
    {
        title: "Clients ‘forget’ to pay",
        description:
            "Clear terms + automated reminders reduce awkward follow-ups and stop invoices slipping through the cracks.",
        icon: IconClock,
    },
    {
        title: "Rates feel hard to explain",
        description:
            "Use consistent line items and professional templates so your invoices feel obvious and defensible.",
        icon: IconFileInvoice,
    },
    {
        title: "Admin steals your billable time",
        description:
            "Recurring invoices and quick client reuse means less admin and more paid work.",
        icon: IconBolt,
    },
]

const workflowSteps = [
    {
        title: "Create your client once",
        description: "Save details and reuse them for future invoices—no retyping.",
    },
    {
        title: "Send a clean invoice",
        description:
            "Use clear line items, due dates, and payment instructions so clients can approve fast.",
    },
    {
        title: "Automate the follow-up",
        description:
            "Reminders go out automatically, so you don’t have to chase payment on WhatsApp.",
    },
    {
        title: "Get paid and track income",
        description:
            "See what’s outstanding, what’s paid, and what to follow up—at a glance.",
    },
]

const faqs = [
    {
        q: "Is Illumi really free for freelancers?",
        a: "Yes. You can create professional invoices and manage clients on the free plan. Upgrade only when you need advanced automation or team features.",
    },
    {
        q: "Can I invoice without being VAT registered?",
        a: "Yes. Many freelancers are not VAT registered at the start. When you do register, you can update your invoice settings and continue.",
    },
    {
        q: "What should I put in payment terms?",
        a: "Start simple: Due on receipt or Net 7/Net 14. Clear terms + consistent reminders = faster payments.",
    },
]

const freelancerTypes = [
    "Graphic Designers",
    "Web Developers",
    "Copywriters",
    "Photographers",
    "Consultants",
    "Virtual Assistants",
    "Social Media Managers",
    "Video Editors",
]

export default function FreelancersPage() {
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
                            <IconUser className="h-4 w-4" />
                            For Freelancers
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Free invoicing software for South African freelancers
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Stop chasing payments. Send clearer invoices, automate reminders, and get paid faster—without spending hours on admin.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start Invoicing Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/hourly-rate-calculator">
                                <Button size="lg" variant="outline">
                                    Calculate Your Rate
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">The freelancer invoicing problems we fix</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {painPoints.map((p) => (
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Built for Freelancers Like You</h2>
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
                        {freelancerTypes.map((type) => (
                            <span key={type} className="px-4 py-2 rounded-full bg-muted text-sm">
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">How it works (simple workflow)</h2>
                            <p className="text-muted-foreground mb-8">
                                Everything is designed to reduce friction for your client and reduce admin for you.
                            </p>
                            <div className="space-y-4">
                                {workflowSteps.map((s) => (
                                    <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                                        <div className="font-semibold">{s.title}</div>
                                        <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="rounded-2xl border border-border bg-card p-8">
                                <div className="flex items-start gap-3">
                                    <IconMessageCircle className="h-6 w-6 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Built for WhatsApp reality</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            South African freelancers often invoice and follow up on WhatsApp.
                                            Illumi helps you keep the message short, professional, and consistent.
                                        </p>
                                        <div className="mt-4">
                                            <Link href="/blog/late-paying-clients" className="text-sm text-primary hover:underline">
                                                Copy/paste follow-up templates →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-8 mt-6">
                                <h3 className="text-xl font-semibold mb-2">Want Premium automation?</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    If you invoice weekly, Premium automation can save hours.
                                </p>
                                <Link href="/invoicing-software/premium" className="text-sm text-primary hover:underline">
                                    See Premium features →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of SA Freelancers</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        2 months of Pro features free. No credit card required. Start invoicing in 60 seconds.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create My First Invoice
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
