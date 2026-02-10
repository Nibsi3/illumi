import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconClock,
    IconChartBar,
    IconPigMoney,
    IconCalendarEvent,
    IconAlertTriangle,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "10 Cash Flow Management Tips for South African Small Businesses | Illumi",
    description:
        "Practical cash flow management strategies for South African SMEs and freelancers. Avoid cash crunches, plan for VAT, and build a financial buffer.",
    keywords: [
        "cash flow management South Africa",
        "small business cash flow tips",
        "SME financial planning",
        "freelancer cash flow",
        "manage business finances South Africa",
        "avoid cash crunch",
        "business budgeting tips SA",
    ],
    alternates: {
        canonical: "/blog/cash-flow-management-tips",
    },
}

const tips = [
    {
        number: "01",
        title: "Invoice immediately — never wait",
        detail: "Every day between delivery and invoicing is a day added to your payment cycle. Invoice within 24 hours, every time. Automate recurring invoices for repeat work.",
    },
    {
        number: "02",
        title: "Separate your business and personal accounts",
        detail: "Mixing accounts makes it impossible to track real cash flow. Open a dedicated business account — even a free one from TymeBank or Bank Zero works.",
    },
    {
        number: "03",
        title: "Build a 3-month expense buffer",
        detail: "South African businesses face load shedding costs, rand volatility, and seasonal slowdowns. A 3-month buffer covers emergencies without borrowing.",
    },
    {
        number: "04",
        title: "Set aside tax money immediately",
        detail: "When you receive payment, immediately transfer 25-30% to a separate savings account for provisional tax and VAT. Don't treat tax money as income.",
    },
    {
        number: "05",
        title: "Shorten your payment terms",
        detail: "Switch from Net 30 to Net 7 or Due on Receipt. Most clients pay based on the due date, not when they feel like it. Shorter terms = faster cash.",
    },
    {
        number: "06",
        title: "Track expenses weekly, not monthly",
        detail: "Monthly reviews catch problems too late. Spend 15 minutes every Friday categorising expenses. You'll spot overspending before it becomes a crisis.",
    },
    {
        number: "07",
        title: "Collect deposits on large projects",
        detail: "For any project over R5,000, collect 30-50% upfront. This funds your costs and filters out clients who can't actually afford your services.",
    },
    {
        number: "08",
        title: "Automate payment reminders",
        detail: "Set up automatic reminders at 3 days before, on the due date, and 3 days after. Most late payments aren't malicious — they're just forgotten.",
    },
    {
        number: "09",
        title: "Review your pricing annually",
        detail: "SA inflation runs 5-7% per year. If you don't raise prices, you're taking a real pay cut. Review and adjust rates every January.",
    },
    {
        number: "10",
        title: "Diversify your income streams",
        detail: "Don't rely on one client for more than 30% of your revenue. If they leave or delay payment, your entire business is at risk.",
    },
]

const warnings = [
    { sign: "More than 30% of revenue is overdue", action: "Tighten payment terms and add upfront deposits for new projects." },
    { sign: "You're borrowing to cover monthly expenses", action: "Cut discretionary spending and renegotiate subscription costs immediately." },
    { sign: "Tax season causes panic every quarter", action: "Set up a separate tax savings account and transfer 25% of every payment received." },
    { sign: "One client accounts for 50%+ of your income", action: "Actively prospect for new clients to reduce dependency before it becomes a crisis." },
]

export default function CashFlowTipsPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-4xl mx-auto relative">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            7 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Finance</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        10 Cash Flow Management Tips for South African Small Businesses
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Cash flow kills more SA businesses than bad products. These 10 practical tips help freelancers
                        and SMEs stay solvent, plan for tax, and build a financial buffer.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-bold mb-4">Cash flow &ne; profit</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You can be profitable on paper and still run out of money. A business that invoices R100k
                            but only collects R40k this month has a cash flow problem, not a profitability problem.
                            The goal is to make cash <em>predictable</em>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconChartBar className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Track weekly</div>
                            <div className="text-sm text-muted-foreground">Monthly is too late. Weekly reviews catch problems early.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconPigMoney className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Buffer first</div>
                            <div className="text-sm text-muted-foreground">Build 3 months of expenses before investing in growth.</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <IconCalendarEvent className="h-6 w-6 text-primary mb-3" />
                            <div className="font-semibold mb-1">Plan for tax</div>
                            <div className="text-sm text-muted-foreground">Set aside 25-30% of every payment for SARS. No exceptions.</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">The 10 tips</h2>
                    <div className="space-y-4">
                        {tips.map((t) => (
                            <div key={t.number} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl font-bold text-primary/30 shrink-0">{t.number}</span>
                                    <div>
                                        <div className="text-lg font-semibold mb-2">{t.title}</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{t.detail}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <IconAlertTriangle className="h-6 w-6 text-destructive" />
                        Warning signs your cash flow needs attention
                    </h2>
                    <div className="space-y-4">
                        {warnings.map((w) => (
                            <div key={w.sign} className="rounded-2xl border border-border bg-card p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs font-medium text-destructive uppercase mb-1">Warning sign</div>
                                        <p className="text-sm text-foreground font-medium">{w.sign}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-primary uppercase mb-1">Action</div>
                                        <p className="text-sm text-muted-foreground">{w.action}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/resources/cash-flow-calculator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Try the Cash Flow Calculator
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/getting-paid-faster">
                            <Button variant="outline">Get Paid Faster Guide</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Take control of your cash flow</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi helps you invoice faster, track expenses, and automate payment reminders — all the tools
                        you need to keep cash flowing.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
