'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { WorkoutSession, ExerciseLog, WorkoutSet, WorkoutType } from '@/types'
import { EXERCISES } from '@/data/workouts'

function buildEmptySession(date: string, workoutType: WorkoutType): WorkoutSession {
  const exercises = EXERCISES.filter((e) => e.workout === workoutType)
  return {
    id: `session-${date}-${workoutType}`,
    date,
    workoutType,
    completed: false,
    exercises: exercises.map((ex) => ({
      exerciseId: ex.id,
      progressionFlag: false,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        weightLbs: ex.startingWeightLbs,
        reps: 0,
        completed: false,
      })),
    })),
  }
}

function checkProgressionFlag(sets: WorkoutSet[], repsMax: number): boolean {
  return sets.every((s) => s.completed && s.reps >= repsMax)
}

interface WorkoutState {
  sessions: WorkoutSession[]

  getSessionByDate: (date: string) => WorkoutSession | undefined
  getOrCreateSession: (date: string, workoutType: WorkoutType) => WorkoutSession
  updateSet: (sessionId: string, exerciseId: string, setIndex: number, update: Partial<WorkoutSet>) => void
  completeSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  resetWorkouts: () => void
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      sessions: [],

      getSessionByDate: (date) => get().sessions.find((s) => s.date === date),

      getOrCreateSession: (date, workoutType) => {
        const existing = get().sessions.find((s) => s.date === date)
        const expectedIds = EXERCISES.filter((e) => e.workout === workoutType)
          .map((e) => e.id)
          .sort()
          .join(',')

        if (existing) {
          const existingIds = existing.exercises.map((e) => e.exerciseId).sort().join(',')
          if (existingIds === expectedIds) return existing
          // Exercise list has changed since this session was created (e.g. plan was
          // rebuilt) — the old logged sets reference exercises that no longer exist,
          // so rebuild the session fresh instead of showing stale/missing exercises.
          const rebuilt = buildEmptySession(date, workoutType)
          set((state) => ({
            sessions: state.sessions.map((s) => (s.id === existing.id ? rebuilt : s)),
          }))
          return rebuilt
        }

        const fresh = buildEmptySession(date, workoutType)
        set((state) => ({ sessions: [...state.sessions, fresh] }))
        return fresh
      },

      updateSet: (sessionId, exerciseId, setIndex, update) =>
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id !== sessionId) return session
            return {
              ...session,
              exercises: session.exercises.map((exLog) => {
                if (exLog.exerciseId !== exerciseId) return exLog
                const updatedSets = exLog.sets.map((s, i) =>
                  i === setIndex ? { ...s, ...update } : s
                )
                const exercise = EXERCISES.find((e) => e.id === exerciseId)
                const progressionFlag = exercise
                  ? checkProgressionFlag(updatedSets, exercise.repsMax)
                  : false
                return { ...exLog, sets: updatedSets, progressionFlag }
              }),
            }
          }),
        })),

      completeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, completed: true } : s
          ),
        })),

      deleteSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        })),

      resetWorkouts: () => set({ sessions: [] }),
    }),
    {
      name: 'wp:workouts',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
