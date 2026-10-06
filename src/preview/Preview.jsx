import { useState } from 'react'
import Dashboard from '../components/Dashboard'
import Avatar from '../components/Avatar'
import PageHead from '../components/PageHead'
import StatRow from '../components/StatRow'
import LedgerRow from '../components/LedgerRow'
import DetailSheet from '../components/DetailSheet'
import { dashboard, accounts, expenses } from './fixtures'

const noop = () => {}

function Components() {
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
      <DetailSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Netflix"
        subtitle="Revolut"
        avatar={<Avatar name="Revolut" size={40} />}
        amount="17,99 €/mese"
        rows={[
          { label: 'Tipo', value: 'Abbonamento' },
          { label: 'Frequenza', value: 'Mensile' },
          { label: 'Rinnovo', value: 'Giorno 15' },
          { label: 'Conto', value: 'Revolut' },
        ]}
        onEdit={noop}
        onDelete={() => setOpen(false)}
        deleteLabel="Elimina spesa"
      />
    </div>
  )
}

export default function Preview() {
  const p = new URLSearchParams(location.search).get('p') || 'dashboard'

  let content
  if (p === 'components') content = <Components />
  else if (p === 'sheet') content = <Sheet />
  else if (p === 'dashboard-empty') content = <Dashboard data={{ accounts: [], grandTotal: 0, totalExpenses: 0 }} accounts={[]} expenses={[]} onEditExpense={noop} onDeleteExpense={noop} />
  else content = <Dashboard data={dashboard} accounts={accounts} expenses={expenses} onEditExpense={noop} onDeleteExpense={noop} />

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto max-w-5xl px-8 py-8">{content}</div>
    </div>
  )
}
