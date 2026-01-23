import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next')
    const nextPath = next && next.startsWith('/') ? next : '/auth/post-login'

    console.log('Auth callback hit:', {
        url: request.url,
        hasCode: Boolean(code),
        nextPath,
    })

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
        const response = NextResponse.redirect(`${origin}${nextPath}`, 302)

        // Create Supabase client that can read/write cookies on the response
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookieEncoding: 'base64url',
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            const opts: any = { ...(options || {}) }
                            // Ensure cookies are available to the whole app after login.
                            if (!opts.path) {
                                opts.path = '/'
                            }
                            // On localhost over http, secure cookies will not be stored by the browser.
                            if (isLocalHost) {
                                opts.secure = false
                                // Chrome rejects SameSite=None cookies unless Secure=true.
                                // For localhost development, force Lax so cookies persist.
                                if (!opts.sameSite || opts.sameSite === 'none') {
                                    opts.sameSite = 'lax'
                                }
                            }
                            if (opts.maxAge === undefined && !opts.expires) {
                                opts.maxAge = 60 * 60 * 24 * 7
                            }

                            // Debug cookie attributes (no values)
                            console.log('Auth cookie set:', {
                                name,
                                valueLength: typeof value === 'string' ? value.length : undefined,
                                path: opts.path,
                                secure: opts.secure,
                                sameSite: opts.sameSite,
                                domain: opts.domain,
                                maxAge: opts.maxAge,
                            })
                            response.cookies.set(name, value, opts)
                        })

                        try {
                            const setCookieHeader = response.headers.get('set-cookie')
                            console.log('Auth callback Set-Cookie header present:', Boolean(setCookieHeader))
                            if (setCookieHeader) {
                                console.log('Auth callback Set-Cookie header length:', setCookieHeader.length)
                            }
                        } catch {
                            // ignore
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            console.log('Auth code exchange succeeded')
            return response
        }
        console.error('Auth code exchange error:', error)

        const errorUrl = new URL(`${origin}/auth/auth-code-error`)
        errorUrl.searchParams.set('error', error.message)
        return NextResponse.redirect(errorUrl, 302)
    }

    console.error('Auth callback missing code param:', request.url)
    const missingCodeUrl = new URL(`${origin}/auth/auth-code-error`)
    missingCodeUrl.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(missingCodeUrl, 302)

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
