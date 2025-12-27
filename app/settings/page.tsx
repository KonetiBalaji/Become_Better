import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/SettingsForm'
import DeleteAccountButton from '@/components/DeleteAccountButton'
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

  // Get user data for avatar
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      firstName: true,
      lastName: true,
      nickname: true,
      email: true,
    },
  })

  // Generate initials for avatar
  const getInitials = () => {
    if (userData?.nickname) {
      return userData.nickname.charAt(0).toUpperCase()
    }
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
    }
    if (userData?.firstName) {
      return userData.firstName.charAt(0).toUpperCase()
    }
    if (userData?.email) {
      return userData.email.charAt(0).toUpperCase()
    }
    return 'U'
  }
  const initials = getInitials()

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
              <Link href="/" className="text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-950 dark:hover:text-apple-gray-50 text-sm font-medium transition-colors">
                Goals
              </Link>
              <div className="w-8 h-8 rounded-full bg-apple-gray-200 dark:bg-apple-gray-700 flex items-center justify-center text-xs font-medium text-apple-gray-700 dark:text-apple-gray-300">
                {initials}
              </div>
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

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/30 p-6">
          <h2 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm mb-4">
            Deleting your account will permanently remove all your data, including goals, updates, and insights.
          </p>
          <DeleteAccountButton />
        </div>
      </main>
    </div>
  )
}

