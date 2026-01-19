import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
        '/((?!api|_next/static|_next/image|auth/callback|login|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
