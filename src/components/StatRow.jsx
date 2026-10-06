// A row of 3 indicators, no boxes: 12px label above, 24px value below.
// tone: 'up' → green, 'down' → rose, otherwise default ink.
export default function StatRow({ stats }) {
  const toneClass = (t) => (t === 'up' ? 'text-pos' : t === 'down' ? 'text-neg' : 'text-ink')
  return (
    <div className="grid grid-cols-3 gap-4 py-5 border-b border-line">
      {stats.map((s, i) => (
        <div key={i} className="min-w-0">
          <div className="text-[12px] text-ink-dim mb-1">{s.label}</div>
          <div className={`text-[24px] font-medium tracking-tight font-number truncate ${toneClass(s.tone)}`}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  )
}
