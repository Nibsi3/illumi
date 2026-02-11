import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconCheck,
    IconArrowRight,
    IconChartBar,
    IconFileAnalytics,
    IconCalendar,
    IconDownload,
    IconFilter,
    IconTrendingUp,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Reports South Africa | VAT Reports & Business Analytics | Illumi",
    description: "Generate professional invoice reports for your South African business. VAT reports, income summaries, client analytics, and exportable data for SARS compliance.",
    keywords: [
        "invoice reports south africa",
        "vat invoice reports",
        "business invoice analytics",
        "invoice reporting software",
        "sars invoice reports",
        "income reports south africa",
        "invoice summary reports",
        "billing reports",
    ],
    alternates: {
        canonical: "/features/invoice-reports",
    },
    openGraph: {
        title: "Invoice Reports South Africa | Illumi",
        description: "Generate VAT reports, income summaries, and client analytics. Built for SA businesses.",
        type: "website",
        locale: "en_ZA",
    },
}

const reportTypes = [
    {
        icon: IconChartBar,
        title: "Income Summary",
        description: "See total invoiced amounts by month, quarter, or year. Track your business growth over time.",
    },
    {
        icon: IconFileAnalytics,
        title: "VAT Reports",
        description: "Generate VAT summaries for SARS submissions. See VAT collected and outstanding in one view.",
    },
    {
        icon: IconCalendar,
        title: "Period Comparisons",
        description: "Compare this month to last month, this quarter to last quarter. Spot trends instantly.",
    },
    {
        icon: IconFilter,
        title: "Client Reports",
        description: "See invoicing history by client. Identify your top customers and track payment patterns.",
    },
    {
        icon: IconTrendingUp,
        title: "Payment Analytics",
        description: "Track average payment times, overdue rates, and collection efficiency.",
    },
    {
        icon: IconDownload,
        title: "Export to CSV/PDF",
        description: "Download reports for your accountant, bookkeeper, or SARS submissions.",
    },
]

const sampleMetrics = [
    { label: "Total Invoiced (2024)", value: "R 485,200", change: "+23%" },
    { label: "VAT Collected", value: "R 63,287", change: "+18%" },
    { label: "Outstanding", value: "R 24,500", change: "-12%" },
    { label: "Avg. Payment Time", value: "8 days", change: "-3 days" },
]

const useCases = [
    {
        title: "SARS VAT Submissions",
        description: "Generate VAT reports that match SARS requirements. Export data for your VAT201 submissions.",
    },
    {
        title: "Accountant Handoff",
        description: "Send your accountant clean, organized invoice data. No more manual spreadsheet work.",
    },
    {
        title: "Business Planning",
        description: "Use income trends to forecast revenue and plan for growth or seasonal changes.",
    },
    {
        title: "Client Negotiations",
        description: "Know exactly how much each client is worth when discussing rates or contracts.",
    },
]

const faqs = [
    {
        question: "What reports can I generate with Illumi?",
        answer: "Illumi generates income summaries, VAT reports, client analytics, payment tracking reports, and period comparisons. All reports can be filtered by date range, client, or status.",
    },
    {
        question: "Can I export reports for SARS?",
        answer: "Yes. Illumi generates VAT summaries that align with SARS requirements. You can export to CSV or PDF for your VAT201 submissions or accountant.",
    },
    {
        question: "Are reports included in the free plan?",
        answer: "Basic reports are included free. Advanced analytics and custom date ranges are available on Pro.",
    },
]

export default function InvoiceReportsPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="bg-background grainy-gradient">
                {/* Hero Section */}
                <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                    <div className="absolute inset-0 z-0">
                        <div className="h-full w-full bg-background" />
                        <div className="absolute inset-0 bg-white dark:bg-black/60" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
                            <span className="px-3 py-1 rounded-full bg-accent text-muted-foreground">Invoice Reports</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Reports That Make<br />
                            <span className="text-muted-foreground">SARS Happy</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
                            Generate professional invoice reports for VAT submissions, accountant handoffs, and business planning. Built for South African compliance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                            >
                                <Link href="/invoices/new">
                                    Start Generating Reports
                                    <IconArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted"
                            >
                                <Link href="/pricing">View Pricing</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Metrics Preview */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {sampleMetrics.map((metric, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
                                    <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
                                    <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                                    <div className={`text-sm ${metric.change.startsWith('+') ? 'text-emerald-500' : metric.change.startsWith('-') && metric.label.includes('Outstanding') ? 'text-emerald-500' : metric.change.startsWith('-') ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                        {metric.change} vs last year
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Report Types */}
                <section className="py-16 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                            Reports You Can Generate
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reportTypes.map((report, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
                                    <report.icon className="w-10 h-10 text-primary mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">{report.title}</h3>
                                    <p className="text-muted-foreground">{report.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                            How SA Businesses Use Reports
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {useCases.map((useCase, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card">
                                    <IconCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                                        <p className="text-muted-foreground">{useCase.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-muted/30">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            Ready to Get Reporting?
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Join thousands of South African businesses using Illumi for professional invoice reports.
                        </p>
                        <Button
                            asChild
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
                        >
                            <Link href="/invoices/new">
                                Try Illumi Free
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        </>
    )
}
