"use client"

import * as React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { getURL } from "@/lib/utils"

export function AuthForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mode, setMode] = useState<"sign_in" | "sign_up" | "verify">("sign_in")
    const [verificationCode, setVerificationCode] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return
        setLoading(true)

        const normalizedEmail = email.toLowerCase().trim()

        const { error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
        })

        if (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return
        setLoading(true)

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

        toast.success("Check your email for your verification code")
        setMode("verify")
        setLoading(false)
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !verificationCode) return
        setLoading(true)

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
        setLoading(false)
    }

    return (
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-serif">Welcome to Illumi</CardTitle>
                <CardDescription>Sign in or create an account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant={mode === "sign_in" ? "default" : "outline"}
                        className="h-10"
                        disabled={loading}
                        onClick={() => setMode("sign_in")}
                    >
                        Sign in
                    </Button>
                    <Button
                        type="button"
                        variant={mode === "sign_up" ? "default" : "outline"}
                        className="h-10"
                        disabled={loading}
                        onClick={() => setMode("sign_up")}
                    >
                        Sign up
                    </Button>
                </div>

                {mode === "verify" ? (
                    <form onSubmit={handleVerify} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code" className="sr-only">Verification code</Label>
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                placeholder="Verification code"
                                value={verificationCode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                                required
                                className="bg-background border-border h-12"
                            />
                        </div>
                        <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify email
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-10 w-full text-sm"
                            disabled={loading}
                            onClick={async () => {
                                const normalizedEmail = email.toLowerCase().trim()
                                const { error } = await supabase.auth.resend({ type: 'signup', email: normalizedEmail })
                                if (error) toast.error(error.message)
                                else toast.success("Verification code resent")
                            }}
                        >
                            Resend code
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={mode === "sign_up" ? handleSignUp : handleSignIn} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="sr-only">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                                className="bg-background border-border h-12"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="sr-only">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                                className="bg-background border-border h-12"
                            />
                        </div>
                        <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "sign_up" ? "Create account" : "Sign in"}
                        </Button>
                    </form>
                )}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button variant="outline" className="h-12 w-full text-base" disabled={loading} onClick={() => {
                    supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: `${getURL()}/auth/callback`,
                            queryParams: {
                                prompt: 'select_account',
                            },
                        }
                    })
                }}>
                    Google
                </Button>
            </CardContent>
        </Card>
    )
}
