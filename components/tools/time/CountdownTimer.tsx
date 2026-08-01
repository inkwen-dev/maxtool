'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import { formatTime } from '@/lib/time-utils'
import { useTimer } from '@/hooks/useTimer'

export default function CountdownTimer() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [hasTracked, setHasTracked] = useState(false)

  // Calculate total time in seconds
  const totalTime = hours * 3600 + minutes * 60 + seconds
  const canStart = totalTime > 0

  // Use timer hook
  const {
    time: timeLeft,
    isRunning,
    start: startTimer,
    pause,
    resume,
    reset: resetTimer,
    setTime,
  } = useTimer({
    type: 'countdown',
    initialTime: 0,
    interval: 1000,
    onFinish: () => {
      setIsFinished(true)
    },
  })

  // Start countdown
  const start = () => {
    if (totalTime > 0) {
      // Track usage (called when starting countdown)
      if (!hasTracked) {
        trackUsage('countdown-timer')
        setHasTracked(true)
      }
      setTime(totalTime)
      setIsFinished(false)
      startTimer()
    }
  }

  // Pause/Resume
  const togglePause = () => {
    if (isRunning) {
      pause()
    } else {
      resume()
    }
  }

  // Reset
  const reset = () => {
    resetTimer()
    setIsFinished(false)
    setHours(0)
    setMinutes(0)
    setSeconds(0)
    setHasTracked(false)
  }

  const displayTime = formatTime(timeLeft || hours * 3600 + minutes * 60 + seconds)
  const displayHours = displayTime.hours || '00'

  return (
    <div className="space-y-6">
      {/* Time settings */}
      {!isRunning && timeLeft === 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Set Timer</h2>
          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              label="Hours"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
            />
            <Input
              type="number"
              label="Minutes"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
            />
            <Input
              type="number"
              label="Seconds"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
            />
          </div>
          {!canStart && (
            <div className="mt-4 bg-warning-bg border border-warning rounded-lg p-3">
              <p className="text-warning-text text-sm">
                ⚠️ Please set hours, minutes, or seconds before starting the countdown
              </p>
            </div>
          )}
        </div>
      )}

      {/* Countdown display */}
      <div className="text-center">
        <div
          className={`
            rounded-lg p-12 shadow-lg
            ${isFinished 
              ? 'bg-error text-white' 
              : timeLeft > 0 
                ? 'bg-info text-white' 
                : 'bg-info-bg text-info-text border border-info-border'
            }
          `}
        >
          {isFinished ? (
            <div>
              <p className="text-2xl font-bold mb-4">Time's Up!</p>
              <div className="text-6xl font-bold tabular-nums">
                00:00:00
              </div>
            </div>
          ) : (
            <div className="text-6xl font-bold tabular-nums">
              {displayHours}:{displayTime.minutes}:{displayTime.seconds}
            </div>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 justify-center">
        {!isRunning && timeLeft === 0 && (
          <Button onClick={start} size="lg" disabled={!canStart}>
            Start
          </Button>
        )}
        {isRunning && (
          <Button onClick={togglePause} size="lg" variant="secondary">
            Pause
          </Button>
        )}
        {!isRunning && timeLeft > 0 && (
          <Button onClick={togglePause} size="lg">
            Resume
          </Button>
        )}
        <Button onClick={reset} size="lg" variant="outline">
          Reset
        </Button>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Set hours, minutes, and seconds',
          'Click "Start" to begin the countdown',
          'Pause or resume the timer as needed',
          'Reset to start over',
        ]}
        className="bg-info-bg border-info"
      />
    </div>
  )
}

