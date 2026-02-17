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

// All existing user emails to notify
const EXISTING_USER_EMAILS = [
    "sibusisosebabole0@gmail.com",
    "ngibaaxola@gmail.com",
    "marlenesookraj0@gmail.com",
    "lesedimoyane0@gmail.com",
    "falckcameron68@gmail.com",
    "lwazikaybee123580@gmail.com",
    "itucharlene@yahoo.com",
    "rosemasola97@gmail.com",
    "ayeshamussa76@gmail.com",
    "reyaaz.arkacademy@gmail.com",
    "softyamie9@gmail.com",
    "sibonelovictor9@gmail.com",
    "gabedi808@gmail.com",
    "ecgmthokozisi@gmail.com",
    "machinemamello81@gmail.com",
    "sweedienibs@gmail.com",
    "snzonda8@gmail.com",
    "jmaluleka914@gmail.com",
    "keabetswemotlhabane@gmail.com",
    "teacheranelclegh@gmail.com",
    "alecmosojane@gmail.com",
    "bandilebanele140@gmail.com",
    "wandiswasandilendwandwe30@gmail.com",
    "prettyperfectpropertycleaning@gmail.com",
    "anchenhohls@gmail.com",
    "nyawoseme@gmail.com",
    "thornevenecia0@gmail.com",
    "anmaribasson@gmail.com",
    "futshanenana@gmail.com",
    "sonwabilemarela50@gmail.com",
    "noomsaportia27@gmail.com",
    "nontlantlasisulu421@gmail.com",
    "marian.volkwyn27@gmail.com",
    "peterjulius3@gmail.com",
    "info@secumarsecurity.co.za",
    "koetlisimasekhoane@gmail.com",
    "obertbheki390@gmail.com",
    "jawaadhendricks5@gmail.com",
    "blakeclacher51@gmail.com",
    "chamainemaholobela@gmail.com",
    "charitypilusa96@gmail.com",
    "ignatiousjamela2@gmail.com",
    "codeno316@gmail.com",
    "bakangericlepedi@gmail.com",
    "admin@illumi.co.za",
    "softkomsolutions@gmail.com",
    "bridgetmahlangu886@gmail.com",
    "phindibili@gmail.com",
    "nik36592@gmail.com",
    "siiphor70@gmail.com",
    "vickypieterse42@gmail.com",
    "charabil2013@gmail.com",
    "metusamkelo@gmail.com",
    "sirblxck020@gmail.com",
    "ndimanomalanga36@gmail.com",
    "mzwekhayaw@gmail.com",
    "emmanuelnkgweng0@gmail.com",
    "tshepiso.miepservices@gmail.com",
    "ratlotlongkay@gmail.com",
    "sueshousesitting@gmail.com",
    "zmtimkhulu50@gmail.com",
    "dladlandumiso143@gmail.com",
    "mbulelochitezera8@gmail.com",
    "jademorris785@gmail.com",
    "ramlalshika@gmail.com",
    "lmcfadden357@gmail.com",
    "anchenfalck@gmail.com",
    "sikhumbuzosithole10@gmail.com",
    "designrougoed@gmail.com",
    "mashudumatli@gmail.com",
    "johanitathiart24@gmail.com",
    "abegailholmes@gmail.com",
    "ronewaramukhithi091@gmail.com",
    "tshepokhaka01@gmail.com",
    "lungelom818@gmail.com",
    "vincepainters@gmail.com",
    "sogcweasanele@gmail.com",
    "gregphilander15@gmail.com",
    "cameronfalck03@gmail.com",
    "asemahlesmile5@gmail.com",
    "wandiswasandilendwandwe11@gmail.com",
    "property.squad@gmail.com",
]

export async function POST(req: Request) {
    try {
        // Protect with CRON_SECRET or admin check
        const cronSecret = process.env.CRON_SECRET
        const authHeader = req.headers.get("authorization")

        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        const service = getServiceClient()
        const now = new Date().toISOString()
        const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.illumi.co.za"

        // Step 1: Update all workspaces to set trial_started_at = today
        // This gives all existing users a fresh 2-month trial from today
        const { data: allWorkspaces, error: wsError } = await service
            .from('workspaces')
            .select('id, owner_id, trial_started_at')

        if (wsError) {
            console.error('[Admin] Error fetching workspaces:', wsError)
            return NextResponse.json(
                { success: false, error: `Failed to fetch workspaces: ${wsError.message}` },
                { status: 500 }
            )
        }

        let workspacesUpdated = 0
        let workspaceErrors = 0

        for (const ws of (allWorkspaces || [])) {
            const { error: updateError } = await service
                .from('workspaces')
                .update({ trial_started_at: now })
                .eq('id', ws.id)

            if (updateError) {
                console.error(`[Admin] Error updating workspace ${ws.id}:`, updateError)
                workspaceErrors++
            } else {
                workspacesUpdated++
            }
        }

        console.log(`[Admin] Updated ${workspacesUpdated} workspaces (${workspaceErrors} errors)`)

        // Step 2: Send notification email to all existing users
        let emailsSent = 0
        let emailErrors = 0
        const emailResults: { email: string; status: string; error?: string }[] = []

        for (const email of EXISTING_USER_EMAILS) {
            try {
                const res = await fetch(`${baseUrl}/api/email/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(cronSecret ? { authorization: `Bearer ${cronSecret}` } : {}),
                    },
                    body: JSON.stringify({
                        type: 'pro_upgrade',
                        to: email,
                    })
                })

                if (res.ok) {
                    emailsSent++
                    emailResults.push({ email, status: 'sent' })
                } else {
                    const errJson = await res.json().catch(() => null)
                    emailErrors++
                    emailResults.push({ email, status: 'failed', error: errJson?.error || `HTTP ${res.status}` })
                }

                // Small delay to avoid rate limiting (Resend allows ~10/sec)
                await new Promise(resolve => setTimeout(resolve, 150))
            } catch (err: any) {
                emailErrors++
                emailResults.push({ email, status: 'error', error: err?.message || 'Unknown error' })
            }
        }

        console.log(`[Admin] Sent ${emailsSent} emails (${emailErrors} errors)`)

        return NextResponse.json({
            success: true,
            summary: {
                workspaces_updated: workspacesUpdated,
                workspace_errors: workspaceErrors,
                emails_sent: emailsSent,
                email_errors: emailErrors,
                total_users: EXISTING_USER_EMAILS.length,
            },
            email_results: emailResults,
        })
    } catch (error: any) {
        console.error('[Admin] activate-trials error:', error)
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to activate trials" },
            { status: 500 }
        )
    }
}
