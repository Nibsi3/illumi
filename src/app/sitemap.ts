import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  const now = new Date()

  return [
    {
      url: `${baseUrl}`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
    },
  ]
}
