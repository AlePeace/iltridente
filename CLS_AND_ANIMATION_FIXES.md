# CLS & Animation Micro-shifting — Diagnosi e Fix per Next.js / React

Questo documento è scritto per essere letto da Claude.
Contiene tutti i problemi noti che causano **Cumulative Layout Shift (CLS)**
e **micro-shifting nelle animazioni** in un progetto Next.js / React con GSAP.

**Come usarlo**: dai questo file a Claude insieme al codice del tuo progetto
e chiedigli di fare una diagnosi. Claude leggerà il codice, verificherà
quale dei problemi descritti qui è presente e ti darà un piano di fix mirato.

---

## Istruzioni per Claude

Quando ricevi questo file, segui questo processo:

1. Leggi l'intero documento per capire i problemi noti.
2. Esamina il codice del progetto (componenti, hook, CSS, configurazione Next.js).
3. Per ogni problema descritto, verifica se è presente nel codice.
4. Produci una tabella di diagnosi: problema → presente/assente/non verificabile.
5. Per i problemi presenti, produci un piano di fix ordinato per impatto.
6. Chiedi conferma prima di implementare.

---

## Categoria 1 — CLS da immagini

Il CLS da immagini è la causa più comune e visibile di layout shift.
Avviene quando il browser non sa quanto spazio riservare per un'immagine
prima che questa carichi.

---

### Problema 1.1 — Immagini senza `width` e `height` HTML

**Sintomo**: la pagina "salta" quando le immagini caricano, specialmente
scorrendo verso il basso dove ci sono immagini lazy-loaded.

**Causa**: senza attributi `width` e `height` sull'`<img>`, il browser
alloca 0px di altezza finché l'immagine non carica. Quando carica,
spinge tutto il contenuto sottostante verso il basso.

**Come diagnosticare nel codice**:
Cerca tag `<img>` o componenti immagine che non hanno `width` e `height`:

```jsx
// PROBLEMA — nessun width/height
<img src="/foto.jpg" alt="..." className="w-full" />

// OK — width e height presenti
<img src="/foto.jpg" alt="..." width={800} height={600} className="w-full" />
```

Cerca anche `next/image` usato senza `width`/`height` (solo con `fill` è
accettabile se il container ha dimensioni esplicite).

**Fix in Next.js**:

Opzione A — usa il componente `<Image>` di Next.js che gestisce tutto:
```jsx
import Image from 'next/image';

// Con dimensioni note
<Image src="/foto.jpg" alt="..." width={800} height={600} className="w-full h-auto" />

// Oppure con fill (richiede container con position: relative e dimensioni esplicite)
<div className="relative aspect-[4/3]">
    <Image src="/foto.jpg" alt="..." fill className="object-cover" />
</div>
```

Opzione B — `<img>` standard con attributi:
```jsx
<img src="/foto.jpg" alt="..." width={800} height={600} className="w-full h-auto" />
```

---

### Problema 1.2 — Immagini lazy senza spazio riservato (causa principale del CLS intermittente)

**Sintomo**: il layout shifta intermittentemente proprio mentre si scorre
verso una sezione con immagini. Non succede sempre, ma "ogni tanto".

**Causa**: Chromium ha un comportamento specifico — per le immagini con
`loading="lazy"` che hanno solo `aspect-ratio` CSS ma nessun attributo
HTML `width`/`height`, lo spazio viene riservato solo quando l'immagine
entra nella "lazy loading threshold zone" (circa 1200px prima del viewport).
In quel momento il browser simultaneamente riserva lo spazio E inizia
a caricare → layout shift visibile mentre ci si avvicina alla sezione.

Gli attributi HTML `width`/`height` vengono applicati durante il parsing HTML,
molto prima — eliminano il problema alla radice.

**Come diagnosticare**:
Cerca immagini con `loading="lazy"` (o senza attributo, che di default è lazy
per immagini below-fold) che hanno solo classi CSS per l'aspect ratio ma
nessun attributo `width`/`height`:

```jsx
// PROBLEMA — aspect-ratio solo CSS, nessun attributo HTML
<img src="..." className="w-full aspect-[4/3] object-cover" loading="lazy" />

// OK — attributi HTML presenti, il browser riserva spazio al parsing
<img src="..." width={800} height={600} className="w-full aspect-[4/3] object-cover" loading="lazy" />
```

