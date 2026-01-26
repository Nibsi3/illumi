import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconUsers,
    IconFileInvoice,
    IconLock,
    IconMessage,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Why a Client Portal Will Transform Your Freelance Business | Illumi",
    description:
        "Stop sending invoices via email and hoping clients find them. A client portal gives your clients 24/7 access to invoices, documents, and payment options — making you look incredibly professional.",
    keywords: [
        "client portal",
        "freelancer client management",
        "invoice portal",
        "client self-service",
        "professional freelancing",
        "South Africa freelancer",
    ],
}

const portalFeatures = [
    {
        icon: IconFileInvoice,
        title: "All invoices in one place",
        description: "Clients see every invoice you've ever sent — no more 'can you resend that?'",
    },
    {
        icon: IconLock,
        title: "Secure document sharing",
        description: "Share contracts, proposals, and files without email attachments getting lost.",
    },
    {
        icon: IconMessage,
        title: "Built-in messaging",
        description: "Keep all client communication in context, attached to the right project.",
    },
    {
        icon: IconUsers,
        title: "Multiple contacts per client",
        description: "Finance, project managers, and decision-makers all have access.",
    },
]

const beforeAfter = [
    {
        before: "Client emails: 'Can you resend invoice #47?'",
        after: "Client logs in and downloads it themselves",
    },
    {
        before: "You dig through email to find the signed contract",
        after: "Everything's in the client's portal, organized by date",
    },
    {
        before: "Client asks 'What do I owe you?'",
        after: "Client sees outstanding balance instantly",
    },
    {
        before: "You look like every other freelancer",
        after: "You look like a premium, established business",
    },
]

const testimonialQuote = {
    text: "My clients started taking me more seriously the moment I gave them portal access. It's like having a professional office without the rent.",
    author: "Cape Town Freelancer",
}

export default function ClientPortalPost() {
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
                        <span className="px-2 py-1 rounded bg-muted">Business Growth</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Why a Client Portal Will Transform Your Freelance Business
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        The difference between "just another freelancer" and "premium service provider" often comes down to 
                        how professional your client experience feels. A client portal is the easiest upgrade you can make.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconUsers className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">What is a client portal?</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    A client portal is a private, branded space where your clients can log in to view invoices, 
                                    download documents, make payments, and communicate with you — all without clogging up email. 
                                    Think of it as your virtual office reception.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {portalFeatures.map((f) => (
                            <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
                                <f.icon className="h-6 w-6 text-primary mb-3" />
                                <div className="font-semibold mb-1">{f.title}</div>
                                <div className="text-sm text-muted-foreground">{f.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Before vs. After a client portal</h2>
                    <div className="space-y-4">
                        {beforeAfter.map((ba) => (
                            <div key={ba.before} className="rounded-2xl border border-border bg-card p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs font-medium text-destructive uppercase mb-1">Before</div>
                                        <p className="text-sm text-muted-foreground">{ba.before}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-primary uppercase mb-1">After</div>
                                        <p className="text-sm text-muted-foreground">{ba.after}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <blockquote className="text-lg italic text-muted-foreground mb-4">
                            "{testimonialQuote.text}"
                        </blockquote>
                        <div className="text-sm font-medium">— {testimonialQuote.author}</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <h3 className="text-xl font-semibold mb-4">Who benefits most from a client portal?</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Freelancers with 5+ regular clients</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Agencies managing multiple projects per client</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Consultants who share reports and deliverables</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-muted-foreground">Anyone tired of "can you resend that?" emails</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/features/inbox">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Explore Client Portal
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline">Try Illumi Free</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Give your clients a premium experience</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi's client portal is included free. Set it up in minutes and start impressing clients 
                        with a professional, organized experience.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Get Started Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
