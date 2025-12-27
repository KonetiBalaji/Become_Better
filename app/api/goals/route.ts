import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(['Learning', 'Health', 'Career', 'Behaviour', 'Emotional', 'Financial']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  successDefinition: z.string().optional(),
  icon: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            updates: true,
          },
        },
      },
    })

    return NextResponse.json({ goals })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Get goals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = createGoalSchema.parse(body)

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        difficulty: validatedData.difficulty,
        successDefinition: validatedData.successDefinition,
        icon: validatedData.icon,
      },
    })

    return NextResponse.json({ goal }, { status: 201 })
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

    console.error('Create goal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

