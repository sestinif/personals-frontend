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
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)))
    } else {
      setIsVisible(false)
      document.body.style.overflow = ''
      const t = setTimeout(() => setShouldRender(false), 170)
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
      className={`fixed inset-0 z-50 backdrop-modal scroll-contain flex items-center justify-center p-4 transition-opacity ease-out ${isVisible ? 'opacity-100 duration-300' : 'opacity-0 duration-150'}`}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative bg-surface surface-raised rounded-[14px] w-full max-w-md max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto scroll-contain border border-line shadow-sheet fx"
        data-fx={isVisible ? 'on' : open ? 'pre' : 'out'}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="text-[16px] font-medium text-ink">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="press hit w-8 h-8 -mr-1.5 inline-flex items-center justify-center rounded-lg text-ink-dim hover:text-ink hover:bg-white/[0.06] transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
