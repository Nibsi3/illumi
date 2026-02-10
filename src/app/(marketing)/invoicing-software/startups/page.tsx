import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconRocket } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Software for Startups | Illumi South Africa",
    description: "Free invoicing software for South African startups. Scale from day one with professional invoicing, automated billing, and integrated payments. No upfront costs.",
    keywords: [
        "startup invoicing software",
        "invoicing for startups",
        "startup billing software",
        "free startup tools",
        "South African startup software",
        "new business invoicing",
    ],
    alternates: {
        canonical: "/invoicing-software/startups",
    },
}

const benefits = [
    "Free tier perfect for early stage",
    "Scale pricing as you grow",
    "Professional branding from day one",
    "Investor-ready financial reports",
    "Recurring billing for SaaS",
    "Multi-currency for global clients",
    "API for custom integrations",
    "Team collaboration built-in",
]

export default function StartupsPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconRocket className="h-4 w-4" />
                            For Startups
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Software for South African Startups
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Launch with professional invoicing from day one. Free to start, scales with your growth. 
                            Focus on building your product while we handle the billing.
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Create an Invoice — Free
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Built for Fast-Moving Teams</h2>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Launch Your Startup Right</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Professional invoicing without the enterprise price tag. Free forever on our starter plan.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create My First Invoice
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
