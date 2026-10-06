import { useState } from 'react'
import Avatar from './Avatar'
import PageHead from './PageHead'
import StatRow from './StatRow'
import LedgerRow from './LedgerRow'
import DetailSheet from './DetailSheet'
import { SkeletonDashboard } from './Skeleton'

const TONES = ['#8D9BFF', '#5F69B8', '#3D4272']
const toneFor = (i) => (i < TONES.length ? TONES[i] : '#6B6B7B')

const eur = (n) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', useGrouping: true }).format(n)
const eur0 = (n) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: true }).format(n)

const isYearly = (e) => e.frequency === 'yearly'
const monthlyOf = (e) => (isYearly(e) ? e.amount / 12 : e.amount)

function greeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Buonanotte'
  if (h < 12) return 'Buongiorno'
  if (h < 18) return 'Buon pomeriggio'
  return 'Buonasera'
}

function remaining(endDate) {
  if (!endDate) return null
  const diff = new Date(endDate) - new Date()
  if (diff <= 0) return 'Scaduto'
  const days = Math.ceil(diff / 86400000)
  if (days < 30) return `${days}g rimasti`
  const months = Math.round(days / 30.44)
  if (months < 12) return `${months} mesi rimasti`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem === 0 ? `${years}a rimasti` : `${years}a ${rem}m rimasti`
}

function HeroAmount({ value }) {
  const [int, dec] = value.toFixed(2).split('.')
  return (
    <span className="font-number">
      {Number(int).toLocaleString('it-IT', { useGrouping: true })}
      <span className="text-ink-dim">,{dec} €</span>
    </span>
  )
}

function expenseSub(e) {
  const parts = []
  if (e.expense_type === 'financing') {
    parts.push('Finanziamento')
    const r = remaining(e.end_date)
    if (r) parts.push(r)
  } else if (isYearly(e)) {
    parts.push('Annuale')
    parts.push(`${eur(e.amount)}/anno`)
  } else {
    parts.push('Abbonamento')
    if (e.renewal_day) parts.push(`giorno ${e.renewal_day}`)
  }
  return parts.join(' · ')
}

export default function Dashboard({ data, expenses = [], accounts = [], onEditExpense, onDeleteExpense }) {
  const [selected, setSelected] = useState(null)
  if (!data) return <SkeletonDashboard />

  const { grandTotal } = data
  const monthName = new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
  const subs = expenses.filter((e) => e.expense_type !== 'financing').length
  const fin = expenses.filter((e) => e.expense_type === 'financing').length
  const perAccount = accounts.length ? grandTotal / accounts.length : 0

  const withTotal = accounts.map((a) => ({
    ...a,
    monthly: expenses.filter((e) => e.account_id === a.id).reduce((s, e) => s + monthlyOf(e), 0),
  }))
  const positives = withTotal.filter((a) => a.monthly > 0)
  const expensesByAccount = (id) => expenses.filter((e) => e.account_id === id)

  const sel = selected
  const selAccount = sel && accounts.find((a) => a.id === sel.account_id)

  return (
    <div>
      <PageHead greeting={`${greeting()}, Federico`} title="Panoramica" />
      <div className="text-[13px] text-ink-dim -mt-4 mb-5 capitalize">{monthName}</div>

      {/* Hero + distribution */}
      <div className="grid grid-cols-1 min-[860px]:grid-cols-[1.5fr_1fr] gap-[14px] items-start">
        <div className="card p-[18px]">
          <div className="text-[12px] text-ink-dim">Spesa mensile</div>
          <div className="text-[38px] max-[640px]:text-[32px] tracking-tight leading-[1.15] mt-[2px] mb-[4px] text-ink">
            <HeroAmount value={grandTotal} />
          </div>
          <div className="text-[13px] text-ink-dim">
            ≈ {eur0(grandTotal * 12)} all'anno · {expenses.length} spese su {accounts.length} conti
          </div>
        </div>

        <div className="card p-[18px]">
          <div className="text-[12px] text-ink-dim mb-3">Ripartizione</div>
          <div className="flex gap-[2px] mb-3">
            {positives.map((a, i) => (
              <span key={a.id} className="h-1 rounded-[2px]" style={{ flex: a.monthly, background: toneFor(i), minWidth: 2 }} />
            ))}
          </div>
          {withTotal.map((a, i) => {
            const pct = grandTotal > 0 ? Math.round((a.monthly / grandTotal) * 100) : 0
            return (
              <div key={a.id} className="grid grid-cols-[8px_1fr_auto] gap-[10px] items-center py-[9px] border-t border-line first:border-t-0 first:pt-0 text-[13px]">
                <span className="w-2 h-2 rounded-full" style={{ background: a.monthly > 0 ? toneFor(i) : '#6B6B7B' }} />
                <span className="min-w-0 truncate text-ink">{a.name} <span className="text-ink-dim text-[12px]">{pct}%</span></span>
                <span className="text-ink font-number whitespace-nowrap">{eur(a.monthly)}</span>
              </div>
            )
          })}
        </div>
      </div>

      <StatRow stats={[
        { label: 'Abbonamenti', value: subs },
        { label: 'Finanziamenti', value: fin },
        { label: 'Media per conto', value: eur(perAccount) },
      ]} />

      {/* Ledger grouped by account */}
      {withTotal.map((a) => (
        <div key={a.id}>
          <div className="flex items-center justify-between gap-3 pt-[18px] pb-[2px] text-[12px] text-ink-dim">
            <span className="flex items-center gap-2 min-w-0"><Avatar name={a.name} size={24} /><span className="truncate">{a.name}</span></span>
            <span className="font-number whitespace-nowrap">{eur(a.monthly)}/mese</span>
          </div>
          {expensesByAccount(a.id).map((e) => (
            <LedgerRow
              key={e.id}
              title={e.name}
              sub={expenseSub(e)}
              amount={eur(e.amount)}
              amountSub={isYearly(e) ? `${eur(e.amount / 12)}/mese` : null}
              onClick={() => setSelected(e)}
            />
          ))}
          {expensesByAccount(a.id).length === 0 && (
            <div className="py-3 border-t border-line text-[13px] text-ink-dim">Nessuna spesa</div>
          )}
        </div>
      ))}

      <DetailSheet
        open={!!sel}
        onClose={() => setSelected(null)}
        title={sel?.name}
        subtitle={selAccount?.name}
        avatar={selAccount && <Avatar name={selAccount.name} size={40} />}
        amount={sel && `${eur(sel.amount)}${isYearly(sel) ? '/anno' : '/mese'}`}
        rows={sel ? [
          { label: 'Tipo', value: sel.expense_type === 'financing' ? 'Finanziamento' : 'Abbonamento' },
          { label: 'Frequenza', value: isYearly(sel) ? 'Annuale' : 'Mensile' },
          ...(sel.renewal_day ? [{ label: 'Rinnovo', value: `Giorno ${sel.renewal_day}` }] : []),
          ...(sel.expense_type === 'financing' && sel.end_date ? [{ label: 'Scadenza', value: remaining(sel.end_date) }] : []),
          { label: 'Conto', value: selAccount?.name || '—' },
        ] : []}
        onEdit={sel && onEditExpense ? () => { const e = sel; setSelected(null); onEditExpense(e) } : undefined}
        onDelete={() => { const id = sel.id; setSelected(null); onDeleteExpense && onDeleteExpense(id) }}
        deleteLabel="Elimina spesa"
      />
    </div>
  )
}
