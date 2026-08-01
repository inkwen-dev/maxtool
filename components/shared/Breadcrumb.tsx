'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

/**
 * Breadcrumb navigation component
 * 
 * Features:
 * 1. Display current page position in site hierarchy
 * 2. Provide quick navigation links to parent pages
 * 3. Improve user experience and SEO
 * 
 * Usage examples:
 * <Breadcrumb /> // Auto-generate from path
 * <Breadcrumb items={[{name: 'Home', href: '/'}, {name: 'Tools', href: '/tools'}]} /> // Manually specify
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()

  // If items not provided, auto-generate from pathname
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbFromPath(pathname)

  // If only homepage, don't show breadcrumb
  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4"
    >
      <ol className="flex items-center space-x-2 text-sm text-text-secondary">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-text-muted" aria-hidden="true">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className="text-text-primary font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Auto-generate breadcrumb from path
 */
function generateBreadcrumbFromPath(pathname: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Home', href: '/' }
  ]

  // Remove leading slash and split path
  const segments = pathname.split('/').filter(Boolean)

  // Handle category pages
  if (segments[0] === 'category' && segments[1]) {
    const categoryName = segments[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    items.push({
      name: `${categoryName} Tools`,
      href: `/category/${segments[1]}`
    })
    return items
  }

  // Handle tool pages - support both /tools/[category]/[tool-id] and /tools/[tool-id]
  if (segments[0] === 'tools' && segments[1]) {
    // Check if it's a category page or tool page
    const validCategories = ['random', 'time', 'text', 'utilities', 'other']
    const isCategoryPage = validCategories.includes(segments[1])
    
    if (isCategoryPage) {
      // Category page: /tools/[category]
      const categoryName = segments[1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      items.push({
        name: `${categoryName} Tools`,
        href: `/tools/${segments[1]}`
      })
      
      // If there's a tool-id, add tool page
      if (segments[2]) {
        const toolId = segments[2]
        const toolName = formatToolName(toolId)
        items.push({
          name: toolName,
          href: `/tools/${segments[1]}/${toolId}`
        })
      }
      return items
    } else {
      // Legacy flat path: /tools/[tool-id] (for backward compatibility)
      const toolId = segments[1]
      const toolName = formatToolName(toolId)
      items.push({
        name: toolName,
        href: `/tools/${toolId}`
      })
      return items
    }
  }

  // Handle other pages
  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const name = formatSegmentName(segment)
    items.push({ name, href })
  })

  return items
}

/**
 * Format tool name
 * Try to get real name from tool data
 */
function formatToolName(toolId: string): string {
  // Dynamically import tool data (avoid circular dependency)
  try {
    // In client components, we can use dynamic imports
    // But for simplicity, use formatted name here
    // If real name needed, can pass from server component
  } catch {
    // If import fails, use formatted name
  }
  
  // Convert kebab-case to Title Case
  return toolId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format path segment name
 */
function formatSegmentName(segment: string): string {
  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

