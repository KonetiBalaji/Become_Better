import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { calculateStreak } from '@/lib/streak-calculator'

export const dynamic = 'force-dynamic'

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
      },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Get all updates for this goal
    const updates = await prisma.goalUpdate.findMany({
      where: {
        goalId: params.id,
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Get user timezone
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    })

    const timezone = settings?.timezone || 'UTC'

    // Calculate streak
    const streakData = calculateStreak(updates, timezone)

    return NextResponse.json({ streak: streakData })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Get streak error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