**Fix**: aggiungi `width` e `height` che rispettino il ratio corretto.
I valori esatti non devono corrispondere alle dimensioni reali del file —
conta solo che il rapporto sia giusto:
- `aspect-[4/3]` → `width={800} height={600}` oppure `width={400} height={300}`
- `aspect-[16/9]` → `width={1600} height={900}`
- `aspect-[21/9]` → `width={2100} height={900}`

---

### Problema 1.3 — Immagine LCP senza `priority` / `fetchpriority`

**Sintomo**: LCP (Largest Contentful Paint) lento. L'immagine hero o
principale carica in ritardo.

**Causa**: l'immagine above-fold più grande viene caricata con priorità
normale invece che alta.

**Come diagnosticare**:
Identifica l'immagine LCP (solitamente la hero, la prima immagine grande
visibile senza scroll). Verifica che abbia `priority` su `next/image`
o `fetchpriority="high"` su `<img>`:

```jsx
// PROBLEMA — immagine hero senza priority
<Image src="/hero.jpg" alt="" width={1920} height={1080} />

// OK — priority segnala al browser di caricarla subito
<Image src="/hero.jpg" alt="" width={1920} height={1080} priority />
```

Per `<img>` standard:
```jsx
// OK
<img src="/hero.jpg" alt="" width={1920} height={1080}
     loading="eager" decoding="sync" fetchpriority="high" />
```

---

### Problema 1.4 — Immagini in container senza dimensioni esplicite

**Sintomo**: il container dell'immagine collassa a 0 altezza prima che
l'immagine carichi, poi si espande.

**Causa**: il div/section che contiene l'immagine non ha altezza definita
e si affida all'immagine per ottenere la sua altezza. Se l'immagine è lenta,
il container è vuoto.

**Come diagnosticare**:
Cerca immagini in container che non hanno né altezza fissa né `aspect-ratio`:

```jsx
// PROBLEMA — container senza altezza
<div>
    <img src="..." className="w-full object-cover" loading="lazy" />
</div>

// OK — aspect-ratio sul container riserva lo spazio
<div className="aspect-[4/3]">
    <img src="..." className="w-full h-full object-cover" loading="lazy" />
</div>
```

---

## Categoria 2 — CLS da animazioni GSAP con ScrollTrigger

---

### Problema 2.1 — ScrollTrigger inizializzato prima che le immagini carichino

**Sintomo**: le animazioni GSAP (specialmente quelle con `pin: true`)
saltano o sono sfasate. Il pin di una sezione funziona male, le
animazioni si attivano al momento sbagliato.

**Causa**: ScrollTrigger calcola le posizioni di trigger (`start`, `end`,
pin offset) al momento dell'inizializzazione. Se delle immagini senza
spazio riservato caricano dopo, il layout shifta e tutte le posizioni
calcolate da ScrollTrigger diventano errate.

**Come diagnosticare**:
Verifica se ci sono chiamate a `ScrollTrigger.create()` o `gsap.timeline({ scrollTrigger: ... })`
che vengono eseguite in `useEffect` senza aspettare che le immagini
della pagina siano caricate.

**Fix**: aggiungi `ScrollTrigger.refresh()` dopo che tutte le risorse
sono caricate. In Next.js:

```js
useEffect(() => {
    // Inizializza le animazioni...
    initAnimations();

    // Refresh dopo che tutte le risorse (immagini incluse) sono caricate
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

    return () => {
        // cleanup...
    };
}, []);
```

**Nota**: `window.load` funziona solo al primo caricamento della pagina.
Per le navigazioni client-side (router di Next.js), le immagini
devono già avere spazio riservato (Problemi 1.1–1.4) per evitare
che ScrollTrigger sia sfasato dopo la navigazione.

---

## Categoria 3 — Micro-shifting con GSAP SplitText

Questi problemi causano micro-shift visibili durante le animazioni di
testo con SplitText, non propriamente CLS (non spostano il layout
generale) ma percepiti come "scatti" nell'animazione.

---

### Problema 3.1 — Font non caricate quando SplitText calcola i line break

**Sintomo**: alla prima visita il testo fa un piccolo "salto" dopo che
l'animazione inizia — le righe si riposizionano leggermente. Non accade
nelle visite successive (font in cache).

