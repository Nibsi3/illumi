import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact | Illumi",
    description: "Contact Illumi support. Get help with invoicing, payments, and account questions — response within 1–2 business days.",
    alternates: {
        canonical: "/contact",
    },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
