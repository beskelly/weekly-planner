import { render, screen, fireEvent } from '@testing-library/react'
import { SessionLogger } from '@/components/workouts/SessionLogger'
import { useWorkoutStore } from '@/store/workoutStore'
import type { WorkoutSession } from '@/types'

jest.mock('@/store/workoutStore')
jest.mock('@/data/workouts', () => ({
  EXERCISES: [
    {
      id: 'ex-bench',
      name: 'Bench Press',
      workout: 'A',
      sets: 3,
      repsMin: 8,
      repsMax: 12,
      startingWeightLbs: 135,
      isBodyweight: false,
      isTimed: false,
    },
    {
      id: 'ex-plank',
      name: 'Plank',
      workout: 'A',
      sets: 3,
      repsMin: 30,
      repsMax: 60,
      startingWeightLbs: null,
      isBodyweight: true,
      isTimed: true,
    },
  ],
}))

const mockUpdateSet = jest.fn()
const mockCompleteSession = jest.fn()

const SESSION: WorkoutSession = {
  id: 'session-1',
  date: '2024-06-17',
  workoutType: 'A',
  completed: false,
  exercises: [
    {
      exerciseId: 'ex-bench',
      progressionFlag: false,
      sets: [
        { setNumber: 1, weightLbs: 135, reps: 0, completed: false },
        { setNumber: 2, weightLbs: 135, reps: 0, completed: false },
        { setNumber: 3, weightLbs: 135, reps: 0, completed: false },
      ],
    },
    {
      exerciseId: 'ex-plank',
      progressionFlag: false,
      sets: [
        { setNumber: 1, weightLbs: null, reps: 0, completed: false },
      ],
    },
  ],
}

const mockUseMealStore = useWorkoutStore as jest.MockedFunction<typeof useWorkoutStore>

beforeEach(() => {
  jest.clearAllMocks()
  mockUseMealStore.mockImplementation((selector) =>
    (selector as (s: { sessions: WorkoutSession[]; updateSet: typeof mockUpdateSet; completeSession: typeof mockCompleteSession }) => unknown)({
      sessions: [SESSION],
      updateSet: mockUpdateSet,
      completeSession: mockCompleteSession,
    })
  )
})

describe('SessionLogger', () => {
  it('renders the exercise names', () => {
    render(<SessionLogger sessionId="session-1" onBack={jest.fn()} />)
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Plank')).toBeInTheDocument()
  })

  it('renders set rows for each exercise', () => {
    render(<SessionLogger sessionId="session-1" onBack={jest.fn()} />)
    // Bench Press has 3 sets
    expect(screen.getAllByText(/^Set [123]$/)).toHaveLength(4) // 3 + 1 from Plank
  })

  it('does not show weight input for bodyweight (timed) exercises', () => {
    render(<SessionLogger sessionId="session-1" onBack={jest.fn()} />)
    // Bench press has weight inputs; only the plank set should not
    const weightInputs = screen.getAllByPlaceholderText('lbs')
    expect(weightInputs).toHaveLength(3) // only bench press sets
  })

  it('calls updateSet when a set is marked complete', () => {
    render(<SessionLogger sessionId="session-1" onBack={jest.fn()} />)
    const checkButtons = screen.getAllByRole('button', { name: 'Mark complete' })
    fireEvent.click(checkButtons[0])
    expect(mockUpdateSet).toHaveBeenCalledWith('session-1', 'ex-bench', 0, { completed: true })
  })

  it('calls completeSession when Complete button is clicked', () => {
    render(<SessionLogger sessionId="session-1" onBack={jest.fn()} />)
    fireEvent.click(screen.getByText('Complete'))
    expect(mockCompleteSession).toHaveBeenCalledWith('session-1')
  })

  it('calls onBack when the back button is clicked', () => {
    const onBack = jest.fn()
    render(<SessionLogger sessionId="session-1" onBack={onBack} />)
    fireEvent.click(screen.getByText('← Week'))
    expect(onBack).toHaveBeenCalled()
  })

  it('returns null when session is not found', () => {
    mockUseMealStore.mockImplementation((selector) =>
      (selector as (s: { sessions: WorkoutSession[]; updateSet: jest.Mock; completeSession: jest.Mock }) => unknown)({
        sessions: [],
        updateSet: mockUpdateSet,
        completeSession: mockCompleteSession,
      })
    )
    const { container } = render(<SessionLogger sessionId="nonexistent" onBack={jest.fn()} />)
    expect(container.firstChild).toBeNull()
  })
})
