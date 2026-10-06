import { useState } from 'react'
import Avatar from './Avatar'
import ExpenseLedger from './ExpenseLedger'
import DetailSheet from './DetailSheet'
import { PlusIcon, PencilIcon } from './Icons'
import { eur, accountMonthly } from '../lib/expenses'

// One account's page: header + monthly total + its expenses (row -> sheet).
// Editing / deleting the account is in a sheet opened from the header.
export default function AccountView({ account, expenses, onAddExpense, onEditExpense, onDeleteExpense, onEditAccount, onDeleteAccount }) {
  const [acctSheet, setAcctSheet] = useState(false)
  const items = expenses.filter((e) => e.account_id === account.id)
  const monthly = accountMonthly(account.id, expenses)

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={account.name} size={44} />
          <div className="min-w-0">
            <h1 className="text-[24px] font-medium text-ink tracking-tight leading-tight truncate">{account.name}</h1>
            <div className="text-[13px] text-ink-dim">{items.length} spese attive</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setAcctSheet(true)} aria-label="Modifica conto" className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-line text-ink-dim hover:text-ink hover:border-line-strong transition-colors">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button onClick={() => onAddExpense(account.id)} className="inline-flex items-center justify-center gap-2 bg-accent text-bg font-medium rounded-lg h-9 px-3.5 text-[13px] hover:bg-brand-700 transition-colors max-[640px]:w-9 max-[640px]:px-0 max-[640px]:rounded-full">
            <PlusIcon className="w-4 h-4" />
            <span className="max-[640px]:hidden">Aggiungi spesa</span>
          </button>
        </div>
      </div>

      <div className="card p-[18px] mb-1">
        <div className="text-[12px] text-ink-dim">Spesa mensile</div>
        <div className="text-[32px] tracking-tight mt-[2px] text-ink font-number">{eur(monthly)}</div>
      </div>

      <ExpenseLedger
        expenses={items}
        accounts={[account]}
        grouped={false}
        onEditExpense={onEditExpense}
        onDeleteExpense={onDeleteExpense}
        emptyLabel="Nessuna spesa su questo conto"
      />

      <DetailSheet
        open={acctSheet}
        onClose={() => setAcctSheet(false)}
        title={account.name}
        subtitle={`${items.length} spese`}
        avatar={<Avatar name={account.name} size={40} />}
        amount={`${eur(monthly)}/mese`}
        rows={[
          { label: 'Spese', value: items.length },
          { label: 'Totale mensile', value: eur(monthly) },
        ]}
        onEdit={() => { setAcctSheet(false); onEditAccount(account) }}
        onDelete={() => { setAcctSheet(false); onDeleteAccount(account.id) }}
        deleteLabel="Elimina conto"
      />
    </div>
  )
}
