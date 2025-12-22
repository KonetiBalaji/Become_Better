import { differenceInDays, isBefore, isAfter, addDays, subDays, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { GoalUpdate } from '@prisma/client'

export type StreakStatus = 'good' | 'irregular' | 'attention'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  status: StreakStatus
  lastUpdateDate: Date | null
}

/**
 * Calculate streak information for a goal
 */
export function calculateStreak(
  updates: GoalUpdate[],
  timezone: string = 'UTC'
): StreakData {
  // Filter only completed updates and sort by date descending
  const completedUpdates = updates
    .filter((update) => update.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  if (completedUpdates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      status: 'attention',
      lastUpdateDate: null,
    }
  }

  // Convert dates to user's timezone for comparison
  const now = new Date()
  const todayInTimezone = startOfDay(utcToZonedTime(now, timezone))
  const todayUTC = startOfDay(now)

  // Calculate current streak
  let currentStreak = 0
  let expectedDate = todayInTimezone
  let lastUpdateDate: Date | null = null

  for (const update of completedUpdates) {
    const updateDateInTimezone = startOfDay(utcToZonedTime(update.date, timezone))
    
    if (lastUpdateDate === null) {
      lastUpdateDate = update.date
    }

    // Check if this update is for the expected date (today or yesterday for continuation)
    const daysDiff = differenceInDays(expectedDate, updateDateInTimezone)

    if (daysDiff === 0 || (currentStreak === 0 && daysDiff <= 1)) {
      // Today or yesterday - streak continues
      currentStreak++
      expectedDate = subDays(expectedDate, 1)
    } else if (daysDiff === 1 && currentStreak > 0) {
      // Yesterday - streak continues
      currentStreak++
      expectedDate = subDays(expectedDate, 1)
    } else {
      // Gap found - streak broken
      break
    }
  }

  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 0
  let prevDate: Date | null = null

  for (const update of completedUpdates) {
    const updateDateInTimezone = startOfDay(utcToZonedTime(update.date, timezone))

    if (prevDate === null) {
      tempStreak = 1
      prevDate = updateDateInTimezone
    } else {
      const daysDiff = differenceInDays(prevDate, updateDateInTimezone)
      if (daysDiff === 1) {
        // Consecutive day
        tempStreak++
      } else {
        // Gap found - reset streak
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
      prevDate = updateDateInTimezone
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  // Determine status
  let status: StreakStatus = 'attention'
  
  if (currentStreak >= 7) {
    // Check if there are any significant gaps in recent updates
    const recentUpdates = completedUpdates.slice(0, 14) // Last 14 days
    if (recentUpdates.length >= 7) {
      let hasGap = false
      for (let i = 0; i < recentUpdates.length - 1; i++) {
        const daysDiff = differenceInDays(
          startOfDay(utcToZonedTime(recentUpdates[i].date, timezone)),
          startOfDay(utcToZonedTime(recentUpdates[i + 1].date, timezone))
        )
        if (daysDiff > 2) {
          hasGap = true
          break
        }
      }
      status = hasGap ? 'irregular' : 'good'
    } else {
      status = 'good'
    }
  } else if (currentStreak >= 3) {
    status = 'irregular'
  } else {
    // Check if there's a significant gap
    if (lastUpdateDate) {
      const daysSinceLastUpdate = differenceInDays(
        todayInTimezone,
        startOfDay(utcToZonedTime(lastUpdateDate, timezone))
      )
      if (daysSinceLastUpdate > 3) {
        status = 'attention'
      } else {
        status = 'irregular'
      }
    } else {
      status = 'attention'
    }
  }

  return {
    currentStreak,
    longestStreak,
    status,
    lastUpdateDate,
  }
}

/**
 * Get streak status color class (Apple design colors)
 */
export function getStreakStatusColor(status: StreakStatus): string {
  switch (status) {
    case 'good':
      return 'bg-streak-good' // Green
    case 'irregular':
      return 'bg-streak-irregular' // Purple
    case 'attention':
      return 'bg-streak-attention' // Red
    default:
      return 'bg-apple-gray-300'
  }
}

