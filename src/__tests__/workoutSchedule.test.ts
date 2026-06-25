import { getWorkoutForDate } from '@/hooks/useWorkoutSchedule'
import { parseISO } from 'date-fns'

describe('getWorkoutForDate', () => {
  const startDate = parseISO('2024-06-17') // arbitrary start Monday

  it('returns rest for dates strictly before startDate', () => {
    expect(getWorkoutForDate(parseISO('2024-06-16'), startDate)).toBe('rest')
    expect(getWorkoutForDate(parseISO('2024-01-01'), startDate)).toBe('rest')
  })

  it('returns A on day 0 (the start date itself)', () => {
    expect(getWorkoutForDate(startDate, startDate)).toBe('A')
  })

  it('returns rest on day 1 (odd offset)', () => {
    expect(getWorkoutForDate(parseISO('2024-06-18'), startDate)).toBe('rest')
  })

  it('returns B on day 2', () => {
    expect(getWorkoutForDate(parseISO('2024-06-19'), startDate)).toBe('B')
  })

  it('returns rest on day 3', () => {
    expect(getWorkoutForDate(parseISO('2024-06-20'), startDate)).toBe('rest')
  })

  it('returns A on day 4 (second A workout)', () => {
    expect(getWorkoutForDate(parseISO('2024-06-21'), startDate)).toBe('A')
  })

  it('returns B on day 6', () => {
    expect(getWorkoutForDate(parseISO('2024-06-23'), startDate)).toBe('B')
  })

  it('alternates correctly over 10 workout days', () => {
    const schedule: string[] = []
    for (let i = 0; i < 20; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      schedule.push(getWorkoutForDate(d, startDate))
    }
    // Every even offset = workout, every odd = rest
    // Workouts: A, B, A, B, A, B, A, B, A, B
    const workouts = schedule.filter((s) => s !== 'rest')
    expect(workouts).toEqual(['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'])
    // Rest days at every odd offset
    const rests = schedule.filter((s) => s === 'rest')
    expect(rests).toHaveLength(10)
  })
})
