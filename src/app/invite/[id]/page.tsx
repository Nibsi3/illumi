"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

export default function InviteAcceptPage() {
    const params = useParams()
    const router = useRouter()
    const inviteId = params.id as string
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [workspaceName, setWorkspaceName] = useState<string | null>(null)

    useEffect(() => {
        const run = async () => {
            try {
                if (!inviteId) return

                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.replace(`/login?next=${encodeURIComponent(`/invite/${inviteId}`)}`)
                    return
                }

                const res = await fetch('/api/invite/accept', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inviteId }),
                })

                const json = await res.json().catch(() => null)

                if (!res.ok || !json?.success) {
                    if (json?.workspaceName) {
                        setWorkspaceName(json.workspaceName)
                    }
                    if (json?.invitedEmail && json?.userEmail) {
                        setError(`${json?.error || 'Failed to accept invite.'} (Invited: ${json.invitedEmail} • Signed in: ${json.userEmail})`)
                    } else {
                        setError(json?.error || 'Failed to accept invite. Please try again.')
                    }
                    return
                }

                if (!json?.workspaceId) {
                    setError('Failed to accept invite. Please try again.')
                    return
                }

                if (json?.workspaceName) {
                    setWorkspaceName(json.workspaceName)
                }

                localStorage.setItem('activeWorkspaceId', json.workspaceId)
                setSuccess(true)

                setTimeout(() => {
                    router.replace('/overview')
                }, 600)
            } catch (e: any) {
                setError(e?.message || 'Failed to accept invite. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        run()
    }, [inviteId, router, supabase])

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <Card className="w-full max-w-lg bg-[#121212] border-white/10 text-white">
                <CardHeader>
                    <CardTitle className="text-xl">Workspace Invite</CardTitle>
                    <CardDescription className="text-neutral-400">
                        {workspaceName ? `Accepting your invitation to ${workspaceName}…` : 'Accepting your invitation…'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-3 text-neutral-300">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Verifying invite</span>
                        </div>
                    ) : error ? (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-red-400">
                                <AlertCircle className="h-5 w-5 mt-0.5" />
                                <div>
                                    <div className="font-semibold">Invite not accepted</div>
                                    <div className="text-sm text-neutral-400 mt-1">{error}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    onClick={async () => {
                                        try {
                                            await supabase.auth.signOut()
                                        } catch {
                                            // ignore
                                        }
                                        router.replace(`/login?next=${encodeURIComponent(`/invite/${inviteId}`)}`)
                                    }}
                                >
                                    Switch account
                                </Button>
                            </div>
                        </div>
                    ) : success ? (
                        <div className="flex items-start gap-3 text-emerald-400">
                            <CheckCircle2 className="h-5 w-5 mt-0.5" />
                            <div>
                                <div className="font-semibold">Invite accepted</div>
                                <div className="text-sm text-neutral-400 mt-1">{workspaceName ? `Redirecting you to ${workspaceName}…` : 'Redirecting you to the workspace…'}</div>
                            </div>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    )
}
