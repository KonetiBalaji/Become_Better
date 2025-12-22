import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { calculateStreak } from '@/lib/streak-calculator'
import { generateInsight } from '@/lib/ai-insights'
import { addHours } from 'date-fns'

export const dynamic = 'force-dynamic'

const MAX_INSIGHTS_PER_DAY = 1
const MIN_DAYS_REQUIRED = 7
const CACHE_DURATION_HOURS = 24

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    // Verify goal belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
        isActive: true,
      },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Get all updates
    const updates = await prisma.goalUpdate.findMany({
      where: {
        goalId: params.id,
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Check minimum days requirement
    if (updates.length < MIN_DAYS_REQUIRED) {
      return NextResponse.json(
        {
          error: `Minimum ${MIN_DAYS_REQUIRED} days of data required`,
          daysRequired: MIN_DAYS_REQUIRED,
          daysProvided: updates.length,
        },
        { status: 400 }
      )
    }

    // Check for cached insight
    const cachedInsight = await prisma.insight.findFirst({
      where: {
        goalId: params.id,
        userId: user.id,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        generatedAt: 'desc',
      },
    })

    if (cachedInsight) {
      return NextResponse.json({
        insight: cachedInsight,
        cached: true,
      })
    }

    // Check rate limiting - count insights generated today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayInsights = await prisma.insight.count({
      where: {
        goalId: params.id,
        userId: user.id,
        generatedAt: {
          gte: today,
        },
      },
    })

    if (todayInsights >= MAX_INSIGHTS_PER_DAY) {
      return NextResponse.json(
        {
          error: `Maximum ${MAX_INSIGHTS_PER_DAY} insight(s) per day allowed`,
          nextAvailable: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        { status: 429 }
      )
    }

    // Get user settings for timezone
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    })

    const timezone = settings?.timezone || 'UTC'

    // Calculate streak
    const streakData = calculateStreak(updates, timezone)

    // Generate new insight
    const { content, verifiedSources } = await generateInsight({
      goal,
      updates,
      streakData,
      timezone,
    })

    // Save insight with expiration
    const expiresAt = addHours(new Date(), CACHE_DURATION_HOURS)

    const insight = await prisma.insight.create({
      data: {
        goalId: params.id,
        userId: user.id,
        content,
        verifiedSources: verifiedSources,
        expiresAt,
      },
    })

    return NextResponse.json({
      insight,
      cached: false,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof Error && error.message === 'Failed to generate insight') {
      return NextResponse.json(
        { error: 'Failed to generate insight. Please try again later.' },
        { status: 500 }
      )
    }

    console.error('Get insights error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

