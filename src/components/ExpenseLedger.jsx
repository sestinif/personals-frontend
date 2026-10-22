import { useState } from 'react'
import Avatar from './Avatar'
import LedgerRow from './LedgerRow'
import DetailSheet from './DetailSheet'
import { eur, isYearly, monthlyOf, remaining, expenseSub, accountMonthly } from '../lib/expenses'

// Expense register grouped by account. Each row opens the detail sheet.
// Shared by the Overview and the account pages.
export default function ExpenseLedger({ expenses, accounts, onEditExpense, onDeleteExpense, grouped = true, emptyLabel = 'No expenses' }) {
  const [sel, setSel] = useState(null)
  const selAccount = sel && accounts.find((a) => a.id === sel.account_id)

  const row = (e) => (
    <LedgerRow
      key={e.id}
      avatar={<Avatar name={e.name} size={32} />}
      title={e.name}
      sub={expenseSub(e)}
      amount={eur(e.amount)}
      amountSub={isYearly(e) ? `${eur(monthlyOf(e))}/month` : null}
      onClick={() => setSel(e)}
    />
  )

  if (expenses.length === 0) {
    return <div className="py-12 text-center text-[14px] text-ink-dim">{emptyLabel}</div>
  }

  const groups = accounts
    .map((a) => ({ account: a, items: expenses.filter((e) => e.account_id === a.id) }))
    .filter((g) => g.items.length > 0)

  return (
    <div>
      {grouped
        ? groups.map(({ account, items }) => (
            <div key={account.id}>
              <div className="flex items-center justify-between gap-3 pt-[18px] pb-[2px] text-[12px] text-ink-dim">
                <span className="flex items-center gap-2 min-w-0"><Avatar name={account.name} size={24} /><span className="truncate">{account.name}</span></span>
                <span className="font-number whitespace-nowrap">{eur(accountMonthly(account.id, expenses))}/month</span>
              </div>
              {items.map(row)}
            </div>
          ))
        : expenses.map(row)}

      <DetailSheet
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel?.name}
        subtitle={selAccount?.name}
        avatar={selAccount && <Avatar name={selAccount.name} size={40} />}
        amount={sel && `${eur(sel.amount)}${isYearly(sel) ? '/year' : '/month'}`}
        rows={sel ? [
          { label: 'Type', value: sel.expense_type === 'financing' ? 'Financing' : 'Subscription' },
          { label: 'Frequency', value: isYearly(sel) ? 'Yearly' : 'Monthly' },
          ...(sel.renewal_day && !isYearly(sel) ? [{ label: 'Renewal', value: `Day ${sel.renewal_day}` }] : []),
          ...(sel.expense_type === 'financing' && sel.end_date ? [{ label: 'End Date', value: remaining(sel.end_date) }] : []),
          { label: 'Account', value: selAccount?.name || '—' },
        ] : []}
        onEdit={onEditExpense ? () => { const e = sel; setSel(null); onEditExpense(e) } : undefined}
        onDelete={() => { const id = sel.id; setSel(null); onDeleteExpense && onDeleteExpense(id) }}
        deleteLabel="Delete Expense"
      />
    </div>
  )
}
