import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Freelance Hourly Rate Calculator | Calculate Your Rate | Illumi",
    description: "Free hourly rate calculator for South African freelancers. Factor in expenses, billable hours, and profit margins to find your ideal rate. Perfect for contractors and consultants.",
    keywords: [
        "freelance hourly rate calculator",
        "freelancer rate calculator South Africa",
        "consulting rate calculator",
        "contractor hourly rate",
        "how much to charge freelance",
        "freelance pricing calculator",
        "South African freelancer rates",
        "calculate hourly rate",
    ],
    openGraph: {
        title: "Freelance Hourly Rate Calculator | Illumi",
        description: "Calculate your ideal hourly rate as a freelancer. Factor in expenses, billable hours, and profit margins.",
        type: "website",
    },
}

export default function HourlyRateCalculatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
