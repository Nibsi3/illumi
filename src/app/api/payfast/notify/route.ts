import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// PayFast valid IP addresses (production)
const PAYFAST_IPS = [
    "197.97.145.144",
    "197.97.145.145",
    "197.97.145.146",
    "197.97.145.147",
    "197.97.145.148",
    "197.97.145.149",
    "197.97.145.150",
    "197.97.145.151",
    "41.74.179.194",
    "41.74.179.195",
    "41.74.179.196",
    "41.74.179.197",
    "41.74.179.198",
    "41.74.179.199",
    "41.74.179.200",
    "41.74.179.201",
    "41.74.179.202",
    "41.74.179.203",
    "41.74.179.204",
    "41.74.179.205",
    "41.74.179.206",
    "41.74.179.207",
    "41.74.179.208",
    "41.74.179.209",
]

// Environment variables
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || ""
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || ""
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || ""

// Supabase admin client for server-side operations
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Missing Supabase credentials")
    }
    
    return createClient(supabaseUrl, supabaseServiceKey)
}

// Validate PayFast signature
function validateSignature(data: Record<string, string>, signature: string): boolean {
    // Build the signature string (exclude signature field)
    const signatureString = Object.keys(data)
        .filter(key => key !== "signature" && data[key] !== "")
        .sort()
        .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
        .join("&")
    
    // Add passphrase if set
    const stringToHash = PAYFAST_PASSPHRASE 
        ? `${signatureString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE)}`
        : signatureString
    
    const calculatedSignature = crypto.createHash("md5").update(stringToHash).digest("hex")
    
    return calculatedSignature.toLowerCase() === signature.toLowerCase()
}

// Validate source IP
function validateIP(ip: string): boolean {
    // In development, allow all
    if (process.env.NODE_ENV === "development") return true

    // Extract IP from possible X-Forwarded-For header format
    const cleanIP = ip.split(",")[0].trim()
    return PAYFAST_IPS.includes(cleanIP)
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP
        const forwardedFor = request.headers.get("x-forwarded-for")
        const realIP = request.headers.get("x-real-ip")
        const clientIP = forwardedFor || realIP || "unknown"
        
        console.log("[PayFast ITN] Received notification from IP:", clientIP)

        // Best-effort IP validation.
        // On Vercel, proxy headers can be inconsistent; signature/passphrase validation is the primary security control.
        if (clientIP !== "unknown" && !validateIP(clientIP)) {
            console.warn("[PayFast ITN] Source IP not in known PayFast ranges (continuing due to signature validation):", clientIP)
        }
        
        // Parse form data
        const formData = await request.formData()
        const data: Record<string, string> = {}
        
        formData.forEach((value, key) => {
            data[key] = value.toString()
        })
        
        console.log("[PayFast ITN] Received data:", {
            payment_status: data.payment_status,
            pf_payment_id: data.pf_payment_id,
            m_payment_id: data.m_payment_id,
            amount_gross: data.amount_gross,
            token: data.token ? "***" : undefined,
            custom_str1: data.custom_str1, // workspace_id
            custom_str2: data.custom_str2, // user_id
        })
        
        // Validate merchant ID
        if (data.merchant_id !== PAYFAST_MERCHANT_ID) {
            console.error("[PayFast ITN] Invalid merchant ID:", data.merchant_id)
            return new NextResponse("Invalid merchant ID", { status: 400 })
        }
        
        // Validate signature
        if (!validateSignature(data, data.signature || "")) {
            console.error("[PayFast ITN] Invalid signature")
            return new NextResponse("Invalid signature", { status: 400 })
        }
        
        // Validate amount (R350 for Pro plan)
        const amount = parseFloat(data.amount_gross || "0")
        if (amount !== 350.00) {
            console.error("[PayFast ITN] Invalid amount:", amount)
            return new NextResponse("Invalid amount", { status: 400 })
        }
        
        const supabase = getSupabaseAdmin()
        
        // Extract custom fields
        const workspaceId = data.custom_str1
        const userId = data.custom_str2
        const subscriptionToken = data.token // PayFast subscription token for recurring
        
        if (!workspaceId || !userId) {
            console.error("[PayFast ITN] Missing workspace or user ID")
            return new NextResponse("Missing custom fields", { status: 400 })
        }
        
        // Handle different payment statuses
        const paymentStatus = data.payment_status
        
        if (paymentStatus === "COMPLETE") {
            // Calculate subscription period (1 month from now)
            const now = new Date()
            const expiresAt = new Date(now)
            expiresAt.setMonth(expiresAt.getMonth() + 1)
            
            // Upsert subscription record
            const { error: subscriptionError } = await supabase
                .from("subscriptions")
                .upsert({
                    workspace_id: workspaceId,
                    user_id: userId,
                    tier: "pro",
                    status: "active",
                    started_at: now.toISOString(),
                    expires_at: expiresAt.toISOString(),
                    payfast_token: subscriptionToken || null,
                    updated_at: now.toISOString(),
                }, {
                    onConflict: "workspace_id"
                })
            
            if (subscriptionError) {
                console.error("[PayFast ITN] Error updating subscription:", subscriptionError)
                return new NextResponse("Database error", { status: 500 })
            }
            
            // Record payment in subscription_payments table
            const { error: paymentError } = await supabase
                .from("subscription_payments")
                .insert({
                    workspace_id: workspaceId,
                    user_id: userId,
                    payment_date: now.toISOString(),
                    amount: amount,
                    status: "paid",
                    description: "Illumi Pro Plan - Monthly",
                    payfast_payment_id: data.pf_payment_id,
                    payment_method: "payfast",
                })
            
            if (paymentError) {
                console.error("[PayFast ITN] Error recording payment:", paymentError)
                // Don't fail the request, subscription is already updated
            }
            
            console.log("[PayFast ITN] Subscription activated for workspace:", workspaceId)
            
        } else if (paymentStatus === "CANCELLED") {
            // Update subscription status to cancelled
            const { error } = await supabase
                .from("subscriptions")
                .update({
                    status: "cancelled",
                    updated_at: new Date().toISOString(),
                })
                .eq("workspace_id", workspaceId)
            
            if (error) {
                console.error("[PayFast ITN] Error cancelling subscription:", error)
            }
            
            console.log("[PayFast ITN] Subscription cancelled for workspace:", workspaceId)
            
        } else if (paymentStatus === "FAILED") {
            // Log failed payment attempt
            console.log("[PayFast ITN] Payment failed for workspace:", workspaceId)
            
            // Record failed payment
            await supabase
                .from("subscription_payments")
                .insert({
                    workspace_id: workspaceId,
                    user_id: userId,
                    payment_date: new Date().toISOString(),
                    amount: amount,
                    status: "failed",
                    description: "Illumi Pro Plan - Monthly (Failed)",
                    payfast_payment_id: data.pf_payment_id,
                    payment_method: "payfast",
                })
        }
        
        // PayFast expects a 200 OK response
        return new NextResponse("OK", { status: 200 })
        
    } catch (error) {
        console.error("[PayFast ITN] Error processing notification:", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}

// PayFast also sends GET requests to verify the endpoint
export async function GET() {
    return new NextResponse("PayFast ITN endpoint active", { status: 200 })
}
