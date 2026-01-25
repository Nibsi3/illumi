import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Late Payment Cost Calculator | Illumi Resources",
    description: "Estimate the cost of late-paying clients based on invoice value, payment delay, and your admin time.",
    alternates: {
        canonical: "/resources/late-payment-calculator",
    },
}

export default function LatePaymentCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children
}
