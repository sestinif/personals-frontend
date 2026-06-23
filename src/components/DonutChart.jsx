import { useState, useEffect } from 'react'

export default function DonutChart({ segments, size = 160, strokeWidth = 20 }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let cumulative = 0
  const total = segments.reduce((s, seg) => s + seg.value, 0)

  if (total === 0) return null

  const arcs = segments.filter(s => s.value > 0).map((seg) => {
    const pct = seg.value / total
    const offset = cumulative
    cumulative += pct
    return { ...seg, pct, offset }
  })

  return (
    <div className="relative donut-glow" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-black/[0.05] dark:text-white/[0.06]"
          strokeWidth={strokeWidth}
        />
        {/* Segments */}
        {arcs.map((arc, i) => {
          const dashLength = arc.pct * circumference
          const gapLength = circumference - dashLength
          const dashOffset = -arc.offset * circumference

          return (
            <circle
              key={arc.id || i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth - 2}
              strokeDasharray={`${animated ? dashLength : 0} ${animated ? gapLength : circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ transitionDelay: `${i * 150 + 400}ms` }}
            />
          )
        })}
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-medium text-ink-faint uppercase tracking-wider">Totale</span>
        <span className="text-[20px] font-medium text-gray-900 dark:text-ink font-number tracking-tight">
          {segments.length}
        </span>
        <span className="text-[10px] font-medium text-ink-faint">conti</span>
      </div>
    </div>
  )
}
