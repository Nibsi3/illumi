import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"

export default function StoryPage() {
    return (
        <div className="bg-black">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 text-center">
                        This is why we're building{" "}
                        <span className="font-serif italic">Illumi.</span>
                    </h1>
                </div>
            </section>

            {/* Story Content */}
            <section className="py-16">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    {/* Problem */}
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-white mb-6">Problem</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            After years of running our own businesses, we've always felt that something was missing
                            in how we manage our finances. The tools we used were clunky, expensive, or simply didn't
                            understand what small businesses really need.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            We spent hours every week on invoicing, chasing payments, reconciling receipts, and
                            trying to make sense of our financial data. It felt like we were working for our tools
                            instead of the other way around.
                        </p>
                    </div>

                    {/* Solution */}
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-white mb-6">Solution</h2>
                        <div className="space-y-6 text-white/70 leading-relaxed">
                            <p>
                                We built this because we needed it ourselves. As a small business owner in South Africa,
                                managing invoices, tracking expenses, and keeping everything organized felt like a
                                full-time job on its own.
                            </p>
                            <p>
                                Traditional accounting software was either too complex, too expensive, or simply not
                                designed for the way we work. We wanted something that just worked — something that felt
                                natural and didn't require a degree in accounting to use.
                            </p>
                            <p>
                                So we built it. A tool that handles invoicing, tracks your finances, and keeps everything
                                in one place. No unnecessary features, no bloat — just what you need to run your business
                                smoothly.
                            </p>
                            <p>
                                Illumi serves as a bridge between you and your accountant, allowing you to focus on the
                                work that matters. It's designed to be simple, fast, and reliable — because that's what
                                we needed, and we figured you might need it too.
                            </p>
                            <p>
                                We're not trying to replace your accountant or become your CFO. We're just here to make
                                the day-to-day easier, so you can spend less time on admin and more time growing your
                                business.
                            </p>
                            <p>
                                With users in mind, we've designed Illumi to work seamlessly with South African
                                regulations, banking systems, and business practices. Because local context matters, and
                                generic solutions often miss the mark.
                            </p>
                            <p>
                                This isn't just another SaaS product built in Silicon Valley and adapted for the world —
                                for us — Illumi is built for us, by us.
                            </p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5" />
                                <div>
                                    <div className="text-white/50 text-sm">The Illumi Team</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <div className="font-serif italic text-2xl text-white">The Illumi Team</div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to join us?
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto mb-8">
                        Start managing your business finances the way it should be — simple,
                        beautiful, and stress-free.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5"
                        >
                            Talk to founders
                        </Button>
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Get Started
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
