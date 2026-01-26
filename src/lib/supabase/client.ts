import { createBrowserClient } from '@supabase/ssr'

const isLocalHost = (host: string) => {
  const h = (host || '').toLowerCase()
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.localhost')
}

const parseCookieHeader = (cookieHeader: string) => {
  if (!cookieHeader) return [] as { name: string; value: string }[]
  return cookieHeader
    .split(';')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const eq = c.indexOf('=')
      const name = eq === -1 ? c : c.slice(0, eq)
      const value = eq === -1 ? '' : c.slice(eq + 1)
      return { name, value }
    })
}

const serializeCookie = (name: string, value: string, options: any) => {
  const parts: string[] = [`${name}=${value}`]
  const maxAgeNum = options?.maxAge !== undefined ? Number(options.maxAge) : undefined
  parts.push(`Path=${options?.path || '/'}`)
  if (options?.domain) parts.push(`Domain=${options.domain}`)
  if (maxAgeNum !== undefined) parts.push(`Max-Age=${Math.floor(isFinite(maxAgeNum) ? maxAgeNum : 0)}`)
  if (options?.expires) parts.push(`Expires=${new Date(options.expires).toUTCString()}`)
  if (options?.httpOnly) parts.push('HttpOnly')
  if (options?.secure) parts.push('Secure')
  if (options?.sameSite) {
    const s = String(options.sameSite)
    const normalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    parts.push(`SameSite=${normalized}`)
  }
  return parts.join('; ')
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieEncoding: 'base64url',
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return []
          return parseCookieHeader(document.cookie)
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return

          const local = typeof window !== 'undefined' && isLocalHost(window.location.hostname)

          cookiesToSet.forEach(({ name, value, options }) => {
            const opts: any = { ...(options || {}) }
            opts.path = '/'

            if (local) {
              opts.secure = false
              delete opts.domain
              const sameSite = (opts.sameSite ?? '').toString().toLowerCase()
              if (!sameSite || sameSite === 'none') {
                opts.sameSite = 'lax'
              }
            }

            if (opts.maxAge === undefined && !opts.expires) {
              opts.maxAge = 60 * 60 * 24 * 7
            }

            document.cookie = serializeCookie(name, value, opts)
          })
        },
      },
    }
  )
}
