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
    const isHomePage = pathname === '/'
    const isLoginPage = pathname === '/login' || pathname.startsWith('/login')

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

        // For public routes (home/login), use getSession() to check if user is logged in
        // This reads from cookies without making a server call, reducing egress
        // For protected routes, use getUser() which validates with the server
        if (isHomePage || isLoginPage) {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                const url = request.nextUrl.clone()
                url.pathname = '/overview'
                return NextResponse.redirect(url)
            }
            return supabaseResponse
        }

        // For protected routes, validate session with server
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user && !isPublicRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    } catch (e) {
        console.error('Session update error:', e)
    }

    return supabaseResponse
}
