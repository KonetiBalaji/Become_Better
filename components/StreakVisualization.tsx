'use client'

import { useState, useEffect } from 'react'
import { format, subDays, isSameDay, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { GoalUpdate } from '@prisma/client'

interface StreakVisualizationProps {
  updates: GoalUpdate[]
  timezone?: string
  daysToShow?: number
}

export default function StreakVisualization({
  updates,
  timezone = 'UTC',
  daysToShow = 30,
}: StreakVisualizationProps) {
  const [mounted, setMounted] = useState(false)
  const [today, setToday] = useState<Date>(new Date())

  useEffect(() => {
    setMounted(true)
    setToday(new Date())
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Last {daysToShow} Days</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysToShow }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded bg-apple-gray-100 dark:bg-apple-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const days = Array.from({ length: daysToShow }, (_, i) => {
    const date = subDays(today, daysToShow - 1 - i)
    return startOfDay(date)
  })

  const updateMap = new Map<string, GoalUpdate>()
  updates.forEach((update) => {
    // Convert UTC date to user's timezone for proper date comparison
    const zonedDate = utcToZonedTime(update.date, timezone)
    const dateKey = format(zonedDate, 'yyyy-MM-dd')
    updateMap.set(dateKey, update)
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Last {daysToShow} Days</h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          // Convert day to user's timezone for comparison
          const zonedDay = utcToZonedTime(day, timezone)
          const dateKey = format(zonedDay, 'yyyy-MM-dd')
          const update = updateMap.get(dateKey)
          const isToday = isSameDay(zonedDay, utcToZonedTime(today, timezone))

          let bgColor = 'bg-apple-gray-100 dark:bg-apple-gray-800'
          if (update) {
            bgColor = update.completed ? 'bg-streak-good' : 'bg-red-300 dark:bg-red-900/30'
          }

          return (
            <div
              key={index}
              className={`aspect-square rounded ${bgColor} ${
                isToday ? 'ring-2 ring-apple-blue-500' : ''
              } flex items-center justify-center text-xs text-apple-gray-950 dark:text-apple-gray-50`}
              title={format(zonedDay, 'MMM dd, yyyy')}
            >
              {format(zonedDay, 'd')}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 text-sm text-apple-gray-600 dark:text-apple-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-streak-good rounded" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 dark:bg-red-900/30 rounded" />
          <span>Not Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-apple-gray-100 dark:bg-apple-gray-800 rounded" />
          <span>No Update</span>
        </div>
      </div>
    </div>
  )
}

