'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const setupComplete = useProfileStore((s) => s.profile.setupComplete)
  const [ready, setReady] = useState(false)

  useEffect(() => { setReady(true) }, [])

  useEffect(() => {
    if (ready && !setupComplete) router.replace('/setup')
  }, [ready, setupComplete, router])

  if (!ready) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-600 text-sm">Loading…</div>
      </div>
    )
  }

  if (!setupComplete) return null

  return (
    <div className="h-full flex">
      <Sidebar />
      <main className="flex-1 md:ml-60 pb-16 md:pb-0 min-h-full overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
