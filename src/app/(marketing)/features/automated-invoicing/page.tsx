import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconRobot,
    IconRefresh,
    IconClock,
    IconMail,
    IconCalendarEvent,
    IconSettings,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Automated Invoicing South Africa | Save Hours Every Month | Illumi",
    description: "Automate your invoicing with recurring invoices, scheduled sending, and automatic payment reminders. Save hours every month and never miss a billing cycle. Free for SA businesses.",
    keywords: [
        "automated invoicing",
        "automatic invoicing software",
        "recurring invoices south africa",
        "invoice automation",
        "automated billing",
        "scheduled invoices",
        "automatic invoice reminders",
        "invoicing automation software",
    ],
    alternates: {
        canonical: "/features/automated-invoicing",
    },
    openGraph: {
        title: "Automated Invoicing South Africa | Illumi",
        description: "Automate recurring invoices, scheduled sending, and payment reminders. Save hours every month.",
        type: "website",
        locale: "en_ZA",
    },
}

const automationFeatures = [
    {
        icon: IconRefresh,
        title: "Recurring Invoices",
        description: "Set up invoices that automatically generate and send on your schedule — weekly, monthly, quarterly, or custom intervals.",
    },
    {
        icon: IconCalendarEvent,
        title: "Scheduled Sending",
        description: "Create invoices now, send them later. Schedule invoices to be sent on a specific date and time.",
    },
    {
        icon: IconMail,
        title: "Automatic Reminders",
        description: "Never chase payments manually again. Set up automatic reminders for overdue invoices.",
    },
    {
        icon: IconClock,
        title: "Due Date Tracking",
        description: "Invoices automatically update status based on due dates. See overdue invoices at a glance.",
    },
    {
        icon: IconSettings,
        title: "Customisable Rules",
        description: "Set your own automation rules — when to send, how often to remind, and what messages to use.",
    },
    {
        icon: IconRobot,
        title: "Set It and Forget It",
        description: "Once configured, automation runs in the background. Focus on your work, not admin.",
    },
]

const timeSavings = [
    { task: "Creating recurring invoices", manual: "30 min/month", automated: "0 min" },
    { task: "Sending invoices", manual: "15 min/invoice", automated: "0 min" },
    { task: "Chasing overdue payments", manual: "2 hrs/month", automated: "0 min" },
    { task: "Updating invoice status", manual: "20 min/week", automated: "0 min" },
]

const useCases = [
    {
        title: "Retainer Clients",
        description: "Bill retainer clients automatically every month. Invoice is created and sent without you lifting a finger.",
    },
    {
        title: "Subscription Services",
        description: "Perfect for SaaS, memberships, or any recurring service. Automate your entire billing cycle.",
    },
    {
        title: "Maintenance Contracts",
        description: "IT support, property maintenance, or any ongoing service — automate the billing.",
    },
    {
        title: "Freelance Retainers",
        description: "Designers, developers, and consultants on retainer can automate monthly invoicing.",
    },
]

const faqs = [
    {
        question: "What is automated invoicing?",
        answer: "Automated invoicing uses software to automatically create, send, and follow up on invoices without manual intervention. This includes recurring invoices that generate on a schedule, automatic email delivery, and payment reminders for overdue invoices.",
    },
    {
        question: "How do recurring invoices work?",
        answer: "You set up an invoice template with the client, amount, and schedule (weekly, monthly, etc.). Illumi automatically creates a new invoice on each billing date and sends it to your client. You can review before sending or let it go fully automatic.",
    },
    {
        question: "Can I customise automatic reminders?",
        answer: "Yes. You control when reminders are sent (e.g., 3 days before due, on due date, 7 days overdue), how many reminders to send, and the message content. Make it match your communication style.",
    },
    {
        question: "What if I need to change a recurring invoice?",
        answer: "You can edit, pause, or cancel recurring invoices at any time. Changes apply to future invoices — past invoices remain unchanged for your records.",
    },
    {
        question: "Is automated invoicing included in the free plan?",
        answer: "Basic automation like scheduled sending is available on all plans. Recurring invoices and advanced automation features are available on Illumi Pro from R99/month.",
    },
    {
        question: "Can clients pay automated invoices online?",
        answer: "Absolutely. Every invoice — whether manual or automated — includes a Pay Now button for instant online payment via PayFast or Yoco.",
    },
]

