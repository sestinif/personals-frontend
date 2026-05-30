import { useState, useEffect } from 'react'
import { ChartIcon, CalendarIcon } from './Icons'
import AnimatedNumber from './AnimatedNumber'
import DonutChart from './DonutChart'
import Tooltip from './Tooltip'
import { SkeletonDashboard } from './Skeleton'

function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}

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
            <span className={`${s.main} font-bold tracking-tight`}>{intPart}</span>
            <span className={`${s.dec} font-semibold text-white/40`}>,{decPart}</span>
            <span className={`${s.sym} font-semibold text-white/30 ml-1.5`}>EUR</span>
          </span>
        )
      }}
    />
  )
}

function StatCard({ label, value, sublabel, icon: Icon, gradient, delay = 0, isCurrency = false }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={`stat-card relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-500 ${gradient} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-white/[0.1] rounded-xl border border-white/[0.1] icon-badge">
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[12px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2">{label}</p>
        <div className="leading-none">
          {isCurrency ? (
            <SplitAmount value={typeof value === 'number' ? value : 0} />
          ) : typeof value === 'number' ? (
            <span className="text-[34px] font-bold tracking-tight font-number">
              <AnimatedNumber value={value} duration={1000} />
            </span>
          ) : (
            <span className="text-[34px] font-bold tracking-tight font-number">{value}</span>
          )}
        </div>
        {sublabel && <p className="text-[12px] text-white/40 mt-3 font-medium">{sublabel}</p>}
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

  const donutSegments = accounts.filter(a => a.total > 0).map(a => ({
    id: a.id,
    value: a.total,
    color: a.color,
    label: a.name,
  }))

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
          Distribuzione
        </h3>
        <span className="text-[13px] font-number font-semibold text-gray-400 dark:text-gray-500">
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
          <div className="flex rounded-full h-2 overflow-hidden bg-gray-100/80 dark:bg-white/[0.06] gap-[2px]">
            {accounts.filter(a => a.total > 0).map((account, i) => (
              <Tooltip key={account.id} content={`${account.name}: ${formatCurrency(account.total)}`}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out origin-left cursor-default"
                  style={{
                    width: animated ? `${(account.total / grandTotal) * 100}%` : '0%',
                    backgroundColor: account.color,
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
                  className="group flex items-center gap-2.5 p-2 -m-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors cursor-default"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-2 dark:ring-offset-[#1e1e2e] ring-transparent group-hover:ring-gray-200 dark:group-hover:ring-gray-700 transition-all"
                    style={{ backgroundColor: account.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate font-semibold uppercase tracking-wider">{account.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white font-number">{formatCurrency(account.total)}</p>
                      <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600">{pct}%</p>
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
        <p className="text-[14px] text-brand-500 dark:text-brand-400 font-semibold mb-0.5">{getGreeting()}</p>
        <h1 className="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 dark:text-gray-500 mt-0.5 capitalize font-medium">{monthName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Spesa mensile"
          value={grandTotal}
          isCurrency={true}
          sublabel={`${accounts.length} conti attivi`}
          icon={ChartIcon}
          gradient="bg-gradient-to-br from-brand-500 via-brand-700 to-brand-900"
          delay={50}
        />
        <StatCard
          label="Abbonamenti attivi"
          value={totalExpenses}
          sublabel="spese ricorrenti"
          icon={CalendarIcon}
          gradient="bg-gradient-to-br from-slate-600 via-slate-800 to-slate-950"
          delay={120}
        />
      </div>

      <DistributionSection accounts={accounts} grandTotal={grandTotal} />
    </div>
  )
}
