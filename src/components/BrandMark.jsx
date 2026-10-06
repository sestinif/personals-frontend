// The Personals mark — the same drawing as public/favicon.svg: one brand,
// one drawing, used in the sidebar and login (like Wealth's BrandMark).
// It paints its own rounded tile and white edge, so wrappers only handle
// size and spacing — no background, no glow.
export default function BrandMark({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} role="img" aria-label="Personals">
      <rect width="32" height="32" rx="7.5" fill="#1B1B24" />
      <rect x="0.9" y="0.9" width="30.2" height="30.2" rx="6.7" fill="none" stroke="#FFFFFF" strokeOpacity="0.30" strokeWidth="1.6" />
      <rect x="7" y="10.5" width="18" height="12.5" rx="3.4" fill="none" stroke="#FFC24B" strokeWidth="3" />
      <circle cx="20.6" cy="16.8" r="2.1" fill="#FFC24B" />
    </svg>
  )
}
