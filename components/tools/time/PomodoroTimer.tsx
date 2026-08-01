'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import { formatTimeMinutesSeconds } from '@/lib/time-utils'
import { useTimer } from '@/hooks/useTimer'

const WORK_TIME = 25 * 60 // 25 minutes
const BREAK_TIME = 5 * 60 // 5 minutes

export default function PomodoroTimer() {
  const [isBreak, setIsBreak] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [hasTracked, setHasTracked] = useState(false)

  // Use timer hook
  const {
    time: timeLeft,
    isRunning,
    toggle: toggleTimer,
    pause,
    reset: resetTimer,
    setTime,
  } = useTimer({
    type: 'countdown',
    initialTime: WORK_TIME,
    interval: 1000,
    onFinish: () => {
      // Switch between work/break time (user needs to manually start next phase)
      if (isBreak) {
        setIsBreak(false)
        setTime(WORK_TIME)
        setSessions((prevSessions) => prevSessions + 1)
      } else {
        setIsBreak(true)
        setTime(BREAK_TIME)
      }
    },
  })

  // Start/Pause with tracking
  const toggle = () => {
    // Track usage (called when starting timer for the first time)
    if (!isRunning && timeLeft === WORK_TIME && !isBreak) {
      if (!hasTracked) {
        trackUsage('pomodoro')
        setHasTracked(true)
      }
    }
    toggleTimer()
  }

  // Reset
  const reset = () => {
    resetTimer()
    setIsBreak(false)
    setTime(WORK_TIME)
    setHasTracked(false)
  }

  // Skip
  const skip = () => {
    if (isRunning) {
      pause()
    }
    if (isBreak) {
      setIsBreak(false)
      setTime(WORK_TIME)
    } else {
      setIsBreak(true)
      setTime(BREAK_TIME)
    }
  }

  const displayTime = formatTimeMinutesSeconds(timeLeft)

  return (
    <div className="space-y-6">
      {/* Mode display */}
      <div className="text-center">
        <div
          className={`
            rounded-lg p-4 mb-4
            ${isBreak ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error-text'}
          `}
        >
          <p className="text-lg font-semibold">
            {isBreak ? '🍅 Break Time' : '💼 Work Time'}
          </p>
          <p className="text-sm">Sessions completed: {sessions}</p>
        </div>
      </div>

      {/* Time display */}
      <div className="text-center">
        <div
          className={`
            rounded-lg p-12 shadow-lg
            ${isBreak ? 'bg-success' : 'bg-error'}
          `}
        >
          <div className="text-white text-6xl font-bold tabular-nums">
            {displayTime.minutes}:{displayTime.seconds}
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={toggle}
          size="lg"
          variant={isRunning ? 'secondary' : 'primary'}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={skip} size="lg" variant="outline">
          Skip
        </Button>
        <Button onClick={reset} size="lg" variant="outline">
          Reset
        </Button>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Work for 25 minutes, then take a 5-minute break',
          'After 4 work sessions, take a longer break (15-30 minutes)',
          'This technique helps improve focus and productivity',
        ]}
        title="Pomodoro Technique"
        className="bg-info-bg border-info"
      />
    </div>
  )
}

