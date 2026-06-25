export const STORAGE_KEYS = {
  USER_PROFILE: 'wp:userProfile',
  MEAL_LIBRARY: 'wp:mealLibrary',
  WEEKLY_MEAL_PLANS: 'wp:weeklyMealPlans',
  WORKOUT_SESSIONS: 'wp:workoutSessions',
  WEIGHT_LOG: 'wp:weightLog',
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export function getItem<T>(key: StorageKey): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function setItem<T>(key: StorageKey, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error(`Failed to write ${key} to localStorage`)
  }
}

export function removeItem(key: StorageKey): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

export function clearAll(): void {
  if (typeof window === 'undefined') return
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {}
  Object.entries(STORAGE_KEYS).forEach(([label, key]) => {
    data[label] = getItem(key as StorageKey)
  })
  return JSON.stringify(data, null, 2)
}
