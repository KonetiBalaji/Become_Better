import { format, parseISO, startOfDay } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

/**
 * Convert a date to UTC at midnight in the user's timezone
 */
export function getUTCDateForTimezone(date: Date, timezone: string): Date {
  // Get the date string in the user's timezone (YYYY-MM-DD)
  const dateString = format(utcToZonedTime(date, timezone), 'yyyy-MM-dd')
  
  // Parse it as if it's in the user's timezone and convert to UTC
  const zonedDate = parseISO(`${dateString}T00:00:00`)
  return zonedTimeToUtc(zonedDate, timezone)
}

/**
 * Get today's date in UTC for a given timezone
 */
export function getTodayUTC(timezone: string): Date {
  const now = new Date()
  return getUTCDateForTimezone(now, timezone)
}

/**
 * Convert UTC date to user's timezone date string
 */
export function formatDateForTimezone(utcDate: Date, timezone: string): string {
  const zonedDate = utcToZonedTime(utcDate, timezone)
  return format(zonedDate, 'yyyy-MM-dd')
}

/**
 * Get start of day in UTC for a given timezone
 */
export function getStartOfDayUTC(date: Date, timezone: string): Date {
  const zonedDate = utcToZonedTime(date, timezone)
  const startOfDayZoned = startOfDay(zonedDate)
  return zonedTimeToUtc(startOfDayZoned, timezone)
}

