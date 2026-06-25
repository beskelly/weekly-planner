'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { format, startOfWeek } from 'date-fns'
import type { Meal, WeeklyMealPlan, DailyMeals, WeekDayKey, MealSlotType, DayTemplate } from '@/types'
import { DEFAULT_MEALS } from '@/data/meals'
import { DAY_TEMPLATES } from '@/data/dayTemplates'

const EMPTY_DAY: DailyMeals = {
  breakfast: null,
  lunch: null,
  snack: null,
  dinner: null,
  preBed: null,
}

const WEEK_DAYS: WeekDayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function emptyWeek(weekStartDate: string): WeeklyMealPlan {
  return {
    weekStartDate,
    days: Object.fromEntries(WEEK_DAYS.map((d) => [d, { ...EMPTY_DAY }])) as Record<
      WeekDayKey,
      DailyMeals
    >,
  }
}

function currentWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

interface MealState {
  mealLibrary: Meal[]
  weeklyPlans: Record<string, WeeklyMealPlan>

  getMealById: (id: string) => Meal | undefined
  addCustomMeal: (meal: Omit<Meal, 'id' | 'isCustom'>) => void
  removeCustomMeal: (id: string) => void

  templates: DayTemplate[]
  getWeekPlan: (weekStartDate: string) => WeeklyMealPlan
  setMealSlot: (weekStartDate: string, day: WeekDayKey, slot: MealSlotType, mealId: string | null) => void
  applyTemplate: (weekStartDate: string, day: WeekDayKey, templateId: string) => void
  clearWeekPlan: (weekStartDate: string) => void
  resetMeals: () => void
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      mealLibrary: DEFAULT_MEALS,
      weeklyPlans: { [currentWeekStart()]: emptyWeek(currentWeekStart()) },
      templates: DAY_TEMPLATES,

      getMealById: (id) => get().mealLibrary.find((m) => m.id === id),

      addCustomMeal: (meal) => {
        const id = `custom-${Date.now()}`
        set((state) => ({
          mealLibrary: [...state.mealLibrary, { ...meal, id, isCustom: true }],
        }))
      },

      removeCustomMeal: (id) =>
        set((state) => ({
          mealLibrary: state.mealLibrary.filter((m) => m.id !== id),
        })),

      getWeekPlan: (weekStartDate) => {
        const existing = get().weeklyPlans[weekStartDate]
        if (existing) return existing
        const fresh = emptyWeek(weekStartDate)
        set((state) => ({
          weeklyPlans: { ...state.weeklyPlans, [weekStartDate]: fresh },
        }))
        return fresh
      },

      setMealSlot: (weekStartDate, day, slot, mealId) =>
        set((state) => {
          const plan = state.weeklyPlans[weekStartDate] ?? emptyWeek(weekStartDate)
          return {
            weeklyPlans: {
              ...state.weeklyPlans,
              [weekStartDate]: {
                ...plan,
                days: {
                  ...plan.days,
                  [day]: { ...plan.days[day], [slot]: mealId },
                },
              },
            },
          }
        }),

      applyTemplate: (weekStartDate, day, templateId) => {
        const template = DAY_TEMPLATES.find((t) => t.id === templateId)
        if (!template) return
        set((state) => {
          const plan = state.weeklyPlans[weekStartDate] ?? emptyWeek(weekStartDate)
          return {
            weeklyPlans: {
              ...state.weeklyPlans,
              [weekStartDate]: {
                ...plan,
                days: { ...plan.days, [day]: { ...template.meals } },
              },
            },
          }
        })
      },

      clearWeekPlan: (weekStartDate) =>
        set((state) => ({
          weeklyPlans: {
            ...state.weeklyPlans,
            [weekStartDate]: emptyWeek(weekStartDate),
          },
        })),

      resetMeals: () =>
        set({
          mealLibrary: DEFAULT_MEALS,
          weeklyPlans: { [currentWeekStart()]: emptyWeek(currentWeekStart()) },
        }),
    }),
    {
      name: 'wp:meals',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
