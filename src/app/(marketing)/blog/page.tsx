import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    IconArticle,
    IconArrowRight,
    IconClock,
    IconUser,
} from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Blog | Invoicing Tips & Business Advice | Illumi",
    description: "Expert tips on invoicing, getting paid faster, managing cash flow, and growing your South African small business. Free guides and resources for freelancers and entrepreneurs.",
    keywords: [
        "invoicing blog",
        "small business tips South Africa",
        "freelancer advice",
        "cash flow management",
        "getting paid faster",
        "business tips",
        "invoicing best practices",
        "SME resources",
    ],
}

const featuredPost = {
    title: "Get Paid Faster in South Africa: 11 Tactics That Actually Work",
    excerpt: "If you’re tired of “we’ll pay you next week”, steal this playbook. Cleaner invoices, better terms, smarter reminders — and fewer late payments.",
    author: "Illumi Team",
    date: "January 2026",
    readTime: "8 min read",
    category: "Cash Flow",
    href: "/blog/getting-paid-faster",
}

const blogPosts = [
    {
        title: "VAT in South Africa: The Simple Setup Guide (Without the Confusion)",
        excerpt: "What to put on a tax invoice, when to register, and the mistakes that trigger the most admin. Plain language, SA-focused.",
        author: "Illumi Team",
        date: "January 2026",
        readTime: "6 min read",
        category: "Tax & Compliance",
        href: "/blog/vat-setup-guide",
    },
    {
        title: "7 Invoice Mistakes That Quietly Kill Your Cash Flow",
        excerpt: "These tiny invoice errors cause the biggest payment delays. Fix them in under 10 minutes and get paid faster.",
        author: "Illumi Team",
        date: "January 2026",
        readTime: "4 min read",
        category: "Invoicing",
        href: "/blog/invoice-mistakes",
    },
    {
        title: "Recurring Invoices: The 'Set It and Forget It' Secret to Predictable Income",
        excerpt: "Stop manually creating the same invoice every month. Automate it and enjoy predictable cash flow without lifting a finger.",
        author: "Illumi Team",
        date: "January 2026",
        readTime: "5 min read",
        category: "Automation",
        href: "/blog/recurring-invoices",
    },
    {
        title: "Why a Client Portal Will Transform Your Freelance Business",
        excerpt: "The difference between 'just another freelancer' and 'premium service provider' is often just a client portal.",
        author: "Illumi Team",
        date: "January 2026",
        readTime: "6 min read",
        category: "Business Growth",
        href: "/blog/client-portal",
    },
    {
        title: "Online Payments for Invoices: Get Paid in Hours, Not Weeks",
        excerpt: "Adding a 'Pay Now' button to your invoices can cut payment time from weeks to hours. Here's how to set it up.",
        author: "Illumi Team",
        date: "January 2026",
        readTime: "5 min read",
        category: "Payments",
        href: "/blog/online-payments",
    },
    {
        title: "Invoice Templates That Make Clients Pay Faster (Psychology-Backed)",
        excerpt: "Your invoice design affects how quickly you get paid. Learn the psychology behind templates that get results.",
        author: "Illumi Team",
        date: "January 2026",
        readTime: "6 min read",
        category: "Invoicing",
        href: "/blog/invoice-templates",
    },
    {
        title: "Freelancer Tax Tips: 9 Deductions You're Probably Missing",
        excerpt: "South African freelancers leave thousands on the table every tax season. Here are the deductions you're entitled to.",
        author: "Illumi Team",
        date: "January 2026",
        readTime: "8 min read",
        category: "Tax & Compliance",
        href: "/blog/freelancer-tax-tips",
    },
    {
        title: "Freelancer Rates in South Africa: The 'R/hr' Formula Clients Can't Argue With",
        excerpt: "Stop undercharging. Use a simple rate formula (with SA examples) and make your pricing feel obvious — even to difficult clients.",
        author: "Illumi Team",
        date: "December 2025",
        readTime: "7 min read",
        category: "Pricing",
        href: "/blog/freelancer-rates",
    },
    {
        title: "Net 30 vs Due on Receipt: The Payment Terms Trick That Gets You Paid Faster",
        excerpt: "The wrong terms can quietly wreck your cash flow. Here's what to use, when to use it, and scripts you can copy.",
        author: "Illumi Team",
        date: "December 2025",
        readTime: "5 min read",
        category: "Invoicing",
        href: "/blog/payment-terms",
    },
    {
        title: "Late-Paying Clients: The Follow-Up System That Works (Without Sounding Desperate)",
        excerpt: "A simple escalation ladder + copy/paste templates that keep you professional and get invoices paid.",
        author: "Illumi Team",
        date: "December 2025",
        readTime: "6 min read",
        category: "Cash Flow",
        href: "/blog/late-paying-clients",
    },
    {
        title: "Expense Tracking for Tax Season: The 'One Folder' System That Saves Hours",
        excerpt: "If tax season makes you panic, your system is the problem — not you. Here's a simple way to stay ready all year.",
        author: "Illumi Team",
        date: "November 2025",
        readTime: "5 min read",
        category: "Tax & Compliance",
        href: "/blog/expense-tracking",
    },
]

