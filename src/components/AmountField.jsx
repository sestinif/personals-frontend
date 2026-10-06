// Big amount input: the largest thing in a form. The symbol sits left in grey.
// width:0 + flex keeps a number input from widening the whole page on phones.
export default function AmountField({ value, onChange, currency = '€', autoFocus }) {
  return (
    <div className="flex items-baseline gap-1 pb-2.5 border-b border-line-strong focus-within:border-accent">
      <span className="text-[34px] tracking-tight text-ink-dim font-number">{currency}</span>
      <input
        type="number"
        step="0.01"
        min="0"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder="0,00"
        className="flex-1 w-0 min-w-0 p-0 bg-transparent border-0 outline-none text-ink text-[34px] tracking-tight font-number placeholder:text-ink-dim [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}
