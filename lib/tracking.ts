import { ToolName } from '@/types'

// Track tool usage
export const trackUsage = async (toolName: ToolName): Promise<void> => {
  try {
    const response = await fetch('/api/track-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: toolName })
    })
    
    if (!response.ok) {
      // Log error without affecting user experience
      const errorData = await response.json().catch(() => ({}))
      console.warn('Tracking failed:', errorData.error || 'Unknown error')
    }
  } catch (error) {
    // Network or other errors, fail silently without affecting user experience
    if (error instanceof Error && error.message.includes('fetch')) {
      // Network error, possibly offline, fail completely silently
      return
    }
    console.warn('Tracking error:', error)
  }
}

