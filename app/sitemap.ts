import { MetadataRoute } from 'next'
import { getAllTools, getToolsByCategory } from '@/lib/tools-data'
import { siteConfig } from '@/lib/metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const currentDate = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/all-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Category pages (both /category/ and /tools/ paths)
  const categories = ['Random', 'Time', 'Text', 'Utilities']
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((category) => [
    {
      url: `${baseUrl}/category/${category.toLowerCase()}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/${category.toLowerCase()}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9, // Tools category pages have higher priority
    },
  ])

  // Tool pages
  const allTools = getAllTools()
  const toolPages: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1.0,
  }))

  return [...staticPages, ...categoryPages, ...toolPages]
}

