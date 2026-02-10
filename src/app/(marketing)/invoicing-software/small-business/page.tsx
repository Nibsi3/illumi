import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconBuildingStore } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Small Business Invoicing Software | Illumi South Africa",
    description: "Free invoicing software for South African small businesses. Professional invoices, team collaboration, client management, and online payments. Built for SMEs.",
    keywords: [
        "small business invoicing",
        "SME invoicing software",
        "small business billing",
        "invoicing for small business",
        "South African SME software",
        "business invoicing solution",
    ],
    alternates: {
        canonical: "/invoicing-software/small-business",
    },
}

const benefits = [
    "Team member access and roles",
    "Multi-client management",
    "Branded invoice templates",
    "Automated payment reminders",
    "Financial reporting dashboard",
    "PayFast and Yoco integration",
    "Expense categorization",
    "VAT-compliant invoices",
]

export default function SmallBusinessPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconBuildingStore className="h-4 w-4" />
                            For Small Businesses
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Software for South African Small Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Professional invoicing that grows with your business. Manage clients, collaborate with 
                            your team, and get paid faster with integrated online payments.
                        </p>
                        <Link href="/invoices/new">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Start Free Today
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Built for Growing Businesses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                                <IconCheck className="h-5 w-5 text-primary" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of SA Small Businesses</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Free to start, scales as you grow. No credit card required.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create My First Invoice
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
