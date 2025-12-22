import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, parse } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const dynamic = 'force-dynamic'

/**
 * Vercel Cron endpoint for daily reminders
 * Configure in vercel.json to run at specific intervals
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const currentHour = format(now, 'HH:mm')

    // Get all users with settings
    const users = await prisma.user.findMany({
      where: {
        settings: {
          isNot: null,
        },
      },
      include: {
        settings: true,
        goals: {
          where: {
            isActive: true,
          },
        },
      },
    })

    const remindersSent: string[] = []
    const errors: string[] = []

    for (const user of users) {
      if (!user.settings) continue

      const timezone = user.settings.timezone || 'UTC'
      const userTime = utcToZonedTime(now, timezone)
      const userHour = format(userTime, 'HH:mm')

      // Check if reminder time matches current hour in user's timezone
      if (userHour === user.settings.reminderTime) {
        try {
          // Check if user has active goals
          if (user.goals.length === 0) {
            continue
          }

          // Check if user has pending updates for today
          const todayUTC = new Date(now)
          todayUTC.setHours(0, 0, 0, 0)

          const pendingGoals = []
          for (const goal of user.goals) {
            const todayUpdate = await prisma.goalUpdate.findUnique({
              where: {
                goalId_date: {
                  goalId: goal.id,
                  date: todayUTC,
                },
              },
            })

            if (!todayUpdate) {
              pendingGoals.push(goal)
            }
          }

          if (pendingGoals.length > 0) {
            remindersSent.push(user.id)

            // Send notifications if enabled
            if (user.settings.emailNotifications) {
              const { sendReminderEmail } = await import('@/lib/notifications')
              await sendReminderEmail(user, pendingGoals)
            }

            // Push notifications would be sent here if implemented
            // For now, email notifications are the primary method
          }
        } catch (error) {
          console.error(`Error processing reminder for user ${user.id}:`, error)
          errors.push(user.id)
        }
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent: remindersSent.length,
      errors: errors.length,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Cron reminder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

