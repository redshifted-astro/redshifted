# Guida a Redshifted

Questa guida spiega come pubblicare articoli e come modificare il sito **senza usare la riga di comando**: basta il browser.

---

## 1. Pubblicare un nuovo articolo

1. Clicca il link giusto (devi aver fatto l'accesso a GitHub):
   - **Articolo in italiano:** [apri il modulo precompilato](https://github.com/redshifted-astro/redshifted/new/main?filename=it/_posts/2026-10-25-titolo-articolo.md&value=---%0Atitle%3A%20%22Titolo%20dell%27articolo%22%0Adescription%3A%20%22Una%20o%20due%20frasi%20che%20riassumono%20l%27articolo%3A%20compaiono%20nella%20scheda%20e%20su%20Google.%22%0Atopic%3A%20cosmology%0Atags%3A%20%5Bcosmologia%2C%20materia%20oscura%5D%0Aref%3A%20nome-breve-dell-articolo%0A%23%20Per%20togliere%20il%20simbolo%20%23%20e%20attivare%20una%20riga%2C%20cancellalo%20%28e%20anche%20lo%20spazio%20dopo%29.%0A%23%20image%3A%20%2Fassets%2Fimg%2Fposts%2Fnome-immagine.jpg%0A%23%20image_alt%3A%20%22Descrizione%20dell%27immagine%22%0A%23%20image_caption%3A%20%22Didascalia%20%28facoltativa%29%22%0A%23%20section%3A%20missions%0A%23%20math%3A%20true%0A---%0A%0AScrivi%20qui%20il%20testo%20dell%27articolo.%0A%0A%23%23%20Un%20titolo%20di%20sezione%0A%0ATesto%20con%20%2A%2Agrassetto%2A%2A%2C%20%2Acorsivo%2A%20e%20%5Bun%20link%5D%28https%3A%2F%2Fesempio.org%29.%0A)
   - **Articolo in inglese:** [apri il modulo precompilato](https://github.com/redshifted-astro/redshifted/new/main?filename=en/_posts/2026-10-25-article-title.md&value=---%0Atitle%3A%20%22Article%20title%22%0Adescription%3A%20%22One%20or%20two%20sentences%20summarising%20the%20article%3A%20they%20appear%20on%20the%20card%20and%20on%20Google.%22%0Atopic%3A%20cosmology%0Atags%3A%20%5Bcosmology%2C%20dark%20matter%5D%0Aref%3A%20short-name-of-the-article%0A%23%20To%20switch%20a%20line%20on%2C%20delete%20the%20%23%20and%20the%20space%20after%20it.%0A%23%20image%3A%20%2Fassets%2Fimg%2Fposts%2Fimage-name.jpg%0A%23%20image_alt%3A%20%22Description%20of%20the%20image%22%0A%23%20image_caption%3A%20%22Caption%20%28optional%29%22%0A%23%20section%3A%20missions%0A%23%20math%3A%20true%0A---%0A%0AWrite%20the%20text%20of%20the%20article%20here.%0A%0A%23%23%20A%20section%20heading%0A%0AText%20with%20%2A%2Abold%2A%2A%2C%20%2Aitalic%2A%20and%20%5Ba%20link%5D%28https%3A%2F%2Fexample.org%29.%0A)
2. In alto, nella casella del nome del file, cambia la parte dopo la data: per esempio `2026-10-25-titolo-articolo.md` diventa `2026-11-03-buchi-neri-supermassicci.md`.
   - La data è quella di pubblicazione, nel formato **anno-mese-giorno**.
   - Usa solo lettere minuscole, numeri e trattini, **senza spazi né accenti**. Quel nome diventa l'indirizzo dell'articolo.
3. Sostituisci i campi tra i due `---` e scrivi il testo sotto.
4. Premi il pulsante verde **Commit changes...** e poi di nuovo **Commit changes**.
5. Dopo circa 1-2 minuti l'articolo è online, nel Giornale, nella Home e nella pagina del suo argomento.

> L'articolo italiano deve stare nella cartella `it/_posts/`, quello inglese in `en/_posts/`. I link qui sopra la scelgono già per te.

---

## 2. I campi in alto nell'articolo

| Campo | A cosa serve | Obbligatorio |
|---|---|---|
| `title` | Titolo dell'articolo | sì |
| `description` | Breve riassunto, mostrato nella scheda e su Google | consigliato |
| `topic` | Argomento: `solar-system`, `exoplanetary-science`, `milky-way`, `extragalactic-astrophysics`, `cosmology`, `special-features` | consigliato |
| `tags` | Parole chiave tra parentesi quadre, separate da virgola: `[cosmologia, materia oscura]` | consigliato |
| `ref` | Nome che collega la versione italiana e quella inglese dello stesso articolo (vedi sotto) | solo se tradotto |
| `image` | Immagine di copertina, per esempio `/assets/img/posts/orione.jpg` | no |
| `image_alt` | Descrizione dell'immagine (per chi non la vede) | no |
| `image_caption` | Didascalia sotto l'immagine | no |
| `section` | `missions` per farlo comparire anche in *Missioni spaziali* (resta comunque nel Giornale) | no |
| `math` | `true` per attivare le formule | no |
| `published` | `false` per tenerlo nascosto (bozza) | no |

Attenzione a due cose:
- se il titolo o il riassunto contengono i due punti `:`, lascia sempre le virgolette `"..."` attorno al testo;
- i tag vanno scritti con le parentesi quadre, altrimenti una parola con spazio viene spezzata in due.

---

## 3. Scrivere il testo (Markdown)

```
## Titolo di sezione
### Titolo più piccolo

Testo normale con **grassetto** e *corsivo*.

- elenco puntato
- secondo punto

1. elenco numerato
2. secondo punto

> Una citazione

[testo del link](https://indirizzo.it)

![descrizione dell'immagine](/redshifted/assets/img/posts/foto.jpg)
```

Per le immagini dentro il testo ricorda di scrivere `/redshifted/` all'inizio dell'indirizzo, come nell'esempio.

### Formule

Metti `math: true` in alto, poi scrivi le formule tra doppi dollari:

- nella riga: `$$H_0 = 70 \; \mathrm{km\,s^{-1}\,Mpc^{-1}}$$`
- su una riga a sé, lasciando una riga vuota prima e dopo:

```
$$
\left(\frac{\dot a}{a}\right)^2 = \frac{8\pi G}{3}\rho - \frac{k c^2}{a^2} + \frac{\Lambda c^2}{3}
$$
```

---

## 4. Lo stesso articolo in italiano e in inglese

Crea due file, uno in `it/_posts/` e uno in `en/_posts/`, e dai a **entrambi lo stesso `ref`** (per esempio `ref: buchi-neri`). Il pulsante **IT / EN** in alto porterà il lettore alla traduzione dello stesso articolo.

Se un articolo esiste in una sola lingua, il pulsante porta all'elenco degli articoli dell'altra lingua. Va bene così.

---

## 5. Aggiungere immagini

1. Apri la cartella `assets/img/posts` su GitHub.
2. Premi **Add file → Upload files**, trascina le immagini e conferma con **Commit changes**.
3. Nell'articolo scrivi `image: /assets/img/posts/nome-del-file.jpg`.

Consigli: JPEG, larghezza circa 1200 px, meno di 500 KB. Nome del file senza spazi né accenti. Per le immagini molto pesanti conviene ridurle prima con un programma o un sito di compressione.

**Foto di copertina e carosello.** Nella Home il carosello mostra gli **ultimi 5 articoli**, ognuno con la sua foto di copertina, e si può cliccare per aprirli. Un articolo senza `image` compare comunque, ma con uno sfondo scuro al posto della foto: per il carosello conviene sempre metterla. Le foto più larghe che alte (circa 16:9) rendono meglio.

**Crediti e didascalie.** Se la foto o l'immagine l'hai creata tu (anche con un programma di intelligenza artificiale), non serve un credito, ma in un sito scientifico conviene scrivere nella didascalia (`image_caption`) che è un'illustrazione, per esempio «Illustrazione generata con IA», così nessuno la scambia per una vera osservazione. Per le immagini prese da altri (NASA, ESA, osservatori...) scrivi sempre la fonte, per esempio «Credit: NASA/ESA», e verifica la licenza.

---

## 6. Modificare, nascondere o eliminare un articolo

- **Modificare:** apri il file su GitHub, premi l'icona a forma di matita, cambia e fai **Commit changes**.
- **Nascondere:** aggiungi `published: false` tra i `---`.
- **Eliminare:** apri il file, premi i tre puntini in alto a destra e scegli **Delete file**.

---

## 7. Aggiungere un file alla pagina Download

1. Apri su GitHub la cartella `assets/downloads`, premi **Add file → Upload files**, trascina il file (PDF, presentazione, immagine...) e conferma con **Commit changes**. Nome del file senza spazi né accenti.
2. Apri il file `_data/downloads.yml`, premi la matita e aggiungi in fondo un blocco come questo. I rientri (gli spazi all'inizio delle righe) devono essere identici:

```
- file: /assets/downloads/dispensa-buchi-neri.pdf
  size: "2 MB"
  title:
    it: "Dispensa sui buchi neri"
    en: "Black holes handout"
  description:
    it: "Una breve introduzione agli orizzonti degli eventi."
    en: "A short introduction to event horizons."
```

3. Premi **Commit changes**. Dopo 1-2 minuti il file compare nella pagina *Download*, in italiano e in inglese. Il blocco più in alto compare per primo. Per togliere un file basta cancellare il suo blocco.

---

## 8. Cambiare i testi del sito

| Cosa | Dove |
|---|---|
| Titolo e sottotitolo della Home (il carosello e la fascia degli argomenti sono automatici) | `it/index.html` e `en/index.html` (tra i `---` in alto) |
| Titoli e introduzioni di Giornale, Argomenti, Missioni spaziali, Download | i file `index.html` nelle cartelle `it/...` e `en/...` |
| Nomi e descrizioni degli argomenti | `_data/topics.yml` |
| Scritte del menu, dei pulsanti, del piè di pagina | `_data/i18n.yml` |
| Colori e aspetto | `assets/css/style.css` (variabili all'inizio del file) |
| Pagina «Chi sono» / «About» (si apre dal link in fondo a ogni pagina) | `it/about/index.md` e `en/about/index.md` (il testo sotto i `---` è Markdown, come negli articoli) |
| Pagina «Contatti» / «Contact» (indirizzo email incluso) | `it/contact/index.md` e `en/contact/index.md` |
| Elenco dei file della pagina Download | `_data/downloads.yml` (vedi punto 7) |
| Ricerca nel menu in alto | si aggiorna da sola: legge il testo di tutti gli articoli pubblicati (non devi fare niente) |
| Logo e immagine del titolo | `assets/img/logo.jpg` e `assets/img/logo-titolo-dark.png` |

L'immagine del titolo contiene la scritta in inglese «Personal Astronomy & Astrophysics Journal».

---

## 9. Prima installazione (una volta sola)

1. Scompatta lo ZIP sul computer.
2. Apri il tuo repository su GitHub: `https://github.com/redshifted-astro/redshifted`.
3. Premi **Add file → Upload files**.
4. Trascina **il contenuto** della cartella scompattata (non lo ZIP): tutte le cartelle e tutti i file. Usa Chrome, Edge o Firefox.
5. Attendi che finisca il caricamento e premi **Commit changes**.
6. Vai in **Settings → Pages** e controlla che *Source* sia **Deploy from a branch**, con branch **main** e cartella **/ (root)**.
7. Dopo 1-2 minuti il sito è online su `https://redshifted-astro.github.io/redshifted/`.

I vecchi file `journal.html`, `observations.html` ecc. vengono sostituiti da pagine che portano alla nuova versione, così i vecchi link continuano a funzionare. I vecchi `logo.jpg` e `titolo.jpg` nella cartella principale non servono più e puoi eliminarli.

---

## 10. Se qualcosa non va

- **L'articolo non compare:** controlla che il file sia in `it/_posts/` o `en/_posts/`, che il nome inizi con la data nel formato `AAAA-MM-GG-` e finisca con `.md`, e che la data non sia nel futuro.
- **Compare una pagina di errore:** probabilmente c'è un errore tra i due `---` (virgolette mancanti, spazi sbagliati). Su GitHub apri la scheda **Actions**: l'ultima esecuzione, se rossa, indica il file e la riga.
- **L'immagine non si vede:** verifica che il nome del file sia identico (maiuscole comprese) a quello scritto in `image:`.
- **Le modifiche non si vedono:** attendi un paio di minuti e ricarica la pagina con Ctrl+F5 (Cmd+Shift+R su Mac).
