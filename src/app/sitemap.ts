import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

const docsSlugs = [
  'getting-started',
  'workspace',
  'clients',
  'invoicing',
  'expenses',
  'payments',
  'client-portal',
  'settings',
  'send-invoices-by-email',
  'payfast-online-payments',
  'paygate',
  'vault',
  'troubleshooting',
]

const integrationProviders = [
  'payfast',
  'yoco',
  'ozow',
  'paystack',
  'peach-payments',
  'snapscan',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const paths = [
    '/',
    '/pricing',
    '/contact',
    '/story',
    '/features/overview',
    '/features/inbox',
    '/features/invoice',
    '/features/invoicing',
    '/features/clients',
    '/features/expenses',
    '/features/vault',
    '/features/paygate',
    '/docs',
    ...docsSlugs.map((s) => `/docs/${s}`),
    '/integrations',
    ...integrationProviders.map((p) => `/integrations/${p}`),
    '/privacy',
    '/terms',
    '/terms-and-conditions',
  ]

  return paths.map((path) => {
    const url = `${baseUrl}${path === '/' ? '' : path}`

    const isHome = path === '/'
    const isPricing = path === '/pricing'
    const isFeatures = path.startsWith('/features')
    const isDocs = path === '/docs'
    const isIntegrationsIndex = path === '/integrations'
    const isIntegrationProvider = path.startsWith('/integrations/')
    const isLegal = path === '/privacy' || path === '/terms' || path === '/terms-and-conditions'

    let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    let priority: number

    if (isHome) {
      changeFrequency = 'daily'
      priority = 1.0
    } else if (isPricing) {
      changeFrequency = 'weekly'
      priority = 0.9
    } else if (isFeatures) {
      changeFrequency = 'weekly'
      priority = 0.8
    } else if (isDocs) {
      changeFrequency = 'weekly'
      priority = 0.7
    } else if (isIntegrationsIndex) {
      changeFrequency = 'weekly'
      priority = 0.7
    } else if (isIntegrationProvider) {
      changeFrequency = 'monthly'
      priority = 0.6
    } else if (isLegal) {
      changeFrequency = 'yearly'
      priority = 0.2
    } else {
      changeFrequency = 'monthly'
      priority = 0.5
    }

    return {
      url,
      lastModified: now,
      changeFrequency,
      priority,
    }
  })
}
