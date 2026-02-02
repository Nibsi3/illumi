"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IconBrandGoogle, IconLoader2 } from "@tabler/icons-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { getURL } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics/client"
import { useTheme } from "@/lib/theme-context"

const testimonials = [
    {
        quote: "Creating and sending invoices used to take me hours. Now I can generate a professional invoice in under a minute and email it straight to my client.",
        author: "Sarah M.",
        role: "Freelance Consultant",
    },
    {
        quote: "The recurring invoice feature is a game-changer. My monthly retainer clients get billed automatically, and I never miss a payment deadline.",
        author: "Michael T.",
        role: "Creative Agency Owner",
    },
    {
        quote: "I love that I can track expenses and see my net profit in real-time. It's helped me make better business decisions and stay on top of my finances.",
        author: "Emma W.",
        role: "Small Business Owner",
    },
    {
        quote: "PayGate integration means my clients can pay invoices online instantly. I get paid faster and don't have to chase payments anymore.",
        author: "David K.",
        role: "Contractor",
    },
]



export default function LoginPage() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mode, setMode] = useState<"sign_in" | "sign_up" | "verify">("sign_in")
    const [verificationCode, setVerificationCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const supabase = typeof window === 'undefined' ? null : createClient()
    const [nextPath, setNextPath] = useState('/overview')
    const { theme } = useTheme()

    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            const params = new URLSearchParams(window.location.search)
            const next = params.get('next')
            if (next && next.startsWith('/')) {
                setNextPath(next)
            }
        } catch {
            // ignore
        }
    }, [])


    const handleGoogleSignIn = async () => {
        setGoogleLoading(true)
        if (!supabase) {
            toast.error('Supabase client is not available')
            setGoogleLoading(false)
            return
        }
        try {
            localStorage.setItem('illumi_auth_next', nextPath)
        } catch {
            // ignore
        }

        await trackEvent("auth_oauth_start", { provider: "google" })
        const redirectUrl = `${getURL()}/auth/callback`
        console.log('Initiating Google Sign-In with redirect:', redirectUrl)

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    prompt: 'select_account',
                },
                skipBrowserRedirect: true,
            }
        })

        if (error) {
            toast.error(error.message)
            setGoogleLoading(false)
            return
        }

        if (data?.url) {
            window.location.assign(data.url)
            return
        }

        toast.error('Unable to start Google sign-in')
        setGoogleLoading(false)
    }

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return

        setLoading(true)
        if (!supabase) {
            toast.error('Supabase client is not available')
            setLoading(false)
            return
        }
        try {
            localStorage.setItem('illumi_auth_next', nextPath)
        } catch {
            // ignore
        }

        const normalizedEmail = email.toLowerCase().trim()

        const { error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
        })

        if (error) {
            toast.error(error.message)
        } else {
            await trackEvent("auth_sign_in", { method: "password" })
            window.location.assign(nextPath)
        }

        setLoading(false)
    }

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return

        setLoading(true)
        if (!supabase) {
            toast.error('Supabase client is not available')
            setLoading(false)
            return
        }
        const normalizedEmail = email.toLowerCase().trim()

        const { error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
                emailRedirectTo: `${getURL()}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        await trackEvent("auth_sign_up", { method: "password" })
        toast.success("Check your email for your verification code")
        setMode("verify")
        setLoading(false)
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !verificationCode) return

        setLoading(true)
        if (!supabase) {
            toast.error('Supabase client is not available')
            setLoading(false)
            return
        }
        const normalizedEmail = email.toLowerCase().trim()

        const { error } = await supabase.auth.verifyOtp({
            email: normalizedEmail,
            token: verificationCode.trim(),
            type: 'signup',
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        toast.success("Email verified")
        await trackEvent("auth_verify_email", { method: "otp" })
        window.location.assign(nextPath)
        setLoading(false)
    }

    // Cycle testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const testimonial = testimonials[currentTestimonial]

    return (
        <div className="flex min-h-screen font-sans">
            {/* Left side - Testimonials */}
            <div className="hidden lg:flex lg:w-1/2 bg-card flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Logo top left */}
                <div className="absolute top-12 left-12">
                    <Link href="/" aria-label="Go to Illumi home">
                        <Image
                            src={theme === 'dark' ? '/logo.png' : '/logo_black.png'}
                            alt="Illumi Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                    </Link>
                </div>

                {/* Large Background Quote */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <span className="text-[600px] leading-none text-foreground font-serif select-none">“</span>
                </div>

                {/* Centered Testimonial */}
                <div className="relative z-10 max-w-lg text-center">
                    <p className="text-2xl text-foreground/90 leading-relaxed mb-8 font-serif italic">
                        "{testimonial.quote}"
                    </p>
                    <div className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">{testimonial.author}</span> • {testimonial.role}
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 bg-background flex flex-col items-center justify-center p-8 relative">
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" aria-label="Go to Illumi home">
                        <Image
                            src={theme === 'dark' ? '/logo.png' : '/logo_black.png'}
                            alt="Illumi Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                    </Link>
                </div>
                <div className="w-full max-w-[350px]">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-medium text-foreground mb-2">Welcome to Illumi</h1>
                        <p className="text-sm text-muted-foreground">Sign in or create an account</p>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setMode("sign_in")}
                            className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-colors ${mode === "sign_in" ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:bg-accent"}`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("sign_up")}
                            className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-colors ${mode === "sign_up" ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:bg-accent"}`}
                        >
                            Sign up
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Google Sign In */}
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading || loading}
                            className="w-full h-12 border-border bg-muted text-foreground hover:bg-accent rounded-lg flex items-center justify-center gap-3"
                        >
                            {googleLoading ? (
                                <IconLoader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <IconBrandGoogle className="h-5 w-5" />
                            )}
                            Continue with Google
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-background px-4 text-muted-foreground">or</span>
                            </div>
                        </div>

                        {mode === "verify" ? (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    We sent a verification code to <span className="text-foreground">{email}</span>.
                                </div>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                    className="h-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-lg"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || googleLoading}
                                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                                >
                                    {loading ? (
                                        <IconLoader2 className="h-5 w-5 animate-spin mr-2" />
                                    ) : null}
                                    Verify email
                                </Button>
                                <button
                                    type="button"
                                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={async () => {
                                        if (!supabase) {
                                            toast.error('Supabase client is not available')
                                            return
                                        }
                                        if (!email) return
                                        const normalizedEmail = email.toLowerCase().trim()
                                        const { error } = await supabase.auth.resend({
                                            type: 'signup',
                                            email: normalizedEmail,
                                        })
                                        if (error) toast.error(error.message)
                                        else toast.success("Verification code resent")
                                    }}
                                >
                                    Resend code
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={mode === "sign_up" ? handleEmailSignUp : handleEmailSignIn} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-lg"
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-lg"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || googleLoading}
                                    className={mode === "sign_up"
                                        ? "w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                                        : "w-full h-12 bg-muted hover:bg-accent text-foreground rounded-lg border border-border"}
                                >
                                    {loading ? (
                                        <IconLoader2 className="h-5 w-5 animate-spin mr-2" />
                                    ) : null}
                                    {mode === "sign_up" ? "Create account" : "Sign in"}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-12 text-xs text-muted-foreground text-center max-w-[300px]">
                    By signing in you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                        Terms of service
                    </Link>
                    {" "}& {" "}
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                        Privacy policy
                    </Link>
                </p>
            </div>
        </div>
    )
}
