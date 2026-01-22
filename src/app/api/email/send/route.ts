import { NextResponse } from "next/server"
import { Resend } from "resend"

function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return null
    return new Resend(apiKey)
}

type EmailType = "invite" | "support" | "contact" | "invoice" | "payment_reminder" | "final_notice"

const ILLUMI_PUBLIC_LOGO = "https://eagwfcctvfrvxgxaitbd.supabase.co/storage/v1/object/public/logo/logo.png"

interface InvoiceItem {
    description: string
    quantity: number
    unit_price: number
}

interface EmailPayload {
    type: EmailType
    to: string
    cc?: string | string[]
    fromEmail?: string
    companyName?: string
    supportEmail?: string
    companyWebsite?: string
    allowCustomBranding?: boolean
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
    items?: InvoiceItem[]
    currency?: string
    note?: string
}

// Generate items table HTML for invoice emails
function generateItemsTable(items: InvoiceItem[], currency: string = 'ZAR'): string {
    if (!items || items.length === 0) return ''

    const formatter = new Intl.NumberFormat('en-ZA', { style: 'currency', currency })

    const rows = items.slice(0, 5).map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #333;">${item.description}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #666; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #333; text-align: right;">${formatter.format(item.unit_price)}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #333; text-align: right; font-weight: 600;">${formatter.format(item.quantity * item.unit_price)}</td>
        </tr>
    `).join('')

    const moreItems = items.length > 5 ? `<p style="color: #999; font-size: 12px; margin-top: 8px;">+ ${items.length - 5} more items</p>` : ''

    return `
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
                <tr style="border-bottom: 2px solid #000;">
                    <th style="padding: 12px 0; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Description</th>
                    <th style="padding: 12px 0; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Qty</th>
                    <th style="padding: 12px 0; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Price</th>
                    <th style="padding: 12px 0; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        ${moreItems}
    `
}

function extractAmountNumber(raw: string | undefined): number | null {
    if (!raw) return null
    const cleaned = raw.replace(/[^0-9.,-]/g, '').replace(/,/g, '')
    const num = Number(cleaned)
    return Number.isFinite(num) ? num : null
}

function buildGmailInvoiceSchema(payload: EmailPayload): string {
    const currency = (payload.currency || 'ZAR').toUpperCase()
    const amountNumber = extractAmountNumber(payload.amount)
    const invoiceNumber = (payload.invoiceNumber || '').trim()
    const paymentLink = (payload.paymentLink || '').trim()
    const dueDate = (payload.dueDate || '').trim()

    const schema: any = {
        "@context": "http://schema.org",
        "@type": "Invoice",
        "provider": {
            "@type": "Organization",
            "name": "Illumi",
            "email": "invoice@illumi.co.za",
        },
        ...(invoiceNumber ? { "confirmationNumber": invoiceNumber } : {}),
        ...(amountNumber !== null
            ? {
                  "totalPaymentDue": {
                      "@type": "PriceSpecification",
                      "price": amountNumber,
                      "priceCurrency": currency,
                  },
              }
            : {}),
        ...(dueDate ? { "paymentDueDate": dueDate } : {}),
        ...(paymentLink
            ? {
                  "potentialAction": {
                      "@type": "ViewAction",
                      "name": "View invoice",
                      "url": paymentLink,
                  },
              }
            : {}),
    }

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}

export async function POST(req: Request) {
    try {
        const resend = getResendClient()
        if (!resend) {
            return NextResponse.json(
                { success: false, error: "RESEND_API_KEY is not configured" },
                { status: 500 }
            )
        }

        const payload: EmailPayload = await req.json()
        const { type, to } = payload

        if (!to || !type) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: to, type" },
                { status: 400 }
            )
        }

        const cleanTo = typeof to === 'string' ? to.trim() : to

        let emailSubject: string
        let emailHtml: string

        switch (type) {
            case "invite":
                emailSubject = `You've been invited to join ${payload.workspaceName || "a workspace"} on Illumi`
                emailHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f6f7f9; padding: 40px 16px;">
                        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e9eaee;">
                            <div style="background: #0a0a0a; padding: 24px; text-align: center;">
                                <img src="${ILLUMI_PUBLIC_LOGO}" alt="Illumi" width="48" height="48" style="display: inline-block;" />
                                <div style="color: #ffffff; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; margin-top: 12px;">Workspace Invitation</div>
                            </div>
                            <div style="padding: 28px 24px 8px 24px;">
                                <h1 style="color: #0a0a0a; font-size: 24px; margin: 0 0 12px 0;">You're invited to join ${payload.workspaceName || "a workspace"}</h1>
                                <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0;">
                                    <strong>${payload.inviterName || "Someone"}</strong> invited you to help manage <strong>${payload.workspaceName || "their workspace"}</strong> on Illumi.
                                </p>
                                <div style="background: #f6f7f9; border: 1px solid #e9eaee; border-radius: 12px; padding: 14px 16px; margin: 18px 0;">
                                    <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b7280; font-weight: 700;">What you can do</div>
                                    <div style="margin-top: 10px; color: #111827; font-size: 14px; line-height: 1.7;">
                                        • Create and send invoices<br />
                                        • Track payments and customers<br />
                                        • Collaborate with your team
                                    </div>
                                </div>
                                <div style="text-align: center; margin: 22px 0 18px 0;">
                                    <a href="${payload.inviteLink || process.env.NEXT_PUBLIC_URL}" 
                                       style="background: #0a0a0a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; display: inline-block;">
                                        Accept invitation
                                    </a>
                                </div>
                                <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0 0 12px 0; text-align: center;">
                                    If the button doesn't work, copy and paste this link:
                                </p>
                                <p style="color: #0a0a0a; font-size: 12px; line-height: 1.6; margin: 0 0 18px 0; text-align: center; word-break: break-all;">
                                    <a href="${payload.inviteLink || process.env.NEXT_PUBLIC_URL}" style="color: #0a0a0a; text-decoration: underline;">${payload.inviteLink || process.env.NEXT_PUBLIC_URL}</a>
                                </p>
                            </div>
                            <div style="padding: 16px 24px 22px 24px; border-top: 1px solid #e9eaee; text-align: center;">
                                <p style="color: #9ca3af; font-size: 11px; margin: 0;">If you didn't expect this invitation, you can safely ignore this email.</p>
                            </div>
                        </div>
                    </div>
                `
                break

            case "contact":
                emailSubject = payload.subject || `New Contact Request`
                emailHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <h1 style="color: #000; font-size: 24px; margin-bottom: 24px;">New Contact Request</h1>
                        <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                            <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${payload.userName || "Visitor"}</p>
                            <p style="margin: 0 0 12px 0;"><strong>Email:</strong> ${payload.userEmail || "(not provided)"}</p>
                            <p style="margin: 0;"><strong>Subject:</strong> ${payload.subject || "New Contact Request"}</p>
                        </div>
                        <div style="background: #fff; border: 1px solid #e5e5e5; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 16px 0; color: #333;">Message:</h3>
                            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${payload.description || ""}</p>
                        </div>
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
                const invoiceCompanyName = (payload.companyName || "Illumi").trim() || "Illumi"
                const invoiceSupportEmail = (payload.supportEmail || payload.fromEmail || "support@illumi.co.za").trim() || "support@illumi.co.za"
                const invoiceCompanyWebsite = (payload.companyWebsite || "").trim()
                const invoiceAllowCustomBranding = Boolean(payload.allowCustomBranding)
                const invoicePoweredByName = invoiceAllowCustomBranding && invoiceCompanyWebsite ? invoiceCompanyName : "Illumi"
                const invoicePoweredByUrl = invoiceAllowCustomBranding && invoiceCompanyWebsite ? invoiceCompanyWebsite : "https://illumi.co.za"
                emailSubject = payload.subject || `Invoice ${payload.invoiceNumber || ""} from ${invoiceCompanyName}`
                const invoiceSchema = buildGmailInvoiceSchema(payload)
                emailHtml = `
                    ${invoiceSchema}
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
                        ${generateItemsTable(payload.items || [], payload.currency)}
                        <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; margin: 24px 0;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Amount Due</p>
                            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #000;">${payload.amount || "ZAR 0.00"}</p>
                            ${payload.dueDate ? `<p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">Due by: ${payload.dueDate}</p>` : ""}
                        </div>
                        ${payload.note ? `<div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #000;"><p style="margin: 0; font-size: 14px; color: #666; font-style: italic;">${payload.note}</p></div>` : ""}
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${payload.paymentLink || process.env.NEXT_PUBLIC_URL}" 
                               style="background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                View & Pay Invoice
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            Questions? Send an email to ${invoiceSupportEmail}
                        </p>
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">Powered by <a href="${invoicePoweredByUrl}" style="color: #999; text-decoration: underline;"><strong>${invoicePoweredByName}</strong></a></p>
                        </div>
                    </div>
                `
                break

            case "payment_reminder":
                const reminderCompanyName = (payload.companyName || "Illumi").trim() || "Illumi"
                const reminderSupportEmail = (payload.supportEmail || payload.fromEmail || "support@illumi.co.za").trim() || "support@illumi.co.za"
                const reminderCompanyWebsite = (payload.companyWebsite || "").trim()
                const reminderAllowCustomBranding = Boolean(payload.allowCustomBranding)
                const reminderPoweredByName = reminderAllowCustomBranding && reminderCompanyWebsite ? reminderCompanyName : "Illumi"
                const reminderPoweredByUrl = reminderAllowCustomBranding && reminderCompanyWebsite ? reminderCompanyWebsite : "https://illumi.co.za"
                emailSubject = `Reminder: Invoice ${payload.invoiceNumber || ""} from ${reminderCompanyName} - Payment Due Soon`
                const reminderSchema = buildGmailInvoiceSchema(payload)
                emailHtml = `
                    ${reminderSchema}
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="color: #000; font-size: 28px; margin: 0;">Payment Reminder</h1>
                        </div>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            Hi ${payload.customerName || "there"},
                        </p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            This is a friendly reminder that invoice <strong>${payload.invoiceNumber || ""}</strong> is due for payment soon.
                        </p>
                        ${generateItemsTable(payload.items || [], payload.currency)}
                        <div style="background: #fef3c7; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #f59e0b;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e;">Amount Due</p>
                            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #92400e;">${payload.amount || "ZAR 0.00"}</p>
                            ${payload.dueDate ? `<p style="margin: 16px 0 0 0; font-size: 14px; color: #92400e;">Due: ${payload.dueDate}</p>` : ""}
                        </div>
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${payload.paymentLink || process.env.NEXT_PUBLIC_URL}" 
                               style="background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                View & Pay Invoice
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you've already made this payment, please disregard this reminder.
                        </p>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            Questions? Send an email to ${reminderSupportEmail}
                        </p>
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">Powered by <a href="${reminderPoweredByUrl}" style="color: #999; text-decoration: underline;"><strong>${reminderPoweredByName}</strong></a></p>
                        </div>
                    </div>
                `
                break

            case "final_notice":
                const finalCompanyName = (payload.companyName || "Illumi").trim() || "Illumi"
                const finalSupportEmail = (payload.supportEmail || payload.fromEmail || "support@illumi.co.za").trim() || "support@illumi.co.za"
                const finalCompanyWebsite = (payload.companyWebsite || "").trim()
                const finalAllowCustomBranding = Boolean(payload.allowCustomBranding)
                const finalPoweredByName = finalAllowCustomBranding && finalCompanyWebsite ? finalCompanyName : "Illumi"
                const finalPoweredByUrl = finalAllowCustomBranding && finalCompanyWebsite ? finalCompanyWebsite : "https://illumi.co.za"
                emailSubject = `FINAL NOTICE: Invoice ${payload.invoiceNumber || ""} from ${finalCompanyName} - Payment Due Today`
                const finalNoticeSchema = buildGmailInvoiceSchema(payload)
                emailHtml = `
                    ${finalNoticeSchema}
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <div style="background: #dc2626; color: white; padding: 8px 16px; border-radius: 4px; display: inline-block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Final Notice</div>
                            <h1 style="color: #000; font-size: 28px; margin: 0;">Payment Due Today</h1>
                        </div>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            Hi ${payload.customerName || "there"},
                        </p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            This is a final notice that invoice <strong>${payload.invoiceNumber || ""}</strong> is due for payment <strong>today</strong>. Please settle this invoice at your earliest convenience to avoid any late fees.
                        </p>
                        ${generateItemsTable(payload.items || [], payload.currency)}
                        <div style="background: #fee2e2; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #dc2626;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #991b1b;">Amount Due</p>
                            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #991b1b;">${payload.amount || "ZAR 0.00"}</p>
                            <p style="margin: 16px 0 0 0; font-size: 14px; color: #991b1b; font-weight: 600;">Due: TODAY</p>
                        </div>
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${payload.paymentLink || process.env.NEXT_PUBLIC_URL}" 
                               style="background: #dc2626; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                Pay Now
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you've already made this payment, please disregard this notice.
                        </p>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            Questions? Send an email to ${finalSupportEmail}
                        </p>
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">Powered by <a href="${finalPoweredByUrl}" style="color: #999; text-decoration: underline;"><strong>${finalPoweredByName}</strong></a></p>
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

        const INVOICE_FROM = "invoice@illumi.co.za"
        const INVITE_FROM = "invite@illumi.co.za"
        const isInvoiceLike = type === "invoice" || type === "payment_reminder" || type === "final_notice"

        // Determine the "from" address
        const fromAddress = (type === "support" || type === "contact")
            ? (type === "support" ? "support@illumi.co.za" : "info@illumi.co.za")
            : isInvoiceLike
                ? INVOICE_FROM
                : type === "invite"
                    ? INVITE_FROM
                : "invoices@illumi.co.za"

        const replyToAddress =
            (type === "support" || type === "contact")
                ? payload.userEmail
                : isInvoiceLike
                    ? INVOICE_FROM
                    : type === "invite"
                        ? INVITE_FROM
                    : (payload.fromEmail || undefined)

        const { data, error } = await resend.emails.send({
            from: `Illumi <${fromAddress}>`,
            to: type === "support"
                ? "support@illumi.co.za"
                : type === "contact"
                    ? "info@illumi.co.za"
                    : cleanTo,
            cc: payload.cc,
            replyTo: replyToAddress,
            subject: emailSubject,
            html: emailHtml,
        })

        if (error) {
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
        return NextResponse.json(
            { success: false, error: error.message || "Failed to send email" },
            { status: 500 }
        )
    }
}
