// Spread on every app input (NOT on the login screen, which must keep password-manager support).
// Stops the iOS AutoFill bar (passwords, cards, addresses) and 1Password/LastPass/Bitwarden prompts.
// Usage: <input {...noAutofill('personals-expense-name')} ... />
export const noAutofill = (name) => ({
  name,
  autoComplete: 'off',
  'data-lpignore': 'true',
  'data-1p-ignore': 'true',
  'data-form-type': 'other',
  'data-bwignore': 'true',
})
