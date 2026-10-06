# Personals Mercury — Fase 2 (Spese, Conti, moduli, Login, nav)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Verifica = `npm run build` + anteprima a 390/desktop (nessun test runner nel progetto).

**Goal:** Completare il redesign: sidebar a 3 voci, pagine Spese e Conti, moduli con importo grande, Modal e Login Mercury, pulizia del codice morto.

**Architecture:** Si estrae il registro+scheda in un componente riusabile (`ExpenseLedger`) usato da Panoramica e Spese. Nuovi componenti `Tabs`, `Segmented`, `AmountField`. `App.jsx` passa a 3 viste (dashboard/expenses/accounts). I moduli restano dentro il `Modal` (rifatto). Logica e backend invariati.

**Tech Stack:** React 18, Vite 6, Tailwind 3.

## Global Constraints
Come Fase 1: fondo `#14141B`, indaco `#8D9BFF`, Inter 400/500 tabulari, niente <12px, niente uppercase/tracking, verde entrate / rosa distruttivo, card 12px controlli 8px, solo scuro, logica congelata, `useGrouping:true` su ogni formato EUR. Ramo `mercury-phase-2`. Push via subtree, lo lancia Federico.

---

### Task 1: Componenti Tabs, Segmented, AmountField
- `Tabs.jsx`: `{tabs:[{id,label}], active, onChange, right?}` — linguette con sottolineatura indaco sulla voce attiva, slot `right` per la tendina conto.
- `Segmented.jsx`: `{options:[{value,label}], value, onChange}` — interruttore a segmenti (fondo `surface2` sulla voce attiva).
- `AmountField.jsx`: `{value, onChange, currency='€'}` — importo grande 34px con simbolo grigio, bordo-sotto che diventa indaco in focus; `width:0;flex:1` per non allargare la pagina.
- Verifica: `preview.html?p=kit`.

### Task 2: ExpenseLedger (registro + scheda riusabile)
- `ExpenseLedger.jsx`: `{expenses, accounts, onEditExpense, onDeleteExpense}` — raggruppa per conto (intestazione `Avatar`+totale), righe `LedgerRow`, gestisce lo stato della `DetailSheet` (Tipo/Frequenza/Rinnovo/Scadenza/Conto, Modifica+Elimina doppia conferma). Sposta qui la logica oggi dentro `Dashboard.jsx`.
- `Dashboard.jsx`: il blocco registro+sheet → `<ExpenseLedger/>`.
- Verifica: `preview.html?p=dashboard` invariato.

### Task 3: Pagina Spese
- `Expenses.jsx`: `PageHead` «Spese»+«Aggiungi spesa»; `StatRow` Totale mensile/Totale annuo/N spese; `Tabs` Tutte/Abbonamenti/Finanziamenti; tendina «Tutti i conti» nello slot `right`; `<ExpenseLedger/>` filtrato; stato vuoto.
- Verifica: `preview.html?p=expenses` a 390/desktop; filtri funzionanti.

### Task 4: Pagina Conti
- `Accounts.jsx`: `PageHead` «Conti»+«Nuovo conto»; lista conti a righe (`Avatar`+nome+«N spese»·totale mensile) → `DetailSheet` del conto (righe Spese/Totale mensile, «Modifica» apre il modal, «Elimina conto» doppia conferma → cancella conto + spese).
- Verifica: `preview.html?p=accounts`.

### Task 5: Moduli ExpenseForm + AccountForm + Modal
- `Modal.jsx`: fondo `surface`, bordo `line`, raggio 12, ombra `sheet`, header 15px, niente premium.
- `ExpenseForm.jsx`: `AmountField` in testa, `Segmented` per tipo e frequenza, campi nome/giorno/scadenza/conto (44px, bordo sottile). Niente uppercase. Conserva `account_id`.
- `AccountForm.jsx`: nome + icona (`Segmented`-like a 4). **Via il color picker**; sul submit conserva `account.color` (modifica) o default `#8D9BFF` (nuovo).
- Verifica: `preview.html?p=forms`.

### Task 6: AuthPage
- `AuthPage.jsx`: card piatta `surface` 12px, titolo 22px/400, linguette Accedi/Registrati sobrie, bottone indaco pieno, sentence case, niente grana/alone.
- Verifica: `preview.html?p=login`.

### Task 7: App.jsx — sidebar 3 voci + routing
- Sidebar: Panoramica/Spese/Conti (via voce-per-conto e le azioni «Nuova spesa/Nuovo conto» dal fondo). Topbar: solo hamburger su ≤768px.
- Viste: `dashboard`→`Dashboard`, `expenses`→`Expenses`, `accounts`→`Accounts`. Azioni dai `PageHead`.
- Via lo stato/Modal `deleteConfirm` (ora la cancellazione è nella scheda a doppia conferma). `handleDeleteExpense`/`handleDeleteAccount` restano (API invariata).
- Verifica: build + navigazione nell'app reale non verificabile senza login → anteprima per pagina.

### Task 8: Pulizia codice morto
- Rimuovere `DonutChart.jsx`, `ThemeToggle.jsx`, `AccountCard.jsx` (non più importati), e `Tooltip.jsx`/`SplitCurrency.jsx` se inutilizzati (verificare con grep).
- Verifica: `npm run build` pulito, nessun import rotto.

## Verifica finale
`npm run build` ok; anteprima a 390/desktop per `dashboard`, `expenses`, `accounts`, `forms`, `login`, `kit`. Screenshot a Federico. Push (lo lancia lui): `git -C "<Personals>" subtree push --prefix=personals-frontend origin-frontend main`.
