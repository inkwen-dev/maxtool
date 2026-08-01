'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import { formatTimeWithMilliseconds } from '@/lib/time-utils'
import { useTimer } from '@/hooks/useTimer'

export default function Stopwatch() {
  const [laps, setLaps] = useState<number[]>([])
  const [hasTracked, setHasTracked] = useState(false)

  // Use timer hook
  const {
    time,
    isRunning,
    toggle,
    reset: resetTimer,
  } = useTimer({
    type: 'stopwatch',
    initialTime: 0,
    interval: 10, // Update every 10ms to show milliseconds
  })

  // Start/Pause with tracking
  const handleToggle = () => {
    if (!isRunning && time === 0) {
      // Track usage (called when starting timer for the first time)
      if (!hasTracked) {
        trackUsage('stopwatch')
        setHasTracked(true)
      }
    }
    toggle()
  }

  // Reset
  const reset = () => {
    resetTimer()
    setLaps([])
    setHasTracked(false)
  }

  // Record lap
  const lap = () => {
    if (isRunning) {
      setLaps([...laps, time])
    }
  }

  const displayTime = formatTimeWithMilliseconds(time)

  return (
    <div className="space-y-6">
      {/* Time display */}
      <div className="text-center">
        <div className="bg-accent rounded-lg p-12 shadow-lg">
          <div className="text-white text-6xl font-bold tabular-nums">
            {displayTime.minutes}:{displayTime.seconds}.{displayTime.milliseconds}
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleToggle}
          size="lg"
          variant={isRunning ? 'secondary' : 'primary'}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={lap} size="lg" variant="outline" disabled={!isRunning}>
          Lap
        </Button>
        <Button onClick={reset} size="lg" variant="outline">
          Reset
        </Button>
      </div>

      {/* Lap records */}
      {laps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Laps ({laps.length})</h3>
          <div className="bg-bg-secondary rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {laps.map((lapTime, index) => {
                const lapDisplay = formatTimeWithMilliseconds(lapTime)
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-bg-card rounded p-3"
                  >
                    <span className="text-accent font-semibold">Lap {index + 1}</span>
                    <span className="text-lg font-mono text-text-primary">
                      {lapDisplay.minutes}:{lapDisplay.seconds}.{lapDisplay.milliseconds}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Click "Start" to begin timing',
          'Click "Pause" to pause the timer',
          'Click "Lap" to record a lap time',
          'Click "Reset" to clear everything',
        ]}
      />
    </div>
  )
}

