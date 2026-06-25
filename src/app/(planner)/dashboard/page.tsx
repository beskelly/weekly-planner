'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useProfileStore } from '@/store/profileStore'
import { useMealStore } from '@/store/mealStore'
import { useWorkoutStore } from '@/store/workoutStore'
import { useWeightStore } from '@/store/weightStore'
import { MacroRing } from '@/components/ui/MacroRing'
import { MacroBar } from '@/components/ui/MacroBar'
import { useDailyMacros } from '@/hooks/useDailyMacros'
import { useWorkoutSchedule } from '@/hooks/useWorkoutSchedule'
import { currentWeekStart, dateToWeekDayKey, weekDatesFromStart } from '@/lib/utils'
import type { MealSlotType } from '@/types'

const SLOT_LABELS: Record<MealSlotType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner', preBed: 'Pre-bed',
}

export default function DashboardPage() {
  const profile = useProfileStore((s) => s.profile)
  const mealLibrary = useMealStore((s) => s.mealLibrary)
  const weeklyPlans = useMealStore((s) => s.weeklyPlans)
  const sessions = useWorkoutStore((s) => s.sessions)
  const weightEntries = useWeightStore((s) => s.entries)

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const weekStart = currentWeekStart()
  const todayKey = dateToWeekDayKey(today)

  const macros = useDailyMacros(weekStart, todayKey)
  const weekDates = weekDatesFromStart(weekStart)
  const schedule = useWorkoutSchedule(profile.workoutStartDate, weekDates)
  const todayIdx = weekDates.findIndex((d) => format(d, 'yyyy-MM-dd') === todayStr)
  const todaySchedule = todayIdx >= 0 ? schedule[todayIdx] : 'rest'
  const todaySession = sessions.find((s) => s.date === todayStr)

  const todayMeals = weeklyPlans[weekStart]?.days[todayKey]

  const latestEntry = [...weightEntries].sort((a, b) => b.date.localeCompare(a.date))[0]
  const currentLbs = latestEntry?.weightLbs ?? profile.currentWeight
  const lbsToGo = Math.max(profile.goalWeight - currentLbs, 0)
  const goalPct = profile.goalWeight > profile.currentWeight
    ? Math.min(((currentLbs - profile.currentWeight) / (profile.goalWeight - profile.currentWeight)) * 100, 100)
    : 100

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{format(today, 'EEEE, MMMM d')}</h1>
        <p className="text-sm text-gray-400 mt-0.5">Here's your day at a glance.</p>
      </div>

      {/* Calories + Workout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-5">
          <MacroRing consumed={macros.kcal} target={profile.dailyCalorieTarget} />
          <div className="flex-1 space-y-2.5 min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's Calories</p>
            <MacroBar label="Protein" consumed={macros.protein} target={profile.proteinTarget} colorClass="bg-blue-500" />
            <MacroBar label="Carbs" consumed={macros.carbs} target={profile.carbTarget} colorClass="bg-amber-400" />
            <MacroBar label="Fat" consumed={macros.fat} target={profile.fatTarget} colorClass="bg-rose-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Today's Workout</p>
          {!todaySchedule || todaySchedule === 'rest' ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-2xl">😴</div>
              <div>
                <p className="font-semibold text-gray-900">Rest Day</p>
                <p className="text-xs text-gray-400 mt-0.5">Recovery is where muscle is built.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white ${todaySchedule === 'A' ? 'bg-indigo-500' : 'bg-violet-500'}`}>
                {todaySchedule}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Workout {todaySchedule}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {todaySession?.completed ? '✅ Completed today' : '7 exercises · Tap to log'}
                </p>
              </div>
              {!todaySession?.completed && (
                <Link href="/workouts" className="ml-auto text-xs text-indigo-600 font-medium hover:text-indigo-700">
                  Log →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's Meals</p>
          <Link href="/meals" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">Edit plan →</Link>
        </div>
        <div className="space-y-0">
          {(Object.keys(SLOT_LABELS) as MealSlotType[]).map((slot) => {
            const mealId = todayMeals?.[slot]
            const meal = mealId ? mealLibrary.find((m) => m.id === mealId) : null
            return (
              <div key={slot} className="flex items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400 w-20 shrink-0">{SLOT_LABELS[slot]}</span>
                {meal ? (
                  <>
                    <span className="text-sm font-medium text-gray-900 flex-1 truncate">{meal.name}</span>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">{meal.kcal} kcal</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-300 italic">Not planned</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Progress to Goal</p>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-bold text-gray-900">{currentLbs} lbs</span>
          <span className="text-gray-400">Goal: {profile.goalWeight} lbs</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(goalPct, 2)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Started at {profile.currentWeight} lbs</span>
          <span>{lbsToGo > 0 ? `${lbsToGo.toFixed(1)} lbs to go` : '🎉 Goal reached!'}</span>
        </div>
      </div>
    </div>
  )
}
