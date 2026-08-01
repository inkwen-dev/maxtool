/**
 * Time formatting utility functions
 * Shared functions for formatting time in various formats
 */

export interface FormattedTime {
  hours?: string
  minutes: string
  seconds: string
  milliseconds?: string
}

/**
 * Format time in seconds to HH:MM:SS format
 * @param totalSeconds - Total seconds to format
 * @returns Formatted time object
 */
export function formatTime(totalSeconds: number): FormattedTime {
  // Handle negative values
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  return {
    hours: hours > 0 ? hours.toString().padStart(2, '0') : undefined,
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  }
}

/**
 * Format time in milliseconds to MM:SS:MS format
 * @param ms - Milliseconds to format
 * @returns Formatted time object
 */
export function formatTimeWithMilliseconds(ms: number): FormattedTime {
  // Handle negative values
  const safeMs = Math.max(0, ms)
  const totalSeconds = Math.floor(safeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor((safeMs % 1000) / 10)

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: milliseconds.toString().padStart(2, '0'),
  }
}

/**
 * Format time in seconds to MM:SS format (for Pomodoro)
 * @param seconds - Total seconds to format
 * @returns Formatted time object
 */
export function formatTimeMinutesSeconds(seconds: number): { minutes: string; seconds: string } {
  // Handle negative values
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const secs = safeSeconds % 60
  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0'),
  }
}

/**
 * Format time to display string
 * @param formattedTime - Formatted time object
 * @param includeHours - Whether to include hours
 * @param includeMilliseconds - Whether to include milliseconds
 * @returns Display string
 */
export function formatTimeDisplay(
  formattedTime: FormattedTime,
  includeHours = false,
  includeMilliseconds = false
): string {
  const parts: string[] = []

  if (includeHours && formattedTime.hours) {
    parts.push(formattedTime.hours)
  }

  parts.push(formattedTime.minutes)
  parts.push(formattedTime.seconds)

  if (includeMilliseconds && formattedTime.milliseconds) {
    parts.push(formattedTime.milliseconds)
  }

  return parts.join(':')
}

