"use client"

import React from "react"
import {
    BookOpen,
    Download,
    Zap,
    Layers,
    Database,
    ShieldCheck,
    Key,
    Webhook,
    AlertTriangle,
    LifeBuoy,
    Search,
    ChevronRight,
    Copy,
    Book,
    GraduationCap,
    Users,
    ChevronLeft,
    Github
} from "lucide-react"

export default function DeveloperDocsPage() {
    return (
        <div className="flex flex-col h-full bg-background text-foreground font-sans overflow-hidden rounded-3xl border border-border">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 hidden lg:flex flex-col border-r border-border bg-card shrink-0 overflow-y-auto no-scrollbar">
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-black shadow-sm">
                                <Zap className="w-4 h-4 fill-current" />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-foreground uppercase italic">Platform API</span>
                        </div>
                    </div>

                    <nav className="p-4 space-y-8 flex-1">
                        <div>
                            <h3 className="px-4 mb-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Getting Started</h3>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-foreground bg-muted rounded-xl border border-border transition-all">
                                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                        Overview
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all group">
                                        <Download className="w-3.5 h-3.5 group-hover:text-foreground transition-colors" />
                                        Installation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all group">
                                        <Zap className="w-3.5 h-3.5 group-hover:text-foreground transition-colors" />
                                        Quick Start
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="px-4 mb-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Core Concepts</h3>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                                        <Layers className="w-3.5 h-3.5" />
                                        Architecture
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                                        <Database className="w-3.5 h-3.5" />
                                        Data Management
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Security
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="px-4 mb-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">API Reference</h3>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                                        <Key className="w-3.5 h-3.5" />
                                        Authentication
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                                        <Webhook className="w-3.5 h-3.5" />
                                        Endpoints
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Error Handling
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-border">
                        <div className="bg-muted border border-border rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:border-border transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-muted blur-2xl -mr-8 -mt-8" />
                            <div className="relative z-10 flex items-start gap-3">
                                <div className="p-2 bg-accent rounded-xl">
                                    <LifeBuoy className="w-4 h-4 text-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground mb-0.5">Need help?</p>
                                    <p className="text-[10px] text-muted-foreground">Contact support team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 overflow-y-auto bg-background no-scrollbar">
                    {/* Top Header */}
                    <header className="sticky top-0 z-30 bg-black/50 backdrop-blur-3xl border-b border-border">
                        <div className="max-w-5xl mx-auto px-4 sm:px-10 h-16 flex items-center justify-between">
                            <div className="w-full max-w-md relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-2 bg-muted border border-border rounded-xl text-sm placeholder-white/20 focus:outline-none focus:border-border transition-all"
                                    placeholder="Search documentation..."
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <kbd className="inline-flex items-center border border-border rounded-md px-1.5 py-0.5 text-[10px] font-sans font-black text-muted-foreground tracking-tighter uppercase mb-0.5">⌘K</kbd>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 ml-8">
                                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Feedback</a>
                                <div className="h-4 w-px bg-muted"></div>
                                <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <Github className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </header>

                    <div className="max-w-4xl mx-auto px-4 sm:px-10 py-12 sm:py-16 lg:py-24">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-12 space-x-2">
                            <a href="#" className="hover:text-foreground transition-colors">Home</a>
                            <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                            <a href="#" className="hover:text-foreground transition-colors">Getting Started</a>
                            <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                            <span className="text-muted-foreground">Overview</span>
                        </nav>

                        {/* Page Title & Intro */}
                        <div className="mb-16">
                            <h1 className="text-3xl sm:text-5xl font-serif italic font-bold tracking-tight text-foreground mb-6">Overview</h1>
                            <p className="text-base sm:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl">
                                Learn the basics of our platform and get started quickly. Our API is designed to be intuitive, secure, and scalable for applications of any size.
                            </p>
                        </div>

                        {/* Key Features Grid */}
                        <section className="mb-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Key Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group p-8 rounded-3xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-border transition-all duration-300">
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 rounded-2xl bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                            <Zap className="w-6 h-6 fill-current" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-foreground mb-2">Fast Integration</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                                Integrate with your existing systems quickly using our simple, typed API SDKs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="group p-8 rounded-3xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-border transition-all duration-300">
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 rounded-2xl bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                            <ShieldCheck className="w-6 h-6 fill-current" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-foreground mb-2">Secure by Design</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                                Enterprise-grade security with SOC2 compliance and end-to-end encryption.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Steps Section */}
                        <section className="mb-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Getting Started</h2>
                            <div className="relative pl-4 space-y-12">
                                <div className="absolute left-0 top-2 bottom-2 w-px bg-muted" />

                                <div className="relative pl-8">
                                    <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-background border border-border" />
                                    <h3 className="text-base font-bold text-foreground mb-2">Create an account</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Sign up for a free account to generate your sandbox API keys immediately.</p>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-background border border-border" />
                                    <h3 className="text-base font-bold text-foreground mb-3">Install the SDK</h3>
                                    <div className="mt-4 flex items-center justify-between p-4 bg-muted border border-border rounded-2xl max-w-md group hover:border-border transition-all">
                                        <code className="text-xs font-mono text-muted-foreground">npm install @illumi/sdk</code>
                                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-background border border-border" />
                                    <h3 className="text-base font-bold text-foreground mb-2">Configure & Request</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Initialize the client and make your first request to the health endpoint.</p>
                                </div>
                            </div>
                        </section>

                        {/* Code Example */}
                        <section className="mb-24">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">Code Example</h2>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground">JS / TS</span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground border border-border">Python</span>
                                </div>
                            </div>

                            <div className="rounded-3xl overflow-hidden bg-card border border-border shadow-2xl">
                                <div className="flex items-center justify-between px-6 py-4 bg-muted border-b border-border">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-muted/500 border border-border" />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">example.ts</span>
                                </div>
                                <div className="p-8 overflow-x-auto">
                                    <pre className="text-sm font-mono leading-relaxed"><code className="language-javascript">
                                        <span className="text-purple-400">const</span> <span className="text-blue-300">client</span> <span className="text-muted-foreground">=</span> <span className="text-purple-400">new</span> <span className="text-yellow-200">Illumi</span><span className="text-muted-foreground">{`({`}</span>
                                        <span className="text-blue-300">apiKey</span><span className="text-muted-foreground">:</span> <span className="text-emerald-400">'pk_test_illumi_51Mx...'</span><span className="text-muted-foreground">,</span>
                                        <span className="text-blue-300">environment</span><span className="text-muted-foreground">:</span> <span className="text-emerald-400">'production'</span>
                                        <span className="text-muted-foreground">{`});`}</span>

                                        <span className="text-muted-foreground">// Send a new invoice via API</span>
                                        <span className="text-purple-400">const</span> <span className="text-blue-300">res</span> <span className="text-muted-foreground">=</span> <span className="text-purple-400">await</span> <span className="text-blue-300">client</span><span className="text-muted-foreground">.</span><span className="text-blue-300">invoices</span><span className="text-muted-foreground">.</span><span className="text-yellow-200">send</span><span className="text-muted-foreground">{`({`}</span>
                                        <span className="text-blue-300">clientId</span><span className="text-muted-foreground">:</span> <span className="text-emerald-400">'client_9912'</span><span className="text-muted-foreground">,</span>
                                        <span className="text-blue-300">amount</span><span className="text-muted-foreground">:</span> <span className="text-orange-400">1250.00</span><span className="text-muted-foreground">,</span>
                                        <span className="text-blue-300">methods</span><span className="text-muted-foreground">:</span> <span className="text-muted-foreground">[</span><span className="text-emerald-400">'email'</span><span className="text-muted-foreground">,</span> <span className="text-emerald-400">'link'</span><span className="text-muted-foreground">]</span>
                                        <span className="text-muted-foreground">{`});`}</span>

                                        <span className="text-blue-300">console</span><span className="text-muted-foreground">.</span><span className="text-yellow-200">log</span><span className="text-muted-foreground">(</span><span className="text-blue-300">res</span><span className="text-muted-foreground">.</span><span className="text-blue-300">id</span><span className="text-muted-foreground">);</span></code></pre>
                                </div>
                            </div>
                        </section>

                        {/* Next Steps */}
                        <section className="mb-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Next Steps</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <a href="#" className="block p-6 rounded-3xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-border hover:shadow-2xl transition-all group">
                                    <Book className="w-5 h-5 text-muted-foreground group-hover:text-foreground mb-4 transition-colors" />
                                    <h3 className="text-sm font-bold text-foreground group-hover:italic transition-all">API Reference</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Explore all endpoints</p>
                                </a>
                                <a href="#" className="block p-6 rounded-3xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-border hover:shadow-2xl transition-all group">
                                    <GraduationCap className="w-5 h-5 text-muted-foreground group-hover:text-foreground mb-4 transition-colors" />
                                    <h3 className="text-sm font-bold text-foreground group-hover:italic transition-all">Tutorials</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Step-by-step guides</p>
                                </a>
                                <a href="#" className="block p-6 rounded-3xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-border hover:shadow-2xl transition-all group">
                                    <Users className="w-5 h-5 text-muted-foreground group-hover:text-foreground mb-4 transition-colors" />
                                    <h3 className="text-sm font-bold text-foreground group-hover:italic transition-all">Community</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Join the discussion</p>
                                </a>
                            </div>
                        </section>

                        {/* Page Navigation Footer */}
                        <div className="mt-32 pt-12 border-t border-border flex justify-between items-center">
                            <a href="#" className="group flex flex-col items-start gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Previous</span>
                                <div className="flex items-center text-sm font-bold text-foreground group-hover:italic transition-all">
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Introduction
                                </div>
                            </a>
                            <a href="#" className="group flex flex-col items-end gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Next</span>
                                <div className="flex items-center text-sm font-bold text-foreground group-hover:italic transition-all">
                                    Installation
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </div>
                            </a>
                        </div>

                        <footer className="mt-24 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">&copy; 2024 Illumi Platform Inc. All rights reserved.</p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    )
}

