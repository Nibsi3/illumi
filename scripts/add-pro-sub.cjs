// Add Pro subscription - CommonJS version
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Load .env.local first, then .env
const envFiles = ['.env.local', '.env']
for (const envFile of envFiles) {
    const envPath = path.join(__dirname, '..', envFile)
    if (!fs.existsSync(envPath)) continue
    const envContent = fs.readFileSync(envPath, 'utf8')
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex === -1) continue
        const key = trimmed.slice(0, eqIndex).trim()
        let value = trimmed.slice(eqIndex + 1).trim()
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
        }
        if (!process.env[key]) {
            process.env[key] = value
        }
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
    console.error('Missing env vars. URL:', !!supabaseUrl, 'Key:', !!serviceKey)
    process.exit(1)
}

const workspaceId = process.argv[2]
if (!workspaceId) {
    console.error('Usage: node scripts/add-pro-sub.cjs <workspace_id>')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function run() {
    console.log('Adding Pro subscription for workspace:', workspaceId)

    const { data: ws, error: wsErr } = await supabase
        .from('workspaces')
        .select('id, name, owner_id')
        .eq('id', workspaceId)
        .single()

    if (wsErr) {
        console.error('Workspace error:', wsErr)
        process.exit(1)
    }

    console.log('Workspace:', ws.name, 'Owner:', ws.owner_id)

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
            workspace_id: workspaceId,
            user_id: ws.owner_id,
            tier: 'pro',
            status: 'active',
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            updated_at: now.toISOString(),
        }, { onConflict: 'workspace_id' })
        .select()

    if (error) {
        console.error('Subscription error:', error)
        process.exit(1)
    }

    console.log('✓ Pro subscription added!')
    console.log(data)
}

run()
