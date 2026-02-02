import { Metadata } from "next"

const competitorMeta: Record<string, { title: string; description: string }> = {
    xero: {
        title: "Illumi vs Xero | Best Invoice Software for South Africa?",
        description: "Compare Illumi and Xero for South African businesses. See which invoicing software offers better VAT compliance, ZAR pricing, and local payment options.",
    },
    sage: {
        title: "Illumi vs Sage | Best Invoice Software for South Africa?",
        description: "Compare Illumi and Sage for South African SMEs. Discover which invoicing solution is simpler, more affordable, and better suited for local businesses.",
    },
    "zoho-invoice": {
        title: "Illumi vs Zoho Invoice | Best Invoice Software for South Africa?",
        description: "Compare Illumi and Zoho Invoice for SA businesses. See why Illumi's local focus beats global tools for South African invoicing needs.",
    },
    quickbooks: {
        title: "Illumi vs QuickBooks | Best Invoice Software for South Africa?",
        description: "Compare Illumi and QuickBooks for South African businesses. Find out which invoicing software offers better local support, ZAR pricing, and PayGate integration.",
    },
}

export async function generateMetadata({ params }: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
    const { competitor } = await params
    const meta = competitorMeta[competitor]

    if (!meta) {
        return {
            title: "Comparison | Illumi",
            description: "Compare Illumi with other invoicing software for South African businesses.",
        }
    }

    return {
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: "website",
            url: `https://illumi.co.za/compare/${competitor}`,
        },
        twitter: {
            card: "summary_large_image",
            title: meta.title,
            description: meta.description,
        },
        alternates: {
            canonical: `https://illumi.co.za/compare/${competitor}`,
        },
    }
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
    return children
}
