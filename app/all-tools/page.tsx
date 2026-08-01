import { getAllTools } from '@/lib/tools-data'
import ToolCard from '@/components/shared/ToolCard'
import Breadcrumb from '@/components/shared/Breadcrumb'
import { generateBaseMetadata, siteConfig } from '@/lib/metadata'

export const metadata = generateBaseMetadata({
  title: `All Tools - ${siteConfig.name}`,
  description: `Browse all ${siteConfig.name.toLowerCase()} - ${siteConfig.description}`,
  openGraph: {
    title: `All Tools - ${siteConfig.name}`,
    description: `Browse all ${siteConfig.name.toLowerCase()} - ${siteConfig.description}`,
    url: `${siteConfig.url}/all-tools`,
  },
  alternates: {
    canonical: `${siteConfig.url}/all-tools`,
  },
})

export default function AllToolsPage() {
  const allTools = getAllTools()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'All Tools', href: '/all-tools' }]} />
      <h1 className="text-4xl font-bold text-text-primary mb-8">All Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}

