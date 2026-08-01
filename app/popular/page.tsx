import { getPopularTools } from '@/lib/tools-data'
import ToolCard from '@/components/shared/ToolCard'
import Breadcrumb from '@/components/shared/Breadcrumb'
import { generateBaseMetadata, siteConfig } from '@/lib/metadata'

export const metadata = generateBaseMetadata({
  title: `Popular Tools - ${siteConfig.name}`,
  description: `Most popular ${siteConfig.name.toLowerCase()} - ${siteConfig.description}`,
  openGraph: {
    title: `Popular Tools - ${siteConfig.name}`,
    description: `Most popular ${siteConfig.name.toLowerCase()} - ${siteConfig.description}`,
    url: `${siteConfig.url}/popular`,
  },
  alternates: {
    canonical: `${siteConfig.url}/popular`,
  },
})

export default function PopularPage() {
  const popularTools = getPopularTools()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Popular Tools', href: '/popular' }]} />
      <h1 className="text-4xl font-bold text-text-primary mb-8">Popular Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}

