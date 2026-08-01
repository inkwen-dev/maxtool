'use client'

import { ReactNode } from 'react'

interface ClickableGridProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  onItemClick: (item: T, index: number) => void
  selectedItem?: T | null
  columns?: number
  className?: string
  itemClassName?: string | ((item: T, index: number, isSelected: boolean) => string)
}

/**
 * Shared component for grid of clickable items (emojis, symbols)
 * Used by EmojiList, Symbol
 */
export default function ClickableGrid<T>({
  items,
  renderItem,
  onItemClick,
  selectedItem,
  columns = 12,
  className = '',
  itemClassName,
}: ClickableGridProps<T>) {
  const getItemClassName = (item: T, index: number, isSelected: boolean): string => {
    if (typeof itemClassName === 'function') {
      return itemClassName(item, index, isSelected)
    }
    if (itemClassName) {
      return itemClassName
    }
    // Default styles
    return `
      p-3 bg-bg-card rounded-lg border-2 transition-all hover:scale-110
      ${isSelected
        ? 'border-success bg-success-bg'
        : 'border-border hover:border-accent'
      }
    `
  }

  // Generate grid columns class (Tailwind doesn't support dynamic classes, so we use a style)
  const gridColsClass = columns === 12 ? 'md:grid-cols-12' : columns === 8 ? 'md:grid-cols-8' : 'md:grid-cols-6'

  return (
    <div className={`bg-bg-secondary rounded-lg p-4 ${className}`}>
      <div className={`grid grid-cols-8 ${gridColsClass} gap-2`}>
        {items.map((item, index) => {
          const isSelected = selectedItem === item
          return (
            <button
              key={index}
              onClick={() => onItemClick(item, index)}
              className={getItemClassName(item, index, isSelected)}
              title={`Click to copy: ${String(item)}`}
            >
              {renderItem(item, index)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

