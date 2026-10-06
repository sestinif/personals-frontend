import { useState, useEffect } from 'react'
import { AccountIcon } from './Icons'

const iconOptions = [
  { value: 'building', label: 'Banca' },
  { value: 'credit-card', label: 'Carta' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'briefcase', label: 'Business' },
]

const fieldClass = 'w-full h-11 px-3 bg-transparent border border-line-strong rounded-lg text-ink text-[15px] placeholder:text-ink-dim focus:border-accent outline-none transition-colors'
const labelClass = 'block text-[12px] text-ink-dim mb-1.5'

export default function AccountForm({ account, onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', icon: 'credit-card' })

  useEffect(() => {
    if (account) setForm({ name: account.name, icon: account.icon || 'credit-card' })
  }, [account])

  const handleSubmit = (e) => {
    e.preventDefault()
    // color is kept in the DB but no longer shown; preserve it, default to indigo.
    onSubmit({ name: form.name, icon: form.icon, color: account?.color || '#8D9BFF' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nome conto</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Intesa Sanpaolo"
          className={fieldClass}
          required
          autoFocus
        />
      </div>

      <div>
        <label className={labelClass}>Icona</label>
        <div className="grid grid-cols-4 gap-2">
          {iconOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, icon: opt.value })}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-[12px] transition-colors ${
                form.icon === opt.value
                  ? 'border-accent bg-surface2 text-ink'
                  : 'border-line text-ink-dim hover:border-line-strong hover:text-ink'
              }`}
            >
              <AccountIcon icon={opt.value} className="w-5 h-5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 h-11 text-[14px] text-ink-dim bg-transparent border border-line rounded-lg hover:border-line-strong hover:text-ink transition-colors">
          Annulla
        </button>
        <button type="submit" className="flex-1 h-11 text-[14px] font-medium text-bg bg-accent rounded-lg hover:bg-brand-700 transition-colors">
          {account ? 'Aggiorna' : 'Aggiungi'}
        </button>
      </div>
    </form>
  )
}
