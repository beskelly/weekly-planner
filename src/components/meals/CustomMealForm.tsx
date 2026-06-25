'use client'

import { useState } from 'react'
import { useMealStore } from '@/store/mealStore'
import type { MealSlotType } from '@/types'

const ALL_SLOTS: { key: MealSlotType; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snack', label: 'Snack' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'preBed', label: 'Pre-bed' },
]

interface Props {
  onClose: () => void
}

export function CustomMealForm({ onClose }: Props) {
  const addCustomMeal = useMealStore((s) => s.addCustomMeal)

  const [form, setForm] = useState({
    name: '', description: '',
    kcal: 0, protein: 0, carbs: 0, fat: 0,
    suitableFor: ['lunch', 'dinner'] as MealSlotType[],
  })

  const set = (field: string, value: unknown) => setForm((p) => ({ ...p, [field]: value }))

  const toggleSlot = (slot: MealSlotType) =>
    setForm((p) => ({
      ...p,
      suitableFor: p.suitableFor.includes(slot)
        ? p.suitableFor.filter((s) => s !== slot)
        : [...p.suitableFor, slot],
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addCustomMeal({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      kcal: form.kcal, protein: form.protein, carbs: form.carbs, fat: form.fat,
      suitableFor: form.suitableFor,
    })
    onClose()
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog" aria-modal="true" aria-label="Create custom meal"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Create Custom Meal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center" aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              required autoFocus placeholder="e.g. Brown Rice + Tofu" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input type="text" value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Ingredients / notes (optional)" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {([['kcal', 'Calories', 'kcal'], ['protein', 'Protein', 'g'], ['carbs', 'Carbs', 'g'], ['fat', 'Fat', 'g']] as const).map(([field, label, unit]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex items-center gap-1">
                  <input type="number" min={0} value={form[field]}
                    onChange={(e) => set(field, +e.target.value)} className={inputCls} />
                  <span className="text-xs text-gray-500 shrink-0">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suitable For</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SLOTS.map(({ key, label }) => (
                <button key={key} type="button" onClick={() => toggleSlot(key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    form.suitableFor.includes(key) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium transition-colors">
              Add Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
