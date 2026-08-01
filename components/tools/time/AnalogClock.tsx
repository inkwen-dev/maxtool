'use client'

import { useState, useEffect } from 'react'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import { useTheme } from '@/components/shared/ThemeProvider'

export default function AnalogClock() {
  const [time, setTime] = useState(new Date())
  const { theme } = useTheme()

  // Track usage
  useEffect(() => {
    trackUsage('analog-clock')
  }, [])

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate pointer angles
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  const hourAngle = (hours * 30 + minutes * 0.5) % 360
  const minuteAngle = (minutes * 6 + seconds * 0.1) % 360
  const secondAngle = seconds * 6

  return (
    <div className="space-y-6">
      {/* Clock display */}
      <div className="flex justify-center">
        <div
          className={`
            relative w-64 h-64 rounded-full border-4 border-border
            bg-bg-primary shadow-lg
          `}
        >
          {/* Number markers */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
            const angle = (index * 30 - 90) * (Math.PI / 180)
            const radius = 100
            const x = 50 + radius * Math.cos(angle)
            const y = 50 + radius * Math.sin(angle)

            return (
              <div
                key={num}
                className="absolute text-lg font-bold text-text-primary"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {num}
              </div>
            )
          })}

          {/* Hour hand */}
          <div
            className="absolute w-1 bg-text-primary origin-bottom"
            style={{
              height: '30%',
              left: '50%',
              top: '20%',
              transform: `translateX(-50%) rotate(${hourAngle}deg)`,
              transformOrigin: 'bottom center',
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute w-0.5 bg-text-secondary origin-bottom"
            style={{
              height: '40%',
              left: '50%',
              top: '10%',
              transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              transformOrigin: 'bottom center',
            }}
          />

          {/* Second hand */}
          <div
            className="absolute w-0.5 bg-error origin-bottom"
            style={{
              height: '45%',
              left: '50%',
              top: '5%',
              transform: `translateX(-50%) rotate(${secondAngle}deg)`,
              transformOrigin: 'bottom center',
            }}
          />

          {/* Center point */}
          <div
            className="absolute w-4 h-4 rounded-full bg-text-secondary left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          />
        </div>
      </div>

      {/* Digital time display */}
      <div className="text-center">
        <div className="inline-block px-6 py-3 rounded-lg bg-bg-secondary text-text-primary">
          <p className="text-2xl font-bold tabular-nums">
            {time.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'A classic analog clock showing the current time with hour, minute, and second hands',
          'Toggle between light and dark modes',
        ]}
        title="Analog Clock"
        className="bg-info-bg border-info"
      />
    </div>
  )
}

