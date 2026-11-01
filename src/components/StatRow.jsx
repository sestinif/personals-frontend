// A row of 3 indicators in ONE card divided by 1px hairlines: label above, value below.
// tone: 'up' → green, 'down' → rose, otherwise default ink.
export default function StatRow({ stats }) {
  const toneClass = (t) => (t === 'up' ? 'text-pos' : t === 'down' ? 'text-neg' : 'text-ink')
  return (
    <div className="stat-card-group grid-cols-3 my-4">
      {stats.map((s, i) => (
        <div key={i}>
          <div className="text-[13px] text-ink-dim mb-1">{s.label}</div>
          <div className={`text-[25px] font-medium tracking-tight font-number truncate ${toneClass(s.tone)}`}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  )
}
