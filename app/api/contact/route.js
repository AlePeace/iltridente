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
function buildEmailHTML(formType, fields) {
  const headerText =
    formType === "prenotazione"
      ? "Nuova Richiesta di Prenotazione"
      : "Nuovo Messaggio";

  // Costruisci le righe della tabella dinamicamente
  const rows = fields
    .filter((f) => f.value)
    .map(
      (f) => `
      <tr>
        <td style="padding: 10px 0; font-weight: bold; color: #A86F79; width: 160px; vertical-align: top;">${f.label}:</td>
        <td style="padding: 10px 0;">${f.value}</td>
      </tr>`,
    )
    .join("");

  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #A86F79; padding: 20px; text-align: center;">
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
    header_contact: "Nuovo Messaggio",
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
    header_contact: "New Message",
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

      subject = `🍽️ ${formatDate(sanitize(body.date?.trim()))} ${sanitize(body.requestedService?.trim())} ${sanitize(name.trim())} ${sanitize(body.surname?.trim())} (HP)`;
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

    // Email a te
    await transporter.sendMail({
      from: `"Il Tridente Positano" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email.trim(),
      subject,
      html: buildEmailHTML(formType, fields),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Errore invio email:", error);
    return Response.json(
      { error: "Errore nell'invio del messaggio. Riprova più tardi." },
      { status: 500 },
    );
  }
}
