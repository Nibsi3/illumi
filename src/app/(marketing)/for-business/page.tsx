import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconBuilding, IconUsers, IconChartBar, IconShieldCheck } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Software for Businesses | Illumi South Africa",
    description: "Professional invoicing software for South African businesses. Team collaboration, advanced reporting, client management, and integrated payments. Scale from startup to enterprise.",
    keywords: [
        "business invoicing software",
        "professional invoicing",
        "company billing software",
        "B2B invoicing",
        "corporate invoicing South Africa",
        "enterprise invoicing",
    ],
    alternates: {
        canonical: "/for-business",
    },
}

const features = [
    {
        icon: IconUsers,
        title: "Team Collaboration",
        description: "Add team members with role-based permissions. Collaborate on invoices and client management.",
    },
    {
        icon: IconChartBar,
        title: "Advanced Reporting",
        description: "Financial dashboards, revenue forecasting, and exportable reports for stakeholders.",
    },
    {
        icon: IconShieldCheck,
        title: "Enterprise Security",
        description: "Bank-level encryption, audit logs, and compliance with South African data protection laws.",
    },
    {
        icon: IconBuilding,
        title: "Multi-Workspace",
        description: "Manage multiple business entities or departments from a single account.",
    },
]

const benefits = [
    "Unlimited team members",
    "Custom approval workflows",
    "API and integrations",
    "Priority support",
    "Custom branding",
    "Advanced automation",
    "Bulk operations",
    "Dedicated account manager",
]

export default function ForBusinessPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconBuilding className="h-4 w-4" />
                            For Businesses
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Professional Invoicing for South African Businesses
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            From growing SMEs to established enterprises, Illumi provides the tools you need to 
                            manage invoicing at scale. Team collaboration, advanced reporting, and enterprise security.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start Free Trial
                                    <IconArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Enterprise-Ready Features</h2>
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Business Plan Includes</h2>
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

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Scale Your Invoicing?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join leading South African businesses using Illumi for professional invoicing.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/login">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