**Causa**: `SplitText.create()` viene chiamato prima che i font custom
siano completamente caricati. Il browser usa il font fallback per
calcolare dove vanno a capo le righe. Quando il font reale carica
(anche solo 50–200ms dopo), il testo fa reflow in righe diverse.

Con `next/font` e `font-display: swap` (default) questo problema è
particolarmente frequente.

**Come diagnosticare nel codice**:
Cerca inizializzazioni di SplitText in `useEffect` che non aspettano i font:

```js
// PROBLEMA — SplitText subito, senza aspettare i font
useEffect(() => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
    // ...
}, []);
```

Aggiungi questo log temporaneo per confermare:
```js
useEffect(() => {
    console.log('font status:', document.fonts.status);
    // Se stampa 'loading' → il problema è reale
}, []);
```

**Fix**: aspetta `document.fonts.ready` prima di inizializzare SplitText:

```js
useEffect(() => {
    let destroyed = false;

    document.fonts.ready.then(() => {
        if (destroyed) return;
        setup(); // SplitText e ScrollTrigger qui
    });

    return () => { destroyed = true; cleanup(); };
}, []);
```

---

### Problema 3.2 — Flash di 1 frame del testo non-splittato

**Sintomo**: un brevissimo "lampeggio" all'inizio dell'animazione, come
se il testo apparisse nella posizione naturale per un frame prima di
sparire e animarsi correttamente.

**Causa**: la sequenza senza il fix:
1. `SplitText.create()` — muta il DOM, le righe sono visibili nella posizione naturale
2. `gsap.set(lines, { yPercent: 110 })` — le righe vengono spostate fuori vista

In certe condizioni (transizioni di pagina attive, CPU sotto stress)
il browser inserisce un paint tra 1 e 2.

**Come diagnosticare**:
Riproduci con CPU throttling: DevTools → Performance → CPU 6x slowdown.
Se vedi il testo "aperto" per un frame prima dell'animazione → è questo il problema.

**Fix**: nascondi l'elemento durante la mutazione DOM:

```js
function setup() {
    el.style.visibility = 'hidden';          // nascondi prima del DOM change

    const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
    });

    gsap.set(split.lines, { yPercent: 110 }); // posiziona fuori vista

    el.style.visibility = '';                // mostra: testo già fuori vista
}
```

---

### Problema 3.3 — Race condition su navigazione / unmount

**Sintomo**: animazioni duplicate, errori GSAP in console (`Cannot tween
a null target`), o comportamenti strani visibili solo in development
(React StrictMode esegue mount → unmount → mount intenzionalmente).

**Causa**: `document.fonts.ready.then(setup)` è asincrono. Se il
componente viene smontato prima che i font siano pronti (navigazione
rapida), il callback `.then()` viene eseguito comunque su un DOM
che non esiste più.

**Come diagnosticare**:
Naviga rapidamente tra pagine. Se vedi errori GSAP in console o
animazioni che si comportano diversamente dopo una navigazione rapida
→ è questo il problema.
In dev, il problema è sempre riproducibile con React StrictMode.

**Fix**: flag `destroyed` nel cleanup:

```js
useEffect(() => {
    let destroyed = false;

    document.fonts.ready.then(() => {
        if (destroyed) return; // già smontato, non fare nulla
        setup();
    });

    return () => {
        destroyed = true;
        cleanup();
    };
}, []);
```

---

## Implementazione completa consigliata

Di seguito il pattern completo che integra tutti i fix sopra.
Claude deve adattare selettori, durate e parametri al progetto specifico.

### Hook `useRevealText`

