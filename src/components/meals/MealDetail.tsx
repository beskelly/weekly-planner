'use client'

import type { Meal, MealSlotType, WeekDayKey } from '@/types'

const SLOT_LABELS: Record<MealSlotType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner', preBed: 'Pre-bed',
}

const DAY_LABELS: Record<WeekDayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}

interface Props {
  meal: Meal
  day: WeekDayKey
  slot: MealSlotType
  onRemove: () => void
  onClose: () => void
}

export function MealDetail({ meal, day, slot, onRemove, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog" aria-modal="true" aria-label={meal.name}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-1">
              {DAY_LABELS[day]} · {SLOT_LABELS[slot]}
            </p>
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{meal.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none w-8 h-8 flex items-center justify-center shrink-0"
            aria-label="Close"
          >×</button>
        </div>

        {/* Ingredients */}
        {meal.ingredients && meal.ingredients.length > 0 ? (
          <ul className="px-5 pb-4 space-y-1.5">
            {meal.ingredients.map((ing) => (
              <li key={ing.item} className="flex items-baseline gap-2 text-sm">
                <span className="text-gray-300 dark:text-gray-600 shrink-0 select-none">·</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400 shrink-0 min-w-[56px]">{ing.quantity}</span>
                <span className="text-gray-700 dark:text-gray-300">{ing.item}</span>
              </li>
            ))}
          </ul>
        ) : meal.description ? (
          <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {meal.description}
          </p>
        ) : null}

        {/* Macros */}
        <div className="mx-5 mb-5 grid grid-cols-4 gap-2">
          <MacroTile label="Calories" value={meal.kcal} unit="kcal" highlight />
          <MacroTile label="Protein" value={meal.protein} unit="g" />
          <MacroTile label="Carbs" value={meal.carbs} unit="g" />
          <MacroTile label="Fat" value={meal.fat} unit="g" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => { onRemove(); onClose() }}
            className="flex-1 border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg py-2 text-sm font-medium transition-colors"
          >
            Remove
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function MacroTile({ label, value, unit, highlight }: { label: string; value: number; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center ${highlight ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
      <p className={`text-lg font-bold leading-none ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{unit}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  )
}
