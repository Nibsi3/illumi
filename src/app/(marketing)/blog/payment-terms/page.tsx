import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconFileInvoice } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Net 30 vs Due on Receipt: The Payment Terms Trick That Gets You Paid Faster | Illumi",
    description:
        "Payment terms can make or break cash flow. Learn which terms work best in South Africa and how to set them without losing clients.",
    keywords: [
        "payment terms",
        "net 30",
        "due on receipt",
        "invoice payment terms South Africa",
        "late payments",
        "cash flow",
    ],
}

const termOptions = [
    {
        title: "Due on Receipt",
        bestFor: "Small projects, new clients, freelancers",
        note: "Fastest cash flow. Works best when you deliver quickly and your invoice is easy to approve.",
    },
    {
        title: "Net 7 / Net 14",
        bestFor: "Most service businesses",
        note: "A good balance: clients feel it’s fair, but you’re not funding their business for a month.",
    },
    {
        title: "Net 30",
        bestFor: "Enterprise / corporate procurement",
        note: "Common in bigger companies. Use deposits and milestones so Net 30 doesn’t destroy your cash flow.",
    },
]

const scripts = [
    "‘We invoice due on receipt for new clients, then we can move to Net 14 after the first month.’",
    "‘We can do Net 30, but we require a 50% deposit to reserve capacity.’",
    "‘For projects over 2 weeks we invoice milestones so you only approve smaller amounts at a time.’",
]

export default function PaymentTermsPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            5 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Invoicing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Net 30 vs Due on Receipt: The Payment Terms Trick That Gets You Paid Faster
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        The wrong terms can quietly bankrupt a healthy business. Here’s how to choose terms that clients accept — and that protect your cash flow.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconFileInvoice className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">The simplest rule</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Your terms should match your risk. New client? Short terms. Large project? Milestones. Corporate? Deposit + Net 30.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {termOptions.map((t) => (
                            <div key={t.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="text-lg font-semibold mb-2">{t.title}</div>
                                <div className="text-sm text-muted-foreground mb-3">
                                    <span className="font-medium text-foreground">Best for:</span> {t.bestFor}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{t.note}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-10">
                        <h3 className="text-xl font-semibold mb-4">Scripts you can copy (no awkwardness)</h3>
                        <ul className="space-y-3">
                            {scripts.map((s) => (
                                <li key={s} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-primary mt-0.5" />
                                    <span className="text-muted-foreground">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/blog/getting-paid-faster">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                See the Full “Get Paid Faster” Playbook
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invoice-generator">
                            <Button variant="outline">Create a Better Invoice</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
