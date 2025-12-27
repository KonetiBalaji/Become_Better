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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        setMessage('Failed to update settings')
        return
      }

      setMessage('Settings updated successfully')
      router.refresh()
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
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

      <div className="space-y-4 pt-2">
        <div className="flex items-center">
          <input
            id="darkMode"
            type="checkbox"
            checked={formData.darkMode}
            onChange={(e) => setFormData({ ...formData, darkMode: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
          />
          <label htmlFor="darkMode" className="ml-3 block text-sm text-apple-gray-900 dark:text-apple-gray-100">
            Dark Mode
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="emailNotifications"
            type="checkbox"
            checked={formData.emailNotifications}
            onChange={(e) =>
              setFormData({ ...formData, emailNotifications: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
          />
          <label htmlFor="emailNotifications" className="ml-3 block text-sm text-apple-gray-900 dark:text-apple-gray-100">
            Email Notifications
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="pushNotifications"
            type="checkbox"
            checked={formData.pushNotifications}
            onChange={(e) =>
              setFormData({ ...formData, pushNotifications: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
          />
          <label htmlFor="pushNotifications" className="ml-3 block text-sm text-apple-gray-900 dark:text-apple-gray-100">
            Push Notifications
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full apple-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}

