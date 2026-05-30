import { useState } from 'react'
import { AccountIcon, PlusIcon, PencilIcon, TrashIcon } from './Icons'

function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function isExpenseYearly(e) {
  return e.frequency === 'yearly' || (e.renewal_day && e.renewal_day.toLowerCase().includes('annuale'))
}

function getExpenseLabel(expense) {
  const parts = []
  if (expense.expense_type === 'financing') {
    parts.push('Finanziamento')
    if (expense.end_date) {
      const remaining = getRemainingTime(expense.end_date)
      if (remaining) parts.push(remaining)
    }
  }
  if (isExpenseYearly(expense)) {
    parts.push('Annuale')
  } else if (expense.renewal_day) {
    parts.push(`Giorno ${expense.renewal_day}`)
  }
  return parts.join(' · ')
}

function getRemainingTime(endDate) {
  const now = new Date()
  const end = new Date(endDate)
  const diffMs = end - now
  if (diffMs <= 0) return 'Scaduto'
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (days < 30) return `${days}g rimasti`
  const months = Math.round(days / 30.44)
  if (months < 12) return `${months} mesi rimasti`
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  if (remMonths === 0) return `${years}a rimasti`
  return `${years}a ${remMonths}m rimasti`
}

export default function AccountCard({
  account,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onEditAccount,
  onDeleteAccount,
}) {
  const [showActions, setShowActions] = useState(false)
  const isYearly = isExpenseYearly
  const total = expenses.reduce((sum, e) => sum + (isYearly(e) ? e.amount / 12 : e.amount), 0)

  return (
    <div className="card-premium overflow-hidden group/card">
      {/* Colored top accent line */}
      <div className="h-[3px] w-full relative" style={{ background: `linear-gradient(90deg, ${account.color}, ${account.color}88)` }}>
        <div className="absolute inset-x-[15%] top-0 h-[3px] blur-[4px] opacity-60" style={{ background: account.color }} />
      </div>

      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white icon-badge transition-transform duration-300 group-hover/card:scale-105"
            style={{
              background: `linear-gradient(135deg, ${account.color}, ${account.color}bb)`,
              boxShadow: `0 4px 14px ${account.color}33, inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
          >
            <AccountIcon icon={account.icon} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{account.name}</h3>
            <p className="text-[13px] text-gray-400 font-medium">
              {expenses.length} {expenses.length === 1 ? 'spesa' : 'spese'} attive
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-0.5 transition-all duration-200 ${showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
            <button
              onClick={() => onEditAccount(account)}
              className="p-2 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
              title="Modifica conto"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteAccount(account.id)}
              className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Elimina conto"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900 dark:text-white font-number tracking-tight">{formatCurrency(total)}</p>
            <p className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">/mese</p>
          </div>
        </div>
      </div>

      {/* Expenses list */}
      <div className="border-t border-gray-50/80 dark:border-white/[0.04]">
        {expenses.map((expense, index) => (
          <div
            key={expense.id}
            className="expense-row group px-6 py-3.5 flex items-center justify-between"
            style={{ '--accent-color': account.color }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-150"
                style={{ backgroundColor: account.color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {expense.name}
                  </p>
                  {expense.expense_type === 'financing' && (
                    <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30">
                      Fin
                    </span>
                  )}
                </div>
                {(isYearly(expense) || expense.renewal_day || (expense.expense_type === 'financing' && expense.end_date)) && (
                  <p className={`text-[11px] font-medium ${
                    expense.expense_type === 'financing' && expense.end_date && getRemainingTime(expense.end_date) === 'Scaduto'
                      ? 'text-red-400'
                      : 'text-gray-300 dark:text-gray-500'
                  }`}>
                    {getExpenseLabel(expense)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                <button
                  onClick={() => onEditExpense(expense)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-right w-28">
                <span className="text-[14px] font-semibold text-gray-600 dark:text-gray-300 font-number">
                  {formatCurrency(expense.amount)}{isYearly(expense) ? '/a' : ''}
                </span>
                {isYearly(expense) && (
                  <p className="text-[10px] text-gray-300 dark:text-gray-500 font-number font-medium">
                    {formatCurrency(expense.amount / 12)}/m
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <div className="px-6 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
              <PlusIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">Nessuna spesa registrata</p>
          </div>
        )}
      </div>

      {/* Add expense button */}
      <div className="border-t border-gray-100/80 dark:border-white/[0.04] px-6 py-3.5">
        <button
          onClick={() => onAddExpense(account.id)}
          className="flex items-center gap-2 text-[13px] font-semibold text-brand-500 hover:text-brand-700 transition-all group/btn"
        >
          <div className="p-1 rounded-md bg-brand-50 group-hover/btn:bg-brand-100 transition-colors">
            <PlusIcon className="w-3.5 h-3.5" />
          </div>
          <span>Aggiungi spesa</span>
        </button>
      </div>
    </div>
  )
}
