'use client'

import { useEffect, useMemo, useState } from 'react'
import { format, addWeeks, subWeeks } from 'date-fns'
import { useMealStore } from '@/store/mealStore'
import { useProfileStore } from '@/store/profileStore'
import { MealPicker } from '@/components/meals/MealPicker'
import { CustomMealForm } from '@/components/meals/CustomMealForm'
import { currentWeekStart, weekDatesFromStart, WEEK_DAY_KEYS, WEEK_DAY_LABELS } from '@/lib/utils'
import type { Meal, MealSlotType, WeekDayKey, WeeklyMealPlan } from '@/types'

const SLOTS: { key: MealSlotType; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snack', label: 'Snack' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'preBed', label: 'Pre-bed' },
]

interface PickerTarget {
  day: WeekDayKey
  slot: MealSlotType
}

function computeDayTotals(plan: WeeklyMealPlan | undefined, day: WeekDayKey, library: Meal[]) {
  if (!plan) return { kcal: 0, protein: 0 }
  const ids = Object.values(plan.days[day]).filter(Boolean) as string[]
  return ids.reduce(
    (acc, id) => {
      const m = library.find((m) => m.id === id)
      return m ? { kcal: acc.kcal + m.kcal, protein: acc.protein + m.protein } : acc
    },
    { kcal: 0, protein: 0 }
  )
}

export default function MealsPage() {
  const [weekStart, setWeekStart] = useState(currentWeekStart())
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)

  const weeklyPlans = useMealStore((s) => s.weeklyPlans)
  const mealLibrary = useMealStore((s) => s.mealLibrary)
  const setMealSlot = useMealStore((s) => s.setMealSlot)
  const applyTemplate = useMealStore((s) => s.applyTemplate)
  const templates = useMealStore((s) => s.templates)
  const getWeekPlan = useMealStore((s) => s.getWeekPlan)
  const profile = useProfileStore((s) => s.profile)

  useEffect(() => { getWeekPlan(weekStart) }, [weekStart, getWeekPlan])

  const weekDates = weekDatesFromStart(weekStart)
  const weekPlan = weeklyPlans[weekStart]
  const weekLabel = `${format(weekDates[0], 'MMM d')} – ${format(weekDates[6], 'MMM d, yyyy')}`

  const dayTotals = useMemo(
    () => Object.fromEntries(WEEK_DAY_KEYS.map((day) => [day, computeDayTotals(weekPlan, day, mealLibrary)])),
    [weekPlan, mealLibrary]
  )

  const prev = () => setWeekStart(format(subWeeks(weekDates[0], 1), 'yyyy-MM-dd'))
  const next = () => setWeekStart(format(addWeeks(weekDates[0], 1), 'yyyy-MM-dd'))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Meal Planner</h1>
        <button
          onClick={() => setShowCustomForm(true)}
          className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Custom Meal
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={prev} aria-label="Previous week" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400 font-medium">←</button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[180px] text-center">{weekLabel}</span>
        <button onClick={next} aria-label="Next week" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400 font-medium">→</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="w-24 p-3 text-left"></th>
              {WEEK_DAY_KEYS.map((day, i) => (
                <th key={day} className="p-2 text-center min-w-[130px]">
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{WEEK_DAY_LABELS[day]}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{format(weekDates[i], 'MMM d')}</div>
                  <div className="mt-1.5">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) { applyTemplate(weekStart, day, e.target.value); e.target.value = '' }
                      }}
                      className="text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md px-1.5 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                    >
                      <option value="" disabled>Template…</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(({ key: slot, label }) => (
              <tr key={slot} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{label}</td>
                {WEEK_DAY_KEYS.map((day) => {
                  const mealId = weekPlan?.days[day]?.[slot] ?? null
                  const meal = mealId ? mealLibrary.find((m) => m.id === mealId) : null
                  return (
                    <td key={day} className="p-1.5">
                      {meal ? (
                        <div className="group relative rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors p-2 cursor-default">
                          <p className="text-xs font-medium text-indigo-900 dark:text-indigo-100 leading-snug">{meal.name}</p>
                          <p className="text-xs text-indigo-400 dark:text-indigo-500 mt-0.5">{meal.kcal} kcal · {meal.protein}g P</p>
                          <button
                            onClick={() => setMealSlot(weekStart, day, slot, null)}
                            className="absolute top-1 right-1.5 text-indigo-300 dark:text-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity text-sm leading-none"
                            aria-label={`Remove ${label} from ${WEEK_DAY_LABELS[day]}`}
                          >×</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPickerTarget({ day, slot })}
                          className="w-full h-16 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg text-gray-300 dark:text-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-400 dark:hover:text-indigo-500 transition-colors text-xl flex items-center justify-center"
                          aria-label={`Add ${label} for ${WEEK_DAY_LABELS[day]}`}
                        >+</button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <td className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Totals</td>
              {WEEK_DAY_KEYS.map((day) => {
                const { kcal, protein } = dayTotals[day]
                const calOk = kcal >= profile.dailyCalorieTarget * 0.9
                const proOk = protein >= profile.proteinTarget * 0.9
                return (
                  <td key={day} className="p-2 text-center">
                    <p className={`text-xs font-semibold ${calOk ? 'text-emerald-600 dark:text-emerald-400' : kcal > 0 ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      {kcal > 0 ? `${kcal} kcal` : '—'}
                    </p>
                    <p className={`text-xs ${proOk ? 'text-emerald-600 dark:text-emerald-400' : protein > 0 ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      {protein > 0 ? `${protein}g P` : ''}
                    </p>
                  </td>
                )
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {pickerTarget && (
        <MealPicker
          slot={pickerTarget.slot}
          onSelect={(mealId) => { setMealSlot(weekStart, pickerTarget.day, pickerTarget.slot, mealId); setPickerTarget(null) }}
          onClose={() => setPickerTarget(null)}
          onAddCustom={() => { setPickerTarget(null); setShowCustomForm(true) }}
        />
      )}
      {showCustomForm && <CustomMealForm onClose={() => setShowCustomForm(false)} />}
    </div>
  )
}
