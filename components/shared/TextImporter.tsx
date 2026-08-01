'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface TextImporterProps {
  onImport: (items: string[]) => void
  onReset?: () => void
  placeholder?: string
  buttonText?: string
  resetButtonText?: string
  label?: string
}

/**
 * Shared component for importing text/items from textarea
 * Used by RandomList, RandomTeam, Roulette, DrawLots
 */
export default function TextImporter({
  onImport,
  onReset,
  placeholder = 'Enter items, one per line...',
  buttonText = 'Import',
  resetButtonText = 'Reset',
  label,
}: TextImporterProps) {
  const [inputText, setInputText] = useState('')

  const handleImport = () => {
    if (!inputText.trim()) return

    const lines = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length > 0) {
      onImport(lines)
      setInputText('')
    }
  }

  const handleReset = () => {
    setInputText('')
    if (onReset) {
      onReset()
    }
  }

  return (
    <div>
      {label && (
        <h2 className="text-xl font-semibold mb-4 text-text-primary">{label}</h2>
      )}
      <div className="space-y-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-border rounded-lg bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[120px]"
        />
        <div className="flex gap-3">
          <Button onClick={handleImport} disabled={!inputText.trim()}>
            {buttonText}
          </Button>
          {onReset && (
            <Button variant="outline" onClick={handleReset}>
              {resetButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