const categories = [
    "All",
    "Invoicing",
    "Cash Flow",
    "Tax & Compliance",
    "Pricing",
    "Business Growth",
    "Automation",
    "Payments",
]

export default function BlogPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconArticle className="h-4 w-4" />
                            Blog
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing advice that makes you money
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Less theory, more tactics. Learn how to invoice better, get paid faster, and run a smarter business in South Africa.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-6 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    cat === "All"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link href={featuredPost.href} className="block group">
                        <div className="rounded-2xl border border-border bg-card p-8 md:p-12 hover:border-primary/50 transition-colors">
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                                Featured
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                                {featuredPost.title}
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <IconUser className="h-4 w-4" />
                                    {featuredPost.author}
                                </span>
                                <span>{featuredPost.date}</span>
                                <span className="flex items-center gap-1">
                                    <IconClock className="h-4 w-4" />
                                    {featuredPost.readTime}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-muted">{featuredPost.category}</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Popular */}
            <section className="py-4 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between gap-6 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Popular right now</h2>
                            <p className="text-sm text-muted-foreground">
                                The posts people bookmark and send to their accountant.
                            </p>
                        </div>
                        <Link href="/invoice-generator" className="text-sm text-primary hover:underline">
                            Create an invoice →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/blog/invoice-mistakes" className="group">
                            <div className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors h-full">
                                <div className="text-xs font-medium text-muted-foreground mb-2">Invoicing</div>
                                <div className="text-lg font-semibold group-hover:text-primary transition-colors">
                                    7 Invoice Mistakes That Quietly Kill Your Cash Flow
                                </div>
                                <p className="text-sm text-muted-foreground mt-3">
                                    Tiny fixes that reduce payment delays and stop the “we didn’t know” excuses.
                                </p>
                            </div>
                        </Link>
                        <Link href="/blog/payment-terms" className="group">
                            <div className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors h-full">
                                <div className="text-xs font-medium text-muted-foreground mb-2">Invoicing</div>
                                <div className="text-lg font-semibold group-hover:text-primary transition-colors">
                                    Net 30 vs Due on Receipt: The Payment Terms Trick
                                </div>
                                <p className="text-sm text-muted-foreground mt-3">
                                    Which terms to use, when to use them, and scripts you can copy.
                                </p>
                            </div>
                        </Link>
                        <Link href="/blog/vat-setup-guide" className="group">
                            <div className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors h-full">
                                <div className="text-xs font-medium text-muted-foreground mb-2">Tax & Compliance</div>
                                <div className="text-lg font-semibold group-hover:text-primary transition-colors">
                                    VAT Setup Guide (Without the Confusion)
                                </div>
                                <p className="text-sm text-muted-foreground mt-3">
                                    What to include on a tax invoice and the mistakes that cause admin pain.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-8 px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <Link key={post.title} href={post.href} className="group">
                                <article className="rounded-xl border border-border bg-card p-6 h-full hover:border-primary/50 transition-colors">
                                    <div className="px-2 py-0.5 rounded bg-muted text-xs font-medium text-muted-foreground w-fit mb-4">
                                        {post.category}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Get Business Tips in Your Inbox
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of South African entrepreneurs receiving weekly tips on invoicing, 
                        cash flow, and growing their business.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Subscribe Free
                            <IconArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
