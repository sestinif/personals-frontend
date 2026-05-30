import { useState, useEffect } from 'react'

export default function ExpenseForm({ expense, accounts, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    renewal_day: '',
    frequency: 'monthly',
    expense_type: 'subscription',
    end_date: '',
    account_id: accounts[0]?.id || '',
  })
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    if (expense) {
      setForm({
        name: expense.name,
        amount: expense.amount,
        renewal_day: expense.renewal_day || '',
        frequency: expense.frequency || 'monthly',
        expense_type: expense.expense_type || 'subscription',
        end_date: expense.end_date || '',
        account_id: expense.account_id,
      })
    }
  }, [expense])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      amount: parseFloat(form.amount),
      account_id: parseInt(form.account_id),
    }
    if (form.expense_type === 'subscription') data.end_date = ''
    onSubmit(data)
  }

  const inputClass = (name) => `w-full px-3.5 py-2.5 bg-gray-50/50 dark:bg-white/[0.03] border rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all duration-200 outline-none input-depth ${
    focused === name
      ? 'border-brand-400 dark:border-brand-500/40 bg-white dark:bg-white/[0.05]'
      : 'border-gray-200/80 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12]'
  }`
  const labelClass = 'block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider'

  const toggleBtn = (active) => `flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all duration-200 ${
    active
      ? 'bg-white dark:bg-white/[0.1] text-gray-900 dark:text-white shadow-sm'
      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
  }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Nome spesa</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
          placeholder="es. Spotify, MacBook..."
          className={inputClass('name')}
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Tipo</label>
          <div className="flex gap-0.5 p-0.5 bg-gray-100/80 dark:bg-white/[0.04] rounded-lg">
            <button type="button" onClick={() => setForm({ ...form, expense_type: 'subscription' })} className={toggleBtn(form.expense_type === 'subscription')}>
              Abbonam.
            </button>
            <button type="button" onClick={() => setForm({ ...form, expense_type: 'financing' })} className={toggleBtn(form.expense_type === 'financing')}>
              Finanziam.
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass}>Frequenza</label>
          <div className="flex gap-0.5 p-0.5 bg-gray-100/80 dark:bg-white/[0.04] rounded-lg">
            <button type="button" onClick={() => setForm({ ...form, frequency: 'monthly' })} className={toggleBtn(form.frequency === 'monthly')}>
              Mensile
            </button>
            <button type="button" onClick={() => setForm({ ...form, frequency: 'yearly' })} className={toggleBtn(form.frequency === 'yearly')}>
              Annuale
            </button>
          </div>
        </div>
      </div>

      <div className={`grid gap-3 ${form.expense_type === 'financing' ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div>
          <label className={labelClass}>Importo</label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider transition-colors ${focused === 'amount' ? 'text-brand-500' : 'text-gray-300 dark:text-gray-600'}`}>EUR</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              onFocus={() => setFocused('amount')}
              onBlur={() => setFocused(null)}
              placeholder="0.00"
              className={`${inputClass('amount')} pl-12 font-mono font-semibold`}
              required
            />
          </div>
          {form.frequency === 'yearly' && form.amount && (
            <p className="text-[10px] text-brand-400/70 font-medium mt-1 pl-0.5">
              = {(parseFloat(form.amount) / 12).toFixed(2)}/mese
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Giorno rinnovo</label>
          <input
            type="text"
            value={form.renewal_day}
            onChange={(e) => setForm({ ...form, renewal_day: e.target.value })}
            onFocus={() => setFocused('renewal')}
            onBlur={() => setFocused(null)}
            placeholder="es. 15"
            className={inputClass('renewal')}
          />
        </div>
        {form.expense_type === 'financing' && (
          <div>
            <label className={labelClass}>Scadenza</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              onFocus={() => setFocused('end_date')}
              onBlur={() => setFocused(null)}
              className={inputClass('end_date')}
            />
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Conto</label>
        <select
          value={form.account_id}
          onChange={(e) => setForm({ ...form, account_id: e.target.value })}
          onFocus={() => setFocused('account')}
          onBlur={() => setFocused(null)}
          className={inputClass('account')}
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
        >
          Annulla
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl hover:from-brand-700 hover:to-brand-600 transition-all duration-200 shadow-md shadow-brand-500/20 btn-premium"
        >
          {expense ? 'Aggiorna' : 'Aggiungi'}
        </button>
      </div>
    </form>
  )
}
