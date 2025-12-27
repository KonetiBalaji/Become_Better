import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/SettingsForm'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
]

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="sticky top-0 z-50 glass">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Goals
        </Link>

        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <SettingsForm initialSettings={settings} timezones={TIMEZONES} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
          <p className="text-gray-600 mb-4">
            Deleting your account will permanently remove all your data, including goals, updates, and insights.
          </p>
          <form action="/api/auth/delete" method="POST">
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  e.preventDefault()
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

