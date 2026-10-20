import { useEffect, useState } from 'react'
import { eur } from '../lib/expenses'

// Counts a number up to its target when it first appears or changes.
// Starts from the target when motion is reduced or the tab is hidden (requestAnimationFrame
// is paused there), and a timer guarantees it always lands on the exact value.
export function useCountUp(target, ms = 700) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || document.hidden || !Number.isFinite(target)) { setValue(target); return }

    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    setValue(0)
    raf = requestAnimationFrame(tick)
    const done = setTimeout(() => setValue(target), ms + 150)
    return () => { cancelAnimationFrame(raf); clearTimeout(done) }
  }, [target, ms])

  return value
}

export function CountEur({ value }) {
  return <>{eur(useCountUp(value))}</>
}
