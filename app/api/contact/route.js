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

function buildConfirmationHTML(formType, name) {
  const messageText =
    formType === "prenotazione"
      ? "Abbiamo ricevuto la tua richiesta di prenotazione. Ti contatteremo al più presto per confermare la disponibilità."
      : "Abbiamo ricevuto il tuo messaggio e ti risponderemo il prima possibile.";

  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #A86F79; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Il Tridente</h1>
      </div>
      <div style="padding: 30px; background-color: #faf8f8; border: 1px solid #e8d5d8;">
        <p>Gentile <strong>${name}</strong>,</p>
        <p>${messageText}</p>
        <hr style="border: none; border-top: 1px solid #e8d5d8; margin: 20px 0;" />
        <p style="font-size: 13px; color: #999;">
          Si prega di notare che questa è solo una richiesta e che nessuna prenotazione è
          confermata fino a una risposta positiva da parte de Il Tridente.
        </p>
      </div>
      <div style="background-color: #f0e8ea; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        Il Tridente - Questa è un'email automatica, non rispondere a questo indirizzo.
      </div>
    </div>
  `;
}

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
    const { honeypot, formType = "contatto" } = body;

    // Honeypot anti-bot
    if (honeypot) {
      return Response.json({ success: true });
    }

    // Validazione comune
    const name = body.name || "";
    const email = body.email || "";

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

      subject = `🍽️ ${sanitize(body.date?.trim())} ${sanitize(body.requestedService?.trim())} ${sanitize(name.trim())} ${sanitize(body.surname?.trim())} (HP)`;
      fields = [
        {
          label: "Riferimento Hotel",
          value: sanitize(body.hotelBookingRef?.trim()),
        },
        { label: "Nome", value: `${sanitize(body.name?.trim())} ${sanitize(body.surname?.trim())}`.trim() },
        { label: "Email", value: sanitize(email.trim()) },
        { label: "Telefono", value: sanitize(body.phone?.trim()) },
        { label: "Data", value: sanitize(body.date?.trim()) },
        {
          label: "Servizio Richiesto",
          value: sanitize(body.requestedService?.trim()),
        },
        {
          label: "Orario Preferito",
          value: sanitize(body.preferredTime?.trim()),
        },
        {
          label: "Numero Adulti",
          value: sanitize(body.numberOfAdults?.toString()),
        },
        {
          label: "Info Aggiuntive",
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

      subject = `📩 Nuovo messaggio da ${sanitize(name.trim())}`;
      fields = [
        { label: "Nome", value: sanitize(name.trim()) },
        { label: "Email", value: sanitize(email.trim()) },
        { label: "Telefono", value: sanitize(body.phone?.trim()) },
        { label: "Messaggio", value: sanitize(body.message?.trim()) },
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
      from: `"Il Tridente - Sito Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email.trim(),
      subject,
      html: buildEmailHTML(formType, fields),
    });

    // Email di conferma al cliente
    await transporter.sendMail({
      from: `"Il Tridente" <${process.env.SMTP_USER}>`,
      to: email.trim(),
      subject: `Grazie per averci contattato, ${sanitize(name.trim())}!`,
      html: buildConfirmationHTML(formType, sanitize(name.trim())),
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
