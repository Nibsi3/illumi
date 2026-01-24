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

    const hasInvalidCookieValueChars = (value: string) => {
        // Disallow characters that can break Set-Cookie parsing.
        // (Control chars, spaces/tabs, DQUOTE, comma, semicolon, backslash, and non-ASCII.)
        return /[\u0000-\u001F\u007F\s",;\\\u0080-\uFFFF]/.test(value)
    }

    const getFirstInvalidCookieChar = (value: string) => {
        const match = /[\u0000-\u001F\u007F\s",;\\\u0080-\uFFFF]/.exec(value)
        if (!match) return null
        const index = match.index
        const ch = value[index]
        return { index, char: ch, code: ch ? ch.charCodeAt(0) : undefined }
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

        // Debug cookie to verify whether Chrome is accepting Set-Cookie from this response at all.
        // Place it first to avoid any potential header-size truncation from large auth cookies.
        response.headers.append('set-cookie', 'illumi_oauth_debug=1; Path=/; SameSite=Lax')

        response.headers.append(
            'set-cookie',
            serializeCookie('illumi_oauth_dot_test.0', '1', {
                path: '/',
                sameSite: 'lax',
                maxAge: 60 * 10,
                httpOnly: true,
                secure: false,
            })
        )

        response.headers.append(
            'set-cookie',
            serializeCookie('illumi_oauth_size_test', 'a'.repeat(3600), {
                path: '/',
                sameSite: 'lax',
                maxAge: 60 * 10,
                httpOnly: true,
                secure: false,
            })
        )

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
                        console.log('Auth callback setAll called:', {
                            cookieCount: Array.isArray(cookiesToSet) ? cookiesToSet.length : 0,
                        })
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

                            // Debug cookie attributes (no values)
                            const invalidChar = typeof value === 'string' ? getFirstInvalidCookieChar(value) : null
                            console.log('Auth cookie set:', {
                                name,
                                valueLength: typeof value === 'string' ? value.length : undefined,
                                hasInvalidValueChars: typeof value === 'string' ? hasInvalidCookieValueChars(value) : undefined,
                                invalidChar,
                                path: opts.path,
                                secure: opts.secure,
                                sameSite: opts.sameSite,
                                domain: opts.domain,
                                maxAge: opts.maxAge,
                            })

                            // Diagnostic: clone auth-token chunk cookies under different names.
                            // If clones persist but the original sb-* cookies don't, the rejection is name/attribute related.
                            // If clones also don't persist, it's likely the cookie value content/format.
                            if (isLocalHost && typeof value === 'string' && /^sb-.*-auth-token\.(0|1)$/.test(name)) {
                                const suffix = name.endsWith('.0') ? '0' : '1'
                                response.headers.append(
                                    'set-cookie',
                                    serializeCookie(`illumi_oauth_sb_clone_${suffix}`, value, {
                                        path: '/',
                                        sameSite: 'lax',
                                        maxAge: 60 * 10,
                                        httpOnly: true,
                                        secure: false,
                                    })
                                )
                            }

                            // Append one Set-Cookie header per cookie to avoid header coalescing issues.
                            response.headers.append('set-cookie', serializeCookie(name, value, opts))
                        })

                        try {
                            const anyHeaders: any = response.headers as any
                            const setCookies: string[] = typeof anyHeaders.getSetCookie === 'function' ? anyHeaders.getSetCookie() : []
                            console.log('Auth callback Set-Cookie header count:', Array.isArray(setCookies) ? setCookies.length : 0)
                        } catch {
                            // ignore
                        }
                    },
                },
            }
        )

        const { data: exchangeData, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const exchangeUserId = (exchangeData as any)?.session?.user?.id
            console.log('Auth code exchange succeeded', { exchangeUserId: exchangeUserId || null })

            try {
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
                console.log('Auth callback getSession after exchange:', {
                    hasSession: Boolean(sessionData?.session),
                    userId: sessionData?.session?.user?.id || null,
                    sessionError: sessionError ? (sessionError as any)?.message : null,
                })
            } catch (e) {
                console.log('Auth callback getSession after exchange threw', {
                    message: (e as any)?.message,
                })
            }

            try {
                const anyHeaders: any = response.headers as any
                const setCookies: string[] = typeof anyHeaders.getSetCookie === 'function' ? anyHeaders.getSetCookie() : []
                console.log('Auth callback final Set-Cookie header count:', Array.isArray(setCookies) ? setCookies.length : 0)
            } catch {
                // ignore
            }

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
