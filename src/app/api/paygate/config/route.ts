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

// Helper to mask a key for display (show first 8 and last 4 chars)
function maskKey(key: string): string {
    if (!key || key.length < 16) return key ? '••••••••' : ''
    return key.substring(0, 8) + '••••••••' + key.substring(key.length - 4)
}

// GET: Fetch paygate settings for a workspace (includes masked keys for display)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const workspaceId = searchParams.get('workspace_id')

        if (!workspaceId) {
            return NextResponse.json({ success: false, error: "Missing workspace_id" }, { status: 400 })
        }

        // Use user's auth to verify access
        const supabase = await createServerClient()
        const {
            data: { session },
        } = await supabase.auth.getSession()
        if (!session?.user) {
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

        // Fetch keys using service role (masked for display)
        const serviceClient = getServiceClient()
        const providerKeys: Record<string, any> = {}
        
        if (serviceClient && settings?.connected_providers?.length) {
            const providers = settings.connected_providers
            const { data: allKeys } = await serviceClient
                .from('workspace_paygate_keys')
                .select('provider, mode, key_name, key_value')
                .eq('workspace_id', workspaceId)
                .in('provider', providers)
                .in('mode', ['test', 'live'])

            for (const row of allKeys || []) {
                const provider = (row as any).provider as string
                const mode = (row as any).mode as 'test' | 'live'
                const keyName = (row as any).key_name as string
                const keyValue = (row as any).key_value as string

                const keys = (providerKeys[provider] ||= {})
                const prefix = mode === 'test' ? 'test' : 'live'

                if (keyName === 'merchant_id') keys[`${prefix}MerchantId`] = maskKey(keyValue)
                if (keyName === 'secret_key') keys[`${prefix}SecretKey`] = maskKey(keyValue)
                if (keyName === 'merchant_key') keys[`${prefix}MerchantKey`] = maskKey(keyValue)
                if (keyName === 'passphrase') keys[`${prefix}Passphrase`] = maskKey(keyValue)
                if (keyName === 'public_key') keys[`${prefix}PublicKey`] = maskKey(keyValue)
                if (keyName === 'site_code') keys[`${prefix}SiteCode`] = maskKey(keyValue)
                if (keyName === 'private_key') keys[`${prefix}PrivateKey`] = maskKey(keyValue)
                if (keyName === 'entity_id') keys[`${prefix}EntityId`] = maskKey(keyValue)
                if (keyName === 'access_token') keys[`${prefix}AccessToken`] = maskKey(keyValue)
                if (keyName === 'publishable_key') keys[`${prefix}PublishableKey`] = maskKey(keyValue)
            }
        }

        return NextResponse.json({
            success: true,
            settings: settings || {
                workspace_id: workspaceId,
                active_provider: 'payfast',
                test_mode: true,
                connected_providers: []
            },
            providerKeys
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

        // Verify user is owner or member of workspace
        const { data: workspace } = await supabase
            .from('workspaces')
            .select('id')
            .eq('id', workspace_id)
            .eq('owner_id', user.id)
            .maybeSingle()

        let membership = workspace
        if (!membership && user.email) {
            const { data: memberRow } = await supabase
                .from('workspace_members')
                .select('id')
                .eq('workspace_id', workspace_id)
                .eq('email', user.email)
                .eq('status', 'active')
                .maybeSingle()
            membership = memberRow
        }

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

            const add = (mode: 'test' | 'live', key_name: string, key_value: unknown) => {
                if (typeof key_value === 'string' && key_value.trim()) {
                    keyEntries.push({ workspace_id, provider, mode, key_name, key_value: key_value.trim() })
                }
            }

            // Backward compatible keys (used historically across providers)
            add('test', 'merchant_id', keys.testMerchantId)
            add('test', 'secret_key', keys.testSecretKey)
            add('live', 'merchant_id', keys.liveMerchantId)
            add('live', 'secret_key', keys.liveSecretKey)

            // Yoco: test/live public + secret
            add('test', 'public_key', keys.testPublicKey)
            add('test', 'secret_key', keys.testSecretKey || keys.testSecret)
            add('live', 'public_key', keys.livePublicKey)
            add('live', 'secret_key', keys.liveSecretKey || keys.liveSecret)

            // PayFast: merchant id + merchant key + optional passphrase (shared credentials)
            // We store them in *both* modes so other code that reads by mode still works.
            if (provider === 'payfast') {
                add('test', 'merchant_id', keys.merchantId || keys.liveMerchantId || keys.testMerchantId)
                add('live', 'merchant_id', keys.merchantId || keys.liveMerchantId || keys.testMerchantId)

                add('test', 'merchant_key', keys.merchantKey || keys.liveMerchantKey || keys.testMerchantKey)
                add('live', 'merchant_key', keys.merchantKey || keys.liveMerchantKey || keys.testMerchantKey)

                add('test', 'passphrase', keys.passphrase || keys.livePassphrase || keys.testPassphrase)
                add('live', 'passphrase', keys.passphrase || keys.livePassphrase || keys.testPassphrase)
            } else {
                // Other providers that use merchant_key/passphrase per mode
                add('test', 'merchant_key', keys.testMerchantKey)
                add('live', 'merchant_key', keys.liveMerchantKey)
                add('test', 'passphrase', keys.testPassphrase)
                add('live', 'passphrase', keys.livePassphrase)
            }

            // Ozow: test/live site code + private key
            add('test', 'site_code', keys.testSiteCode)
            add('test', 'private_key', keys.testPrivateKey)
            add('live', 'site_code', keys.liveSiteCode)
            add('live', 'private_key', keys.livePrivateKey)

            // Peach: test/live entity id + access token
            add('test', 'entity_id', keys.testEntityId)
            add('test', 'access_token', keys.testAccessToken)
            add('live', 'entity_id', keys.liveEntityId)
            add('live', 'access_token', keys.liveAccessToken)

            // Stripe: test/live publishable + secret
            add('test', 'publishable_key', keys.testPublishableKey)
            add('test', 'secret_key', keys.testSecretKey)
            add('live', 'publishable_key', keys.livePublishableKey)
            add('live', 'secret_key', keys.liveSecretKey)

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
