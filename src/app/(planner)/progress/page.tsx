'use client'

import { format, parseISO, differenceInDays } from 'date-fns'
import dynamic from 'next/dynamic'
import { useWeightStore } from '@/store/weightStore'
import { useWorkoutStore } from '@/store/workoutStore'
import { useProfileStore } from '@/store/profileStore'

const ProgressLineChart = dynamic(
  () => import('@/components/charts/ProgressCharts').then((m) => ({ default: m.ProgressLineChart })),
  { ssr: false, loading: () => <div className="h-[220px] animate-pulse bg-gray-100 rounded-lg" /> }
)
const WorkoutsBarChart = dynamic(
  () => import('@/components/charts/ProgressCharts').then((m) => ({ default: m.WorkoutsBarChart })),
  { ssr: false, loading: () => <div className="h-[180px] animate-pulse bg-gray-100 rounded-lg" /> }
)

export default function ProgressPage() {
  const profile = useProfileStore((s) => s.profile)
  const entries = useWeightStore((s) => s.entries)
  const sessions = useWorkoutStore((s) => s.sessions)

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const latestWeight = sorted[sorted.length - 1]?.weightLbs ?? profile.currentWeight
  const totalGained = +(latestWeight - profile.currentWeight).toFixed(1)
  const goalPct = profile.goalWeight > profile.currentWeight
    ? Math.min(((latestWeight - profile.currentWeight) / (profile.goalWeight - profile.currentWeight)) * 100, 100)
    : 100

  const weightChartData = sorted.map((e) => ({
    date: format(parseISO(e.date), 'MMM d'),
    weight: e.weightLbs,
  }))

  const yMin = Math.max((sorted[0]?.weightLbs ?? profile.currentWeight) - 3, 80)
  const yMax = Math.max(latestWeight, profile.goalWeight) + 3

  // Workouts per week chart (last 8 weeks)
  const completedSessions = sessions.filter((s) => s.completed).sort((a, b) => a.date.localeCompare(b.date))
  const weeklyWorkouts = buildWeeklyWorkouts(completedSessions)

  const totalDays = sorted.length >= 2 ? differenceInDays(parseISO(sorted[sorted.length - 1].date), parseISO(sorted[0].date)) : 0
  const totalWeeks = Math.max(totalDays / 7, 1)
  const avgWorkoutsPerWeek = completedSessions.length > 0 ? (completedSessions.length / totalWeeks).toFixed(1) : '0'

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Progress</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Gained" value={totalGained >= 0 ? `+${totalGained}` : `${totalGained}`} unit="lbs" />
        <StatCard label="Current Weight" value={latestWeight.toString()} unit="lbs" />
        <StatCard label="Sessions Done" value={completedSessions.length.toString()} unit="total" />
        <StatCard label="Avg/Week" value={avgWorkoutsPerWeek} unit="workouts" />
      </div>

      {/* Goal progress */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Goal Progress</p>
          <span className="text-sm font-bold text-gray-900">{goalPct.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(goalPct, 2)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Start: {profile.currentWeight} lbs</span>
          <span>Goal: {profile.goalWeight} lbs</span>
        </div>
      </div>

      {/* Weight trend chart */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Weight Trend</p>
        {weightChartData.length >= 2 ? (
          <ProgressLineChart data={weightChartData} goalWeight={profile.goalWeight} yMin={yMin} yMax={yMax} />
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            Log at least 2 weight entries to see your trend.
          </div>
        )}
      </div>

      {/* Workouts per week chart */}
      {weeklyWorkouts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Workouts Per Week</p>
          <WorkoutsBarChart data={weeklyWorkouts} />
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  )
}

function buildWeeklyWorkouts(sessions: { date: string }[]) {
  if (!sessions.length) return []
  const map = new Map<string, number>()
  for (const s of sessions) {
    const d = parseISO(s.date)
    const mon = new Date(d)
    mon.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const key = format(mon, 'MMM d')
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .slice(-8)
    .map(([week, count]) => ({ week, count }))
}
