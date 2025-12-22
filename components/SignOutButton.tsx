'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-950 dark:hover:text-apple-gray-50 text-sm font-medium transition-colors"
    >
      Sign Out
    </button>
  )
}
