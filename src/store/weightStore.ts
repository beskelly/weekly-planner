'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { WeightEntry } from '@/types'

interface WeightState {
  entries: WeightEntry[]

  addEntry: (date: string, weightLbs: number) => void
  updateEntry: (date: string, weightLbs: number) => void
  removeEntry: (date: string) => void
  getEntryByDate: (date: string) => WeightEntry | undefined
  getLatestEntry: () => WeightEntry | undefined
  resetWeightLog: () => void
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (date, weightLbs) => {
        const existing = get().entries.find((e) => e.date === date)
        if (existing) {
          set((state) => ({
            entries: state.entries.map((e) => (e.date === date ? { date, weightLbs } : e)),
          }))
        } else {
          set((state) => ({
            entries: [...state.entries, { date, weightLbs }].sort((a, b) =>
              a.date.localeCompare(b.date)
            ),
          }))
        }
      },

      updateEntry: (date, weightLbs) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.date === date ? { date, weightLbs } : e)),
        })),

      removeEntry: (date) =>
        set((state) => ({ entries: state.entries.filter((e) => e.date !== date) })),

      getEntryByDate: (date) => get().entries.find((e) => e.date === date),

      getLatestEntry: () => {
        const sorted = [...get().entries].sort((a, b) => b.date.localeCompare(a.date))
        return sorted[0]
      },

      resetWeightLog: () => set({ entries: [] }),
    }),
    {
      name: 'wp:weightLog',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
