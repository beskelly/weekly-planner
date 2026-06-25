'use client'

import { useState } from 'react'
import { useMealStore } from '@/store/mealStore'
import type { MealSlotType } from '@/types'

const SLOT_LABELS: Record<MealSlotType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner', preBed: 'Pre-bed',
}

interface Props {
  slot: MealSlotType
  onSelect: (mealId: string) => void
  onClose: () => void
  onAddCustom: () => void
}

export function MealPicker({ slot, onSelect, onClose, onAddCustom }: Props) {
  const mealLibrary = useMealStore((s) => s.mealLibrary)
  const [search, setSearch] = useState('')

  const filtered = mealLibrary
    .filter((m) => m.suitableFor.includes(slot))
    .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()))

  const all = mealLibrary.filter(
    (m) => !filtered.includes(m) && (!search || m.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog" aria-modal="true" aria-label={`Pick ${SLOT_LABELS[slot]}`}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Pick a {SLOT_LABELS[slot]}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center" aria-label="Close">×</button>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <input
            type="search" autoFocus
            placeholder="Search meals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length > 0 && (
            <div className="px-2 pt-2 pb-1">
              <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Best for {SLOT_LABELS[slot]}</p>
              {filtered.map((meal) => (
                <MealRow key={meal.id} meal={meal} onSelect={onSelect} />
              ))}
            </div>
          )}
          {all.length > 0 && (
            <div className="px-2 pt-1 pb-2">
              {filtered.length > 0 && <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Other meals</p>}
              {all.map((meal) => (
                <MealRow key={meal.id} meal={meal} onSelect={onSelect} />
              ))}
            </div>
          )}
          {filtered.length === 0 && all.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No meals found.</p>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <button onClick={onAddCustom} className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium py-1 transition-colors">
            + Create custom meal
          </button>
        </div>
      </div>
    </div>
  )
}

function MealRow({ meal, onSelect }: { meal: { id: string; name: string; description?: string; kcal: number; protein: number }; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(meal.id)}
      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{meal.name}</p>
          {meal.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{meal.description}</p>}
        </div>
        <div className="text-right ml-3 shrink-0">
          <p className="text-xs font-semibold text-indigo-600">{meal.kcal} kcal</p>
          <p className="text-xs text-gray-400">{meal.protein}g protein</p>
        </div>
      </div>
    </button>
  )
}
