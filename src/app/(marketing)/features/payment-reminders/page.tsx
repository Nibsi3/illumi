import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconBell,
    IconMail,
    IconClock,
    IconSettings,
    IconCalendarEvent,
    IconMessageCircle,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Payment Reminders South Africa | Get Paid Faster | Illumi",
    description: "Automatic payment reminders for overdue invoices. Stop chasing clients manually and get paid faster. Customisable reminder schedules and professional templates. Free for SA businesses.",
    keywords: [
        "invoice reminders",
        "payment reminders",
        "automatic invoice reminders",
        "overdue invoice reminders",
        "invoice reminder software",
        "payment reminder system",
        "late payment reminders",
        "invoice follow up",
    ],
    alternates: {
        canonical: "/features/payment-reminders",
    },
    openGraph: {
        title: "Invoice Payment Reminders South Africa | Illumi",
        description: "Automatic payment reminders for overdue invoices. Stop chasing clients and get paid faster.",
        type: "website",
        locale: "en_ZA",
    },
}

const reminderFeatures = [
    {
        icon: IconBell,
        title: "Automatic Reminders",
        description: "Set up reminders once and let Illumi send them automatically. No more manual follow-ups.",
    },
    {
        icon: IconClock,
        title: "Custom Timing",
        description: "Choose when reminders are sent — before due date, on due date, or after. Set multiple reminder stages.",
    },
    {
        icon: IconMessageCircle,
        title: "Professional Templates",
        description: "Use our proven reminder templates or customise your own. Stay professional while getting paid.",
    },
    {
        icon: IconMail,
        title: "Email Delivery",
        description: "Reminders are sent via email with a direct link to pay. Make it easy for clients to settle up.",
    },
    {
        icon: IconCalendarEvent,
        title: "Escalation Ladder",
        description: "Set up escalating reminders — friendly at first, more urgent as time passes.",
    },
    {
        icon: IconSettings,
        title: "Per-Client Settings",
        description: "Customise reminder settings for different clients. Some need gentle nudges, others need firm deadlines.",
    },
]

const reminderSchedule = [
    { timing: "3 days before due", type: "Friendly reminder", tone: "Gentle" },
    { timing: "On due date", type: "Payment due today", tone: "Direct" },
    { timing: "7 days overdue", type: "First overdue notice", tone: "Firm" },
    { timing: "14 days overdue", type: "Second overdue notice", tone: "Urgent" },
    { timing: "30 days overdue", type: "Final notice", tone: "Serious" },
]

const benefits = [
    "Reduce late payments by up to 50%",
    "Save hours of manual follow-up time",
    "Maintain professional client relationships",
    "Never forget to chase an invoice",
    "Get paid faster on average",
    "Reduce awkward payment conversations",
]

const faqs = [
    {
        question: "How do automatic payment reminders work?",
        answer: "You set up a reminder schedule (e.g., 3 days before due, on due date, 7 days overdue). When an invoice reaches each milestone, Illumi automatically sends a professional reminder email to your client with a link to pay.",
    },
    {
        question: "Can I customise the reminder messages?",
        answer: "Yes. You can use our proven templates or write your own. Customise the subject line, message body, and tone to match your brand and communication style.",
    },
    {
        question: "Will clients know the reminders are automated?",
        answer: "No. Reminders are sent from your email address and look like personal messages. Clients see a professional reminder that appears to come directly from you.",
    },
    {
        question: "Can I set different reminders for different clients?",
        answer: "Yes. You can customise reminder settings per client. Some clients might need gentle reminders, while others respond better to firm deadlines.",
    },
    {
        question: "What if a client pays after a reminder is scheduled but before it's sent?",
        answer: "Illumi checks payment status before sending reminders. If an invoice is paid, scheduled reminders are automatically cancelled. No embarrassing 'please pay' emails after payment.",
    },
    {
        question: "Are payment reminders included in the free plan?",
        answer: "Basic manual reminders are available on all plans. Automatic scheduled reminders are available on Illumi Pro from R99/month.",
    },
]

