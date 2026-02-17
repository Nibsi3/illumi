import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Free Invoicing Software for South Africa | Illumi",
    description: "Create professional invoices in ZAR with VAT. Send by email, accept online payments via PayFast, Yoco, Ozow. 2 months of Pro features free. Start in 2 minutes.",
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
        description: "Create professional invoices in ZAR. Accept online payments via PayFast, Yoco, Ozow. 2 months Pro free — no credit card required.",
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
        description: "Create professional invoices in ZAR. Accept online payments. 2 months Pro free.",
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
                "text": "Yes! Every new account gets 2 months of full Pro features completely free — no credit card required. After your trial, stay on the Free plan or subscribe to Pro for R200/month.",
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
    "description": "Create professional invoices in ZAR for South African businesses. VAT calculation, online payments via PayFast/Yoco/Ozow, expense tracking. 2 months Pro free.",
    "offers": [
        {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0.00",
            "priceCurrency": "ZAR",
            "availability": "https://schema.org/InStock",
            "description": "Unlimited invoices, client database, expense tracking, PDF exports - free plan available after trial.",
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
