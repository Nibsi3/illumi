import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getURL } from '@/lib/utils'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/overview'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            let redirectOrigin = requestUrl.origin
            if (redirectOrigin.includes('0.0.0.0')) {
                redirectOrigin = redirectOrigin.replace('0.0.0.0', 'localhost')
            }
            return NextResponse.redirect(`${redirectOrigin}${next}`)
        }
    }

    // return the user to an error page with instructions
    let errorOrigin = requestUrl.origin
    if (errorOrigin.includes('0.0.0.0')) {
        errorOrigin = errorOrigin.replace('0.0.0.0', 'localhost')
    }
    return NextResponse.redirect(`${errorOrigin}/auth/auth-code-error`)
}
