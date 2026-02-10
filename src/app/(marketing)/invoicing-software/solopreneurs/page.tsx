import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconUserCheck } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Software for Solopreneurs | Illumi South Africa",
    description: "Free invoicing software for solopreneurs in South Africa. Run your one-person business professionally with automated invoicing, expense tracking, and online payments.",
    keywords: [
        "solopreneur invoicing",
        "one person business invoicing",
        "solo entrepreneur software",
        "solopreneur billing",
        "individual business invoicing",
        "solo business tools",
    ],
    alternates: {
        canonical: "/invoicing-software/solopreneurs",
    },
}

const benefits = [
    "All-in-one business management",
    "Automated recurring invoices",
    "Client relationship tracking",
    "Expense and profit tracking",
    "Professional templates",
    "Mobile app for on-the-go",
    "Online payment collection",
    "Tax-ready reports",
]

export default function SolopreneursPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconUserCheck className="h-4 w-4" />
                            For Solopreneurs
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Software for Solopreneurs
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            You're the CEO, CFO, and everything in between. Illumi handles your invoicing so you 
                            can focus on what you do best. Professional tools for one-person powerhouses.
                        </p>
                        <Link href="/login">
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Your Virtual Back Office</h2>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">One Person, Unlimited Potential</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Free invoicing that makes your solo business look like a million bucks.
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
