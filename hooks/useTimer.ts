import { useState, useEffect, useRef } from 'react'

export interface UseTimerOptions {
  /**
   * Initial time in seconds (for countdown) or milliseconds (for stopwatch)
   */
  initialTime?: number
  /**
   * Interval in milliseconds (default: 1000 for countdown, 10 for stopwatch)
   */
  interval?: number
  /**
   * Timer type: 'countdown' or 'stopwatch'
   */
  type?: 'countdown' | 'stopwatch'
  /**
   * Callback when timer reaches zero (countdown only)
   */
  onFinish?: () => void
  /**
   * Callback when timer ticks
   */
  onTick?: (time: number) => void
}

export interface UseTimerReturn {
  /**
   * Current time (in seconds for countdown, milliseconds for stopwatch)
   */
  time: number
  /**
   * Whether timer is running
   */
  isRunning: boolean
  /**
   * Start the timer
   */
  start: () => void
  /**
   * Pause the timer
   */
  pause: () => void
  /**
   * Resume the timer
   */
  resume: () => void
  /**
   * Toggle pause/resume
   */
  toggle: () => void
  /**
   * Reset timer to initial time
   */
  reset: () => void
  /**
   * Set time manually
   */
  setTime: (time: number) => void
}

/**
 * Custom hook for timer functionality (countdown or stopwatch)
 * @param options - Timer configuration options
 * @returns Timer state and control functions
 */
export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const {
    initialTime = 0,
    interval = options.type === 'stopwatch' ? 10 : 1000,
    type = 'countdown',
    onFinish,
    onTick,
  } = options

  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      if (type === 'stopwatch') {
        // Stopwatch: count up from current time
        intervalRef.current = setInterval(() => {
          setTime((prev) => {
            const newTime = Date.now() - startTimeRef.current
            if (onTick) {
              onTick(newTime)
            }
            return newTime
          })
        }, interval)
      } else {
        // Countdown: count down to zero
        intervalRef.current = setInterval(() => {
          setTime((prev) => {
            if (prev <= interval / 1000) {
              setIsRunning(false)
              if (onFinish) {
                onFinish()
              }
              return 0
            }
            const newTime = prev - interval / 1000
            if (onTick) {
              onTick(newTime)
            }
            return newTime
          })
        }, interval)
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, type, interval, onFinish, onTick])

  const start = () => {
    if (type === 'stopwatch') {
      startTimeRef.current = Date.now() - time
    }
    setIsRunning(true)
  }

  const pause = () => {
    setIsRunning(false)
  }

  const resume = () => {
    setIsRunning(true)
  }

  const toggle = () => {
    setIsRunning((prev) => !prev)
  }

  const reset = () => {
    setIsRunning(false)
    setTime(initialTime)
    if (type === 'stopwatch') {
      startTimeRef.current = 0
    }
  }

  const setTimeManual = (newTime: number) => {
    setTime(newTime)
    if (type === 'stopwatch') {
      startTimeRef.current = Date.now() - newTime
    }
  }

  return {
    time,
    isRunning,
    start,
    pause,
    resume,
    toggle,
    reset,
    setTime: setTimeManual,
  }
}

