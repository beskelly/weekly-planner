import { render, screen, fireEvent } from '@testing-library/react'
import { MealPicker } from '@/components/meals/MealPicker'
import { useMealStore } from '@/store/mealStore'
import type { Meal } from '@/types'

jest.mock('@/store/mealStore')
const mockUseMealStore = useMealStore as jest.MockedFunction<typeof useMealStore>

const MOCK_MEALS: Meal[] = [
  { id: 'm1', name: 'Chicken Rice Bowl', kcal: 620, protein: 48, carbs: 60, fat: 12, suitableFor: ['lunch', 'dinner'], isCustom: false },
  { id: 'm2', name: 'Overnight Oats', kcal: 450, protein: 20, carbs: 70, fat: 10, suitableFor: ['breakfast'], isCustom: false },
  { id: 'm3', name: 'Protein Shake', kcal: 250, protein: 30, carbs: 20, fat: 5, suitableFor: ['snack', 'preBed'], isCustom: false },
]

beforeEach(() => {
  mockUseMealStore.mockImplementation((selector) =>
    (selector as (s: { mealLibrary: Meal[] }) => unknown)({ mealLibrary: MOCK_MEALS })
  )
})

describe('MealPicker', () => {
  it('shows meals suitable for the selected slot in the top section', () => {
    render(
      <MealPicker slot="lunch" onSelect={jest.fn()} onClose={jest.fn()} onAddCustom={jest.fn()} />
    )
    expect(screen.getByText('Chicken Rice Bowl')).toBeInTheDocument()
  })

  it('shows meals from other slots in a secondary section', () => {
    render(
      <MealPicker slot="lunch" onSelect={jest.fn()} onClose={jest.fn()} onAddCustom={jest.fn()} />
    )
    expect(screen.getByText('Overnight Oats')).toBeInTheDocument()
    expect(screen.getByText('Protein Shake')).toBeInTheDocument()
  })

  it('filters meals by search term', () => {
    render(
      <MealPicker slot="lunch" onSelect={jest.fn()} onClose={jest.fn()} onAddCustom={jest.fn()} />
    )
    fireEvent.change(screen.getByPlaceholderText('Search meals…'), { target: { value: 'oat' } })
    expect(screen.queryByText('Chicken Rice Bowl')).not.toBeInTheDocument()
    expect(screen.getByText('Overnight Oats')).toBeInTheDocument()
  })

  it('calls onSelect with the meal id when a meal row is clicked', () => {
    const onSelect = jest.fn()
    render(
      <MealPicker slot="lunch" onSelect={onSelect} onClose={jest.fn()} onAddCustom={jest.fn()} />
    )
    fireEvent.click(screen.getByText('Chicken Rice Bowl'))
    expect(onSelect).toHaveBeenCalledWith('m1')
  })

  it('calls onClose when clicking the × button', () => {
    const onClose = jest.fn()
    render(
      <MealPicker slot="lunch" onSelect={jest.fn()} onClose={onClose} onAddCustom={jest.fn()} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onAddCustom when the create link is clicked', () => {
    const onAddCustom = jest.fn()
    render(
      <MealPicker slot="lunch" onSelect={jest.fn()} onClose={jest.fn()} onAddCustom={onAddCustom} />
    )
    fireEvent.click(screen.getByText('+ Create custom meal'))
    expect(onAddCustom).toHaveBeenCalled()
  })

  it('shows empty state when search has no matches', () => {
    render(
      <MealPicker slot="lunch" onSelect={jest.fn()} onClose={jest.fn()} onAddCustom={jest.fn()} />
    )
    fireEvent.change(screen.getByPlaceholderText('Search meals…'), { target: { value: 'zzznomatch' } })
    expect(screen.getByText('No meals found.')).toBeInTheDocument()
  })
})
