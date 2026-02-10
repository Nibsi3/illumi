import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconClipboardList,
    IconMailForward,
    IconShieldCheck,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "The Ultimate Client Onboarding Checklist for Freelancers | Illumi",
    description:
        "A step-by-step client onboarding checklist for South African freelancers. Cover contracts, payment terms, invoicing setup, and communication expectations upfront.",
    keywords: [
        "client onboarding checklist",
        "freelancer onboarding process",
        "new client checklist South Africa",
        "freelance contract template",
        "payment terms agreement",
        "client management freelancer",
    ],
    alternates: {
        canonical: "/blog/client-onboarding-checklist",
    },
}

const beforeYouStart = [
    { step: "Confirm the scope of work in writing", detail: "Even a simple email summary protects both sides. List deliverables, timelines, and what's excluded." },
    { step: "Agree on payment terms", detail: "Net 7, Net 14, or due on receipt? State it clearly before starting work. Include late payment consequences." },
    { step: "Send a formal quote or proposal", detail: "A professional quote sets expectations and gives the client something to approve in writing." },
    { step: "Collect a deposit (30-50%)", detail: "For projects over R5,000, always collect a deposit. It filters out non-serious clients and funds your initial costs." },
    { step: "Get the client's correct billing details", detail: "Company name, VAT number, billing email, PO number if required. Getting this wrong delays every invoice." },
]

const duringTheProject = [
    { step: "Set up the client in your invoicing tool", detail: "Add them to Illumi with correct details so every future invoice is consistent and fast to create." },
    { step: "Establish a communication channel", detail: "Email, WhatsApp, Slack — pick one primary channel and stick to it. Scattered communication causes scope creep." },
    { step: "Send progress updates at milestones", detail: "Don't disappear for weeks. Brief updates build trust and make milestone invoices feel earned." },
    { step: "Invoice at agreed milestones", detail: "Don't wait until the end. Invoice at each milestone to keep cash flowing and avoid a single large unpaid invoice." },
    { step: "Document change requests", detail: "If the client asks for something outside scope, document it, quote it, and get approval before doing the work." },
]

const afterDelivery = [
    { step: "Send the final invoice immediately", detail: "Invoice within 24 hours of delivery while the value is fresh. Waiting a week invites 'we'll pay later.'" },
    { step: "Include clear payment instructions", detail: "Banking details, payment link, or both. Remove every friction point between 'I should pay' and 'I paid.'" },
    { step: "Request feedback or a testimonial", detail: "Happy clients are your best marketing. Ask within a week of delivery when satisfaction is highest." },
    { step: "Archive project files properly", detail: "Store final deliverables and correspondence. You'll need them if the client returns or disputes something." },
    { step: "Schedule a follow-up for future work", detail: "Set a reminder to check in after 30-60 days. Repeat clients are cheaper to win than new ones." },
]

function ChecklistSection({ title, items, icon }: { title: string; items: { step: string; detail: string }[]; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-3 mb-6">
                {icon}
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                        <IconCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <div className="font-semibold text-foreground">{item.step}</div>
                            <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ClientOnboardingPost() {
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
                            5 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Workflow</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        The Ultimate Client Onboarding Checklist for Freelancers
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        A smooth onboarding process prevents 90% of freelancer headaches: scope creep, late payments,
                        miscommunication, and &quot;I thought that was included.&quot;
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <ChecklistSection
                        title="Before you start"
                        items={beforeYouStart}
                        icon={<IconClipboardList className="h-6 w-6 text-primary" />}
                    />
                    <ChecklistSection
                        title="During the project"
                        items={duringTheProject}
                        icon={<IconMailForward className="h-6 w-6 text-primary" />}
                    />
                    <ChecklistSection
                        title="After delivery"
                        items={afterDelivery}
                        icon={<IconShieldCheck className="h-6 w-6 text-primary" />}
                    />

                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-bold mb-4">The bottom line</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Professional onboarding isn&apos;t about being rigid — it&apos;s about setting clear expectations so both you
                            and your client can focus on great work instead of chasing details. Spend 30 minutes on onboarding
                            and save 30 hours of frustration per project.
                        </p>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/login">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Set Up Your Client List
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/client-portal">
                            <Button variant="outline">Why You Need a Client Portal</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Manage clients like a pro</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi lets you store client details, automate invoicing, and track payments — all in one place. Free forever.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
