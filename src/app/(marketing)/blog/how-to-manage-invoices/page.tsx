import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconBulb } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "How to Manage Invoices for Small Businesses | Illumi",
    description: "Practical guide to managing invoices for small businesses. Learn step-by-step processes, best practices, and tools to streamline your invoicing workflow.",
    keywords: [
        "how to manage invoices",
        "invoice management small business",
        "invoicing for small business",
        "manage invoices effectively",
        "small business invoicing tips",
        "invoice workflow",
    ],
    alternates: {
        canonical: "/blog/how-to-manage-invoices",
    },
}

const steps = [
    {
        number: "1",
        title: "Set Up Your Invoicing System",
        content: "Choose invoice software that fits your needs. Look for features like online payments, automatic reminders, and VAT support. Set up your business details, logo, and payment terms once — they'll appear on every invoice.",
        tips: ["Use cloud-based software for access anywhere", "Set up payment gateway integration from day one", "Create invoice templates for different services"],
    },
    {
        number: "2",
        title: "Create Clear, Professional Invoices",
        content: "Every invoice should include: your business details, client details, invoice number, date, itemised services/products, amounts, VAT (if applicable), payment terms, and payment methods.",
        tips: ["Use sequential invoice numbers", "Be specific in line item descriptions", "Always include due date prominently"],
    },
    {
        number: "3",
        title: "Send Invoices Promptly",
        content: "Invoice as soon as work is completed or goods are delivered. The longer you wait, the longer you'll wait for payment. Same-day invoicing is ideal.",
        tips: ["Set a daily invoicing routine", "Use email delivery with payment links", "Confirm receipt for large invoices"],
    },
    {
        number: "4",
        title: "Track Payment Status",
        content: "Monitor which invoices are paid, pending, or overdue. Use your software's dashboard to see your complete financial picture at a glance.",
        tips: ["Check invoice status daily", "Flag overdue invoices immediately", "Know your total outstanding at all times"],
    },
    {
        number: "5",
        title: "Follow Up on Overdue Invoices",
        content: "Don't let overdue invoices slide. Send reminders at set intervals: on due date, 7 days overdue, 14 days overdue. Be professional but persistent.",
        tips: ["Automate reminders where possible", "Have escalation templates ready", "Document all follow-up attempts"],
    },
    {
        number: "6",
        title: "Record Payments and Reconcile",
        content: "When payments arrive, mark invoices as paid immediately. Reconcile with your bank account regularly to ensure accuracy.",
        tips: ["Use automatic payment matching if available", "Reconcile weekly at minimum", "Keep records for 5 years (SARS requirement)"],
    },
]

const bestPractices = [
    "Invoice immediately after completing work",
    "Use clear payment terms (e.g., 'Due within 14 days')",
    "Offer multiple payment methods",
    "Send invoices via email with payment links",
    "Set up automatic payment reminders",
    "Review aged receivables weekly",
    "Follow up personally on large overdue amounts",
    "Keep detailed records for tax purposes",
]

const commonChallenges = [
    {
        challenge: "Clients claim they didn't receive the invoice",
        solution: "Use email delivery with read receipts. Keep proof of sending.",
    },
    {
        challenge: "Invoices get lost in client's inbox",
        solution: "Use clear subject lines. Send reminders. Offer a client portal.",
    },
    {
        challenge: "Clients dispute invoice amounts",
        solution: "Provide detailed line items. Reference quotes or contracts.",
    },
    {
        challenge: "Forgetting to follow up on overdue invoices",
        solution: "Use automatic reminders. Review overdue list daily.",
    },
    {
        challenge: "Cash flow problems from late payments",
        solution: "Invoice promptly. Offer online payments. Consider deposits.",
    },
]

export default function HowToManageInvoicesPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            8 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Guide</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        How to Manage Invoices for Small Businesses
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        A practical, step-by-step guide to managing invoices effectively. Get paid faster 
                        and spend less time on admin.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            Managing invoices doesn't have to be complicated. With the right system and habits, 
                            you can streamline your invoicing, reduce late payments, and always know where your 
                            money is.
                        </p>
                        <p>
                            This guide walks you through the complete invoice management process, from setup to 
                            payment collection. Whether you're a freelancer or running a small business, these 
                            practices will help you get paid faster.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Step-by-Step Invoice Management</h2>
                    <div className="space-y-6 mb-12">
                        {steps.map((step) => (
                            <div key={step.number} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
                                        {step.number}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{step.title}</h3>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mb-4 ml-14">{step.content}</p>
                                <div className="ml-14 p-4 rounded-xl bg-muted/50">
                                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <IconBulb className="h-4 w-4 text-primary" />
                                        Pro Tips
                                    </div>
                                    <ul className="space-y-1">
                                        {step.tips.map((tip) => (
                                            <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <IconCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Best Practices Checklist</h2>
                    <div className="rounded-2xl border border-border bg-card p-6 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {bestPractices.map((practice) => (
                                <div key={practice} className="flex items-center gap-3">
                                    <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                    <span className="text-muted-foreground">{practice}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Common Challenges & Solutions</h2>
                    <div className="space-y-4 mb-12">
                        {commonChallenges.map((item) => (
                            <div key={item.challenge} className="rounded-xl border border-border bg-card p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Challenge</div>
                                        <div className="text-muted-foreground">{item.challenge}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Solution</div>
                                        <div className="text-muted-foreground">{item.solution}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">Tools You Need</h2>
                        <p className="text-muted-foreground mb-6">
                            The right tools make invoice management effortless. Here's what to look for:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-1">Invoice Software</div>
                                <div className="text-sm text-muted-foreground">Create, send, and track invoices in one place</div>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-1">Payment Gateway</div>
                                <div className="text-sm text-muted-foreground">Accept online payments (PayFast, Yoco)</div>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-1">Automatic Reminders</div>
                                <div className="text-sm text-muted-foreground">Follow up on overdue invoices automatically</div>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-1">Reporting Dashboard</div>
                                <div className="text-sm text-muted-foreground">See your financial picture at a glance</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Simplify Your Invoice Management</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi gives you everything you need to manage invoices effectively: professional 
                            templates, online payments, automatic reminders, and real-time tracking. Start 
                            free and see the difference.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/invoice-management-system">
                                <Button variant="outline">
                                    See All Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/what-is-invoice-management" className="text-primary hover:underline">
                                    What Is Invoice Management?
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/invoice-mistakes" className="text-primary hover:underline">
                                    7 Invoice Mistakes That Kill Your Cash Flow
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/payment-reminders" className="text-primary hover:underline">
                                    Automatic Payment Reminders
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Invoicing?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of South African small businesses using Illumi to manage invoices 
                        and get paid faster.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Free Today
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": "How to Manage Invoices for Small Businesses",
                        "description": "Step-by-step guide to managing invoices effectively for small businesses.",
                        "step": steps.map((s) => ({
                            "@type": "HowToStep",
                            "name": s.title,
                            "text": s.content,
                        })),
                    }),
                }}
            />
        </>
    )
}
