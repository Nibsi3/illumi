"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

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

            if (nextPath === '/admin' || nextPath.startsWith('/admin/')) {
                nextPath = '/overview'
            }

            // Give the browser time to persist cookies set by the callback response.
            const supabase = createClient()
            for (let i = 0; i < 10; i++) {
                const { data } = await supabase.auth.getSession()
                if (data?.session) break
                await new Promise((r) => setTimeout(r, 200))
            }
            window.location.assign(nextPath)
        }

        run()
    }, [])

    return null
}
