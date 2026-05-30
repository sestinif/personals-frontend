import { useState, useEffect } from 'react'
import { AccountIcon } from './Icons'

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

  const labelClass = 'block text-[13px] font-semibold text-gray-500 dark:text-gray-400 mb-2.5 uppercase tracking-wide'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nome conto</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="es. Intesa San Paolo"
          className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all duration-200 outline-none input-depth ${
            focused ? 'border-brand-400 dark:border-brand-500/40 bg-white dark:bg-white/[0.05]' : 'border-gray-200/80 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12]'
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
                  ? 'border-brand-400 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 shadow-sm shadow-brand-500/10'
                  : 'border-gray-200/80 dark:border-white/[0.06] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/[0.12] hover:bg-gray-50 dark:hover:bg-white/[0.03]'
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
                  ? 'ring-2 ring-offset-2 dark:ring-offset-[#16162a] ring-gray-300 dark:ring-brand-400/50 scale-110 shadow-lg'
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
          className="flex-1 px-4 py-3 text-[14px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
        >
          Annulla
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 text-[14px] font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl hover:from-brand-700 hover:to-brand-600 transition-all duration-200 shadow-md shadow-brand-500/20 btn-premium"
        >
          {account ? 'Aggiorna' : 'Aggiungi'}
        </button>
      </div>
    </form>
  )
}
