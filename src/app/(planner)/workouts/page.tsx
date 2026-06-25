'use client'

import { useState } from 'react'
import { format, addWeeks, subWeeks } from 'date-fns'
import { useWorkoutStore } from '@/store/workoutStore'
import { useProfileStore } from '@/store/profileStore'
import { useWorkoutSchedule } from '@/hooks/useWorkoutSchedule'
import { SessionLogger } from '@/components/workouts/SessionLogger'
import { currentWeekStart, weekDatesFromStart, WEEK_DAY_KEYS, WEEK_DAY_LABELS } from '@/lib/utils'
import type { WorkoutType } from '@/types'

export default function WorkoutsPage() {
  const [weekStart, setWeekStart] = useState(currentWeekStart())
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const profile = useProfileStore((s) => s.profile)
  const sessions = useWorkoutStore((s) => s.sessions)
  const getOrCreateSession = useWorkoutStore((s) => s.getOrCreateSession)

  const weekDates = weekDatesFromStart(weekStart)
  const schedule = useWorkoutSchedule(profile.workoutStartDate, weekDates)

  const today = format(new Date(), 'yyyy-MM-dd')

  const prev = () => { setWeekStart(format(subWeeks(weekDates[0], 1), 'yyyy-MM-dd')); setActiveSessionId(null) }
  const next = () => { setWeekStart(format(addWeeks(weekDates[0], 1), 'yyyy-MM-dd')); setActiveSessionId(null) }

  const handleDayClick = (dateStr: string, workoutType: WorkoutType) => {
    const session = getOrCreateSession(dateStr, workoutType)
    setActiveSessionId(session.id)
  }

  const weekLabel = `${format(weekDates[0], 'MMM d')} – ${format(weekDates[6], 'MMM d, yyyy')}`

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Workouts</h1>

      <div className="flex items-center gap-3">
        <button onClick={prev} aria-label="Previous week" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 font-medium">←</button>
        <span className="text-sm font-medium text-gray-700 min-w-[180px] text-center">{weekLabel}</span>
        <button onClick={next} aria-label="Next week" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 font-medium">→</button>
      </div>

      {/* Week grid */}
      <div className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[400px]">
          {WEEK_DAY_KEYS.map((day, i) => {
            const date = weekDates[i]
            const dateStr = format(date, 'yyyy-MM-dd')
            const daySchedule = schedule[i]
            const isRest = daySchedule === 'rest'
            const session = sessions.find((s) => s.date === dateStr)
            const isToday = dateStr === today
            const isActive = activeSessionId !== null && session?.id === activeSessionId

            return (
              <button
                key={day}
                disabled={isRest}
                onClick={() => !isRest && handleDayClick(dateStr, daySchedule as WorkoutType)}
                className={`rounded-xl p-3 text-center transition-colors ${
                  isRest
                    ? 'bg-gray-50 cursor-default'
                    : isActive
                    ? 'bg-indigo-100 ring-2 ring-indigo-400'
                    : 'bg-indigo-50 hover:bg-indigo-100 cursor-pointer'
                } ${isToday ? 'ring-2 ring-offset-1 ring-indigo-300' : ''}`}
              >
                <p className="text-xs font-semibold text-gray-600">{WEEK_DAY_LABELS[day]}</p>
                <p className="text-xs text-gray-400 mt-0.5">{format(date, 'd')}</p>
                <div className="mt-2 flex justify-center">
                  {isRest ? (
                    <span className="text-lg" title="Rest day">😴</span>
                  ) : session?.completed ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">✓</div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${daySchedule === 'A' ? 'bg-indigo-500' : 'bg-violet-500'}`}>
                      {daySchedule}
                    </div>
                  )}
                </div>
                {isToday && <p className="text-xs text-indigo-500 font-medium mt-1">Today</p>}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">A</div>
            Upper body / compound push
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">B</div>
            Lower body / pull
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-base">😴</span> Rest
          </div>
        </div>
      </div>

      {/* Session Logger */}
      {activeSessionId && (
        <SessionLogger
          sessionId={activeSessionId}
          onBack={() => setActiveSessionId(null)}
        />
      )}
    </div>
  )
}
