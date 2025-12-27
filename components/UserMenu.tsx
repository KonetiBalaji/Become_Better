'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserMenuProps {
  initials: string
  displayName: string | null
}

export default function UserMenu({ initials, displayName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-apple-gray-200 dark:bg-apple-gray-700 flex items-center justify-center text-xs font-medium text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-300 dark:hover:bg-apple-gray-600 transition-colors"
        aria-label="User menu"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg py-1 z-50 animate-fade-in">
          {displayName && (
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100">
                {displayName}
              </p>
            </div>
          )}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

