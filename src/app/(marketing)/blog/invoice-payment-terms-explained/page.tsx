import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Payment Terms Explained: Net 30, Due on Receipt & More | Illumi",
    description: "What do payment terms like Net 30, Net 14, and Due on Receipt mean? Learn which invoice payment terms get you paid fastest and how to set them up for your business.",
    keywords: [
        "invoice payment terms",
        "payment terms explained",
        "net 30 meaning",
        "net 14 payment terms",
        "due on receipt meaning",
        "invoice terms and conditions",
        "payment terms for invoices",
        "best payment terms",
        "late payment terms",
        "early payment discount",
        "2/10 net 30",
    ],
    alternates: { canonical: "/blog/invoice-payment-terms-explained" },
}

const terms = [
    {
        term: "Due on Receipt",
        meaning: "Payment is expected immediately upon receiving the invoice.",
        bestFor: "One-time clients, small amounts, or when you need cash flow urgently.",
        avgDays: "0-3 days",
    },
    {
        term: "Net 7",
        meaning: "Payment is due within 7 calendar days of the invoice date.",
        bestFor: "Freelancers and service providers who want quick turnaround.",
        avgDays: "5-7 days",
    },
    {
        term: "Net 14",
        meaning: "Payment is due within 14 calendar days of the invoice date.",
        bestFor: "The sweet spot for most small businesses. Professional but prompt.",
        avgDays: "10-14 days",
    },
    {
        term: "Net 30",
        meaning: "Payment is due within 30 calendar days. The most common term in business.",
        bestFor: "Established relationships with reliable clients. Standard for B2B.",
        avgDays: "25-35 days",
    },
    {
        term: "Net 60 / Net 90",
        meaning: "Payment is due within 60 or 90 days. Extended terms for large organisations.",
        bestFor: "Enterprise clients and government contracts. Only if your cash flow can handle it.",
        avgDays: "55-95 days",
    },
    {
        term: "2/10 Net 30",
        meaning: "2% discount if paid within 10 days; otherwise, full amount due in 30 days.",
        bestFor: "Encouraging early payment. The discount motivates clients to pay sooner.",
        avgDays: "8-12 days (with discount)",
    },
    {
        term: "50% Upfront",
        meaning: "Half the total is due before work begins; the balance upon completion.",
        bestFor: "Large projects, new clients, or when you need to cover material costs.",
        avgDays: "Varies",
    },
    {
        term: "End of Month (EOM)",
        meaning: "Payment is due at the end of the month in which the invoice is received.",
        bestFor: "Clients who process payments in monthly batch cycles.",
        avgDays: "15-30 days",
    },
]

export default function PaymentTermsExplainedPage() {
    return (
        <article className="min-h-screen bg-background">
            <section className="pt-24 md:pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>February 2026</span>
                        <span>·</span>
                        <span>6 min read</span>
                        <span>·</span>
                        <span>Payments</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Invoice Payment Terms Explained: Net 30, Due on Receipt & More
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Payment terms tell your client when they need to pay. Using the right terms can mean the difference between getting paid in 7 days or waiting 90. Here&apos;s everything you need to know.
                    </p>
                </div>
            </section>

            <section className="pb-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Common Invoice Payment Terms</h2>
                    <div className="space-y-4">
                        {terms.map((t) => (
                            <div key={t.term} className="bg-card rounded-xl border p-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-primary mb-1">{t.term}</h3>
                                        <p className="text-muted-foreground mb-2">{t.meaning}</p>
                                        <p className="text-sm"><strong>Best for:</strong> {t.bestFor}</p>
                                    </div>
                                    <div className="md:text-right">
                                        <span className="text-sm text-muted-foreground">Avg. payment time</span>
                                        <p className="font-semibold">{t.avgDays}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pb-16 px-6">
                <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                    <h2>Which Payment Terms Should You Use?</h2>
                    <p>The best payment terms depend on your business type, client relationship, and cash flow needs:</p>
                    <ul>
                        <li><strong>Freelancers and solopreneurs</strong> — Use Net 7 or Net 14. You can&apos;t afford to wait 30+ days for every payment. For new clients, use Due on Receipt or request a deposit.</li>
                        <li><strong>Small businesses</strong> — Net 14 or Net 30 works well for established client relationships. Offer early payment discounts (2/10 Net 30) to incentivise faster payment.</li>
                        <li><strong>Large projects</strong> — Use milestone billing with 50% upfront. This protects your cash flow and reduces risk on both sides.</li>
                        <li><strong>Corporate clients</strong> — Many large companies default to Net 30 or Net 60. You may need to accept these terms but negotiate where possible.</li>
                    </ul>

                    <h2>How to Handle Late Payments</h2>
                    <p>Include a late payment clause in your invoice terms. Common approaches:</p>
                    <ul>
                        <li><strong>Interest charges</strong> — &quot;Interest of 2% per month will be charged on overdue amounts&quot;</li>
                        <li><strong>Late fees</strong> — &quot;A flat fee of R250 will be added to invoices unpaid after 14 days&quot;</li>
                        <li><strong>Work suspension</strong> — &quot;Services will be paused on accounts more than 30 days overdue&quot;</li>
                    </ul>
                    <p>The key is to state these terms <strong>before</strong> you start work, ideally in your contract or engagement letter. Don&apos;t surprise clients with penalties after the fact.</p>

                    <h2>Tips to Get Paid Faster</h2>
                    <ol>
                        <li><strong>Invoice immediately</strong> — Don&apos;t wait. Send the invoice the day you deliver.</li>
                        <li><strong>Use shorter terms</strong> — Net 7 instead of Net 30 for new relationships.</li>
                        <li><strong>Add online payment</strong> — Clients who can pay by card or instant EFT pay faster.</li>
                        <li><strong>Send reminders</strong> — Automate reminders 3 days before due date, on due date, and 3 days after.</li>
                        <li><strong>Offer discounts for early payment</strong> — Even 1-2% motivates many clients.</li>
                        <li><strong>Follow up personally</strong> — A phone call or direct message is more effective than another email.</li>
                    </ol>

                    <h2>Setting Payment Terms in Illumi</h2>
                    <p>Illumi lets you set default payment terms that automatically apply to every invoice. You can also override terms per client or per invoice. Automatic payment reminders are sent before and after the due date, so you never need to chase payments manually.</p>
                </div>

                <div className="max-w-3xl mx-auto mt-10 bg-primary/5 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-3">Set Up Your Payment Terms Now</h3>
                    <p className="text-muted-foreground mb-6">Create invoices with professional payment terms. Automatic reminders included.</p>
                    <Link href="/login">
                        <Button size="lg">
                            Start Free <IconArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </article>
    )
}
