'use client'

import { useState } from 'react'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import CategorySelector from '@/components/shared/CategorySelector'
import ClickableGrid from '@/components/shared/ClickableGrid'
import { copyToClipboard } from '@/lib/clipboard-utils'

const symbolCategories = [
  {
    name: 'Mathematical',
    symbols: ['∑', '∏', '∫', '√', '∞', '±', '×', '÷', '≤', '≥', '≠', '≈', '∈', '∉', '⊂', '⊃', '∪', '∩', '∅', '∠', '°', 'π', 'α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ', 'σ', 'Ω']
  },
  {
    name: 'Arrows',
    symbols: ['←', '→', '↑', '↓', '↔', '⇐', '⇒', '⇔', '⇑', '⇓', '↖', '↗', '↘', '↙', '⟵', '⟶', '⟷', '⟸', '⟹', '⟺']
  },
  {
    name: 'Currency',
    symbols: ['$', '€', '£', '¥', '₹', '₽', '₩', '₪', '₦', '₨', '₫', '₭', '₮', '₯', '₰', '₱', '₲', '₳', '₴', '₵', '₶', '₷', '₸', '₹', '₺', '₻', '₼', '₽', '₾', '₿']
  },
  {
    name: 'Special',
    symbols: ['©', '®', '™', '§', '¶', '†', '‡', '•', '…', '‰', '‱', '′', '″', '‴', '※', '‼', '‽', '⁂', '⁎', '⁑', '⁒', '⁓', '⁔', '⁕', '⁖', '⁗', '⁘', '⁙', '⁚', '⁛', '⁜', '⁝', '⁞']
  },
  {
    name: 'Greek',
    symbols: ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']
  },
  {
    name: 'Stars',
    symbols: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⭐', '🌟', '💫', '✨']
  },
]

export default function Symbol() {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  // Copy to clipboard
  const handleCopy = async (symbol: string) => {
    // Track usage (called on actual use, only track on first use)
    if (copied === null) {
      trackUsage('symbol')
    }
    try {
      await copyToClipboard(symbol)
      setCopied(symbol)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category selection */}
      <CategorySelector
        categories={symbolCategories}
        selectedIndex={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Symbol grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-text-primary">
          {symbolCategories[selectedCategory].name} Symbols
        </h2>
        <ClickableGrid
          items={symbolCategories[selectedCategory].symbols}
          renderItem={(symbol) => <span className="text-2xl">{symbol}</span>}
          onItemClick={handleCopy}
          selectedItem={copied}
          columns={12}
          itemClassName={(symbol, index, isSelected) => `
            p-3 bg-bg-card rounded-lg border-2 transition-all hover:scale-110
            ${isSelected
              ? 'border-success bg-success-bg'
              : 'border-border hover:border-accent'
            }
          `}
        />
        {copied && (
          <p className="mt-2 text-sm text-success text-center">
            ✓ Copied "{copied}" to clipboard!
          </p>
        )}
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Select a category to browse symbols',
          'Click on any symbol to copy it to clipboard',
          'Paste the symbol wherever you need it',
        ]}
      />
    </div>
  )
}

