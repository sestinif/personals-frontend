// Fake data for the local preview (no login). Not imported by the app build.

export const accounts = [
  { id: 1, name: 'Revolut', color: '#8B7BFF', icon: 'credit-card', total: 53.97 },
  { id: 2, name: 'Intesa Sanpaolo', color: '#0E2A1E', icon: 'building', total: 139.99 },
  { id: 3, name: 'American Express', color: '#0A2A4A', icon: 'credit-card', total: 156.99 },
  { id: 4, name: 'Hype', color: '#1E1430', icon: 'wallet', total: 21.98 },
]

export const expenses = [
  { id: 101, account_id: 1, name: 'Netflix', amount: 17.99, frequency: 'monthly', expense_type: 'subscription', renewal_day: '15', end_date: '' },
  { id: 102, account_id: 1, name: 'Spotify', amount: 10.99, frequency: 'monthly', expense_type: 'subscription', renewal_day: '3', end_date: '' },
  { id: 103, account_id: 1, name: 'iCloud+', amount: 2.99, frequency: 'monthly', expense_type: 'subscription', renewal_day: '1', end_date: '' },
  { id: 104, account_id: 1, name: 'ChatGPT Plus', amount: 22.00, frequency: 'monthly', expense_type: 'subscription', renewal_day: '8', end_date: '' },
  { id: 201, account_id: 2, name: 'Assicurazione auto', amount: 1080.00, frequency: 'yearly', expense_type: 'subscription', renewal_day: '', end_date: '' },
  { id: 202, account_id: 2, name: 'Palestra', amount: 49.99, frequency: 'monthly', expense_type: 'subscription', renewal_day: '5', end_date: '' },
  { id: 301, account_id: 3, name: 'MacBook Pro', amount: 126.00, frequency: 'monthly', expense_type: 'financing', renewal_day: '20', end_date: '2027-12-01' },
  { id: 302, account_id: 3, name: 'Adobe Creative Cloud', amount: 30.99, frequency: 'monthly', expense_type: 'subscription', renewal_day: '12', end_date: '' },
  { id: 401, account_id: 4, name: 'Offerta telefono', amount: 12.99, frequency: 'monthly', expense_type: 'subscription', renewal_day: '28', end_date: '' },
  { id: 402, account_id: 4, name: 'Disney+', amount: 8.99, frequency: 'monthly', expense_type: 'subscription', renewal_day: '28', end_date: '' },
]

export const dashboard = {
  accounts,
  grandTotal: accounts.reduce((s, a) => s + a.total, 0),
  totalExpenses: expenses.length,
}
