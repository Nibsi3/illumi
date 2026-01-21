import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next')
    const nextPath = next && next.startsWith('/') ? next : '/auth/post-login'

    // FORCE local redirection if we are in development/local environment
    // This overrides any Supabase site_url fallback
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const forwardedHost = request.headers.get('x-forwarded-host')
    const host = forwardedHost ?? request.headers.get('host')
    const proto = forwardedProto ?? requestUrl.protocol.replace(':', '')

    const hostLower = (host || '').toLowerCase()
    const isLocalHost = hostLower.includes('localhost') || hostLower.includes('127.0.0.1')

    // Prefer redirecting back to the *request* host/origin. This avoids bouncing between
    // www and non-www, which causes users to appear logged out and re-prompt Google OAuth.
    let origin = host ? `${proto}://${host}` : requestUrl.origin

    // In local dev, always use the current host.
    if (isLocalHost && host) {
        origin = `${proto}://${host}`
    }

    // As a last resort (misconfigured proxies), fall back to configured site URL.
    if (!origin || origin === 'null') {
        origin = process.env.NEXT_PUBLIC_URL || requestUrl.origin
    }

    origin = origin.replace(/\/$/, '')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${nextPath}`)
        }
        console.error('Auth code exchange error:', error)
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
