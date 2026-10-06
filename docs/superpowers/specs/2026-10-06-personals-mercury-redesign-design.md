# Personals — redesign «Mercury scuro»

Data: 06/10/2026 · Stato: impianto Dashboard approvato via mockup, in attesa del piano

## 1. Obiettivo

Portare Personals allo stesso stile di Wealth: Mercury in versione scura. Calmo, arioso, un carattere solo, quasi zero colore, filetti sottili, superfici piatte.

Oggi Personals è un giro precedente: accento viola, grana a schermo, vetro con blur su sidebar e topbar, gradienti e ombre premium, una palette grafici a 8 tinte arcobaleno per distinguere i conti, maiuscoletto spaziato ovunque, cifre in JetBrains Mono, testo sotto i 12px, la ciambella in Dashboard, e le azioni distruttive a un tocco sparse in hover.

Nessuna funzione nuova e nessuna modifica al backend: cambia solo come si vede e come si naviga quello che c'è già. La logica (calcolo del mensile, normalizzazione annuale → mensile, CRUD, auth) non si tocca.

Nota tecnica: Personals usa **React + Vite + Tailwind**, Wealth usa CSS semplice. Quindi le fondamenta di Wealth si portano come **valori nei token Tailwind** (colori, carattere, raggi), non copiando `mercury.css`.

## 2. Decisioni approvate da Federico (06/10/2026)

1. Riferimento: **Mercury**, tema **scuro**. Uguale a Wealth.
2. **Solo scuro.** Si toglie il selettore tema (`ThemeToggle`) e tutto il ramo chiaro. Niente tema chiaro da mantenere.
3. **Logo banca monocromo.** Si tiene il logo vero ma reso neutro (grigio chiaro/bianco) dentro il tondo scuro, come l'avatar di Wealth. Via il chip chiaro e il badge del colore di marca. Zero colori di marca.
4. **Sidebar a tre voci fisse:** Panoramica · Spese · Conti. Sparisce la voce-per-conto; il filtro per conto va dentro la pagina Spese (tendina «Tutti i conti»).
5. **Impianto Dashboard approvato via mockup:** spesa mensile grande + proiezione annua, ripartizione come barretta + lista (niente ciambella), fila di tre indicatori, registro delle spese raggruppato per conto con riga → scheda.

## 3. Fondamenta (valgono per ogni pagina)

Regola di lavoro: **i nomi dei token Tailwind restano gli stessi, cambiano i valori** (in `tailwind.config.js`). Così ogni pagina si alza da sola e le parti non ancora rifatte non si rompono.

### Colori (`tailwind.config.js`)

| Token | Oggi | Nuovo |
|---|---|---|
| `bg` | `#0B0B0D` | `#14141B` |
| `surface` | `#15151A` | `#1B1B24` |
| `surface2` | `#1C1C22` | `#23232E` |
| `line` | `rgba(255,255,255,.08)` | stesso colore, reso **1px** (non 0.5) |
| `line-strong` | `rgba(255,255,255,.14)` | `rgba(255,255,255,.16)` |
| `ink` | `#F4F3F1` | `#EDEDF3` |
| `ink-dim` | `#A8A6A2` | `#9A9AA8` |
| `ink-faint` | `#7A7880` | `#9A9AA8` (un solo grigio secondario) |
| `accent` | `#8B7BFF` | `#8D9BFF` |
| `accent-strong` | `#7C5CFC` | `#8D9BFF` (piatto; bottone = fondo accent, testo `#14141B`) |
| `pos` | `#34D399` | `#4FD1A1` |
| `neg` | `#FB7185` | `#F58A9B` |
| `brand.*` | scala viola | rimappata su indaco, così ogni classe `brand-*` legacy adotta l'indaco da sola |

Nuovi token per la **ripartizione** (toni di indaco + grigio, assegnati per posizione, non dal colore del conto):

| Token | Valore | Uso |
|---|---|---|
| `tone-1` | `#8D9BFF` | 1° conto |
| `tone-2` | `#5F69B8` | 2° conto |
| `tone-3` | `#3D4272` | 3° conto |
| `tone-mute` | `#6B6B7B` | 4° conto e oltre (ciclo) |

Il colore porta un solo significato: **verde = entrata/guadagno, rosa = perdita o azione distruttiva.** Tutto il resto è indaco o grigio. Il campo `color` del conto resta nel DB (logica congelata) ma l'interfaccia non lo usa più per colorare badge e icone.

### Carattere

