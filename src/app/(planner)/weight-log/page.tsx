'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import dynamic from 'next/dynamic'
import { useWeightStore } from '@/store/weightStore'
import { useProfileStore } from '@/store/profileStore'

const WeightChart = dynamic(() => import('@/components/charts/WeightChart'), {
  ssr: false,
  loading: () => <div className="h-[240px] animate-pulse bg-gray-100 rounded-lg" />,
})

export default function WeightLogPage() {
  const { entries, addEntry, removeEntry } = useWeightStore()
  const profile = useProfileStore((s) => s.profile)

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [weight, setWeight] = useState('')

  const handleLog = () => {
    const val = parseFloat(weight)
    if (!val || val < 50 || val > 500) return
    addEntry(date, val)
    setWeight('')
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const latestWeight = sorted[sorted.length - 1]?.weightLbs ?? profile.currentWeight
  const totalGained = +(latestWeight - profile.currentWeight).toFixed(1)
  const lbsToGo = Math.max(+(profile.goalWeight - latestWeight).toFixed(1), 0)

  const chartData = sorted.map((e) => ({
    date: format(parseISO(e.date), 'MMM d'),
    weight: e.weightLbs,
  }))

  const yMin = Math.max(sorted[0]?.weightLbs ?? profile.currentWeight - 5, profile.currentWeight - 5)
  const yMax = Math.max(latestWeight, profile.goalWeight) + 2

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Weight Log</h1>

      {/* Input */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Log Today's Weight</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
            <input
              type="number" min={50} max={500} step={0.1}
              value={weight} placeholder="e.g. 131.5"
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLog()}
              className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button onClick={handleLog}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            Log
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Current" value={latestWeight.toString()} unit="lbs" />
        <StatCard label="Goal" value={profile.goalWeight.toString()} unit="lbs" accent />
        <StatCard label={lbsToGo > 0 ? 'To Go' : 'Status'} value={lbsToGo > 0 ? lbsToGo.toString() : '🎉'} unit={lbsToGo > 0 ? 'lbs' : 'reached!'} />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Weight Over Time</p>
        {chartData.length >= 2 ? (
          <WeightChart data={chartData} goalWeight={profile.goalWeight} yMin={yMin} yMax={yMax} />
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            Log at least 2 entries to see your weight chart.
          </div>
        )}
      </div>

      {/* Pace indicator */}
      {sorted.length >= 2 && (
        <PaceCard entries={sorted.map((e) => e.weightLbs)} />
      )}

      {/* Recent entries */}
      {sorted.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Recent Entries ({sorted.length} total, {totalGained > 0 ? `+${totalGained}` : totalGained} lbs total)
          </p>
          <div className="space-y-0">
            {[...sorted].reverse().slice(0, 12).map((entry) => (
              <div key={entry.date} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{format(parseISO(entry.date), 'EEE, MMM d, yyyy')}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">{entry.weightLbs} lbs</span>
                  <button onClick={() => removeEntry(entry.date)}
                    aria-label="Remove entry"
                    className="text-gray-300 hover:text-red-400 transition-colors text-sm">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  )
}

function PaceCard({ entries }: { entries: number[] }) {
  const first = entries[0]
  const last = entries[entries.length - 1]
  const gained = last - first
  const weeks = Math.max((entries.length - 1) / 7, 0.14)
  const lbsPerWeek = gained / weeks

  let status: string
  let color: string
  if (lbsPerWeek >= 0.5 && lbsPerWeek <= 1) {
    status = 'On track (0.5–1 lb/week)'; color = 'text-emerald-600 bg-emerald-50'
  } else if (lbsPerWeek < 0.5 && lbsPerWeek >= 0) {
    status = 'Gaining slowly — check calories'; color = 'text-amber-600 bg-amber-50'
  } else if (lbsPerWeek > 1) {
    status = 'Gaining faster than target'; color = 'text-blue-600 bg-blue-50'
  } else {
    status = 'Losing weight — increase calories'; color = 'text-red-600 bg-red-50'
  }

  return (
    <div className={`rounded-xl p-4 flex items-center justify-between ${color}`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Pace</p>
        <p className="text-sm font-medium mt-0.5">{status}</p>
      </div>
      <p className="text-lg font-bold">{lbsPerWeek >= 0 ? '+' : ''}{lbsPerWeek.toFixed(2)} lb/wk</p>
    </div>
  )
}
