import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/SettingsForm'
import DeleteAccountButton from '@/components/DeleteAccountButton'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

// Comprehensive timezones organized by region
const TIMEZONES = [
  // UTC
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  
  // North America
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'America/Phoenix', label: 'America/Phoenix (MST)' },
  { value: 'America/Anchorage', label: 'America/Anchorage (AKST/AKDT)' },
  { value: 'America/Toronto', label: 'America/Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'America/Vancouver (PST/PDT)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (CST)' },
  
  // South America
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (BRT)' },
  { value: 'America/Buenos_Aires', label: 'America/Buenos_Aires (ART)' },
  { value: 'America/Lima', label: 'America/Lima (PET)' },
  { value: 'America/Bogota', label: 'America/Bogota (COT)' },
  { value: 'America/Santiago', label: 'America/Santiago (CLT)' },
  
  // Europe
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Europe/Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (CET/CEST)' },
  { value: 'Europe/Stockholm', label: 'Europe/Stockholm (CET/CEST)' },
  { value: 'Europe/Vienna', label: 'Europe/Vienna (CET/CEST)' },
  { value: 'Europe/Zurich', label: 'Europe/Zurich (CET/CEST)' },
  { value: 'Europe/Athens', label: 'Europe/Athens (EET/EEST)' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (MSK)' },
  { value: 'Europe/Istanbul', label: 'Europe/Istanbul (TRT)' },
  { value: 'Europe/Dublin', label: 'Europe/Dublin (GMT/IST)' },
  { value: 'Europe/Lisbon', label: 'Europe/Lisbon (WET/WEST)' },
  
  // Asia
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (KST)' },
  { value: 'Asia/Taipei', label: 'Asia/Taipei (CST)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (ICT)' },
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB)' },
  { value: 'Asia/Manila', label: 'Asia/Manila (PHT)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (AST)' },
  { value: 'Asia/Tehran', label: 'Asia/Tehran (IRST)' },
  { value: 'Asia/Karachi', label: 'Asia/Karachi (PKT)' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (BST)' },
  
  // Africa
  { value: 'Africa/Cairo', label: 'Africa/Cairo (EET)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (SAST)' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos (WAT)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT)' },
  { value: 'Africa/Casablanca', label: 'Africa/Casablanca (WET)' },
  
  // Australia & Pacific
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT/AEST)' },
  { value: 'Australia/Melbourne', label: 'Australia/Melbourne (AEDT/AEST)' },
  { value: 'Australia/Brisbane', label: 'Australia/Brisbane (AEST)' },
  { value: 'Australia/Perth', label: 'Australia/Perth (AWST)' },
  { value: 'Australia/Adelaide', label: 'Australia/Adelaide (ACDT/ACST)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZDT/NZST)' },
  { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (HST)' },
  { value: 'Pacific/Fiji', label: 'Pacific/Fiji (FJT)' },
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
            <Link href="/" className="text-2xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
              Become Better
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-950 dark:hover:text-apple-gray-50 text-sm font-medium transition-colors">
                Goals
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-950 dark:hover:text-apple-gray-50 text-sm font-medium transition-colors inline-flex items-center gap-2 mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Goals
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Settings</h1>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm">
            Manage your preferences and account
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <SettingsForm initialSettings={settings} timezones={TIMEZONES} />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/30 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Danger Zone</h2>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm mb-4">
                  Deleting your account will permanently remove all your data, including goals, updates, and insights.
                </p>
              </div>
            </div>
            <DeleteAccountButton />
          </div>
        </div>
      </main>
    </div>
  )
}