- **Inter soltanto**, pesi 400 e 500. Cifre tabulari attive (`font-feature-settings: "tnum"`).
- **Esce JetBrains Mono.** La classe `.font-number` punta a Inter con `tnum` (resta come nome, così non si toccano i 30+ punti che la usano). Il token `mono` resta definito ma inutilizzato.
- `index.html`: il link ai font carica **solo Inter 400 e 500** (via le varianti grasse e JetBrains Mono).
- Scala: titolo pagina 24–26px/400 · cifra principale 38px/400 (32px sul telefono) · indicatori 24px · testo 14px · etichette e secondari 12–13px. **Niente sotto i 12px** (via i `text-[11px]`, `[10px]`, `[9px]`).
- Centesimi delle cifre grandi in grigio secondario.
- Etichette in **minuscolo normale**: via `uppercase` e `tracking-wide/widest/[0.15em]`.
- Pesi: via `font-semibold` e `font-bold` → `font-medium` (500). Niente `font-synthesis`.

### Superfici

- Via la grana (`.bg-noise`), gli orb (`.ambient-orb`), il vetro con blur (`.glass` su sidebar e topbar → fondo pieno `bg`), lo sheen delle stat-card, l'emboss (`.icon-badge`), il lift in hover delle card (`.card-premium:hover translateY`), il `text-depth`, lo sheen dei bottoni (`.btn-premium`), i gradienti sui badge, la barretta viola `.nav-active`.
- Card: fondo pieno `surface`, bordo 1px `line`, raggio **12px** (`rounded-xl`, non `rounded-2xl`). Controlli: raggio **8px** (`rounded-lg`).
- Bottone primario: fondo indaco pieno, testo `#14141B`, nessun alone al passaggio.
- Liste: righe separate da un filetto 1px, mai card arrotondate una per riga.
- `theme-color` in `index.html` → `#14141B`. `<html>` resta `class="dark"` fisso; via lo script che toglie `dark` su `theme=light`.

### Cornice dell'app

Sidebar e topbar prendono fondo `bg`, filetto 1px, voce attiva con testo `ink` e fondo `surface2`, senza rail colorata né bordi colorati.

## 4. Componenti condivisi (nuovi o rifatti)

React + utility Tailwind (niente copia di `mercury.css`). Un sottile `@layer components` in `index.css` solo dove la ripetizione fa male (riga di registro, scheda).

| Componente | Cosa fa | Dove |
|---|---|---|
| `PageHead` | Titolo 24–26px a sinistra, azione principale a destra (bottone con testo su desktop, tondo «+» sul telefono) | ogni pagina |
| `StatRow` | Fila di 3 indicatori senza scatola: etichetta 12px sopra, cifra 24px sotto | Panoramica |
| `Tabs` | Linguette con sottolineatura indaco sulla voce attiva | Spese |
| `LedgerRow` | Riga di spesa a griglia: nome + dettaglio (tipo · giorno/scadenza) · importo. Tocco → scheda | Spese, Panoramica |
| `DetailSheet` | Scheda dettagli. Sul telefono (≤640px) sale dal basso, su desktop è un pannello a destra. Si chiude fuori/Esc/trascinamento. In fondo l'azione distruttiva | Spese, Conti |
| `Avatar` | Tondo scuro `surface2` con il logo banca **monocromo**, o la sigla se manca | intestazioni conto, scheda |
| `AmountField` | Importo grande in testa ai moduli (34px), simbolo € grigio | ExpenseForm |
| `Segmented` | Interruttore a segmenti (Abbonamento/Finanziamento, Mensile/Annuale) | ExpenseForm |

