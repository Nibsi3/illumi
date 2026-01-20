import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "jsr:@supabase/supabase-js@2"

type InvoiceItemRow = {
  description: string | null
  quantity: number | null
  unit_price: number | null
  total: number | null
  sort_order: number | null
}

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
  subtotal: number | null
  tax_rate: number | null
  tax_amount: number | null
  total: number | null
  notes: string | null
  created_at: string
  is_recurring: boolean | null
  recurring_interval: string | null
  recurring_end_date: string | null
  recurring_end_type?: string | null
  recurring_end_count?: number | null
  payment_provider?: string | null
  logo_url?: string | null
  customers?: CustomerRow | null
  invoice_items?: InvoiceItemRow[]
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

function addInterval(from: Date, interval: string): Date {
  const d = new Date(from)

  switch (interval) {
    case "minute":
      d.setMinutes(d.getMinutes() + 1)
      return d
    case "daily":
      d.setDate(d.getDate() + 1)
      return d
    case "weekly":
      d.setDate(d.getDate() + 7)
      return d
    case "monthly":
      d.setMonth(d.getMonth() + 1)
      return d
    case "quarterly":
      d.setMonth(d.getMonth() + 3)
      return d
    case "yearly":
      d.setFullYear(d.getFullYear() + 1)
      return d
    default:
      d.setMonth(d.getMonth() + 1)
      return d
  }
}

function formatDateOnly(d: Date): string {
  return d.toISOString().split("T")[0]
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

    // Basic retry/backoff on rate limit
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
  const resendDomainVerified = Deno.env.get("RESEND_DOMAIN_VERIFIED") === "true"

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
  let invoicesCreated = 0
  let emailsSent = 0

  const maxEmailsPerRun = 2
  const minDelayBetweenEmailsMs = 600
  let emailsAttempted = 0

  let parentsProcessed = 0
  const createdChildInvoices: Array<{ parentInvoiceId: string; childInvoiceId: string; childInvoiceNumber: string }> = []
  const emailFailures: Array<{ to: string; invoiceNumber: string; error: string }> = []

  const { data: recurringInvoices, error } = await supabase
    .from("invoices")
    .select("*, customers(name,email), invoice_items(description,quantity,unit_price,total,sort_order)")
    .eq("is_recurring", true)
    .in("status", ["sent", "paid"])

  if (error) {
    return json({ error: error.message }, 500)
  }

  for (const invoice of (recurringInvoices as InvoiceRow[]) || []) {
    parentsProcessed++
    if (!invoice.recurring_interval) continue

    if (invoice.recurring_end_date) {
      const endDate = new Date(`${invoice.recurring_end_date}T00:00:00`)
      if (now > endDate) continue
    }

    const { count: childCount, error: childCountError } = await supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("parent_invoice_id", invoice.id)

    if (childCountError) {
      continue
    }

    const alreadyGenerated = childCount || 0

    const endType = (invoice as any).recurring_end_type as string | null | undefined
    const endCount = (invoice as any).recurring_end_count as number | null | undefined
    // Treat recurring_end_count as TOTAL occurrences INCLUDING the parent invoice.
    // i.e. end_count=4 means: 1 parent + 3 children.
    const endTypeNormalized = endType === "after_minutes" ? "after" : endType
    if (endTypeNormalized === "after" && typeof endCount === "number") {
      const maxChildren = Math.max(0, endCount - 1)
      if (alreadyGenerated >= maxChildren) {
        continue
      }
    }

    const createdAt = new Date(invoice.created_at)
    const issueDateBase = invoice.issue_date ? new Date(`${invoice.issue_date}T00:00:00`) : createdAt

    // Create exactly one invoice when due.
    // Next occurrence = start date + (alreadyGenerated + 1) intervals.
    let nextInvoiceDate: Date
    if (invoice.recurring_interval === "minute") {
      nextInvoiceDate = new Date(createdAt)
      nextInvoiceDate.setMinutes(nextInvoiceDate.getMinutes() + (alreadyGenerated + 1))
    } else {
      nextInvoiceDate = new Date(issueDateBase)
      for (let i = 0; i < alreadyGenerated + 1; i++) {
        nextInvoiceDate = addInterval(nextInvoiceDate, invoice.recurring_interval)
      }
    }

    if (now < nextInvoiceDate) continue

    const origIssueDaysRaw = invoice.due_date && invoice.issue_date
      ? Math.round((new Date(`${invoice.due_date}T00:00:00`).getTime() - new Date(`${invoice.issue_date}T00:00:00`).getTime()) / (1000 * 60 * 60 * 24))
      : 30
    const origIssueDays = Math.max(0, origIssueDaysRaw)
    const newDueDate = new Date(nextInvoiceDate)
    newDueDate.setDate(newDueDate.getDate() + origIssueDays)

    const timestamp = Date.now().toString().slice(-6)
    const newInvoiceNumber = `INV-${timestamp}-${alreadyGenerated + 1}`

    const { data: newInvoice, error: insertError } = await supabase
      .from("invoices")
      .insert({
        user_id: invoice.user_id,
        workspace_id: invoice.workspace_id,
        customer_id: invoice.customer_id,
        invoice_number: newInvoiceNumber,
        status: "sent",
        issue_date: formatDateOnly(nextInvoiceDate),
        due_date: formatDateOnly(newDueDate),
        currency: invoice.currency,
        subtotal: invoice.subtotal,
        tax_rate: invoice.tax_rate,
        tax_amount: invoice.tax_amount,
        total: invoice.total,
        notes: invoice.notes,
        payment_provider: (invoice as any).payment_provider ?? null,
        logo_url: (invoice as any).logo_url ?? null,
        is_recurring: false,
        parent_invoice_id: invoice.id,
      })
      .select("id")
      .single()

    if (insertError || !newInvoice?.id) {
      continue
    }

    invoicesCreated++
    createdChildInvoices.push({
      parentInvoiceId: invoice.id,
      childInvoiceId: newInvoice.id,
      childInvoiceNumber: newInvoiceNumber,
    })

    const items = invoice.invoice_items || []
    if (items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        invoice_id: newInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        sort_order: item.sort_order,
      }))

      await supabase.from("invoice_items").insert(itemsToInsert)
    }

    const to = invoice.customers?.email
    if (to && resendApiKey && publicUrl && emailsAttempted < maxEmailsPerRun) {
      const currency = invoice.currency || "ZAR"
      const amount = formatZAR(Number(invoice.total || 0), currency)
      const paymentLink = `${publicUrl}/pay/${newInvoice.id}`
      const dueDateStr = newDueDate.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })

      const subject = `Invoice ${newInvoiceNumber} from Illumi`
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #000; font-size: 28px; margin: 0 0 16px 0;">Invoice ${newInvoiceNumber}</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi ${invoice.customers?.name || "there"},</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">A new invoice has been created for you.</p>
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
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        emailFailures.push({ to, invoiceNumber: newInvoiceNumber, error: message })
        emailsAttempted++
      }
    }
  }

  return json({
    success: true,
    invoicesCreated,
    emailsSent,
    parentsProcessed,
    createdChildInvoices,
    emailFailures,
    processedAt: now.toISOString(),
  })
})
