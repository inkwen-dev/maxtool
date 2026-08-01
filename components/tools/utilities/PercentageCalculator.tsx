'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'

export default function PercentageCalculator() {
  const [value, setValue] = useState('')
  const [percentage, setPercentage] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [calculationType, setCalculationType] = useState<'of' | 'from' | 'change'>('of')
  const [hasTracked, setHasTracked] = useState(false)
  const [valueError, setValueError] = useState<string | null>(null)
  const [percentageError, setPercentageError] = useState<string | null>(null)

  // Validate input
  const validateInput = (inputValue: string, fieldName: string): boolean => {
    if (!inputValue.trim()) {
      return false
    }
    const num = parseFloat(inputValue)
    if (isNaN(num)) {
      return false
    }
    return true
  }

  // Calculate
  const calculate = () => {
    // Reset errors
    setValueError(null)
    setPercentageError(null)

    // Validate inputs
    let hasError = false
    if (calculationType === 'of') {
      if (!validateInput(percentage, 'percentage')) {
        setPercentageError('Please enter a valid percentage')
        hasError = true
      }
      if (!validateInput(value, 'value')) {
        setValueError('Please enter a valid value')
        hasError = true
      }
    } else if (calculationType === 'from') {
      if (!validateInput(value, 'value')) {
        setValueError('Please enter a valid value')
        hasError = true
      }
      if (!validateInput(percentage, 'result')) {
        setPercentageError('Please enter a valid result')
        hasError = true
      }
    } else if (calculationType === 'change') {
      if (!validateInput(percentage, 'from value')) {
        setPercentageError('Please enter a valid from value')
        hasError = true
      }
      if (!validateInput(value, 'to value')) {
        setValueError('Please enter a valid to value')
        hasError = true
      }
    }

    if (hasError) {
      setResult(null)
      return
    }

    // Track usage (called on actual calculation, only track on first calculation)
    if (!hasTracked && value && percentage) {
      trackUsage('percentage')
      setHasTracked(true)
    }
    const val = parseFloat(value)
    const perc = parseFloat(percentage)

    if (isNaN(val) || isNaN(perc)) {
      setResult(null)
      return
    }

    switch (calculationType) {
      case 'of':
        // X% of Y = ?
        setResult((perc / 100) * val)
        break
      case 'from':
        // ?% of X = Y
        setResult((val / perc) * 100)
        break
      case 'change':
        // X to Y = ?% change
        setResult(((val - perc) / perc) * 100)
        break
    }
  }

  // Clear
  const clear = () => {
    setValue('')
    setPercentage('')
    setResult(null)
  }

  useEffect(() => {
    if (value && percentage) {
      calculate()
    } else {
      setResult(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, percentage, calculationType])

  return (
    <div className="space-y-6">
      {/* Calculation type selection */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Calculation Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={() => setCalculationType('of')}
            className={`
              px-4 py-2 rounded-lg border-2 transition-colors
              ${calculationType === 'of'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border hover:border-accent/50 bg-bg-card text-text-primary'
              }
            `}
          >
            X% of Y
          </button>
          <button
            onClick={() => setCalculationType('from')}
            className={`
              px-4 py-2 rounded-lg border-2 transition-colors
              ${calculationType === 'from'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border hover:border-accent/50 bg-bg-card text-text-primary'
              }
            `}
          >
            ?% of X = Y
          </button>
          <button
            onClick={() => setCalculationType('change')}
            className={`
              px-4 py-2 rounded-lg border-2 transition-colors
              ${calculationType === 'change'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border hover:border-accent/50 bg-bg-card text-text-primary'
              }
            `}
          >
            X to Y = ?%
          </button>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-4">
        {calculationType === 'of' && (
          <>
            <Input
              type="number"
              label="Percentage (%)"
              value={percentage}
              onChange={(e) => {
                setPercentage(e.target.value)
                if (percentageError) setPercentageError(null)
              }}
              placeholder="Enter percentage"
              error={percentageError || undefined}
            />
            <Input
              type="number"
              label="Value"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (valueError) setValueError(null)
              }}
              placeholder="Enter value"
              error={valueError || undefined}
            />
          </>
        )}
        {calculationType === 'from' && (
          <>
            <Input
              type="number"
              label="Value"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (valueError) setValueError(null)
              }}
              placeholder="Enter value"
              error={valueError || undefined}
            />
            <Input
              type="number"
              label="Result"
              value={percentage}
              onChange={(e) => {
                setPercentage(e.target.value)
                if (percentageError) setPercentageError(null)
              }}
              placeholder="Enter result"
              error={percentageError || undefined}
            />
          </>
        )}
        {calculationType === 'change' && (
          <>
            <Input
              type="number"
              label="From Value"
              value={percentage}
              onChange={(e) => {
                setPercentage(e.target.value)
                if (percentageError) setPercentageError(null)
              }}
              placeholder="Enter from value"
              error={percentageError || undefined}
            />
            <Input
              type="number"
              label="To Value"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (valueError) setValueError(null)
              }}
              placeholder="Enter to value"
              error={valueError || undefined}
            />
          </>
        )}
      </div>

      {/* Result display */}
      {result !== null && (
        <div className="text-center">
          <div className="bg-accent/10 border-2 border-accent rounded-lg p-8">
            <p className="text-sm text-text-secondary mb-2">Result:</p>
            <p className="text-5xl font-bold text-accent">
              {result.toFixed(2)}
              {calculationType !== 'change' && calculationType !== 'from' && '%'}
              {calculationType === 'from' && '%'}
              {calculationType === 'change' && '%'}
            </p>
            {calculationType === 'of' && (
              <p className="text-sm text-text-muted mt-2">
                {percentage}% of {value} = {result.toFixed(2)}
              </p>
            )}
            {calculationType === 'from' && (
              <p className="text-sm text-text-muted mt-2">
                {result.toFixed(2)}% of {percentage} = {value}
              </p>
            )}
            {calculationType === 'change' && (
              <p className="text-sm text-text-muted mt-2">
                {percentage} to {value} = {result.toFixed(2)}% change
              </p>
            )}
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={clear} variant="outline">
          Clear
        </Button>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'X% of Y: Calculate what percentage X is of value Y',
          '?% of X = Y: Find what percentage of X equals Y',
          'X to Y = ?%: Calculate percentage change from X to Y',
        ]}
      />
    </div>
  )
}

