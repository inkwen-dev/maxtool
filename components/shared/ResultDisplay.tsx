'use client'

import { ReactNode } from 'react'

interface ResultDisplayProps {
  result: ReactNode
  label?: string
  subtitle?: ReactNode
  className?: string
}

/**
 * Shared component for displaying results in a consistent format
 * Used by RandomNumber, FlipCoin, RollDice, Roulette
 */
export default function ResultDisplay({
  result,
  label = 'Result:',
  subtitle,
  className = '',
}: ResultDisplayProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="bg-accent/10 border-2 border-accent rounded-lg p-6">
        {label && (
          <p className="text-sm text-text-secondary mb-2">{label}</p>
        )}
        <div className="text-4xl font-bold text-accent">{result}</div>
        {subtitle && (
          <div className="mt-2 text-sm text-text-muted">{subtitle}</div>
        )}
      </div>
    </div>
  )
}

