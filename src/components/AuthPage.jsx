import { useState } from 'react'
import BrandMark from './BrandMark'

const fieldClass = 'w-full h-11 px-3 bg-transparent border border-line-strong rounded-lg text-ink text-[15px] placeholder:text-ink-dim focus:border-accent outline-none transition-colors'

export default function AuthPage({ onAuth, apiUrl }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
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
          <BrandMark size={48} className="mx-auto mb-4" />
          <h1 className="text-[22px] font-medium text-ink tracking-tight">Personals</h1>
          <p className="text-[13px] text-ink-dim mt-1">Accedi al tuo account</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] text-ink-dim mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Il tuo username" className={fieldClass} required autoFocus autoComplete="username" />
            </div>
            <div>
              <label className="block text-[12px] text-ink-dim mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="La tua password" className={fieldClass} required autoComplete="current-password" />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-neg/[0.08] border border-neg/20">
                <p className="text-[13px] text-neg">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full h-11 text-[14px] font-medium text-bg bg-accent rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Caricamento…' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
