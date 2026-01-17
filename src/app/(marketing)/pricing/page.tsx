"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"

const starterFeatures = [
    "Unlimited invoices",
    "Client database",
    "Product catalog",
    "WhatsApp & Email sharing",
    "PDF Exports",
    "Basic reporting",
]

const proFeatures = [
    "Everything in Starter",
    "Custom business logo",
    "PayGate integration",
    "Client payment portal",
    "Recurring invoices",
    "Automated status updates",
    "Priority support",
]

const faqs = [
    {
        question: "Is there really a free version?",
        answer: "Yes! Our Starter plan is free forever and includes everything you need to start invoicing today.",
    },
    {
        question: "How does the PayGate integration work?",
        answer: "Pro users can connect their PayGate account in seconds. Once connected, a 'Pay Now' button will appear on every invoice you send.",
    },
    {
        question: "Can I cancel my Pro subscription?",
        answer: "Of course. You can cancel at any time from your settings page. You'll keep your Pro features until the end of your billing cycle.",
    },
    {
        question: "Is my data secure?",
        answer: "Abstracted: We take security seriously. All data is encrypted and stored securely in our South African data centers.",
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
        content: "The WhatsApp sharing feature is a game changer for my clients.",
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
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <div className="bg-black">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-white/50 max-w-xl mx-auto text-lg">
                        Choose the plan that's right for your business. All plans include a 14-day free trial.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Starter Plan */}
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                            <div className="mb-6">
                                <div className="text-sm font-medium text-white/50 mb-2">Starter</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white font-serif">R349</span>
                                    <span className="text-white/50">/month</span>
                                </div>
                                <div className="text-sm text-white/40 mt-1">Perfect for freelancers and small businesses</div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {starterFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                        <IconCheck className="h-4 w-4 text-white/50 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant="outline"
                                className="w-full rounded-full h-12 border-white/20 text-white hover:bg-white/5"
                            >
                                Start free trial
                            </Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-8 rounded-3xl bg-white border border-white/10 relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
                                Popular
                            </div>

                            <div className="mb-6">
                                <div className="text-sm font-medium text-black/50 mb-2">Pro</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-black/40 line-through mr-2">R899</span>
                                    <span className="text-4xl font-bold text-black font-serif">R649</span>
                                    <span className="text-black/50">/month</span>
                                </div>
                                <div className="text-sm text-black/40 mt-1">For growing businesses and teams</div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {proFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-black/70">
                                        <IconCheck className="h-4 w-4 text-black/50 flex-shrink-0" />
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
                            <div
                                key={i}
                                className="border border-white/10 rounded-2xl overflow-hidden"
                            >
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="text-white font-medium">{faq.question}</span>
                                    <IconChevronDown
                                        className={`h-5 w-5 text-white/50 transition-transform ${openFaq === i ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-white/50">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
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
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
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
