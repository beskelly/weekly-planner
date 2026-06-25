'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserProfile } from '@/types'

const DEFAULT_PROFILE: UserProfile = {
  heightInches: 75,
  currentWeight: 130,
  goalWeight: 150,
  age: 25,
  dailyCalorieTarget: 3000,
  proteinTarget: 150,
  carbTarget: 400,
  fatTarget: 80,
  dairyFree: true,
  eggFree: true,
  avocadoFree: true,
  workoutStartDate: new Date().toISOString().split('T')[0],
  setupComplete: false,
}

interface ProfileState {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  resetProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),
      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: 'wp:userProfile',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
