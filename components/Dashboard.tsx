import { prisma } from '@/lib/prisma'
import { calculateStreak } from '@/lib/streak-calculator'
import GoalCard from '@/components/GoalCard'
import SignOutButton from '@/components/SignOutButton'
import Link from 'next/link'

interface DashboardProps {
  userId: string
}

export default async function Dashboard({ userId }: DashboardProps) {
  // Get user data for personalization
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      nickname: true,
    },
  })

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

  // Get display name for personalization
  const displayName = user?.nickname || user?.firstName || null

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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass">
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
        <div className={`flex ${goalsWithStreaks.length === 0 ? 'justify-center' : 'justify-between'} items-center mb-10 animate-fade-in`}>
          <div>
            <h2 className="text-4xl font-semibold tracking-tight mb-2">
              {displayName ? `${displayName}, your goals live here` : 'Your goals start here'}
            </h2>
            <p className="text-apple-gray-600 dark:text-apple-gray-400 text-base">
              Track your progress and build lasting habits
            </p>
          </div>
          {goalsWithStreaks.length > 0 && (
            <Link
              href="/goals/new"
              className="apple-button shrink-0"
            >
              + New Goal
            </Link>
          )}
        </div>

        {goalsWithStreaks.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-apple-gray-100 dark:bg-apple-gray-800 mb-6">
              <svg className="w-10 h-10 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3">One goal. One step. Today.</h3>
            <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-8 max-w-md mx-auto text-base leading-relaxed">
              Most people quit because they start too big.
              <br />
              Pick one goal. One action. Today.
            </p>
            
            {/* Subtle 3-step preview */}
            <div className="mb-10 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-8 text-sm text-apple-gray-500 dark:text-apple-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-apple-gray-100 dark:bg-apple-gray-800 flex items-center justify-center">
                    <span className="text-apple-gray-400 dark:text-apple-gray-500 font-medium">1</span>
                  </div>
                  <span className="text-xs">Pick a goal</span>
                </div>
                <div className="w-8 h-px bg-apple-gray-200 dark:bg-apple-gray-700"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-apple-gray-100 dark:bg-apple-gray-800 flex items-center justify-center">
                    <span className="text-apple-gray-400 dark:text-apple-gray-500 font-medium">2</span>
                  </div>
                  <span className="text-xs">Track daily</span>
                </div>
                <div className="w-8 h-px bg-apple-gray-200 dark:bg-apple-gray-700"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-apple-gray-100 dark:bg-apple-gray-800 flex items-center justify-center">
                    <span className="text-apple-gray-400 dark:text-apple-gray-500 font-medium">3</span>
                  </div>
                  <span className="text-xs">See patterns</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/goals/new"
                className="apple-button inline-flex items-center"
              >
                Create your first goal
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <div className="space-y-2">
                <p className="text-sm text-apple-gray-500 dark:text-apple-gray-500">
                  You can change this anytime.
                </p>
                <p className="text-xs text-apple-gray-400 dark:text-apple-gray-600">
                  Your goals are private.
                </p>
              </div>
            </div>
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

