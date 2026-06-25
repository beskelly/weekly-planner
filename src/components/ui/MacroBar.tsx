'use client'

interface MacroBarProps {
  label: string
  consumed: number
  target: number
  unit?: string
  colorClass?: string
}

export function MacroBar({
  label,
  consumed,
  target,
  unit = 'g',
  colorClass = 'bg-indigo-500',
}: MacroBarProps) {
  const pct = target > 0 ? Math.min((consumed / target) * 100, 100) : 0
  const done = consumed >= target

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={done ? 'text-emerald-600 font-semibold' : 'text-gray-500'}>
          {consumed}{unit} / {target}{unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
