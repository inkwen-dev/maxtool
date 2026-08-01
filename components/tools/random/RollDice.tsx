'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import HistoryDisplay from '@/components/shared/HistoryDisplay'
import ResultDisplay from '@/components/shared/ResultDisplay'

export default function RollDice() {
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [history, setHistory] = useState<number[]>([])

  // Roll dice
  const rollDice = () => {
    // Track usage (called on actual use)
    trackUsage('roll-dice')
    setIsRolling(true)
    setResult(null)

    // Animation effect
    setTimeout(() => {
      const random = Math.floor(Math.random() * 6) + 1
      setResult(random)
      setHistory([random, ...history].slice(0, 20)) // Keep last 20 results
      setIsRolling(false)
    }, 1000)
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
  }

  // Dice dots display
  const getDiceDots = (num: number) => {
    const dots: { [key: number]: string } = {
      1: '⚀',
      2: '⚁',
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅',
    }
    return dots[num] || '⚀'
  }

  return (
    <div className="space-y-6">
      {/* Dice display area */}
      <div className="text-center">
        <div
          className={`
            mx-auto w-48 h-48 rounded-lg border-4 border-border
            flex items-center justify-center text-8xl
            transition-transform duration-1000
            ${isRolling ? 'animate-spin' : ''}
            bg-bg-card shadow-lg border-border
          `}
        >
          {result ? getDiceDots(result) : '⚀'}
        </div>
      </div>

      {/* Result display */}
      {result && (
        <ResultDisplay result={result} />
      )}

      {/* Buttons */}
      <div className="text-center">
        <Button
          onClick={rollDice}
          disabled={isRolling}
          size="lg"
          className="text-xl px-8 py-4"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </Button>
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Statistics</h3>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const count = history.filter(r => r === num).length
              return (
                <div key={num} className="bg-bg-secondary rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">{getDiceDots(num)}</p>
                  <p className="text-sm text-text-secondary">{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* History */}
      <HistoryDisplay
        history={history}
        onClear={clearHistory}
        renderItem={(result) => (
          <span className="px-3 py-1 bg-bg-card rounded border border-border text-lg">
            {getDiceDots(result)}
          </span>
        )}
      />

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Click "Roll Dice" to roll the dice',
          'Watch the animation and see the result (1-6)',
          'View statistics and history of your rolls',
        ]}
      />
    </div>
  )
}

