"use client"

import Link from "next/link"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { InvoiceDemo } from "@/components/marketing/invoice-demo"
import {
    IconCheck,
    IconArrowRight,
    IconMail,
    IconShieldCheck,
    IconCreditCard,
    IconReceipt,
    IconRefresh,
    IconChartBar,
    IconFolder,
    IconFileExport,
    IconDeviceMobile,
    IconHeadset,
    IconStarFilled,
    IconPlayerPlay,
    IconChevronDown,
    IconX,
} from "@tabler/icons-react"
import { useState, useEffect, useRef } from "react"

/* =============================================================================
   DATA
============================================================================= */

const stats = [
    { value: 15000, label: "Invoices Created", prefix: "", suffix: "+" },
    { value: 2500, label: "SA Businesses", prefix: "", suffix: "+" },
    { value: 12, label: "Processed in ZAR", prefix: "R", suffix: "M+" },
    { value: 5, label: "Average Rating", prefix: "", suffix: "★" },
]

const painPoints = [
    { problem: "Chasing clients for payments", solution: "Automatic payment reminders & online Pay Now button" },
    { problem: "Manual invoice tracking in spreadsheets", solution: "Real-time dashboard with status updates" },
    { problem: "No professional branding", solution: "Custom logo & branded invoice templates" },
    { problem: "VAT calculation headaches", solution: "Automatic VAT at 15% (or custom rate)" },
    { problem: "Late payments hurting cash flow", solution: "PayGate integration for instant online payments" },
    { problem: "Clients asking for invoice copies", solution: "Client portal keeps invoices accessible anytime" },
]

const features = [
    { icon: IconMail, title: "Email Invoicing", description: "Send professional invoices by email in one click. Clients get a secure link to view and pay." },
    { icon: IconCreditCard, title: "Online Payments", description: "Accept card, EFT, and SnapScan via PayFast, Yoco, or Ozow. Invoice status updates automatically." },
    { icon: IconFolder, title: "Client Management", description: "Organize invoices by client with folder-style management. Track billing history effortlessly." },
    { icon: IconChartBar, title: "Profit Tracking", description: "See your real profit after expenses. Track income vs expenses in ZAR on your dashboard." },
    { icon: IconRefresh, title: "Recurring Invoices", description: "Set up recurring invoices for retainer clients. Bill monthly without lifting a finger." },
    { icon: IconReceipt, title: "VAT Reports", description: "Export invoices and expenses for tax season. VAT-ready reporting for SARS compliance." },
    { icon: IconFileExport, title: "PDF & CSV Export", description: "Download professional PDF invoices or export data as CSV for your accountant." },
    { icon: IconDeviceMobile, title: "Mobile Friendly", description: "Create and send invoices from any device. Your clients can pay from their phones too." },
]

const freeFeatures = [
    "Unlimited invoices",
    "Client database",
    "Product catalog",
    "Email invoice sending",
    "PDF exports",
    "Custom business logo",
    "Expense tracking",
    "Net profit calculator",
    "CSV exports",
]

const proFeatures = [
    "Everything in Free, plus:",
    "Remove Illumi branding",
    "PayGate integration (PayFast, Yoco, Ozow)",
    "Client payment portal",
    "Recurring invoices",
    "Auto-update invoice status",
    "Team members (up to 5)",
    "Priority support",
]

const testimonials = [
    {
        name: "Thabo Molefe",
        role: "Freelance Developer, Johannesburg",
        content: "I used to spend hours every month on invoicing. With Illumi, I create and send invoices in under 2 minutes. The PayGate integration means clients pay me faster too.",
        rating: 5,
    },
    {
        name: "Sarah van der Berg",
        role: "Small Business Owner, Cape Town",
        content: "Finally, invoicing software that understands South African businesses. VAT calculation, ZAR currency, and local payment providers - it just works.",
        rating: 5,
    },
    {
        name: "Priya Naidoo",
        role: "Marketing Consultant, Durban",
        content: "The client payment portal is a game-changer. My clients can view all their invoices and pay online. I've reduced late payments by 60%.",
        rating: 5,
    },
    {
        name: "Michael Botha",
        role: "Agency Owner, Pretoria",
        content: "We switched from Excel to Illumi and our team productivity doubled. The recurring invoices feature alone saves us 10 hours per month.",
        rating: 5,
    },
    {
        name: "Lerato Khumalo",
        role: "Graphic Designer, Soweto",
        content: "The PDF exports look so professional. My clients are impressed and I look more credible. Best free invoicing tool I've found.",
        rating: 5,
    },
    {
        name: "Johan Pretorius",
        role: "IT Consultant, Bloemfontein",
        content: "Recurring invoices have been a lifesaver for my retainer clients. Set it once and forget it. Payments come in like clockwork now.",
        rating: 5,
    },
    {
        name: "Fatima Essop",
        role: "Accountant, Johannesburg",
        content: "I recommend Illumi to all my small business clients. The expense tracking and profit reports make tax season so much easier.",
        rating: 5,
    },
    {
        name: "David Nkosi",
        role: "Photographer, Durban",
        content: "Being able to add my logo and remove the Illumi branding makes my invoices look super professional. Worth every cent of Pro.",
        rating: 5,
    },
    {
        name: "Anele Mbeki",
        role: "Web Developer, Port Elizabeth",
        content: "The client portal is brilliant. My clients can see all their invoices in one place and pay instantly. No more chasing payments.",
        rating: 5,
    },
    {
        name: "Chantel du Plessis",
        role: "Event Planner, Stellenbosch",
        content: "I love how easy it is to duplicate invoices. For repeat clients, I just copy the last invoice and update the date. So quick!",
        rating: 5,
    },
    {
        name: "Sipho Dlamini",
        role: "Electrician, Pretoria",
        content: "Finally an invoicing app that works on my phone. I can send invoices right after finishing a job. Clients pay faster when it's fresh.",
        rating: 5,
    },
    {
        name: "Nomsa Zulu",
        role: "Interior Designer, Sandton",
        content: "The VAT calculation is perfect. I was always worried about getting it wrong before. Now it's automatic and accurate every time.",
        rating: 5,
    },
]

