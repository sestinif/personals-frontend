import Avatar from './Avatar'
import { PlusIcon, ChartIcon } from './Icons'

function LogoutIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
  )
}

const itemClass = (active) =>
  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
    active ? 'bg-surface2 text-ink' : 'text-ink-dim hover:bg-white/[0.03] hover:text-ink'
  }`

export default function Sidebar({ accounts, activeView, countFor, onSelect, onAddExpense, onAddAccount, onLogout }) {
  return (
    <div className="w-[260px] h-full flex flex-col bg-bg border-r border-line">
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-accent flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><rect x="4" y="7.5" width="16" height="11" rx="3" stroke="#14141B" strokeWidth="2" /><path d="M4 11 H16.5 a2 2 0 0 1 2 2" stroke="#14141B" strokeWidth="2" strokeLinecap="round" /><circle cx="16.5" cy="13" r="1.25" fill="#14141B" /></svg>
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-medium text-ink leading-tight">Personals</div>
          <div className="text-[12px] text-ink-dim">Spese ricorrenti</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="px-3 pb-2 text-[12px] text-ink-dim">Menu</div>
        <button onClick={() => onSelect('dashboard')} className={itemClass(activeView === 'dashboard')}>
          <ChartIcon className="w-[18px] h-[18px]" />
          <span className="truncate">Dashboard</span>
        </button>

        <div className="mt-3 mb-1 px-3 text-[12px] text-ink-dim">Conti</div>
        {accounts.map((a) => {
          const active = activeView === `account-${a.id}`
          return (
            <button key={a.id} onClick={() => onSelect(`account-${a.id}`)} className={itemClass(active)}>
              <Avatar name={a.name} size={26} />
              <span className="truncate flex-1 text-left">{a.name}</span>
              <span className={`text-[12px] font-number px-2 py-0.5 rounded-full ${active ? 'bg-bg text-ink-dim' : 'bg-surface2 text-ink-dim'}`}>
                {countFor(a.id)}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-4 pt-2 space-y-1.5 border-t border-line">
        <button onClick={onAddExpense} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-bg bg-accent hover:bg-brand-700 transition-colors">
          <PlusIcon className="w-[18px] h-[18px]" />Nuova spesa
        </button>
        <button onClick={onAddAccount} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-ink-dim hover:bg-white/[0.03] hover:text-ink transition-colors">
          <PlusIcon className="w-[18px] h-[18px]" />Nuovo conto
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-ink-dim hover:bg-white/[0.03] hover:text-ink transition-colors">
          <LogoutIcon className="w-[18px] h-[18px]" />Esci
        </button>
      </div>
    </div>
  )
}
