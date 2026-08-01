'use client'

import { useState, useEffect, ReactNode } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { trackUsage } from '@/lib/tracking'
import { useClipboard } from '@/lib/clipboard-utils'
import type { ToolName } from '@/types'

interface FontStyle {
  name: string
  transform: (text: string) => string
}

interface FontToolBaseProps {
  toolId: ToolName
  fontStyles: FontStyle[]
  defaultText?: string
  label?: string
  placeholder?: string
  instructions?: ReactNode
}

export default function FontToolBase({
  toolId,
  fontStyles,
  defaultText = 'Hello World',
  label = 'Font Style',
  placeholder = 'Type your text here...',
  instructions,
}: FontToolBaseProps) {
  const [inputText, setInputText] = useState(defaultText)
  const [selectedStyle, setSelectedStyle] = useState(0)
  const [output, setOutput] = useState('')
  const [hasTracked, setHasTracked] = useState(false)
  const { copyToClipboard: copyToClipboardWithFeedback, showCopySuccess } = useClipboard()

  // Generate font
  useEffect(() => {
    if (inputText) {
      const transformed = fontStyles[selectedStyle].transform(inputText)
      setOutput(transformed)
      // Track usage (called on first generation)
      if (!hasTracked) {
        trackUsage(toolId)
        setHasTracked(true)
      }
    } else {
      setOutput('')
    }
  }, [inputText, selectedStyle, hasTracked, fontStyles, toolId])

  // Copy to clipboard handler
  const handleCopy = () => {
    copyToClipboardWithFeedback(output)
  }

  const defaultInstructions = (
    <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
      <li>Enter your text in the input field</li>
      <li>Select a font style</li>
      <li>Copy the generated text</li>
      <li>Use it in social media, documents, or anywhere you want</li>
    </ul>
  )

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div>
        <Input
          label="Enter Text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {/* Font style selection */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {fontStyles.map((style, index) => (
            <button
              key={index}
              onClick={() => setSelectedStyle(index)}
              className={`
                px-4 py-2 rounded-lg border-2 transition-colors
                ${selectedStyle === index
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border hover:border-accent/50 bg-bg-card text-text-primary'
                }
              `}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Output area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-text-secondary">
            Generated Text
          </label>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            Copy
          </Button>
        </div>
        <div className="bg-bg-secondary border border-border rounded-lg p-4 min-h-[100px]">
          <p className="text-2xl break-all text-text-primary">{output || 'Generated text will appear here...'}</p>
        </div>
        {showCopySuccess && (
          <p className="mt-2 text-sm text-success text-center">
            ✓ Copied to clipboard!
          </p>
        )}
      </div>

      {/* Usage instructions */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
        <h3 className="font-semibold text-accent mb-2">How to use:</h3>
        {instructions || defaultInstructions}
      </div>
    </div>
  )
}

