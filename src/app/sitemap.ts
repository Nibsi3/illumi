import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const baseUrl =
  process.env.NEXT_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.illumi.co.za'

const isRouteGroup = (segment: string) => segment.startsWith('(') && segment.endsWith(')')

const shouldExcludeFromSitemap = (segments: string[]) => {
  const normalized = segments.filter(Boolean)

  if (normalized.some((s) => s.startsWith('[') && s.endsWith(']'))) return true

  const withoutGroups = normalized.filter((s) => !isRouteGroup(s))
  const first = withoutGroups[0]
  if (!first) return false

  if (first === 'site-map') return true

  const excludedFirstSegments = new Set([
    'api',
    'auth',
    'pay',
    'view',
    'login',
    'invite',
    'admin',
    'dashboard',
    'apps',
    'overview',
    'clients',
    'expenses',
    'inbox',
    'invoices',
    'notifications',
    'products',
    'recurring',
    'transactions',
    'upgrade',
    'settings',
  ])

  return excludedFirstSegments.has(first)
}

const toRoutePathFromAppPageFile = (appDir: string, filePath: string) => {
  const rel = path.relative(appDir, filePath)
  const segments = rel.split(path.sep)
  segments.pop()

  if (shouldExcludeFromSitemap(segments)) return null

  const routeSegments = segments.filter((s) => !isRouteGroup(s))
  const routePath = '/' + routeSegments.join('/')
  return routePath === '/' ? '/' : routePath.replace(/\/+$/g, '')
}

const discoverPublicRoutes = () => {
  const appDir = path.join(process.cwd(), 'src', 'app')
  const results: string[] = []

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      if (entry.name === 'node_modules') continue

      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }

      if (entry.isFile() && entry.name === 'page.tsx') {
        const routePath = toRoutePathFromAppPageFile(appDir, full)
        if (routePath) results.push(routePath)
      }
    }
  }

  walk(appDir)

  return Array.from(new Set(results)).sort((a, b) => a.localeCompare(b))
}

// Static comparison pages (dynamic routes excluded from auto-discovery)
const comparisonPages = [
  '/compare/xero',
  '/compare/sage',
  '/compare/zoho-invoice',
  '/compare/quickbooks',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const paths = discoverPublicRoutes()

  // Add comparison pages
  const allPaths = [...paths, ...comparisonPages]

  return allPaths.map((path) => {
    const url = `${baseUrl}${path === '/' ? '' : path}`

    const isHome = path === '/'
    const isPricing = path === '/pricing'
    const isFeatures = path.startsWith('/features')
    const isDocs = path.startsWith('/docs')
    const isIntegrationsIndex = path === '/integrations'
    const isIntegrationProvider = path.startsWith('/integrations/')
    const isResources = path === '/resources' || path.startsWith('/resources/')
    const isLegal = path === '/privacy' || path === '/terms' || path === '/terms-and-conditions'
    const isInvoicingSoftware = path.startsWith('/invoicing-software')
    const isCalculator = path.includes('calculator')
    const isFreeTools = path === '/invoice-generator' || path === '/receipt-maker'
    const isSeoContent = path === '/glossary' || path === '/what-is-an-invoice' || path === '/blog'
    const isSolutions = path === '/for-business' || path === '/for-individuals'
    const isComparison = path.startsWith('/compare/')
    const isSeoLandingPage = path === '/invoice-software-south-africa' || path === '/online-invoicing' || path === '/invoice-management-system' || path === '/billing-invoicing-software'
    const isBlogPost = path.startsWith('/blog/') && path !== '/blog'

    let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    let priority: number

    if (isHome) {
      changeFrequency = 'daily'
      priority = 1.0
    } else if (isSeoLandingPage) {
      changeFrequency = 'weekly'
      priority = 0.95
    } else if (isPricing) {
      changeFrequency = 'weekly'
      priority = 0.9
    } else if (isFreeTools) {
      changeFrequency = 'weekly'
      priority = 0.85
    } else if (isComparison) {
      changeFrequency = 'weekly'
      priority = 0.85
    } else if (isInvoicingSoftware) {
      changeFrequency = 'weekly'
      priority = 0.8
    } else if (isSolutions) {
      changeFrequency = 'weekly'
      priority = 0.8
    } else if (isFeatures) {
      changeFrequency = 'weekly'
      priority = 0.8
    } else if (isBlogPost) {
      changeFrequency = 'monthly'
      priority = 0.75
    } else if (isCalculator) {
      changeFrequency = 'monthly'
      priority = 0.75
    } else if (isSeoContent) {
      changeFrequency = 'weekly'
      priority = 0.7
    } else if (isDocs) {
      changeFrequency = 'weekly'
      priority = 0.7
    } else if (isIntegrationsIndex) {
      changeFrequency = 'weekly'
      priority = 0.7
    } else if (isIntegrationProvider) {
      changeFrequency = 'monthly'
      priority = 0.6
    } else if (isResources) {
      changeFrequency = 'weekly'
      priority = 0.65
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
