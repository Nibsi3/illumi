"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Suspense } from "react"

function ConfirmContent() {
    const searchParams = useSearchParams()
    const code = searchParams.get("code")
    const next = searchParams.get("next") || "/auth/post-login"
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!code) {
            setError("No authorization code provided.")
            return
        }

        const exchange = async () => {
            try {
                const supabase = createClient()
                const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                if (exchangeError) {
                    console.error("Client-side code exchange error:", exchangeError)
                    setError(exchangeError.message)
                    return
                }

                // Success — redirect to the target page
                window.location.assign(next)
            } catch (err: any) {
                console.error("Client-side code exchange exception:", err)
                setError(err?.message || "An unexpected error occurred during sign-in.")
            }
        }

        exchange()
    }, [code, next])

    if (error) {
        return (
            <div style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                background: "#000",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                margin: 0,
                padding: "2rem",
                textAlign: "center",
            }}>
                <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Sign-in Error</h1>
                <p style={{ color: "#999", maxWidth: "400px", marginBottom: "1.5rem" }}>{error}</p>
                <a
                    href="/login"
                    style={{
                        padding: "0.75rem 1.5rem",
                        background: "#fff",
                        color: "#000",
                        borderRadius: "0.5rem",
                        textDecoration: "none",
                        fontWeight: 500,
                    }}
                >
                    Back to Sign In
                </a>
            </div>
        )
    }

    return (
        <div style={{
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            background: "#000",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            margin: 0,
        }}>
            <div>Signing you in…</div>
        </div>
    )
}

export default function AuthConfirmPage() {
    return (
        <Suspense fallback={
            <div style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                background: "#000",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                margin: 0,
            }}>
                <div>Signing you in…</div>
            </div>
        }>
            <ConfirmContent />
        </Suspense>
    )
}
