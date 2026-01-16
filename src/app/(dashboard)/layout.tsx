import { AppSidebar } from "@/components/app-sidebar"
import { SettingsProvider } from "@/lib/settings-context"

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
