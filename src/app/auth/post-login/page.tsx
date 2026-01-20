"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PostLoginRedirectPage() {
    const router = useRouter()

    useEffect(() => {
        let nextPath = '/overview'
        try {
            const stored = localStorage.getItem('illumi_auth_next')
            if (stored && stored.startsWith('/')) {
                nextPath = stored
            }
            localStorage.removeItem('illumi_auth_next')
        } catch {
            // ignore
        }

        router.replace(nextPath)
    }, [router])

    return null
}
