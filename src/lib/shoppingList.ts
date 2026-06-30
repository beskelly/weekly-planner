import type { Ingredient, Meal, ShoppingCategory, WeeklyMealPlan, WeekDayKey } from '@/types'

export interface ShoppingLine {
  item: string
  category: ShoppingCategory
  totalQuantity: string
  mealCount: number
  mealNames: string[]
}

const FRACTION_TO_NUM: Array<[string, number]> = [
  ['¼', 0.25], ['½', 0.5], ['¾', 0.75], ['⅓', 1 / 3], ['⅔', 2 / 3],
]
const NUM_TO_FRACTION: Array<[number, string]> = [
  [0.25, '¼'], [0.5, '½'], [0.75, '¾'], [1 / 3, '⅓'], [2 / 3, '⅔'],
]

function parseAmount(qty: string): { amount: number; unit: string } {
  let str = qty.trim()
  for (const [frac, val] of FRACTION_TO_NUM) {
    str = str.replace(frac, ` ${val}`)
  }
  const parts = str.trim().split(/\s+/)
  let amount = 0
  const unitParts: string[] = []
  for (const part of parts) {
    const n = parseFloat(part)
    if (!isNaN(n)) {
      amount += n
    } else if (part) {
      unitParts.push(part)
    }
  }
  return { amount: amount || 1, unit: unitParts.join(' ') }
}

function formatAmount(n: number): string {
  const whole = Math.floor(n)
  const frac = n - whole
  if (frac < 0.04) return `${whole || ''}`
  const fracStr = NUM_TO_FRACTION.find(([f]) => Math.abs(frac - f) < 0.04)?.[1] ?? `.${Math.round(frac * 10)}`
  return whole > 0 ? `${whole}${fracStr}` : fracStr
}

function multiplyQty(qty: string, factor: number): string {
  const { amount, unit } = parseAmount(qty)
  const result = amount * factor
  const formatted = formatAmount(result)
  return unit ? `${formatted} ${unit}` : formatted
}

function sumQtys(qtys: string[]): string {
  const byUnit = new Map<string, number>()
  for (const qty of qtys) {
    const { amount, unit } = parseAmount(qty)
    byUnit.set(unit, (byUnit.get(unit) ?? 0) + amount)
  }
  return Array.from(byUnit.entries())
    .map(([unit, amount]) => {
      const formatted = formatAmount(amount)
      return unit ? `${formatted} ${unit}` : `${formatted}`
    })
    .join(' + ')
}

export const CATEGORY_ORDER: ShoppingCategory[] = [
  'Protein', 'Produce', 'Grains & Carbs', 'Pantry', 'Dairy-alt',
]

export const CATEGORY_LABELS: Record<ShoppingCategory, string> = {
  Protein: 'Protein',
  Produce: 'Produce',
  'Grains & Carbs': 'Grains & Carbs',
  Pantry: 'Pantry & Oils',
  'Dairy-alt': 'Dairy-alt & Shakes',
}

export function generateShoppingList(
  weekPlan: WeeklyMealPlan,
  mealLibrary: Meal[]
): Record<ShoppingCategory, ShoppingLine[]> {
  const slots = ['breakfast', 'lunch', 'snack', 'dinner', 'preBed'] as const
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as WeekDayKey[]

  // Count occurrences of each meal ID
  const mealCounts = new Map<string, number>()
  for (const day of days) {
    const dayPlan = weekPlan.days[day]
    if (!dayPlan) continue
    for (const slot of slots) {
      const id = dayPlan[slot]
      if (id) mealCounts.set(id, (mealCounts.get(id) ?? 0) + 1)
    }
  }

  const emptyResult = (): Record<ShoppingCategory, ShoppingLine[]> => ({
    Protein: [], Produce: [], 'Grains & Carbs': [], Pantry: [], 'Dairy-alt': [],
  })

  if (mealCounts.size === 0) return emptyResult()

  // Aggregate ingredients by item name (case-insensitive)
  const aggregated = new Map<string, { category: ShoppingCategory; qtys: string[]; meals: string[] }>()

  for (const [mealId, count] of mealCounts) {
    const meal = mealLibrary.find((m) => m.id === mealId)
    if (!meal?.ingredients) continue

    for (const ing of meal.ingredients) {
      const key = ing.item.toLowerCase()
      const existing = aggregated.get(key)
      const scaledQty = multiplyQty(ing.quantity, count)

      if (existing) {
        existing.qtys.push(scaledQty)
        if (!existing.meals.includes(meal.name)) existing.meals.push(meal.name)
      } else {
        aggregated.set(key, {
          category: ing.category,
          qtys: [scaledQty],
          meals: [meal.name],
        })
      }
    }
  }

  // Build final lines grouped by category
  const result = emptyResult()

  for (const [item, { category, qtys, meals }] of aggregated) {
    result[category].push({
      item: item.charAt(0).toUpperCase() + item.slice(1),
      category,
      totalQuantity: sumQtys(qtys),
      mealCount: meals.length,
      mealNames: meals,
    })
  }

  // Sort each category alphabetically
  for (const cat of CATEGORY_ORDER) {
    result[cat].sort((a, b) => a.item.localeCompare(b.item))
  }

  return result
}
