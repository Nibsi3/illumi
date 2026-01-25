import { AppSidebar } from "@/components/app-sidebar"
import { AnalyticsTracker } from "@/components/analytics-tracker"
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
                        {children}
                    </AppSidebar>
                </SettingsProvider>
            </WorkspaceProvider>
        </QueryProvider>
    )
}

