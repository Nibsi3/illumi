import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Free Invoicing Software for South Africa | Illumi",
    description: "Create professional invoices in ZAR with VAT. Send by email, accept online payments via PayFast, Yoco, Ozow. Free forever for freelancers and small businesses. Start in 2 minutes.",
    keywords: [
        "invoice software South Africa",
        "free invoicing app",
        "invoice generator ZAR",
        "online invoice payments",
        "PayFast invoice",
        "Yoco invoice",
        "VAT invoice South Africa",
        "freelancer invoicing",
        "small business invoicing",
        "professional invoice template",
        "get paid online South Africa",
        "recurring invoices",
        "client payment portal",
    ],
    openGraph: {
        title: "Free Invoicing Software for South Africa | Illumi",
        description: "Create professional invoices in ZAR. Accept online payments via PayFast, Yoco, Ozow. Free forever — no credit card required.",
        type: "website",
        locale: "en_ZA",
        siteName: "Illumi",
        images: [
            {
                url: "/og-image-invoicing.png",
                width: 1200,
                height: 630,
                alt: "Illumi - Professional Invoicing for South African Businesses",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Invoicing Software for South Africa | Illumi",
        description: "Create professional invoices in ZAR. Accept online payments. Free forever.",
        images: ["/og-image-invoicing.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/landing-page",
    },
}

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Is Illumi really free to use?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our Free plan includes unlimited invoices, client database, expense tracking, email sending, and PDF exports - free forever. No credit card required to start.",
            },
        },
        {
            "@type": "Question",
            "name": "How do I accept online payments from clients?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pro users can connect South African payment providers like PayFast, Yoco, Ozow, or PayStack through our PayGate feature. Once connected, a 'Pay Now' button appears on every invoice.",
            },
        },
        {
            "@type": "Question",
            "name": "Does Illumi support VAT for South African businesses?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. Illumi is built specifically for South African businesses. Set your VAT rate to 15% (or any custom rate) in settings, and invoices will automatically calculate and display VAT.",
            },
        },
        {
            "@type": "Question",
            "name": "Can I customize invoices with my business logo?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Even on the Free plan, you can upload your business logo to appear on all invoices. Pro users can also remove the 'Powered by Illumi' branding.",
            },
        },
    ],
}

const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Illumi - Free Invoice Software for South Africa",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Create professional invoices in ZAR for South African businesses. VAT calculation, online payments via PayFast/Yoco/Ozow, expense tracking. Free forever.",
    "offers": [
        {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0.00",
            "priceCurrency": "ZAR",
            "availability": "https://schema.org/InStock",
            "description": "Unlimited invoices, client database, expense tracking, PDF exports - free forever.",
        },
        {
            "@type": "Offer",
            "name": "Pro Plan",
            "price": "200.00",
            "priceCurrency": "ZAR",
            "availability": "https://schema.org/InStock",
            "description": "PayGate integration, recurring invoices, client payment portal, remove branding.",
        },
    ],
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2500",
        "bestRating": "5",
        "worstRating": "1",
    },
    "featureList": [
        "Unlimited professional invoices",
        "ZAR currency with VAT support",
        "Email invoice delivery",
        "Online payments (PayFast, Yoco, Ozow)",
        "Client management",
        "Expense tracking",
        "PDF and CSV export",
        "Recurring invoices",
    ],
}

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Illumi",
    "url": "https://illumi.co.za",
    "logo": "https://illumi.co.za/logo.png",
    "description": "Professional invoicing software for South African businesses",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "ZA",
    },
}

export default function LandingPageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            {children}
        </>
    )
}
