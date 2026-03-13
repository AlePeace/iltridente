import nodemailer from "nodemailer";

// Rate limiting semplice in-memory
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 1;

function isRateLimited(ip) {
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  const recentRequests = requests.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}-${month}-${year}`;
}

// Genera l'HTML dell'email in base al tipo di form
function buildEmailHTML(headerText, fields, accentColor = "#A86F79") {
  // Costruisci le righe della tabella dinamicamente
  const rows = fields
    .filter((f) => f.value)
    .map(
      (f) => `
      <tr>
        <td style="padding: 10px 0; font-weight: bold; color: ${accentColor}; width: 160px; vertical-align: top;">${f.label}:</td>
        <td style="padding: 10px 0;">${f.value}</td>
      </tr>`,
    )
    .join("");

  return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: ${accentColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Il Tridente</h1>
        <p style="color: #f0d0d6; margin: 5px 0 0;">${headerText}</p>
      </div>
      <div style="padding: 30px; background-color: #faf8f8; border: 1px solid #e8d5d8;">
        <table style="width: 100%; border-collapse: collapse;">
          ${rows}
        </table>
      </div>
      <div style="background-color: #f0e8ea; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        Messaggio inviato dal sito web Il Tridente
      </div>
    </div>
  `;
}
function buildWaitlistConfirmHTML(
  locale,
  name,
  service,
  formattedDate,
  accentColor = "#5B7FA6",
) {
  const isEn = locale === "en";

  const content = isEn
    ? `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for filling in this form! You have been placed on the waitlist.</p>
    <p>We are sorry you have not found availability on your preferred date and time. We will contact you by phone or email in case there is availability for <strong>${service}</strong> on <strong>${formattedDate}</strong>.</p>
    <p>If you would like to place yourself on the waitlist for more than one date or service, please fill in the website form again <a href="https://iltridentepositano.com" style="color: ${accentColor};">here</a>.</p>
    <p><strong>Make your stay on the Amalfi Coast memorable:</strong></p>
    <ul style="padding-left: 20px;">
      <li style="margin-bottom: 12px;">Take some time to relax at <strong>L'Onda Beauty Centre</strong>! With a wide range of treatments and massages available, let yourself be truly pampered. You can view the full list of treatments and book online on <a href="https://www.londapositano.com" style="color: ${accentColor};">www.londapositano.com</a> – or contact us by email at <a href="mailto:info@londapositano.com" style="color: ${accentColor};">info@londapositano.com</a>. The perfect escape from the summer heat!</li>
      <li style="margin-bottom: 12px;">As anyone from Positano would say: nothing beats a boat tour! There are several boat companies by the main beach in Positano, but if you'd like to book with instant confirmation, check out <a href="https://www.poesea.it" style="color: ${accentColor};"><strong>Poesea Boats</strong></a>: a reliable company with great boat and tour options.</li>
    </ul>
    <p>Many thanks for your patience, and we hope to meet you at Il Tridente soon!</p>
    <p>Best Regards,<br><strong>Il Tridente team</strong></p>
    <p style="font-size: 13px; color: #888;">
      <a href="https://iltridentepositano.com" style="color: ${accentColor};">iltridentepositano.com</a><br>
      @hotelposeidonpositano
    </p>
  `
    : `
    <p>Caro/a <strong>${name}</strong>,</p>
    <p>Grazie per aver compilato il modulo! Sei stato inserito nella lista d'attesa.</p>
    <p>Ci dispiace che non abbia trovato disponibilità nella data e nell'orario preferiti. Ti contatteremo per telefono o email nel caso si liberasse disponibilità per <strong>${service}</strong> in data <strong>${formattedDate}</strong>.</p>
    <p>Se desideri iscriverti alla lista d'attesa per più date o servizi, compila nuovamente il modulo sul sito <a href="https://iltridentepositano.com" style="color: ${accentColor};">qui</a>.</p>
    <p><strong>Rendi indimenticabile il tuo soggiorno sulla Costiera Amalfitana:</strong></p>
    <ul style="padding-left: 20px;">
      <li style="margin-bottom: 12px;">Prenditi del tempo per rilassarti all'<strong>L'Onda Beauty Centre</strong>! Con un'ampia gamma di trattamenti e massaggi, lasciati coccolare. Puoi consultare l'elenco completo e prenotare online su <a href="https://www.londapositano.com" style="color: ${accentColor};">www.londapositano.com</a> – oppure scrivici a <a href="mailto:info@londapositano.com" style="color: ${accentColor};">info@londapositano.com</a>. La fuga perfetta dal caldo estivo!</li>
      <li style="margin-bottom: 12px;">Come direbbero i positanesi: niente batte un giro in barca! Ci sono diverse compagnie sulla spiaggia principale, ma per prenotare con conferma immediata dai un'occhiata a <a href="https://www.poesea.it" style="color: ${accentColor};"><strong>Poesea Boats</strong></a>: un'azienda affidabile con ottime opzioni di barche e tour.</li>
    </ul>
    <p>Grazie mille per la pazienza, speriamo di vederti presto al Tridente!</p>
    <p>Cordiali saluti,<br><strong>Il team del Tridente</strong></p>
    <p style="font-size: 13px; color: #888;">
      <a href="https://iltridentepositano.com" style="color: ${accentColor};">iltridentepositano.com</a><br>
      @hotelposeidonpositano
    </p>
  `;

  return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: ${accentColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Il Tridente</h1>
        <p style="color: #f0d0d6; margin: 5px 0 0;">${isEn ? "Waitlist Confirmation" : "Conferma Lista d'attesa"}</p>
      </div>
      <div style="padding: 30px; background-color: #faf8f8; border: 1px solid #e8d5d8; line-height: 1.7; color: #333;">
        ${content}
      </div>
      <div style="background-color: #f0e8ea; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        Messaggio inviato dal sito web Il Tridente
      </div>
    </div>
  `;
}

const emailLabels = {
  it: {
    bookingRef: "Riferimento Hotel",
    name: "Nome",
    email: "Email",
    phone: "Telefono",
    date: "Data",
    service: "Servizio Richiesto",
    time: "Orario",
    adults: "Numero Adulti",
    info: "Info Aggiuntive",
    message: "Messaggio",
    header_booking: "Nuova Richiesta di Prenotazione",
    header_waitlist: "Nuova Richiesta Lista d'attesa",
    header_contact: "Nuovo Messaggio",
    header_event: "Richiesta Evento",
    event_request: "Richiesta Evento",
    eventType: "Tipologia Evento",
    guests: "Numero Ospiti",
    header_giftcard: "Richiesta Gift Card",
    giftcardHow: "Come vuoi riceverla",
    giftcardDateUse: "Date di utilizzo preferite",
  },
  en: {
    bookingRef: "Hotel Reference",
    name: "Name",
    email: "Email",
    phone: "Phone",
    date: "Date",
    service: "Requested Service",
    time: "Time",
    adults: "Number of Adults",
    info: "Additional Info",
    message: "Message",
    header_booking: "New Booking Request",
    header_waitlist: "New Waitlist Request",
    header_event: "Event Request",
    header_contact: "New Message",
    event_request: "Event Request",
    eventType: "Event Type",
    guests: "Number of Guests",
    header_giftcard: "Gift Card Request",
    giftcardHow: "How would you like to receive it",
    giftcardDateUse: "Preferred use dates",
  },
};

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Troppi invii. Riprova tra un minuto." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { honeypot, formType = "contatto", locale = "it" } = body;
    const l = emailLabels[locale] || emailLabels["it"]; // fallback a italiano

    // Honeypot anti-bot
    if (honeypot) {
      return Response.json({ success: true });
    }

    // Validazione comune
    const name = body.name || "";
    const email = body.email || "";
    const phone = [body.phonePrefix, body.phone]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!name.trim() || !email.trim()) {
      return Response.json(
        { error: "Nome ed Email sono obbligatori." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email.trim())) {
      return Response.json(
        { error: "Indirizzo email non valido." },
        { status: 400 },
      );
    }

    // Prepara i campi in base al tipo di form
    let fields = [];
    let subject = "";

    if (formType === "prenotazione") {
      // Validazione specifica prenotazione
      if (!body.requestedService?.trim()) {
        return Response.json(
          { error: "Il servizio richiesto è obbligatorio." },
          { status: 400 },
        );
      }

      subject = `🍽️ ${formatDate(sanitize(body.date?.trim()))} ${sanitize(body.requestedService?.trim())} - ${sanitize(name.trim())} ${sanitize(body.surname?.trim())} (HP)`;
      fields = [
        {
          label: l.bookingRef,
          value: sanitize(body.hotelBookingRef?.trim()),
        },
        {
          label: l.name,
          value:
            `${sanitize(body.name?.trim())} ${sanitize(body.surname?.trim())}`.trim(),
        },
        { label: l.email, value: sanitize(email.trim()) },
        { label: l.phone, value: sanitize(phone) },
        { label: l.date, value: formatDate(sanitize(body.date?.trim())) },
        {
          label: l.service,
          value: sanitize(body.requestedService?.trim()),
        },
        {
          label: l.time,
          value: sanitize(body.preferredTime?.trim()),
        },
        {
          label: l.adults,
          value: sanitize(body.numberOfAdults?.toString()),
        },
        {
          label: l.info,
          value: sanitize(body.additionalInfo?.trim()),
        },
      ];
    } else if (formType === "event") {
      subject = `🎉 ${formatDate(sanitize(body.date?.trim()))} ${l.event_request} - ${sanitize(name.trim())} ${sanitize(body.surname?.trim())}`;
      fields = [
        {
          label: l.name,
          value:
            `${sanitize(body.name?.trim())} ${sanitize(body.surname?.trim())}`.trim(),
        },
        { label: l.email, value: sanitize(email.trim()) },
        { label: l.phone, value: sanitize(phone) },
        { label: l.date, value: formatDate(sanitize(body.date?.trim())) },
        { label: l.eventType, value: sanitize(body.tipologiaEvento?.trim()) }, // fix
        { label: l.guests, value: sanitize(body.numberOfGuests?.toString()) }, // fix
        { label: l.info, value: sanitize(body.additionalInfo?.trim()) }, // fix
      ];
    } else if (formType === "waitlist") {
      if (!body.requestedService?.trim()) {
        return Response.json(
          { error: "Il servizio richiesto è obbligatorio." },
          { status: 400 },
        );
      }

      subject = `⏳ ${formatDate(sanitize(body.date?.trim()))} ${sanitize(body.requestedService?.trim())} - ${sanitize(name.trim())} ${sanitize(body.surname?.trim())} - WAITLIST`;
      fields = [
        {
          label: l.name,
          value:
            `${sanitize(body.name?.trim())} ${sanitize(body.surname?.trim())}`.trim(),
        },
        { label: l.email, value: sanitize(email.trim()) },
        { label: l.phone, value: sanitize(phone) },
        { label: l.date, value: formatDate(sanitize(body.date?.trim())) },
        { label: l.service, value: sanitize(body.requestedService?.trim()) },
        { label: l.time, value: sanitize(body.preferredTime?.trim()) },
        { label: l.adults, value: sanitize(body.numberOfAdults?.toString()) },
        { label: l.info, value: sanitize(body.additionalInfo?.trim()) },
      ];
    } else if (formType === "giftCard") {
      subject = `🎁 ${formatDate(sanitize(body.date?.trim()))} ${l.event_request} - ${sanitize(name.trim())} ${sanitize(body.surname?.trim())}`;
      fields = [
        {
          label: l.name,
          value:
            `${sanitize(body.name?.trim())} ${sanitize(body.surname?.trim())}`.trim(),
        },
        { label: l.email, value: sanitize(email.trim()) },
        { label: l.phone, value: sanitize(phone) },
        { label: l.date, value: formatDate(sanitize(body.date?.trim())) },
        { label: l.giftcardHow, value: sanitize(body.how?.trim()) },
        {
          label: l.giftcardDateUse,
          value: sanitize(body.dateUseGiftCards?.trim()),
        },
        { label: l.info, value: sanitize(body.additionalInfo?.trim()) },
      ];
    } else {
      // Form contatto generico
      if (!body.message?.trim()) {
        return Response.json(
          { error: "Il messaggio è obbligatorio." },
          { status: 400 },
        );
      }

      subject = `📩 ${l.header_contact} ${sanitize(name.trim())}`;
      fields = [
        { label: l.name, value: sanitize(name.trim()) },
        { label: l.email, value: sanitize(email.trim()) },
        { label: l.phone, value: sanitize(body.phone?.trim()) },
        { label: l.message, value: sanitize(body.message?.trim()) },
      ];
    }

    // Configura SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const emailHeader =
      formType === "prenotazione"
        ? l.header_booking
        : formType === "event"
          ? l.header_event
          : formType === "waitlist"
            ? l.header_waitlist
            : formType === "giftCard"
              ? l.header_giftcard
              : l.header_contact;
    const accentColor =
      formType === "event"
        ? "#0080ad"
        : formType === "waitlist"
          ? "#7a6f6c"
          : formType === "giftCard"
            ? "#F59E0B"
            : "#a61932";

    // Email a te
    await transporter.sendMail({
      from: `"Il Tridente Positano" <${process.env.SMTP_USER}>`,
      to:
        formType === "waitlist"
          ? process.env.WAITLIST_EMAIL || process.env.CONTACT_EMAIL
          : process.env.CONTACT_EMAIL,
      replyTo: email.trim(),
      subject,
      html: buildEmailHTML(emailHeader, fields, accentColor),
    });

    if (formType === "waitlist") {
      const transporter2 = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.WAITLIST_EMAIL,
          pass: process.env.WAITLIST_EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
      });
      const confirmSubject =
        locale === "en"
          ? "Il Tridente, Positano - You have been placed on the waitlist!"
          : "Il Tridente, Positano - Sei stato inserito nella lista d'attesa!";

      const confirmHTML = buildWaitlistConfirmHTML(
        locale,
        sanitize(`${body.name?.trim()} ${body.surname?.trim()}`.trim()),
        sanitize(body.requestedService?.trim()),
        formatDate(sanitize(body.date?.trim())),
        accentColor,
      );

      await transporter2.sendMail({
        from: `"Il Tridente Positano" <${process.env.WAITLIST_EMAIL}>`,
        to: email.trim(),
        subject: confirmSubject,
        html: confirmHTML,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Errore invio email:", error);
    return Response.json(
      { error: "Errore nell'invio del messaggio. Riprova più tardi." },
      { status: 500 },
    );
  }
}
