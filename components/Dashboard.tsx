import { prisma } from '@/lib/prisma'
import { calculateStreak } from '@/lib/streak-calculator'
import GoalCard from '@/components/GoalCard'
import SignOutButton from '@/components/SignOutButton'
import Link from 'next/link'

interface DashboardProps {
  userId: string
}

export default async function Dashboard({ userId }: DashboardProps) {
  // Get user's goals with updates
  const goals = await prisma.goal.findMany({
    where: {
      userId,
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

  // Get user settings for timezone
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  })

  const timezone = settings?.timezone || 'UTC'

  // Calculate streaks for each goal
  const goalsWithStreaks = await Promise.all(
    goals.map(async (goal) => {
      const updates = await prisma.goalUpdate.findMany({
        where: { goalId: goal.id },
        orderBy: { date: 'desc' },
      })

      const streak = calculateStreak(updates, timezone)

      return {
        ...goal,
        streak,
      }
    })
  )

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-apple-gray-200/50 dark:border-apple-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-semibold tracking-tight">Become Better</h1>
            <div className="flex items-center gap-6">
              <Link
                href="/settings"
                className="text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-950 dark:hover:text-apple-gray-50 text-sm font-medium transition-colors"
              >
                Settings
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight mb-2">Your Goals</h2>
            <p className="text-apple-gray-600 dark:text-apple-gray-400 text-base">
              Track your progress and build lasting habits
            </p>
          </div>
          <Link
            href="/goals/new"
            className="apple-button shrink-0"
          >
            + New Goal
          </Link>
        </div>

        {goalsWithStreaks.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-apple-gray-100 dark:bg-apple-gray-800 mb-6">
              <svg className="w-10 h-10 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">No goals yet</h3>
            <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-6 max-w-md mx-auto">
              Start your journey by creating your first goal. Every great achievement begins with a single step.
            </p>
            <Link
              href="/goals/new"
              className="apple-button inline-flex items-center"
            >
              Create your first goal
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goalsWithStreaks.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                streak={goal.streak}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

