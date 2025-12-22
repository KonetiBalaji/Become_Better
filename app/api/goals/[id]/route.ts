import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.enum(['Learning', 'Health', 'Career', 'Behaviour', 'Emotional', 'Financial']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  successDefinition: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const goal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        updates: {
          orderBy: {
            date: 'desc',
          },
          take: 30,
        },
        _count: {
          select: {
            updates: true,
          },
        },
      },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json({ goal })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Get goal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = updateGoalSchema.parse(body)

    // Verify goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    const goal = await prisma.goal.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({ goal })
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

    console.error('Update goal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    // Verify goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Soft delete
    const goal = await prisma.goal.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Goal deleted successfully', goal })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Delete goal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

