import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Free Percentage Calculator | Calculate Percentages Online | Illumi",
    description: "Free online percentage calculator. Calculate what percent one number is of another, find percentage changes, or calculate X% of any value. Perfect for business calculations.",
    keywords: [
        "percentage calculator",
        "percent calculator",
        "calculate percentage",
        "percentage change calculator",
        "discount calculator",
        "markup calculator",
        "percentage increase calculator",
        "percentage decrease calculator",
        "free percentage calculator",
    ],
    openGraph: {
        title: "Free Percentage Calculator | Illumi",
        description: "Calculate percentages instantly. Find what percentage one number is of another, calculate percentage changes, or find a percentage of any value.",
        type: "website",
    },
}

export default function PercentageCalculatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
