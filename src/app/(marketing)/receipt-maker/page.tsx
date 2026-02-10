import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconReceipt,
    IconCheck,
    IconArrowRight,
    IconDownload,
    IconMail,
    IconPrinter,
    IconShieldCheck,
    IconClock,
    IconDevices,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Receipt Maker | Create Professional Receipts Online | Illumi",
    description: "Create free professional receipts online in seconds. Perfect for cash payments, proof of purchase, and record keeping. Customizable templates for South African businesses.",
    keywords: [
        "free receipt maker",
        "receipt generator South Africa",
        "create receipt online free",
        "receipt template",
        "proof of payment receipt",
        "cash receipt maker",
        "business receipt generator",
        "payment receipt creator",
        "professional receipt template",
        "receipt PDF generator",
    ],
    openGraph: {
        title: "Free Receipt Maker | Illumi",
        description: "Create professional receipts in seconds. Customizable templates and instant PDF download.",
        type: "website",
    },
    alternates: {
        canonical: "/receipt-maker",
    },
}

const features = [
    {
        icon: IconReceipt,
        title: "Professional Templates",
        description: "Clean, professional receipt designs that look great printed or digital.",
    },
    {
        icon: IconDownload,
        title: "Instant PDF Download",
        description: "Download receipts as PDF files ready to print or email to customers.",
    },
    {
        icon: IconMail,
        title: "Email Receipts",
        description: "Send receipts directly to customers via email with one click.",
    },
    {
        icon: IconPrinter,
        title: "Print Ready",
        description: "Optimized for printing on standard paper or thermal receipt printers.",
    },
    {
        icon: IconShieldCheck,
        title: "Secure Storage",
        description: "All receipts stored securely in the cloud for easy access anytime.",
    },
    {
        icon: IconDevices,
        title: "Works Everywhere",
        description: "Create receipts from any device - desktop, tablet, or mobile.",
    },
]

const useCases = [
    {
        title: "Cash Payments",
        description: "Provide proof of payment for cash transactions. Essential for record keeping and customer trust.",
    },
    {
        title: "Service Completion",
        description: "Issue receipts when services are rendered. Perfect for contractors, consultants, and service providers.",
    },
    {
        title: "Deposits & Partial Payments",
        description: "Document deposits and partial payments with clear receipt records.",
    },
    {
        title: "Refunds & Returns",
        description: "Create refund receipts to document returned goods or cancelled services.",
    },
    {
        title: "Donations",
        description: "Issue donation receipts for non-profits and charitable contributions.",
    },
    {
        title: "Rent Payments",
        description: "Landlords can issue rent receipts for tenants as proof of payment.",
    },
]

const receiptVsInvoice = [
    {
        aspect: "Timing",
        receipt: "Issued after payment",
        invoice: "Issued before payment",
    },
    {
        aspect: "Purpose",
        receipt: "Proof of payment",
        invoice: "Request for payment",
    },
    {
        aspect: "Status",
        receipt: "Transaction complete",
        invoice: "Payment pending",
    },
    {
        aspect: "Use Case",
        receipt: "Cash sales, completed services",
        invoice: "Credit sales, billing",
    },
]

export default function ReceiptMakerPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                                <IconReceipt className="h-4 w-4" />
                                Free Tool
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                Free Receipt Maker for South African Businesses
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Create professional payment receipts in seconds. Perfect for cash transactions, 
                                service completions, and keeping accurate records for your business.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/login">
                                    <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                                        Create Free Receipt
                                        <IconArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                No signup required to preview. Free forever.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl max-w-sm mx-auto">
                                <div className="text-center border-b border-dashed border-border pb-4 mb-4">
                                    <div className="text-xl font-bold">RECEIPT</div>
                                    <div className="text-sm text-muted-foreground">Your Business Name</div>
                                </div>
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span>26 Jan 2026</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Receipt #:</span>
                                        <span>RCP-0042</span>
                                    </div>
                                </div>
                                <div className="border-t border-dashed border-border pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Consulting Service</span>
                                        <span>R 2,500.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Materials</span>
                                        <span>R 450.00</span>
                                    </div>
                                </div>
                                <div className="border-t border-dashed border-border mt-4 pt-4">
                                    <div className="flex justify-between font-bold">
                                        <span>TOTAL PAID</span>
                                        <span>R 2,950.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                        <span>Payment Method:</span>
                                        <span>Cash</span>
                                    </div>
                                </div>
                                <div className="text-center mt-6 pt-4 border-t border-dashed border-border">
                                    <p className="text-xs text-muted-foreground">Thank you for your business!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Create Receipts in Seconds
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Simple, fast, and professional. Everything you need to issue payment receipts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-colors"
                            >
                                <div className="p-3 rounded-xl bg-accent w-fit mb-4">
                                    <feature.icon className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            When to Use a Receipt
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Receipts are essential for documenting completed transactions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((useCase) => (
                            <div
                                key={useCase.title}
                                className="rounded-xl border border-border bg-card p-6"
                            >
                                <h3 className="font-semibold mb-2">{useCase.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {useCase.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Receipt vs Invoice */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Receipt vs Invoice: What's the Difference?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Understanding when to use each document is important for proper record keeping.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Aspect</th>
                                    <th className="text-left p-4 font-semibold">Receipt</th>
                                    <th className="text-left p-4 font-semibold">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {receiptVsInvoice.map((row) => (
                                    <tr key={row.aspect} className="hover:bg-muted/50 transition-colors">
                                        <td className="p-4 font-medium">{row.aspect}</td>
                                        <td className="p-4 text-muted-foreground">{row.receipt}</td>
                                        <td className="p-4 text-muted-foreground">{row.invoice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-4">
                            <IconClock className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">Pro Tip</h3>
                                <p className="text-sm text-muted-foreground">
                                    With Illumi, you can automatically generate a receipt when an invoice is marked as paid. 
                                    This ensures you always have proper documentation for every transaction.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What to Include */}
            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        What to Include on a Receipt
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Business Information</h3>
                                    <p className="text-sm text-muted-foreground">Name, address, contact details, and VAT number if registered.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Receipt Number</h3>
                                    <p className="text-sm text-muted-foreground">Unique identifier for tracking and reference.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Date & Time</h3>
                                    <p className="text-sm text-muted-foreground">When the payment was received.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Customer Details</h3>
                                    <p className="text-sm text-muted-foreground">Name and contact information of the payer.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Items/Services</h3>
                                    <p className="text-sm text-muted-foreground">Description of what was purchased or paid for.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Amount Paid</h3>
                                    <p className="text-sm text-muted-foreground">Total amount received including VAT breakdown.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Payment Method</h3>
                                    <p className="text-sm text-muted-foreground">Cash, card, EFT, or other payment type.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Reference Number</h3>
                                    <p className="text-sm text-muted-foreground">Link to related invoice if applicable.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Start Creating Professional Receipts
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of South African businesses using Illumi for invoicing and receipts. 
                        Free forever, no credit card required.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Free Receipt
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
