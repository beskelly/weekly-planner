'use client'

import { format, parseISO } from 'date-fns'
import { useWorkoutStore } from '@/store/workoutStore'
import { EXERCISES } from '@/data/workouts'
import type { WorkoutSet } from '@/types'

interface Props {
  sessionId: string
  onBack: () => void
}

export function SessionLogger({ sessionId, onBack }: Props) {
  const session = useWorkoutStore((state) => state.sessions.find((s) => s.id === sessionId))
  const updateSet = useWorkoutStore((s) => s.updateSet)
  const completeSession = useWorkoutStore((s) => s.completeSession)

  if (!session) return null

  const allDone = session.exercises.every((ex) => ex.sets.every((s) => s.completed))

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1">
          ← Week
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">Workout {session.workoutType}</p>
          <p className="text-xs text-gray-400">{format(parseISO(session.date), 'EEEE, MMM d')}</p>
        </div>
        <button
          onClick={() => completeSession(session.id)}
          disabled={session.completed}
          className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
            session.completed
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : allDone
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {session.completed ? '✓ Done' : 'Complete'}
        </button>
      </div>

      {/* Exercises */}
      {session.exercises.map((exLog) => {
        const exercise = EXERCISES.find((e) => e.id === exLog.exerciseId)
        if (!exercise) return null

        return (
          <div key={exLog.exerciseId} className="px-5 py-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{exercise.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {exercise.sets} sets · {exercise.repsMin}–{exercise.repsMax} {exercise.isTimed ? 'sec' : 'reps'}
                  {exercise.notes && ` · ${exercise.notes}`}
                </p>
              </div>
              {exLog.progressionFlag && (
                <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-1 rounded-full shrink-0 ml-2">
                  📈 Bump weight
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              {exLog.sets.map((set, i) => (
                <SetRow
                  key={set.setNumber}
                  set={set}
                  isTimed={exercise.isTimed}
                  isBodyweight={exercise.isBodyweight}
                  disabled={session.completed}
                  onChange={(update) => updateSet(session.id, exLog.exerciseId, i, update)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SetRow({
  set, isTimed, isBodyweight, disabled, onChange,
}: {
  set: WorkoutSet
  isTimed: boolean
  isBodyweight: boolean
  disabled: boolean
  onChange: (u: Partial<WorkoutSet>) => void
}) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${set.completed ? 'bg-emerald-50' : 'bg-gray-50'}`}>
      <span className="text-xs text-gray-400 w-10 shrink-0">Set {set.setNumber}</span>

      {!isBodyweight && (
        <label className="flex items-center gap-1 shrink-0">
          <input
            type="number" min={0} max={999} step={2.5}
            value={set.weightLbs ?? ''}
            onChange={(e) => onChange({ weightLbs: +e.target.value })}
            disabled={disabled || set.completed}
            placeholder="lbs"
            aria-label={`Set ${set.setNumber} weight`}
            className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:bg-transparent disabled:border-transparent"
          />
          <span className="text-xs text-gray-400">lbs</span>
        </label>
      )}

      <label className="flex items-center gap-1 shrink-0">
        <input
          type="number" min={0} max={300}
          value={set.reps || ''}
          onChange={(e) => onChange({ reps: +e.target.value })}
          disabled={disabled || set.completed}
          placeholder={isTimed ? 'sec' : 'reps'}
          aria-label={`Set ${set.setNumber} ${isTimed ? 'seconds' : 'reps'}`}
          className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:bg-transparent disabled:border-transparent"
        />
        <span className="text-xs text-gray-400">{isTimed ? 'sec' : 'reps'}</span>
      </label>

      <button
        onClick={() => onChange({ completed: !set.completed })}
        disabled={disabled}
        aria-label={set.completed ? 'Mark incomplete' : 'Mark complete'}
        className={`ml-auto w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
          set.completed
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-300 text-transparent hover:border-emerald-400 disabled:opacity-40'
        }`}
      >
        ✓
      </button>
    </div>
  )
}
