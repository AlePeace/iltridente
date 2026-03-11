"use client";
import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export const ReservationForm = () => {
  const t = useTranslations("reservationForm");
  const locale = useLocale();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Calcola la data minima (oggi) e massima (oggi + 14 giorni)
  useEffect(() => {
    const today = new Date();
    const min = new Date();
    min.setDate(today.getDate() + 14);

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setMinDate(formatDate(min));
    // Nessun maxDate: può prenotare qualsiasi data dopo i 14 giorni
  }, []);

  const handleDateChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setSelectedDate("");
      setErrors((prev) => {
        const { date, ...rest } = prev;
        return rest;
      });
      return;
    }

    // Controlla se la data è almeno 14 giorni da oggi
    if (value < minDate) {
      setSelectedDate("");
      e.target.value = "";
      setErrors((prev) => ({
        ...prev,
        date: "La prenotazione deve essere effettuata con almeno 14 giorni di anticipo",
      }));
      return;
    }

    setSelectedDate(value);
    setErrors((prev) => {
      const { date, ...rest } = prev;
      return rest;
    });
  };

  const validate = (data) => {
    const errs = {};
    if (!data.name?.trim()) errs.name = t("errorName");
    if (!data.surname?.trim()) errs.surname = t("errorSurname");
    if (!data.email?.trim()) errs.email = t("errorEmail");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = t("invalidEmail");
    if (!data.requestedService?.trim())
      errs.requestedService = t("errorRequestedService");

    // Validazione data: almeno 14 giorni da oggi
    if (data.date) {
      if (data.date < minDate) {
        errs.date = t("dateValidation");
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.formType = "prenotazione";
    data.locale = locale;

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

  const inputBaseClasses =
    "w-full border rounded-lg border-red py-3 pl-10 pr-3 focus:outline-none focus:border-[#A86F79] transition-all bg-transparent text-[#333] placeholder:text-[#bbb]";
  const inputBaseNoIconClasses =
    "w-full border border-red rounded-lg py-3 px-3 focus:outline-none focus:border-[#A86F79] transition-all bg-transparent text-[#333] placeholder:text-[#bbb]";
  const labelClasses = "block font-nunito font-semibold text-sm text-text mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";
  const iconClasses =
    "absolute left-2 top-1/2 -translate-y-1/2 text-red w-5 h-5";

  return (
    <div className="max-w-xl mx-auto px-6 py-10 bg-white border-4 border-red rounded-lg">
      {/* Titolo */}
      <h2 className="font-cinzel text-red text-2xl md:text-3xl mb-8 uppercase tracking-wider">
        {t("titleForm")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Honeypot */}
        <input
          type="text"
          name="honeypot"
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />

        {/* Hotel booking reference */}
        <div>
          <label htmlFor="hotelBookingRef" className={labelClasses}>
            {t("referenceReservations")}
          </label>
          <input
            type="text"
            name="hotelBookingRef"
            id="hotelBookingRef"
            className={inputBaseNoIconClasses}
          />
        </div>

        {/* Name + Surname */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClasses}>
              {t("name")} *
            </label>
            <div className="relative">
              <HiOutlineUser className={iconClasses} />
              <input
                type="text"
                name="name"
                id="name"
                required
                maxLength={100}
                className={`${inputBaseClasses} ${errors.name ? "border-red-500" : ""}`}
              />
            </div>
            {errors.name && <p className={errorClasses}>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="surname" className={labelClasses}>
              {t("surname")} *
            </label>
            <input
              type="text"
              name="surname"
              id="surname"
              required
              maxLength={100}
              className={`${inputBaseNoIconClasses} ${errors.surname ? "border-red-500" : ""}`}
            />
            {errors.surname && <p className={errorClasses}>{errors.surname}</p>}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className={labelClasses}>
              {t("email")} *
            </label>
            <div className="relative">
              <HiOutlineEnvelope className={iconClasses} />
              <input
                type="email"
                name="email"
                id="email"
                required
                className={`${inputBaseClasses} ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && <p className={errorClasses}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={labelClasses}>
              {t("phone")}
            </label>
            <div className="relative flex">
              <HiOutlinePhone className={iconClasses} />
              <select
                name="phonePrefix"
                className="border border-red rounded-l-lg pl-9 pr-2 py-3 bg-transparent text-[#333] focus:outline-none focus:border-[#A86F79] text-sm shrink-0"
                defaultValue="+39"
              >
                <option value="+39">🇮🇹 +39</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+41">🇨🇭 +41</option>
                <option value="+43">🇦🇹 +43</option>
                <option value="+32">🇧🇪 +32</option>
                <option value="+31">🇳🇱 +31</option>
                <option value="+351">🇵🇹 +351</option>
                <option value="+48">🇵🇱 +48</option>
                <option value="+7">🇷🇺 +7</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+86">🇨🇳 +86</option>
                <option value="+55">🇧🇷 +55</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+52">🇲🇽 +52</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <input
                type="tel"
                name="phone"
                id="phone"
                className={inputBaseClasses}
              />
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className={labelClasses}>
            {t("date")}
          </label>
          <div className="relative">
            <HiOutlineCalendarDays className={iconClasses} />
            <input
              type="date"
              name="date"
              id="date"
              min={minDate}
              value={selectedDate}
              onChange={handleDateChange}
              onKeyDown={(e) => e.preventDefault()}
              className={`${inputBaseClasses} ${errors.date ? "border-red-500" : ""}`}
            />
          </div>
        </div>

        {/* Requested service */}
        <div>
          <label htmlFor="requestedService" className={labelClasses}>
            {t("requestedService")} *
          </label>
          <select
            name="requestedService"
            id="requestedService"
            required
            defaultValue=""
            className={`${inputBaseNoIconClasses} ${errors.requestedService ? "border-red-500" : ""}`}
          >
            <option value="" disabled>
              {t("selectService")}
            </option>
            <option value="Pranzo">{t("lunch")}</option>
            <option value="Cena">{t("dinner")}</option>
          </select>
          {errors.requestedService && (
            <p className={errorClasses}>{errors.requestedService}</p>
          )}
        </div>

        {/* Preferred time + Number of adults */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredTime" className={labelClasses}>
              {t("preferredTime")}
            </label>
            <div className="relative">
              <HiOutlineClock className={iconClasses} />
              <input
                type="time"
                name="preferredTime"
                id="preferredTime"
                className={inputBaseClasses}
              />
            </div>
          </div>
          <div>
            <label htmlFor="numberOfAdults" className={labelClasses}>
              {t("numberOfAdults")} *
            </label>
            <select
              name="numberOfAdults"
              id="numberOfAdults"
              required
              defaultValue=""
              className={`${inputBaseNoIconClasses} ${errors.numberOfAdults ? "border-red-500" : ""}`}
            >
              <option value="" disabled>
                {t("selectNumberOfAdults")}
              </option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional info or comments */}
        <div>
          <label htmlFor="additionalInfo" className={labelClasses}>
            {t("additionalInfoOrComments")}
          </label>
          <textarea
            name="additionalInfo"
            id="additionalInfo"
            rows={3}
            placeholder={t("allergiesIntolerances")}
            className={`${inputBaseNoIconClasses} resize-vertical border rounded-md p-3`}
          />
        </div>

        {/* Disclaimer */}
        <div className="bg-cardspranzo/50 border-2 border-cardspranzo rounded-md p-4 text-center">
          <p className="text-sm text-text leading-relaxed">{t("disclaimer")}</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red text-white px-6 py-4 rounded-md 
                     hover:bg-[#8a5a63] transition-colors duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-normal tracking-[0.2em] uppercase text-sm"
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
              {t("sending")}
            </span>
          ) : (
            <span>{t("submit")}</span>
          )}
        </button>

        {/* Privacy */}
        <p className="text-center text-sm text-red">
          {t("disclaimerPrivacy1")}
          <br />
          {t("disclaimerPrivacy2")}{" "}
          <a href="/privacy-policy" className="underline hover:text-[#8a5a63]">
            privacy policy
          </a>
          .
        </p>

        {/* Status messages */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700 text-sm text-center">
            ✅ {t("success")}
          </div>
        )}
        {status && status !== "success" && status !== "" && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-sm text-center">
            ❌{" "}
            {typeof status === "string" && status !== "error"
              ? status
              : t("error")}
          </div>
        )}
      </form>
    </div>
  );
};
