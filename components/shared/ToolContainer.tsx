'use client'

import { ReactNode } from 'react'
import Breadcrumb from './Breadcrumb'
import StructuredData from './StructuredData'
import { generateBreadcrumbStructuredData } from '@/lib/structured-data'

interface ToolContainerProps {
  title: string
  description: string
  children: ReactNode
  toolId?: string
  category?: string
}

export default function ToolContainer({ 
  title, 
  description, 
  children,
  toolId,
  category
}: ToolContainerProps) {
  // Build breadcrumb navigation items
  const breadcrumbItems: Array<{ name: string; href: string }> = [
    { name: 'Home', href: '/' },
  ]

  // If category exists, add category link (use /tools/[category] path)
  if (category) {
    breadcrumbItems.push({
      name: `${category} Tools`,
      href: `/tools/${category.toLowerCase()}`
    })
  }

  // Add current tool (use new /tools/[category]/[tool-id] path)
  if (toolId && category) {
    breadcrumbItems.push({
      name: title,
      href: `/tools/${category.toLowerCase()}/${toolId}`
    })
  } else if (toolId) {
    // Fallback for tools without category
    breadcrumbItems.push({
      name: title,
      href: `/tools/${toolId}`
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {breadcrumbItems.length > 1 && (
          <>
            <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
            <Breadcrumb items={breadcrumbItems} />
          </>
        )}
        <h1 className="text-3xl font-bold mb-2 text-text-primary">{title}</h1>
        <p className="text-text-secondary mb-8">{description}</p>
        <div className="bg-bg-card rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

