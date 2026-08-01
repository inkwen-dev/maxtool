'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import TextImporter from '@/components/shared/TextImporter'
import { copyToClipboardWithFeedback } from '@/lib/clipboard-utils'

export default function RandomList() {
  const [items, setItems] = useState<string[]>([])
  const [shuffled, setShuffled] = useState<string[]>([])

  // Import list
  const handleImport = (importedItems: string[]) => {
    setItems(importedItems)
  }

  // Random shuffle
  const shuffle = () => {
    if (items.length === 0) return

    // Track usage (called on actual use)
    trackUsage('random-list')

    const shuffledItems = [...items].sort(() => Math.random() - 0.5)
    setShuffled(shuffledItems)
  }

  // Reset
  const reset = () => {
    setItems([])
    setShuffled([])
  }

  return (
    <div className="space-y-6">
      {/* Import list area */}
      <TextImporter
        onImport={handleImport}
        onReset={reset}
        label="Import List"
        buttonText="Import List"
        resetButtonText="Reset"
      />

      {/* Original list */}
      {items.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            Original List ({items.length} items)
          </h2>
          <div className="bg-bg-secondary rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-sm text-text-primary">{item}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Shuffle button */}
      {items.length > 0 && (
        <div className="text-center">
          <Button onClick={shuffle} size="lg" className="text-xl px-8 py-4">
            Shuffle List
          </Button>
        </div>
      )}

      {/* Shuffled list */}
      {shuffled.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Shuffled List ({shuffled.length} items)
            </h2>
            <Button
              variant="outline"
              onClick={() => copyToClipboardWithFeedback(shuffled.join('\n'))}
            >
              Copy All
            </Button>
          </div>
          <div className="bg-accent/10 rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-1">
              {shuffled.map((item, index) => (
                <li key={index} className="text-sm text-text-primary">{item}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Enter items in the text area, one per line',
          'Click "Import List" to load the list',
          'Click "Shuffle List" to randomly reorder items',
          'Copy the shuffled list if needed',
        ]}
      />
    </div>
  )
}

