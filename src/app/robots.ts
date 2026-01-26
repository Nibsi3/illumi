import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.illumiinvoice.com'

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
          '/features/*',
          '/resources',
          '/resources/',
          '/resources/*',
          '/docs',
          '/docs/',
          '/docs/*',
          '/integrations',
          '/integrations/',
          '/integrations/*',
          '/privacy',
          '/terms',
          '/terms-and-conditions',
        ],
        disallow: [
          '/apps',
          '/apps/',
          '/overview',
          '/overview/',
          '/clients',
          '/clients/',
          '/expenses',
          '/expenses/',
          '/inbox',
          '/inbox/',
          '/invoices',
          '/invoices/',
          '/notifications',
          '/notifications/',
          '/products',
          '/products/',
          '/recurring',
          '/recurring/',
          '/transactions',
          '/transactions/',
          '/upgrade',
          '/upgrade/',
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
