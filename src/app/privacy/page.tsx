import type { Metadata } from "next"

import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { MarketingHeader } from "@/components/marketing/marketing-header"

export const metadata: Metadata = {
    title: "Privacy Policy | Illumi",
    description: "Privacy Policy for Illumi (South Africa). Learn how we collect, use, and protect personal information.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-background text-foreground grainy-gradient">
            <MarketingHeader />
            {/* Hero Section */}
            <section className="relative py-24 pt-32 md:pt-40">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-white dark:bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-4xl px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    </div>
                </div>
            </section>
            <main className="mx-auto max-w-4xl px-6 pb-20">
                <div className="hidden"></div>
                <p className="mt-3 text-muted-foreground">
                    This Privacy Policy explains how Illumi ("we", "us", "our") collects, uses, shares and protects personal information.
                    It is intended to align with South African privacy principles, including the Protection of Personal Information Act (POPIA).
                </p>

                <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-foreground">1. Who we are</h2>
                        <p className="mt-2">Illumi is a web-based invoicing platform for South African businesses.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">2. Information we collect</h2>
                        <p className="mt-2">We may collect:</p>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Account details (name, email address, login credentials).</li>
                            <li>Workspace/business information (company name, address, VAT number, registration details where provided).</li>
                            <li>Client/customer details you add (e.g. contact person, email, billing address).</li>
                            <li>Invoice and payment-related metadata (invoice numbers, amounts, due dates, status).</li>
                            <li>Usage data (device/browser info, logs, and analytics events).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">3. How we use information</h2>
                        <p className="mt-2">We use information to:</p>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Provide and improve the service (creating invoices, sending emails, showing payment status).</li>
                            <li>Secure accounts and prevent fraud/abuse.</li>
                            <li>Provide support and respond to requests.</li>
                            <li>Process subscription billing and manage access to paid features.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">4. Legal basis / justification</h2>
                        <p className="mt-2">
                            We process personal information for legitimate business purposes, to perform our contract with you (providing the service),
                            to comply with legal obligations where applicable, and with consent where required.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">5. Sharing and third parties</h2>
                        <p className="mt-2">We may share information with service providers that help us operate Illumi, such as:</p>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Infrastructure and hosting providers.</li>
                            <li>Email delivery providers for sending invoice and verification emails.</li>
                            <li>Payment providers you choose to connect via PayGate (payment details are handled by the provider).</li>
                            <li>Analytics tools used to understand usage and improve performance.</li>
                        </ul>
                        <p className="mt-3">We do not sell personal information.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">6. Data retention</h2>
                        <p className="mt-2">
                            We retain personal information for as long as necessary to provide the service, meet legal/accounting obligations,
                            resolve disputes, and enforce agreements. You may request deletion, subject to legitimate retention requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">7. Security</h2>
                        <p className="mt-2">
                            We use reasonable administrative, technical, and physical safeguards designed to protect personal information.
                            No system is perfectly secure; you use the service at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">8. Your rights</h2>
                        <p className="mt-2">Subject to applicable law, you may request:</p>
                        <ul className="mt-3 list-disc pl-6 space-y-2">
                            <li>Access to personal information we hold about you.</li>
                            <li>Correction of inaccurate information.</li>
                            <li>Deletion, objection, or restriction of processing in certain cases.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">9. Cross-border transfers</h2>
                        <p className="mt-2">
                            Some service providers may store or process data outside South Africa. Where this happens, we take reasonable steps to ensure
                            appropriate protections are in place.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
                        <p className="mt-2">
                            For privacy questions or requests, contact us at <span className="text-foreground">info@illumi.co.za</span>.
                        </p>
                    </section>

                    <section className="text-muted-foreground text-sm border-t border-border pt-6">
                        <p>
                            This document is provided as a general policy template and should be reviewed by a qualified professional for your specific business.
                        </p>
                    </section>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
