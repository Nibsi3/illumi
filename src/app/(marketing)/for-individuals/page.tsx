import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconUser, IconDeviceMobile, IconClock, IconPigMoney } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Free Invoicing for Individuals | Personal Invoicing | Illumi",
    description: "Free invoicing software for individuals in South Africa. Perfect for freelancers, side hustlers, and anyone who needs to invoice professionally. No business registration required.",
    keywords: [
        "individual invoicing",
        "personal invoicing software",
        "freelancer invoicing free",
        "side hustle invoicing",
        "invoice as individual",
        "personal billing software",
    ],
    alternates: {
        canonical: "/for-individuals",
    },
}

const features = [
    {
        icon: IconPigMoney,
        title: "2 Months Pro Free",
        description: "No hidden fees, no credit card required. Get all Pro features free for 2 months.",
    },
    {
        icon: IconClock,
        title: "Ready in 60 Seconds",
        description: "Sign up and send your first invoice in under a minute. No complex setup required.",
    },
    {
        icon: IconDeviceMobile,
        title: "Invoice from Anywhere",
        description: "Create and send invoices from your phone, tablet, or computer. Works everywhere.",
    },
    {
        icon: IconUser,
        title: "No Company Needed",
        description: "Invoice using your personal details. Perfect for getting started before registering a business.",
    },
]

const useCases = [
    "Freelance work on the side",
    "Tutoring and teaching",
    "Photography gigs",
    "Consulting projects",
    "Creative services",
    "Handyman work",
    "Pet sitting",
    "Personal training",
]

export default function ForIndividualsPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconUser className="h-4 w-4" />
                            For Individuals
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Free Invoicing for Individuals
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            You don't need a registered company to invoice professionally. Whether it's a side hustle, 
                            freelance gig, or personal service - create polished invoices and get paid properly.
                        </p>
                        <Link href="/invoices/new">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Start Invoicing Free
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-4">
                            No credit card required. 2 months of Pro features free.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Why Individuals Love Illumi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="rounded-2xl border border-border bg-card p-8">
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Perfect For</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {useCases.map((useCase) => (
                            <div key={useCase} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                                <IconCheck className="h-5 w-5 text-primary" />
                                <span className="text-sm">{useCase}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Skills Deserve Professional Invoices</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Start invoicing today. It's free, it's easy, and it makes you look professional.
                    </p>
                    <Link href="/invoices/new">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Create Your First Invoice
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
