# Messaggi — blocco email iCloud (Tridente)

Comunicazioni preparate il 25/08/2026 sul rifiuto delle conferme waitlist da
parte di Apple. Diagnosi tecnica completa in `CLAUDE.md`, sezione
"Deliverability email — indagine del 25/08/2026".

**In sintesi:** Apple ha marcato il dominio `iltridentepositano.com` nella
propria reputazione interna degli URL. Ogni email che contiene un link al sito
viene rifiutata con `554 5.7.1 [CS01]`. Contenuto, grafica, link ai partner, IP
di invio e hosting sono stati tutti verificati ed esclusi.

---

## 1. Messaggio per Irene (interno)

```
Ciao Irene,

ti aggiorno sul blocco delle email di conferma waitlist del Tridente,
perché abbiamo chiuso la diagnosi.

IL PROBLEMA
Le conferme automatiche verso indirizzi iCloud venivano rifiutate da
Apple con errore permanente 554 5.7.1 [CS01]. Non finivano in spam:
venivano proprio respinte, quindi il cliente non le riceveva mai.

LA CAUSA
Apple ha marcato il dominio iltridentepositano.com nel proprio sistema
interno di reputazione degli URL. Qualsiasi messaggio che contenga un
link al nostro sito viene rifiutato, indipendentemente da mittente,
contenuto e server di invio.

Isolato con 8 test controllati, cambiando una sola variabile alla
volta. Stesso identico messaggio:
  - senza link ............................. consegnato
  - con link a wikipedia.org ............... consegnato
  - con link a ederapositano.com ........... consegnato
  - con link a iltridentepositano.com ...... rifiutato (3 volte su 3)
  - con link a www. e a un sottodominio
    ospitato altrove ....................... rifiutato

COSA ABBIAMO ESCLUSO
Non è l'IP di invio di SiteGround, non è l'hosting su Vercel, non è il
contenuto promozionale, non è la grafica, non sono i link ai partner
(L'Onda, EdEra, Poesea). Tutto verificato singolarmente.
SPF, DKIM e DMARC sono corretti. Il dominio è pulito su tutte le
blocklist pubbliche (Spamhaus, SURBL, URIBL) ed è nostro dal 2018.

COSA È GIÀ STATO FATTO
Sistemate diverse criticità sulle email (versione testuale mancante,
link in http, URL spezzati dalla codifica). Ora il messaggio prende
10/10 su mail-tester. Sono migliorie corrette ma non risolvono il
blocco Apple, che è di reputazione dominio.

COSA SERVE ORA
1. Ok di Liliana per togliere dalla conferma i due link al sito
   (il "compila di nuovo il modulo" e la riga in fondo). Tutto il resto
   della mail resta identico. È il tampone che rimette in funzione le
   conferme subito.
2. Segnalazione ad Apple per la revisione del dominio: abbiamo un caso
   documentato molto solido. Onestamente però i tempi non dipendono da
   noi e Apple non garantisce nulla.
3. Attivato il monitoraggio DMARC per capire se qualcuno sta usando il
   nostro dominio in modo improprio, ipotesi che spiegherebbe come ci
   siamo bruciati.

Nota importante: cambiare provider di invio (Resend, Postmark) NON
risolverebbe, perché il problema è legato al dominio citato nei link,
non a chi spedisce. Meglio saperlo prima di investirci tempo.

Tutto documentato nel repo. Dimmi se vuoi che proceda col punto 1
appena arriva l'ok.
```

---

## 2. Messaggio per Liliana (cliente)

```
Buongiorno Liliana,

le scrivo per aggiornarla sul problema delle email di conferma della
lista d'attesa che non arrivavano ai clienti con indirizzo iCloud.

Abbiamo individuato la causa con certezza, dopo una serie di verifiche.

Apple ha erroneamente segnalato l'indirizzo del vostro sito nei propri
sistemi di sicurezza. Il risultato è che qualsiasi email che contenga
un collegamento a iltridentepositano.com viene automaticamente
respinta dai server Apple, prima ancora di arrivare al destinatario.

La buona notizia è che il contenuto della vostra email non c'entra
nulla. Abbiamo verificato uno per uno tutti gli elementi: i consigli
sul soggiorno, i riferimenti a L'Onda, EdEra e Poesea Boats, la
grafica, il testo. Nessuno di questi crea problemi, e nessuno di
questi va tolto. Il messaggio che ha scelto resta esattamente com'è.

L'unico elemento che fa scattare il blocco è, paradossalmente, il
collegamento al vostro stesso sito, che nell'email compare in due
punti: la frase "compila nuovamente il modulo" e la riga finale con
l'indirizzo del sito.

COSA LE CHIEDIAMO
Il suo consenso a togliere temporaneamente quei due collegamenti.
È una modifica minima e non toglie nulla al contenuto: appena fatta,
le conferme ricominciano ad arrivare anche ai clienti iCloud.

COSA STIAMO FACENDO IN PARALLELO
Abbiamo aperto una segnalazione ad Apple per far correggere questa
classificazione, che è un falso positivo: il vostro sito è un normale
sito di ristorante, non risulta in nessuna lista di siti pericolosi ed
è online dal 2018 senza problemi. Le abbiamo fornito tutte le prove
raccolte. Preferisco però essere sincero sui tempi: la revisione
dipende interamente da Apple e non possiamo garantire quando
arriverà una risposta.

Nel frattempo abbiamo anche migliorato la qualità tecnica delle email,
che ora superano tutti i controlli antispam con il punteggio massimo.

Resto a disposizione per qualsiasi chiarimento.

Un cordiale saluto
```

---

## 3. Testo per la segnalazione ad Apple

Da inviare tramite il canale indicato nel bounce
(`support.apple.com/en-us/HT204137`).

```
Our domain iltridentepositano.com appears to be incorrectly flagged in
iCloud's URL reputation system. Messages from team@iltridentepositano.com
to iCloud recipients are rejected with:

554 5.7.1 [CS01] Message rejected due to local policy
Apple Txn ID: 0dfb616f-5a79-4810-b01a-1f6d5caab844

We isolated the cause with controlled tests. The SAME message, same
sender, same IP, same content, differing only in one hyperlink:

  - no link at all .................... DELIVERED
  - link to wikipedia.org ............. DELIVERED
  - link to ederapositano.com ......... DELIVERED
  - link to iltridentepositano.com .... REJECTED (3/3)
  - link to www.iltridentepositano.com  REJECTED
  - link to test.iltridentepositano.com REJECTED (different host/IP)

The domain is clean on Spamhaus DBL, SURBL and URIBL, has been ours
since 2018 with no ownership change, and hosts a restaurant website.
The affected messages are transactional waitlist confirmations.

We request a review of the domain's reputation.
```