**Un solo meccanismo per le azioni distruttive:** si tocca la riga → si apre la scheda. Dentro la scheda «Elimina spesa»/«Elimina conto» è a **doppia conferma** (al primo tocco diventa «Conferma», al secondo cancella; dopo ~4s torna com'era). Via le iconcine matita/cestino sparse in hover e il Modal di conferma separato.

## 5. Pagine

### Panoramica (ex Dashboard)
- Saluto Inter (24px) + titolo «Panoramica» + mese.
- **Card spesa mensile** (sinistra, larga): etichetta «Spesa mensile», cifra grande 38px, sotto «≈ X € all'anno · N spese su M conti». Niente grafico a linea (Personals non ha storico nel tempo: sarebbe finto).
- **Card ripartizione** (destra): barretta a segmenti (toni di indaco + grigio) + lista dei conti con percentuale e valore. Toccando un conto si aprono sotto le sue spese.
- **StatRow:** Abbonamenti · Finanziamenti · Media per conto.
- **Registro** sotto: spese raggruppate per conto (intestazione con `Avatar` + totale del conto a destra), ogni spesa una `LedgerRow`.
- Telefono: le due card una sotto l'altra, cifra 32px.

### Spese
- `PageHead` «Spese» + «Aggiungi spesa».
- `StatRow`: Totale mensile · Totale annuo · N spese.
- `Tabs`: Tutte · Abbonamenti · Finanziamenti (filtra su `expense_type`).
- Tendina «Tutti i conti» a destra delle linguette (il filtro per conto che prima era la sidebar).
- Registro raggruppato per conto, riga → `DetailSheet` (importo, tipo, frequenza, rinnovo, scadenza, conto; in fondo «Elimina spesa»).
- Spesa annuale: in riga mostra l'importo annuo con sotto il `/mese` normalizzato, come oggi.
- Stato vuoto: «Nessuna spesa» + «Aggiungi spesa».

### Conti
- `PageHead` «Conti» + «Nuovo conto».
- Lista conti a righe: `Avatar` + nome + «N spese» · totale mensile. Riga → `DetailSheet` del conto (modifica nome/icona + «Elimina conto» a doppia conferma; eliminando un conto si cancellano le sue spese, come oggi).

### Moduli (ExpenseForm, AccountForm)
- Dentro il `Modal` rifatto (piatto, raggio 12, nessuna ombra premium).
- ExpenseForm: `AmountField` grande in testa, `Segmented` per tipo e frequenza, campi 44px bordo sottile, tendina conto. L'importo è la cosa più grande.
- AccountForm: nome + scelta icona. **Via il selettore colore** dall'interfaccia (il colore non si vede più); sul salvataggio si conserva il `color` esistente (modifica) o un default (nuovo), per non toccare il backend.

### Login / Registrazione (AuthPage)
- Card piatta, titolo 22px/400, linguette Accedi/Registrati sobrie, bottone indaco pieno. Via grana e alone sul logo.

## 6. Navigazione
Sidebar a tre voci fisse (Panoramica · Spese · Conti), stessi materiali della cornice. Il «+ Aggiungi spesa» resta azione principale in testa alla pagina. Sul telefono la sidebar è a scomparsa come oggi.

## 7. Logo banca monocromo
Si tiene `logo.clearbit.com/<domain>` ma reso neutro con filtro CSS (`grayscale(1) brightness(1.6)` o equivalente), dentro il tondo `surface2`. Se il dominio manca o l'immagine fallisce, fallback alla **sigla** in Inter (come l'avatar di Wealth). Via il chip chiaro e il badge colorato in `banks.js` (i campi `bg`/`fg`/`ring` di marca non si usano più per il rendering; `label` e `domain` restano).

## 8. Ordine di lavoro
Un commit per passo, così si torna indietro pagina per pagina.

**Fase 1 — fondamenta + Panoramica**
1. Token Tailwind + `index.css` (ornamenti via) + `index.html` (font, theme-color, dark fisso).
2. Togliere `ThemeToggle` e il ramo chiaro.
3. Componenti condivisi (`PageHead`, `StatRow`, `Avatar`, `LedgerRow`, `DetailSheet`).
4. Panoramica (ripartizione a lista, niente ciambella; registro).

**Fase 2 — Spese + Conti + moduli + Login**
Spese (tabs + filtro + registro + scheda) → Conti → ExpenseForm/AccountForm (`AmountField`, `Segmented`) + Modal → AuthPage.

## 9. Fuori da questo progetto
- Backend e dati: non si toccano. Il campo `color` del conto resta nel DB.
- Funzioni nuove (storico nel tempo, ricerca, tema chiaro).
- `DonutChart.jsx` e `ThemeToggle.jsx` vengono rimossi dall'uso; la cartella `personal-expenses/` (versione vecchia, non tracciata) si lascia com'è.

## 10. Verifica
- `npm run build` senza errori a ogni passo.
- Controllo visivo a **390px e a desktop** per ogni pagina toccata (Federico usa l'app dal telefono).
- Nell'app non si entra senza password: il controllo si fa su una **pagina di anteprima locale** con dati finti che usa i componenti veri (stesso metodo di Wealth: `preview.html?p=...`, fixtures fuori dal build). Dopo il deploy, l'ultima parola è di Federico sull'app reale.
- Nessun ornamento aggiunto senza richiesta.

## 11. Rilascio
Repo locale unico in `Personals/` con due remote. Il frontend è un **sito statico su Render** (`render.yaml`: build `npm install && npm run build`, pubblica `dist/`): il deploy parte col **push su `origin-frontend` ramo `main`**, Render ribuilda da solo. Il backend (`origin-backend`) non si tocca. Il token GitHub è scaduto: finché non c'è quello nuovo, **il push lo lancia Federico** con l'URL pulito.
