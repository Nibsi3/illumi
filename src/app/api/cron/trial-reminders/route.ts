import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

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
        throw new Error("Missing Supabase service role key")
    }
    return createServiceClient(url, serviceKey)
}

export async function GET(req: Request) {
    try {
        const cronSecret = process.env.CRON_SECRET
        const authHeader = req.headers.get("authorization")

        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        const service = getServiceClient()
        const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.illumi.co.za"
        const now = new Date()

        // Fetch all workspaces with their owner info
        const { data: workspaces, error: wsError } = await service
            .from('workspaces')
            .select('id, owner_id, created_at, trial_started_at')

        if (wsError) {
            console.error('[Trial Reminders] Error fetching workspaces:', wsError)
            return NextResponse.json(
                { success: false, error: wsError.message },
                { status: 500 }
            )
        }

        let remindersSent = 0
        let errors = 0

        for (const ws of (workspaces || [])) {
            // Calculate trial end date
            const trialStart = ws.trial_started_at || ws.created_at
            if (!trialStart) continue

            const trialStartDate = new Date(trialStart)
            const trialEnd = new Date(trialStartDate)
            trialEnd.setMonth(trialEnd.getMonth() + 2)

            const diffMs = trialEnd.getTime() - now.getTime()
            const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

            // Send reminder at exactly 4 days before trial ends
            if (daysRemaining !== 4) continue

            // Check if this workspace already has a paid subscription (skip if so)
            const { data: sub } = await service
                .from('subscriptions')
                .select('id, tier, status')
                .eq('workspace_id', ws.id)
                .maybeSingle()

            if (sub && sub.tier === 'pro' && sub.status === 'active') {
                // Already a paid subscriber, skip
                continue
            }

            // Get owner email from auth.users via the owner_id
            if (!ws.owner_id) continue

            const { data: userData } = await service.auth.admin.getUserById(ws.owner_id)
            const ownerEmail = userData?.user?.email

            if (!ownerEmail) continue

            // Send trial reminder email
            try {
                const res = await fetch(`${baseUrl}/api/email/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(cronSecret ? { authorization: `Bearer ${cronSecret}` } : {}),
                    },
                    body: JSON.stringify({
                        type: 'trial_reminder',
                        to: ownerEmail,
                        description: String(daysRemaining),
                    })
                })

                if (res.ok) {
                    remindersSent++
                    console.log(`[Trial Reminders] Sent reminder to ${ownerEmail} (${daysRemaining} days left)`)
                } else {
                    errors++
                    console.error(`[Trial Reminders] Failed to send to ${ownerEmail}`)
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 150))
            } catch (err: any) {
                errors++
                console.error(`[Trial Reminders] Error sending to ${ownerEmail}:`, err?.message)
            }
        }

        console.log(`[Trial Reminders] Sent ${remindersSent} reminders (${errors} errors)`)

        return NextResponse.json({
            success: true,
            reminders_sent: remindersSent,
            errors,
        })
    } catch (error: any) {
        console.error('[Trial Reminders] Error:', error)
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to process trial reminders" },
            { status: 500 }
        )
    }
}
