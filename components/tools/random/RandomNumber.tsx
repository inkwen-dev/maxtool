'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import HistoryDisplay from '@/components/shared/HistoryDisplay'

export default function RandomNumber() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [result, setResult] = useState<number | null>(null)
  const [history, setHistory] = useState<number[]>([])

  // Check if min > max (values will be swapped)
  const minNum = Math.min(min, max)
  const maxNum = Math.max(min, max)
  const isSwapped = min > max

  // Generate random number
  const generateRandom = () => {
    // Track usage (called on actual use)
    trackUsage('random-number')
    const random = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
    setResult(random)
    setHistory([random, ...history].slice(0, 10)) // Keep last 10 results
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Minimum"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
          <Input
            type="number"
            label="Maximum"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
        </div>
        {isSwapped && (
          <div className="bg-info-bg border border-info rounded-lg p-3">
            <p className="text-info-text text-sm">
              ℹ️ Minimum is greater than maximum. Values will be automatically swapped.
            </p>
          </div>
        )}
      </div>

      {/* Generate button */}
      <div className="text-center">
        <Button onClick={generateRandom} size="lg" className="text-xl px-8 py-4">
          Generate Random Number
        </Button>
      </div>

      {/* Result display */}
      {result !== null && (
        <div className="text-center">
          <div className="bg-accent/10 border-2 border-accent rounded-lg p-8">
            <p className="text-sm text-text-secondary mb-2">Random Number:</p>
            <p className="text-5xl font-bold text-accent">{result}</p>
            <p className="text-sm text-text-muted mt-2">
              Range: {minNum} - {maxNum}
            </p>
          </div>
        </div>
      )}

      {/* History */}
      <HistoryDisplay
        history={history}
        onClear={clearHistory}
        renderItem={(num) => (
          <span className="px-3 py-1 bg-bg-card rounded border border-border text-sm text-text-primary">
            {num}
          </span>
        )}
        title="Recent Numbers"
      />

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Enter the minimum and maximum values',
          'Click "Generate Random Number" to get a random number',
          'The number will be between your min and max (inclusive)',
        ]}
      />
    </div>
  )
}

