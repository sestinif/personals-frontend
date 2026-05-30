import { useState } from 'react'

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

  const inputClass = 'w-full px-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-200 outline-none input-depth focus:border-brand-400 dark:focus:border-brand-500/40 focus:bg-white dark:focus:bg-white/[0.05]'

  return (
    <div className="min-h-screen bg-depth bg-noise flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center icon-badge mx-auto mb-4">
            <span className="text-white font-extrabold text-[24px] leading-none">P</span>
          </div>
          <h1 className="text-[24px] font-extrabold text-gray-900 dark:text-white tracking-tight text-depth">Personals</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 font-medium">
            {isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}
          </p>
        </div>

        {/* Card */}
        <div className="card-premium p-8">
          {/* Tabs */}
          <div className="flex gap-1 p-1 toggle-pill rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                isLogin
                  ? 'bg-white dark:bg-white/[0.08] text-gray-900 dark:text-white toggle-pill-active'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Accedi
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                !isLogin
                  ? 'bg-white dark:bg-white/[0.08] text-gray-900 dark:text-white toggle-pill-active'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Registrati
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Il tuo username"
                className={inputClass}
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? 'La tua password' : 'Minimo 6 caratteri'}
                className={inputClass}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50/80 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30">
                <p className="text-[13px] font-medium text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-[14px] font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl hover:from-brand-700 hover:to-brand-600 transition-all duration-200 shadow-md shadow-brand-500/20 btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Caricamento...
                </span>
              ) : isLogin ? 'Accedi' : 'Registrati'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-gray-400 dark:text-gray-600 mt-6 font-medium">
          {isLogin ? 'Non hai un account? ' : 'Hai già un account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-semibold"
          >
            {isLogin ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  )
}
