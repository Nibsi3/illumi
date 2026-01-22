import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"

export default function IntegrationsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <MarketingHeader />
            <main className="relative z-10">
                {children}
            </main>
            <MarketingFooter />
        </div>
    )
}
