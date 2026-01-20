import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        throw new Error(
            "Missing Supabase service role credentials. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and one of: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_ROLE_SECRET, SUPABASE_SERVICE_ROLE, SUPABASE_SERVICE_KEY, SERVICE_ROLE_KEY"
        )
    }

    return createServiceClient(url, serviceKey)
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null)
        const inviteId = body?.inviteId

        if (!inviteId || typeof inviteId !== 'string') {
            return NextResponse.json({ success: false, error: 'Missing inviteId' }, { status: 400 })
        }

        // Ensure user is logged in (cookie-based session)
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const userEmail = (user.email || '').toLowerCase().trim()
        if (!userEmail) {
            return NextResponse.json({ success: false, error: 'Unable to verify your email address.' }, { status: 400 })
        }

        const service = getServiceClient()

        const { data: row, error: rowError } = await service
            .from('workspace_members')
            .select('id, workspace_id, email, status')
            .eq('id', inviteId)
            .maybeSingle()

        if (rowError) {
            return NextResponse.json({ success: false, error: rowError.message }, { status: 500 })
        }

        if (!row) {
            return NextResponse.json({ success: false, error: 'This invite link is invalid or has expired.' }, { status: 404 })
        }

        const invitedEmail = (row.email || '').toLowerCase().trim()

        const { data: ws } = await service
            .from('workspaces')
            .select('name')
            .eq('id', row.workspace_id)
            .maybeSingle()

        const workspaceName = (ws as any)?.name || null

        if (invitedEmail && invitedEmail !== userEmail) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'You are signed in with a different email address than the one that was invited.',
                    invitedEmail,
                    userEmail,
                    workspaceId: row.workspace_id,
                    workspaceName,
                },
                { status: 403 }
            )
        }

        const patch: any = {}
        if (!invitedEmail) patch.email = userEmail
        if ((row.status || '').toLowerCase() !== 'active') patch.status = 'active'

        if (Object.keys(patch).length > 0) {
            const { error: updateError } = await service
                .from('workspace_members')
                .update(patch)
                .eq('id', inviteId)

            if (updateError) {
                return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
            }
        }

        return NextResponse.json(
            { success: true, workspaceId: row.workspace_id, workspaceName },
            { status: 200 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || 'Failed to accept invite.' },
            { status: 500 }
        )
    }
}
