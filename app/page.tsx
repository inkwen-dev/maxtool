import Link from 'next/link'
import { getAllTools, getPopularTools, getToolsByCategory } from '@/lib/tools-data'
import ToolCard from '@/components/shared/ToolCard'
import { generateBaseMetadata, siteConfig } from '@/lib/metadata'
import StructuredData from '@/components/shared/StructuredData'
import { generateWebsiteStructuredData } from '@/lib/structured-data'

export const metadata = generateBaseMetadata({
  title: {
    default: `${siteConfig.name} - ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.slogan}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - ${siteConfig.slogan}`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: siteConfig.url,
  },
})

export default function Home() {
  const popularTools = getPopularTools()
  const categories = [
    { name: 'Random', tools: getToolsByCategory('Random'), icon: '🎲' },
    { name: 'Time', tools: getToolsByCategory('Time'), icon: '🕐' },
    { name: 'Text', tools: getToolsByCategory('Text'), icon: '🔤' },
    { name: 'Utilities', tools: getToolsByCategory('Utilities'), icon: '✨' },
  ]

  return (
    <>
      <StructuredData data={generateWebsiteStructuredData()} />
      <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-5xl font-bold text-text-primary mb-4">
          MaxTool
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Free Online Tools - Simple & Fast. A collection of free, simple, and fast online tools for everyday tasks. 
          No registration required.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/all-tools"
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            Browse All Tools
          </Link>
          <Link
            href="/popular"
            className="px-6 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
          >
            Popular Tools
          </Link>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-text-primary">Popular Tools</h2>
          <Link
            href="/popular"
            className="text-accent hover:text-accent-hover font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className="bg-bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {category.name}
              </h3>
              <p className="text-text-secondary text-sm">
                {category.tools.length} tools
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
    </>
  )
}
