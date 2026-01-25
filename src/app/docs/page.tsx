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
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export const metadata: Metadata = {
    title: "Documentation & Help Center | Illumi",
    description: "Learn how to use Illumi for invoicing, expense tracking, and payment collection. Guides for South African freelancers and small businesses.",
    keywords: ["illumi help", "invoicing guide", "payfast setup", "expense tracking tutorial"],
}

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground/20 grainy-gradient">
            <MarketingHeader />
            <main className="relative z-10">
                {/* Hero Search Section */}
                <section className="relative pt-24 md:pt-28 pb-16 px-6 border-b border-border overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="h-full w-full bg-background" />
                        <div className="absolute inset-0 bg-background/60" />
                    </div>
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How can we help you?</h1>
                        <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
                            Search our knowledge base for guides on invoicing, payments, and managing your team.
                        </p>
                        <div className="relative max-w-lg mx-auto group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            </div>
                            <Input
                                type="text"
                                className="h-14 pl-12 bg-background border-border rounded-2xl text-lg placeholder:text-muted-foreground focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/20 hover:bg-accent transition-all"
                                placeholder="Search for articles (e.g. 'How to refund')"
                            />
                        </div>
                    </div>
                </section>

                <section className="flex">
                    <aside className="hidden lg:block w-80 border-r border-border bg-card sticky top-0 h-screen overflow-y-auto">
                        <DocsSidebar />
                    </aside>

                    <div className="flex-1 py-16 px-6 lg:px-12">
                        <div className="max-w-5xl mx-auto">
                            {/* Categories Grid */}
                    <div className="mb-12 rounded-3xl border border-border bg-card p-8 md:p-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            <div className="max-w-2xl">
                                <div className="text-sm font-bold uppercase tracking-widest text-neutral-500">Recommended path</div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3">Get set up in 30 minutes</h2>
                                <p className="text-neutral-400 mt-3 leading-relaxed">
                                    Follow the guided setup path from workspace → clients → invoices → PayGate → vault. Each page includes steps, links, and UI previews.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:max-w-xl">
                                <Link href="/docs/getting-started" className="rounded-2xl border border-border bg-background hover:bg-accent transition-colors p-5">
                                    <div className="text-sm font-semibold text-foreground">1. Getting started</div>
                                    <div className="text-xs text-muted-foreground mt-1">Start here</div>
                                </Link>
                                <Link href="/docs/workspace" className="rounded-2xl border border-border bg-background hover:bg-accent transition-colors p-5">
                                    <div className="text-sm font-semibold text-foreground">2. Workspace</div>
                                    <div className="text-xs text-muted-foreground mt-1">Defaults & team</div>
                                </Link>
                                <Link href="/docs/clients" className="rounded-2xl border border-border bg-background hover:bg-accent transition-colors p-5">
                                    <div className="text-sm font-semibold text-foreground">3. Clients</div>
                                    <div className="text-xs text-muted-foreground mt-1">Billing details</div>
                                </Link>
                                <Link href="/docs/invoicing" className="rounded-2xl border border-border bg-background hover:bg-accent transition-colors p-5">
                                    <div className="text-sm font-semibold text-foreground">4. Invoices</div>
                                    <div className="text-xs text-muted-foreground mt-1">Create & send</div>
                                </Link>
                                <Link href="/docs/paygate" className="rounded-2xl border border-border bg-background hover:bg-accent transition-colors p-5">
                                    <div className="text-sm font-semibold text-foreground">5. PayGate</div>
                                    <div className="text-xs text-muted-foreground mt-1">Get paid online</div>
                                </Link>
                                <Link href="/docs/vault" className="rounded-2xl border border-border bg-background hover:bg-accent transition-colors p-5">
                                    <div className="text-sm font-semibold text-foreground">6. Vault</div>
                                    <div className="text-xs text-muted-foreground mt-1">Store receipts</div>
                                </Link>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link href="/docs/troubleshooting">
                                <Button variant="outline" className="border-border hover:bg-accent text-foreground">
                                    Troubleshooting
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Contact support
                                </Button>
                            </Link>
                        </div>
                    </div>

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
                            icon={Zap}
                            title="PayGate setup"
                            description="Enable PayGate, set a primary provider, and verify webhooks are working."
                            href="/docs/paygate"
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
                            icon={BookOpen}
                            title="Workspace"
                            description="Workspace defaults, team members, and multi-business setups."
                            href="/docs/workspace"
                        />
                        <CategoryCard
                            icon={Receipt}
                            title="Vault"
                            description="Store receipts and documents, and keep your admin organised."
                            href="/docs/vault"
                        />
                        <CategoryCard
                            icon={LifeBuoy}
                            title="Troubleshooting"
                            description="Quick fixes for common issues and where to look first."
                            href="/docs/troubleshooting"
                        />
                        <CategoryCard
                            icon={LifeBuoy}
                            title="Support"
                            description="Contact our support team, report bugs, or request new features."
                            href="/contact"
                        />
                    </div>
 
                            {/* Popular Articles */}
                            <section className="py-20 bg-muted/30 border-t border-border mt-16">
                                <div className="max-w-none">
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
                                        <Button variant="outline" className="border-border hover:bg-accent text-foreground">
                                            View all articles
                                        </Button>
                                    </div>
                                </div>
                            </section>

                            {/* Still Stuck Banner */}
                            <section className="py-20">
                                <div className="max-w-5xl mx-auto bg-card border border-border rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 blur-[80px]"></div>
                                    <div className="relative z-10 text-center md:text-left">
                                        <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                                        <p className="text-neutral-400 max-w-md text-lg">
                                            Our support team is available Monday to Friday to assist you with any complex issues.
                                        </p>
                                    </div>
                                    <div className="flex gap-4 relative z-10">
                                        <Link href="/contact">
                                            <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl">
                                                <LifeBuoy className="mr-2 h-5 w-5" />
                                                Contact Support
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </main>
            <MarketingFooter />
        </div>
    );
}

function CategoryCard({ icon: Icon, title, description, href }: { icon: any, title: string, description: string, href: string }) {
    return (
        <Link href={href} className="group p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all">
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                {description}
            </p>
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                Explore <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    )
}

function ArticleRow({ href, title, category, time }: { href: string, title: string, category: string, time: string }) {
    return (
        <Link href={href} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent transition-all group">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-background text-muted-foreground group-hover:text-foreground transition-colors">
                    <FileText className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-medium text-foreground">{title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-background px-1.5 py-0.5 rounded">{category}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-600 font-medium">{time}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
        </Link>
    )
}
