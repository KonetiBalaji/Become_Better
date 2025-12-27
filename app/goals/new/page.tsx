'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getGoalSuggestions } from '@/lib/goal-suggestions'

const categories = ['Learning', 'Health', 'Career', 'Behaviour', 'Emotional', 'Financial']

interface Suggestion {
  category: 'Learning' | 'Health' | 'Career' | 'Behaviour' | 'Emotional' | 'Financial'
  icon: string
  note: string
  applied: boolean
}

export default function NewGoalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Learning' as const,
    icon: '',
    difficulty: 'medium' as const, // Default to medium, hidden from user
  })
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null)
  const [appliedSuggestions, setAppliedSuggestions] = useState({
    category: false,
    icon: false,
    description: false,
  })
  const [showFeedback, setShowFeedback] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Debounced suggestion logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title.trim().length >= 3) {
        const suggestion = getGoalSuggestions(formData.title)
        if (suggestion) {
          setSuggestions({ ...suggestion, applied: false })
        } else {
          setSuggestions(null)
        }
      } else {
        setSuggestions(null)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.title])

  // Auto-apply suggestions when they change
  useEffect(() => {
    if (!suggestions) {
      setAppliedSuggestions({ category: false, icon: false, description: false })
      return
    }

    const shouldApplyCategory = formData.category === 'Learning' || 
      (appliedSuggestions.category && formData.category === suggestions.category)
    const shouldApplyIcon = !formData.icon || 
      (appliedSuggestions.icon && formData.icon === suggestions.icon)
    const shouldApplyDescription = !formData.description || 
      (appliedSuggestions.description && formData.description === suggestions.note)

    if (shouldApplyCategory || shouldApplyIcon || shouldApplyDescription) {
      const updates: Partial<typeof formData> = {}
      const applied: typeof appliedSuggestions = { ...appliedSuggestions }
      let hasChanges = false

      if (shouldApplyCategory && formData.category !== suggestions.category) {
        updates.category = suggestions.category
        applied.category = true
        hasChanges = true
      }

      if (shouldApplyIcon && formData.icon !== suggestions.icon) {
        updates.icon = suggestions.icon
        applied.icon = true
        hasChanges = true
      }

      if (shouldApplyDescription && formData.description !== suggestions.note) {
        updates.description = suggestions.note
        applied.description = true
        hasChanges = true
      }

      if (hasChanges) {
        setFormData(prev => ({ ...prev, ...updates }))
        setAppliedSuggestions(applied)
        setSuggestions({ ...suggestions, applied: true })
        setShowFeedback(true)
        setTimeout(() => setShowFeedback(false), 3000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions])

  const handleApplySuggestion = (field: 'category' | 'icon' | 'note') => {
    if (!suggestions) return

    if (field === 'category') {
      setFormData({ ...formData, category: suggestions.category })
    } else if (field === 'icon') {
      setFormData({ ...formData, icon: suggestions.icon })
    } else if (field === 'note') {
      setFormData({ ...formData, description: suggestions.note })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create goal')
        return
      }

      router.push(`/goals/${data.goal.id}`)
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
              Become Better
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Create your first goal</h1>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm">
            Keep it simple. You can always adjust later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 mb-2">
              What do you want to work on? *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Read for 20 minutes daily"
              autoFocus
            />
            
            {/* Suggestions Card */}
            {suggestions && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl animate-fade-in">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                  💡 Suggested setup (you can change this):
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{suggestions.icon}</span>
                    <button
                      type="button"
                      onClick={() => handleApplySuggestion('category')}
                      className="text-sm text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium"
                    >
                      Category: {suggestions.category}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplySuggestion('note')}
                    className="text-sm text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-left block"
                  >
                    Note: {suggestions.note}
                  </button>
                </div>
              </div>
            )}

            {/* Visual feedback for auto-applied suggestions */}
            {showFeedback && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl text-sm text-green-800 dark:text-green-300 animate-fade-in">
                ✓ We filled this in for you — feel free to change it.
              </div>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 mb-2">
              Category {appliedSuggestions.category && (
                <span className="ml-2 text-green-600 dark:text-green-400 text-xs">✓ Applied</span>
              )}
            </label>
            <div className="relative">
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value as any })
                  setAppliedSuggestions({ ...appliedSuggestions, category: false })
                }}
                className={`w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 dark:bg-gray-900 border transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  appliedSuggestions.category && showFeedback
                    ? 'border-green-300 dark:border-green-700'
                    : 'border-gray-300 dark:border-gray-700'
                } text-gray-900 dark:text-gray-100`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-apple-gray-400 dark:text-apple-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 mb-2">
              Why does this goal matter to you? (optional) {appliedSuggestions.description && (
                <span className="ml-2 text-green-600 dark:text-green-400 text-xs">✓ Applied</span>
              )}
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                setAppliedSuggestions({ ...appliedSuggestions, description: false })
              }}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border transition-all resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                appliedSuggestions.description && showFeedback
                  ? 'border-green-300 dark:border-green-700'
                  : 'border-gray-300 dark:border-gray-700'
              } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500`}
              placeholder="A quick note to remind yourself why this goal matters..."
            />
            <p className="mt-2 text-xs text-apple-gray-500 dark:text-apple-gray-500">
              This helps you stay consistent on hard days.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 apple-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create goal'}
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-apple-gray-700 dark:text-apple-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