const faqs = [
    {
        question: "Is Illumi really free to use?",
        answer: "Yes! Our Free plan includes unlimited invoices, client database, expense tracking, email sending, and PDF exports - free forever. No credit card required to start. You only pay if you upgrade to Pro for advanced features like PayGate integration.",
    },
    {
        question: "How do I accept online payments from clients?",
        answer: "Pro users can connect South African payment providers like PayFast, Yoco, Ozow, or PayStack through our PayGate feature. Once connected, a 'Pay Now' button appears on every invoice. When clients pay, your invoice status updates automatically.",
    },
    {
        question: "Does Illumi support VAT for South African businesses?",
        answer: "Absolutely. Illumi is built specifically for South African businesses. Set your VAT rate to 15% (or any custom rate) in settings, and invoices will automatically calculate and display VAT. For non-VAT registered businesses, simply keep the rate at 0%.",
    },
    {
        question: "Can I customize invoices with my business logo?",
        answer: "Yes! Even on the Free plan, you can upload your business logo to appear on all invoices. Pro users can also remove the 'Powered by Illumi' branding for a fully white-labeled experience.",
    },
    {
        question: "How do clients receive and pay invoices?",
        answer: "When you send an invoice, your client receives an email with a secure link. They can view the invoice online and pay instantly using the Pay Now button (if you have PayGate enabled). Payment methods depend on your connected provider.",
    },
    {
        question: "Can I track my business expenses too?",
        answer: "Yes! Track once-off and recurring expenses in ZAR, categorize them, and see your net profit (income minus expenses) on your dashboard. Export expense reports as CSV for your accountant or SARS tax submissions.",
    },
    {
        question: "What if I need to cancel my Pro subscription?",
        answer: "Cancel anytime from Settings > Billing. You'll keep Pro features until the end of your billing cycle, then automatically revert to the Free plan. No penalties, no hassle.",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. All data is encrypted in transit and at rest. Payments are processed securely by your connected payment provider (PayFast, Yoco, etc.) - we never see your clients' card details. We use industry-standard security practices.",
    },
]

const trustBadges = [
    { icon: IconShieldCheck, text: "Bank-level encryption" },
    { icon: IconCreditCard, text: "PCI-DSS compliant payments" },
    { icon: IconReceipt, text: "SARS VAT-ready" },
    { icon: IconHeadset, text: "Local SA support" },
]

/* =============================================================================
   COUNT-UP STATS COMPONENT
============================================================================= */

function CountUpStats() {
    const [counts, setCounts] = useState(stats.map(() => 0))
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    const duration = 2000
                    const steps = 60
                    const interval = duration / steps

                    let step = 0
                    const timer = setInterval(() => {
                        step++
                        const progress = step / steps
                        const eased = 1 - Math.pow(1 - progress, 3)
                        setCounts(stats.map((stat) => Math.floor(stat.value * eased)))
                        if (step >= steps) {
                            clearInterval(timer)
                            setCounts(stats.map((stat) => stat.value))
                        }
                    }, interval)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [hasAnimated])

    return (
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-card border border-border">
                    <div className="text-2xl md:text-3xl font-bold text-foreground">
                        {stat.prefix}{counts[i].toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
            ))}
        </div>
    )
}

/* =============================================================================
   INLINE NOTIFICATIONS COMPONENT
============================================================================= */

