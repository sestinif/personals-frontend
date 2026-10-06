// A ledger row: name + detail on the left, amount (+ optional sub) on the right.
// The whole row is a button that opens the detail sheet.
export default function LedgerRow({ title, sub, amount, amountSub, tone, onClick }) {
  const amtClass = tone === 'up' ? 'text-pos' : tone === 'down' ? 'text-neg' : 'text-ink'
  return (
    <button
      onClick={onClick}
      className="w-full grid grid-cols-[1fr_auto] gap-3 items-center py-[11px] border-t border-line text-left transition-colors hover:bg-white/[0.02]"
    >
      <span className="min-w-0">
        <span className="block text-[14px] text-ink truncate">{title}</span>
        {sub && <span className="block text-[12px] text-ink-dim truncate mt-[1px]">{sub}</span>}
      </span>
      <span className="text-right whitespace-nowrap">
        <span className={`block text-[14px] font-number ${amtClass}`}>{amount}</span>
        {amountSub && <span className="block text-[12px] text-ink-dim font-number mt-[1px]">{amountSub}</span>}
      </span>
    </button>
  )
}
