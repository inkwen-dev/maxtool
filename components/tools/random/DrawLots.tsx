'use client'

import { useState, useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import TextImporter from '@/components/shared/TextImporter'
import ResultDisplay from '@/components/shared/ResultDisplay'

export default function DrawLots() {
  const [names, setNames] = useLocalStorage<string[]>('draw-lots-names', [])
  const [winners, setWinners] = useLocalStorage<string[]>('draw-lots-winners', [])
  const [currentWinner, setCurrentWinner] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Import names
  const handleImport = (importedNames: string[]) => {
    setNames(importedNames)
  }

  // Draw lots
  const handleDraw = () => {
    if (names.length === 0) return

    // Track usage (called on actual use)
    trackUsage('draw-lots')
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setIsDrawing(true)
    setErrorMessage(null)
    
    // Animation effect: quickly switch names
    const availableNames = names.filter(name => !winners.includes(name))
    if (availableNames.length === 0) {
      setIsDrawing(false)
      setErrorMessage('All names have been drawn!')
      return
    }

    let count = 0
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNames.length)
      setCurrentWinner(availableNames[randomIndex])
      count++
      
      if (count >= 10) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        const finalIndex = Math.floor(Math.random() * availableNames.length)
        const winner = availableNames[finalIndex]
        setCurrentWinner(winner)
        setWinners((prevWinners) => [...prevWinners, winner]) // Use functional update
        setIsDrawing(false)
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
  const handleReset = () => {
    setNames([])
    setWinners([])
    setCurrentWinner(null)
  }

  // Clear winners list
  const handleClearWinners = () => {
    setWinners([])
    setCurrentWinner(null)
  }

  const availableNames = names.filter(name => !winners.includes(name))

  return (
    <div className="space-y-6">
      {/* Import names area */}
      <TextImporter
        onImport={handleImport}
        onReset={handleReset}
        label="Import Names"
        placeholder="Enter names, one per line..."
        buttonText="Import Names"
        resetButtonText="Reset All"
      />

      {/* Current names display */}
      {names.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            Names ({names.length} total, {availableNames.length} available)
          </h2>
          <div className="bg-bg-secondary rounded-lg p-4 max-h-40 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {names.map((name, index) => {
                const isWinner = winners.includes(name)
                return (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isWinner
                        ? 'bg-error-bg text-error-text line-through'
                        : 'bg-accent/20 text-accent'
                    }`}
                  >
                    {name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-warning-bg border border-warning rounded-lg p-4">
          <p className="text-warning-text text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Draw button and result display */}
      <div className="text-center space-y-4">
        <Button
          onClick={handleDraw}
          disabled={availableNames.length === 0 || isDrawing}
          size="lg"
          className="text-xl px-8 py-4"
        >
          {isDrawing ? 'Drawing...' : 'Draw a Winner'}
        </Button>

        {currentWinner && (
          <div className="mt-6">
            <ResultDisplay result={currentWinner} label="Winner:" />
          </div>
        )}
      </div>

      {/* Winners list */}
      {winners.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Winners ({winners.length})</h2>
            <Button variant="outline" size="sm" onClick={handleClearWinners}>
              Clear Winners
            </Button>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="space-y-2">
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-bg-card rounded p-3"
                >
                  <span className="text-accent font-semibold">#{index + 1}</span>
                  <span className="text-lg text-text-primary">{winner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Enter names in the text area, one per line',
          'Click "Import Names" to load the list',
          'Click "Draw a Winner" to randomly select a name',
          'Winners are automatically excluded from future draws',
          'Click "Clear Winners" to reset the winner list',
        ]}
      />
    </div>
  )
}

