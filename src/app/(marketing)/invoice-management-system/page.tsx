import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconLayoutDashboard,
    IconFolder,
    IconBell,
    IconChartPie,
    IconUsers,
    IconCalendar,
    IconSearch,
    IconFileAnalytics,
    IconClipboardList,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Management System South Africa | Illumi",
    description: "Complete invoice management system for South African businesses. Organise invoices by client, track payment status, automate reminders, and gain financial insights. Free to start.",
    keywords: [
        "invoice management system",
        "invoice management software",
        "manage invoices south africa",
        "invoice tracking system",
        "invoice organisation software",
        "payment tracking south africa",
        "invoice dashboard",
        "business invoice management",
    ],
    alternates: {
        canonical: "/invoice-management-system",
    },
    openGraph: {
        title: "Invoice Management System South Africa | Illumi",
        description: "Complete invoice management system. Organise, track, and manage all your invoices in one place.",
        type: "website",
        locale: "en_ZA",
    },
}

const features = [
    {
        icon: IconFolder,
        title: "Client-Based Organisation",
        description: "Invoices are automatically organised by client in folders. Click any client to see their complete invoice history instantly.",
    },
    {
        icon: IconLayoutDashboard,
        title: "Central Dashboard",
        description: "See all your invoices at a glance. Filter by status (paid, pending, overdue), date range, or client.",
    },
    {
        icon: IconBell,
        title: "Automated Reminders",
        description: "Set up automatic payment reminders for overdue invoices. Stop chasing clients manually.",
    },
    {
        icon: IconChartPie,
        title: "Financial Insights",
        description: "Track revenue, monitor cash flow, and identify your best-paying clients with built-in analytics.",
    },
    {
        icon: IconSearch,
        title: "Powerful Search",
        description: "Find any invoice instantly by number, client name, amount, or date. No more digging through folders.",
    },
    {
        icon: IconCalendar,
        title: "Payment Scheduling",
        description: "See upcoming payments and overdue invoices on a calendar view. Never miss a follow-up.",
    },
]

const managementCapabilities = [
    "Create and send invoices",
    "Track payment status",
    "Organise by client",
    "Filter and search",
    "Automatic reminders",
    "Recurring invoices",
    "Duplicate invoices",
    "Bulk actions",
    "Export to PDF/CSV",
    "Archive old invoices",
    "Client payment history",
    "Revenue reporting",
]

const workflowSteps = [
    {
        title: "Create",
        description: "Generate professional invoices with your branding, VAT calculations, and payment terms.",
    },
    {
        title: "Send",
        description: "Email invoices directly or share a link. Clients can view and pay online.",
    },
    {
        title: "Track",
        description: "Monitor invoice status in real-time. See when clients view invoices and when payments arrive.",
    },
    {
        title: "Remind",
        description: "Automatic reminders for overdue invoices. Customise timing and messaging.",
    },
    {
        title: "Report",
        description: "Analyse revenue, identify trends, and understand your cash flow with built-in reports.",
    },
]

const faqs = [
    {
        question: "What is an invoice management system?",
        answer: "An invoice management system is software that helps businesses create, send, track, and organise invoices in one central location. It replaces manual processes like spreadsheets and paper filing, automating tasks like payment reminders and providing insights into your cash flow.",
    },
    {
        question: "How does Illumi help manage invoices?",
        answer: "Illumi automatically organises invoices by client, tracks payment status in real-time, sends automated reminders for overdue invoices, and provides a dashboard showing your complete financial picture. You can search, filter, and export invoices with ease.",
    },
    {
        question: "Can I see which invoices are overdue?",
        answer: "Yes. Illumi's dashboard clearly shows overdue invoices with the amount outstanding and days overdue. You can filter to see only overdue invoices and send reminders with one click.",
    },
    {
        question: "Does Illumi support recurring invoices?",
        answer: "Yes. With Illumi Pro, you can set up recurring invoices that are automatically created and sent on your schedule — weekly, monthly, or custom intervals. Perfect for retainer clients.",
    },
    {
        question: "Can I export my invoice data?",
        answer: "Absolutely. Export individual invoices as PDFs or export your complete invoice history as CSV for accounting software or tax purposes.",
    },
    {
        question: "How do I organise invoices by client?",
        answer: "Illumi automatically organises invoices by client. When you create an invoice for a client, it's filed under their name. Click any client to see all their invoices, payment history, and outstanding balance.",
    },
]

const testimonials = [
    {
        quote: "Before Illumi, I had invoices scattered across emails and folders. Now everything is in one place, organised by client. I can find any invoice in seconds.",
        author: "David N.",
        role: "Accountant, Johannesburg",
    },
    {
        quote: "The automatic reminders have been brilliant. I used to forget to follow up on overdue invoices. Now Illumi does it for me and I get paid faster.",
        author: "Zanele P.",
        role: "Marketing Consultant, Cape Town",
    },
]

