import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconCheck, IconClock, IconX } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Online Invoicing vs Excel: Which Is Better? | Illumi",
    description: "Compare online invoicing software with Excel spreadsheets. Learn the pros and cons of each approach and when to make the switch for your South African business.",
    keywords: [
        "online invoicing vs excel",
        "invoice software vs spreadsheet",
        "excel invoicing",
        "spreadsheet invoicing problems",
        "switch from excel to invoice software",
        "invoicing software benefits",
    ],
    alternates: {
        canonical: "/blog/online-invoicing-vs-excel",
    },
}

const comparisonTable = [
    { feature: "Invoice creation time", excel: "15-30 minutes", online: "2-5 minutes" },
    { feature: "Calculation errors", excel: "Common", online: "Rare (automatic)" },
    { feature: "Professional templates", excel: "DIY required", online: "Built-in" },
    { feature: "Online payments", excel: "Not possible", online: "One-click pay" },
    { feature: "Payment tracking", excel: "Manual updates", online: "Automatic" },
    { feature: "Payment reminders", excel: "Manual", online: "Automatic" },
    { feature: "Access from anywhere", excel: "Limited", online: "Any device" },
    { feature: "Backup & security", excel: "Your responsibility", online: "Automatic" },
    { feature: "VAT calculations", excel: "Manual formulas", online: "Automatic 15%" },
    { feature: "Client history", excel: "Scattered files", online: "Organised by client" },
]

const excelProblems = [
    {
        problem: "Formula errors",
        description: "One wrong cell reference and your totals are wrong. Clients notice.",
    },
    {
        problem: "Version control chaos",
        description: "Invoice_v2_final_FINAL.xlsx — sound familiar?",
    },
    {
        problem: "No payment tracking",
        description: "You have to manually update a separate sheet to track who's paid.",
    },
    {
        problem: "Can't accept online payments",
        description: "Clients must do manual bank transfers, adding friction and delays.",
    },
    {
        problem: "Unprofessional appearance",
        description: "Excel invoices often look amateur compared to proper invoice software.",
    },
    {
        problem: "No automatic reminders",
        description: "You have to remember to chase every overdue invoice manually.",
    },
    {
        problem: "Hard to search and filter",
        description: "Finding a specific invoice from 6 months ago? Good luck.",
    },
    {
        problem: "Risk of data loss",
        description: "If your computer dies, so do your invoices (unless you backup religiously).",
    },
]

const whenExcelWorks = [
    "You invoice less than 5 times per month",
    "You don't need online payments",
    "You have simple, one-off invoices",
    "You're comfortable with spreadsheets",
    "You have good backup practices",
]

const whenToSwitch = [
    "You invoice more than 5 times per month",
    "You want clients to pay online",
    "You're making calculation errors",
    "You're forgetting to follow up on payments",
    "You have recurring clients",
    "You want to look more professional",
    "Tax time is stressful due to poor records",
]

export default function OnlineInvoicingVsExcelPost() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-12 px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1">
                            <IconClock className="h-4 w-4" />
                            5 min read
                        </span>
                        <span className="px-2 py-1 rounded bg-muted">Comparison</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Online Invoicing vs Excel
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Still using Excel for invoices? Here's an honest look at when spreadsheets work 
                        and when it's time to upgrade.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg text-muted-foreground mb-12">
                        <p>
                            Excel is familiar. It's free (if you already have Office). And for many South African 
                            businesses, it's where invoicing starts. But as your business grows, Excel's 
                            limitations become painful.
                        </p>
                        <p>
                            Let's compare Excel invoicing with online invoice software honestly — including 
                            when Excel actually makes sense.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-12">
                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b border-border font-medium text-sm">
                            <div>Feature</div>
                            <div className="text-center">Excel</div>
                            <div className="text-center">Online Invoicing</div>
                        </div>
                        {comparisonTable.map((row) => (
                            <div key={row.feature} className="grid grid-cols-3 gap-4 p-4 border-b border-border last:border-b-0 text-sm">
                                <div className="font-medium">{row.feature}</div>
                                <div className="text-center text-muted-foreground">{row.excel}</div>
                                <div className="text-center text-muted-foreground">{row.online}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">The Problems with Excel Invoicing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {excelProblems.map((item) => (
                            <div key={item.problem} className="rounded-xl border border-border bg-card p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <IconX className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <span className="font-medium">{item.problem}</span>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <h3 className="text-xl font-bold mb-4">When Excel Works</h3>
                            <ul className="space-y-3">
                                {whenExcelWorks.map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                                        <IconCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-primary bg-card p-6">
                            <h3 className="text-xl font-bold mb-4">When to Switch</h3>
                            <ul className="space-y-3">
                                {whenToSwitch.map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                                        <IconCheck className="h-4 w-4 text-primary shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-4">The Cost Argument</h2>
                        <p className="text-muted-foreground mb-4">
                            "But Excel is free!" — Yes, but your time isn't. If you spend an extra 30 minutes 
                            per invoice on creation, tracking, and follow-up, that adds up fast.
                        </p>
                        <p className="text-muted-foreground mb-4">
                            At 10 invoices per month and 30 minutes extra per invoice, that's 5 hours of admin 
                            time. What's your hourly rate? Probably more than the R99/month for invoice software.
                        </p>
                        <p className="text-muted-foreground">
                            Plus, many invoice tools (including Illumi) have free plans with unlimited invoices. 
                            The "Excel is free" argument doesn't hold up.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary/5 p-8">
                        <h2 className="text-2xl font-bold mb-4">Make the Switch in Minutes</h2>
                        <p className="text-muted-foreground mb-6">
                            Illumi is free forever for unlimited invoices. Professional templates, online 
                            payments, automatic reminders — everything Excel can't do. Try it today.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/invoices/new">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Try Illumi Free
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/online-invoicing">
                                <Button variant="outline">
                                    Learn About Online Invoicing
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-muted/50">
                        <h3 className="font-bold mb-3">Related Articles</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog/manual-vs-automated-invoicing" className="text-primary hover:underline">
                                    Manual vs Automated Invoicing
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog/best-invoice-software-south-africa" className="text-primary hover:underline">
                                    Best Invoice Software in SA (2026)
                                </Link>
                            </li>
                            <li>
                                <Link href="/online-invoicing" className="text-primary hover:underline">
                                    Online Invoicing for SA Businesses
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Upgrade Your Invoicing</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Leave Excel behind. Join thousands of SA businesses using Illumi.
                    </p>
                    <Link href="/invoices/new">
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
