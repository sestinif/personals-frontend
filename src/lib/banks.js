// Bank brand detection for account cards.
//
// IMPORTANT (legal/quality): we do NOT reproduce official bank logos or wordmark
// artwork. A "brand" here is only a tasteful BADGE = the bank's known BRAND COLOR
// plus the bank NAME (or a short label) rendered in the app's own sans font.
// Color + name only — no copying of logo shapes or proprietary fonts.
//
// Each entry returns { label, bg, fg, ring?, domain? }:
//   label  — plain-text short name shown in the badge
//   bg     — badge background (brand-ish, tuned for the dark theme)
//   fg     — badge text color (must stay readable on bg)
//   ring   — optional 1px border color for extra definition
//   domain — bank's primary domain, used to fetch the real logo (with badge fallback)

// Order matters: more specific aliases are matched first (e.g. "intesa sanpaolo"
// before a hypothetical shorter token, "trade republic" before generic words).
const BANKS = [
  { keys: ['wise'], label: 'Wise', bg: '#9FE870', fg: '#163300', domain: 'wise.com' },
  { keys: ['n26'], label: 'N26', bg: '#1A2A26', fg: '#48C7B0', ring: '#48C7B0', domain: 'n26.com' },
  { keys: ['revolut business', 'revolut'], label: 'Revolut', bg: '#0B1622', fg: '#7DA8FF', ring: '#2B6CF6', domain: 'revolut.com' },
  { keys: ['american express', 'amex'], label: 'Amex', bg: '#0A2A4A', fg: '#5AA9F0', domain: 'americanexpress.com' },
  { keys: ['intesa sanpaolo', 'intesa', 'isp'], label: 'Intesa', bg: '#0E2A1E', fg: '#3FBE82', domain: 'intesasanpaolo.com' },
  { keys: ['fineco'], label: 'Fineco', bg: '#2A1416', fg: '#FF6B6B', domain: 'finecobank.com' },
  { keys: ['paypal'], label: 'PayPal', bg: '#0A1A33', fg: '#5AA9F0', domain: 'paypal.com' },
  { keys: ['hype'], label: 'Hype', bg: '#1E1430', fg: '#B98BFF', domain: 'hype.it' },
  { keys: ['bancoposta', 'poste'], label: 'Poste', bg: '#2A2410', fg: '#F2C94C', domain: 'poste.it' },
  { keys: ['unicredit'], label: 'UniCredit', bg: '#2A1416', fg: '#FF6B6B', domain: 'unicredit.it' },
  { keys: ['trade republic', 'traderepublic'], label: 'Trade Republic', bg: '#15151A', fg: '#F4F3F1', ring: '#2E2E36', domain: 'traderepublic.com' },
]

/**
 * Detect a bank brand from an account name (case-insensitive substring match).
 * @param {string} name - the account name typed by the user
 * @returns {{ label: string, bg: string, fg: string, ring?: string, domain?: string } | null}
 */
export function bankBrand(name) {
  if (!name || typeof name !== 'string') return null
  const n = name.toLowerCase()
  for (const bank of BANKS) {
    if (bank.keys.some((k) => n.includes(k))) {
      const { label, bg, fg, ring, domain } = bank
      const out = { label, bg, fg }
      if (ring) out.ring = ring
      if (domain) out.domain = domain
      return out
    }
  }
  return null
}
