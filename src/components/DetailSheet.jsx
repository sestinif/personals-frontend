import { useEffect, useRef, useState } from 'react'
import { XIcon, PencilIcon, TrashIcon } from './Icons'

// Detail sheet: bottom sheet on phones (≤640px), right panel on desktop.
// Closes on outside click / Esc. Destructive action uses double-confirm.
export default function DetailSheet({ open, onClose, title, subtitle, avatar, amount, rows = [], onEdit, onDelete, deleteLabel = 'Elimina' }) {
  const [shown, setShown] = useState(false)
  const [render, setRender] = useState(false)
  const [armed, setArmed] = useState(false)
  const armTimer = useRef()

  useEffect(() => {
    if (open) {
      setRender(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    } else {
      setShown(false)
      setArmed(false)
      const t = setTimeout(() => setRender(false), 220)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => () => clearTimeout(armTimer.current), [])

  if (!render) return null

  const handleDelete = () => {
    if (!armed) {
      setArmed(true)
      armTimer.current = setTimeout(() => setArmed(false), 4000)
      return
    }
    clearTimeout(armTimer.current)
    onDelete()
  }

  return (
    <div className="fixed inset-0 z-[400]" aria-modal="true" role="dialog">
      <div
        className={`absolute inset-0 bg-[rgba(8,8,12,0.62)] transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 right-0 bottom-0 max-h-[86vh] overflow-y-auto bg-surface border-t border-line rounded-t-[20px] p-[10px_18px_24px]
          sm:left-auto sm:top-0 sm:bottom-0 sm:right-0 sm:w-[380px] sm:max-h-none sm:h-full sm:rounded-none sm:border-t-0 sm:border-l sm:p-6
          transition-transform duration-200 ${shown ? 'translate-y-0 sm:translate-x-0' : 'translate-y-6 sm:translate-y-0 sm:translate-x-6'}`}
      >
        <div className="w-9 h-1 rounded-full bg-[#3A3A48] mx-auto mb-4 sm:hidden" />
        <div className="flex items-center gap-3 mb-3">
          {avatar}
          <div className="flex-1 min-w-0">
            <div className="text-[15px] text-ink truncate">{title}</div>
            {subtitle && <div className="text-[12px] text-ink-dim truncate">{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Chiudi" className="hidden sm:inline-flex w-8 h-8 items-center justify-center rounded-lg border border-line text-ink-dim hover:text-ink">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {amount && <div className="text-[28px] tracking-tight text-ink mb-3 font-number">{amount}</div>}
        <dl>
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-[11px] border-t border-line text-[13px]">
              <dt className="text-ink-dim">{r.label}</dt>
              <dd className="text-ink text-right min-w-0 break-words">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <button onClick={onEdit} className="flex-1 inline-flex items-center justify-center gap-2 py-[11px] text-[14px] text-ink bg-transparent border border-line rounded-[10px] hover:border-line-strong">
              <PencilIcon className="w-4 h-4" />Modifica
            </button>
          )}
          <button
            onClick={handleDelete}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-[11px] text-[14px] text-neg rounded-[10px] border ${armed ? 'bg-neg/[0.12] border-neg/40' : 'bg-transparent border-line'}`}
          >
            <TrashIcon className="w-4 h-4" />{armed ? 'Conferma' : deleteLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
