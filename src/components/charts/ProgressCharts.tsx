'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar,
} from 'recharts'

interface LineProps {
  data: { date: string; weight: number }[]
  goalWeight: number
  yMin: number
  yMax: number
}

export function ProgressLineChart({ data, goalWeight, yMin, yMax }: LineProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis domain={[yMin, yMax]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          formatter={(v: unknown) => [`${v} lbs`, 'Weight']}
        />
        <ReferenceLine y={goalWeight} stroke="#10b981" strokeDasharray="5 3"
          label={{ value: 'Goal', position: 'insideTopRight', fontSize: 10, fill: '#10b981' }} />
        <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface BarProps {
  data: { week: string; count: number }[]
}

export function WorkoutsBarChart({ data }: BarProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          formatter={(v: unknown) => [String(v), 'Sessions']}
        />
        <ReferenceLine y={3} stroke="#6366f1" strokeDasharray="4 3"
          label={{ value: 'Target (3)', position: 'insideTopRight', fontSize: 10, fill: '#6366f1' }} />
        <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
