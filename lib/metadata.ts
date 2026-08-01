import { Metadata } from 'next'

/**
 * Site configuration
 * Centralized management of brand, domain, SEO, etc.
 */
export const siteConfig = {
  name: 'MaxTool',
  shortName: 'MaxTool',
  domain: 'maxtool.me',
  url: 'https://maxtool.me',
  description: 'Free online tools for everyday tasks. Simple, fast, and no registration required.',
  slogan: 'Free Online Tools - Simple & Fast',
  keywords: [
    'free online tools',
    'online tools',
    'random tools',
    'time tools',
    'text tools',
    'utility tools',
    'no registration',
    'privacy friendly',
  ],
  author: 'MaxTool',
  creator: 'MaxTool',
  publisher: 'MaxTool',
  locale: 'en_US',
  type: 'website',
}

/**
 * Generate base metadata
 */
export function generateBaseMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...overrides,
  }
}

/**
 * Generate tool page metadata
 */
export function generateToolMetadata(
  toolName: string,
  toolDescription: string,
  toolPath: string
): Metadata {
  const title = `${toolName} - ${siteConfig.name}`
  const url = `${siteConfig.url}${toolPath}`

  return {
    title,
    description: toolDescription,
    keywords: [
      ...siteConfig.keywords,
      toolName.toLowerCase(),
      ...toolDescription.toLowerCase().split(' ').slice(0, 5),
    ],
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description: toolDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: toolDescription,
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate category page metadata
 */
export function generateCategoryMetadata(
  categoryName: string,
  categoryPath: string,
  toolCount: number
): Metadata {
  const title = `${categoryName} Tools - ${siteConfig.name}`
  const description = `Browse ${toolCount} free ${categoryName.toLowerCase()} tools. ${siteConfig.description}`
  const url = `${siteConfig.url}${categoryPath}`

  return {
    title,
    description,
    keywords: [
      ...siteConfig.keywords,
      `${categoryName.toLowerCase()} tools`,
      categoryName.toLowerCase(),
    ],
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

