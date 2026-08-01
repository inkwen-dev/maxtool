/**
 * Clipboard utility functions
 * Shared functions for copying text to clipboard
 */

import { useState, useCallback } from 'react'

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copy is successful
 */
export async function copyToClipboard(text: string): Promise<void> {
  // Check if clipboard API is available
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    throw new Error('Clipboard API is not available in this browser')
  }

  // Validate input
  if (typeof text !== 'string') {
    throw new Error('Text must be a string')
  }

  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    throw err
  }
}

/**
 * Custom hook for copying text to clipboard with feedback
 * @returns Object with copyToClipboard function and showCopySuccess flag
 */
export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  const copyToClipboardWithFeedback = useCallback(async (text: string) => {
    try {
      await copyToClipboard(text)
      setCopiedText(text)
      setShowCopySuccess(true)
      setTimeout(() => {
        setCopiedText(null)
        setShowCopySuccess(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  return {
    copiedText,
    copyToClipboard: copyToClipboardWithFeedback,
    showCopySuccess,
  }
}

/**
 * Copy text to clipboard with user feedback
 * @param text - Text to copy
 * @param onSuccess - Optional callback when copy succeeds
 * @param onError - Optional callback when copy fails
 */
export async function copyToClipboardWithFeedback(
  text: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    await copyToClipboard(text)
    if (onSuccess) {
      onSuccess()
    } else {
      alert('Copied to clipboard!')
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to copy')
    if (onError) {
      onError(error)
    } else {
      console.error('Failed to copy:', error)
    }
  }
}

