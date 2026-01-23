import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    // Some OAuth flows can land on '/' with a `code` param if redirect URLs
    // are misconfigured. Forward to the proper callback handler to avoid loops.
    const url = request.nextUrl
    if (url.pathname === '/' && url.searchParams.get('code')) {
        const redirectUrl = url.clone()
        redirectUrl.pathname = '/auth/callback'
        return NextResponse.redirect(redirectUrl)
    }

    const marketingPrefixes = [
        '/',
        '/pricing',
        '/contact',
        '/story',
        '/features',
        '/resources',
        '/docs',
        '/integrations',
        '/privacy',
        '/terms',
        '/terms-and-conditions',
        '/site-map',
    ]

    const isMarketingPath = marketingPrefixes.some((p) => (p === '/' ? url.pathname === '/' : url.pathname.startsWith(p)))
    if (isMarketingPath) {
        let changed = false

        for (const key of Array.from(url.searchParams.keys())) {
            const isUtm = key.toLowerCase().startsWith('utm_')
            const isClickId = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'igshid'].includes(key.toLowerCase())
            if (isUtm || isClickId) {
                url.searchParams.delete(key)
                changed = true
            }
        }

        if (changed) {
            return NextResponse.redirect(url, 308)
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * 1. /api routes
         * 2. /_next (static files)
         * 3. /_static (metadata)
         * 4. /auth/callback (The route that handles the login)
         * 5. /login (The page where users sign in)
         * 6. All images/favicons
         */
        '/((?!api|_next/static|_next/image|auth/callback|login|sitemap\\.xml|robots\\.txt|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)',
    ],
}
