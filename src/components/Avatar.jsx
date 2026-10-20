import { useState } from 'react'
import { bankBrand } from '../lib/banks'

// Indigo-family tones (same palette as the dashboard distribution) + one grey,
// used only for the initials fallback chip.
const TONES = [[141, 155, 255], [124, 134, 224], [95, 105, 184], [120, 128, 176]]
function toneFor(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return TONES[h % TONES.length]
}

// Avatar: shows the real bank logo (via Google's favicon service, which — unlike
// the retired Clearbit — actually resolves). Falls back to initials on a soft
// indigo chip when there is no domain or the logo fails to load.
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
  const logo = brand?.domain ? `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64` : null

  return (
    <div
      className="relative rounded-full flex-shrink-0 flex items-center justify-center font-medium overflow-hidden"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(12, Math.round(size * 0.36)),
        background: loaded ? '#23232E' : `rgba(${r},${g},${b},0.16)`,
        boxShadow: loaded ? 'inset 0 0 0 1px rgba(255,255,255,0.08)' : `inset 0 0 0 1px rgba(${r},${g},${b},0.4)`,
        color: `rgb(${Math.min(r + 70, 255)},${Math.min(g + 70, 255)},${Math.min(b + 70, 255)})`,
      }}
    >
      <span style={{ opacity: loaded ? 0 : 1 }}>{initials}</span>
      {logo && (
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          className="absolute inset-0 m-auto transition-opacity duration-200"
          style={{ width: Math.round(size * 0.58), height: Math.round(size * 0.58), objectFit: 'contain', opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}
