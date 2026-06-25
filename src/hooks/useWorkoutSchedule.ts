'use client'

import { useMemo } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { WorkoutType } from '@/types'

export type DaySchedule = WorkoutType | 'rest'

export function getWorkoutForDate(date: Date, startDate: Date): DaySchedule {
  const diff = differenceInCalendarDays(date, startDate)
  if (diff < 0) return 'rest'
  if (diff % 2 !== 0) return 'rest'
  return Math.floor(diff / 2) % 2 === 0 ? 'A' : 'B'
}

export function useWorkoutSchedule(workoutStartDate: string, weekDates: Date[]): DaySchedule[] {
  return useMemo(() => {
    const start = parseISO(workoutStartDate)
    return weekDates.map((d) => getWorkoutForDate(d, start))
  }, [workoutStartDate, weekDates])
}
