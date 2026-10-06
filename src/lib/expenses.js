// Shared money + expense helpers. Logic frozen: same rules as before.
// useGrouping:true — some engines drop the thousands separator on 4-digit numbers.

export const eur = (n) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', useGrouping: true }).format(n || 0)
export const eur0 = (n) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: true }).format(n || 0)

export const isYearly = (e) => e.frequency === 'yearly' || (e.renewal_day && String(e.renewal_day).toLowerCase().includes('annuale'))
export const monthlyOf = (e) => (isYearly(e) ? e.amount / 12 : e.amount)

export function remaining(endDate) {
  if (!endDate) return null
  const diff = new Date(endDate) - new Date()
  if (diff <= 0) return 'Scaduto'
  const days = Math.ceil(diff / 86400000)
  if (days < 30) return `${days}g rimasti`
  const months = Math.round(days / 30.44)
  if (months < 12) return `${months} mesi rimasti`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem === 0 ? `${years}a rimasti` : `${years}a ${rem}m rimasti`
}

export function expenseSub(e) {
  const parts = []
  if (e.expense_type === 'financing') {
    parts.push('Finanziamento')
    const r = remaining(e.end_date)
    if (r) parts.push(r)
  } else if (isYearly(e)) {
    parts.push('Annuale')
    parts.push(`${eur(e.amount)}/anno`)
  } else {
    parts.push('Abbonamento')
    if (e.renewal_day) parts.push(`giorno ${e.renewal_day}`)
  }
  return parts.join(' · ')
}

export const accountMonthly = (accountId, expenses) =>
  expenses.filter((e) => e.account_id === accountId).reduce((s, e) => s + monthlyOf(e), 0)
