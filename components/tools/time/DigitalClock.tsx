'use client'

import { useState, useEffect } from 'react'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'

export default function DigitalClock() {
  const [time, setTime] = useState(new Date())

  // Track usage
  useEffect(() => {
    trackUsage('digital-clock')
  }, [])

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return { hours, minutes, seconds }
  }

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    const day = days[date.getDay()]
    const month = months[date.getMonth()]
    const dayNum = date.getDate()
    const year = date.getFullYear()

    return `${day}, ${month} ${dayNum}, ${year}`
  }

  const { hours, minutes, seconds } = formatTime(time)

  return (
    <div className="space-y-6">
      {/* Clock display */}
      <div className="text-center">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-12 shadow-lg">
          <p className="text-white text-sm mb-4 opacity-90">{formatDate(time)}</p>
          <div className="flex items-center justify-center gap-2">
            <div className="text-8xl font-bold text-white tabular-nums">
              {hours}
            </div>
            <div className="text-8xl font-bold text-white opacity-50">:</div>
            <div className="text-8xl font-bold text-white tabular-nums">
              {minutes}
            </div>
            <div className="text-8xl font-bold text-white opacity-50">:</div>
            <div className="text-8xl font-bold text-white tabular-nums">
              {seconds}
            </div>
          </div>
        </div>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'A full-screen digital clock showing the current time',
          'The time updates every second',
        ]}
        title="Digital Clock"
        className="bg-info-bg border-info"
      />
    </div>
  )
}

