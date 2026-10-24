import { useState, useEffect } from 'react'
import AmountField from './AmountField'
import Segmented from './Segmented'
import { noAutofill } from '../lib/noAutofill'

const fieldClass = 'w-full h-11 px-3 bg-transparent border border-line-strong rounded-lg text-ink text-[16px] placeholder:text-ink-dim focus:border-accent outline-none transition-colors'
const labelClass = 'block text-[13px] text-ink-dim mb-1.5'

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

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form, amount: parseFloat(form.amount), account_id: parseInt(form.account_id) }
    if (form.expense_type === 'subscription') data.end_date = ''
    onSubmit(data)
  }

  const monthlyHint = form.frequency === 'yearly' && form.amount
    ? `€${(parseFloat(form.amount) / 12).toFixed(2)}/month`
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <AmountField value={form.amount} onChange={(v) => set({ amount: v })} autoFocus />
        {monthlyHint && <div className="mt-2 text-[13px] text-ink-dim">= {monthlyHint}</div>}
      </div>

      <div>
        <label className={labelClass}>Expense Name</label>
        <input {...noAutofill('personals-expense-name')} type="text" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Netflix, MacBook…" className={fieldClass} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Type</label>
          <Segmented
            options={[{ value: 'subscription', label: 'Subscription' }, { value: 'financing', label: 'Financing' }]}
            value={form.expense_type}
            onChange={(v) => set({ expense_type: v })}
          />
        </div>
        <div>
          <label className={labelClass}>Frequency</label>
          <Segmented
            options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
            value={form.frequency}
            onChange={(v) => set({ frequency: v })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Renewal Day</label>
          <input {...noAutofill('personals-renewal-day')} type="text" value={form.renewal_day} onChange={(e) => set({ renewal_day: e.target.value })} placeholder="15" className={fieldClass} />
        </div>
        {form.expense_type === 'financing' && (
          <div>
            <label className={labelClass}>End Date</label>
            <input {...noAutofill('personals-end-date')} type="date" value={form.end_date} onChange={(e) => set({ end_date: e.target.value })} className={fieldClass} />
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Account</label>
        <select value={form.account_id} onChange={(e) => set({ account_id: e.target.value })} className={fieldClass}>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 h-11 text-[15px] text-ink-dim bg-transparent border border-line rounded-lg hover:border-line-strong hover:text-ink transition-colors">
          Cancel
        </button>
        <button type="submit" className="flex-1 h-11 text-[15px] font-medium text-bg bg-accent rounded-lg hover:bg-brand-700 transition-colors">
          {expense ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}
