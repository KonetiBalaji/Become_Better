import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const onboardingSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().int().min(1).max(150).optional().nullable(),
  nickname: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = onboardingSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { email: validatedData.email },
      data: {
        firstName: validatedData.firstName || user.firstName,
        lastName: validatedData.lastName || user.lastName,
        age: validatedData.age || user.age,
        nickname: validatedData.nickname || user.nickname,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        nickname: true,
      },
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

