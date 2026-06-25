import { format, startOfWeek, parseISO, addDays } from 'date-fns'
import type { WeekDayKey } from '@/types'

export function currentWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function dateToWeekDayKey(date: Date): WeekDayKey {
  const days: WeekDayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const dow = date.getDay()
  return days[dow === 0 ? 6 : dow - 1]
}

export function weekDatesFromStart(weekStartDate: string): Date[] {
  const start = parseISO(weekStartDate)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export const WEEK_DAY_KEYS: WeekDayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const WEEK_DAY_LABELS: Record<WeekDayKey, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}
