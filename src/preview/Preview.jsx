import { useState } from 'react'
import Dashboard from '../components/Dashboard'
import AccountView from '../components/AccountView'
import Sidebar from '../components/Sidebar'
import Avatar from '../components/Avatar'
import PageHead from '../components/PageHead'
import StatRow from '../components/StatRow'
import LedgerRow from '../components/LedgerRow'
import DetailSheet from '../components/DetailSheet'
import Segmented from '../components/Segmented'
import AmountField from '../components/AmountField'
import ExpenseForm from '../components/ExpenseForm'
import AccountForm from '../components/AccountForm'
import AuthPage from '../components/AuthPage'
import { dashboard, accounts, expenses } from './fixtures'

const noop = () => {}

const wdItems = [
  { date: '2026-11-18', transfer_id: '5', name: 'Rent', amount_eur: 800, share: 0.5, counted_eur: 400 },
  { date: '2026-11-12', transfer_id: '4', name: 'Revolut Personale, fine', amount_eur: 1500, share: 1, counted_eur: 1500 },
  { date: '2026-11-03', transfer_id: '3', name: 'Revolut Personale, fine', amount_eur: 600, share: 1, counted_eur: 600 },
]
const wdMonths = [{ month: '2026-11', total_eur: 2500 }, { month: '2026-12', total_eur: 420 }]
const wdBase = { configured: true, start_month: '2026-11', current_month: '2026-12', months: wdMonths, sync: { added: 0, error: null } }
const wdMonth = (m) => m === '2026-11'
  ? { ...wdBase, month: m, total_eur: 2500, items: wdItems, not_counted: { count: 2, total_eur: 5063 } }
  : { ...wdBase, month: m, total_eur: 420, items: [{ date: '2026-12-02', transfer_id: '9', name: 'Revolut Personale, fine', amount_eur: 420, share: 1, counted_eur: 420 }], not_counted: { count: 0, total_eur: 0 } }
const wdLoad = (variant) => async (m) => {
  if (variant === 'down') throw new Error('Numbers did not answer. Try again in a minute.')
  if (variant === 'off') return { configured: false }
  if (variant === 'early') return { configured: true, month: '2026-10', total_eur: 0, items: [], start_month: '2026-11', current_month: '2026-10', not_counted: { count: 0, total_eur: 0 }, sync: {} }
  const d = wdMonth(m || '2026-12')
  return variant === 'warn' ? { ...d, sync: { added: 0, error: 'Wise does not let Numbers read the statement.' } } : d
}

function Kit() {
  const [seg, setSeg] = useState('subscription')
  const [amt, setAmt] = useState('')
  return (
    <div className="space-y-6">
      <PageHead greeting="Good morning, Federico" title="Overview" actionLabel="Add Expense" onAction={noop} />
      <div className="flex items-center gap-4">
        <Avatar name="Revolut" size={40} />
        <Avatar name="Intesa Sanpaolo" size={40} />
        <Avatar name="American Express" size={40} />
        <Avatar name="Personal account" size={40} />
      </div>
      <StatRow stats={[{ label: 'Subscriptions', value: 9 }, { label: 'Financing', value: 2 }, { label: 'Average per Account', value: '€93.23' }]} />
      <Segmented options={[{ value: 'subscription', label: 'Subscription' }, { value: 'financing', label: 'Financing' }]} value={seg} onChange={setSeg} />
      <AmountField value={amt} onChange={setAmt} />
      <div className="card p-[18px]">
        <LedgerRow title="Netflix" sub="Subscription · Day 15" amount="€17.99" onClick={noop} />
        <LedgerRow title="Car insurance" sub="Yearly · €1,080.00/year" amount="€1,080.00" amountSub="€90.00/month" onClick={noop} />
      </div>
    </div>
  )
}

function Sheet() {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button onClick={() => setOpen(true)} className="btn-accent px-4 py-2 text-[14px]">Open Sheet</button>
      <DetailSheet open={open} onClose={() => setOpen(false)} title="Netflix" subtitle="Revolut" avatar={<Avatar name="Revolut" size={40} />} amount="€17.99/month"
        rows={[{ label: 'Type', value: 'Subscription' }, { label: 'Frequency', value: 'Monthly' }, { label: 'Renewal', value: 'Day 15' }, { label: 'Account', value: 'Revolut' }]}
        onEdit={noop} onDelete={() => setOpen(false)} deleteLabel="Delete Expense" />
    </div>
  )
}

function Forms() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card p-5"><div className="text-[15px] font-medium mb-4">New Expense</div><ExpenseForm accounts={accounts} onSubmit={noop} onCancel={noop} /></div>
      <div className="card p-5"><div className="text-[15px] font-medium mb-4">New Account</div><AccountForm onSubmit={noop} onCancel={noop} /></div>
    </div>
  )
}

function Frame() {
  const [view, setView] = useState('dashboard')
  const acct = view.startsWith('account-') ? accounts.find((a) => a.id === Number(view.replace('account-', ''))) : null
  return (
    <div className="flex h-screen bg-bg">
      <Sidebar accounts={accounts} activeView={view} countFor={(id) => expenses.filter((e) => e.account_id === id).length} onSelect={setView} onAddExpense={noop} onAddAccount={noop} onLogout={noop} onClose={noop} />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-5xl">
          {acct
            ? <AccountView account={acct} expenses={expenses} onAddExpense={noop} onEditExpense={noop} onDeleteExpense={noop} onEditAccount={noop} onDeleteAccount={noop} />
            : <Dashboard loadWithdrawals={wdLoad()} />}
        </div>
      </main>
    </div>
  )
}

export default function Preview() {
  const p = new URLSearchParams(location.search).get('p') || 'frame'

  if (p === 'login') return <AuthPage onAuth={noop} apiUrl="" />
  if (p === 'frame') return <Frame />
  if (p.startsWith('overview')) return <div className="min-h-screen bg-bg text-ink"><div className="mx-auto max-w-5xl px-8 py-8"><Dashboard loadWithdrawals={wdLoad(p.split('-')[1])} /></div></div>

  let content
  if (p === 'kit') content = <Kit />
  else if (p === 'sheet') content = <Sheet />
  else if (p === 'forms') content = <Forms />
  else if (p === 'account') content = <AccountView account={accounts.find((a) => a.id === 3)} expenses={expenses} onAddExpense={noop} onEditExpense={noop} onDeleteExpense={noop} onEditAccount={noop} onDeleteAccount={noop} />
  else content = <Dashboard loadWithdrawals={wdLoad()} />

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto max-w-5xl px-8 py-8">{content}</div>
    </div>
  )
}
