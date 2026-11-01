// Segmented control: active segment gets the elevated surface.
export default function Segmented({ options, value, onChange }) {
  return (
    <div className="grid p-[3px] border border-line rounded-[10px]" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`press py-2 rounded-[6px] text-[14px] truncate ${
            value === o.value ? 'bg-surface2 text-ink font-medium' : 'text-ink-dim hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
