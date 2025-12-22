import { GoalCategory, GoalDifficulty } from '@prisma/client'

export interface GoalQuestion {
  id: string
  question: string
  type: 'why' | 'when' | 'how' | 'obstacles'
  placeholder?: string
}

/**
 * Generate unique questions based on goal category and difficulty
 */
export function generateGoalQuestions(
  category: GoalCategory,
  difficulty: GoalDifficulty
): GoalQuestion[] {
  const baseQuestions: GoalQuestion[] = [
    {
      id: 'why',
      question: 'Why do you want to achieve this goal?',
      type: 'why',
      placeholder: 'What motivates you? What will change in your life?',
    },
    {
      id: 'when',
      question: 'When do you plan to work on this?',
      type: 'when',
      placeholder: 'Morning, evening, specific days of the week...',
    },
    {
      id: 'how',
      question: 'How will you measure your success?',
      type: 'how',
      placeholder: 'What does success look like for you?',
    },
    {
      id: 'obstacles',
      question: 'What obstacles might you face?',
      type: 'obstacles',
      placeholder: 'Time constraints, motivation, resources...',
    },
  ]

  // Customize questions based on category
  const categorySpecificQuestions: Record<GoalCategory, Partial<Record<string, string>>> = {
    Learning: {
      why: 'Why is learning this important to you?',
      how: 'How will you know you\'ve mastered this?',
      obstacles: 'What might make it hard to stay consistent with learning?',
    },
    Health: {
      why: 'Why is improving your health important right now?',
      how: 'How will you track your health improvements?',
      obstacles: 'What might derail your health goals?',
    },
    Career: {
      why: 'Why is this career goal meaningful to you?',
      how: 'How will you measure career progress?',
      obstacles: 'What challenges might you face in your career path?',
    },
    Behaviour: {
      why: 'Why do you want to change this behavior?',
      how: 'How will you know the behavior has changed?',
      obstacles: 'What triggers might make it hard to change?',
    },
    Emotional: {
      why: 'Why is emotional growth important to you?',
      how: 'How will you recognize emotional progress?',
      obstacles: 'What situations might challenge your emotional goals?',
    },
    Financial: {
      why: 'Why is this financial goal important?',
      how: 'How will you measure financial progress?',
      obstacles: 'What might prevent you from reaching this financial goal?',
    },
  }

  // Customize questions based on difficulty
  const difficultySpecificQuestions: Record<GoalDifficulty, Partial<Record<string, string>>> = {
    easy: {
      obstacles: 'What small challenges might come up?',
    },
    medium: {
      obstacles: 'What moderate challenges should you prepare for?',
    },
    hard: {
      obstacles: 'What significant obstacles will you need to overcome?',
      how: 'How will you break this down into smaller milestones?',
    },
  }

  // Apply customizations
  const customizedQuestions = baseQuestions.map((q) => {
    let question = q.question

    // Apply category-specific customization
    if (categorySpecificQuestions[category]?.[q.type]) {
      question = categorySpecificQuestions[category][q.type]!
    }

    // Apply difficulty-specific customization (only for obstacles and how)
    if (q.type === 'obstacles' || q.type === 'how') {
      if (difficultySpecificQuestions[difficulty]?.[q.type]) {
        question = difficultySpecificQuestions[difficulty][q.type]!
      }
    }

    return {
      ...q,
      question,
    }
  })

  return customizedQuestions
}

