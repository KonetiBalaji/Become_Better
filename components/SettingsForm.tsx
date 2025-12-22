'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserSettings } from '@prisma/client'

interface SettingsFormProps {
  initialSettings: UserSettings | null
  timezones: string[]
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
          className={`px-4 py-3 rounded ${
            message.includes('success')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-2">
          Reminder Time
        </label>
        <input
          id="reminderTime"
          type="time"
          value={formData.reminderTime}
          onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          When would you like to receive daily reminders?
        </p>
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          id="timezone"
          value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="darkMode"
            type="checkbox"
            checked={formData.darkMode}
            onChange={(e) => setFormData({ ...formData, darkMode: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
            Push Notifications
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}

