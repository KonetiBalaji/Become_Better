import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { calculateStreak } from '@/lib/streak-calculator'
import StreakVisualization from '@/components/StreakVisualization'
import InsightCard from '@/components/InsightCard'
import GenerateInsightButton from '@/components/GenerateInsightButton'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import GoalUpdateForm from '@/components/GoalUpdateForm'

export default async function GoalDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

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
        take: 60,
      },
    },
  })

  if (!goal) {
    redirect('/')
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  })

  const timezone = settings?.timezone || 'UTC'
  const streak = calculateStreak(goal.updates, timezone)

  // Get latest insight
  const latestInsight = await prisma.insight.findFirst({
    where: {
      goalId: goal.id,
      userId: user.id,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      generatedAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold">
              Become Better
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Goals
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Goals
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{goal.title}</h1>
              {goal.description && (
                <p className="text-gray-600 mb-4">{goal.description}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                  {goal.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm capitalize">
                  {goal.difficulty}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{streak.currentStreak}</div>
              <div className="text-sm text-gray-600">day streak</div>
            </div>
          </div>

          {goal.successDefinition && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2">Success Definition:</h3>
              <p className="text-gray-700">{goal.successDefinition}</p>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Update Progress</h2>
            <GoalUpdateForm goalId={goal.id} />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Streak Statistics</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="font-semibold">{streak.currentStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span>Longest Streak:</span>
                <span className="font-semibold">{streak.longestStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold capitalize">{streak.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <StreakVisualization updates={goal.updates} timezone={timezone} />
        </div>

        {latestInsight && (
          <div className="mt-6">
            <InsightCard
              content={latestInsight.content}
              verifiedSources={
                latestInsight.verifiedSources
                  ? (latestInsight.verifiedSources as string[])
                  : undefined
              }
              generatedAt={latestInsight.generatedAt}
              cached={latestInsight.expiresAt.getTime() > Date.now()}
            />
          </div>
        )}

        <div className="mt-6">
          <GenerateInsightButton goalId={goal.id} />
        </div>
      </main>
    </div>
  )
}