export default function PaymentRemindersPage() {
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
                            <IconBell className="h-4 w-4" />
                            Reminder Feature
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Payment Reminders That Get You Paid
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Stop chasing clients for payment. Set up automatic reminders for overdue invoices and 
                            let Illumi do the follow-up. Professional, persistent, and effective.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Start Free Today
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
                            Manual reminders free • Auto reminders on Pro
                        </p>
                    </div>
                </div>
            </section>

            {/* The Problem */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">The Problem with Chasing Payments</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                Every business owner knows the frustration: you've done the work, sent the invoice, 
                                and now you're waiting. Days turn into weeks. You don't want to seem pushy, but you 
                                need to get paid.
                            </p>
                            <p className="mb-4">
                                Manual follow-up is time-consuming and awkward. You forget which clients you've 
                                reminded, worry about damaging relationships, and spend hours on admin instead of 
                                billable work.
                            </p>
                            <p>
                                Automatic payment reminders solve this. They're consistent, professional, and 
                                persistent — without you having to do anything. Studies show that automated 
                                reminders can reduce late payments by up to 50%.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Reminder Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to get paid on time, every time.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reminderFeatures.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reminder Schedule */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Perfect Reminder Schedule</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Set up an escalation ladder that starts friendly and gets more urgent over time. 
                                Clients get multiple chances to pay before things get serious.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-6 bg-card">
                            <div className="text-sm font-medium text-muted-foreground mb-4">Reminder Schedule</div>
                            <div className="space-y-3">
                                {reminderSchedule.map((reminder, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                        <div>
                                            <div className="font-medium text-sm">{reminder.timing}</div>
                                            <div className="text-xs text-muted-foreground">{reminder.type}</div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            reminder.tone === "Gentle" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                            reminder.tone === "Direct" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                            reminder.tone === "Firm" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                            reminder.tone === "Urgent" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                            {reminder.tone}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Example Reminder */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Reminder Templates</h2>
                        <p className="text-lg text-muted-foreground">
                            Use our proven templates or customise your own.
                        </p>
                    </div>
                    <div className="border border-border rounded-2xl p-8 bg-card">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                            <IconMail className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <div className="font-medium">Friendly Payment Reminder</div>
                                <div className="text-sm text-muted-foreground">Sent 3 days before due date</div>
                            </div>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p><strong className="text-foreground">Subject:</strong> Quick reminder: Invoice INV-2026-042 due soon</p>
                            <div className="border-l-2 border-primary pl-4">
                                <p className="mb-3">Hi [Client Name],</p>
                                <p className="mb-3">
                                    Just a friendly reminder that invoice INV-2026-042 for R 4,500.00 is due on 
                                    [Due Date].
                                </p>
                                <p className="mb-3">
                                    You can view and pay the invoice online using the button below:
                                </p>
                                <div className="my-4">
                                    <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                                        Pay Invoice Now
                                    </span>
                                </div>
                                <p className="mb-3">
                                    If you've already sent payment, please disregard this message.
                                </p>
                                <p>
                                    Thanks,<br />
                                    [Your Name]
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Set up once, get paid automatically.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "1", title: "Set Your Schedule", description: "Choose when reminders are sent relative to due dates." },
                            { step: "2", title: "Customise Messages", description: "Use templates or write your own reminder messages." },
                            { step: "3", title: "Activate", description: "Turn on automatic reminders for all invoices or select ones." },
                            { step: "4", title: "Get Paid", description: "Clients receive reminders and pay online. You do nothing." },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
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
                        Stop Chasing Payments. Start Getting Paid.
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Set up automatic payment reminders and let Illumi do the follow-up. 
                        Professional, persistent, and effective.
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
                        "name": "Illumi Payment Reminders",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "featureList": ["Automatic reminders", "Custom scheduling", "Professional templates", "Escalation ladder"],
                        "offers": {
                            "@type": "Offer",
                            "price": "99",
                            "priceCurrency": "ZAR",
                        },
                        "description": "Automatic payment reminder software for South African businesses. Stop chasing clients and get paid faster.",
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
