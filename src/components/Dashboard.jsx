import { useState, useEffect } from 'react'
import { ChartIcon, CalendarIcon } from './Icons'
import AnimatedNumber from './AnimatedNumber'
import DonutChart from './DonutChart'
import Tooltip from './Tooltip'
import { SkeletonDashboard } from './Skeleton'

function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}

// "Dark raffinato" chart palette
const CHART_PALETTE = ['#8B7BFF', '#34D399', '#FBBF24', '#FB7185', '#60A5FA', '#C88AE6', '#5EEAD4', '#F59E0B']
const chartColor = (i) => CHART_PALETTE[i % CHART_PALETTE.length]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Buonanotte'
  if (h < 12) return 'Buongiorno'
  if (h < 18) return 'Buon pomeriggio'
  return 'Buonasera'
}

function SplitAmount({ value, size = 'lg' }) {
  const sizes = {
    md: { main: 'text-[24px]', dec: 'text-[14px]', sym: 'text-[12px]' },
    lg: { main: 'text-[34px]', dec: 'text-[18px]', sym: 'text-[14px]' },
  }
  const s = sizes[size] || sizes.lg

  return (
    <AnimatedNumber
      value={value}
      duration={1200}
      renderFn={(val) => {
        const parts = val.toFixed(2).split('.')
        const intPart = parseInt(parts[0]).toLocaleString('it-IT')
        const decPart = parts[1]
        return (
          <span className="font-number inline-flex items-baseline leading-none">
            <span className={`${s.main} font-medium tracking-tight`}>{intPart}</span>
            <span className={`${s.dec} font-medium text-ink-dim`}>,{decPart}</span>
            <span className={`${s.sym} font-medium text-ink-faint ml-1.5`}>EUR</span>
          </span>
        )
      }}
    />
  )
}

function StatCard({ label, value, sublabel, icon: Icon, accent = false, delay = 0, isCurrency = false }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={`stat-card relative overflow-hidden rounded-2xl p-6 bg-surface2 text-ink transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl border icon-badge ${
            accent
              ? 'bg-accent/[0.14] border-accent/25 text-accent'
              : 'bg-white/[0.05] border-white/[0.08] text-ink-dim'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[12px] font-medium text-ink-faint uppercase tracking-[0.15em] mb-2">{label}</p>
        <div className="leading-none text-ink">
          {isCurrency ? (
            <SplitAmount value={typeof value === 'number' ? value : 0} />
          ) : typeof value === 'number' ? (
            <span className="text-[30px] font-medium tracking-tight font-number">
              <AnimatedNumber value={value} duration={1000} />
            </span>
          ) : (
            <span className="text-[30px] font-medium tracking-tight font-number">{value}</span>
          )}
        </div>
        {sublabel && <p className="text-[12px] text-ink-dim mt-3 font-normal">{sublabel}</p>}
      </div>
    </div>
  )
}

function DistributionSection({ accounts, grandTotal }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(t)
  }, [])

  if (!accounts.length || grandTotal === 0) return null

  // map a stable chart-palette color to each account with a positive total
  const positiveAccounts = accounts.filter(a => a.total > 0)
  const colorById = new Map(positiveAccounts.map((a, i) => [a.id, chartColor(i)]))
  const colorFor = (a) => colorById.get(a.id) || chartColor(0)

  const donutSegments = positiveAccounts.map(a => ({
    id: a.id,
    value: a.total,
    color: colorFor(a),
    label: a.name,
  }))

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[12px] font-medium text-ink-faint uppercase tracking-[0.15em]">
          Distribuzione
        </h3>
        <span className="text-[13px] font-number font-medium text-ink-dim">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Donut chart */}
        <div className="flex-shrink-0">
          <DonutChart segments={donutSegments} size={140} strokeWidth={18} />
        </div>

        {/* Legend + bar */}
        <div className="flex-1 space-y-4">
          {/* Progress bar */}
          <div className="flex rounded-full h-2 overflow-hidden bg-black/[0.05] dark:bg-white/[0.06] gap-[2px]">
            {positiveAccounts.map((account, i) => (
              <Tooltip key={account.id} content={`${account.name}: ${formatCurrency(account.total)}`}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out origin-left cursor-default"
                  style={{
                    width: animated ? `${(account.total / grandTotal) * 100}%` : '0%',
                    backgroundColor: colorFor(account),
                    transitionDelay: `${i * 100 + 500}ms`,
                  }}
                />
              </Tooltip>
            ))}
          </div>

          {/* Account breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {accounts.map((account) => {
              const pct = grandTotal > 0 ? ((account.total / grandTotal) * 100).toFixed(1) : 0
              return (
                <div
                  key={account.id}
                  className="group flex items-center gap-2.5 p-2 -m-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-default"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: account.total > 0 ? colorFor(account) : '#7A7880' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-ink-faint truncate font-medium uppercase tracking-wider">{account.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-[13px] font-medium text-ink font-number">{formatCurrency(account.total)}</p>
                      <p className="text-[10px] font-medium text-ink-faint">{pct}%</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ data }) {
  if (!data) return <SkeletonDashboard />

  const { accounts, grandTotal, totalExpenses } = data

  const now = new Date()
  const monthName = now.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <p className="text-[14px] text-accent font-medium mb-1">{getGreeting()}</p>
        <h1 className="text-[34px] font-semibold text-gray-900 dark:text-ink tracking-tight text-depth leading-tight">Dashboard</h1>
        <p className="text-gray-400 dark:text-ink-dim mt-1 capitalize font-normal">{monthName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Spesa mensile"
          value={grandTotal}
          isCurrency={true}
          sublabel={`${accounts.length} conti attivi`}
          icon={ChartIcon}
          accent={true}
          delay={50}
        />
        <StatCard
          label="Abbonamenti attivi"
          value={totalExpenses}
          sublabel="spese ricorrenti"
          icon={CalendarIcon}
          delay={120}
        />
      </div>

      <DistributionSection accounts={accounts} grandTotal={grandTotal} />
    </div>
  )
}
