import nodemailer from "nodemailer";

// Rate limiting semplice in-memory
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 1; // max 3 invii per minuto per IP

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

// Validazione email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitizzazione input
function sanitize(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Troppi invii. Riprova tra un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message, honeypot } = body;

    // Honeypot anti-bot: se compilato, è un bot
    if (honeypot) {
      // Rispondi con successo falso per ingannare il bot
      return Response.json({ success: true });
    }

    // Validazione
    if (!name || !email || !message) {
      return Response.json(
        { error: "I campi Nome, Email e Messaggio sono obbligatori." },
        { status: 400 }
      );
    }

    if (name.length > 100 || message.length > 5000) {
      return Response.json(
        { error: "Input troppo lungo." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { error: "Indirizzo email non valido." },
        { status: 400 }
      );
    }

    // Sanitizza gli input
    const safeName = sanitize(name.trim());
    const safeEmail = sanitize(email.trim());
    const safePhone = phone ? sanitize(phone.trim()) : "Non specificato";
    const safeMessage = sanitize(message.trim());

    // Configura il trasporto SMTP per SiteGround
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true per porta 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email che ricevi tu
    await transporter.sendMail({
      from: `"Il Tridente - Sito Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: safeEmail,
      subject: `📩 Nuovo messaggio da ${safeName}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #A86F79; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Il Tridente</h1>
            <p style="color: #f0d0d6; margin: 5px 0 0;">Nuovo messaggio dal sito</p>
          </div>
          <div style="padding: 30px; background-color: #faf8f8; border: 1px solid #e8d5d8;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #A86F79; width: 120px;">Nome:</td>
                <td style="padding: 10px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #A86F79;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #A86F79;">Telefono:</td>
                <td style="padding: 10px 0;">${safePhone}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e8d5d8; margin: 20px 0;" />
            <p style="font-weight: bold; color: #A86F79;">Messaggio:</p>
            <p style="line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          <div style="background-color: #f0e8ea; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            Messaggio inviato dal sito web Il Tridente
          </div>
        </div>
      `,
    });

    // Email di conferma al cliente (opzionale ma professionale)
    await transporter.sendMail({
      from: `"Il Tridente" <${process.env.SMTP_USER}>`,
      to: safeEmail,
      subject: `Grazie per averci contattato, ${safeName}!`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #A86F79; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Il Tridente</h1>
          </div>
          <div style="padding: 30px; background-color: #faf8f8; border: 1px solid #e8d5d8;">
            <p>Gentile <strong>${safeName}</strong>,</p>
            <p>Grazie per averci contattato! Abbiamo ricevuto il tuo messaggio e ti risponderemo il prima possibile.</p>
            <hr style="border: none; border-top: 1px solid #e8d5d8; margin: 20px 0;" />
            <p style="font-size: 14px; color: #888;">Riepilogo del tuo messaggio:</p>
            <p style="font-style: italic; color: #666;">"${safeMessage}"</p>
          </div>
          <div style="background-color: #f0e8ea; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            Il Tridente - Questa è un'email automatica, non rispondere a questo indirizzo.
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Errore invio email:", error);
    return Response.json(
      { error: "Errore nell'invio del messaggio. Riprova più tardi." },
      { status: 500 }
    );
  }
}