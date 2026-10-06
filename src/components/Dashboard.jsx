import PageHead from './PageHead'
import StatRow from './StatRow'
import { SkeletonDashboard } from './Skeleton'
import { eur, eur0, accountMonthly } from '../lib/expenses'

const TONES = ['#8D9BFF', '#5F69B8', '#3D4272']
const toneFor = (i) => (i < TONES.length ? TONES[i] : '#6B6B7B')

function greeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Buonanotte'
  if (h < 12) return 'Buongiorno'
  if (h < 18) return 'Buon pomeriggio'
  return 'Buonasera'
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

export default function Dashboard({ data, expenses = [], accounts = [] }) {
  if (!data) return <SkeletonDashboard />

  const { grandTotal } = data
  const monthName = new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
  const subs = expenses.filter((e) => e.expense_type !== 'financing').length
  const fin = expenses.filter((e) => e.expense_type === 'financing').length
  const perAccount = accounts.length ? grandTotal / accounts.length : 0

  const withTotal = accounts.map((a) => ({ ...a, monthly: accountMonthly(a.id, expenses) }))
  const positives = withTotal.filter((a) => a.monthly > 0)

  return (
    <div>
      <PageHead greeting={`${greeting()}, Federico`} title="Panoramica" />
      <div className="text-[13px] text-ink-dim -mt-4 mb-5 capitalize">{monthName}</div>

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
    </div>
  )
}
