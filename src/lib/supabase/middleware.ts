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
        '/landing-page',
        '/contact',
        '/pricing',
        '/invoices/new',
        '/privacy',
        '/terms',
        '/terms-and-conditions',
        '/integrations',
        '/story',
        '/features',
        '/docs',
        '/resources',
        '/blog',
        '/invoice-generator',
        '/invoice-template',
        '/invoice-creator',
        '/invoice-maker',
        '/free-invoice-generator',
        '/proforma-invoice-template',
        '/freelance-invoice-template',
        '/invoice-software-south-africa',
        '/billing-invoicing-software',
        '/online-invoicing',
        '/invoice-management-system',
        '/invoicing-software',
        '/receipt-maker',
        '/for-business',
        '/for-individuals',
        '/what-is-an-invoice',
        '/glossary',
        '/compare',
        '/help',
        '/mobile-app',
        '/hourly-rate-calculator',
        '/percentage-calculator',
        '/sales-tax-calculator',
        '/site-map',
        '/sitemap.xml',
        '/robots.txt',
        '/try',
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

        // Validate session with server for all routes to avoid redirect loops
        // (getSession only reads cookies; getUser validates with Supabase)
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Redirect authenticated users away from home/login to dashboard
        if ((isHomePage || isLoginPage) && user) {
            const url = request.nextUrl.clone()
            url.pathname = '/invoices/new'
            return NextResponse.redirect(url)
        }

        // Redirect unauthenticated users to login for protected routes
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
