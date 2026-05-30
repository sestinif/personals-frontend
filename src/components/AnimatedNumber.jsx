import { useState, useEffect, useRef } from 'react'

export default function AnimatedNumber({ value, duration = 800, formatFn, renderFn, className = '' }) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)
  const rafRef = useRef()

  useEffect(() => {
    const start = prevValue.current
    const end = typeof value === 'number' ? value : parseFloat(value) || 0
    const startTime = performance.now()

    function animate(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = start + (end - start) * eased

      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevValue.current = end
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  if (renderFn) return renderFn(display)

  const formatted = formatFn ? formatFn(display) : Math.round(display).toString()
  return <span className={className}>{formatted}</span>
}
