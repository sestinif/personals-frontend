import { useState, useEffect } from 'react'
import { AccountIcon } from './Icons'
import { bankBrand } from '../lib/banks'

const iconOptions = [
  { value: 'building', label: 'Banca' },
  { value: 'credit-card', label: 'Carta' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'briefcase', label: 'Business' },
]

const colorOptions = [
  '#0066cc', '#006fcf', '#8b5cf6', '#0d9488',
  '#dc2626', '#ea580c', '#ca8a04', '#16a34a',
]

export default function AccountForm({ account, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    icon: 'credit-card',
    color: '#6366f1',
  })
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (account) {
      setForm({ name: account.name, icon: account.icon, color: account.color })
    }
  }, [account])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const labelClass = 'block text-[13px] font-semibold text-gray-500 dark:text-ink-dim mb-2.5 uppercase tracking-wide'

  const brand = bankBrand(form.name)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-[13px] font-semibold text-gray-500 dark:text-ink-dim uppercase tracking-wide">Nome conto</label>
          {brand && (
            <span
              className="px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide whitespace-nowrap"
              style={{
                background: brand.bg,
                color: brand.fg,
                boxShadow: brand.ring ? `inset 0 0 0 1px ${brand.ring}` : undefined,
              }}
            >
              {brand.label}
            </span>
          )}
        </div>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="es. Intesa San Paolo"
          className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-surface2 border rounded-xl text-[14px] text-gray-900 dark:text-ink placeholder-gray-300 dark:placeholder-ink-faint transition-all duration-200 outline-none input-depth ${
            focused ? 'border-brand-400 dark:border-accent/55 bg-white dark:bg-surface2' : 'border-gray-200/80 dark:border-line hover:border-gray-300 dark:hover:border-line-strong'
          }`}
          required
          autoFocus
        />
      </div>
      <div>
        <label className={labelClass}>Icona</label>
        <div className="flex gap-2">
          {iconOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, icon: opt.value })}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-medium transition-all duration-200 ${
                form.icon === opt.value
                  ? 'border-brand-400 dark:border-accent/45 bg-brand-50 dark:bg-accent/[0.14] text-brand-700 dark:text-accent shadow-sm'
                  : 'border-gray-200/80 dark:border-line text-gray-500 dark:text-ink-dim hover:border-gray-300 dark:hover:border-line-strong hover:bg-gray-50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <AccountIcon icon={opt.value} className="w-4 h-4" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>Colore</label>
        <div className="flex gap-2.5">
          {colorOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm({ ...form, color: c })}
              className={`w-9 h-9 rounded-xl transition-all duration-200 ${
                form.color === c
                  ? 'ring-2 ring-offset-2 dark:ring-offset-surface2 ring-gray-300 dark:ring-accent/60 scale-110 shadow-lg'
                  : 'hover:scale-110 shadow-md'
              }`}
              style={{
                background: `linear-gradient(135deg, ${c}, ${c}cc)`,
                boxShadow: form.color === c ? `0 4px 12px ${c}50` : `0 2px 6px ${c}30`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-ink-dim bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-line rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] dark:hover:border-line-strong hover:text-gray-700 dark:hover:text-ink transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          Annulla
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 text-[14px] font-semibold uppercase tracking-wide text-white bg-brand-600 hover:bg-brand-700 dark:bg-accent-strong dark:hover:bg-brand-700 rounded-xl transition-all duration-200 shadow-sm btn-premium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {account ? 'Aggiorna' : 'Aggiungi'}
        </button>
      </div>
    </form>
  )
}
