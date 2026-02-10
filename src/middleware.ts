import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl

    // ── Non-www → www 301 redirect (fixes 96 'Discovered - not indexed' in GSC) ──
    const host = request.headers.get('host') || ''
    if (
        host === 'illumi.co.za' &&
        process.env.NODE_ENV === 'production'
    ) {
        const wwwUrl = new URL(url.pathname + url.search, 'https://www.illumi.co.za')
        return NextResponse.redirect(wwwUrl, 301)
    }

    // Some OAuth flows can land on '/' with a `code` param if redirect URLs
    // are misconfigured. Forward to the proper callback handler to avoid loops.
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
        // Match all paths EXCEPT static files and Next.js internals
        '/((?!_next/static|_next/image|favicon\\.ico|logo\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
    ],
}
