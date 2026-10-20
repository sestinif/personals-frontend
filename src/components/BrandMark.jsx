// The Personals mark (a bold P) — the same drawing as public/favicon.svg: one brand,
// one drawing, used in the sidebar and login (like Wealth's BrandMark).
// It paints its own rounded tile and white edge, so wrappers only handle
// size and spacing — no background, no glow.
export default function BrandMark({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} role="img" aria-label="Personals">
      <defs>
        <linearGradient id="personals-p" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD978" />
          <stop offset="1" stopColor="#FF9A1F" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7.5" fill="#1B1B24" />
      <rect x="0.9" y="0.9" width="30.2" height="30.2" rx="6.7" fill="none" stroke="#FFFFFF" strokeOpacity="0.30" strokeWidth="1.6" />
      <path transform="translate(-1 0)" fill="url(#personals-p)" fillRule="evenodd" d="M9 6H18A7 7 0 0 1 18 20H14.5V26H9Z M14.5 10.4H18A2.6 2.6 0 0 1 18 15.6H14.5Z" />
    </svg>
  )
}
