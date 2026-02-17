import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as 'signup' | 'recovery' | 'invite' | 'magiclink' | 'email' | null
    const next = requestUrl.searchParams.get('next')
    const nextPath = next && next.startsWith('/') ? next : '/auth/post-login'

    console.log('Auth callback hit:', {
        url: request.url,
        hasCode: Boolean(code),
        hasTokenHash: Boolean(token_hash),
        type,
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

    const serializeCookie = (name: string, value: string, options: any) => {
        const parts: string[] = [`${name}=${value}`]
        const maxAgeNum = options?.maxAge !== undefined ? Number(options.maxAge) : undefined
        if (options?.path) parts.push(`Path=${options.path}`)
        if (options?.domain) parts.push(`Domain=${options.domain}`)
        if (maxAgeNum !== undefined) {
            parts.push(`Max-Age=${Math.floor(isFinite(maxAgeNum) ? maxAgeNum : 0)}`)
            // Include Expires for better compatibility (some clients behave inconsistently with Max-Age only).
            const expires = maxAgeNum <= 0 ? new Date(0) : new Date(Date.now() + maxAgeNum * 1000)
            parts.push(`Expires=${expires.toUTCString().replace(/,/g, '')}`)
        } else if (options?.expires) {
            parts.push(`Expires=${new Date(options.expires).toUTCString().replace(/,/g, '')}`)
        }
        if (options?.httpOnly) parts.push('HttpOnly')
        if (options?.secure) parts.push('Secure')
        if (options?.sameSite) {
            const s = String(options.sameSite)
            const normalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
            parts.push(`SameSite=${normalized}`)
        }
        return parts.join('; ')
    }

    if (code) {
        // Return HTML so the browser reliably applies Set-Cookie headers before navigation.
        // Some environments can behave inconsistently with Set-Cookie on 302 during OAuth flows.
        const response = new NextResponse(
            `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Signing in…</title></head><body style="font-family: ui-sans-serif, system-ui; background:#000; color:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0;"><div>Signing you in…</div><script>setTimeout(function(){ window.location.assign(${JSON.stringify(`${origin}${nextPath}`)}); }, 300);</script></body></html>`,
            {
                status: 200,
                headers: {
                    'content-type': 'text/html; charset=utf-8',
                    'cache-control': 'no-store',
                },
            }
        )

        let didSetAll = false
        let setAllCookieCount = 0

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
                        didSetAll = true
                        setAllCookieCount = Array.isArray(cookiesToSet) ? cookiesToSet.length : 0
                        cookiesToSet.forEach(({ name, value, options }) => {
                            const opts: any = { ...(options || {}) }
                            // Ensure cookies are available to the whole app after login.
                            // Some runtimes/providers may set a narrower path; force root.
                            opts.path = '/'
                            // On localhost over http, secure cookies will not be stored by the browser.
                            if (isLocalHost) {
                                opts.secure = false
                                // Ensure we don't set a Domain attribute on localhost.
                                // Browsers can reject cookies with an incompatible Domain.
                                delete opts.domain
                                // Chrome rejects SameSite=None cookies unless Secure=true.
                                // For localhost development, force Lax so cookies persist.
                                const sameSite = (opts.sameSite ?? '').toString().toLowerCase()
                                if (!sameSite || sameSite === 'none') {
                                    opts.sameSite = 'lax'
                                }
                            }
                            if (opts.maxAge === undefined && !opts.expires) {
                                opts.maxAge = 60 * 60 * 24 * 7
                            }

                            // Append one Set-Cookie header per cookie to avoid header coalescing issues.
                            response.headers.append('set-cookie', serializeCookie(name, value, opts))
                        })
                    },
                },
            }
        )

        const { data: exchangeData, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // In some environments, Supabase invokes our cookie writer slightly after the exchange resolves.
            // Wait briefly so all Set-Cookie headers are appended before we return the response.
            if (!didSetAll) {
                for (let i = 0; i < 10 && !didSetAll; i++) {
                    await new Promise((r) => setTimeout(r, 10))
                }
            }

            return response
        }
        console.error('Auth code exchange error:', error)

        // If the error is PKCE-related (code verifier not found on the server),
        // fall back to a client-side exchange page where the browser has access
        // to the code verifier in cookies/localStorage. The PKCE error is thrown
        // before any network request, so the auth code is still valid.
        const errorMsg = (error.message || '').toLowerCase()
        const isPKCEError = errorMsg.includes('code verifier') || errorMsg.includes('pkce')
        if (isPKCEError) {
            console.log('Auth callback: PKCE error detected, falling back to client-side exchange')
            const confirmUrl = new URL(`${origin}/auth/confirm`)
            confirmUrl.searchParams.set('code', code)
            confirmUrl.searchParams.set('next', nextPath)
            return NextResponse.redirect(confirmUrl, 302)
        }

        const errorUrl = new URL(`${origin}/auth/auth-code-error`)
        errorUrl.searchParams.set('error', error.message)
        return NextResponse.redirect(errorUrl, 302)
    }

    // Handle token_hash-based email confirmation (signup, recovery, magiclink, invite)
    if (token_hash && type) {
        console.log('Auth callback: handling token_hash verification, type:', type)

        const response = new NextResponse(
            `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Signing in…</title></head><body style="font-family: ui-sans-serif, system-ui; background:#000; color:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0;"><div>Verifying your email…</div><script>setTimeout(function(){ window.location.assign(${JSON.stringify(`${origin}${nextPath}`)}); }, 300);</script></body></html>`,
            {
                status: 200,
                headers: {
                    'content-type': 'text/html; charset=utf-8',
                    'cache-control': 'no-store',
                },
            }
        )

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
                            opts.path = '/'
                            if (isLocalHost) {
                                opts.secure = false
                                delete opts.domain
                                const sameSite = (opts.sameSite ?? '').toString().toLowerCase()
                                if (!sameSite || sameSite === 'none') {
                                    opts.sameSite = 'lax'
                                }
                            }
                            if (opts.maxAge === undefined && !opts.expires) {
                                opts.maxAge = 60 * 60 * 24 * 7
                            }
                            response.headers.append('set-cookie', serializeCookie(name, value, opts))
                        })
                    },
                },
            }
        )

        const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: type === 'signup' ? 'signup' : type === 'recovery' ? 'recovery' : type === 'invite' ? 'invite' : 'email',
        })

        if (!verifyError) {
            console.log('Auth callback: token_hash verification successful')
            return response
        }

        console.error('Auth callback: token_hash verification failed:', verifyError)
        const errorUrl = new URL(`${origin}/auth/auth-code-error`)
        errorUrl.searchParams.set('error', verifyError.message)
        return NextResponse.redirect(errorUrl, 302)
    }

    console.error('Auth callback missing code param:', request.url)
    const missingCodeUrl = new URL(`${origin}/auth/auth-code-error`)
    missingCodeUrl.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(missingCodeUrl, 302)
}
