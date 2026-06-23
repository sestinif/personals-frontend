import { useState, useEffect, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import AccountCard from './components/AccountCard'
import Modal from './components/Modal'
import ExpenseForm from './components/ExpenseForm'
import AccountForm from './components/AccountForm'
import AuthPage from './components/AuthPage'
import { SkeletonCard } from './components/Skeleton'
import { PlusIcon, ChartIcon, AccountIcon } from './components/Icons'
import ThemeToggle from './components/ThemeToggle'
import { ToastProvider, useToast } from './components/Toast'

const API_BASE = import.meta.env.VITE_API_URL || ''
const API = API_BASE + '/api'

let authToken = localStorage.getItem('token')

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const res = await fetch(`${API}${path}`, {
    headers,
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  if (res.status === 401) {
    authToken = null
    localStorage.removeItem('token')
    window.location.reload()
    throw new Error('Session expired')
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

function AppContent({ onLogout, user }) {
  const toast = useToast()
  const [dashboard, setDashboard] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [expenses, setExpenses] = useState([])
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  const [expenseModal, setExpenseModal] = useState({ open: false, expense: null, defaultAccountId: null })
  const [accountModal, setAccountModal] = useState({ open: false, account: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, id: null, name: '' })

  const loadData = useCallback(async () => {
    const [dash, accs, exps] = await Promise.all([
      api('/dashboard'),
      api('/accounts'),
      api('/expenses'),
    ])
    setDashboard(dash)
    setAccounts(accs)
    setExpenses(exps)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleSaveExpense = async (data) => {
    const isEdit = !!expenseModal.expense
    if (isEdit) {
      await api(`/expenses/${expenseModal.expense.id}`, { method: 'PUT', body: data })
    } else {
      await api('/expenses', { method: 'POST', body: data })
    }
    setExpenseModal({ open: false, expense: null, defaultAccountId: null })
    toast(isEdit ? 'Spesa aggiornata' : 'Spesa aggiunta', 'success')
    loadData()
  }

  const handleDeleteExpense = async (id) => {
    await api(`/expenses/${id}`, { method: 'DELETE' })
    setDeleteConfirm({ open: false, type: null, id: null, name: '' })
    toast('Spesa eliminata', 'info')
    loadData()
  }

  const handleSaveAccount = async (data) => {
    const isEdit = !!accountModal.account
    if (isEdit) {
      await api(`/accounts/${accountModal.account.id}`, { method: 'PUT', body: data })
    } else {
      await api('/accounts', { method: 'POST', body: data })
    }
    setAccountModal({ open: false, account: null })
    toast(isEdit ? 'Conto aggiornato' : 'Conto aggiunto', 'success')
    loadData()
  }

  const handleDeleteAccount = async (id) => {
    await api(`/accounts/${id}`, { method: 'DELETE' })
    setDeleteConfirm({ open: false, type: null, id: null, name: '' })
    toast('Conto eliminato', 'info')
    loadData()
  }

  const getExpensesForAccount = (accountId) =>
    expenses.filter((e) => e.account_id === accountId)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartIcon },
    ...accounts.map((a) => ({
      id: `account-${a.id}`,
      label: a.name,
      icon: (props) => <AccountIcon icon={a.icon} {...props} />,
      color: a.color,
      accountId: a.id,
    })),
  ]

  return (
    <div className="flex h-screen bg-depth bg-noise transition-colors duration-300">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white/80 dark:bg-bg/90 glass sidebar-depth border-r border-gray-200/50 dark:border-line flex flex-col transition-all duration-400 ease-out`}>
        {/* Logo */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-accent-strong flex items-center justify-center icon-badge">
              <span className="text-white font-semibold text-[18px] leading-none" style={{ fontFamily: 'Inter' }}>P</span>
            </div>
            <div>
              <h1 className="text-[16px] font-semibold text-gray-900 dark:text-ink tracking-tight">Personals</h1>
              <p className="text-[11px] text-gray-300 dark:text-ink-faint font-medium uppercase tracking-widest">Expense tracker</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 divider-glow" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold text-gray-300 dark:text-ink-faint uppercase tracking-[0.15em]">Menu</p>
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                  isActive
                    ? 'bg-brand-50/80 dark:bg-accent/[0.14] text-brand-700 dark:text-accent shadow-sm nav-active'
                    : 'text-gray-500 dark:text-ink-dim hover:bg-gray-50/80 dark:hover:bg-white/[0.03] hover:text-gray-800 dark:hover:text-ink'
                }`}
              >
                {item.color ? (
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all duration-200 ${isActive ? 'shadow-sm' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                      boxShadow: isActive ? `0 2px 8px ${item.color}40` : 'none',
                    }}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? 'bg-brand-100 dark:bg-accent/[0.14]' : 'bg-gray-100/60 dark:bg-white/[0.05]'
                  }`}>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-accent' : 'text-gray-400 dark:text-ink-faint'}`} />
                  </div>
                )}
                <span className="truncate">{item.label}</span>
                {item.accountId && (
                  <span className={`ml-auto text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-brand-100 dark:bg-accent/[0.14] text-brand-600 dark:text-accent' : 'bg-gray-100/60 dark:bg-white/[0.05] text-gray-400 dark:text-ink-faint'
                  }`}>
                    {getExpensesForAccount(item.accountId).length}
                  </span>
                )}
              </button>
            )
          })}

          {/* Actions inside nav */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-line space-y-1">
            <button
              onClick={() => setExpenseModal({ open: true, expense: null, defaultAccountId: accounts[0]?.id })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-brand-600 hover:bg-brand-700 dark:bg-accent-strong dark:hover:bg-brand-700 transition-all duration-200 shadow-sm btn-premium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="uppercase tracking-wide">Nuova spesa</span>
            </button>
            <button
              onClick={() => setAccountModal({ open: true, account: null })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 dark:text-ink-dim hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-600 dark:hover:text-ink transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100/60 dark:bg-white/[0.05] flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-gray-400 dark:text-ink-faint" />
              </div>
              <span className="uppercase tracking-wide">Nuovo conto</span>
            </button>
          </div>
        </nav>

        {/* Bottom: theme + logout */}
        <div className="px-3 pb-4 space-y-1">
          <div className="mx-1 mb-2 divider-glow" />
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] font-semibold text-gray-300 dark:text-ink-faint uppercase tracking-wider">Tema</span>
            <ThemeToggle />
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 dark:text-ink-dim hover:bg-red-50 dark:hover:bg-neg/[0.12] hover:text-red-500 dark:hover:text-neg transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-gray-100/60 dark:bg-white/[0.05] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </div>
            <span className="uppercase tracking-wide">Esci</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 glass border-b border-gray-200/50 dark:border-line">
          <div className="px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 -ml-2.5 rounded-xl text-gray-400 dark:text-ink-dim hover:text-gray-600 dark:hover:text-ink hover:bg-white/80 dark:hover:bg-white/[0.05] transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <button
              onClick={() => setExpenseModal({ open: true, expense: null, defaultAccountId: accounts[0]?.id })}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-white bg-brand-600 hover:bg-brand-700 dark:bg-accent-strong dark:hover:bg-brand-700 rounded-xl transition-all duration-200 shadow-sm btn-premium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <PlusIcon className="w-4 h-4" />
              Nuova spesa
            </button>
          </div>
        </div>

        {/* Content */}
        <div key={activeView} className="px-8 py-8 max-w-5xl animate-fade-up">
          {activeView === 'dashboard' ? (
            <>
              <Dashboard data={dashboard} />
              <div className="mt-10 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-semibold text-gray-900 dark:text-ink tracking-tight text-depth">Tutti i conti</h2>
                  <span className="text-[12px] font-medium text-gray-300 dark:text-ink-faint uppercase tracking-wider">{accounts.length} conti</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger">
                  {loading ? (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  ) : (
                    accounts.map((account) => (
                      <AccountCard
                        key={account.id}
                        account={account}
                        expenses={getExpensesForAccount(account.id)}
                        onAddExpense={(accountId) => setExpenseModal({ open: true, expense: null, defaultAccountId: accountId })}
                        onEditExpense={(expense) => setExpenseModal({ open: true, expense, defaultAccountId: null })}
                        onDeleteExpense={(id) => {
                          const exp = expenses.find((e) => e.id === id)
                          setDeleteConfirm({ open: true, type: 'expense', id, name: exp?.name || '' })
                        }}
                        onEditAccount={(account) => setAccountModal({ open: true, account })}
                        onDeleteAccount={(id) => {
                          const acc = accounts.find((a) => a.id === id)
                          setDeleteConfirm({ open: true, type: 'account', id, name: acc?.name || '' })
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            (() => {
              const accountId = parseInt(activeView.replace('account-', ''))
              const account = accounts.find((a) => a.id === accountId)
              if (!account) return null
              return (
                <div className="animate-fade-up">
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${account.color}, ${account.color}cc)`,
                        boxShadow: `0 8px 24px ${account.color}30`,
                      }}
                    >
                      <AccountIcon icon={account.icon} className="w-7 h-7" />
                    </div>
                    <div>
                      <h1 className="text-[28px] font-semibold text-gray-900 dark:text-ink tracking-tight text-depth">{account.name}</h1>
                      <p className="text-gray-400 dark:text-ink-dim font-normal">
                        {getExpensesForAccount(accountId).length} spese ricorrenti
                      </p>
                    </div>
                  </div>
                  <AccountCard
                    account={account}
                    expenses={getExpensesForAccount(accountId)}
                    onAddExpense={(accountId) => setExpenseModal({ open: true, expense: null, defaultAccountId: accountId })}
                    onEditExpense={(expense) => setExpenseModal({ open: true, expense, defaultAccountId: null })}
                    onDeleteExpense={(id) => {
                      const exp = expenses.find((e) => e.id === id)
                      setDeleteConfirm({ open: true, type: 'expense', id, name: exp?.name || '' })
                    }}
                    onEditAccount={(account) => setAccountModal({ open: true, account })}
                    onDeleteAccount={(id) => setDeleteConfirm({ open: true, type: 'account', id, name: account.name })}
                  />
                </div>
              )
            })()
          )}
        </div>
      </main>

      {/* Modals */}
      <Modal
        open={expenseModal.open}
        onClose={() => setExpenseModal({ open: false, expense: null, defaultAccountId: null })}
        title={expenseModal.expense ? 'Modifica spesa' : 'Nuova spesa'}
      >
        <ExpenseForm
          expense={expenseModal.expense}
          accounts={expenseModal.defaultAccountId
            ? [accounts.find(a => a.id === expenseModal.defaultAccountId), ...accounts.filter(a => a.id !== expenseModal.defaultAccountId)].filter(Boolean)
            : accounts
          }
          onSubmit={handleSaveExpense}
          onCancel={() => setExpenseModal({ open: false, expense: null, defaultAccountId: null })}
        />
      </Modal>

      <Modal
        open={accountModal.open}
        onClose={() => setAccountModal({ open: false, account: null })}
        title={accountModal.account ? 'Modifica conto' : 'Nuovo conto'}
      >
        <AccountForm
          account={accountModal.account}
          onSubmit={handleSaveAccount}
          onCancel={() => setAccountModal({ open: false, account: null })}
        />
      </Modal>

      <Modal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
        title="Conferma eliminazione"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-red-50/50 dark:bg-neg/[0.08] border border-red-100 dark:border-neg/20">
            <p className="text-[14px] text-gray-600 dark:text-ink-dim leading-relaxed">
              Sei sicuro di voler eliminare <strong className="text-gray-900 dark:text-ink">{deleteConfirm.name}</strong>?
              {deleteConfirm.type === 'account' && (
                <span className="block mt-1.5 text-[13px] text-red-500 dark:text-neg font-medium">
                  Tutte le spese associate verranno eliminate permanentemente.
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
              className="flex-1 px-4 py-3 text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-ink-dim bg-gray-50 dark:bg-surface2 border border-gray-200/80 dark:border-line rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] dark:hover:border-line-strong transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Annulla
            </button>
            <button
              onClick={() => {
                if (deleteConfirm.type === 'expense') handleDeleteExpense(deleteConfirm.id)
                else handleDeleteAccount(deleteConfirm.id)
              }}
              className="flex-1 px-4 py-3 text-[14px] font-semibold uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 dark:bg-neg dark:hover:bg-rose-500 rounded-xl transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neg/50"
            >
              Elimina
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const handleAuth = (newToken, userData) => {
    authToken = newToken
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }

  const handleLogout = () => {
    authToken = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  if (!token) {
    return <AuthPage onAuth={handleAuth} apiUrl={API_BASE} />
  }

  return (
    <ToastProvider>
      <AppContent onLogout={handleLogout} user={user} />
    </ToastProvider>
  )
}
