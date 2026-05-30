import { useState, useEffect } from 'react'

function SunIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  )
}

function MoonIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light'
    }
    return true
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative w-14 h-7 rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #312e81, #1e1b4b)'
          : 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
      }}
      title={dark ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-out shadow-md ${
          dark
            ? 'translate-x-7 bg-brand-500'
            : 'translate-x-0 bg-white'
        }`}
      >
        {dark ? (
          <MoonIcon className="w-3.5 h-3.5 text-white" />
        ) : (
          <SunIcon className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
    </button>
  )
}
