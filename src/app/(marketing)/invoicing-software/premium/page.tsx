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
    IconChartBar,
    IconCheck,
    IconCrown,
    IconPlugConnected,
    IconShieldCheck,
    IconSparkles,
    IconUsers,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Premium Invoicing Software | Advanced Features | Illumi",
    description: "Unlock premium invoicing features with Illumi Pro. Advanced automation, priority support, unlimited team members, and powerful integrations for growing South African businesses.",
    keywords: [
        "premium invoicing software",
        "professional invoicing",
        "advanced invoicing features",
        "invoicing automation",
        "business invoicing software",
        "Illumi Pro",
    ],
}

const premiumHighlights = [
    {
        icon: IconBolt,
        title: "Automation that actually saves hours",
        description:
            "Recurring invoices, reminder sequences, and workflows that keep money moving without manual follow-ups.",
    },
    {
        icon: IconChartBar,
        title: "Reporting you can use",
        description:
            "See revenue, outstanding invoices, and client payment behavior so you can forecast cash flow with confidence.",
    },
    {
        icon: IconUsers,
        title: "Built for teams",
        description:
            "Invite staff, assign roles, and keep invoicing consistent across your business as you scale.",
    },
    {
        icon: IconPlugConnected,
        title: "Integrations & extensibility",
        description:
            "Connect your workflows (and unlock API access) so invoicing fits your existing stack.",
    },
    {
        icon: IconShieldCheck,
        title: "Trusted, secure, compliant",
        description:
            "Professional templates, audit-friendly records, and security you can trust for your business data.",
    },
]

const premiumFeatures = [
    "Unlimited invoices and clients",
    "Advanced automation rules",
    "Custom invoice templates",
    "Priority support",
    "Team collaboration tools",
    "Advanced reporting & analytics",
    "API access for integrations",
    "Client portal experience",
    "Recurring invoice automation",
    "Multi-currency support",
    "Custom payment reminders",
    "Bulk invoice actions",
]

const faqs = [
    {
        q: "What’s the difference between Free and Premium?",
        a: "Premium is built for businesses that need automation, collaboration, and reporting at scale. You can start on Free and upgrade only when you need advanced workflows, team roles, and deeper insights.",
    },
    {
        q: "Is Premium suitable for VAT-registered businesses in South Africa?",
        a: "Yes. You can create professional, VAT-friendly invoices and keep the records you need for reporting and compliance workflows.",
    },
    {
        q: "Can I invite my team and control permissions?",
        a: "Yes. Premium is designed for teams—invite members, control access, and keep invoicing consistent across departments.",
    },
    {
        q: "Do you support recurring invoices and payment reminders?",
        a: "Yes. Set up recurring billing, automate reminders, and reduce time spent chasing late payments.",
    },
]

export default function PremiumPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
                                <IconCrown className="h-4 w-4" />
                                Premium
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                Premium invoicing that makes you look bigger than you are
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                Automate follow-ups, collaborate with your team, and get better visibility into cash flow.
                                Built for South African businesses that are ready to grow.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/pricing">
                                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        View Pricing
                                        <IconArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline">
                                        Start Free
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="rounded-xl border border-border bg-card p-4">
                                    <div className="text-sm text-muted-foreground">Typical setup</div>
                                    <div className="text-xl font-semibold">5 minutes</div>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4">
                                    <div className="text-sm text-muted-foreground">Reminder automation</div>
                                    <div className="text-xl font-semibold">On</div>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4">
                                    <div className="text-sm text-muted-foreground">Team-ready</div>
                                    <div className="text-xl font-semibold">Yes</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:justify-self-end">
                            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                    <IconSparkles className="h-4 w-4" />
                                    Premium overview
                                </div>
                                <div className="space-y-4">
                                    {premiumFeatures.slice(0, 6).map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <div className="font-medium">{feature}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Designed to scale your invoicing workflow.
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Link href="/invoicing-software/small-business" className="text-sm text-primary hover:underline">
                                        Not ready for Premium? See our small business setup →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">What you get with Premium</h2>
                        <p className="text-muted-foreground">
                            Premium isn’t just “more features.” It’s a smoother workflow: fewer follow-ups, fewer mistakes, and better visibility.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {premiumHighlights.map((item) => (
                            <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="p-3 rounded-xl bg-accent w-fit mb-4">
                                    <item.icon className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {premiumFeatures.map((feature) => (
                            <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                                <IconCheck className="h-5 w-5 text-primary" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Who Premium is for</h2>
                            <p className="text-muted-foreground">
                                If you’re sending invoices every week, managing staff, or chasing payments regularly, Premium pays for itself in time saved.
                            </p>
                            <div className="mt-6 space-y-3">
                                <Link href="/invoicing-software/freelancers" className="block text-sm text-primary hover:underline">
                                    Premium for freelancers →
                                </Link>
                                <Link href="/invoicing-software/contractors" className="block text-sm text-primary hover:underline">
                                    Premium for contractors →
                                </Link>
                                <Link href="/invoicing-software/startups" className="block text-sm text-primary hover:underline">
                                    Premium for startups →
                                </Link>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-border bg-card p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Best for</div>
                                        <div className="text-xl font-semibold">Growing teams & busy owners</div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            You want automation and reporting so invoicing doesn’t become a bottleneck.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Common outcome</div>
                                        <div className="text-xl font-semibold">Fewer late payments</div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Better terms, better reminders, and clearer invoices lead to faster payments.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">If you’re still early</div>
                                        <div className="text-xl font-semibold">Start Free</div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            You can upgrade later—your invoices and clients carry over.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">If you need help</div>
                                        <div className="text-xl font-semibold">Talk to us</div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            We’ll recommend the right plan for your business.
                                        </p>
                                    </div>
                                </div>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with Free, Upgrade When Ready</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Try Illumi free forever. Upgrade to Premium when you need advanced features.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/login">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Start Free
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline">
                                Compare Plans
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
