import { AppSidebar } from "@/components/app-sidebar"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { MobileAppPrompt } from "@/components/mobile-app-prompt"
import { SettingsProvider } from "@/lib/settings-context"
import { WorkspaceProvider } from "@/lib/workspace-context"
import { QueryProvider } from "@/lib/query-provider"

export const dynamic = "force-dynamic"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <QueryProvider>
            <WorkspaceProvider>
                <SettingsProvider>
                    <AppSidebar>
                        <AnalyticsTracker />
                        <MobileAppPrompt />
                        {children}
                    </AppSidebar>
                </SettingsProvider>
            </WorkspaceProvider>
        </QueryProvider>
    )
}

