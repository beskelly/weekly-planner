'use client'

import { useMemo } from 'react'
import { useMealStore } from '@/store/mealStore'
import type { WeekDayKey } from '@/types'

export interface DailyMacros {
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export function useDailyMacros(weekStartDate: string, day: WeekDayKey): DailyMacros {
  const weeklyPlans = useMealStore((s) => s.weeklyPlans)
  const mealLibrary = useMealStore((s) => s.mealLibrary)

  return useMemo(() => {
    const plan = weeklyPlans[weekStartDate]
    if (!plan) return { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    const dayMeals = plan.days[day]
    if (!dayMeals) return { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    const mealIds = Object.values(dayMeals).filter(Boolean) as string[]
    return mealIds.reduce(
      (acc, id) => {
        const meal = mealLibrary.find((m) => m.id === id)
        if (!meal) return acc
        return {
          kcal: acc.kcal + meal.kcal,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
        }
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }, [weeklyPlans, mealLibrary, weekStartDate, day])
}