function InlineNotifications() {
    const [activeIndex, setActiveIndex] = useState(-1)
    const [shownItems, setShownItems] = useState<number[]>([])
    const [hasStarted, setHasStarted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true)
                    let index = 0
                    const showNext = () => {
                        if (index < painPoints.length) {
                            // First, set this item as active (highlighted)
                            setActiveIndex(index)
                            // Then add it to visible items
                            setShownItems((prev) => [...prev, index])
                            index++
                            // After delay, show next item (which will become the new active)
                            setTimeout(showNext, 1500)
                        } else {
                            // Animation complete - clear active state after short delay
                            setTimeout(() => {
                                setActiveIndex(-1)
                            }, 800)
                        }
                    }
                    setTimeout(showNext, 500)
                }
            },
            { threshold: 0.3 }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [hasStarted])

    return (
        <div ref={ref} className="space-y-3 w-full max-w-4xl mx-auto px-4 sm:px-0">
            {painPoints.map((item, i) => {
                const isVisible = shownItems.includes(i)
                const isActive = activeIndex === i
                
                return (
                    <div
                        key={i}
                        className={`transition-all duration-300 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                        }`}
                    >
                        <div className="w-full bg-white dark:bg-muted rounded-2xl shadow-lg border border-border p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                    <IconX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                                </div>
                                <span className="text-xs sm:text-sm text-muted-foreground line-through truncate">{item.problem}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <IconCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                                </div>
                                <span className="text-xs sm:text-sm text-foreground font-medium">{item.solution}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

/* =============================================================================
   TESTIMONIAL CAROUSEL COMPONENT
============================================================================= */

function TestimonialCarousel() {
    const duplicatedTestimonials = [...testimonials, ...testimonials]

    return (
        <div className="relative overflow-hidden">
            <div className="flex animate-scroll-left">
                {duplicatedTestimonials.map((testimonial, i) => (
                    <div
                        key={i}
                        className="shrink-0 w-80 md:w-96 p-6 mx-3 rounded-2xl bg-card border border-border"
                    >
                        <div className="flex items-center gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, j) => (
                                <IconStarFilled key={j} className="h-4 w-4 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-foreground mb-6 leading-relaxed text-sm">"{testimonial.content}"</p>
                        <div>
                            <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
                            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes scroll-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll-left {
                    animation: scroll-left 60s linear infinite;
                }
            `}</style>
        </div>
    )
}

/* =============================================================================
   LANDING PAGE NAVIGATION
============================================================================= */

function LandingNavigation() {
    return (
        <nav className="bg-background border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/landing-page" className="flex items-center">
                        <span className="font-serif font-bold text-xl italic text-foreground">Illumi</span>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                        <Link href="/integrations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Integrations
                        </Link>
                        <Link href="/story" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Story
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Contact
                        </Link>
                    </div>

                    {/* Sign In */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block h-6 w-px bg-border" />
                        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-border">
                <div className="flex items-center justify-center gap-4 py-3 px-4 overflow-x-auto">
                    <Link href="/features" className="text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                        Features
                    </Link>
                    <Link href="/pricing" className="text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                        Pricing
                    </Link>
                    <Link href="/integrations" className="text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                        Integrations
                    </Link>
                    <Link href="/story" className="text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                        Story
                    </Link>
                    <Link href="/contact" className="text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    )
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function GoogleAdsLandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Custom Landing Page Navigation */}
            <LandingNavigation />

            {/* Hero Section */}
            <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Trust indicator - no avatars */}
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-accent text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                            <IconCheck className="h-4 w-4 text-primary" />
                            <span>Trusted by 2,500+ South African businesses</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
                            Stop Chasing Payments.
                            <br />
                            <span className="text-primary">Get Paid Faster</span> with Professional Invoicing.
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
                            Create professional invoices in ZAR, send them by email, and let clients pay online with PayFast, Yoco, or Ozow. 
                            <strong className="text-foreground"> Free forever</strong> — no credit card required.
                        </p>

                        {/* Key Benefits - Get Paid Online prominently displayed */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 px-2">
                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <IconCreditCard className="h-5 w-5 text-primary" />
                                <span className="text-foreground font-medium">Get Paid Online</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <IconMail className="h-5 w-5 text-primary" />
                                <span className="text-foreground font-medium">Email Invoices</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <IconShieldCheck className="h-5 w-5 text-primary" />
                                <span className="text-foreground font-medium">PayFast & Yoco</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 px-4 sm:px-0">
                            <Link href="/login">
                                <HoverBorderGradient
                                    as="div"
                                    containerClassName=""
                                    className="bg-foreground text-background font-semibold text-lg px-8 py-4 flex items-center gap-2"
                                >
                                    Get Started for Free
                                    <IconArrowRight className="h-5 w-5" />
                                </HoverBorderGradient>
                            </Link>
                            <a href="#demo">
                                <HoverBorderGradient
                                    as="div"
                                    containerClassName=""
                                    className="bg-background text-foreground font-semibold text-lg px-8 py-4 flex items-center gap-2"
                                >
                                    <IconPlayerPlay className="h-5 w-5" />
                                    Watch Demo
                                </HoverBorderGradient>
                            </a>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            ✓ No credit card required &nbsp;•&nbsp; ✓ Setup in 2 minutes &nbsp;•&nbsp; ✓ Cancel anytime
                        </p>
                    </div>

                    {/* Stats with Count-Up Animation */}
                    <CountUpStats />
                </div>
            </section>

            {/* Problem/Solution Section - White Background with Inline Notifications */}
            <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12 px-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                            Sound Familiar?
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                            If you're tired of these invoicing headaches, you're not alone. Here's how Illumi solves them.
                        </p>
                    </div>

                    <InlineNotifications />
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section id="demo" className="py-12 sm:py-16 md:py-24 scroll-mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Live Demo
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            See How Easy It Is
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Watch the complete invoice workflow — from creating an invoice to getting paid online.
                        </p>
                    </div>
                    <InvoiceDemo />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Everything You Need to Get Paid
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Built specifically for South African freelancers, consultants, and small businesses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-12 sm:py-16 md:py-24" id="pricing">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Start free, upgrade when you need online payments and advanced features.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Free Plan */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border flex flex-col">
                            <div className="mb-6">
                                <div className="text-sm font-medium text-muted-foreground mb-2">Free</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl sm:text-5xl font-bold text-foreground">R0</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <div className="text-sm text-primary font-medium mt-2">Best for freelancers & solo businesses starting out</div>
                                <div className="text-xs text-muted-foreground mt-1">Free forever. No credit card required.</div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {freeFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                                        <IconCheck className="h-5 w-5 text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link href="/login" className="block">
                                    <HoverBorderGradient
                                        as="div"
                                        containerClassName="w-full"
                                        className="bg-background text-foreground font-semibold text-base px-6 py-3 w-full justify-center"
                                    >
                                        Get Started Free
                                    </HoverBorderGradient>
                                </Link>
                            </div>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden flex flex-col">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
                                Most Popular
                            </div>

                            <div className="mb-6">
                                <div className="text-sm font-medium text-primary-foreground/70 mb-2">Pro</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl sm:text-5xl font-bold">R200</span>
                                    <span className="text-primary-foreground/70">/month</span>
                                </div>
                                <div className="text-sm text-white font-medium mt-2">Best for growing businesses that want faster payments</div>
                                <div className="text-xs text-primary-foreground/60 mt-1">Online payments & advanced features included.</div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {proFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <IconCheck className="h-5 w-5 text-primary-foreground shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link href="/login" className="block">
                                    <HoverBorderGradient
                                        as="div"
                                        containerClassName="w-full"
                                        className="bg-background text-foreground font-semibold text-base px-6 py-3 w-full justify-center"
                                    >
                                        Start Free, Upgrade Later
                                    </HoverBorderGradient>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        All plans include unlimited invoices. Upgrade or downgrade anytime.
                    </p>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-12 sm:py-16 md:py-24 bg-muted/30 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Loved by South African Businesses
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            See what our customers have to say.
                        </p>
                    </div>
                </div>
                <TestimonialCarousel />
            </section>

            {/* Trust Badges */}
            <section className="py-8 sm:py-12 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                        {trustBadges.map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <badge.icon className="h-5 w-5" />
                                <span>{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-muted-foreground">
                            Got questions? We've got answers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-border rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                                >
                                    <span className="text-foreground font-medium pr-4">{faq.question}</span>
                                    <IconChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-muted-foreground">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-12 sm:py-16 md:py-24 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                        Ready to Get Paid Faster?
                    </h2>
                    <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Join 2,500+ South African businesses using Illumi to create professional invoices and get paid online. Start free today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/login">
                            <HoverBorderGradient
                                as="div"
                                containerClassName=""
                                className="bg-background text-foreground font-semibold text-lg px-8 py-4 flex items-center gap-2"
                            >
                                Get Started for Free
                                <IconArrowRight className="h-5 w-5" />
                            </HoverBorderGradient>
                        </Link>
                    </div>
                    <p className="text-sm text-primary-foreground/60 mt-6">
                        No credit card required • Setup in 2 minutes • Cancel anytime
                    </p>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="py-6 sm:py-8 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-lg italic text-foreground">Illumi</span>
                            <span className="text-sm text-muted-foreground">• Professional Invoicing for South Africa</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                            <Link href="/features/paygate" className="hover:text-foreground transition-colors">PayGate</Link>
                            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                        </div>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-6">
                        © {new Date().getFullYear()} Illumi. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
