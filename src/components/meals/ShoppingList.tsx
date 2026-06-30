'use client'

import { useState, useCallback } from 'react'
import type { ShoppingCategory, WeeklyMealPlan, Meal } from '@/types'
import { generateShoppingList, CATEGORY_ORDER, CATEGORY_LABELS, type ShoppingLine } from '@/lib/shoppingList'

const CATEGORY_STYLES: Record<ShoppingCategory, { badge: string; section: string; dot: string }> = {
  Protein:         { badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',   section: 'border-blue-200 dark:border-blue-800',   dot: 'bg-blue-400' },
  Produce:         { badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', section: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-400' },
  'Grains & Carbs': { badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', section: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-400' },
  Pantry:          { badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300', section: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-400' },
  'Dairy-alt':     { badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300', section: 'border-violet-200 dark:border-violet-800', dot: 'bg-violet-400' },
}

interface Props {
  weekPlan: WeeklyMealPlan
  weekLabel: string
  mealLibrary: Meal[]
  onClose: () => void
}

export function ShoppingList({ weekPlan, weekLabel, mealLibrary, onClose }: Props) {
  const list = generateShoppingList(weekPlan, mealLibrary)
  const totalItems = CATEGORY_ORDER.reduce((sum, cat) => sum + list[cat].length, 0)

  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const toggle = useCallback((key: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])

  const handleCopy = () => {
    const lines: string[] = [`Shopping List — ${weekLabel}`, '']
    for (const cat of CATEGORY_ORDER) {
      if (!list[cat].length) continue
      lines.push(`── ${CATEGORY_LABELS[cat]} ──`)
      for (const item of list[cat]) {
        lines.push(`• ${item.item} — ${item.totalQuantity}`)
      }
      lines.push('')
    }
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog" aria-modal="true" aria-label="Shopping list"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Shopping List</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{weekLabel} · {totalItems} items</p>
          </div>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none w-8 h-8 flex items-center justify-center" aria-label="Close">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {totalItems === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-10">No meals planned yet — fill in your week first.</p>
          ) : (
            CATEGORY_ORDER.map((cat) => {
              const items = list[cat]
              if (!items.length) return null
              const style = CATEGORY_STYLES[cat]
              return (
                <section key={cat}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className={`rounded-xl border ${style.section} bg-gray-50 dark:bg-gray-700/30 divide-y divide-gray-100 dark:divide-gray-700`}>
                    {items.map((line) => (
                      <ShoppingRow
                        key={line.item}
                        line={line}
                        checked={checked.has(line.item)}
                        onToggle={() => toggle(line.item)}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </div>

        {/* Footer */}
        {totalItems > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex gap-3 shrink-0">
            <button
              onClick={handleCopy}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ShoppingRow({ line, checked, onToggle }: { line: ShoppingLine; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white dark:hover:bg-gray-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-indigo-600 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium transition-colors ${checked ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}`}>
          {line.item}
        </span>
        {line.mealCount > 1 && (
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">({line.mealCount} meals)</span>
        )}
      </div>
      <span className={`text-sm shrink-0 transition-colors ${checked ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
        {line.totalQuantity}
      </span>
    </label>
  )
}
