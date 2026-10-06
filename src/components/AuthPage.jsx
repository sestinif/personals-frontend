import { useState } from 'react'
import Segmented from './Segmented'

const fieldClass = 'w-full h-11 px-3 bg-transparent border border-line-strong rounded-lg text-ink text-[15px] placeholder:text-ink-dim focus:border-accent outline-none transition-colors'

export default function AuthPage({ onAuth, apiUrl }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore')
      onAuth(data.token, data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><rect x="4" y="7.5" width="16" height="11" rx="3" stroke="#14141B" strokeWidth="2" /><path d="M4 11 H16.5 a2 2 0 0 1 2 2" stroke="#14141B" strokeWidth="2" strokeLinecap="round" /><circle cx="16.5" cy="13" r="1.25" fill="#14141B" /></svg>
          </div>
          <h1 className="text-[22px] font-medium text-ink tracking-tight">Personals</h1>
          <p className="text-[13px] text-ink-dim mt-1">{isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}</p>
        </div>

        <div className="card p-6">
          <div className="mb-5">
            <Segmented
              options={[{ value: 'login', label: 'Accedi' }, { value: 'register', label: 'Registrati' }]}
              value={isLogin ? 'login' : 'register'}
              onChange={(v) => { setIsLogin(v === 'login'); setError('') }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] text-ink-dim mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Il tuo username" className={fieldClass} required autoFocus autoComplete="username" />
            </div>
            <div>
              <label className="block text-[12px] text-ink-dim mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isLogin ? 'La tua password' : 'Minimo 6 caratteri'} className={fieldClass} required autoComplete={isLogin ? 'current-password' : 'new-password'} />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-neg/[0.08] border border-neg/20">
                <p className="text-[13px] text-neg">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full h-11 text-[14px] font-medium text-bg bg-accent rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Caricamento…' : isLogin ? 'Accedi' : 'Registrati'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-ink-dim mt-5">
          {isLogin ? 'Non hai un account? ' : 'Hai già un account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-accent hover:text-brand-700">
            {isLogin ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  )
}
