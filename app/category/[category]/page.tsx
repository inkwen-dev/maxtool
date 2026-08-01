import { getToolsByCategory } from '@/lib/tools-data'
import ToolCard from '@/components/shared/ToolCard'
import { notFound } from 'next/navigation'
import { generateCategoryMetadata } from '@/lib/metadata'
import { Metadata } from 'next'
import StructuredData from '@/components/shared/StructuredData'
import { generateCategoryStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data'
import Breadcrumb from '@/components/shared/Breadcrumb'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  
  if (!category || typeof category !== 'string') {
    return {}
  }
  
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
  const validCategories = ['Random', 'Time', 'Text', 'Utilities']
  
  if (!validCategories.includes(categoryName)) {
    return {}
  }
  
  const tools = getToolsByCategory(categoryName)
  const categoryPath = `/category/${category.toLowerCase()}`
  
  return generateCategoryMetadata(categoryName, categoryPath, tools.length)
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // In Next.js 16, params is a Promise, need to use await to unwrap
  const { category } = await params
  
  if (!category || typeof category !== 'string') {
    notFound()
  }
  
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
  const tools = getToolsByCategory(categoryName)

  // Define valid category list
  const validCategories = ['Random', 'Time', 'Text', 'Utilities']
  
  // If category doesn't exist, show 404
  if (!validCategories.includes(categoryName)) {
    notFound()
  }

  const categoryPath = `/category/${category.toLowerCase()}`

  // Generate breadcrumb structured data
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: `${categoryName} Tools`, href: categoryPath }
  ]

  return (
    <>
      <StructuredData data={generateCategoryStructuredData(categoryName, categoryPath, tools.length)} />
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-4xl font-bold text-text-primary mb-8">
        {categoryName} Tools
      </h1>
      
      {tools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-text-secondary mb-4">
            No tools in this category yet.
          </p>
          <p className="text-text-muted">
            Check back soon for new tools!
          </p>
        </div>
      ) : (
        <>
          <p className="text-text-secondary mb-8">
            {tools.length} {tools.length === 1 ? 'tool' : 'tools'} in this category
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </>
      )}
    </div>
    </>
  )
}

