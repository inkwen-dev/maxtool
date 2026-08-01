'use client'

import { useState, useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import TextImporter from '@/components/shared/TextImporter'
import ResultDisplay from '@/components/shared/ResultDisplay'

export default function Roulette() {
  const [options, setOptions] = useState<string[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Import options
  const handleImport = (importedOptions: string[]) => {
    setOptions(importedOptions)
  }

  // Spin roulette
  const spin = () => {
    if (options.length === 0) return

    // Track usage (called on actual use)
    trackUsage('roulette')

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setIsSpinning(true)
    setResult(null)
    setSelectedIndex(null)

    // Animation effect: quickly switch options
    let count = 0
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length)
      setSelectedIndex(randomIndex)
      count++
      
      if (count >= 20) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        const finalIndex = Math.floor(Math.random() * options.length)
        setSelectedIndex(finalIndex)
        setResult(options[finalIndex])
        setIsSpinning(false)
      }
    }, 100)
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Reset
  const reset = () => {
    setOptions([])
    setResult(null)
    setSelectedIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* Import options area */}
      <TextImporter
        onImport={handleImport}
        onReset={reset}
        label="Import Options"
        placeholder="Enter options, one per line..."
        buttonText="Import Options"
        resetButtonText="Reset"
      />

      {/* Options display */}
      {options.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            Options ({options.length})
          </h2>
          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`
                    px-3 py-2 rounded text-sm
                    ${
                      selectedIndex === index
                        ? 'bg-accent text-white font-bold scale-110 transition-transform'
                        : 'bg-bg-card text-text-primary'
                    }
                  `}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spin button and result display */}
      <div className="text-center space-y-4">
        <Button
          onClick={spin}
          disabled={options.length === 0 || isSpinning}
          size="lg"
          className="text-xl px-8 py-4"
        >
          {isSpinning ? 'Spinning...' : 'Spin Roulette'}
        </Button>

        {result && (
          <div className="mt-6">
            <ResultDisplay result={result} label="Selected:" />
          </div>
        )}
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Enter options in the text area, one per line',
          'Click "Import Options" to load the list',
          'Click "Spin Roulette" to randomly select an option',
          'Watch the animation as options are highlighted',
        ]}
      />
    </div>
  )
}

