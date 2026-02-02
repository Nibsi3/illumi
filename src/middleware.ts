import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const RATE_LIMIT_WINDOW_MS = 60_000
const rateLimitState = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest) {
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    if (cfConnectingIp) return cfConnectingIp.trim()

    const xRealIp = request.headers.get('x-real-ip')
    if (xRealIp) return xRealIp.trim()

    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0]?.trim()
    return ip || 'unknown'
}

function checkRateLimit(request: NextRequest, opts: { limit: number; windowMs: number }) {
    const ip = getClientIp(request)
    if (!ip || ip === 'unknown') {
        return { ok: true as const, remaining: null as number | null, retryAfterSeconds: null as number | null }
    }

    const key = `${ip}:${request.nextUrl.pathname}`
    const now = Date.now()
    const existing = rateLimitState.get(key)
    if (!existing || now >= existing.resetAt) {
        rateLimitState.set(key, { count: 1, resetAt: now + opts.windowMs })
        return { ok: true as const, remaining: opts.limit - 1, retryAfterSeconds: null as number | null }
    }

    if (existing.count >= opts.limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
        return { ok: false as const, remaining: 0, retryAfterSeconds }
    }

    existing.count += 1
    rateLimitState.set(key, existing)
    return { ok: true as const, remaining: Math.max(0, opts.limit - existing.count), retryAfterSeconds: null as number | null }
}

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

    const isPublicInvoiceApi = url.pathname === '/api/invoices/public' || url.pathname === '/api/invoices/mark-viewed'
    const isPublicInvoicePage = url.pathname.startsWith('/view/')

    if (isPublicInvoiceApi || isPublicInvoicePage) {
        const ua = request.headers.get('user-agent') || ''
        if (!ua.trim()) {
            return new NextResponse('Bad Request', { status: 400 })
        }

        const limit = url.pathname === '/api/invoices/mark-viewed' ? 12 : 60
        const rl = checkRateLimit(request, { limit, windowMs: RATE_LIMIT_WINDOW_MS })
        if (!rl.ok) {
            const res = NextResponse.json(
                { success: false, error: 'Too many requests' },
                { status: 429 }
            )
            res.headers.set('Retry-After', String(rl.retryAfterSeconds || 60))
            res.headers.set('Cache-Control', 'no-store')
            return res
        }

        const res = NextResponse.next()
        res.headers.set('Cache-Control', 'no-store')
        if (rl.remaining !== null) {
            res.headers.set('X-RateLimit-Limit', String(limit))
            res.headers.set('X-RateLimit-Remaining', String(rl.remaining))
        }
        return res
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        '/',
        '/pricing',
        '/contact',
        '/story',
        '/features/:path*',
        '/resources/:path*',
        '/docs/:path*',
        '/integrations/:path*',
        '/privacy',
        '/terms',
        '/terms-and-conditions',
        '/site-map',
        '/apps/:path*',
        '/clients/:path*',
        '/expenses/:path*',
        '/inbox/:path*',
        '/invoices/:path*',
        '/notifications/:path*',
        '/overview/:path*',
        '/products/:path*',
        '/recurring/:path*',
        '/settings/:path*',
        '/transactions/:path*',
        '/upgrade/:path*',
        '/view/:path*',
        '/api/invoices/public',
        '/api/invoices/mark-viewed',
    ],
}
