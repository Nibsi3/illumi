import { createClient } from "@supabase/supabase-js"

// Internal helper to create notifications
// Uses service role client to bypass RLS
export async function createNotification(params: {
    userId: string
    workspaceId?: string
    type: 'payment_received' | 'invoice_sent' | 'payment_reminder' | 'final_notice' | 'invoice_overdue'
    title: string
    message?: string
    invoiceId?: string
    amount?: number
}) {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )

    const { error } = await supabase
        .from('notifications')
        .insert([{
            user_id: params.userId,
            workspace_id: params.workspaceId,
            type: params.type,
            title: params.title,
            message: params.message,
            invoice_id: params.invoiceId,
            amount: params.amount,
            read: false
        }])

    if (error) {
        console.error('[Create Notification] Error:', error)
        return false
    }

    return true
}
