import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const pathname = request.nextUrl.pathname

    const publicPrefixes = [
        '/login',
        '/auth',
        '/view',
        '/pay',
        '/contact',
        '/pricing',
        '/privacy',
        '/terms',
        '/terms-and-conditions',
        '/integrations',
        '/story',
        '/features',
        '/docs',
        '/resources',
    ]

    const isPublicRoute = pathname === '/' || publicPrefixes.some((p) => pathname.startsWith(p))

    if (isPublicRoute) {
        return supabaseResponse
    }

    // Skip Supabase auth if credentials are not configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') ||
        supabaseKey.includes('placeholder')) {
        return supabaseResponse
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookieEncoding: 'base64url',
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            const opts: any = { ...(options || {}) }
                            // If Supabase doesn't provide persistence attributes, default to 7 days.
                            if (opts.maxAge === undefined && !opts.expires) {
                                opts.maxAge = 60 * 60 * 24 * 7
                            }
                            supabaseResponse.cookies.set(name, value, opts)
                        })
                    },
                },
            }
        )

        // IMPORTANT: Avoid writing any logic between createServerClient and
        // getUser(). A simple mistake can make it very hard to debug
        // issues with users being randomly logged out.

        // Use getUser() instead of getSession() for more reliable session validation
        // getUser() validates the session with the server and refreshes if needed
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user && !isPublicRoute) {
            const cookieNames = request.cookies.getAll().map((c) => c.name)
            const authCookieNames = cookieNames.filter((n) => n.startsWith('sb-') && n.includes('auth'))
            const cookieHeaderLen = request.headers.get('cookie')?.length
            console.log('Auth middleware: no user, redirecting to /login', {
                pathname,
                cookieHeaderLen,
                authCookiesPresent: authCookieNames,
            })
            // no user, potentially respond by redirecting the user to the login page
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    } catch (e) {
        console.error('Session update error:', e)
    }

    return supabaseResponse
}
