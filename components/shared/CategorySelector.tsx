'use client'

interface Category {
  name: string
  [key: string]: any
}

interface CategorySelectorProps {
  categories: Category[]
  selectedIndex: number
  onSelect: (index: number) => void
  label?: string
  className?: string
}

/**
 * Shared component for category/tab selection UI
 * Used by EmojiList, Symbol
 */
export default function CategorySelector({
  categories,
  selectedIndex,
  onSelect,
  label = 'Category',
  className = '',
}: CategorySelectorProps) {
  // Validate selectedIndex to prevent out-of-bounds errors
  const safeSelectedIndex = Math.max(0, Math.min(selectedIndex, categories.length - 1))

  if (categories.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`
              px-4 py-2 rounded-lg border-2 transition-colors
              ${safeSelectedIndex === index
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border hover:border-accent/50 bg-bg-card text-text-primary'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

