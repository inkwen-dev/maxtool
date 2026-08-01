'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import HistoryDisplay from '@/components/shared/HistoryDisplay'
import ResultDisplay from '@/components/shared/ResultDisplay'

export default function FlipCoin() {
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<'heads' | 'tails' | null>(null)
  const [history, setHistory] = useState<('heads' | 'tails')[]>([])

  // Flip coin
  const flipCoin = () => {
    // Track usage (called on actual use)
    trackUsage('flip-coin')
    setIsFlipping(true)
    setResult(null)

    // Animation effect
    setTimeout(() => {
      const random: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails'
      setResult(random)
      setHistory([random, ...history].slice(0, 20)) // Keep last 20 results
      setIsFlipping(false)
    }, 1000)
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
  }

  const headsCount = history.filter(r => r === 'heads').length
  const tailsCount = history.filter(r => r === 'tails').length

  return (
    <div className="space-y-6">
      {/* Coin display area */}
      <div className="text-center">
        <div
          className={`
            mx-auto w-48 h-48 rounded-full border-4 border-border
            flex items-center justify-center text-6xl
            transition-transform duration-1000
            ${isFlipping ? 'animate-spin' : ''}
            ${result === 'heads' ? 'bg-warning' : result === 'tails' ? 'bg-bg-secondary' : 'bg-bg-hover'}
          `}
        >
          {result === 'heads' ? '🪙' : result === 'tails' ? '🪙' : '🪙'}
        </div>
      </div>

      {/* Result display */}
      {result && (
        <ResultDisplay
          result={result.charAt(0).toUpperCase() + result.slice(1)}
        />
      )}

      {/* Buttons */}
      <div className="text-center">
        <Button
          onClick={flipCoin}
          disabled={isFlipping}
          size="lg"
          className="text-xl px-8 py-4"
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </Button>
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-success-bg rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary">Heads</p>
            <p className="text-2xl font-bold text-success">{headsCount}</p>
          </div>
          <div className="bg-error-bg rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary">Tails</p>
            <p className="text-2xl font-bold text-error">{tailsCount}</p>
          </div>
        </div>
      )}

      {/* History */}
      <HistoryDisplay
        history={history}
        onClear={clearHistory}
        renderItem={(result) => (
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              result === 'heads'
                ? 'bg-success-bg text-success-text'
                : 'bg-error-bg text-error-text'
            }`}
          >
            {result === 'heads' ? 'H' : 'T'}
          </span>
        )}
      />

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Click "Flip Coin" to flip the coin',
          'Watch the animation and see the result',
          'View statistics and history of your flips',
        ]}
      />
    </div>
  )
}

