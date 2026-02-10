import { Metadata } from "next"
import { notFound } from "next/navigation"

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

export default function MobileAppPage() {
    notFound()
    return null
}
