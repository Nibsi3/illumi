import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

// Service role client for writing secrets (bypasses RLS)
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SERVICE_ROLE_KEY
    )
    if (!serviceKey) {
        throw new Error(
            "Missing Supabase service role key. Set one of: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_ROLE_SECRET, SUPABASE_SERVICE_ROLE, SUPABASE_SERVICE_KEY, SERVICE_ROLE_KEY"
        )
    }
    return createClient(url, serviceKey)
}

// GET: Fetch paygate settings for a workspace (public config only, keys are server-only)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const workspaceId = searchParams.get('workspace_id')

        if (!workspaceId) {
            return NextResponse.json({ success: false, error: "Missing workspace_id" }, { status: 400 })
        }

        // Use user's auth to verify access
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        // Fetch settings (RLS will enforce membership)
        const { data: settings, error } = await supabase
            .from('workspace_paygate_settings')
            .select('*')
            .eq('workspace_id', workspaceId)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('[Paygate Config GET] Error:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            settings: settings || {
                workspace_id: workspaceId,
                active_provider: 'payfast',
                test_mode: true,
                connected_providers: []
            }
        })
    } catch (error: any) {
        console.error('[Paygate Config GET] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// POST: Save paygate settings + keys for a workspace
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { workspace_id, provider, active_provider, test_mode, connected_providers, keys } = body

        if (!workspace_id) {
            return NextResponse.json({ success: false, error: "Missing workspace_id" }, { status: 400 })
        }

        // Verify user auth
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        // Verify user is member of workspace
        const { data: membership } = await supabase
            .from('workspace_members')
            .select('id')
            .eq('workspace_id', workspace_id)
            .eq('user_id', user.id)
            .single()

        if (!membership) {
            return NextResponse.json({ success: false, error: "Not a member of this workspace" }, { status: 403 })
        }

        // Use service role for writing (bypasses RLS for keys table)
        const serviceClient = getServiceClient()

        // Upsert settings
        const { error: settingsError } = await serviceClient
            .from('workspace_paygate_settings')
            .upsert({
                workspace_id,
                active_provider: active_provider || provider || 'payfast',
                test_mode: test_mode ?? true,
                connected_providers: connected_providers || [],
                updated_at: new Date().toISOString()
            }, { onConflict: 'workspace_id' })

        if (settingsError) {
            console.error('[Paygate Config POST] Settings error:', settingsError)
            return NextResponse.json({ success: false, error: settingsError.message }, { status: 500 })
        }

        // Upsert keys if provided
        if (keys && provider) {
            const keyEntries: { workspace_id: string; provider: string; mode: string; key_name: string; key_value: string }[] = []

            // Test keys
            if (keys.testMerchantId) {
                keyEntries.push({ workspace_id, provider, mode: 'test', key_name: 'merchant_id', key_value: keys.testMerchantId })
            }
            if (keys.testSecretKey) {
                keyEntries.push({ workspace_id, provider, mode: 'test', key_name: 'secret_key', key_value: keys.testSecretKey })
            }

            // Live keys
            if (keys.liveMerchantId) {
                keyEntries.push({ workspace_id, provider, mode: 'live', key_name: 'merchant_id', key_value: keys.liveMerchantId })
            }
            if (keys.liveSecretKey) {
                keyEntries.push({ workspace_id, provider, mode: 'live', key_name: 'secret_key', key_value: keys.liveSecretKey })
            }

            for (const entry of keyEntries) {
                const { error: keyError } = await serviceClient
                    .from('workspace_paygate_keys')
                    .upsert(entry, { onConflict: 'workspace_id,provider,mode,key_name' })

                if (keyError) {
                    console.error('[Paygate Config POST] Key error:', keyError)
                    return NextResponse.json({ success: false, error: `Failed to save key: ${keyError.message}` }, { status: 500 })
                }
            }
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('[Paygate Config POST] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// Helper: Get keys for a workspace+provider (used by generate-link internally)
export async function getWorkspacePaygateKeys(workspaceId: string, provider: string, mode: 'test' | 'live') {
    const serviceClient = getServiceClient()

    const { data: keys, error } = await serviceClient
        .from('workspace_paygate_keys')
        .select('key_name, key_value')
        .eq('workspace_id', workspaceId)
        .eq('provider', provider)
        .eq('mode', mode)

    if (error) {
        console.error('[getWorkspacePaygateKeys] Error:', error)
        return null
    }

    // Convert to object { merchant_id: '...', secret_key: '...' }
    const result: Record<string, string> = {}
    for (const row of keys || []) {
        result[row.key_name] = row.key_value
    }
    return result
}

// Helper: Get workspace settings (used by generate-link internally)
export async function getWorkspacePaygateSettings(workspaceId: string) {
    const serviceClient = getServiceClient()

    const { data, error } = await serviceClient
        .from('workspace_paygate_settings')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('[getWorkspacePaygateSettings] Error:', error)
        return null
    }

    return data || { active_provider: 'payfast', test_mode: true, connected_providers: [] }
}
