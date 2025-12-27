'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserSettings } from '@prisma/client'

interface TimezoneOption {
  value: string
  label: string
}

interface SettingsFormProps {
  initialSettings: UserSettings | null
  timezones: TimezoneOption[]
}

export default function SettingsForm({ initialSettings, timezones }: SettingsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    reminderTime: initialSettings?.reminderTime || '21:00',
    timezone: initialSettings?.timezone || 'UTC',
    darkMode: initialSettings?.darkMode || false,
    emailNotifications: initialSettings?.emailNotifications ?? true,
    pushNotifications: initialSettings?.pushNotifications || false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const saveSettings = async (data: typeof formData, showMessage = true) => {
    setLoading(true)
    if (showMessage) setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (showMessage) setMessage('Failed to update settings')
        return false
      }

      if (showMessage) {
        setMessage('Settings saved')
        setTimeout(() => setMessage(''), 3000)
      }
      router.refresh()
      return true
    } catch (error) {
      if (showMessage) setMessage('An error occurred. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveSettings(formData)
  }

  const handleToggle = async (field: 'darkMode' | 'emailNotifications' | 'pushNotifications') => {
    const newValue = !formData[field]
    const updatedData = { ...formData, [field]: newValue }
    setFormData(updatedData)
    // Auto-save toggle changes
    await saveSettings(updatedData, false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${
            message.includes('success')
              ? 'bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50'
              : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label htmlFor="reminderTime" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 mb-2">
          Reminder Time
        </label>
        <input
          id="reminderTime"
          type="time"
          value={formData.reminderTime}
          onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <p className="mt-2 text-sm text-apple-gray-500 dark:text-apple-gray-500">
          When would you like to receive daily reminders?
        </p>
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 mb-2">
          Timezone
        </label>
        <select
          id="timezone"
          value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
        <h3 className="text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4">Preferences</h3>
        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="darkMode" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 cursor-pointer">
                Dark Mode
              </label>
              <p className="text-xs text-apple-gray-500 dark:text-apple-gray-500 mt-1">
                Switch to dark theme
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('darkMode')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              role="switch"
              aria-checked={formData.darkMode}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="emailNotifications" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 cursor-pointer">
                Email Notifications
              </label>
              <p className="text-xs text-apple-gray-500 dark:text-apple-gray-500 mt-1">
                Receive updates via email
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailNotifications')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              role="switch"
              aria-checked={formData.emailNotifications}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="pushNotifications" className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 cursor-pointer">
                Push Notifications
              </label>
              <p className="text-xs text-apple-gray-500 dark:text-apple-gray-500 mt-1">
                Get browser notifications
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('pushNotifications')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.pushNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              role="switch"
              aria-checked={formData.pushNotifications}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}

