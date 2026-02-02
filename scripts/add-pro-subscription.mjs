// Manually add a Pro subscription for a workspace
// Usage:
//   node scripts/add-pro-subscription.mjs <workspace_id>
//
// Example:
//   node scripts/add-pro-subscription.mjs 0b31de00-650c-437b-b99e-55e1627890c5

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env file manually
const __dirname = dirname(fileURLToPath(import.meta.url))
const envFiles = ['.env.local', '.env']
for (const envFile of envFiles) {
    const envPath = resolve(__dirname, '..', envFile)
    try {
        const envContent = readFileSync(envPath, 'utf8')
        console.log(`Loaded ${envFile}`)
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('#')) continue
            const eqIndex = trimmed.indexOf('=')
            if (eqIndex === -1) continue
            const key = trimmed.slice(0, eqIndex).trim()
            let value = trimmed.slice(eqIndex + 1).trim()
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1)
            }
            if (!process.env[key]) {
                process.env[key] = value
            }
        }
    } catch (e) {
        // File doesn't exist, try next
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_SECRET || process.env.SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
    process.exit(1)
}

const workspaceId = process.argv[2]
if (!workspaceId) {
    console.error('Usage: node scripts/add-pro-subscription.mjs <workspace_id>')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function addProSubscription() {
    console.log(`Adding Pro subscription for workspace: ${workspaceId}`)

    // Get workspace to find owner
    const { data: workspace, error: wsError } = await supabase
        .from('workspaces')
        .select('id, name, owner_id')
        .eq('id', workspaceId)
        .single()

    if (wsError || !workspace) {
        console.error('Workspace not found:', wsError?.message)
        process.exit(1)
    }

    console.log(`Workspace: ${workspace.name}`)
    console.log(`Owner ID: ${workspace.owner_id}`)

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 year from now

    const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
            workspace_id: workspaceId,
            user_id: workspace.owner_id,
            tier: 'pro',
            status: 'active',
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            updated_at: now.toISOString(),
        }, { onConflict: 'workspace_id' })
        .select()

    if (error) {
        console.error('Failed to add subscription:', error)
        process.exit(1)
    }

    console.log('✓ Pro subscription added successfully!')
    console.log('Subscription:', data)
}

addProSubscription().catch(err => {
    console.error('Error:', err)
    process.exit(1)
})
