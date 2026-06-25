import { dateToWeekDayKey, weekDatesFromStart, currentWeekStart } from '@/lib/utils'
import { format, getDay } from 'date-fns'

describe('dateToWeekDayKey', () => {
  const cases: [string, string][] = [
    ['2024-06-17', 'mon'],
    ['2024-06-18', 'tue'],
    ['2024-06-19', 'wed'],
    ['2024-06-20', 'thu'],
    ['2024-06-21', 'fri'],
    ['2024-06-22', 'sat'],
    ['2024-06-23', 'sun'],
  ]
  test.each(cases)('%s → %s', (dateStr, expected) => {
    expect(dateToWeekDayKey(new Date(dateStr + 'T12:00:00'))).toBe(expected)
  })
})

describe('weekDatesFromStart', () => {
  const weekStart = '2024-06-17' // a Monday

  it('returns exactly 7 dates', () => {
    expect(weekDatesFromStart(weekStart)).toHaveLength(7)
  })

  it('first date matches weekStartDate', () => {
    const dates = weekDatesFromStart(weekStart)
    expect(format(dates[0], 'yyyy-MM-dd')).toBe(weekStart)
  })

  it('last date is 6 days later (Sunday)', () => {
    const dates = weekDatesFromStart(weekStart)
    expect(format(dates[6], 'yyyy-MM-dd')).toBe('2024-06-23')
  })

  it('dates are sequential (1 day apart each)', () => {
    const dates = weekDatesFromStart(weekStart)
    for (let i = 1; i < dates.length; i++) {
      const diff = dates[i].getTime() - dates[i - 1].getTime()
      expect(diff).toBe(86400000) // exactly 1 day in ms
    }
  })
})

describe('currentWeekStart', () => {
  it('returns a string in yyyy-MM-dd format', () => {
    expect(currentWeekStart()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns a Monday', () => {
    const result = currentWeekStart()
    const date = new Date(result + 'T12:00:00')
    expect(getDay(date)).toBe(1) // 1 = Monday
  })
})
