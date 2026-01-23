import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Story | Illumi",
    description: "Learn why we’re building Illumi — simpler invoicing, expense tracking, and getting paid for South African small businesses.",
    alternates: {
        canonical: "/story",
    },
}

export default function StoryPage() {
    return (
        <div className="bg-black grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: "url(/bg.webp)" }} />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6 justify-center">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">Our Story</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        This is why we're building{" "}
                        <span className="font-serif italic">Illumi.</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg mb-8">
                        A simpler way to invoice, track expenses, and get paid—built specifically for South African small businesses.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12">
                            <Link href="/login">
                                Get Started
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5">
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Story Content */}
            <section className="py-16">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    {/* Problem */}
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-white mb-6">The Problem</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            As small business owners in South Africa, we've always struggled with invoicing.
                            The tools we found were either too expensive, too complicated, or simply didn't
                            understand how we actually work.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            We spent hours creating invoices in Word or Excel, chasing clients for payments,
                            and losing track of who owed us what. Every invoice felt like a chore, and we
                            knew there had to be a better way.
                        </p>
                    </div>

                    {/* Solution */}
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-white mb-6">Our Solution</h2>
                        <div className="space-y-6 text-white/70 leading-relaxed">
                            <p>
                                So we built Illumi — the invoicing app we wished existed. Simple, beautiful,
                                and built specifically for South African businesses.
                            </p>
                            <p>
                                With Illumi, you can build a client database, create a product catalog, and
                                generate professional invoices in seconds. Send them by email or share a link —
                                your clients get a secure portal to view and pay.
                            </p>
                            <p>
                                We added features we actually needed: scheduling invoices for later, setting up
                                recurring invoices, and sorting everything by company so you can stay organized.
                            </p>
                            <p>
                                For businesses ready to level up, our Pro version includes a client payment portal
                                powered by PayGate. Your clients can pay directly from the invoice, and Illumi
                                automatically updates the status. No more chasing payments.
                            </p>
                            <p>
                                This isn't another bloated accounting system. It's just invoicing — done right.
                                For South African businesses, by South African entrepreneurs.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <div className="font-serif italic text-2xl text-white">The Illumi Team</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to simplify your invoicing?
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto mb-8">
                        Join thousands of South African businesses who've made invoicing effortless.
                        Start for free — no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5"
                        >
                            <Link href="/docs">View Docs</Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Start Free
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
