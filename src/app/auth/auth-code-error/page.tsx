"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

function AuthCodeErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-black text-white">
            <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
            <p className="text-neutral-400 mb-4 max-w-md">
                We couldn't verify your sign-in request. This could be because the link has expired or was already used.
            </p>
            {error ? (
                <p className="text-neutral-400 mb-8 max-w-md break-words">{error}</p>
            ) : (
                <p className="text-neutral-400 mb-8 max-w-md">No additional error details were provided.</p>
            )}
            <Button asChild className="bg-white text-black hover:bg-neutral-200">
                <Link href="/login">Back to Sign In</Link>
            </Button>
        </div>
    )
}

export default function AuthCodeError() {
    return (
        <Suspense>
            <AuthCodeErrorContent />
        </Suspense>
    )
}
