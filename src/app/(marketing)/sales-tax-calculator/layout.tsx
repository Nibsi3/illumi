import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Free Sales Tax Calculator | VAT Calculator South Africa | Illumi",
    description: "Free online sales tax and VAT calculator for South Africa. Instantly add or remove 15% VAT from any amount. Perfect for freelancers, contractors, and small businesses.",
    keywords: [
        "sales tax calculator",
        "VAT calculator South Africa",
        "15% VAT calculator",
        "add VAT calculator",
        "remove VAT calculator",
        "South African tax calculator",
        "invoice tax calculator",
        "freelancer VAT calculator",
        "small business tax calculator",
    ],
    openGraph: {
        title: "Free Sales Tax Calculator | Illumi",
        description: "Instantly calculate VAT and sales tax for your invoices. Add or remove 15% VAT with our free calculator.",
        type: "website",
    },
}

export default function SalesTaxCalculatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
