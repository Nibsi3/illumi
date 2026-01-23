"use client"

import { useEffect } from "react"

export default function PostLoginRedirectPage() {
    useEffect(() => {
        const run = async () => {
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

            // Give the browser time to persist cookies set by the callback response.
            await new Promise((r) => setTimeout(r, 300))
            window.location.assign(nextPath)
        }

        run()
    }, [])

    return null
}
