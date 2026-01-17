import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type EmailType = "invite" | "support" | "invoice" | "invoice_reminder"

interface EmailPayload {
    type: EmailType
    to: string
    subject?: string
    // For invite emails
    inviterName?: string
    workspaceName?: string
    inviteLink?: string
    // For support emails
    category?: string
    priority?: string
    description?: string
    userName?: string
    userEmail?: string
    // For invoice emails
    invoiceNumber?: string
    customerName?: string
    amount?: string
    dueDate?: string
    paymentLink?: string
}

export async function POST(req: Request) {
    try {
        const payload: EmailPayload = await req.json()
        const { type, to } = payload

        if (!to || !type) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: to, type" },
                { status: 400 }
            )
        }

        let emailSubject: string
        let emailHtml: string

        switch (type) {
            case "invite":
                emailSubject = `You've been invited to join ${payload.workspaceName || "a workspace"} on Emini`
                emailHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="color: #000; font-size: 28px; margin: 0;">You're Invited!</h1>
                        </div>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            ${payload.inviterName || "Someone"} has invited you to join <strong>${payload.workspaceName || "their workspace"}</strong> on Emini.
                        </p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            Emini is a modern invoicing platform that helps businesses manage their finances efficiently.
                        </p>
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${payload.inviteLink || process.env.NEXT_PUBLIC_URL}" 
                               style="background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                Accept Invitation
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you didn't expect this invitation, you can safely ignore this email.
                        </p>
                    </div>
                `
                break

            case "support":
                emailSubject = `[Support] ${payload.subject || "New Support Request"}`
                emailHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <h1 style="color: #000; font-size: 24px; margin-bottom: 24px;">New Support Request</h1>
                        <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                            <p style="margin: 0 0 12px 0;"><strong>From:</strong> ${payload.userName || "User"} (${payload.userEmail || to})</p>
                            <p style="margin: 0 0 12px 0;"><strong>Category:</strong> ${payload.category || "General"}</p>
                            <p style="margin: 0 0 12px 0;"><strong>Priority:</strong> ${payload.priority || "Medium"}</p>
                            <p style="margin: 0;"><strong>Subject:</strong> ${payload.subject || "No subject"}</p>
                        </div>
                        <div style="background: #fff; border: 1px solid #e5e5e5; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 16px 0; color: #333;">Description:</h3>
                            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${payload.description || "No description provided"}</p>
                        </div>
                    </div>
                `
                break

            case "invoice":
                emailSubject = payload.subject || `Invoice ${payload.invoiceNumber || ""} from Emini`
                emailHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="color: #000; font-size: 28px; margin: 0;">Invoice ${payload.invoiceNumber || ""}</h1>
                        </div>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            Hi ${payload.customerName || "there"},
                        </p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            A new invoice has been created for you. Please find the details below:
                        </p>
                        <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; margin: 24px 0;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Amount Due</p>
                            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #000;">${payload.amount || "ZAR 0.00"}</p>
                            ${payload.dueDate ? `<p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">Due by: ${payload.dueDate}</p>` : ""}
                        </div>
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${payload.paymentLink || process.env.NEXT_PUBLIC_URL}" 
                               style="background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                View & Pay Invoice
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            Questions? Reply to this email or contact our support team.
                        </p>
                    </div>
                `
                break

            case "invoice_reminder":
                emailSubject = `Reminder: Invoice ${payload.invoiceNumber || ""} is due`
                emailHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="color: #000; font-size: 28px; margin: 0;">Payment Reminder</h1>
                        </div>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            Hi ${payload.customerName || "there"},
                        </p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            This is a friendly reminder that invoice <strong>${payload.invoiceNumber || ""}</strong> is due for payment.
                        </p>
                        <div style="background: #fef3c7; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #f59e0b;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e;">Amount Due</p>
                            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #92400e;">${payload.amount || "ZAR 0.00"}</p>
                            ${payload.dueDate ? `<p style="margin: 16px 0 0 0; font-size: 14px; color: #92400e;">Due: ${payload.dueDate}</p>` : ""}
                        </div>
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${payload.paymentLink || process.env.NEXT_PUBLIC_URL}" 
                               style="background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                Pay Now
                            </a>
                        </div>
                    </div>
                `
                break

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid email type" },
                    { status: 400 }
                )
        }

        // Determine the "from" address based on email type
        const fromAddress = type === "support"
            ? "support@emini.co.za"
            : "invoices@emini.co.za"

        const { data, error } = await resend.emails.send({
            from: `Emini <${fromAddress}>`,
            to: type === "support" ? "support@emini.co.za" : to,
            replyTo: type === "support" ? payload.userEmail : undefined,
            subject: emailSubject,
            html: emailHtml,
        })

        if (error) {
            console.error("[Email API] Error:", error)
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            messageId: data?.id,
        })
    } catch (error: any) {
        console.error("[Email API] Error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to send email" },
            { status: 500 }
        )
    }
}
