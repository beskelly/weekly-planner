'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/meals', label: 'Meals', icon: '🍽️' },
  { href: '/workouts', label: 'Workout', icon: '💪' },
  { href: '/weight-log', label: 'Weight', icon: '⚖️' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex z-40"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
            pathname === href
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span className="text-xl" aria-hidden="true">{icon}</span>
          {label}
        </Link>
      ))}
    </nav>
  )
}
