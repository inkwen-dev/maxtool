import { siteConfig } from './metadata'
import { Tool } from '@/types'

/**
 * Generate website structured data (JSON-LD)
 * For homepage
 */
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/all-tools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate tool page structured data (JSON-LD)
 * For individual tool pages
 */
export function generateToolStructuredData(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: `${siteConfig.url}${tool.path}`,
    description: tool.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    featureList: [
      'Free to use',
      'No registration required',
      'Privacy friendly',
      'Fast and simple',
    ],
  }
}

/**
 * Generate category page structured data (JSON-LD)
 * For category list pages
 */
export function generateCategoryStructuredData(
  categoryName: string,
  categoryPath: string,
  toolCount: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Tools - ${siteConfig.name}`,
    url: `${siteConfig.url}${categoryPath}`,
    description: `Browse ${toolCount} free ${categoryName.toLowerCase()} tools. ${siteConfig.description}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: toolCount,
      itemListElement: {
        '@type': 'ListItem',
        position: 1,
        name: `${categoryName} Tools`,
      },
    },
  }
}

/**
 * Generate organization structured data (JSON-LD)
 * For about page
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`, // If logo exists
    description: siteConfig.description,
    sameAs: [
      // Can add social media links
      // 'https://twitter.com/maxtool',
      // 'https://facebook.com/maxtool',
    ],
  }
}

/**
 * Generate breadcrumb navigation structured data (JSON-LD)
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  }
}

