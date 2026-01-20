import { WorkspaceProvider } from "@/lib/workspace-context"
import { SettingsProvider } from "@/lib/settings-context"

export default function InviteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <WorkspaceProvider>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </WorkspaceProvider>
    )
}
