import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconCheck, IconArrowRight, IconBriefcase } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoicing Software for Self-Employed | Illumi South Africa",
    description: "Free invoicing software designed for self-employed South Africans. Manage clients, track income, and stay organized. Perfect for consultants, coaches, and independent professionals.",
    keywords: [
        "self-employed invoicing",
        "invoicing for self-employed",
        "independent professional invoicing",
        "consultant invoicing software",
        "self-employed billing",
        "solo business invoicing",
    ],
    alternates: {
        canonical: "/invoicing-software/self-employed",
    },
}

const benefits = [
    "Professional client management",
    "Recurring invoice automation",
    "Income and expense tracking",
    "Tax-ready reports",
    "Online payment acceptance",
    "Time tracking integration",
    "Mobile invoicing on the go",
    "Cloud backup and sync",
]

export default function SelfEmployedPage() {
    return (
        <>
            <section className="relative pt-24 md:pt-32 pb-16 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-muted-foreground text-sm mb-6">
                            <IconBriefcase className="h-4 w-4" />
                            For Self-Employed
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Invoicing Software for Self-Employed Professionals
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Run your solo business like a pro. Create invoices, manage clients, track expenses, 
                            and stay on top of your finances - all in one place.
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Create My First Invoice
                                <IconArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Everything You Need to Run Solo</h2>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Business, Simplified</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Focus on your work, not paperwork. Free invoicing for self-employed South Africans.
                    </p>
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Invoicing Free
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
