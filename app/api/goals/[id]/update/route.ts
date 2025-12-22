import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { getTodayUTC, getUTCDateForTimezone } from '@/lib/timezone-utils'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateSchema = z.object({
  completed: z.boolean(),
  date: z.string().optional(), // ISO date string, defaults to today
  notes: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = updateSchema.parse(body)

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

    // Get user settings for timezone
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    })

    const timezone = settings?.timezone || 'UTC'

    // Determine the date to use
    let updateDate: Date
    if (validatedData.date) {
      // Parse the provided date and convert to UTC
      updateDate = getUTCDateForTimezone(new Date(validatedData.date), timezone)
    } else {
      // Use today in user's timezone
      updateDate = getTodayUTC(timezone)
    }

    // Check if update already exists for this date
    const existingUpdate = await prisma.goalUpdate.findUnique({
      where: {
        goalId_date: {
          goalId: params.id,
          date: updateDate,
        },
      },
    })

    let goalUpdate
    if (existingUpdate) {
      // Update existing record
      goalUpdate = await prisma.goalUpdate.update({
        where: { id: existingUpdate.id },
        data: {
          completed: validatedData.completed,
          notes: validatedData.notes,
        },
      })
    } else {
      // Create new update
      goalUpdate = await prisma.goalUpdate.create({
        data: {
          goalId: params.id,
          userId: user.id,
          completed: validatedData.completed,
          date: updateDate,
          notes: validatedData.notes,
        },
      })
    }

    return NextResponse.json({ goalUpdate }, { status: existingUpdate ? 200 : 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    // Handle Prisma unique constraint error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Update already exists for this date' },
        { status: 409 }
      )
    }

    console.error('Create update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

