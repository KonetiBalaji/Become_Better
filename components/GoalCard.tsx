'use client'

import { Goal } from '@prisma/client'
import Link from 'next/link'

interface GoalCardProps {
  goal: Goal & {
    _count?: {
      updates: number
    }
  }
  streak?: {
    currentStreak: number
    status: 'good' | 'irregular' | 'attention'
  }
}

const getStreakColor = (status: 'good' | 'irregular' | 'attention') => {
  switch (status) {
    case 'good':
      return 'bg-streak-good'
    case 'irregular':
      return 'bg-streak-irregular'
    case 'attention':
      return 'bg-streak-attention'
    default:
      return 'bg-apple-gray-300'
  }
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Learning: 'bg-apple-blue-100 dark:bg-apple-blue-900/30 text-apple-blue-700 dark:text-apple-blue-400',
    Health: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    Career: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    Behaviour: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    Emotional: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
    Financial: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  }
  return colors[category] || 'bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-700 dark:text-apple-gray-300'
}

export default function GoalCard({ goal, streak }: GoalCardProps) {
  const streakColor = streak ? getStreakColor(streak.status) : 'bg-apple-gray-300'

  return (
    <Link href={`/goals/${goal.id}`} className="block">
      <div className="apple-card apple-card-hover p-6 h-full group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold mb-2 text-apple-gray-950 dark:text-apple-gray-50 group-hover:text-apple-blue-500 dark:group-hover:text-apple-blue-400 transition-colors">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm mb-3 line-clamp-2">
                {goal.description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-apple text-xs font-medium ${getCategoryColor(goal.category)}`}>
                {goal.category}
              </span>
              <span className="px-3 py-1 rounded-apple text-xs font-medium bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-700 dark:text-apple-gray-300 capitalize">
                {goal.difficulty}
              </span>
            </div>
          </div>
          {streak && (
            <div className="flex-shrink-0 ml-4">
              <div
                className={`w-3 h-3 rounded-full ${streakColor} shadow-sm`}
                title={`Streak: ${streak.currentStreak} days - ${streak.status}`}
              />
            </div>
          )}
        </div>

        {streak && streak.currentStreak > 0 && (
          <div className="mt-5 pt-5 border-t border-apple-gray-200 dark:border-apple-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-apple-gray-500 dark:text-apple-gray-400 mb-1">Current Streak</p>
                <p className="text-lg font-semibold text-apple-gray-950 dark:text-apple-gray-50">
                  {streak.currentStreak}
                  <span className="text-sm font-normal text-apple-gray-600 dark:text-apple-gray-400 ml-1">
                    {streak.currentStreak === 1 ? 'day' : 'days'}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-apple-gray-500 dark:text-apple-gray-400 mb-1">Status</p>
                <p className="text-sm font-medium capitalize text-apple-gray-700 dark:text-apple-gray-300">
                  {streak.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
