// Backfill script: Add workspace owners to workspace_members table
// Run this once to fix existing workspaces where owner is not in workspace_members
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/backfill-workspace-owners.mjs
//
// Or if you have a .env file in the project root:
//   node --env-file=.env scripts/backfill-workspace-owners.mjs

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_SECRET || process.env.SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function backfillOwners() {
    console.log('Fetching all workspaces...')

    // Get all workspaces with owner info
    const { data: workspaces, error: wsError } = await supabase
        .from('workspaces')
        .select('id, name, owner_id')

    if (wsError) {
        console.error('Failed to fetch workspaces:', wsError)
        process.exit(1)
    }

    console.log(`Found ${workspaces.length} workspaces`)

    // Get owner emails from auth.users (need service role for this)
    const ownerIds = [...new Set(workspaces.map(w => w.owner_id).filter(Boolean))]
    
    console.log(`Fetching ${ownerIds.length} unique owner emails...`)

    const ownerEmails = {}
    for (const ownerId of ownerIds) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(ownerId)
        if (userError) {
            console.warn(`  Could not fetch user ${ownerId}:`, userError.message)
            continue
        }
        if (userData?.user?.email) {
            ownerEmails[ownerId] = userData.user.email.toLowerCase().trim()
        }
    }

    console.log(`Resolved ${Object.keys(ownerEmails).length} owner emails`)

    // Get existing workspace_members to avoid duplicates
    const { data: existingMembers, error: memError } = await supabase
        .from('workspace_members')
        .select('workspace_id, email')

    if (memError) {
        console.error('Failed to fetch existing members:', memError)
        process.exit(1)
    }

    const existingSet = new Set(
        (existingMembers || []).map(m => `${m.workspace_id}:${(m.email || '').toLowerCase().trim()}`)
    )

    console.log(`Found ${existingMembers?.length || 0} existing workspace_members rows`)

    // Insert missing owner memberships
    let added = 0
    let skipped = 0
    let failed = 0

    for (const ws of workspaces) {
        const ownerEmail = ownerEmails[ws.owner_id]
        if (!ownerEmail) {
            console.warn(`  Skipping workspace "${ws.name}" (${ws.id}): no owner email found`)
            skipped++
            continue
        }

        const key = `${ws.id}:${ownerEmail}`
        if (existingSet.has(key)) {
            console.log(`  ✓ Owner already in workspace_members: "${ws.name}"`)
            skipped++
            continue
        }

        const { error: insertError } = await supabase
            .from('workspace_members')
            .upsert({
                workspace_id: ws.id,
                user_id: ws.owner_id,
                email: ownerEmail,
                role: 'owner',
                status: 'active',
                joined_at: new Date().toISOString(),
            }, { onConflict: 'workspace_id,email' })

        if (insertError) {
            console.error(`  ✗ Failed to add owner to "${ws.name}":`, insertError.message)
            failed++
        } else {
            console.log(`  + Added owner ${ownerEmail} to "${ws.name}"`)
            added++
        }
    }

    console.log('')
    console.log('=== Summary ===')
    console.log(`Added:   ${added}`)
    console.log(`Skipped: ${skipped}`)
    console.log(`Failed:  ${failed}`)
}

backfillOwners().catch(err => {
    console.error('Backfill failed:', err)
    process.exit(1)
})
