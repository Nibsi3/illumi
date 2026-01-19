import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getURL } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/overview'

    // FORCE local redirection if we are in development/local environment
    // This overrides any Supabase site_url fallback
    let origin = requestUrl.origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        origin = 'http://localhost:3001'
    }

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
        console.error('Auth code exchange error:', error)
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
