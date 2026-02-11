import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconClock,
    IconReceiptTax,
    IconHome,
    IconDeviceLaptop,
    IconCar,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Tax Deductions Every South African Freelancer Should Know | Illumi",
    description:
        "A practical guide to tax deductions for South African freelancers. Claim home office, internet, equipment, travel, and more to reduce your SARS tax bill legally.",
    keywords: [
        "freelancer tax deductions South Africa",
        "SARS deductions freelancers",
        "home office deduction SA",
        "tax write-offs South Africa",
        "freelancer provisional tax",
        "business expenses deduction SARS",
        "independent contractor tax tips",
    ],
    alternates: {
        canonical: "/blog/tax-deductions-freelancers-sa",
    },
}

const deductions = [
    {
        category: "Home Office",
        icon: "home",
        items: [
            { name: "Rent or bond interest (proportional)", detail: "If your home office is 15% of your home's floor area, you can claim 15% of rent or bond interest." },
            { name: "Electricity and water (proportional)", detail: "Same proportional calculation. Keep your municipal bills as proof." },
            { name: "Internet and data costs", detail: "If used primarily for business, claim the full amount. If mixed, claim the business portion (e.g., 70%)." },
            { name: "Home office equipment", detail: "Desks, chairs, shelving — anything used exclusively for work in your home office." },
        ],
    },
    {
        category: "Technology & Equipment",
        icon: "laptop",
        items: [
            { name: "Computer and peripherals", detail: "Laptop, monitor, keyboard, mouse, webcam — depreciate over 3 years or claim in full if under R7,000." },
            { name: "Software subscriptions", detail: "Adobe, Microsoft 365, accounting software, project management tools — all deductible." },
            { name: "Mobile phone (business portion)", detail: "If you use your phone 60% for business, claim 60% of the contract and handset cost." },
            { name: "Backup power (UPS, inverter, solar)", detail: "Load shedding equipment used for business is deductible. Keep the receipts." },
        ],
    },
    {
        category: "Travel & Transport",
        icon: "car",
        items: [
            { name: "Business kilometres (logbook method)", detail: "Keep a logbook of business trips. SARS allows R4.64/km (2025 rates) for the first 8,000km." },
            { name: "Uber/Bolt for client meetings", detail: "Keep receipts for ride-hailing services used for business purposes." },
            { name: "Parking and tolls", detail: "Parking at client offices and e-toll charges for business travel are deductible." },
            { name: "Domestic flights for work", detail: "Flights to client meetings or conferences are fully deductible with proof of business purpose." },
        ],
    },
    {
        category: "Professional Development",
        icon: "receipt",
        items: [
            { name: "Online courses and certifications", detail: "Udemy, Coursera, or industry-specific courses related to your profession." },
            { name: "Books and subscriptions", detail: "Industry publications, reference books, and professional newsletter subscriptions." },
            { name: "Conference and event fees", detail: "Registration fees for industry events, including virtual conferences." },
            { name: "Professional membership fees", detail: "Membership to industry bodies (e.g., SAICA, SACAP, PRISA)." },
        ],
    },
]

const commonMistakes = [
    "Not keeping receipts (SARS can request proof for up to 5 years)",
    "Claiming personal expenses as business expenses",
    "Forgetting to submit provisional tax returns (penalties are harsh)",
    "Not separating business and personal bank accounts",
    "Claiming home office deduction without a dedicated workspace",
    "Missing the February provisional tax deadline",
]

const importantDates = [
    { date: "31 August", event: "First provisional tax payment due" },
    { date: "28 February", event: "Second provisional tax payment due" },
    { date: "30 September", event: "Third (optional) provisional tax top-up" },
    { date: "July - November", event: "Annual tax return filing season (check SARS for exact dates)" },
]

export default function TaxDeductionsPost() {
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
                        <span className="px-2 py-1 rounded bg-muted">Tax</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Tax Deductions Every South African Freelancer Should Know
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Most SA freelancers overpay tax because they don&apos;t claim legitimate deductions.
                        Here&apos;s everything you can (and should) deduct — legally.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-bold mb-4">The golden rule</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            SARS allows you to deduct expenses that are <strong>&quot;wholly and exclusively&quot;</strong> incurred
                            in the production of income. If an expense has a mixed (personal + business) use, you can only
                            claim the business portion. Keep records of everything for at least 5 years.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Deductions by category</h2>
                    <div className="space-y-8">
                        {deductions.map((cat) => (
                            <div key={cat.category} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    {cat.icon === "home" && <IconHome className="h-6 w-6 text-primary" />}
                                    {cat.icon === "laptop" && <IconDeviceLaptop className="h-6 w-6 text-primary" />}
                                    {cat.icon === "car" && <IconCar className="h-6 w-6 text-primary" />}
                                    {cat.icon === "receipt" && <IconReceiptTax className="h-6 w-6 text-primary" />}
                                    <h3 className="text-xl font-bold">{cat.category}</h3>
                                </div>
                                <div className="space-y-3">
                                    {cat.items.map((item) => (
                                        <div key={item.name} className="flex items-start gap-3">
                                            <IconCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <div className="font-semibold text-foreground text-sm">{item.name}</div>
                                                <p className="text-sm text-muted-foreground">{item.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Important SARS dates for freelancers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {importantDates.map((d) => (
                            <div key={d.date} className="rounded-2xl border border-border bg-card p-6">
                                <div className="text-lg font-bold text-primary mb-1">{d.date}</div>
                                <p className="text-sm text-muted-foreground">{d.event}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mt-12 mb-6">Common mistakes to avoid</h2>
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <ul className="space-y-3">
                            {commonMistakes.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <IconCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 mt-8">
                        <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This article is for informational purposes only and does not constitute tax advice.
                            Tax laws change regularly. Always consult a registered tax practitioner or SARS directly
                            for advice specific to your situation.
                        </p>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/sales-tax-calculator">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                VAT / Sales Tax Calculator
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/blog/freelancer-tax-tips">
                            <Button variant="outline">More Freelancer Tax Tips</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Track expenses. Claim deductions. Save money.</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Illumi&apos;s expense tracker helps you categorise and store receipts so tax season is stress-free.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Tracking Expenses Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
