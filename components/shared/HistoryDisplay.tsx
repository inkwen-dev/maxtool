'use client'

import { ReactNode } from 'react'
import Button from '@/components/ui/Button'

interface HistoryDisplayProps<T> {
  history: T[]
  onClear: () => void
  renderItem: (item: T, index: number) => ReactNode
  title?: string
  emptyMessage?: string
  maxItems?: number
}

/**
 * Shared component for displaying history with clear button
 * Used by RandomNumber, FlipCoin, RollDice
 */
export default function HistoryDisplay<T>({
  history,
  onClear,
  renderItem,
  title = 'History',
  emptyMessage,
  maxItems,
}: HistoryDisplayProps<T>) {
  if (history.length === 0) {
    if (emptyMessage) {
      return <p className="text-sm text-text-muted text-center">{emptyMessage}</p>
    }
    return null
  }

  const displayHistory = maxItems ? history.slice(0, maxItems) : history

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {title} ({history.length})
        </h3>
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear History
        </Button>
      </div>
      <div className="bg-bg-secondary rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {displayHistory.map((item, index) => (
            <div key={index}>{renderItem(item, index)}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

