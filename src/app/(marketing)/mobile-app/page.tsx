import { Metadata } from "next"
import Link from "next/link"
import { IconBrandApple, IconBrandGooglePlay, IconBell, IconFileInvoice, IconReceipt, IconWallet, IconCheck } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Mobile Invoicing App | Illumi - Invoice on the Go",
    description: "Download the free Illumi mobile app for iOS and Android. Create invoices, track expenses, capture receipts, and manage your business from anywhere in South Africa.",
    keywords: [
        "free invoicing app",
        "mobile invoice app South Africa",
        "invoice app iOS",
        "invoice app Android",
        "freelancer mobile app",
        "small business app South Africa",
        "receipt scanner app",
        "expense tracker mobile",
    ],
    openGraph: {
        title: "Free Mobile Invoicing App | Illumi",
        description: "Create invoices, track expenses, and manage your business from your phone. Free for South African freelancers and small businesses.",
        type: "website",
    },
    alternates: {
        canonical: "/mobile-app",
    },
}

const features = [
    {
        icon: IconFileInvoice,
        title: "Create Invoices Anywhere",
        description: "Generate professional invoices on the go, even offline.",
    },
    {
        icon: IconBell,
        title: "Payment Notifications",
        description: "Get instant push notifications when clients pay.",
    },
    {
        icon: IconReceipt,
        title: "Receipt Scanner",
        description: "Snap photos of receipts and auto-extract expense data.",
    },
    {
        icon: IconWallet,
        title: "Track Expenses",
        description: "Log expenses instantly from your phone.",
    },
]

export default function MobileAppPage() {
    return (
        <div className="min-h-screen bg-background pt-28 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <IconBell className="w-4 h-4" />
                        Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Illumi Mobile App
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Take your invoicing business everywhere. Create invoices, track payments, 
                        and get notified instantly — all from your phone.
                    </p>

                    {/* App Store Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <button
                            disabled
                            className="flex items-center gap-3 px-6 py-3 bg-foreground/10 text-foreground rounded-xl opacity-60 cursor-not-allowed"
                        >
                            <IconBrandApple className="w-8 h-8" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase tracking-wider opacity-70">Coming to</div>
                                <div className="text-base font-semibold">App Store</div>
                            </div>
                        </button>
                        <button
                            disabled
                            className="flex items-center gap-3 px-6 py-3 bg-foreground/10 text-foreground rounded-xl opacity-60 cursor-not-allowed"
                        >
                            <IconBrandGooglePlay className="w-7 h-7" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase tracking-wider opacity-70">Coming to</div>
                                <div className="text-base font-semibold">Google Play</div>
                            </div>
                        </button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Want to be notified when the app launches?{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                            Join the waitlist
                        </Link>
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="p-6 rounded-2xl border border-border bg-card"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* What you'll get */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        What's included in the mobile app
                    </h2>
                    <div className="inline-flex flex-col items-start gap-3 text-left">
                        {[
                            "Full invoice creation and sending",
                            "Push notifications for payments",
                            "Offline mode for on-site work",
                            "Receipt photo capture",
                            "Client management",
                            "Expense tracking",
                            "Sync with web dashboard",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <IconCheck className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                        Can't wait? Use Illumi on your mobile browser right now.
                    </p>
                    <Link
                        href="/invoices/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create an Invoice Now
                    </Link>
                </div>
            </div>
        </div>
    )
}
