'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

interface Props {
  data: { date: string; weight: number }[]
  goalWeight: number
  yMin: number
  yMax: number
}

export default function WeightChart({ data, goalWeight, yMin, yMax }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis domain={[yMin, yMax]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}
          formatter={(v: unknown) => [`${v} lbs`, 'Weight']}
        />
        <ReferenceLine
          y={goalWeight} stroke="#10b981" strokeDasharray="5 3"
          label={{ value: `Goal ${goalWeight}`, position: 'insideTopRight', fontSize: 10, fill: '#10b981' }}
        />
        <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
