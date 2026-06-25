export type MealSlotType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'preBed'

export type WeekDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type WorkoutType = 'A' | 'B'

// ─── Meals ───────────────────────────────────────────────────────────────────

export interface Meal {
  id: string
  name: string
  description?: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  suitableFor: MealSlotType[]
  isCustom: boolean
}

export interface DailyMeals {
  breakfast: string | null
  lunch: string | null
  snack: string | null
  dinner: string | null
  preBed: string | null
}

export interface WeeklyMealPlan {
  weekStartDate: string
  days: Record<WeekDayKey, DailyMeals>
}

export interface DayTemplate {
  id: string
  name: string
  description: string
  meals: DailyMeals
  totalKcal: number
  totalProtein: number
}

// ─── Workouts ─────────────────────────────────────────────────────────────────

export interface Exercise {
  id: string
  name: string
  workout: WorkoutType
  sets: number
  repsMin: number
  repsMax: number
  startingWeightLbs: number | null
  isBodyweight: boolean
  isTimed: boolean
  notes?: string
}

export interface WorkoutSet {
  setNumber: number
  weightLbs: number | null
  reps: number
  completed: boolean
}

export interface ExerciseLog {
  exerciseId: string
  sets: WorkoutSet[]
  progressionFlag: boolean
}

export interface WorkoutSession {
  id: string
  date: string
  workoutType: WorkoutType
  exercises: ExerciseLog[]
  completed: boolean
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface WeightEntry {
  date: string
  weightLbs: number
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  heightInches: number
  currentWeight: number
  goalWeight: number
  age: number
  dailyCalorieTarget: number
  proteinTarget: number
  carbTarget: number
  fatTarget: number
  dairyFree: boolean
  eggFree: boolean
  avocadoFree: boolean
  workoutStartDate: string
  setupComplete: boolean
}
