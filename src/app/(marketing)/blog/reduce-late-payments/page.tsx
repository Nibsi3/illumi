import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconAlertTriangle } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "How to Reduce Late Invoice Payments | 10 Proven Tactics | Illumi",
    description: "Reduce late payments with these proven tactics. Learn how to get clients to pay on time using better invoicing practices, payment terms, and automation.",
    keywords: [
        "reduce late payments",
        "get paid faster",
        "late invoice payments",
        "improve payment times",
        "invoice payment tips",
        "stop late paying clients",
    ],
    alternates: {
        canonical: "/blog/reduce-late-payments",
    },
}

const tactics = [
    {
        number: "1",
        title: "Invoice Immediately",
        description: "Send invoices the same day work is completed. Every day you delay is a day added to your payment timeline.",
        impact: "High",
    },
    {
        number: "2",
        title: "Offer Online Payments",
        description: "Add a 'Pay Now' button to every invoice. Clients who can pay with one click pay faster than those who need to arrange bank transfers.",
        impact: "High",
    },
    {
        number: "3",
        title: "Use Shorter Payment Terms",
        description: "Switch from Net 30 to Net 14 or even Net 7. Studies show shorter terms get paid faster without losing clients.",
        impact: "High",
    },
    {
        number: "4",
        title: "Set Up Automatic Reminders",
        description: "Send reminders before due date, on due date, and at intervals after. Automation ensures consistent follow-up.",
        impact: "High",
    },
    {
        number: "5",
        title: "Make Invoices Crystal Clear",
        description: "Include all details: what was delivered, when, agreed price. Confusion causes delays. Clarity speeds payment.",
        impact: "Medium",
    },
    {
        number: "6",
        title: "Request Deposits Upfront",
        description: "For larger projects, request 30-50% upfront. This reduces your risk and gets clients invested early.",
        impact: "Medium",
    },
    {
        number: "7",
        title: "Offer Early Payment Discounts",
        description: "A 2% discount for payment within 7 days can motivate faster payment. Calculate if it's worth it for your cash flow.",
        impact: "Medium",
    },
    {
        number: "8",
        title: "Know Your Client's Payment Cycle",
        description: "Large companies often pay on specific dates. Invoice to align with their payment runs.",
        impact: "Medium",
    },
    {
        number: "9",
        title: "Build Relationships with Accounts Payable",
        description: "For regular clients, know who processes payments. A quick call can unstick delayed invoices.",
        impact: "Low",
    },
    {
        number: "10",
        title: "Have Clear Late Payment Policies",
        description: "State consequences for late payment upfront. Late fees or paused work can motivate timely payment.",
        impact: "Low",
    },
]

const statistics = [
    { stat: "60%", description: "of SA small businesses experience late payments" },
    { stat: "14 days", description: "average delay beyond payment terms" },
    { stat: "50%", description: "reduction in late payments with automation" },
    { stat: "3x", description: "faster payment with online payment options" },
]

export default function ReduceLatePaymentsPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            7 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Cash Flow</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        How to Reduce Late Invoice Payments
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Late payments hurt your cash flow and waste your time. Here are 10 proven tactics 
                        to get clients paying on time.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <div className="flex items-start gap-3">
                            <IconAlertTriangle className="h-6 w-6 text-amber-500 mt-0.5" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">The Late Payment Problem</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Late payments are one of the biggest challenges for South African small businesses. 
                                    They strain cash flow, create stress, and waste time that should be spent on 
                                    productive work.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {statistics.map((item) => (
                            <div key={item.stat} className="text-center p-6 rounded-xl border border-border bg-card">
                                <div className="text-3xl font-bold text-primary mb-1">{item.stat}</div>
                                <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">10 Tactics to Get Paid Faster</h2>
                    <div className="space-y-4 mb-12">
                        {tactics.map((tactic) => (
                            <div key={tactic.number} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
                                        {tactic.number}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold">{tactic.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                tactic.impact === "High" 
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : tactic.impact === "Medium"
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                            }`}>
                                                {tactic.impact} Impact
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground">{tactic.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">Quick Wins to Implement Today</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-2">This Week</div>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        Set up online payments
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        Enable automatic reminders
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        Review and shorten payment terms
                                    </li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="font-medium mb-2">This Month</div>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        Update invoice templates for clarity
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        Create deposit policy for new projects
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <IconCheck className="h-4 w-4 text-primary" />
                                        Document late payment policy
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Automate Your Way to Faster Payments</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi helps you implement most of these tactics automatically. Online payments, 
                            automatic reminders, and professional invoices — all built in. Start free today.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/features/payment-reminders">
                                <Button variant="outline">
                                    See Reminder Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/late-paying-clients" className="text-primary hover:underline">
                                    How to Handle Late-Paying Clients
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/payment-terms" className="text-primary hover:underline">
                                    Net 30 vs Due on Receipt
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
                    <h2 className="text-3xl font-bold mb-4">Stop Chasing Payments</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Let Illumi handle the follow-up so you can focus on your work.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Free Today
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
