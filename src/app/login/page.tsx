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

const testimonials = [
    {
        quote: "Due to improved invoice reconciliation, we are now saving 1-2 man-days each month, and we have a better understanding of our finances thanks to dashboards.",
        author: "Sarah Chen",
        role: "VC, TechStart • South Africa",
    },
    {
        quote: "Illumi has transformed how we handle invoicing. It's incredibly helpful for finding past transactions and staying organized quickly.",
        author: "Michael Torres",
        role: "Founder, DesignCo • Cape Town",
    },
    {
        quote: "Finally, an invoicing tool that actually understands small business needs. The vault feature alone has saved us countless hours.",
        author: "Emma Wilson",
        role: "CEO, CloudSoft • Johannesburg",
    },
    {
        quote: "We switched from traditional accounting software and haven't looked back. The interface is clean and intuitive.",
        author: "David Park",
        role: "Operations, MediaHub • Durban",
    },
]



export default function LoginPage() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const supabase = createClient()
    const [nextPath, setNextPath] = useState('/overview')

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
        try {
            localStorage.setItem('illumi_auth_next', nextPath)
        } catch {
            // ignore
        }
        const redirectUrl = `${getURL()}/auth/callback`
        console.log('Initiating Google Sign-In with redirect:', redirectUrl)

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            }
        })

        if (error) {
            toast.error(error.message)
            setGoogleLoading(false)
        }
    }

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        try {
            localStorage.setItem('illumi_auth_next', nextPath)
        } catch {
            // ignore
        }
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${getURL()}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Check your email for the login link!")
        }
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
            <div className="hidden lg:flex lg:w-1/2 bg-black flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Logo top left */}
                <div className="absolute top-12 left-12">
                    <Image
                        src="/logo.png"
                        alt="Illumi Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8"
                    />
                </div>

                {/* Large Background Quote */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <span className="text-[600px] leading-none text-white font-serif select-none">“</span>
                </div>

                {/* Centered Testimonial */}
                <div className="relative z-10 max-w-lg text-center">
                    <p className="text-2xl text-white/90 leading-relaxed mb-8 font-serif italic">
                        "{testimonial.quote}"
                    </p>
                    <div className="text-sm text-[#878787]">
                        <span className="text-[#fafafa] font-medium">{testimonial.author}</span> • {testimonial.role}
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-[350px]">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-medium text-[#fafafa] mb-2">Welcome to Illumi</h1>
                        <p className="text-sm text-[#878787]">Sign in or create an account</p>
                    </div>

                    <div className="space-y-4">
                        {/* Google Sign In */}
                        <Button
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading || loading}
                            className="w-full h-12 border-white/10 bg-white/5 text-[#fafafa] hover:bg-white/10 rounded-lg flex items-center justify-center gap-3"
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
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-[#0a0a0a] px-4 text-[#878787]">or</span>
                            </div>
                        </div>

                        {/* Email Sign In */}
                        <form onSubmit={handleEmailSignIn} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-white/5 border-white/10 text-[#fafafa] placeholder:text-[#878787] rounded-lg"
                            />
                            <Button
                                type="submit"
                                disabled={loading || googleLoading}
                                className="w-full h-12 bg-white/5 hover:bg-white/10 text-[#fafafa] rounded-lg border border-white/10"
                            >
                                {loading ? (
                                    <IconLoader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : null}
                                Continue with Email
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-12 text-xs text-[#878787] text-center max-w-[300px]">
                    By signing in you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-2 hover:text-[#fafafa]">
                        Terms of service
                    </Link>
                    {" "}& {" "}
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-[#fafafa]">
                        Privacy policy
                    </Link>
                </p>
            </div>
        </div>
    )
}
