'use client'

interface MacroRingProps {
  consumed: number
  target: number
  size?: number
}

export function MacroRing({ consumed, target, size = 144 }: MacroRingProps) {
  const r = 50
  const circ = 2 * Math.PI * r
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0
  const offset = circ * (1 - pct)
  const color = consumed >= target ? '#10b981' : '#6366f1'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        {/* Track uses currentColor via text-* so it adapts to dark mode */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10"
          className="text-gray-200 dark:text-gray-700" />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <div className="absolute text-center leading-tight">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{consumed}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500">/ {target} kcal</div>
      </div>
    </div>
  )
}
