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

    // In local dev, always redirect back to the *current* host/origin (e.g. localhost:3001)
    // even if NEXT_PUBLIC_URL is set to production.
    let origin = isLocalHost && host
        ? `${proto}://${host}`
        : (process.env.NEXT_PUBLIC_URL || (host ? `${proto}://${host}` : requestUrl.origin))

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
