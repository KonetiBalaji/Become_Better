import { NextRequest, NextResponse } from 'next/server'
import { generateGoalQuestions } from '@/lib/goal-questions-generator'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const questionsSchema = z.object({
  category: z.enum(['Learning', 'Health', 'Career', 'Behaviour', 'Emotional', 'Financial']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = questionsSchema.parse(body)

    const questions = generateGoalQuestions(
      validatedData.category,
      validatedData.difficulty
    )

    return NextResponse.json({ questions })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Generate questions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

