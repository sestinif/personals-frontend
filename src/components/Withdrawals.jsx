import { useState, useEffect, useCallback } from 'react'
import PageHead from './PageHead'
import LedgerRow from './LedgerRow'
import { ChevronIcon } from './Icons'
import { eur } from '../lib/expenses'

const START = '2026-11'

const monthLabel = (m) => new Date(`${m}-01T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const dayLabel = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const shiftMonth = (m, by) => {
  const [y, mo] = m.split('-').map(Number)
  const d = new Date(Date.UTC(y, mo - 1 + by, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function itemSub(item) {
  const day = dayLabel(item.date)
  return item.share === 1 ? `${day} · Counted in full` : `${day} · Half of ${eur(item.amount_eur)}`
}

function Notice({ tone, children }) {
  return <div className={`text-[13px] mt-4 ${tone === 'warn' ? 'text-neg' : 'text-ink-dim'}`}>{children}</div>
}

// What left the business Wise account for personal use. Numbers does the counting; this only shows it.
export default function Withdrawals({ load }) {
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
      <div className="stagger">
        <PageHead title="Withdrawals" />
        <div className="card p-[18px]">
          <div className="text-[14px] text-ink">{error}</div>
          <button onClick={() => fetchMonth(month)} className="mt-3 h-9 px-3.5 rounded-lg border border-line text-[13px] text-ink hover:bg-white/[0.03] transition-colors">Try Again</button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="stagger">
        <PageHead title="Withdrawals" />
        <div className="card p-[18px] animate-pulse">
          <div className="h-3 w-32 rounded bg-surface2" />
          <div className="h-9 w-48 rounded bg-surface2 mt-3" />
          <div className="h-3 w-64 rounded bg-surface2 mt-3" />
        </div>
      </div>
    )
  }

  if (data.configured === false) {
    return (
      <div className="stagger">
        <PageHead title="Withdrawals" />
        <div className="card p-[18px] text-[14px] text-ink-dim">Withdrawals are not connected to Numbers yet.</div>
      </div>
    )
  }

  const start = data.start_month || START
  const beforeStart = data.month < start
  const today = data.current_month || data.month
  const items = data.items || []
  const notCounted = data.not_counted || { count: 0, total_eur: 0 }

  return (
    <div className="stagger">
      <PageHead title="Withdrawals" />

      {beforeStart ? (
        <div className="card p-[18px]">
          <div className="text-[14px] text-ink">Tracking starts in {monthLabel(start)}.</div>
          <div className="text-[13px] text-ink-dim mt-1">From then on, every transfer from the business account to your own accounts is added here as it leaves.</div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 mb-4 -mt-1">
            <button onClick={() => go(shiftMonth(data.month, -1))} disabled={data.month <= start} aria-label="Previous month" className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-dim hover:text-ink hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-dim transition-colors">
              <ChevronIcon dir="left" className="w-4 h-4" />
            </button>
            <span className="text-[14px] text-ink min-w-[130px] text-center">{monthLabel(data.month)}</span>
            <button onClick={() => go(shiftMonth(data.month, 1))} disabled={data.month >= today} aria-label="Next month" className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-dim hover:text-ink hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-dim transition-colors">
              <ChevronIcon dir="right" className="w-4 h-4" />
            </button>
          </div>

          <div className="card p-[18px]">
            <div className="text-[12px] text-ink-dim">Withdrawn in {monthLabel(data.month)}</div>
            <div className="text-[38px] max-[640px]:text-[32px] tracking-tight leading-[1.15] mt-[2px] mb-[4px] text-ink font-number">{eur(data.total_eur)}</div>
            <div className="text-[13px] text-ink-dim">
              {items.length ? `${items.length} ${items.length === 1 ? 'transfer' : 'transfers'} · ` : ''}An upper estimate of what you spent: money counts when it leaves, not when you use it.
            </div>
          </div>

          <div className="card p-[18px] mt-[14px]">
            <div className="text-[12px] text-ink-dim mb-1">Transfers</div>
            {items.length === 0 && <div className="text-[13px] text-ink-dim pt-2">No transfers to your own accounts this month yet.</div>}
            {items.map((it) => (
              <LedgerRow key={it.transfer_id} title={it.name || 'Transfer'} sub={itemSub(it)} amount={eur(it.counted_eur)} />
            ))}
          </div>

          {notCounted.count > 0 && (
            <Notice>{eur(notCounted.total_eur)} in {notCounted.count} other {notCounted.count === 1 ? 'transfer' : 'transfers'} not counted.</Notice>
          )}
          {data.sync?.error && (
            <Notice tone="warn">Transfers made from the Wise app cannot be read right now, so only the ones sent from Numbers are counted.</Notice>
          )}
        </>
      )}
    </div>
  )
}