```js
// hooks/useRevealText.js
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function useRevealText(scopeRef, deps = []) {
    useEffect(() => {
        const scope = scopeRef?.current ?? document;
        const els = [...scope.querySelectorAll('.js-reveal')];
        if (!els.length) return;

        let destroyed = false;
        const triggers = [];
        const splits = [];
        const entered = new Set();

        function setup() {
            if (destroyed) return;

            triggers.forEach((t) => t.kill());
            triggers.length = 0;
            splits.forEach((s) => s.revert());
            splits.length = 0;

            els.forEach((el) => {
                el.style.hyphens = 'none';

                // Fix 3.2 — nascondi durante mutazione DOM
                el.style.visibility = 'hidden';
                const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
                splits.push(split);

                if (entered.has(el)) {
                    gsap.set(split.lines, { yPercent: 0 });
                    el.style.visibility = '';
                    return;
                }

                gsap.set(split.lines, { yPercent: 110 });
                el.style.visibility = '';

                const st = ScrollTrigger.create({
                    trigger: el,
                    start: 'top 90%',
                    onEnter: () => {
                        entered.add(el);
                        gsap.to(split.lines, {
                            yPercent: 0,
                            duration: 1.6,
                            ease: 'power3.out',
                            stagger: 0.08,
                        });
                    },
                });
                triggers.push(st);
            });

            ScrollTrigger.refresh();
        }

        // Fix 3.1 — aspetta font prima di splittare
        document.fonts.ready.then(setup);

        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setup, 200);
        };
        window.addEventListener('resize', onResize);

        // Fix 3.3 — cleanup con flag destroyed
        return () => {
            destroyed = true;
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            triggers.forEach((t) => t.kill());
            splits.forEach((s) => s.revert());
            els.forEach((el) => {
                el.style.hyphens = '';
                el.style.visibility = '';
            });
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
```

### Hook `useRevealImages`

```js
// hooks/useRevealImages.js
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useRevealImages(scopeRef, deps = []) {
    useEffect(() => {
        const scope = scopeRef?.current ?? document;
        const els = [...scope.querySelectorAll('.js-reveal-img')];
        if (!els.length) return;

        const triggers = [];

        gsap.set(els, { opacity: 0 });

        els.forEach((el) => {
            const st = ScrollTrigger.create({
                trigger: el,
                start: 'top 90%',
                onEnter: () => {
                    gsap.to(el, { opacity: 1, duration: 1.6, ease: 'power3.out' });
                },
            });
            triggers.push(st);
        });

        return () => {
            triggers.forEach((t) => t.kill());
            gsap.set(els, { clearProps: 'opacity' });
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
```

### Uso nei componenti

```jsx
// components/SomeSection.jsx
import { useRef } from 'react';
import Image from 'next/image';
import { useRevealText } from '@/hooks/useRevealText';
import { useRevealImages } from '@/hooks/useRevealImages';

export default function SomeSection() {
    const ref = useRef(null);

    useRevealText(ref);
    useRevealImages(ref);

    return (
        <section ref={ref}>
            <h2 className="js-reveal">Titolo animato</h2>
            <p className="js-reveal">Testo animato</p>

            {/* Fix 1.1 + 1.2 — width e height sempre presenti */}
            <Image
                src="/foto.jpg"
                alt="Descrizione"
                width={800}
                height={600}
                className="js-reveal-img w-full aspect-[4/3] object-cover"
            />
        </section>
    );
}
```

---

## Checklist diagnostica

Prima di implementare qualsiasi fix, Claude deve verificare questi punti
nel codice e segnalare per ognuno se il problema è **presente**, **assente**
o **non verificabile** senza vedere il codice specifico.

| # | Problema | Dove cercare |
|---|----------|-------------|
| 1.1 | `<img>` senza `width`/`height` | tutti i file JSX/TSX |
| 1.2 | `<img loading="lazy">` con solo `aspect-ratio` CSS | componenti con immagini below-fold |
| 1.3 | Immagine LCP senza `priority` o `fetchpriority="high"` | componente hero / prima sezione |
| 1.4 | Container immagine senza altezza o `aspect-ratio` | layout dei componenti immagine |
| 2.1 | ScrollTrigger init senza aspettare immagini caricate | hook o useEffect con GSAP |
| 3.1 | SplitText senza `document.fonts.ready` | hook o useEffect con SplitText |
| 3.2 | SplitText senza `visibility:hidden` durante il create | stessa funzione setup di SplitText |
| 3.3 | Mancanza flag `destroyed` nel cleanup async | tutti gli useEffect con promise async |

---

## Note finali

- Applica solo i fix per i problemi confermati — non aggiungere complessità inutile.
- `document.fonts.ready` è supportato da tutti i browser moderni, nessun polyfill necessario.
- Il componente `<Image>` di Next.js risolve automaticamente i problemi 1.1, 1.2 e 1.3
  se usato correttamente — valuta di migrare i tag `<img>` raw a `<Image>`.
- Se il progetto usa Framer Motion per le transizioni di pagina, il return dell'`useEffect`
  è il tuo `beforeLeave` — il pattern del cleanup è identico.