export default function AutomatedInvoicingPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconRobot className="h-4 w-4" />
                            Automation Feature
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Automated Invoicing That Saves You Hours
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Stop creating the same invoices every month. Set up recurring invoices, schedule sending, 
                            and automate payment reminders. Spend time on your business, not admin.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Start Automating
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Free plan available • Recurring invoices on Pro
                        </p>
                    </div>
                </div>
            </section>

            {/* What Is Automated Invoicing */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is Automated Invoicing?</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                Automated invoicing eliminates the repetitive manual work of creating and sending invoices. 
                                Instead of logging in every month to create the same invoice for the same client, you set 
                                it up once and let the software handle the rest.
                            </p>
                            <p className="mb-4">
                                With Illumi's automation features, you can create recurring invoices that generate 
                                automatically, schedule invoices to send at specific times, and set up automatic 
                                reminders for overdue payments.
                            </p>
                            <p>
                                For South African freelancers and small businesses, this means less time on admin and 
                                more consistent cash flow. No more forgetting to invoice a client or chasing late payments.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Automation Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to put your invoicing on autopilot.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {automationFeatures.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Time Savings */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How Much Time Will You Save?</h2>
                        <p className="text-lg text-muted-foreground">
                            See the difference automation makes for a typical small business.
                        </p>
                    </div>
                    <div className="border border-border rounded-2xl overflow-hidden bg-card">
                        <div className="grid grid-cols-3 bg-muted/50 border-b border-border">
                            <div className="p-4 font-bold">Task</div>
                            <div className="p-4 font-bold text-center border-l border-border">Manual</div>
                            <div className="p-4 font-bold text-center border-l border-border">Automated</div>
                        </div>
                        {timeSavings.map((item, i) => (
                            <div key={i} className="grid grid-cols-3 border-b border-border last:border-b-0">
                                <div className="p-4 text-muted-foreground">{item.task}</div>
                                <div className="p-4 text-center border-l border-border text-red-600 dark:text-red-400">{item.manual}</div>
                                <div className="p-4 text-center border-l border-border text-green-600 dark:text-green-400 font-medium">{item.automated}</div>
                            </div>
                        ))}
                        <div className="grid grid-cols-3 bg-primary/10">
                            <div className="p-4 font-bold">Total Monthly Savings</div>
                            <div className="p-4 text-center border-l border-border"></div>
                            <div className="p-4 text-center border-l border-border font-bold text-primary">4+ hours</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Recurring Invoices Work</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">1</div>
                                    <div>
                                        <h3 className="font-bold mb-1">Create a Template</h3>
                                        <p className="text-muted-foreground">Set up the invoice with client, line items, and amount.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">2</div>
                                    <div>
                                        <h3 className="font-bold mb-1">Set the Schedule</h3>
                                        <p className="text-muted-foreground">Choose frequency: weekly, monthly, quarterly, or custom.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">3</div>
                                    <div>
                                        <h3 className="font-bold mb-1">Activate</h3>
                                        <p className="text-muted-foreground">Turn it on and Illumi handles the rest automatically.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">4</div>
                                    <div>
                                        <h3 className="font-bold mb-1">Get Paid</h3>
                                        <p className="text-muted-foreground">Invoices are sent automatically. Clients pay online.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-6 bg-card">
                            <div className="text-sm font-medium text-muted-foreground mb-4">Recurring Invoice Setup</div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <div className="text-xs text-muted-foreground mb-1">Client</div>
                                    <div className="font-medium">Acme Corporation</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <div className="text-xs text-muted-foreground mb-1">Amount</div>
                                    <div className="font-medium">R 5,000.00 / month</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <div className="text-xs text-muted-foreground mb-1">Schedule</div>
                                    <div className="font-medium">1st of every month</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <div className="text-xs text-muted-foreground mb-1">Next Invoice</div>
                                    <div className="font-medium">1 March 2026</div>
                                </div>
                                <div className="flex items-center gap-2 p-4 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                    <IconCheck className="h-5 w-5" />
                                    <span className="font-medium">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect For</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Automated invoicing works for any business with regular billing.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {useCases.map((useCase) => (
                            <div key={useCase.title} className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                                <p className="text-muted-foreground text-sm">{useCase.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-border rounded-xl p-6 bg-card">
                                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Put Your Invoicing on Autopilot
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Stop wasting time on repetitive invoicing tasks. Set up automation once and 
                        let Illumi handle the rest.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/invoices/new">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                Start Free Today
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invoice-software-south-africa">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Illumi Automated Invoicing",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "featureList": ["Recurring invoices", "Scheduled sending", "Automatic reminders", "Payment tracking"],
                        "offers": {
                            "@type": "Offer",
                            "price": "99",
                            "priceCurrency": "ZAR",
                        },
                        "description": "Automated invoicing software for South African businesses. Set up recurring invoices and automatic payment reminders.",
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map((faq) => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer,
                            },
                        })),
                    }),
                }}
            />
        </>
    )
}
