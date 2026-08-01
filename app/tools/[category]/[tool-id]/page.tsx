import { notFound } from 'next/navigation'
import { getToolById, getAllTools } from '@/lib/tools-data'
import { getToolComponent } from '@/lib/tools/components'
import { generateToolMetadata } from '@/lib/metadata'
import ToolContainer from '@/components/shared/ToolContainer'
import StructuredData from '@/components/shared/StructuredData'
import { generateToolStructuredData } from '@/lib/structured-data'

interface ToolPageProps {
  params: Promise<{
    category: string
    'tool-id': string
  }>
}

// Generate static params for SSG
export async function generateStaticParams() {
  const tools = getAllTools()
  return tools.map(tool => ({
    category: tool.category.toLowerCase(),
    'tool-id': tool.id,
  }))
}

// Generate metadata
export async function generateMetadata({ params }: ToolPageProps) {
  const { category, 'tool-id': toolId } = await params
  const tool = getToolById(toolId)
  
  // Validate category matches tool category
  if (!tool || tool.category.toLowerCase() !== category) {
    return {}
  }
  
  return generateToolMetadata(tool.name, tool.description, tool.path)
}

// Page component
export default async function ToolPage({ params }: ToolPageProps) {
  const { category, 'tool-id': toolId } = await params
  const tool = getToolById(toolId)
  
  // Validate tool exists and category matches
  if (!tool || tool.category.toLowerCase() !== category) {
    notFound()
  }

  // Dynamically load component
  const ToolComponent = await getToolComponent(tool.id)
  
  if (!ToolComponent) {
    notFound()
  }

  return (
    <>
      <StructuredData data={generateToolStructuredData(tool)} />
      <ToolContainer 
        title={tool.name} 
        description={tool.description}
        toolId={tool.id}
        category={tool.category}
      >
        <ToolComponent />
      </ToolContainer>
    </>
  )
}

