# Personals Mercury — Fase 1 (fondamenta + Panoramica)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Portare le fondamenta Mercury (token, superfici, carattere) su tutta Personals e rifare la Panoramica, senza toccare backend né logica.

**Architecture:** Si cambiano i valori dei token Tailwind (nomi invariati) + si spengono gli ornamenti in `index.css` → ogni pagina si alza da sola. Si aggiungono componenti React (utility Tailwind) e si riscrive la Dashboard come «Panoramica». Verifica su una pagina di anteprima locale con dati finti (no login), a 390px e desktop.

**Tech Stack:** React 18, Vite 6, Tailwind 3. Nessun test runner nel progetto: la verifica di ogni task è `npm run build` pulito + controllo visivo su `preview.html`.

## Global Constraints
- Fondo `#14141B`, card `#1B1B24`, elev `#23232E`, accento unico indaco `#8D9BFF`.
- Inter soltanto, pesi 400/500, cifre tabulari. Niente testo < 12px. Niente `uppercase`/`tracking` largo. Niente `font-semibold/bold`.
- Verde `#4FD1A1` = entrata/guadagno; rosa `#F58A9B` = perdita/azione distruttiva. Resto indaco o grigio.
- Niente grana, aloni, vetro con blur, gradienti, ombre decorative. Card raggio 12px, controlli 8px.
- Solo tema scuro (`<html class="dark">` fisso). Logica e backend congelati. Il campo `color` del conto resta nel DB ma non si usa per colorare.
- Ramo di lavoro: `mercury-phase-1`. Niente push (lo lancia Federico). Un commit per task.

---

### Task 1: Anteprima locale con dati finti
**Files:** Create `preview.html`, `src/preview/fixtures.js`, `src/preview/Preview.jsx`, `src/preview/main.jsx`.
Serve a vedere le pagine senza login. `vite build` builda solo `index.html`, quindi `preview.html` NON entra in `dist` (resta solo nel dev server).

- [ ] `fixtures.js`: esporta `dashboard` (`{accounts:[{id,name,color,icon,total}], grandTotal, totalExpenses}`), `accounts`, `expenses` (con `name,amount,frequency,expense_type,renewal_day,end_date,account_id`). Dati realistici: Revolut/Intesa/American Express/Hype, abbonamenti + un finanziamento + un annuale.
- [ ] `Preview.jsx`: legge `?p=` e monta il pezzo giusto (`frame`, `dashboard`, `dashboard-empty`, poi i componenti). Avvolge in `<div className="dark">`.
- [ ] `main.jsx` del preview: monta `Preview` + `import './../index.css'`.
- [ ] `preview.html`: copia di `index.html` che punta a `/src/preview/main.jsx`.
- [ ] Verifica: `npm run dev`, aprire `/preview.html?p=frame` → render senza errori console.
- [ ] Commit: `chore(preview): harness anteprima con dati finti`.

### Task 2: Token Tailwind + index.html
**Files:** Modify `tailwind.config.js`, `index.html`.

- [ ] `tailwind.config.js` → `colors`: `bg #14141B`, `surface #1B1B24`, `surface2 #23232E`, `line rgba(255,255,255,0.08)`, `line-strong rgba(255,255,255,0.16)`, `ink #EDEDF3`, `ink-dim #9A9AA8`, `ink-faint #9A9AA8`, `accent #8D9BFF`, `accent-strong #8D9BFF`, `pos #4FD1A1`, `neg #F58A9B`. Aggiungere `tone-1 #8D9BFF`, `tone-2 #5F69B8`, `tone-3 #3D4272`, `tone-mute #6B6B7B`. `brand` 400/500/600/700 → tutti indaco (`#8D9BFF`/`#A3AEFF`). Togliere i `boxShadow` decorativi (`glass`, `premium`, `glow`, `card-hover`) lasciando `card` neutro.
- [ ] `index.html`: link font → solo `Inter:wght@400;500` (via le varianti grasse e JetBrains Mono); `theme-color #14141B`; togliere lo `<script>` che rimuove `dark` su `theme=light` (dark fisso).
- [ ] Verifica: `npm run build` ok; `/preview.html?p=frame` fondo `#14141B`.
- [ ] Commit: `feat(tokens): palette Mercury scuro + Inter only`.

### Task 3: index.css — spegni gli ornamenti
**Files:** Modify `src/index.css`.

- [ ] `.bg-noise::after { content: none }`; `.ambient-orb { display:none }` (già).
- [ ] `.glass` e `.dark .glass` → fondo `#14141B`, `backdrop-filter:none`. `.sidebar-depth`/`::after` → fondo `#14141B`, niente blur. `.backdrop-modal` → `rgba(8,8,12,.62)`, no blur.
- [ ] `.card` / `.card-premium` → `background:#1B1B24; border:1px solid rgba(255,255,255,.08); border-radius:12px; box-shadow:none`; hover senza `translateY`. `.stat-card`/`::before` → piatta, niente sheen/inset. `.icon-badge { box-shadow:none }`.
- [ ] `.btn-premium`/`::after` → niente sheen; `.nav-active::before { content:none }`. `.text-depth` → niente text-shadow. `.divider-glow` → `rgba(255,255,255,.08)`.
- [ ] `.font-number { font-family:'Inter'; font-variant-numeric:tabular-nums; letter-spacing:-0.01em }` (fuori JetBrains Mono). `.input` raggio 8px, focus senza box-shadow colorato (bordo accent).
- [ ] Verifica: `npm run build` ok; `/preview.html?p=frame` card piatte bordo 1px, zero grana/alone.
- [ ] Commit: `feat(surfaces): spenti grana, vetro, aloni e ombre`.

