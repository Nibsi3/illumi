import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconReceipt } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Expense Tracking for Tax Season: The ‘One Folder’ System That Saves Hours | Illumi",
    description:
        "A simple expense tracking system for South African small businesses. Stay tax-ready, reduce stress, and keep clean records for your accountant.",
    keywords: [
        "expense tracking",
        "tax season South Africa",
        "small business expenses",
        "receipt tracking",
        "bookkeeping tips",
        "SARS records",
    ],
}

const systemSteps = [
    "Capture receipts immediately (phone photo counts)",
    "Name files consistently (Date - Supplier - Amount)",
    "Categorise monthly (not yearly)",
    "Separate business vs personal spending",
    "Export reports for your accountant",
]

const categories = [
    "Travel & fuel",
    "Software subscriptions",
    "Equipment",
    "Marketing",
    "Office / internet",
    "Meals & entertainment (as applicable)",
]

export default function ExpenseTrackingPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            5 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Tax & Compliance</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Expense Tracking for Tax Season: The “One Folder” System That Saves Hours
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        If tax season makes you panic, your system is the problem — not you. Here’s a simple way to stay ready all year.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconReceipt className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">The goal</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Your accountant should never have to ask: “Where’s the receipt?” Keep everything in one place and categorised monthly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-10">
                        <h3 className="text-xl font-semibold mb-4">The One Folder system</h3>
                        <ul className="space-y-3">
                            {systemSteps.map((s) => (
                                <li key={s} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <span className="text-muted-foreground">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-xl font-semibold mb-4">Common expense categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((c) => (
                                <div key={c} className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/login">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Track Expenses in Illumi
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/vat-setup-guide">
                            <Button variant="outline">Read: VAT Setup Guide</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
