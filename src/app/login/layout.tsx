import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login | Illumi",
    description: "Sign in to your Illumi workspace to create invoices, track expenses, and manage clients.",
    alternates: {
        canonical: "/login",
    },
    robots: {
        index: false,
        follow: false,
    },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children
}
