import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Small Business Invoicing: The Complete Guide for SA Entrepreneurs | Illumi",
    description: "Everything South African small business owners need to know about invoicing — from basics to automation. Learn how to invoice professionally, get paid faster, and stay SARS-compliant.",
    keywords: [
        "small business invoicing",
        "invoicing for small business",
        "small business invoice",
        "SME invoicing South Africa",
        "business invoicing guide",
        "invoicing best practices",
        "how to invoice customers",
        "invoicing tips small business",
        "SMME invoicing",
        "invoice management small business",
    ],
    alternates: { canonical: "/blog/small-business-invoicing-guide" },
}

export default function SmallBusinessInvoicingGuidePage() {
    return (
        <article className="min-h-screen bg-background">
            <section className="pt-24 md:pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>February 2026</span>
                        <span>·</span>
                        <span>11 min read</span>
                        <span>·</span>
                        <span>Guide</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Small Business Invoicing: The Complete Guide for SA Entrepreneurs
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Invoicing is one of the most important processes in any small business — it&apos;s how you get paid. This guide covers everything from the basics to advanced automation, specifically for South African SMMEs.
                    </p>
                </div>
            </section>

            <section className="pb-16 px-6">
                <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                    <h2>Why Invoicing Matters for Small Businesses</h2>
                    <p>An invoice isn&apos;t just a piece of paper — it&apos;s a legal document that records a transaction between you and your customer. Good invoicing practices directly impact your:</p>
                    <ul>
                        <li><strong>Cash flow</strong> — Professional invoices with clear terms get paid faster</li>
                        <li><strong>Tax compliance</strong> — SARS requires proper invoicing records for income tax and VAT</li>
                        <li><strong>Professional image</strong> — Branded, consistent invoices build trust with clients</li>
                        <li><strong>Business planning</strong> — Invoice data helps you forecast revenue and track growth</li>
                    </ul>

                    <h2>Invoicing Basics Every Business Owner Should Know</h2>

                    <h3>Types of Invoices</h3>
                    <ul>
                        <li><strong>Tax Invoice</strong> — Required for VAT-registered businesses. Must include your VAT number and meet SARS formatting requirements.</li>
                        <li><strong>Proforma Invoice</strong> — A preliminary estimate sent before work begins. Not a demand for payment.</li>
                        <li><strong>Credit Note</strong> — Issued when you need to adjust or cancel a previous invoice.</li>
                        <li><strong>Recurring Invoice</strong> — Automatically generated on a schedule for retainer or subscription clients.</li>
                    </ul>

                    <h3>When to Register for VAT</h3>
                    <p>In South Africa, you <strong>must</strong> register for VAT if your annual turnover exceeds R1 million. You <strong>may voluntarily</strong> register if your turnover exceeds R50,000. Once registered, every invoice must be a proper tax invoice with your VAT number, the words &quot;Tax Invoice&quot;, and a clear VAT calculation.</p>

                    <h3>Invoice Numbering</h3>
                    <p>SARS requires sequential, unique invoice numbers. Don&apos;t use random numbers or skip sequences — this raises red flags during audits. Use a consistent format like:</p>
                    <ul>
                        <li><strong>INV-001, INV-002, INV-003...</strong> (simple sequential)</li>
                        <li><strong>2026-001, 2026-002...</strong> (year-prefixed)</li>
                        <li><strong>ABC-001</strong> (business initials + sequence)</li>
                    </ul>

                    <h2>Setting Up Your Invoicing Process</h2>

                    <h3>Step 1: Choose Your Invoicing Tool</h3>
                    <p>Stop using Word documents or Excel spreadsheets. They&apos;re slow, error-prone, and don&apos;t track payments. Use dedicated invoicing software that:</p>
                    <ul>
                        <li>Auto-generates invoice numbers</li>
                        <li>Calculates VAT automatically</li>
                        <li>Saves client details for reuse</li>
                        <li>Tracks payment status</li>
                        <li>Sends invoices via email</li>
                        <li>Accepts online payments</li>
                    </ul>

                    <h3>Step 2: Set Up Your Business Profile</h3>
                    <p>Configure your business name, logo, address, banking details, and VAT number (if registered). This information appears on every invoice automatically.</p>

                    <h3>Step 3: Add Your Clients</h3>
                    <p>Create a client database with names, email addresses, and billing details. This saves time on future invoices and gives you a complete history of each client relationship.</p>

                    <h3>Step 4: Create Your First Invoice</h3>
                    <p>Select a client, add line items describing your products or services, set your payment terms, and send. The whole process takes under a minute with the right tool.</p>

                    <h2>Getting Paid Faster: Best Practices</h2>
                    <ul>
                        <li><strong>Invoice immediately</strong> — Send the invoice as soon as work is delivered. Every day you delay is a day you wait for payment.</li>
                        <li><strong>Use short payment terms</strong> — Net 7 or Net 14 gets you paid faster than Net 30. For new clients, consider &quot;Due on Receipt&quot;.</li>
                        <li><strong>Accept online payments</strong> — Clients who can pay by card or instant EFT pay faster than those who need to do manual bank transfers.</li>
                        <li><strong>Send reminders</strong> — Automate payment reminders 3 days before and on the due date. Follow up on day 1 of being overdue.</li>
                        <li><strong>Request deposits</strong> — For large projects, request 50% upfront. This protects your cash flow and demonstrates client commitment.</li>
                        <li><strong>Offer early payment discounts</strong> — A 2% discount for payment within 7 days (known as &quot;2/7 Net 30&quot;) can dramatically improve cash flow.</li>
                    </ul>

                    <h2>Automating Your Invoicing</h2>
                    <p>As your business grows, manual invoicing becomes a bottleneck. Here&apos;s what to automate:</p>
                    <ul>
                        <li><strong>Recurring invoices</strong> — Set up monthly invoices for retainer clients. They&apos;re created and sent automatically.</li>
                        <li><strong>Payment reminders</strong> — Automatic emails remind clients before and after the due date.</li>
                        <li><strong>Invoice numbering</strong> — Let your software handle sequential numbering.</li>
                        <li><strong>Late payment fees</strong> — Apply interest automatically on overdue invoices (clearly state this in your terms).</li>
                        <li><strong>Expense tracking</strong> — Record expenses alongside invoices for a complete financial picture.</li>
                    </ul>

                    <h2>Tax Season: How Good Invoicing Saves You Time</h2>
                    <p>When tax season arrives, your invoicing records become your most valuable asset. With proper invoicing software:</p>
                    <ul>
                        <li>Export all income data for your tax return in seconds</li>
                        <li>Generate VAT reports for SARS submissions</li>
                        <li>Track deductible business expenses</li>
                        <li>Provide proof of income if audited</li>
                    </ul>
                    <p>This alone can save you hours of work and thousands of rand in accountant fees.</p>

                    <h2>Start Invoicing Like a Pro</h2>
                    <p>Professional invoicing doesn&apos;t need to be complicated. With the right tool, you can create polished invoices in seconds, get paid faster, and keep SARS happy — all for free.</p>
                </div>

                <div className="max-w-3xl mx-auto mt-10 bg-primary/5 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-3">Free Invoicing for South African Businesses</h3>
                    <p className="text-muted-foreground mb-6">Illumi is built for SA small businesses. ZAR default, SARS-compliant, PayFast & Yoco integrated.</p>
                    <Link href="/login">
                        <Button size="lg">
                            Get Started Free <IconArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </article>
    )
}
