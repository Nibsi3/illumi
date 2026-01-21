import type { Metadata } from "next"

import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { MarketingHeader } from "@/components/marketing/marketing-header"

export const metadata: Metadata = {
    title: "Terms and Conditions | Illumi",
    description: "Terms and Conditions for Illumi (South Africa). Month-to-month subscriptions and no-refund policy.",
}

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-black text-white">
            <MarketingHeader />
            <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
                <h1 className="text-4xl font-bold tracking-tight">Terms and Conditions</h1>
                <p className="mt-3 text-white/60">
                    These Terms and Conditions govern your use of Illumi. They are intended to be interpreted in accordance with South African law,
                    including principles in the Electronic Communications and Transactions Act (ECTA) and, where applicable, the Consumer Protection Act (CPA).
                </p>

                <div className="mt-10 space-y-8 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-white">1. Month-to-month subscription</h2>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Subscriptions are billed month-to-month unless otherwise stated.</li>
                            <li>You can cancel at any time. Cancellation stops future renewals.</li>
                            <li>Access continues until the end of the current billing period.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">2. No refunds</h2>
                        <p className="mt-2">
                            To the maximum extent permitted by applicable law, subscription fees are non-refundable. We do not provide refunds for partial months,
                            unused time, or downgrades.
                        </p>
                        <p className="mt-3">
                            If any mandatory consumer rights apply to you under South African law, those rights are not excluded.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">3. Payment providers</h2>
                        <p className="mt-2">
                            Online payments are processed by the payment provider you connect via PayGate. The provider may have its own terms and policies.
                            Illumi does not store full card details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">4. Acceptable use</h2>
                        <p className="mt-2">You agree not to misuse the Service, including:</p>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Sending unlawful, misleading, or abusive communications.</li>
                            <li>Uploading content that infringes third-party rights.</li>
                            <li>Attempting to gain unauthorized access to any system or account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">5. Contact</h2>
                        <p className="mt-2">
                            Questions can be sent to <span className="text-white">info@illumi.co.za</span>.
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
