import PageHead from './PageHead'
import StatRow from './StatRow'
import { SkeletonDashboard } from './Skeleton'
import { eur, eur0, accountMonthly } from '../lib/expenses'
import { useCountUp } from './CountUp'

const TONES = ['#4FD1A1', '#2E9C78', '#1D6350']
const toneFor = (i) => (i < TONES.length ? TONES[i] : '#6B6B7B')

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function HeroAmount({ value }) {
  const [int, dec] = useCountUp(value).toFixed(2).split('.')
  return (
    <span className="font-number hero-amount">
      <span className="hero-dim">€</span>
      {Number(int).toLocaleString('en-US', { useGrouping: true })}
      <span className="hero-dim">.{dec}</span>
    </span>
  )
}

export default function Dashboard({ data, expenses = [], accounts = [] }) {
  if (!data) return <SkeletonDashboard />

  const { grandTotal } = data
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const subs = expenses.filter((e) => e.expense_type !== 'financing').length
  const fin = expenses.filter((e) => e.expense_type === 'financing').length
  const perAccount = accounts.length ? grandTotal / accounts.length : 0

  const withTotal = accounts.map((a) => ({ ...a, monthly: accountMonthly(a.id, expenses) }))
  const positives = withTotal.filter((a) => a.monthly > 0)

  return (
    <div className="stagger">
      <PageHead greeting={`${greeting()}, Federico`} title="Overview" />
      <div className="text-[13px] text-ink-dim -mt-4 mb-5">{monthName}</div>

      <div className="grid grid-cols-1 min-[860px]:grid-cols-[1.5fr_1fr] gap-[14px] items-start">
        <div className="card p-[18px]">
          <div className="text-[12px] text-ink-dim">Monthly Spend</div>
          <div className="text-[38px] max-[640px]:text-[32px] tracking-tight leading-[1.15] mt-[2px] mb-[4px] text-ink">
            <HeroAmount value={grandTotal} />
          </div>
          <div className="text-[13px] text-ink-dim">
            ≈ {eur0(grandTotal * 12)} a year · {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
          </div>
        </div>

        <div className="card p-[18px]">
          <div className="text-[12px] text-ink-dim mb-3">Breakdown</div>
          <div className="flex gap-[2px] mb-3">
            {positives.map((a, i) => (
              <span key={a.id} className="h-[5px] rounded-full bar-seg" style={{ flex: a.monthly, background: toneFor(i), minWidth: 2 }} />
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
        { label: 'Subscriptions', value: subs },
        { label: 'Financing', value: fin },
        { label: 'Average per Account', value: eur(perAccount) },
      ]} />
    </div>
  )
}
