"use client";
import { useState } from "react";

export const ContactForm = () => {
  const [status, setStatus] = useState(""); // "success" | "error" | ""
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = "Il nome è obbligatorio";
    if (!data.email.trim()) errs.email = "L'email è obbligatoria";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Email non valida";
    if (!data.message.trim()) errs.message = "Il messaggio è obbligatorio";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validazione client-side
    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus(result.error || "error");
      }
    } catch {
      setStatus("error");
    }

    setLoading(false);
  };

  const inputClasses =
    "w-full border border-[#d4b5ba] rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-[#A86F79] focus:border-transparent transition-all bg-white/80";
  const errorClasses = "text-red-500 text-xs mt-1";

  return (
    <div className="max-w-xl mx-auto p-8 pt-20">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Honeypot - invisibile agli utenti, visibile ai bot */}
        <input
          type="text"
          name="honeypot"
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-[#5a3d42]"
          >
            Nome *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            maxLength={100}
            className={`${inputClasses} ${errors.name ? "border-red-500" : ""}`}
            placeholder="Il tuo nome"
          />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[#5a3d42]"
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className={`${inputClasses} ${errors.email ? "border-red-500" : ""}`}
            placeholder="la.tua@email.com"
          />
          {errors.email && <p className={errorClasses}>{errors.email}</p>}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-[#5a3d42]"
          >
            Telefono
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className={inputClasses}
            placeholder="+39 333 1234567"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-[#5a3d42]"
          >
            Messaggio *
          </label>
          <textarea
            name="message"
            id="message"
            rows={5}
            required
            maxLength={5000}
            className={`${inputClasses} resize-vertical ${errors.message ? "border-red-500" : ""}`}
            placeholder="Scrivi qui il tuo messaggio..."
          />
          {errors.message && <p className={errorClasses}>{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#A86F79] text-white px-6 py-3 rounded-md 
                     hover:bg-[#8a5a63] transition-colors duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-semibold tracking-wide uppercase text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Invio in corso...
            </span>
          ) : (
            "Invia Messaggio"
          )}
        </button>

        {/* Messaggi di stato */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700 text-sm text-center">
            ✅ Messaggio inviato con successo! Ti risponderemo al più presto.
          </div>
        )}
        {status && status !== "success" && status !== "" && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-sm text-center">
            ❌{" "}
            {typeof status === "string" && status !== "error"
              ? status
              : "Errore nell'invio. Riprova più tardi."}
          </div>
        )}
      </form>
    </div>
  );
};
