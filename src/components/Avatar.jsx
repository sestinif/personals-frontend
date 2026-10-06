import { useState } from 'react'
import { bankBrand } from '../lib/banks'

// Indigo-family tones (same palette as the dashboard distribution) + one grey.
// A stable tone per account name gives the avatars a little life without any
// brand colour.
const TONES = [[141, 155, 255], [124, 134, 224], [95, 105, 184], [120, 128, 176]]
function toneFor(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return TONES[h % TONES.length]
}

// Neutral avatar: initials on a soft indigo-tinted chip with a thin ring.
// The bank logo (monochrome) fades in on top only if it actually loads.
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

  const [r, g, b] = toneFor(label.toLowerCase())

  return (
    <div
      className="relative rounded-full flex-shrink-0 flex items-center justify-center font-medium overflow-hidden"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(12, Math.round(size * 0.36)),
        background: `rgba(${r},${g},${b},0.16)`,
        boxShadow: `inset 0 0 0 1px rgba(${r},${g},${b},0.4)`,
        color: `rgb(${Math.min(r + 70, 255)},${Math.min(g + 70, 255)},${Math.min(b + 70, 255)})`,
      }}
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
          style={{ width: size * 0.6, height: size * 0.6, objectFit: 'contain', filter: 'grayscale(1) brightness(1.8) contrast(1.05)', opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}