### Task 4: Avatar + banks.js monocromo
**Files:** Create `src/components/Avatar.jsx`; Modify `src/lib/banks.js`.
`Avatar({name,size})`: tondo `surface2`; se `bankBrand(name).domain` → `<img>` Clearbit con `filter:grayscale(1) brightness(1.7) contrast(1.1)`; su errore o senza dominio → sigla (prime 1–2 lettere significative) in `ink`. `banks.js`: `bankBrand` continua a tornare `label`/`domain` (i campi `bg`/`fg`/`ring` restano ma non si usano nel rendering).

- [ ] Verifica: `/preview.html?p=components` mostra Avatar Revolut (logo grigio) e un conto senza dominio (sigla).
- [ ] Commit: `feat(avatar): logo banca monocromo + sigla`.

### Task 5: PageHead + StatRow
**Files:** Create `src/components/PageHead.jsx`, `src/components/StatRow.jsx`.
`PageHead({title, greeting?, action})`: greeting 14px `ink-dim`, titolo 24px/400, azione a destra (bottone testo desktop / tondo «+» ≤640px). `StatRow({stats:[{label,value,tone?}]})`: griglia 3, etichetta 12px `ink-dim`, valore 24px/400 (`pos`/`neg` se tone).

- [ ] Verifica: `/preview.html?p=components`.
- [ ] Commit: `feat(components): PageHead + StatRow`.

### Task 6: LedgerRow + DetailSheet
**Files:** Create `src/components/LedgerRow.jsx`, `src/components/DetailSheet.jsx`.
`LedgerRow({title, sub, amount, amountSub?, tone?, onClick})`: griglia `1fr auto`, filetto 1px sopra, hover tenue; `title` 14px, `sub` 12px `ink-dim`, importo a destra con `amountSub` sotto. `DetailSheet({open,onClose,title,subtitle,avatar,amount,rows,onEdit?,onDelete,deleteLabel})`: ≤640px sale dal basso, ≥641px pannello a destra; chiusura fuori/Esc; delete a **doppia conferma** (stato interno `armed`, reset dopo 4s); `rows` = coppie etichetta/valore.

- [ ] Verifica: `/preview.html?p=sheet` apre la scheda; il delete chiede conferma due volte.
- [ ] Commit: `feat(components): LedgerRow + DetailSheet con delete a doppia conferma`.

### Task 7: Panoramica (riscrittura Dashboard)
**Files:** Modify `src/components/Dashboard.jsx` (→ Panoramica), `src/App.jsx` (passa `accounts`, `expenses`, `onEditExpense`, `onDeleteExpense`; rimuove la greeting/titolo vecchi dalla pagina perché ora in Panoramica). Rimuove l'uso di `DonutChart` e della palette arcobaleno.
Struttura: card «Spesa mensile» (38px + «≈ X €/anno · N spese su M conti») | card «Ripartizione» (barretta `tone-*` + lista conti con % e valore, voce cliccabile che apre sotto le spese del conto) ; `StatRow` Abbonamenti/Finanziamenti/Media per conto ; registro raggruppato per conto (intestazione `Avatar`+totale, righe `LedgerRow`) con tocco → `DetailSheet` (Tipo/Frequenza/Rinnovo/Scadenza/Conto, «Modifica» apre il modal esistente, «Elimina spesa»). Colore conto nella ripartizione assegnato per posizione (`tone-1..3`, poi `tone-mute`), non da `account.color`.

- [ ] Verifica: `/preview.html?p=dashboard` a 1280 e 390 — niente ciambella, toni indaco, scheda funzionante; `dashboard-empty` stato vuoto.
- [ ] Commit: `feat(panoramica): Dashboard Mercury con ripartizione a lista e registro`.

### Task 8: Togli il tema chiaro e il ThemeToggle
**Files:** Modify `src/App.jsx` (via import+uso `ThemeToggle` e la riga «Tema» in sidebar); il file `ThemeToggle.jsx` resta ma inutilizzato (rimozione fisica nella pulizia di Fase 2).

- [ ] Verifica: `npm run build` ok; nessun riferimento a `ThemeToggle` in `App.jsx`.
- [ ] Commit: `chore(theme): rimosso selettore tema, solo scuro`.

## Verifica finale Fase 1
- `npm run build` pulito.
- Anteprima a 390 e 1280: `frame`, `dashboard`, `dashboard-empty`, `components`, `sheet`.
- Screenshot a Federico. Push (lo lancia lui): `git -C "<repo>" push https://github.com/sestinif/personals-frontend.git mercury-phase-1:main`.

## Fuori Fase 1 (→ Fase 2)
Sidebar a 3 voci + pagine Spese e Conti dedicate, moduli con `AmountField`/`Segmented`, Modal e AuthPage rifatti, rimozione fisica di `DonutChart.jsx`/`ThemeToggle.jsx`. In Fase 1 la sidebar e la vista per-conto restano, solo «alzate» dalle fondamenta.
