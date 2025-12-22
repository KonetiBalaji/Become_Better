'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GenerateInsightButtonProps {
  goalId: string
}

export default function GenerateInsightButton({ goalId }: GenerateInsightButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/goals/${goalId}/insights`, {
        method: 'GET',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to generate insight')
        return
      }

      router.refresh()
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate New Insight'}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Requires at least 7 days of data. Limited to 1 insight per day.
      </p>
    </div>
  )
}

