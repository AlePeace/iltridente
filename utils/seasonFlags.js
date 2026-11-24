// Interruttori temporanei di fine stagione (novembre 2026).
// Rimettere a `false` per ripristinare il comportamento normale: i contenuti
// in WordPress non sono stati toccati.

// Nasconde i due menu (pranzo + cena) della pagina "Il Ristorante" e i
// relativi bottoni "Menu". Le pagine /gateway/* NON sono toccate.
export const HIDE_RESTAURANT_MENUS = true;

// Sostituisce il form richieste eventi con un messaggio informativo
// (testo in messages/*.json -> eventForm.closedMessage).
export const EVENT_REQUESTS_CLOSED = true;

// Chiusura invernale (riapertura primavera 2027):
// - popup "Siamo chiusi!" all'accesso (components/SeasonPopup)
// - pagina Prenotazioni sostituita dallo stesso messaggio del popup
// - nascosti tutti i bottoni "Prenota" (GuestplanButton, CTA dell'header)
//   e la sezione "Prenotazione obbligatoria" (PrenotazioniHome)
// - nascosti gli orari nel footer
// Testi in messages/*.json -> seasonPopup.
export const SEASON_CLOSED = true;

// Pagina Cocktail Bar: toglie la frase sulla musica dal vivo (Maestro
// Giuseppe Rapicano) e l'icona "Musica dal vivo".
export const HIDE_LIVE_MUSIC = true;

// Pagina Cocktail Bar: nasconde la sezione "Aperitivo e Cena Informale" e il
// menu Casual Dining. La pagina /gateway/casualdinner NON è toccata.
export const HIDE_CASUAL_DINNER = true;