export default function InvoiceManagementSystemPage() {
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
                            <IconClipboardList className="h-4 w-4" />
                            Invoice Management
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoice Management System for South African Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Organise all your invoices in one place. Track payment status, automate reminders, 
                            and gain insights into your cash flow. Built for South African freelancers and SMEs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices/new">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                    Start Managing Invoices
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/features/invoicing">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    See Features
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Free forever • Unlimited invoices • No credit card required
                        </p>
                    </div>
                </div>
            </section>

            {/* What Is Invoice Management */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is Invoice Management?</h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p className="mb-4">
                                Invoice management is the process of creating, sending, tracking, and organising invoices 
                                throughout their lifecycle — from creation to payment. Effective invoice management ensures 
                                you get paid on time and have complete visibility into your business finances.
                            </p>
                            <p className="mb-4">
                                Without a proper system, invoices get lost in email threads, payments slip through the cracks, 
                                and you spend hours chasing clients for money. An invoice management system automates these 
                                processes, saving you time and improving cash flow.
                            </p>
                            <p>
                                For South African businesses, good invoice management also means staying compliant with SARS 
                                requirements for tax invoices and maintaining proper records for VAT submissions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Invoice Management Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to manage invoices efficiently and get paid faster.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">The Complete Invoice Lifecycle</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            From creation to payment, Illumi manages every step of your invoicing workflow.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {workflowSteps.map((step, i) => (
                            <div key={step.title} className="text-center relative">
                                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4">
                                    {i + 1}
                                </div>
                                <h3 className="font-bold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                                {i < workflowSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capabilities List */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything You Need to Manage Invoices</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Illumi provides a complete toolkit for invoice management, from creation to reporting.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {managementCapabilities.map((capability) => (
                                    <div key={capability} className="flex items-center gap-3">
                                        <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                        <span>{capability}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-border rounded-2xl p-6 bg-card">
                            <div className="flex items-center gap-3 mb-6">
                                <IconFileAnalytics className="h-8 w-8 text-primary" />
                                <span className="font-bold text-lg">Invoice Overview</span>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                                        <div className="text-2xl font-bold">47</div>
                                        <div className="text-xs text-muted-foreground">Total Invoices</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                                        <div className="text-2xl font-bold text-green-600">38</div>
                                        <div className="text-xs text-muted-foreground">Paid</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                                        <div className="text-2xl font-bold text-amber-600">9</div>
                                        <div className="text-xs text-muted-foreground">Pending</div>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-4">
                                    <div className="text-sm font-medium mb-3">Recent Invoices</div>
                                    <div className="space-y-2">
                                        {[
                                            { client: "Acme Corp", amount: "R 8,500", status: "Paid" },
                                            { client: "TechStart", amount: "R 4,200", status: "Pending" },
                                            { client: "Design Co", amount: "R 12,000", status: "Overdue" },
                                        ].map((inv, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                                <span className="text-sm">{inv.client}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium">{inv.amount}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        inv.status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                        inv.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}>
                                                        {inv.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Client Organisation */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 border border-border rounded-2xl p-6 bg-card">
                            <div className="flex items-center gap-3 mb-6">
                                <IconUsers className="h-8 w-8 text-primary" />
                                <span className="font-bold text-lg">Client Folders</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "Acme Corporation", invoices: 12, outstanding: "R 0" },
                                    { name: "TechStart SA", invoices: 8, outstanding: "R 4,200" },
                                    { name: "Creative Agency", invoices: 15, outstanding: "R 8,500" },
                                    { name: "Local Retailer", invoices: 5, outstanding: "R 0" },
                                ].map((client, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                                            <IconFolder className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{client.name}</div>
                                            <div className="text-xs text-muted-foreground">{client.invoices} invoices</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{client.outstanding}</div>
                                            <div className="text-xs text-muted-foreground">outstanding</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Organised by Client, Automatically</h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                Every invoice you create is automatically filed under the client's name. No manual 
                                organisation needed — just click a client to see their complete invoice history.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                See at a glance how many invoices each client has, their total outstanding balance, 
                                and their payment history. Identify your best clients and those who pay late.
                            </p>
                            <p className="text-muted-foreground">
                                Perfect for freelancers and agencies managing multiple clients with ongoing projects.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What SA Businesses Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="border border-border rounded-2xl p-6 bg-card">
                                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                                <div>
                                    <div className="font-bold">{testimonial.author}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Common questions about invoice management
                        </p>
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
                        Take Control of Your Invoices
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Stop losing track of invoices and chasing payments. Illumi's invoice management system 
                        keeps everything organised so you can focus on your business.
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
                        "name": "Illumi Invoice Management System",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "ZAR",
                        },
                        "description": "Complete invoice management system for South African businesses. Organise invoices, track payments, and automate reminders.",
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
