import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconReceipt2,
    IconCalendarStats,
    IconPigMoney,
    IconAlertCircle,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Freelancer Tax Tips: 9 Deductions You're Probably Missing | Illumi",
    description:
        "South African freelancers leave thousands on the table every tax season. Here are the deductions you're entitled to — and how to claim them properly.",
    keywords: [
        "freelancer tax deductions",
        "South Africa freelancer tax",
        "SARS deductions",
        "home office deduction",
        "freelancer expenses",
        "tax tips South Africa",
        "provisional tax freelancer",
    ],
    alternates: {
        canonical: "/blog/freelancer-tax-tips",
    },
}

const deductions = [
    {
        title: "Home office expenses",
        description: "If you work from home, you can deduct a portion of rent, electricity, internet, and rates based on the percentage of your home used for work.",
        tip: "Measure your office space and calculate the percentage of your total home. Keep utility bills as proof.",
    },
    {
        title: "Equipment and technology",
        description: "Laptops, monitors, phones, software subscriptions, and office furniture used for work are deductible.",
        tip: "Items over R7,000 may need to be depreciated over time rather than claimed in one year.",
    },
    {
        title: "Professional development",
        description: "Courses, certifications, books, and conference tickets related to your work are deductible.",
        tip: "Keep certificates and receipts. The training must be relevant to your current work.",
    },
    {
        title: "Travel expenses",
        description: "Client meetings, site visits, and business-related travel (fuel, Uber, flights) are deductible.",
        tip: "Keep a logbook for vehicle expenses. SARS requires detailed records.",
    },
    {
        title: "Professional services",
        description: "Accountant fees, legal fees, and business consulting are fully deductible.",
        tip: "This includes the cost of tax preparation — so hiring an accountant pays for itself.",
    },
    {
        title: "Marketing and advertising",
        description: "Website hosting, domain names, social media ads, business cards, and portfolio costs.",
        tip: "Track these monthly. Small recurring costs add up to significant deductions.",
    },
    {
        title: "Bank fees and payment processing",
        description: "Business account fees, PayFast/Yoco transaction fees, and foreign exchange fees.",
        tip: "Download your bank statements annually and highlight business-related fees.",
    },
    {
        title: "Insurance",
        description: "Professional indemnity insurance, public liability, and business-related insurance premiums.",
        tip: "Personal insurance (life, medical) is handled differently — consult your accountant.",
    },
    {
        title: "Retirement contributions",
        description: "Contributions to a retirement annuity (RA) are tax-deductible up to certain limits.",
        tip: "This is one of the best tax-saving strategies for freelancers. Max it out if you can.",
    },
]

const commonMistakes = [
    "Not keeping receipts (SARS can request proof for 5 years)",
    "Mixing personal and business expenses on one account",
    "Forgetting to pay provisional tax (penalties add up fast)",
    "Not claiming home office when you're entitled to it",
    "Waiting until February to organize your records",
]

const quarterlyTasks = [
    { quarter: "Q1 (Mar-May)", task: "Organize Q4 receipts, file provisional tax if due" },
    { quarter: "Q2 (Jun-Aug)", task: "Mid-year review, adjust provisional tax estimates" },
    { quarter: "Q3 (Sep-Nov)", task: "Start gathering annual documents, review deductions" },
    { quarter: "Q4 (Dec-Feb)", task: "Final receipt collection, meet with accountant, file returns" },
]

export default function FreelancerTaxTipsPost() {
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
                            8 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Tax & Compliance</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Freelancer Tax Tips: 9 Deductions You're Probably Missing
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Most South African freelancers overpay on tax because they don't know what they can claim. 
                        Here's your complete guide to legitimate deductions.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="flex items-start gap-3">
                            <IconPigMoney className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">The golden rule of deductions</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    An expense is deductible if it was incurred "in the production of income" — meaning 
                                    it was necessary for you to earn money from your freelance work. When in doubt, 
                                    keep the receipt and ask your accountant.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">9 deductions you should be claiming</h2>
                    <div className="space-y-4">
                        {deductions.map((d, i) => (
                            <div key={d.title} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{d.title}</div>
                                        <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                                        <div className="mt-3 p-3 rounded-lg bg-primary/5">
                                            <p className="text-xs text-primary"><strong>Pro tip:</strong> {d.tip}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-destructive/50 bg-destructive/5 p-8">
                        <div className="flex items-start gap-3">
                            <IconAlertCircle className="h-6 w-6 text-destructive mt-0.5" />
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Common mistakes that cost you money</h3>
                                <ul className="space-y-3">
                                    {commonMistakes.map((m) => (
                                        <li key={m} className="flex items-start gap-3">
                                            <span className="text-destructive">✗</span>
                                            <span className="text-muted-foreground">{m}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <div className="flex items-start gap-3">
                            <IconCalendarStats className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Quarterly tax calendar</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {quarterlyTasks.map((qt) => (
                                        <div key={qt.quarter} className="p-4 rounded-xl bg-muted/50">
                                            <div className="text-sm font-bold text-primary mb-1">{qt.quarter}</div>
                                            <p className="text-sm text-muted-foreground">{qt.task}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <div className="flex items-start gap-3">
                            <IconReceipt2 className="h-6 w-6 text-primary mt-0.5" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Track expenses automatically</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Illumi's expense tracking captures receipts, categorizes spending, and generates 
                                    tax-ready reports. No more shoebox of receipts or last-minute scrambling.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/login">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Start Tracking Expenses
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/expense-tracking">
                            <Button variant="outline">Read: Expense Tracking System</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Stop overpaying on tax</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi helps South African freelancers track income, expenses, and invoices in one place — 
                        making tax season painless and ensuring you claim every deduction you're entitled to.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Try Illumi Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
