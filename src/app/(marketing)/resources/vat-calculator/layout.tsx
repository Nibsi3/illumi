import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "VAT Calculator (South Africa) | Illumi Resources",
    description: "Estimate VAT payable to SARS using revenue, expenses, and VAT rate. Built for South African freelancers and small businesses.",
    alternates: {
        canonical: "/resources/vat-calculator",
    },
}

export default function VatCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children
}
