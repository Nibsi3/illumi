import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Invoice Template Analyzer | Illumi Resources",
    description: "Check whether your invoice template includes essential fields like invoice number, VAT, payment terms, and bank details.",
    alternates: {
        canonical: "/resources/template-analyzer",
    },
}

export default function TemplateAnalyzerLayout({ children }: { children: React.ReactNode }) {
    return children
}
