import { AppSidebar } from "@/components/app-sidebar"
import { SettingsProvider } from "@/lib/settings-context"

export const dynamic = "force-dynamic"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SettingsProvider>
            <AppSidebar>
                {children}
            </AppSidebar>
        </SettingsProvider>
    )
}
