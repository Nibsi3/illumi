import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconBuildingSkyscraper } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Software for Hotels | Illumi South Africa",
    description: "Free invoicing software for South African hotels and hospitality businesses. Manage guest billing, corporate accounts, and event invoicing. Perfect for B&Bs, lodges, and guesthouses.",
    keywords: [
        "hotel invoicing software",
        "hospitality invoicing",
        "guest billing software",
        "B&B invoicing South Africa",
        "lodge billing software",
        "guesthouse invoicing",
    ],
    alternates: {
        canonical: "/invoicing-software/hotels",
    },
}

const benefits = [
    "Guest and corporate billing",
    "Event and conference invoicing",
    "Deposit and balance tracking",
    "Multi-room booking invoices",
    "Recurring corporate accounts",
    "Professional branded invoices",
    "Online payment collection",
    "Expense tracking by department",
]

export default function HotelsPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconBuildingSkyscraper className="h-4 w-4" />
                            For Hotels
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Software for Hotels & Hospitality
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Professional invoicing for the hospitality industry. Manage guest billing, corporate accounts, 
                            and event invoicing. Perfect for hotels, B&Bs, lodges, and guesthouses.
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Start Free
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Built for Hospitality</h2>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Elevate Your Guest Experience</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Professional invoicing that matches your hospitality standards. Free to start.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Get Started Free
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
