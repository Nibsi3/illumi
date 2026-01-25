"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { IconStarFilled, IconLoader2 } from "@tabler/icons-react"
import { useWorkspace } from "@/lib/workspace-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// PayFast Production Credentials
const PAYFAST_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || ""
const PAYFAST_MERCHANT_KEY = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || ""
const PAYFAST_URL = "https://www.payfast.co.za/eng/process"

// Base URL for callbacks
const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://illumi.co.za"

export function PayFastSubscribeButton() {
    const { activeWorkspace, workspaces, refreshWorkspaces, setActiveWorkspace } = useWorkspace()
    const [userEmail, setUserEmail] = useState<string>("")
    const [userName, setUserName] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [resolvedUserId, setResolvedUserId] = useState<string>("")
    const [shouldSubmit, setShouldSubmit] = useState(false)
    const formRef = useRef<HTMLFormElement | null>(null)
    
    const supabase = createClient()
    
    useEffect(() => {
        async function fetchUserDetails() {
            try {
                const { data: sessionData } = await supabase.auth.getSession()
                let user = sessionData?.session?.user || null
                if (!user) {
                    const { data: userData } = await supabase.auth.getUser()
                    user = userData?.user || null
                }
                if (user) {
                    setResolvedUserId(user.id)
                    setUserEmail(user.email || "")
                    setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "")
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserDetails()
    }, [supabase])
    
    const merchantConfigured = Boolean(PAYFAST_MERCHANT_ID && PAYFAST_MERCHANT_KEY)

    const workspaceId = useMemo(() => {
        return (
            activeWorkspace?.id ||
            workspaces?.[0]?.id ||
            (typeof window !== 'undefined' ? (localStorage.getItem('activeWorkspaceId') || '') : '')
        )
    }, [activeWorkspace?.id, workspaces])

    useEffect(() => {
        if (!shouldSubmit) return
        if (!merchantConfigured) return
        if (!workspaceId || !resolvedUserId) return

        // Let the DOM update, then submit.
        const t = window.setTimeout(() => {
            try {
                formRef.current?.requestSubmit()
            } catch {
                // ignore
            }
            setShouldSubmit(false)
        }, 0)

        return () => window.clearTimeout(t)
    }, [merchantConfigured, resolvedUserId, shouldSubmit, workspaceId])

    if (isLoading) {
        return (
            <Button
                disabled
                className="bg-white/50 text-black h-12 px-8 font-black uppercase tracking-tighter text-sm"
            >
                <IconLoader2 size={18} className="mr-2 animate-spin" />
                Loading...
            </Button>
        )
    }

    const ensureWorkspaceAndSubmit = async () => {
        if (!merchantConfigured) {
            toast.error("PayFast is not configured", {
                description: "Add NEXT_PUBLIC_PAYFAST_MERCHANT_ID and NEXT_PUBLIC_PAYFAST_MERCHANT_KEY to your environment variables.",
            })
            return
        }

        setIsLoading(true)
        try {
            const { data: sessionData } = await supabase.auth.getSession()
            const user = sessionData?.session?.user || null
            if (!user) {
                toast.error("You need to be logged in to subscribe")
                return
            }

            // Make sure workspace list is current.
            await refreshWorkspaces(true)

            // If still no workspace, create a default one.
            const currentWorkspaceId =
                activeWorkspace?.id ||
                workspaces?.[0]?.id ||
                (typeof window !== 'undefined' ? (localStorage.getItem('activeWorkspaceId') || '') : '')

            if (!currentWorkspaceId) {
                const name = `${(user.user_metadata?.full_name || user.email || 'My').toString().split(' ')[0]} Workspace`
                const slug = name.toLowerCase().replace(/\s+/g, '-')

                const { data: ws, error } = await supabase
                    .from('workspaces')
                    .insert([{ name, owner_id: user.id, slug }])
                    .select()
                    .single()

                if (error || !ws?.id) {
                    toast.error("Could not create workspace")
                    return
                }

                setActiveWorkspace(ws)
                try {
                    localStorage.setItem('activeWorkspaceId', ws.id)
                } catch {
                    // ignore
                }
            }

            // Trigger submit on next render.
            setShouldSubmit(true)
        } catch {
            toast.error("Could not start checkout")
        } finally {
            setIsLoading(false)
        }
    }

    // Render a clickable CTA even if workspace/user isn't ready yet;
    // we will create/resolve it on click.
    if (!workspaceId || !resolvedUserId) {
        return (
            <Button
                type="button"
                className="bg-white text-black hover:bg-neutral-200 h-12 px-8 font-black uppercase tracking-tighter text-sm shadow-2xl transition-all"
                onClick={ensureWorkspaceAndSubmit}
            >
                <IconStarFilled size={18} className="mr-2" />
                Subscribe Now — R350/mo
            </Button>
        )
    }

    return (
        <form
            name="PayFastPayNowForm"
            action={PAYFAST_URL}
            method="post"
            ref={formRef}
            className="flex flex-col items-center"
        >
            {/* Merchant Details */}
            <input type="hidden" name="merchant_id" value={PAYFAST_MERCHANT_ID} />
            <input type="hidden" name="merchant_key" value={PAYFAST_MERCHANT_KEY} />
            
            {/* Return URLs */}
            <input type="hidden" name="return_url" value={`${BASE_URL}/settings/billing?success=true`} />
            <input type="hidden" name="cancel_url" value={`${BASE_URL}/settings/billing?cancelled=true`} />
            <input type="hidden" name="notify_url" value={`${BASE_URL}/api/payfast/notify`} />
            
            {/* Buyer Details */}
            <input type="hidden" name="name_first" value={userName.split(" ")[0] || ""} />
            <input type="hidden" name="name_last" value={userName.split(" ").slice(1).join(" ") || ""} />
            <input type="hidden" name="email_address" value={userEmail} />
            
            {/* Transaction Details */}
            <input type="hidden" name="m_payment_id" value={`SUB-${workspaceId}-${Date.now()}`} />
            <input type="hidden" name="amount" value="350.00" />
            <input type="hidden" name="item_name" value="Illumi Pro Plan" />
            <input type="hidden" name="item_description" value="Monthly subscription to Illumi Pro Plan" />
            
            {/* Custom fields for tracking */}
            <input type="hidden" name="custom_str1" value={workspaceId} />
            <input type="hidden" name="custom_str2" value={resolvedUserId} />
            
            {/* Subscription Details for Recurring Billing */}
            <input type="hidden" name="subscription_type" value="1" />
            <input type="hidden" name="recurring_amount" value="350.00" />
            <input type="hidden" name="frequency" value="3" /> {/* 3 = Monthly */}
            <input type="hidden" name="cycles" value="0" /> {/* 0 = Indefinite */}

            <Button
                type="submit"
                className="bg-white text-black hover:bg-neutral-200 h-12 px-8 font-black uppercase tracking-tighter text-sm shadow-2xl transition-all"
                onClick={(e) => {
                    if (!merchantConfigured) {
                        e.preventDefault()
                        toast.error("PayFast is not configured", {
                            description: "Add NEXT_PUBLIC_PAYFAST_MERCHANT_ID and NEXT_PUBLIC_PAYFAST_MERCHANT_KEY to your environment variables.",
                        })
                    }
                }}
            >
                <IconStarFilled size={18} className="mr-2" />
                Subscribe Now — R350/mo
            </Button>
        </form>
    )
}
