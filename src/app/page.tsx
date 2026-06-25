'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'

export default function RootPage() {
  const router = useRouter()
  const setupComplete = useProfileStore((s) => s.profile.setupComplete)
  const [ready, setReady] = useState(false)

  useEffect(() => { setReady(true) }, [])

  useEffect(() => {
    if (ready) router.replace(setupComplete ? '/dashboard' : '/setup')
  }, [ready, setupComplete, router])

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading…</div>
    </div>
  )
}
