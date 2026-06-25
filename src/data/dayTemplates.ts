import type { DayTemplate } from '@/types'

export const DAY_TEMPLATES: DayTemplate[] = [
  {
    id: 'template-power-day',
    name: 'Power Day',
    description: 'High-calorie shake-led day — easiest to get down, highest protein',
    meals: {
      breakfast: 'meal-power-shake',
      lunch: 'meal-chicken-rice-bowl',
      snack: 'meal-protein-shake-nuts',
      dinner: 'meal-salmon-mashed-potato',
      preBed: 'meal-soy-yogurt-granola',
    },
    totalKcal: 3100,
    totalProtein: 182,
  },
  {
    id: 'template-dense-day',
    name: 'Dense Day',
    description: 'Low-volume meals — ideal when fullness is the problem',
    meals: {
      breakfast: 'meal-chicken-sausage-toast',
      lunch: 'meal-chicken-rice-bowl',
      snack: 'meal-stuffed-dates-nuts',
      dinner: 'meal-beef-pasta',
      preBed: 'meal-preBed-protein-shake',
    },
    totalKcal: 2960,
    totalProtein: 148,
  },
  {
    id: 'template-high-protein',
    name: 'High Protein',
    description: 'Pushes well past 150 g protein — good after a heavy workout',
    meals: {
      breakfast: 'meal-oats-soy-milk',
      lunch: 'meal-chicken-rice-edamame',
      snack: 'meal-mass-shake',
      dinner: 'meal-chicken-pasta',
      preBed: 'meal-soy-yogurt-granola',
    },
    totalKcal: 2900,
    totalProtein: 162,
  },
  {
    id: 'template-variety-day',
    name: 'Variety Day',
    description: 'Mixes tofu, turkey, and steak for a break from chicken-heavy days',
    meals: {
      breakfast: 'meal-tofu-scramble-toast',
      lunch: 'meal-turkey-sweet-potato',
      snack: 'meal-mass-shake',
      dinner: 'meal-steak-rice-broccoli',
      preBed: 'meal-pea-protein-granola',
    },
    totalKcal: 3030,
    totalProtein: 184,
  },
  {
    id: 'template-seafood-day',
    name: 'Seafood Day',
    description: 'Tuna, shrimp, and salmon — lighter feel, still hits targets',
    meals: {
      breakfast: 'meal-power-shake',
      lunch: 'meal-tuna-rice-bowl',
      snack: 'meal-protein-shake-nuts',
      dinner: 'meal-shrimp-stir-fry',
      preBed: 'meal-preBed-protein-shake',
    },
    totalKcal: 2900,
    totalProtein: 196,
  },
]
