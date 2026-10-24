import { useState, useEffect, useCallback } from 'react'
import PageHead from './PageHead'
import LedgerRow from './LedgerRow'
import { ChevronIcon } from './Icons'
import { eur } from '../lib/expenses'
import { useCountUp } from './CountUp'

const START = '2026-11'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const monthLabel = (m) => new Date(`${m}-01T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const monthShort = (m) => new Date(`${m}-01T12:00:00`).toLocaleDateString('en-US', { month: 'short' })
const dayLabel = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const shiftMonth = (m, by) => {
  const [y, mo] = m.split('-').map(Number)
  const d = new Date(Date.UTC(y, mo - 1 + by, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
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

function MonthNav({ month, start, today, onGo }) {
  const btn = 'w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-dim hover:text-ink hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-dim transition-colors'
  return (
    <div className="flex items-center gap-1 mb-4">
      <button onClick={() => onGo(shiftMonth(month, -1))} disabled={month <= start} aria-label="Previous month" className={btn}><ChevronIcon dir="left" className="w-4 h-4" /></button>
      <span className="text-[15px] text-ink min-w-[130px] text-center">{monthLabel(month)}</span>
      <button onClick={() => onGo(shiftMonth(month, 1))} disabled={month >= today} aria-label="Next month" className={btn}><ChevronIcon dir="right" className="w-4 h-4" /></button>
    </div>
  )
}

// Month by month: closed months keep their total, the open one keeps growing.
function MonthsCard({ months, selected, start, today, onGo }) {
  const byMonth = new Map((months || []).map((m) => [m.month, m.total_eur]))
  const list = []
  for (let m = today; m >= start && list.length < 12; m = shiftMonth(m, -1)) list.unshift({ month: m, total: byMonth.get(m) || 0 })
  const max = Math.max(1, ...list.map((m) => m.total))
  return (
    <div className="card p-[18px]">
      <div className="text-[13px] text-ink-dim mb-3">Month by Month</div>
      {list.map((m) => (
        <button key={m.month} onClick={() => onGo(m.month)} className={`w-full grid grid-cols-[36px_1fr_auto] gap-[10px] items-center py-[7px] text-[14px] text-left rounded-md transition-colors hover:bg-white/[0.02] ${m.month === selected ? 'text-ink' : 'text-ink-dim'}`}>
          <span>{monthShort(m.month)}</span>
          <span className="h-[5px] rounded-full bg-surface2 overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${(m.total / max) * 100}%`, background: m.month === selected ? '#4FD1A1' : '#2E9C78', minWidth: m.total > 0 ? 3 : 0 }} /></span>
          <span className="font-number whitespace-nowrap">{eur(m.total)}</span>
        </button>
      ))}
    </div>
  )
}

function itemSub(item) {
  const day = dayLabel(item.date)
  return item.share === 1 ? `${day} · Counted in full` : `${day} · Half of ${eur(item.amount_eur)}`
}

function Notice({ tone, children }) {
  return <div className={`text-[14px] mt-4 ${tone === 'warn' ? 'text-neg' : 'text-ink-dim'}`}>{children}</div>
}

// The real monthly spend: what left the business account for personal use, as it happens.
function Spent({ load }) {
  const [month, setMonth] = useState(null) // null → ask for the current month
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const fetchMonth = useCallback(async (m) => {
    setError(null)
    try {
      const res = await load(m)
      setData(res)
      if (res.month) setMonth(res.month)
    } catch (e) {
      setError(e.message)
    }
  }, [load])

  useEffect(() => { fetchMonth(null) }, [fetchMonth])

  const go = (m) => { setData(null); setMonth(m); fetchMonth(m) }

  if (error) {
    return (
      <div className="card p-[18px] mb-[14px]">
        <div className="text-[15px] text-ink">{error}</div>
        <button onClick={() => fetchMonth(month)} className="mt-3 h-9 px-3.5 rounded-lg border border-line text-[14px] text-ink hover:bg-white/[0.03] transition-colors">Try Again</button>
      </div>
    )
  }
  if (!data) return <div className="card p-[18px] mb-[14px] animate-pulse h-[132px]" />
  if (data.configured === false) {
    return <div className="card p-[18px] mb-[14px] text-[15px] text-ink-dim">Withdrawals are not connected to Numbers yet, so the real monthly spend cannot be shown.</div>
  }

  const start = data.start_month || START
  const today = data.current_month || data.month
  const items = data.items || []
  const notCounted = data.not_counted || { count: 0, total_eur: 0 }
  const open = data.month === today

  if (data.month < start) {
    return (
      <div className="card p-[18px] mb-[14px]">
        <div className="text-[15px] text-ink">Tracking starts in {monthLabel(start)}.</div>
        <div className="text-[14px] text-ink-dim mt-1">From then on, every transfer from the business account to your own accounts is added here as it leaves, and the month closes on its last day.</div>
      </div>
    )
  }

  return (
    <div className="mb-[14px]">
      <MonthNav month={data.month} start={start} today={today} onGo={go} />
      <div className="grid grid-cols-1 min-[860px]:grid-cols-[1.5fr_1fr] gap-[14px] items-start">
        <div className="space-y-[14px]">
          <div className="card p-[18px]">
            <div className="text-[13px] text-ink-dim">{open ? 'Spent So Far in' : 'Spent in'} {monthLabel(data.month)}</div>
            <div className="text-[39px] max-[640px]:text-[33px] tracking-tight leading-[1.15] mt-[2px] mb-[4px] text-ink">
              <HeroAmount value={data.total_eur} />
            </div>
            <div className="text-[14px] text-ink-dim">
              {items.length ? `${items.length} ${items.length === 1 ? 'transfer' : 'transfers'}` : 'No transfers yet'}{open ? ' so far' : ''}
            </div>
            <div className="text-[13px] text-ink-dim mt-2">An upper estimate: money counts when it leaves the account, not when you use it.</div>
          </div>

          <div className="card p-[18px]">
            <div className="text-[13px] text-ink-dim mb-1">Transfers</div>
            {items.length === 0 && <div className="text-[14px] text-ink-dim pt-2">No transfers to your own accounts this month yet.</div>}
            {items.map((it) => (
              <LedgerRow key={it.transfer_id} title={it.name || 'Transfer'} sub={itemSub(it)} amount={eur(it.counted_eur)} />
            ))}
          </div>
        </div>
        <MonthsCard months={data.months} selected={data.month} start={start} today={today} onGo={go} />
      </div>

      {notCounted.count > 0 && (
        <Notice>{eur(notCounted.total_eur)} in {notCounted.count} other {notCounted.count === 1 ? 'transfer' : 'transfers'} not counted.</Notice>
      )}
      {data.sync?.error && (
        <Notice tone="warn">Transfers made from the Wise app cannot be read right now, so only the ones sent from Numbers are counted.</Notice>
      )}
    </div>
  )
}

// The Overview is only the real monthly spend. What you have running (the subscriptions and
// installments) lives in the account pages.
export default function Dashboard({ loadWithdrawals }) {
  return (
    <div className="stagger">
      <PageHead greeting={`${greeting()}, Federico`} title="Overview" />
      <Spent load={loadWithdrawals} />
    </div>
  )
}
