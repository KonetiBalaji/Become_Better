'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Optional: extremely subtle texture - only visible on close inspection */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 dark:opacity-10 pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-semibold tracking-tight">Become Better</h1>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="apple-button text-sm"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center max-w-3xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center space-y-8 w-full">
          <h1 className="text-5xl lg:text-6xl tracking-tight text-gray-900 dark:text-gray-50 leading-tight cursor-default transition-all duration-500 hover:scale-[1.01] select-none group">
            Build <span className="font-bold">consistency</span>, not <span className="font-light text-gray-400 dark:text-gray-500 relative inline-block">
              motivation
              <span className="absolute left-0 right-0 top-[55%] h-[0.5px] bg-gray-400 dark:bg-gray-500 opacity-40 group-hover:opacity-60 transition-opacity duration-300"></span>
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            You already know what you want to improve. The hard part is showing up every day.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Break goals into small actions. Track daily progress. Learn from your patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
            <Link href="/register" className="apple-button px-8 py-4 text-base">
              Create account
            </Link>
            <Link href="/login" className="apple-button-secondary px-8 py-4 text-base">
              Sign in
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 pt-6">
            No credit card required • Takes under a minute
          </p>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-4 group cursor-default transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 group-hover:shadow-lg group-hover:shadow-orange-200/50 dark:group-hover:shadow-orange-900/20 relative">
              {/* Default icon */}
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-opacity duration-300 group-hover:opacity-0 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {/* Animated glowing bulb */}
              <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute" viewBox="0 0 24 24" fill="none">
                {/* Glowing effect - animated */}
                <circle cx="12" cy="9" r="6" className="fill-orange-400 opacity-0 group-hover:opacity-30 group-hover:animate-pulse" />
                {/* Bulb body */}
                <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6h-6c-1.5-1.5-3-3.5-3-6a6 6 0 0 1 6-6z" 
                  stroke="#f97316" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="group-hover:animate-[glow_2s_ease-in-out_infinite]"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.6))',
                  }}
                />
                {/* Light rays - animated */}
                <g className="opacity-0 group-hover:opacity-60">
                  <path d="M12 9l-2-2M12 9l2-2M9 12l-2 2M15 12l2 2" 
                    stroke="#f97316" 
                    strokeWidth="1" 
                    strokeLinecap="round"
                    className="group-hover:animate-pulse"
                  />
                </g>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">Adaptive insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Learn from your patterns. Guidance that evolves with your habits.
            </p>
          </div>
          <div className="space-y-4 group cursor-default transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:shadow-lg group-hover:shadow-purple-200/50 dark:group-hover:shadow-purple-900/20 relative">
              {/* Default icon */}
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-opacity duration-300 group-hover:opacity-0 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {/* Animated progress bars */}
              <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute" viewBox="0 0 24 24" fill="none">
                {/* Bar 1 - Filled with animation */}
                <rect x="4" y="12" width="4" height="0" rx="2" fill="#9333ea" className="group-hover:animate-[fillBar1_1.2s_ease-out_0.1s_forwards]">
                  <animate attributeName="height" values="0;8" dur="1.2s" begin="0.1s" fill="freeze" />
                  <animate attributeName="y" values="20;12" dur="1.2s" begin="0.1s" fill="freeze" />
                </rect>
                {/* Bar 2 - Filled with animation */}
                <rect x="10" y="8" width="4" height="0" rx="2" fill="#9333ea" className="group-hover:animate-[fillBar2_1.2s_ease-out_0.4s_forwards]">
                  <animate attributeName="height" values="0;12" dur="1.2s" begin="0.4s" fill="freeze" />
                  <animate attributeName="y" values="20;8" dur="1.2s" begin="0.4s" fill="freeze" />
                </rect>
                {/* Bar 3 - Empty (gray) */}
                <rect x="16" y="16" width="4" height="4" rx="2" fill="#e5e7eb" className="dark:fill-gray-600" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">Visual progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              See your consistency over time. Streaks that build confidence.
            </p>
          </div>
          <div className="space-y-4 group cursor-default transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:shadow-lg group-hover:shadow-emerald-200/50 dark:group-hover:shadow-emerald-900/20 relative">
              {/* Default icon */}
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-opacity duration-300 group-hover:opacity-0 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {/* Animated lock - unlocked (red) to locked (green) */}
              <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute" viewBox="0 0 24 24" fill="none">
                {/* Lock body - transitions from red (unlocked) to green (locked) */}
                <rect x="6" y="11" width="12" height="9" rx="2" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5">
                  <animate attributeName="fill" values="#ef4444;#10b981" dur="1s" begin="0s" fill="freeze" />
                  <animate attributeName="stroke" values="#ef4444;#10b981" dur="1s" begin="0s" fill="freeze" />
                </rect>
                {/* Lock shackle - animated from open (unlocked) to closed (locked) */}
                <path d="M8 11V7a4 4 0 0 1 8 0v4" 
                  stroke="#ef4444" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  fill="none"
                >
                  <animate attributeName="stroke" values="#ef4444;#10b981" dur="1s" begin="0s" fill="freeze" />
                  <animate attributeName="d" values="M8 11V7a4 4 0 0 1 8 0v4;M8 7a4 4 0 0 1 8 0" dur="0.8s" begin="0.2s" fill="freeze" />
                </path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Private focus</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              A distraction-free space. Your progress, your way.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-2xl mx-auto px-6 lg:px-8 py-24 lg:py-32 text-center relative">
        <div className="space-y-8">
          <h2 className="text-2xl lg:text-3xl font-medium text-gray-900 dark:text-gray-100">
            Start tracking your progress
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Create your account and begin building consistency today.
          </p>
          <Link href="/register" className="apple-button px-8 py-4 text-base inline-block">
            Create your account
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-500 pt-4">
            Takes under a minute • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            © {currentYear || '2025'} Become Better. A quiet system for building consistency.
          </p>
        </div>
      </footer>
    </div>
  )
}

