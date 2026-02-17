import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
    IconUser,
    IconClock,
    IconCurrencyDollar,
    IconBriefcase,
    IconPalette,
    IconCode,
    IconPencil,
    IconCamera,
    IconMusic,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Freelance Invoice Template | Invoice Templates for Freelancers | Illumi",
    description: "Professional freelance invoice templates designed for independent workers. Bill hourly or per project, track time, and get paid faster. Free templates for designers, developers, writers, photographers, and consultants.",
    keywords: [
        "freelance invoice template",
        "freelancer invoice template",
        "freelance invoice template free",
        "freelancer invoice",
        "invoice for freelancers",
        "freelance billing template",
        "contractor invoice template",
        "self-employed invoice template",
        "independent contractor invoice",
        "graphic designer invoice template",
        "web developer invoice template",
        "photographer invoice template",
        "writer invoice template",
        "consultant invoice template",
        "hourly invoice template",
    ],
    openGraph: {
        title: "Free Freelance Invoice Template | Illumi",
        description: "Professional invoice templates for freelancers. Bill hourly or per project.",
        type: "website",
    },
    alternates: {
        canonical: "/freelance-invoice-template",
    },
}

const freelanceTypes = [
    { icon: IconPalette, title: "Graphic Designers", desc: "Logo design, branding, illustrations — invoice by project or hourly with revision tracking." },
    { icon: IconCode, title: "Web Developers", desc: "Websites, apps, maintenance — bill milestones, sprints, or monthly retainers with ease." },
    { icon: IconPencil, title: "Writers & Copywriters", desc: "Articles, web copy, editing — invoice per word, per project, or on retainer." },
    { icon: IconCamera, title: "Photographers", desc: "Shoots, editing, licensing — include usage rights and deliverable details on your invoice." },
    { icon: IconMusic, title: "Musicians & Creatives", desc: "Gigs, sessions, production — professional invoices that match your creative brand." },
    { icon: IconBriefcase, title: "Consultants", desc: "Strategy, coaching, advisory — bill hourly sessions or project-based engagements." },
]

const tips = [
    {
        title: "Always use a unique invoice number",
        desc: "Sequential numbering (INV-001, INV-002...) helps with tracking and is required by SARS. Illumi generates these automatically.",
    },
    {
        title: "Include clear payment terms",
        desc: "Specify when payment is due (e.g., 'Net 14' or '30 days from invoice date'). This reduces late payments significantly.",
    },
    {
        title: "Itemise your work clearly",
        desc: "Break down exactly what you did. Clients are more likely to pay promptly when they understand the value of each line item.",
    },
    {
        title: "Add your banking details",
        desc: "Include your bank name, account number, and branch code directly on the invoice. Or better yet, add an online payment link.",
    },
    {
        title: "Send invoices promptly",
        desc: "Invoice as soon as work is delivered. The longer you wait, the longer you'll wait to get paid.",
    },
    {
        title: "Follow up on overdue invoices",
        desc: "Don't be shy about following up. Illumi can send automatic payment reminders for you.",
    },
]

export default function FreelanceInvoiceTemplatePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <IconUser className="w-4 h-4" />
                            Built for Independent Professionals
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Freelance Invoice Templates
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Professional invoice templates designed specifically for freelancers. Bill hourly or per project, add your branding, and get paid faster. 2 months of Pro features free.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/invoices/new">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    Create Freelance Invoice — Free
                                    <IconArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/invoice-template">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    Browse All Templates
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features for Freelancers */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Invoicing Features Freelancers Actually Need</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: IconClock, title: "Hourly Billing", desc: "Track hours and bill by the hour. Perfect for consulting, development, and design work." },
                            { icon: IconCurrencyDollar, title: "Project-Based Billing", desc: "Set fixed prices for deliverables. Add milestones and deposit tracking." },
                            { icon: IconBriefcase, title: "Retainer Invoicing", desc: "Set up recurring invoices for monthly retainer clients. Auto-generated and auto-sent." },
                            { icon: IconFileInvoice, title: "Multi-Currency", desc: "Bill international clients in USD, EUR, GBP, or any currency. Auto-converted totals." },
                        ].map((f) => (
                            <div key={f.title} className="bg-card rounded-xl border p-6">
                                <f.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates by Profession */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Templates for Every Freelance Profession</h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            No matter your speciality, we have an invoice template that fits your workflow.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {freelanceTypes.map((ft) => (
                            <div key={ft.title} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
                                <ft.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{ft.title}</h3>
                                <p className="text-sm text-muted-foreground">{ft.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Freelance Invoicing Tips */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            6 Freelance Invoicing Tips to Get Paid Faster
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {tips.map((tip, i) => (
                                <div key={tip.title} className="bg-card rounded-lg border p-6">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</span>
                                        <div>
                                            <h3 className="font-semibold mb-1">{tip.title}</h3>
                                            <p className="text-sm text-muted-foreground">{tip.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                        <h2>The Complete Guide to Freelance Invoicing</h2>
                        <p>As a freelancer, your invoice is often the last impression a client has of you before they decide to pay. A professional, well-structured invoice shows that you take your business seriously — and makes clients more likely to pay on time.</p>

                        <h3>What Every Freelance Invoice Should Include</h3>
                        <ul>
                            <li><strong>Your full name or business name</strong> and contact information</li>
                            <li><strong>Client&apos;s name and details</strong></li>
                            <li><strong>Invoice number</strong> — unique and sequential</li>
                            <li><strong>Invoice date</strong> and <strong>due date</strong></li>
                            <li><strong>Detailed description</strong> of work performed</li>
                            <li><strong>Hours worked or project deliverables</strong> with rates</li>
                            <li><strong>Subtotal, tax (if applicable), and total amount due</strong></li>
                            <li><strong>Payment methods accepted</strong> (bank transfer, online payment, etc.)</li>
                            <li><strong>Late payment terms</strong> (optional but recommended)</li>
                        </ul>

                        <h3>Freelance Invoicing in South Africa</h3>
                        <p>If you earn more than R1 million per year, you&apos;re required to register for VAT with SARS. Even below that threshold, you may voluntarily register. Illumi handles both scenarios — toggle VAT on or off, set your rate (standard 15%), and the calculations are done automatically.</p>

                        <p>As an independent contractor in South Africa, you&apos;re also responsible for provisional tax payments. Keeping accurate invoicing records with Illumi makes tax season much easier — export your income data anytime.</p>

                        <p><Link href="/invoices/new" className="text-primary font-semibold">Create your free freelance invoice now</Link> and join thousands of South African freelancers who trust Illumi for professional invoicing.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Invoice Like a Pro. Get Paid Like a Pro.</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Free professional invoicing for freelancers. No credit card needed.</p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Start Invoicing Free <IconArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
