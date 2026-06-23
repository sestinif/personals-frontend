import { useEffect, useRef, useState } from 'react'
import { XIcon } from './Icons'

export default function Modal({ open, onClose, title, children }) {
  const overlayRef = useRef()
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
    } else {
      setIsVisible(false)
      document.body.style.overflow = ''
      const t = setTimeout(() => setShouldRender(false), 250)
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!shouldRender) return null

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 backdrop-modal flex items-center justify-center p-4 transition-opacity duration-250 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className={`relative bg-white dark:bg-surface2 rounded-2xl w-full max-w-md transition-all duration-300 ease-out border border-gray-200/50 dark:border-line-strong overflow-hidden ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[0.97] translate-y-3'
        }`}
        style={{ boxShadow: isVisible ? '0 25px 70px -12px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255,255,255,0.05) inset' : undefined }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100/80 dark:border-line">
          <h3 className="text-[17px] font-semibold text-gray-900 dark:text-ink tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl text-gray-300 dark:text-ink-faint hover:text-gray-600 dark:hover:text-ink hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
