import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Invoice Payment Predictor | Illumi Resources",
    description: "Predict when an invoice is likely to be paid based on industry, client size, payment terms, and relationship.",
    alternates: {
        canonical: "/resources/payment-predictor",
    },
}

export default function PaymentPredictorLayout({ children }: { children: React.ReactNode }) {
    return children
}
