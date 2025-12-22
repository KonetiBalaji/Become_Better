'use client'

import { useState } from 'react'
import { Goal } from '@prisma/client'

interface ReminderModalProps {
  goals: Goal[]
  onClose: () => void
  onUpdate: (goalId: string, completed: boolean, notes?: string) => Promise<void>
}

export default function ReminderModal({
  goals,
  onClose,
  onUpdate,
}: ReminderModalProps) {
  const [updates, setUpdates] = useState<Record<string, { completed: boolean; notes: string }>>(
    {}
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await Promise.all(
        Object.entries(updates).map(([goalId, data]) =>
          onUpdate(goalId, data.completed, data.notes || undefined)
        )
      )
      onClose()
    } catch (error) {
      console.error('Update error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleGoal = (goalId: string, completed: boolean) => {
    setUpdates((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        completed,
        notes: prev[goalId]?.notes || '',
      },
    }))
  }

  const setNotes = (goalId: string, notes: string) => {
    setUpdates((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        completed: prev[goalId]?.completed ?? false,
        notes,
      },
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Update Your Goals</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleGoal(goal.id, true)}
                      className={`px-4 py-2 rounded ${
                        updates[goal.id]?.completed === true
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      ✓ Done
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGoal(goal.id, false)}
                      className={`px-4 py-2 rounded ${
                        updates[goal.id]?.completed === false
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      ✗ Not Done
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Add notes (optional)"
                  value={updates[goal.id]?.notes || ''}
                  onChange={(e) => setNotes(goal.id, e.target.value)}
                  className="w-full mt-2 p-2 border rounded text-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || Object.keys(updates).length === 0}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Saving...' : 'Save Updates'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

