import { useState } from 'react'
import { bankBrand } from '../lib/banks'

// Neutral avatar: initials by default; the bank logo (rendered MONOCHROME)
// fades in on top only once it actually loads, so there is never a broken-image
// flash and the fallback is instant.
export default function Avatar({ name, size = 32 }) {
  const [loaded, setLoaded] = useState(false)
  const brand = bankBrand(name)
  const label = (brand?.label || name || '?').trim()
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="relative rounded-full flex-shrink-0 flex items-center justify-center bg-surface2 text-ink font-medium overflow-hidden"
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.38)) }}
    >
      <span style={{ opacity: loaded ? 0 : 1 }}>{initials}</span>
      {brand?.domain && (
        <img
          src={`https://logo.clearbit.com/${brand.domain}`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          className="absolute inset-0 m-auto transition-opacity duration-200"
          style={{ width: size * 0.62, height: size * 0.62, objectFit: 'contain', filter: 'grayscale(1) brightness(1.8) contrast(1.05)', opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}
