import { useState } from 'react'
import { bankBrand } from '../lib/banks'

// Neutral avatar: bank logo rendered MONOCHROME inside a dark circle,
// or the account's initials when there is no logo / it fails to load.
export default function Avatar({ name, size = 32 }) {
  const [failed, setFailed] = useState(false)
  const brand = bankBrand(name)
  const label = (brand?.label || name || '?').trim()
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const showLogo = brand?.domain && !failed

  return (
    <div
      className="rounded-full flex-shrink-0 flex items-center justify-center bg-surface2 text-ink font-medium overflow-hidden"
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.38)) }}
    >
      {showLogo ? (
        <img
          src={`https://logo.clearbit.com/${brand.domain}`}
          alt={label}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: size * 0.62, height: size * 0.62, objectFit: 'contain', filter: 'grayscale(1) brightness(1.8) contrast(1.05)' }}
        />
      ) : (
        initials
      )}
    </div>
  )
}
