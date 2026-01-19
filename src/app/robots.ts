import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/login'],
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/invoices',
          '/invoices/',
          '/settings',
          '/settings/',
          '/api',
          '/api/',
          '/auth',
          '/auth/',
          '/pay',
          '/pay/',
          '/view',
          '/view/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
