import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

function ToastItem({ toast, onRemove }) {
  const [fx, setFx] = useState('pre')

  useEffect(() => {
    const raf = requestAnimationFrame(() => setFx('on'))
    let gone
    const t = setTimeout(() => {
      setFx('out')
      gone = setTimeout(onRemove, 170)
    }, 2500)
    return () => { cancelAnimationFrame(raf); clearTimeout(t); clearTimeout(gone) }
  }, [onRemove])

  const colors = {
    success: 'bg-emerald-500 dark:bg-pos dark:text-bg',
    error: 'bg-red-500 dark:bg-neg dark:text-bg',
    info: 'bg-brand-500 dark:bg-accent-strong',
  }

  const icons = {
    success: (
      <svg className="ico w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    ),
    error: (
      <svg className="ico w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="ico w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
  }

  return (
    <div
      data-fx={fx}
      className={`fx flex items-center gap-3 px-4 py-3 rounded-xl text-white text-[14px] font-semibold toast-premium ${
        colors[toast.type] || colors.info
      }`}
    >
      <span className="flex-shrink-0">{icons[toast.type] || icons.info}</span>
      <span>{toast.message}</span>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
