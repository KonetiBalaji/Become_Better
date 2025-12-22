'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GoalUpdateFormProps {
  goalId: string
}

export default function GoalUpdateForm({ goalId }: GoalUpdateFormProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState<boolean | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (completed === null) {
      setError('Please select whether you completed this goal today')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/goals/${goalId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed,
          notes: notes || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update goal')
        return
      }

      // Reset form
      setCompleted(null)
      setNotes('')
      router.refresh()
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Did you complete this goal today?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCompleted(true)}
            className={`flex-1 px-4 py-2 rounded ${
              completed === true
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ✓ Yes
          </button>
          <button
            type="button"
            onClick={() => setCompleted(false)}
            className={`flex-1 px-4 py-2 rounded ${
              completed === false
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ✗ No
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any notes about your progress..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || completed === null}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Saving...' : 'Save Update'}
      </button>
    </form>
  )
}

