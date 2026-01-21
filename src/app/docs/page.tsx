import {
    Search,
    BookOpen,
    CreditCard,
    Users,
    FileText,
    Zap,
    LifeBuoy,
    ChevronRight,
    ArrowRight,
    Receipt,
    Settings,
    Smartphone
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation & Help Center | Illumi",
    description: "Learn how to use Illumi for invoicing, expense tracking, and payment collection. Guides for South African freelancers and small businesses.",
    keywords: ["illumi help", "invoicing guide", "payfast setup", "expense tracking tutorial"],
}

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Illumi<span className="text-neutral-500 font-medium ml-1">Help</span></span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
                        <div className="h-4 w-px bg-white/10"></div>
                        <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                    </nav>
                </div>
            </header>

            <main>
                {/* Hero Search Section */}
                <section className="relative pt-24 pb-20 px-6 border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/10 via-black to-black opacity-50"></div>
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How can we help you?</h1>
                        <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
                            Search our knowledge base for guides on invoicing, payments, and managing your team.
                        </p>
                        <div className="relative max-w-lg mx-auto group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-neutral-500 group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                type="text"
                                className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-lg placeholder:text-neutral-500 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/20 hover:bg-white/10 transition-all"
                                placeholder="Search for articles (e.g. 'How to refund')"
                            />
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-8">Browse by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CategoryCard
                            icon={BookOpen}
                            title="Getting Started"
                            description="Create your account, set up your business profile, and send your first invoice in minutes."
                            href="/docs/getting-started"
                        />
                        <CategoryCard
                            icon={FileText}
                            title="Invoicing"
                            description="Create professional invoices, set up recurring billing, send by email, and track payments."
                            href="/docs/invoicing"
                        />
                        <CategoryCard
                            icon={Receipt}
                            title="Expenses"
                            description="Track business expenses, set up recurring costs, calculate net profit, and export to CSV."
                            href="/docs/expenses"
                        />
                        <CategoryCard
                            icon={CreditCard}
                            title="PayGate & Payments"
                            description="Connect PayFast, Yoco, or other providers. Accept card payments and EFT from invoices."
                            href="/docs/payments"
                        />
                        <CategoryCard
                            icon={Users}
                            title="Clients & CRM"
                            description="Manage your client database, view invoice history, and organize by company."
                            href="/docs/clients"
                        />
                        <CategoryCard
                            icon={Smartphone}
                            title="Client Portal Links"
                            description="Send invoices by email with a secure link so clients can view and pay online."
                            href="/docs/client-portal"
                        />
                        <CategoryCard
                            icon={Settings}
                            title="Settings & Billing"
                            description="Manage your subscription, update payment methods, and configure notifications."
                            href="/docs/settings"
                        />
                        <CategoryCard
                            icon={LifeBuoy}
                            title="Support"
                            description="Contact our support team, report bugs, or request new features."
                            href="/contact"
                        />
                    </div>
                </section>

                {/* Popular Articles */}
                <section className="py-20 px-6 bg-white/2 border-t border-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 text-center">Popular Articles</h2>
                        <div className="space-y-4">
                            <ArticleRow href="/docs/payfast-online-payments" title="How to connect PayFast for online payments" category="Payments" time="3 min read" />
                            <ArticleRow href="/docs/invoicing" title="Setting up recurring invoices for retainer clients" category="Invoicing" time="5 min read" />
                            <ArticleRow href="/docs/send-invoices-by-email" title="Sending invoices by email" category="Invoicing" time="2 min read" />
                            <ArticleRow href="/docs/expenses" title="Tracking expenses and calculating net profit" category="Expenses" time="4 min read" />
                            <ArticleRow href="/docs/payments" title="Connecting Yoco for card payments" category="Payments" time="3 min read" />
                            <ArticleRow href="/docs/settings" title="Understanding Free vs Pro plan features" category="Billing" time="3 min read" />
                            <ArticleRow href="/docs/expenses" title="Exporting expenses to CSV for SARS" category="Expenses" time="2 min read" />
                            <ArticleRow href="/docs/clients" title="Managing client folders and invoice history" category="Clients" time="3 min read" />
                        </div>
                        <div className="mt-10 text-center">
                            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-neutral-300">
                                View all articles
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Still Stuck Banner */}
                <section className="py-20 px-6">
                    <div className="max-w-5xl mx-auto bg-[#0F0F11] border border-white/10 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px]"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                            <p className="text-neutral-400 max-w-md text-lg">
                                Our support team is available Monday to Friday to assist you with any complex issues.
                            </p>
                        </div>
                        <div className="flex gap-4 relative z-10">
                            <Link href="/contact">
                                <Button className="h-12 px-8 bg-white text-black hover:bg-neutral-200 font-bold rounded-xl">
                                    <LifeBuoy className="mr-2 h-5 w-5" />
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-neutral-600">
                    <p>&copy; {new Date().getFullYear()} Illumi. Professional invoicing for South African businesses.</p>
                </div>
            </footer>
        </div>
    );
}

function CategoryCard({ icon: Icon, title, description, href }: { icon: any, title: string, description: string, href: string }) {
    return (
        <Link href={href} className="group p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 hover:bg-white/2 transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neutral-200">{title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                {description}
            </p>
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-neutral-600 group-hover:text-white transition-colors">
                Explore <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    )
}

function ArticleRow({ href, title, category, time }: { href: string, title: string, category: string, time: string }) {
    return (
        <Link href={href} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0a0a0a] hover:bg-white/2 hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-neutral-400 group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-medium text-neutral-200 group-hover:text-white">{title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded">{category}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-600 font-medium">{time}</span>
                <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
            </div>
        </Link>
    )
}
