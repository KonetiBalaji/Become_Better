import OpenAI from 'openai'
import { Goal, GoalUpdate, GoalCategory } from '@prisma/client'
import { calculateStreak } from './streak-calculator'

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface InsightData {
  goal: Goal
  updates: GoalUpdate[]
  streakData: ReturnType<typeof calculateStreak>
  timezone: string
}

const VERIFIED_SOURCES: Record<GoalCategory, string[]> = {
  Learning: [
    'https://www.coursera.org',
    'https://www.edx.org',
    'https://www.khanacademy.org',
    'https://www.ted.com/talks',
  ],
  Health: [
    'https://www.cdc.gov',
    'https://www.who.int',
    'https://www.mayoclinic.org',
    'https://www.healthline.com',
  ],
  Career: [
    'https://www.linkedin.com/learning',
    'https://www.indeed.com/career-advice',
    'https://hbr.org',
    'https://www.glassdoor.com/blog',
  ],
  Behaviour: [
    'https://www.apa.org',
    'https://www.psychologytoday.com',
    'https://www.mindtools.com',
    'https://www.verywellmind.com',
  ],
  Emotional: [
    'https://www.apa.org/topics/emotion',
    'https://www.psychologytoday.com',
    'https://www.headspace.com',
    'https://www.mindful.org',
  ],
  Financial: [
    'https://www.investopedia.com',
    'https://www.nerdwallet.com',
    'https://www.mint.com',
    'https://www.bankrate.com',
  ],
}

export async function generateInsight(data: InsightData): Promise<{
  content: string
  verifiedSources: string[]
}> {
  const { goal, updates, streakData, timezone } = data

  // Calculate completion rate
  const totalUpdates = updates.length
  const completedUpdates = updates.filter((u) => u.completed).length
  const completionRate = totalUpdates > 0 ? (completedUpdates / totalUpdates) * 100 : 0

  // Get recent pattern (last 7 days)
  const recentUpdates = updates
    .filter((u) => {
      const daysDiff = Math.floor(
        (new Date().getTime() - u.date.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysDiff <= 7
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const recentCompletionRate =
    recentUpdates.length > 0
      ? (recentUpdates.filter((u) => u.completed).length / recentUpdates.length) * 100
      : 0

  // Build prompt
  const prompt = `You are a personal development coach analyzing a user's goal progress. Provide a personalized, encouraging insight based on the following data:

Goal: ${goal.title}
Category: ${goal.category}
Difficulty: ${goal.difficulty}
Description: ${goal.description || 'No description provided'}
Success Definition: ${goal.successDefinition || 'Not defined'}

Progress Data:
- Total updates tracked: ${totalUpdates}
- Completion rate: ${completionRate.toFixed(1)}%
- Current streak: ${streakData.currentStreak} days
- Longest streak: ${streakData.longestStreak} days
- Streak status: ${streakData.status}
- Recent 7-day completion rate: ${recentCompletionRate.toFixed(1)}%

Recent updates pattern: ${recentUpdates.length > 0 ? recentUpdates.map((u) => `${u.date.toISOString().split('T')[0]}: ${u.completed ? 'Completed' : 'Not completed'}`).join(', ') : 'No recent updates'}

Provide a personalized insight that:
1. Acknowledges their progress honestly
2. Identifies patterns (positive or areas for improvement)
3. Offers specific, actionable advice based on their category and difficulty
4. Is encouraging but realistic
5. Is concise (2-3 paragraphs maximum)
6. Focuses on maintaining long streaks and building consistency

Write in a warm, supportive tone. Do not use markdown formatting.`

  try {
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a thoughtful personal development coach who provides personalized, actionable insights to help people achieve their goals. You focus on building consistency and long-term habits.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = completion.choices[0]?.message?.content || 'Unable to generate insight at this time.'

    return {
      content,
      verifiedSources: VERIFIED_SOURCES[goal.category] || [],
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate insight')
  }
}

