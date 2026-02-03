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

        // Verify user is owner or active member of workspace
        const user = session.user
        const { data: workspace } = await supabase
            .from('workspaces')
            .select('id')
            .eq('id', workspaceId)
            .eq('owner_id', user.id)
            .maybeSingle()

        let membership = workspace
        if (!membership && user.email) {
            const userEmail = (user.email || '').toLowerCase().trim()
            const { data: memberRow } = await supabase
                .from('workspace_members')
                .select('id')
                .eq('workspace_id', workspaceId)
                .eq('email', userEmail)
                .eq('status', 'active')
                .maybeSingle()
            membership = memberRow
        }

        if (!membership) {
            return NextResponse.json({ success: false, error: 'Not a member of this workspace' }, { status: 403 })
        }

        // Use service role to fetch settings (bypasses RLS issues)
        const serviceClient = getServiceClient()
        const { data: settings, error } = await serviceClient
            .from('workspace_paygate_settings')
            .select('*')
            .eq('workspace_id', workspaceId)
            .single()

        console.log('[Paygate Config GET] workspaceId:', workspaceId, 'settings:', settings, 'test_mode:', settings?.test_mode)

        if (error && error.code !== 'PGRST116') {
            console.error('[Paygate Config GET] Error:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        // Fetch keys using service role (return actual keys so users can see/edit them)
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

                // Return actual keys (not masked) so users can see and edit them
                if (keyName === 'merchant_id') keys[`${prefix}MerchantId`] = keyValue
                if (keyName === 'secret_key') keys[`${prefix}SecretKey`] = keyValue
                if (keyName === 'merchant_key') keys[`${prefix}MerchantKey`] = keyValue
                if (keyName === 'passphrase') keys[`${prefix}Passphrase`] = keyValue
                if (keyName === 'public_key') keys[`${prefix}PublicKey`] = keyValue
                if (keyName === 'site_code') keys[`${prefix}SiteCode`] = keyValue
                if (keyName === 'private_key') keys[`${prefix}PrivateKey`] = keyValue
                if (keyName === 'entity_id') keys[`${prefix}EntityId`] = keyValue
                if (keyName === 'access_token') keys[`${prefix}AccessToken`] = keyValue
                if (keyName === 'publishable_key') keys[`${prefix}PublishableKey`] = keyValue
                if (keyName === 'client_id') keys[`${prefix}ClientId`] = keyValue
                if (keyName === 'client_secret') keys[`${prefix}ClientSecret`] = keyValue
                if (keyName === 'service_key') keys[`${prefix}ServiceKey`] = keyValue
                if (keyName === 'api_key') keys[`${prefix}ApiKey`] = keyValue
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
        console.log('[Paygate Config POST] Saving settings:', { workspace_id, active_provider, test_mode, connected_providers })
        
        const { error: settingsError } = await serviceClient
            .from('workspace_paygate_settings')
            .upsert({
                workspace_id,
                active_provider: active_provider || provider || 'payfast',
                test_mode: test_mode === false ? false : (test_mode === true ? true : true),
                connected_providers: connected_providers || [],
                updated_at: new Date().toISOString()
            }, { onConflict: 'workspace_id' })

        if (settingsError) {
            console.error('[Paygate Config POST] Settings error:', settingsError)
            return NextResponse.json({ success: false, error: settingsError.message }, { status: 500 })
        }
        
        console.log('[Paygate Config POST] Settings saved successfully, test_mode:', test_mode)

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

            // PayFast: separate test and live merchant id + merchant key + optional passphrase
            if (provider === 'payfast') {
                add('test', 'merchant_id', keys.testMerchantId || keys.merchantId)
                add('live', 'merchant_id', keys.liveMerchantId || keys.merchantId)

                add('test', 'merchant_key', keys.testMerchantKey || keys.merchantKey)
                add('live', 'merchant_key', keys.liveMerchantKey || keys.merchantKey)

                add('test', 'passphrase', keys.passphrase || keys.testPassphrase)
                add('live', 'passphrase', keys.passphrase || keys.livePassphrase)
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

            // Stitch: test/live client_id + client_secret
            add('test', 'client_id', keys.testClientId)
            add('test', 'client_secret', keys.testClientSecret)
            add('live', 'client_id', keys.liveClientId)
            add('live', 'client_secret', keys.liveClientSecret)

            // Netcash: test/live service_key + api_key
            add('test', 'service_key', keys.testServiceKey)
            add('test', 'api_key', keys.testApiKey)
            add('live', 'service_key', keys.liveServiceKey)
            add('live', 'api_key', keys.liveApiKey)

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
