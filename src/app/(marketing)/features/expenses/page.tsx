import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    IconArrowRight,
    IconCheck,
    IconChartBar,
    IconReceipt,
    IconRefresh,
    IconDownload,
    IconCalculator,
    IconCategory,
} from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Expense Tracking for South African SMEs | Illumi",
    description: "Track business expenses, calculate net profit, manage recurring costs, and export CSV reports for your accountant. Free expense tracker for South African small businesses.",
    keywords: ["business expense tracker", "net profit calculator", "small business bookkeeping SA", "expense tracking South Africa", "export expenses to CSV"],
}

const features = [
    {
        icon: IconCalculator,
        title: "Net Profit Calculator",
        description: "See your real profit after expenses. Income minus expenses equals your true earnings in ZAR.",
    },
    {
        icon: IconRefresh,
        title: "Recurring Expenses",
        description: "Set up monthly recurring expenses like rent, subscriptions, and utilities. Never forget a cost.",
    },
    {
        icon: IconCategory,
        title: "Expense Categories",
        description: "Organize expenses by category - office, travel, supplies, software, and more.",
    },
    {
        icon: IconDownload,
        title: "CSV Export",
        description: "Export your expenses as CSV for your accountant. Simple reporting for tax season.",
    },
]

const expenseCategories = [
    { name: "Office Supplies", amount: "R 2,450.00", count: "12 expenses" },
    { name: "Software & Tools", amount: "R 1,800.00", count: "5 expenses" },
    { name: "Travel & Transport", amount: "R 3,200.00", count: "8 expenses" },
    { name: "Marketing", amount: "R 1,500.00", count: "3 expenses" },
]

export default function ExpensesFeaturePage() {
    return (
        <div className="bg-black">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 text-center">
                <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">Business Expense Tracker SA</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Track Expenses,<br />
                        <span className="text-white/50">Know Your Net Profit</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg mb-8">
                        Simple expense tracking for South African small businesses. See your real profit, manage recurring costs, and export reports for your accountant.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Start Tracking Free
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5"
                        >
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Screenshot Section */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/screenshots/expense-tracking-net-profit-zar-south-africa.png"
                            alt="Illumi expense tracking dashboard showing total expenses, net profit calculation, and expense list with categories"
                            title="Track expenses and net profit"
                            width={1920}
                            height={1080}
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="text-center text-white/40 text-sm mt-4">Track expenses, calculate net profit, and export reports for your accountant</p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything you need to track expenses</h2>
                        <p className="text-white/50 max-w-xl mx-auto">
                            Simple, powerful expense tracking built for South African small businesses and freelancers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                                <feature.icon className="h-10 w-10 text-white/70 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/50">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">How expense tracking works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Add expenses</h3>
                            <p className="text-white/50 text-sm">Log once-off or recurring expenses with category, amount, and date.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">See net profit</h3>
                            <p className="text-white/50 text-sm">Your dashboard shows income minus expenses for true profit visibility.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Export reports</h3>
                            <p className="text-white/50 text-sm">Download CSV reports for your accountant or tax submissions.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
