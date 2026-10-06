import { useState, useEffect, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import AccountView from './components/AccountView'
import Modal from './components/Modal'
import ExpenseForm from './components/ExpenseForm'
import AccountForm from './components/AccountForm'
import AuthPage from './components/AuthPage'
import Sidebar from './components/Sidebar'
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

function AppContent({ onLogout }) {
  const toast = useToast()
  const [dashboard, setDashboard] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [expenses, setExpenses] = useState([])
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expenseModal, setExpenseModal] = useState({ open: false, expense: null, defaultAccountId: null })
  const [accountModal, setAccountModal] = useState({ open: false, account: null })

  const loadData = useCallback(async () => {
    const [dash, accs, exps] = await Promise.all([api('/dashboard'), api('/accounts'), api('/expenses')])
    setDashboard(dash)
    setAccounts(accs)
    setExpenses(exps)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const closeExpenseModal = () => setExpenseModal({ open: false, expense: null, defaultAccountId: null })

  const handleSaveExpense = async (data) => {
    const isEdit = !!expenseModal.expense
    if (isEdit) await api(`/expenses/${expenseModal.expense.id}`, { method: 'PUT', body: data })
    else await api('/expenses', { method: 'POST', body: data })
    closeExpenseModal()
    toast(isEdit ? 'Spesa aggiornata' : 'Spesa aggiunta', 'success')
    loadData()
  }

  const handleDeleteExpense = async (id) => {
    await api(`/expenses/${id}`, { method: 'DELETE' })
    toast('Spesa eliminata', 'info')
    loadData()
  }

  const handleSaveAccount = async (data) => {
    const isEdit = !!accountModal.account
    if (isEdit) await api(`/accounts/${accountModal.account.id}`, { method: 'PUT', body: data })
    else await api('/accounts', { method: 'POST', body: data })
    setAccountModal({ open: false, account: null })
    toast(isEdit ? 'Conto aggiornato' : 'Conto aggiunto', 'success')
    loadData()
  }

  const handleDeleteAccount = async (id) => {
    await api(`/accounts/${id}`, { method: 'DELETE' })
    toast('Conto eliminato', 'info')
    setActiveView('dashboard')
    loadData()
  }

  const getExpensesForAccount = (id) => expenses.filter((e) => e.account_id === id)
  const openAddExpense = (accountId) => setExpenseModal({ open: true, expense: null, defaultAccountId: accountId ?? accounts[0]?.id })

  const activeAccount = activeView.startsWith('account-')
    ? accounts.find((a) => a.id === parseInt(activeView.replace('account-', '')))
    : null

  return (
    <div className="flex h-screen bg-bg">
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:static z-30 h-full flex-shrink-0 transition-transform duration-200 md:translate-x-0`}>
        <Sidebar
          accounts={accounts}
          activeView={activeView}
          countFor={(id) => getExpensesForAccount(id).length}
          onSelect={(v) => { setActiveView(v); setSidebarOpen(false) }}
          onAddExpense={() => { openAddExpense(); setSidebarOpen(false) }}
          onAddAccount={() => { setAccountModal({ open: true, account: null }); setSidebarOpen(false) }}
          onLogout={onLogout}
        />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden sticky top-0 z-10 bg-bg border-b border-line px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} aria-label="Apri menu" className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-ink-dim hover:text-ink">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </div>

        <div key={activeView} className="px-5 md:px-8 py-8 max-w-5xl">
          {activeAccount ? (
            <AccountView
              account={activeAccount}
              expenses={expenses}
              onAddExpense={openAddExpense}
              onEditExpense={(expense) => setExpenseModal({ open: true, expense, defaultAccountId: null })}
              onDeleteExpense={handleDeleteExpense}
              onEditAccount={(account) => setAccountModal({ open: true, account })}
              onDeleteAccount={handleDeleteAccount}
            />
          ) : (
            <Dashboard data={dashboard} accounts={accounts} expenses={expenses} />
          )}
        </div>
      </main>

      <Modal open={expenseModal.open} onClose={closeExpenseModal} title={expenseModal.expense ? 'Modifica spesa' : 'Nuova spesa'}>
        <ExpenseForm
          expense={expenseModal.expense}
          accounts={expenseModal.defaultAccountId
            ? [accounts.find((a) => a.id === expenseModal.defaultAccountId), ...accounts.filter((a) => a.id !== expenseModal.defaultAccountId)].filter(Boolean)
            : accounts}
          onSubmit={handleSaveExpense}
          onCancel={closeExpenseModal}
        />
      </Modal>

      <Modal open={accountModal.open} onClose={() => setAccountModal({ open: false, account: null })} title={accountModal.account ? 'Modifica conto' : 'Nuovo conto'}>
        <AccountForm account={accountModal.account} onSubmit={handleSaveAccount} onCancel={() => setAccountModal({ open: false, account: null })} />
      </Modal>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const handleAuth = (newToken, userData) => {
    authToken = newToken
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
  }

  const handleLogout = () => {
    authToken = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
  }

  if (!token) return <AuthPage onAuth={handleAuth} apiUrl={API_BASE} />

  return (
    <ToastProvider>
      <AppContent onLogout={handleLogout} />
    </ToastProvider>
  )
}
