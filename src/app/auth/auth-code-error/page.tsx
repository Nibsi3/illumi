import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-black text-white">
            <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
            <p className="text-neutral-400 mb-8 max-w-md">
                We couldn't verify your sign-in request. This could be because the link has expired or was already used.
            </p>
            <Button asChild className="bg-white text-black hover:bg-neutral-200">
                <Link href="/login">Back to Sign In</Link>
            </Button>
        </div>
    )
}
