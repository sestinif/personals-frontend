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

function Kit() {
  const [seg, setSeg] = useState('subscription')
  const [amt, setAmt] = useState('')
  return (
    <div className="space-y-6">
      <PageHead greeting="Buongiorno, Federico" title="Panoramica" actionLabel="Aggiungi spesa" onAction={noop} />
      <div className="flex items-center gap-4">
        <Avatar name="Revolut" size={40} />
        <Avatar name="Intesa Sanpaolo" size={40} />
        <Avatar name="American Express" size={40} />
        <Avatar name="Conto personale" size={40} />
      </div>
      <StatRow stats={[{ label: 'Abbonamenti', value: 9 }, { label: 'Finanziamenti', value: 2 }, { label: 'Media per conto', value: '93,23 €' }]} />
      <Segmented options={[{ value: 'subscription', label: 'Abbonamento' }, { value: 'financing', label: 'Finanziamento' }]} value={seg} onChange={setSeg} />
      <AmountField value={amt} onChange={setAmt} />
      <div className="card p-[18px]">
        <LedgerRow title="Netflix" sub="Abbonamento · giorno 15" amount="17,99 €" onClick={noop} />
        <LedgerRow title="Assicurazione auto" sub="Annuale · 1.080,00 €/anno" amount="1.080,00 €" amountSub="90,00 €/mese" onClick={noop} />
      </div>
    </div>
  )
}

function Sheet() {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button onClick={() => setOpen(true)} className="btn-accent px-4 py-2 text-[14px]">Apri scheda</button>
      <DetailSheet open={open} onClose={() => setOpen(false)} title="Netflix" subtitle="Revolut" avatar={<Avatar name="Revolut" size={40} />} amount="17,99 €/mese"
        rows={[{ label: 'Tipo', value: 'Abbonamento' }, { label: 'Frequenza', value: 'Mensile' }, { label: 'Rinnovo', value: 'Giorno 15' }, { label: 'Conto', value: 'Revolut' }]}
        onEdit={noop} onDelete={() => setOpen(false)} deleteLabel="Elimina spesa" />
    </div>
  )
}

function Forms() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card p-5"><div className="text-[15px] font-medium mb-4">Nuova spesa</div><ExpenseForm accounts={accounts} onSubmit={noop} onCancel={noop} /></div>
      <div className="card p-5"><div className="text-[15px] font-medium mb-4">Nuovo conto</div><AccountForm onSubmit={noop} onCancel={noop} /></div>
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
            : <Dashboard data={dashboard} accounts={accounts} expenses={expenses} />}
        </div>
      </main>
    </div>
  )
}

export default function Preview() {
  const p = new URLSearchParams(location.search).get('p') || 'frame'

  if (p === 'login') return <AuthPage onAuth={noop} apiUrl="" />
  if (p === 'frame') return <Frame />

  let content
  if (p === 'kit') content = <Kit />
  else if (p === 'sheet') content = <Sheet />
  else if (p === 'forms') content = <Forms />
  else if (p === 'account') content = <AccountView account={accounts.find((a) => a.id === 3)} expenses={expenses} onAddExpense={noop} onEditExpense={noop} onDeleteExpense={noop} onEditAccount={noop} onDeleteAccount={noop} />
  else if (p === 'dashboard-empty') content = <Dashboard data={{ accounts: [], grandTotal: 0, totalExpenses: 0 }} accounts={[]} expenses={[]} />
  else content = <Dashboard data={dashboard} accounts={accounts} expenses={expenses} />

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto max-w-5xl px-8 py-8">{content}</div>
    </div>
  )
}
