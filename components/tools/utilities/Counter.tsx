'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import UsageInstructions from '@/components/shared/UsageInstructions'

export default function Counter() {
  const [count, setCount] = useLocalStorage<number>('counter-value', 0)
  const [step, setStep] = useState(1)

  // Increment
  const increment = () => {
    // Track usage (called on actual use, only track on first use)
    if (count === 0 && step === 1) {
      trackUsage('counter')
    }
    setCount(count + step)
  }

  // Decrement
  const decrement = () => {
    setCount(count - step)
  }

  // Reset
  const reset = () => {
    setCount(0)
  }

  return (
    <div className="space-y-6">
      {/* Count display */}
      <div className="text-center">
        <div className="bg-accent/10 border-2 border-accent rounded-lg p-12">
          <p className="text-sm text-text-secondary mb-2">Count</p>
          <p className="text-6xl font-bold text-accent">{count}</p>
        </div>
      </div>

      {/* Step size settings */}
      <div className="text-center">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Step: {step}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="w-full max-w-xs"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1 max-w-xs mx-auto">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={decrement} size="lg" variant="secondary">
          -{step}
        </Button>
        <Button onClick={reset} size="lg" variant="outline">
          Reset
        </Button>
        <Button onClick={increment} size="lg">
          +{step}
        </Button>
      </div>

      {/* Quick buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => setCount(count - 10)} variant="outline">
          -10
        </Button>
        <Button onClick={() => setCount(count + 10)} variant="outline">
          +10
        </Button>
        <Button onClick={() => setCount(count + 100)} variant="outline">
          +100
        </Button>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Click + or - buttons to increment or decrement',
          'Adjust the step value using the slider',
          'Use quick buttons for larger increments',
          'Your count is automatically saved',
        ]}
      />
    </div>
  )
}

