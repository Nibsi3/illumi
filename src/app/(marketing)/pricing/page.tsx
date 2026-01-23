import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pricing | Illumi",
    description: "Simple pricing for South African businesses. Start free, upgrade to Pro for PayGate, recurring invoices, and advanced features.",
    alternates: {
        canonical: "/pricing",
    },
}

const freeFeatures = [
    "Unlimited invoices",
    "Client database",
    "Product catalog",
    "Email invoice sending",
    "PDF Exports",
    "Expense tracking",
    "Net profit calculator",
    "CSV exports",
]

const proFeatures = [
    "Everything in Free, plus:",
    "Custom business logo",
    "PayGate integration",
    "Client payment portal",
    "Recurring invoices",
    "Auto-update invoice status",
    "Team members",
    "Priority support",
]

const faqs = [
    {
        question: "Is Illumi really free to use?",
        answer: "Yes! Our Free plan includes unlimited invoices, client database, expense tracking, and email invoice sending - free forever. No credit card required.",
    },
    {
        question: "How does PayGate integration work?",
        answer: "Pro users connect their preferred payment provider in Settings > PayGate. Once connected, a 'Pay Now' button appears on every invoice, and payment status updates automatically.",
    },
    {
        question: "Can I cancel my Pro subscription?",
        answer: "Yes, cancel anytime from Settings > Billing. You'll keep Pro features until the end of your billing cycle, then revert to the Free plan.",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. All data is encrypted and stored securely. Payments are processed securely by your connected payment provider.",
    },
    {
        question: "Does Illumi support South African VAT?",
        answer: "Yes, Illumi is built for South African businesses. All invoices support VAT calculations and display amounts in ZAR (Rands).",
    },
]

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Small Business Owner",
        content: "Switching to Illumi saved me hours of manual work every week.",
        avatar: "SC",
    },
    {
        name: "Michael Torres",
        role: "Independent Consultant",
        content: "The client payment portal has made it much easier for my clients to pay on time.",
        avatar: "MT",
    },
    {
        name: "Emma Wilson",
        role: "Freelancer",
        content: "Finally, a tool that gets it right.",
        avatar: "EW",
    },
    {
        name: "David Park",
        role: "Agency Owner",
        content: "Our team productivity doubled.",
        avatar: "DP",
    },
]

export default function PricingPage() {
    return (
        <div className="bg-black grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: "url(/bg.webp)" }} />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6 justify-center">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Free Invoicing Software for South Africa
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg mb-8">
                        Start free, upgrade when you need PayGate integration and automated payments.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12">
                            <Link href="/login">Get Started for Free</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5">
                            <Link href="/features/paygate">Explore PayGate</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Free Plan */}
                        <div className="p-8 rounded-3xl bg-white/2 border border-white/10">
                            <div className="mb-6">
                                <div className="text-sm font-medium text-white/50 mb-2">Free</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white font-serif">R0</span>
                                    <span className="text-white/50">/month</span>
                                </div>
                                <div className="text-sm text-white/40 mt-1">Free forever for freelancers and small businesses</div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {freeFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                        <IconCheck className="h-4 w-4 text-white/50 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full rounded-full h-12 border-white/20 text-white hover:bg-white/5"
                            >
                                <Link href="/login">Get Started Free</Link>
                            </Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-8 rounded-3xl bg-white border border-white/10 relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
                                Most Popular
                            </div>

                            <div className="mb-6">
                                <div className="text-sm font-medium text-black/50 mb-2">Pro</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-black font-serif">R350</span>
                                    <span className="text-black/50">/month</span>
                                </div>
                                <div className="text-sm text-black/40 mt-1">For businesses that want online invoice payments</div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {proFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-black/70">
                                        <IconCheck className="h-4 w-4 text-black/50 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                className="w-full rounded-full h-12 bg-black text-white hover:bg-black/90"
                            >
                                <Link href="/login">Start free trial</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Frequently asked questions
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group border border-white/10 rounded-2xl overflow-hidden"
                            >
                                <summary className="list-none cursor-pointer select-none w-full flex items-center justify-between p-6 text-left">
                                    <span className="text-white font-medium">{faq.question}</span>
                                    <IconChevronDown className="h-5 w-5 text-white/50 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-6 pb-6 text-white/50">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 text-center mb-12">
                        What people say
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/2 border border-white/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{testimonial.name}</div>
                                        <div className="text-xs text-white/50">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
