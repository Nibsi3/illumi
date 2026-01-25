import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Cash Flow Health Score Calculator | Illumi Resources",
    description: "Calculate a cash flow health score for your business and get actionable recommendations based on revenue, expenses, and cash reserves.",
    alternates: {
        canonical: "/resources/cash-flow-calculator",
    },
}

export default function CashFlowCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children
}
