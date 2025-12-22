import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const settingsSchema = z.object({
  reminderTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  timezone: z.string(),
  darkMode: z.boolean(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    })

    return NextResponse.json({ settings })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: validatedData,
      create: {
        userId: user.id,
        ...validatedData,
      },
    })

    return NextResponse.json({ settings })
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

    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

