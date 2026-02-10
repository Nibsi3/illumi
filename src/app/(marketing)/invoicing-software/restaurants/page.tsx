import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconToolsKitchen2 } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Software for Restaurants | Illumi South Africa",
    description: "Free invoicing software for South African restaurants and food businesses. Invoice suppliers, manage catering orders, and track expenses. Perfect for cafes, caterers, and food trucks.",
    keywords: [
        "restaurant invoicing software",
        "catering invoicing",
        "food business invoicing",
        "cafe billing software",
        "restaurant billing South Africa",
        "food truck invoicing",
    ],
    alternates: {
        canonical: "/invoicing-software/restaurants",
    },
}

const benefits = [
    "Supplier invoice management",
    "Catering order invoicing",
    "Event billing and deposits",
    "Expense tracking by category",
    "Multiple payment methods",
    "Mobile invoicing for events",
    "Recurring supplier payments",
    "Profit margin tracking",
]

export default function RestaurantsPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconToolsKitchen2 className="h-4 w-4" />
                            For Restaurants
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Software for Restaurants & Food Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            From catering invoices to supplier management, handle all your restaurant's billing needs. 
                            Perfect for cafes, caterers, food trucks, and hospitality businesses.
                        </p>
                        <Link href="/invoices/new">
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Built for Food Service</h2>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Focus on the Food, Not the Paperwork</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Free invoicing for restaurants and food businesses across South Africa.
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
