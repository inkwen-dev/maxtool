'use client'

import { ReactNode } from 'react'

interface UsageInstructionsProps {
  items: string[]
  title?: string
  className?: string
}

/**
 * Shared component for displaying usage instructions
 * Used by all tool components to maintain consistency
 */
export default function UsageInstructions({
  items,
  title = 'How to use:',
  className = '',
}: UsageInstructionsProps) {
  // If custom className is provided, use it; otherwise use default styles
  const containerClassName = className
    ? `${className} rounded-lg p-4`
    : 'bg-accent/10 border border-accent/30 rounded-lg p-4'
  
  // Determine text color based on background
  const textColor = className?.includes('bg-info-bg') ? 'text-info-text' : 'text-text-secondary'
  const titleColor = className?.includes('bg-info-bg') ? 'text-info' : 'text-accent'

  return (
    <div className={containerClassName}>
      <h3 className={`font-semibold ${titleColor} mb-2`}>{title}</h3>
      <ul className={`text-sm ${textColor} space-y-1 list-disc list-inside`}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

