import Link from 'next/link'
import { Tool } from '@/types'
import Card from '@/components/ui/Card'

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.path}>
      <Card hover className="h-full">
        <div className="flex flex-col h-full">
          <div className="text-4xl mb-3">{tool.icon}</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {tool.name}
          </h3>
          <p className="text-text-secondary text-sm flex-grow">
            {tool.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-bg-secondary text-text-secondary text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}

