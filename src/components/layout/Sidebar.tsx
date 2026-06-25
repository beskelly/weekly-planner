'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/meals', label: 'Meals', icon: '🍽️' },
  { href: '/workouts', label: 'Workouts', icon: '💪' },
  { href: '/weight-log', label: 'Weight Log', icon: '⚖️' },
  { href: '/progress', label: 'Progress', icon: '📊' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 fixed top-0 left-0 h-full z-40">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-base font-bold text-gray-900 dark:text-white">Weekly Planner</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Meal &amp; Workout Tracker</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="text-base" aria-hidden="true">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3 space-y-0.5">
        <Link
          href="/settings"
          aria-current={pathname === '/settings' ? 'page' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span className="text-base" aria-hidden="true">⚙️</span>
          Settings
        </Link>
        <div className="flex items-center gap-3 px-3 py-1.5">
          <ThemeToggle />
          <span className="text-xs text-gray-400 dark:text-gray-500">Toggle theme</span>
        </div>
      </div>
    </aside>
  )
}
