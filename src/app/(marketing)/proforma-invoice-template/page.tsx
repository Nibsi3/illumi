import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconFileInvoice,
    IconCheck,
    IconArrowRight,
    IconTransform,
    IconClipboardList,
    IconClock,
    IconShieldCheck,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Proforma Invoice Template | Create Proforma Invoices Online | Illumi",
    description: "Create professional proforma invoices online for free. Outline goods, services, and costs before delivery. Convert to tax invoices with one click. SARS-compliant templates for South African businesses.",
    keywords: [
        "proforma invoice template",
        "proforma invoice",
        "proforma invoice template free",
        "proforma invoice generator",
        "proforma invoice example",
        "proforma invoice South Africa",
        "pro forma invoice template",
        "proforma invoice meaning",
        "how to create a proforma invoice",
        "proforma invoice vs invoice",
        "quotation to invoice",
        "preliminary invoice",
    ],
    openGraph: {
        title: "Free Proforma Invoice Template | Illumi",
        description: "Create proforma invoices online. Convert to tax invoices with one click.",
        type: "website",
    },
    alternates: {
        canonical: "/proforma-invoice-template",
    },
}

export default function ProformaInvoiceTemplatePage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <IconFileInvoice className="w-4 h-4" />
                            Professional Proforma Invoice Templates
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Free Proforma Invoice Template
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Create professional proforma invoices to outline costs before delivery. Set validity periods, list detailed line items, and convert to a tax invoice with one click when the deal is confirmed.
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Create Proforma Invoice — Free
                                <IconArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use a Proforma Invoice?</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: IconClipboardList, title: "Quote Before Delivery", desc: "Give clients a clear breakdown of costs before committing. Build trust and set expectations upfront." },
                            { icon: IconTransform, title: "Convert to Tax Invoice", desc: "Once the client approves, convert to a full tax invoice with one click. No re-entering data." },
                            { icon: IconClock, title: "Set Validity Periods", desc: "Add an expiry date to your proforma so clients know the quoted price is time-limited." },
                            { icon: IconShieldCheck, title: "SARS-Compliant", desc: "Our proforma templates include all required fields for South African tax compliance." },
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

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                        <h2>What is a Proforma Invoice?</h2>
                        <p>A proforma invoice is a preliminary bill of sale sent to buyers before goods are delivered or services are rendered. Unlike a tax invoice (which is a legal document requesting payment), a proforma invoice is an estimate or quotation that outlines the expected costs.</p>

                        <h3>Proforma Invoice vs Tax Invoice</h3>
                        <p>Understanding the difference is crucial for South African businesses:</p>
                        <ul>
                            <li><strong>Proforma invoice</strong> — A non-binding estimate sent before delivery. Not a legal demand for payment. Used for customs, pre-approval, or budgeting purposes.</li>
                            <li><strong>Tax invoice</strong> — A legal document issued after delivery that demands payment. Required by SARS for VAT-registered businesses. Must include VAT registration number and meet specific formatting requirements.</li>
                        </ul>

                        <h3>When to Use a Proforma Invoice</h3>
                        <ul>
                            <li>When a client requests a cost estimate before committing</li>
                            <li>For international trade and customs declarations</li>
                            <li>When applying for letters of credit or import permits</li>
                            <li>To get client approval before starting work</li>
                            <li>For deposit requests before project commencement</li>
                        </ul>

                        <h3>What to Include in a Proforma Invoice</h3>
                        <ul>
                            <li>The words &quot;Proforma Invoice&quot; clearly displayed</li>
                            <li>Your business name, address, and contact details</li>
                            <li>Client&apos;s name and address</li>
                            <li>Unique proforma number</li>
                            <li>Date and validity period</li>
                            <li>Detailed description of goods or services</li>
                            <li>Quantities, unit prices, and total amounts</li>
                            <li>Payment terms and conditions</li>
                            <li>VAT information (if applicable)</li>
                        </ul>

                        <p>Illumi makes it easy to create proforma invoices that include all of these details. Once your client approves, convert to a full tax invoice with a single click. <Link href="/login" className="text-primary font-semibold">Try it free today</Link>.</p>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Proforma Invoice Now</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Free forever. No credit card required.</p>
                    <Link href="/login">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Create My First Invoice <IconArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
