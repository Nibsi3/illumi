import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/contact',
          '/story',
          '/features',
          '/features/',
          '/docs',
          '/docs/',
          '/integrations',
          '/integrations/',
          '/privacy',
          '/terms',
          '/terms-and-conditions',
        ],
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
          '/invite',
          '/invite/',
          '/pay',
          '/pay/',
          '/view',
          '/view/',
          '/login',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
