import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "jsr:@supabase/supabase-js@2"

type CustomerRow = {
  name: string | null
  email: string | null
}

type InvoiceRow = {
  id: string
  user_id: string
  workspace_id: string | null
  customer_id: string | null
  invoice_number: string
  status: string
  issue_date: string | null
  due_date: string | null
  currency: string | null
  total: number | null
  customers?: CustomerRow | null
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...extraHeaders,
    },
  })
}

function formatZAR(amount: number, currency: string) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: currency || "ZAR" }).format(amount)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendInvoiceEmail(args: {
  resendApiKey: string
  from: string
  to: string
  subject: string
  html: string
}) {
  let attempt = 0
  while (attempt < 2) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: args.from,
        to: [args.to],
        subject: args.subject,
        html: args.html,
      }),
    })

    if (res.ok) return

    const body = await res.text()

    if (res.status === 429 && attempt === 0) {
      await sleep(650)
      attempt++
      continue
    }

    throw new Error(`Resend error ${res.status}: ${body}`)
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders })

  const cronSecret = Deno.env.get("CRON_SECRET")
  const cronHeader = req.headers.get("x-cron-secret")
  if (cronSecret && cronHeader !== cronSecret) {
    return json({ error: "Unauthorized" }, 401)
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const supabaseServiceKey =
    Deno.env.get("SERVICE_ROLE_KEY") ||
    Deno.env.get("SUPABASE_SERVICE_KEY") ||
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  const resendApiKey = Deno.env.get("RESEND_API_KEY")
  const publicUrl = Deno.env.get("NEXT_PUBLIC_URL")

  if (!supabaseUrl || !supabaseServiceKey) {
    return json(
      {
        error: "Missing Supabase credentials",
        diagnostics: {
          has_SUPABASE_URL: Boolean(supabaseUrl),
          has_SERVICE_ROLE_KEY: Boolean(Deno.env.get("SERVICE_ROLE_KEY")),
          has_SUPABASE_SERVICE_KEY: Boolean(Deno.env.get("SUPABASE_SERVICE_KEY")),
          has_SUPABASE_SERVICE_ROLE_KEY: Boolean(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")),
        },
      },
      500,
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })

  const now = new Date()
  const todayStr = now.toISOString().split("T")[0]
  let invoicesSent = 0
  let emailsSent = 0

  const maxEmailsPerRun = 2
  const minDelayBetweenEmailsMs = 600
  let emailsAttempted = 0

  const { data: scheduledInvoices, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, status, issue_date, due_date, currency, total, customers(name,email)")
    .eq("status", "scheduled")
    .lte("issue_date", todayStr)

  if (error) return json({ error: error.message }, 500)

  for (const invoice of (scheduledInvoices as InvoiceRow[]) || []) {
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ status: "sent", sent_at: now.toISOString() })
      .eq("id", invoice.id)

    if (updateError) continue

    invoicesSent++

    const to = invoice.customers?.email
    if (to && resendApiKey && publicUrl && emailsAttempted < maxEmailsPerRun) {
      const currency = invoice.currency || "ZAR"
      const amount = formatZAR(Number(invoice.total || 0), currency)
      const paymentLink = `${publicUrl}/pay/${invoice.id}`
      const dueDateStr = invoice.due_date
        ? new Date(`${invoice.due_date}T00:00:00`).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
        : "Upon receipt"

      const subject = `Invoice ${invoice.invoice_number} from Illumi`
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #000; font-size: 28px; margin: 0 0 16px 0;">Invoice ${invoice.invoice_number}</h1>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">A scheduled invoice has been sent.</p>
          <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Amount Due</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #000;">${amount}</p>
            <p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">Due by: ${dueDateStr}</p>
          </div>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${paymentLink}" style="background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              View & Pay Invoice
            </a>
          </div>
        </div>
      `

      try {
        const resendDomainVerified = Deno.env.get("RESEND_DOMAIN_VERIFIED") === "true"
        const from = resendDomainVerified
          ? "Illumi <invoices@illumi.co.za>"
          : "Illumi (Test) <onboarding@resend.dev>"

        if (emailsAttempted > 0) {
          await sleep(minDelayBetweenEmailsMs)
        }

        await sendInvoiceEmail({
          resendApiKey,
          from,
          to,
          subject,
          html,
        })
        emailsAttempted++
        emailsSent++
      } catch {
        emailsAttempted++
      }
    }
  }

  return json({
    success: true,
    invoicesSent,
    emailsSent,
    processedAt: now.toISOString(),
  })
})
