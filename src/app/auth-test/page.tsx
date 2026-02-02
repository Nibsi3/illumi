"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { signIn, signUp, signOut, useSession } from "@/lib/better-auth-client"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthTestPage() {
    const { data: session, isPending } = useSession()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleSignIn = async () => {
        setLoading(true)
        setResult(null)
        try {
            const res = await signIn.email({
                email,
                password,
                rememberMe,
                fetchOptions: {
                    onResponse: () => setLoading(false),
                    onRequest: () => setLoading(true),
                    onError: (ctx) => {
                        setResult({ success: false, message: ctx.error.message })
                    },
                    onSuccess: () => {
                        setResult({ success: true, message: "Sign in successful!" })
                    },
                },
            })
        } catch (err: any) {
            setResult({ success: false, message: err?.message || "Sign in failed" })
            setLoading(false)
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        setResult(null)
        try {
            await signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`.trim() || email.split("@")[0],
                fetchOptions: {
                    onResponse: () => setLoading(false),
                    onRequest: () => setLoading(true),
                    onError: (ctx) => {
                        setResult({ success: false, message: ctx.error.message })
                    },
                    onSuccess: () => {
                        setResult({ success: true, message: "Sign up successful!" })
                    },
                },
            })
        } catch (err: any) {
            setResult({ success: false, message: err?.message || "Sign up failed" })
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true)
        setResult(null)
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/auth-test",
                fetchOptions: {
                    onRequest: () => setLoading(true),
                    onResponse: () => setLoading(false),
                    onError: (ctx) => {
                        setResult({ success: false, message: ctx.error.message })
                    },
                    onSuccess: () => {
                        setResult({ success: true, message: "Google sign in initiated!" })
                    },
                },
            })
        } catch (err: any) {
            setResult({ success: false, message: err?.message || "Google sign in failed" })
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        setLoading(true)
        try {
            await signOut()
            setResult({ success: true, message: "Signed out successfully!" })
        } catch (err: any) {
            setResult({ success: false, message: err?.message || "Sign out failed" })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Auth Test Playground</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Testing Better Auth integration
                    </p>
                </div>

                {/* Session Status */}
                <Card className="border-2 border-dashed">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Session Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isPending ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Checking session...</span>
                            </div>
                        ) : session ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="font-medium">Logged in</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p><strong>Email:</strong> {session.user?.email}</p>
                                    <p><strong>Name:</strong> {session.user?.name || "N/A"}</p>
                                    <p><strong>ID:</strong> {session.user?.id}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSignOut}
                                    disabled={loading}
                                    className="mt-2"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Out"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <XCircle className="h-4 w-4" />
                                <span>Not logged in</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Result Display */}
                {result && (
                    <Card className={cn(
                        "border-2",
                        result.success ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-500 bg-red-50 dark:bg-red-950"
                    )}>
                        <CardContent className="py-4">
                            <div className="flex items-center gap-2">
                                {result.success ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                )}
                                <span className={cn(
                                    "font-medium",
                                    result.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                                )}>
                                    {result.message}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Auth Forms */}
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign In</CardTitle>
                                <CardDescription>Enter your credentials to sign in</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email">Email</Label>
                                    <Input
                                        id="signin-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signin-password">Password</Label>
                                    <Input
                                        id="signin-password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                                    />
                                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleSignIn}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 262">
                                        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
                                        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
                                        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
                                        <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
                                    </svg>
                                    Sign in with Google
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription>Create a new account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input
                                            id="first-name"
                                            placeholder="John"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input
                                            id="last-name"
                                            placeholder="Doe"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleSignUp}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <p className="text-xs text-center text-muted-foreground">
                    This is a hidden test page for Better Auth integration.
                </p>
            </div>
        </div>
    )
}
