import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next')
    const nextPath = next && next.startsWith('/') ? next : '/auth/post-login'

    // FORCE local redirection if we are in development/local environment
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const forwardedHost = request.headers.get('x-forwarded-host')
    const host = forwardedHost ?? request.headers.get('host')
    const proto = forwardedProto ?? requestUrl.protocol.replace(':', '')

    const hostLower = (host || '').toLowerCase()
    const isLocalHost = hostLower.includes('localhost') || hostLower.includes('127.0.0.1')

    let origin = isLocalHost && host
        ? `${proto}://${host}`
        : (process.env.NEXT_PUBLIC_URL || (host ? `${proto}://${host}` : requestUrl.origin))

    origin = origin.replace(/\/$/, '')

    if (code) {
        // Create a response that we can modify with cookies
        const response = NextResponse.redirect(`${origin}${nextPath}`)

        // Create Supabase client that can read/write cookies on the response
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options)
                        })
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return response
        }
        console.error('Auth code exchange error:', error)
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
