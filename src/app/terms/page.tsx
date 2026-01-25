import type { Metadata } from "next"

import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { MarketingHeader } from "@/components/marketing/marketing-header"

export const metadata: Metadata = {
    title: "Terms of Service | Illumi",
    description: "Terms of Service for Illumi (South Africa). Month-to-month subscriptions and no-refund policy.",
}

export default function TermsPage() {
    return (
        <div className="bg-black text-white grainy-gradient">
            <MarketingHeader />
            {/* Hero Section */}
            <section className="relative py-24 pt-32 md:pt-40">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-black" />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-4xl px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    </div>
                </div>
            </section>
            <main className="mx-auto max-w-4xl px-6 pb-20">
                <div className="hidden"></div>
                <p className="mt-3 text-white/60">
                    These Terms of Service ("Terms") govern your use of Illumi (the "Service").
                    By accessing or using the Service, you agree to these Terms.
                    These Terms are intended to be interpreted under South African law, including principles in the Electronic Communications and Transactions Act (ECTA)
                    and, where applicable, the Consumer Protection Act (CPA).
                </p>

                <div className="mt-10 space-y-8 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-white">1. Accounts</h2>
                        <p className="mt-2">
                            You are responsible for maintaining the confidentiality of your login details and for all activity under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">2. The Service</h2>
                        <p className="mt-2">
                            Illumi provides tools for invoicing, expense tracking, and client-facing invoice payment links/portals.
                            Payment processing is performed by the payment provider you connect via PayGate.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">3. Subscription plans and billing</h2>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Paid plans are billed on a month-to-month basis unless otherwise stated.</li>
                            <li>You can cancel at any time. Cancellation stops future renewals.</li>
                            <li>Fees are payable in South African Rand (ZAR) unless otherwise stated.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">4. No refunds</h2>
                        <p className="mt-2">
                            To the maximum extent permitted by applicable law, subscription fees are non-refundable.
                            We do not provide refunds for partial months, unused time, or downgrades.
                        </p>
                        <p className="mt-3">
                            If any mandatory consumer rights apply to you under South African law, those rights are not excluded.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">5. Acceptable use</h2>
                        <p className="mt-2">You agree not to misuse the Service, including:</p>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Uploading unlawful content or infringing third-party rights.</li>
                            <li>Attempting to gain unauthorized access to systems or accounts.</li>
                            <li>Using the Service to send spam or abusive communications.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">6. Your data</h2>
                        <p className="mt-2">
                            You retain ownership of your data. You grant Illumi permission to process your data to provide the Service.
                            For more details, see our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">7. Availability and changes</h2>
                        <p className="mt-2">
                            We aim to keep the Service available, but do not guarantee uninterrupted operation.
                            We may modify or discontinue features from time to time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">8. Disclaimers and limitation of liability</h2>
                        <p className="mt-2">
                            The Service is provided on an “as is” basis. To the maximum extent permitted by law, Illumi disclaims all warranties.
                            Illumi will not be liable for indirect or consequential losses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">9. Governing law</h2>
                        <p className="mt-2">
                            These Terms are governed by the laws of South Africa. Any disputes will be handled in the appropriate South African forum.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">10. Contact</h2>
                        <p className="mt-2">
                            For questions about these Terms, contact <span className="text-white">info@illumi.co.za</span>.
                        </p>
                    </section>

                    <section className="text-white/50 text-sm border-t border-white/10 pt-6">
                        <p>
                            This document is provided as a general template and should be reviewed by a qualified professional for your specific business.
                        </p>
                    </section>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
