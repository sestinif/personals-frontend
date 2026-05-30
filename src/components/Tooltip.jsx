import { useState } from 'react'

export default function Tooltip({ content, children }) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: rect.left + rect.width / 2, y: rect.top })
    setShow(true)
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouse}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="fixed z-[200] pointer-events-none"
          style={{ left: pos.x, top: pos.y - 8 }}
        >
          <div className="relative -translate-x-1/2 -translate-y-full animate-fade-in">
            <div className="px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[12px] font-semibold shadow-lg whitespace-nowrap">
              {content}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-gray-900 dark:bg-white" />
          </div>
        </div>
      )}
    </div>
  )
}
