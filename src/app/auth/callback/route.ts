import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/overview'
    const nextPath = next.startsWith('/') ? next : '/overview'

    // FORCE local redirection if we are in development/local environment
    // This overrides any Supabase site_url fallback
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const forwardedHost = request.headers.get('x-forwarded-host')
    const host = forwardedHost ?? request.headers.get('host')
    const proto = forwardedProto ?? requestUrl.protocol.replace(':', '')

    let origin = process.env.NEXT_PUBLIC_URL
    if (!origin && host) {
        origin = `${proto}://${host}`
    }
    origin = (origin ?? requestUrl.origin).replace(/\/$/, '')

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
