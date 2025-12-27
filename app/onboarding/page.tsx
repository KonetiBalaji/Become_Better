'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    age: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push('/register')
    }
  }, [email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      // Redirect to login with success message
      router.push('/login?onboarded=true')
    } catch (error) {
      setError('Something went wrong. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/login?onboarded=true')
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 lg:py-12 bg-white dark:bg-[#1c1c1e]">
      <div className="w-full max-w-md space-y-5 animate-fade-in">
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-400 dark:text-gray-600 font-medium tracking-wide">Step 2 of 2</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Personalize your experience</h1>
          <p className="text-gray-700 dark:text-gray-300 text-base">
            Tell us a bit about yourself. This helps us tailor your journey.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-xl text-sm animate-scale-in">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  First Name
                  <span className="text-gray-500 text-xs font-normal ml-1">(optional)</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Last Name
                  <span className="text-gray-500 text-xs font-normal ml-1">(optional)</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Nickname
                <span className="text-gray-500 text-xs font-normal ml-1">(optional)</span>
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="How should we address you?"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Age
                <span className="text-gray-500 text-xs font-normal ml-1">(optional)</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                max="150"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="25"
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-500">
                Helps us provide age-appropriate insights.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 apple-button-secondary px-4 py-3 min-h-[48px]"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 apple-button px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-500">
          You can update this information anytime in settings.
        </p>
      </div>
    </div>
  )
}

